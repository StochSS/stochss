package com.google.appengine.api.datastore;

import static com.google.appengine.api.datastore.CacheValueUtil.createCacheValue;
import static com.google.appengine.api.datastore.CacheValueUtil.isDatastoreOpState;
import static com.google.appengine.api.datastore.EntityCacheTranslator.fromMemcacheIdentifiableValue;
import static com.google.appengine.api.datastore.EntityCacheTranslator.fromMemcacheKey;
import static com.google.appengine.api.datastore.EntityCacheTranslator.toMemcacheCasValues;
import static com.google.appengine.api.datastore.EntityCacheTranslator.toMemcacheKey;
import static com.google.appengine.api.datastore.EntityCacheTranslator.toMemcacheValue;
import static com.google.appengine.api.datastore.FutureHelper.quietGet;
import static com.google.common.base.Preconditions.checkArgument;
import static com.google.common.base.Preconditions.checkNotNull;

import com.google.appengine.api.memcache.Expiration;
import com.google.appengine.api.memcache.MemcacheService.CasValues;
import com.google.appengine.api.memcache.MemcacheService.IdentifiableValue;
import com.google.appengine.api.memcache.MemcacheService.SetPolicy;
import com.google.appengine.api.utils.FutureWrapper;
import com.google.apphosting.datastore.EntityStorage.CacheValue;
import com.google.apphosting.datastore.EntityStorage.CacheValue.State;
import com.google.common.base.Predicate;
import com.google.common.collect.Lists;
import com.google.common.collect.Maps;
import com.google.common.collect.Sets;
import com.google.storage.onestore.v3.OnestoreEntity.EntityProto;

import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.Future;

/**
 * A datastore entity cache backed by memcache.
 *
 */
class EntityCache {

  static final double EXTRA_STATE_EXPIRATION_SECS = 5;

  private final MemcacheServiceHelper memcacheServiceHelper;
  private final double datastoreRpcDeadlineSecs;

  /**
   * Constructs an {@link EntityCache} object.
   *
   * @param memcacheServiceHelper the {@link MemcacheServiceHelper} to use for all memcache
   *     operations.
   * @param datastoreRpcDeadlineSecs the datastore rpc deadline in seconds.
   * @throws IllegalArgumentException if the specified {@code datastoreRpcDeadlineSecs} is less
   *     than or equal to zero.
   */
  public EntityCache(MemcacheServiceHelper memcacheServiceHelper, double datastoreRpcDeadlineSecs) {
    checkArgument(datastoreRpcDeadlineSecs > 0,
        "The datastoreRpcDeadlineSecs argument must be greater than 0");
    this.memcacheServiceHelper = memcacheServiceHelper;
    this.datastoreRpcDeadlineSecs = datastoreRpcDeadlineSecs;
  }

  /**
   * Sets the cache value for each key specified to the provided datastore operation {@code state}
   * if the update satisfies the cache update {@code policy}.
   * <p>
   * The cache values for the specified {@code state} will expire with an expiration time
   * equal to the datastore rpc deadline.
   *
   * @param keys the keys to update in the cache.
   * @param state the state to store in the cache for each key.
   * @param policy what to do if the cache entry is or is not already present
   * @return the keys successfully updated in the cache.  Keys in {@code keys} may not be
   *     in the returned set because of the {@code policy} regarding pre-existing entries.
   * @throws IllegalArgumentException if the {@code state} is not {@link State#READ_IN_PROGRESS} or
   *     {@link State#MUTATION_IN_PROGRESS}.
   */
  public Future<Set<Key>> putStateAsync(Collection<Key> keys, State state, SetPolicy policy) {
    checkArgument(isDatastoreOpState(state),
        "The state argument is not for a datastore operation: " + state);
    Map<String, byte[]> memcacheValues = Maps.newHashMapWithExpectedSize(keys.size());
    byte[] stateMemcacheValue = toMemcacheValue(createCacheValue(state, null));
    for (Key key : keys) {
      memcacheValues.put(toMemcacheKey(key), stateMemcacheValue);
    }
    return translateMemcacheKeySetResult(
        memcacheServiceHelper.put(memcacheValues, policy, computeDatastoreOpStateExpiration(0)));
  }

  /**
   * Sets the cache value for each key specified to the provided {@code state} if the update
   * satisfies the cache update {@code policy}, and returns an {@link IdentifiableCacheValue} object
   * for each successful update.
   * <p>
   * The cache values for the specified {@code state} will expire with an expiration time
   * equal to the datastore rpc deadline.
   *
   * @param keys the keys to update in the cache.
   * @param state the state to store in the cache for each key.
   * @param policy what to do if the cache entry is or is not already present
   * @return a mapping from keys to a {@link IdentifiableCacheValue} objects for each state
   *     for every key successfully updated in the cache. Keys in {@code keys} may not be
   *     in the returned map because of the {@code policy} regarding pre-existing entries.
   * @throws IllegalArgumentException if the {@code state} is not {@link State#READ_IN_PROGRESS} or
   *     {@link State#MUTATION_IN_PROGRESS}.
   */
  public Map<Key, IdentifiableCacheValue> putStateIdentifiable(Collection<Key> keys,
      final State state, SetPolicy policy) {
    checkArgument(isDatastoreOpState(state),
        "The state argument is not for a datastore operation: " + state);
    Map<String, byte[]> memcacheValues = Maps.newHashMapWithExpectedSize(keys.size());
    byte[] stateMemcacheValue = toMemcacheValue(createCacheValue(state, null));
    for (Key key : keys) {
      memcacheValues.put(toMemcacheKey(key), stateMemcacheValue);
    }
    Set<String> keysPut = quietGet(
        memcacheServiceHelper.put(memcacheValues, policy, computeDatastoreOpStateExpiration(2)));
    Predicate<CacheValue> validateState = new Predicate<CacheValue>() {
      @Override
      public boolean apply(CacheValue value) {
        return value.getStateEnum() == state;
      }
    };
    return quietGet(
        getIdentifiableHelper(keysPut, validateState));
  }

  /**
   * Puts the entities specified into the cache if the cache update {@code policy} is satisfied.
   *
   * @param entityValues the key to entity mappings to add to the cache. {@code null} values can
   *     not be used for the entity values.
   * @param policy what to do if the cache entry is or is not already present
   * @return the keys successfully updated in the cache.  Keys in {@code entityValues} may not be
   *     in the returned set because of the {@code policy} regarding pre-existing entries.
   */
  public Future<Set<Key>> putEntitiesAsync(Map<Key, EntityProto> entityValues, SetPolicy policy) {
    Map<String, byte[]> memcacheValues = Maps.newHashMapWithExpectedSize(entityValues.size());
    for (Map.Entry<Key, EntityProto> entityValueEntry : entityValues.entrySet()) {
      EntityProto entity =
          checkNotNull(entityValueEntry.getValue(), "The entity value can not be null\n");
      memcacheValues.put(toMemcacheKey(entityValueEntry.getKey()),
          toMemcacheValue(createCacheValue(State.ENTITY, entity)));
    }
    return translateMemcacheKeySetResult(
        memcacheServiceHelper.put(memcacheValues, policy));
  }

  /**
   * Atomically stores the new value of each {@link CasCacheValues} object in the {@code values}
   * map if no other value has been stored in the cache since each {@code CasValues} object's old
   * value was retrieved and if the old value is still present in the cache.
   *
   * @param values the key to {@code CasCacheValues} mappings to compare and swap.
   * @return the set of keys for which the new value was stored.
   */
  public Future<Set<Key>> putIfUntouchedAsync(Map<Key, CasCacheValues> values) {
    Map<String, CasValues> memcacheValues = Maps.newHashMapWithExpectedSize(values.size());
    for (Map.Entry<Key, CasCacheValues> valueEntry : values.entrySet()) {
      memcacheValues.put(toMemcacheKey(valueEntry.getKey()),
          toMemcacheCasValues(valueEntry.getValue()));
    }
    return translateMemcacheKeySetResult(
        memcacheServiceHelper.putIfUntouched(memcacheValues));
  }

  /**
   * Fetches previously-stored cache values and encapsulates them in an
   * {@link IdentifiableCacheValue} object.
   *
   * @param keys a collection of keys for which values should be retrieved
   * @return a mapping from keys to values of any entries found. If a requested
   *     key is not found in the cache the key will not be in the returned {@link Map}.
   */
  public Future<Map<Key, IdentifiableCacheValue>> getIdentifiableAsync(Collection<Key> keys) {
    List<String> memcacheKeys = Lists.newArrayListWithExpectedSize(keys.size());
    for (Key key : keys) {
      memcacheKeys.add(toMemcacheKey(key));
    }
    return getIdentifiableHelper(memcacheKeys, null);
  }

  /**
   * Invokes {@link MemcacheServiceHelper#getIdentifiable} and post-processes the results
   * to remove EMPTY cache values and values that are filtered by the {@code valueFilter}.
   *
   * @param memcacheKeys a collection of memcache keys for which values should be retrieved.
   * @param valueFilter an optional predicate to filter the fetched values.
   * @return a mapping from keys to values of any entries found. If a requested
   *     key is not found in the cache or the value has been filtered the key will not be in
   *     the returned {@link Map}.
   */
  private Future<Map<Key, IdentifiableCacheValue>> getIdentifiableHelper(
      Collection<String> memcacheKeys, final Predicate<CacheValue> valueFilter) {
    Future<Map<String, IdentifiableValue>> getResults =
        memcacheServiceHelper.getIdentifiable(memcacheKeys);
    return new FutureWrapper<Map<String, IdentifiableValue>, Map<Key, IdentifiableCacheValue>>(
        getResults) {

      @Override
      protected Map<Key, IdentifiableCacheValue> wrap(
          Map<String, IdentifiableValue> memcacheResults) throws Exception {
        Map<Key, IdentifiableCacheValue> results =
            Maps.newHashMapWithExpectedSize(memcacheResults.size());
        for (Map.Entry<String, IdentifiableValue> memcacheResult : memcacheResults.entrySet()) {
          IdentifiableCacheValue identifiableCacheValue =
              fromMemcacheIdentifiableValue(memcacheResult.getValue());
          if (identifiableCacheValue == null) {
            continue;
          }
          CacheValue cacheValue = identifiableCacheValue.getValue();
          if ((valueFilter != null) && !valueFilter.apply(cacheValue)) {
            continue;
          }
          results.put(fromMemcacheKey(memcacheResult.getKey()), identifiableCacheValue);
        }
        return results;
      }

      @Override
      protected Throwable convertException(Throwable cause) {
        return cause;
      }
    };
  }

  /**
   * Atomically deletes cache entries for each {@link IdentifiableCacheValue} object in the
   * {@code values} map if no other value has been stored in the cache since the
   * {@code IdentifiableCacheValue} object was retrieved and if the cache value is still present
   * in the cache.
   *
   * @param values the key to {@code CasCacheValues} mappings to compare and swap.
   * @return the set of keys for which the cache entries were deleted.
   */
  public Future<Set<Key>> evictIfUntouchedAsync(Map<Key, IdentifiableCacheValue> values) {
    Map<String, CasValues> memcacheValues = Maps.newHashMapWithExpectedSize(values.size());
    for (Map.Entry<Key, IdentifiableCacheValue> valueEntry : values.entrySet()) {
      CasCacheValues casCacheValue = new CasCacheValues(valueEntry.getValue(), null);
      memcacheValues.put(toMemcacheKey(valueEntry.getKey()),
          toMemcacheCasValues(casCacheValue));
    }
    return translateMemcacheKeySetResult(
        memcacheServiceHelper.putIfUntouched(memcacheValues));
  }

  /**
   * Evicts the cache entries for the specified keys.
   *
   * @param keys the keys to evict from the cache.
   * @return the set of keys successfully deleted.  Any keys in {@code keys} but not in the
   *     returned set were not found in the cache. The iteration order of the returned set matches
   *     the iteration order of the provided {@code keys}.
   */
  public Future<Set<Key>> evictAsync(Collection<Key> keys) {
    List<String> memcacheKeys = Lists.newArrayListWithExpectedSize(keys.size());
    for (Key key : keys) {
      memcacheKeys.add(toMemcacheKey(key));
    }
    return translateMemcacheKeySetResult(
        memcacheServiceHelper.delete(memcacheKeys));
  }

  /**
   * Evicts the cache entries that contain entities for the keys specified.
   *
   * @param keys the keys to evict from the cache.
   * @return the set of keys successfully deleted.  Any keys in {@code keys} but not in the
   *     returned set were either not found in the cache or had cache values that were not
   *     entity objects.
   */
  public Set<Key> evictEntitiesOnly(Collection<Key> keys) {
    List<String> memcacheKeys = Lists.newArrayListWithExpectedSize(keys.size());
    for (Key key : keys) {
      memcacheKeys.add(toMemcacheKey(key));
    }
    Predicate<CacheValue> entitiesOnly = new Predicate<CacheValue>() {
      @Override
      public boolean apply(CacheValue value) {
        return value.getStateEnum() == State.ENTITY;
      }
    };
    Map<Key, IdentifiableCacheValue> getResults =
        quietGet(getIdentifiableHelper(memcacheKeys, entitiesOnly));
    return quietGet(evictIfUntouchedAsync(getResults));
  }

  /**
   * Translates a {@link Set} of memcache keys returned by a {@link Future} to a {@code Set} of
   * {@link Key} objects.
   */
  private static Future<Set<Key>> translateMemcacheKeySetResult(Future<Set<String>> inputSet) {
    return new FutureWrapper<Set<String>, Set<Key>>(inputSet) {
      @Override
      protected Set<Key> wrap(Set<String> memcacheKeys) throws Exception {
        Set<Key> outputResults = Sets.newLinkedHashSetWithExpectedSize(memcacheKeys.size());
        for (String memcacheKey : memcacheKeys) {
          outputResults.add(fromMemcacheKey(memcacheKey));
        }
        return outputResults;
      }

      @Override
      protected Throwable convertException(Throwable cause) {
        return cause;
      }
    };
  }

  /**
   * Computes the expiration time for a cache value containing a state used to demarcate in progress
   * datastore operations.
   * <p>
   * This computation assumes that after issuing the entity cache operation the invoker will
   * complete any associated datastore operations within the time specified by the datastore rpc
   * deadline. Meaning an invoker can issue one or more async datastore operations, but as soon
   * as the invoker blocks on a single datastore operation the invoker should not issue any more
   * datastore operations to the keys associated with the state being broadacast via the cache.
   *
   * @param numSyncMemcacheOps the number of synchronous memcache operations issued prior to
   *     returning control to the entity cache api invoker.
   * @return the expiration time for the state cache value.
   */
  Expiration computeDatastoreOpStateExpiration(int numSyncMemcacheOps) {
    double stateExpirationTimeSecs =
        numSyncMemcacheOps * memcacheServiceHelper.getRpcDeadlineSecs() +
        datastoreRpcDeadlineSecs +
        EXTRA_STATE_EXPIRATION_SECS;
    return Expiration.byDeltaMillis((int) (stateExpirationTimeSecs * 1000));
  }

  /**
   * Encapsulates a {@link CacheValue} object that was derived from a memcache
   * {@link IdentifiableValue} object. The encapsulated object can later be used in compare and swap
   * entity cache operations.
   */
  public static final class IdentifiableCacheValue {
    private final IdentifiableValue memcacheValue;
    private final CacheValue value;

    /**
     * Constructs an {@link IdentifiableCacheValue} object.
     *
     * @param memcacheValue the identifiable memcache value.
     * @param value the cache value derived from the {@code memcacheValue}.
     */
    public IdentifiableCacheValue(IdentifiableValue memcacheValue, CacheValue value) {
      this.memcacheValue = memcacheValue;
      this.value = value;
    }

    /**
     * @return the cache value.
     */
    public CacheValue getValue() {
      return value;
    }

    /**
     * @return the identifiable memcache value.
     */
    public IdentifiableValue getMemcacheValue() {
      return memcacheValue;
    }
  }

  /**
   * A container for value arguments for compare and swap cache operations.
   */
  public static final class CasCacheValues {

    private final IdentifiableCacheValue oldValue;
    private final CacheValue newValue;

    /**
     * Constructs a {@link CasCacheValues} object.
     *
     * @param oldValue the old value to swap out.
     * @param newValue an entity {@code CacheValue} object or {@code null} to evict the old value
     *     from the cache.
     */
    public CasCacheValues(IdentifiableCacheValue oldValue, CacheValue newValue) {
      this.oldValue =
          checkNotNull(oldValue, "The oldValue argument can not be null");
      if (newValue != null) {
        checkArgument(newValue.getStateEnum() == State.ENTITY,
            "The newValue argument does not contain an entity");
      }
      this.newValue = newValue;
    }

    /**
     * @return the old cache value.
     */
    public IdentifiableCacheValue getOldValue() {
      return oldValue;
    }

    /**
     * @return the proposed new cache value. Or {@code null} if the old cache value is being
     *     evicted instead of being replaced.
     */
    public CacheValue getNewValue() {
      return newValue;
    }
  }
}

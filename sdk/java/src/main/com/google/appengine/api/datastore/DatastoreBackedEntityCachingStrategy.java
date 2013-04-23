package com.google.appengine.api.datastore;

import static com.google.appengine.api.datastore.FutureHelper.quietGet;

import com.google.appengine.api.datastore.EntityCache.CasCacheValues;
import com.google.appengine.api.datastore.EntityCache.IdentifiableCacheValue;
import com.google.appengine.api.datastore.ReadPolicy.Consistency;
import com.google.appengine.api.memcache.MemcacheService.SetPolicy;
import com.google.apphosting.datastore.EntityStorage.CacheValue;
import com.google.apphosting.datastore.EntityStorage.CacheValue.State;
import com.google.common.collect.ImmutableList;
import com.google.common.collect.ImmutableMap;
import com.google.common.collect.ImmutableSet;
import com.google.common.collect.Maps;
import com.google.common.collect.Sets;

import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.Future;

/**
 * A datastore-backed entity caching strategy implementation. Implements the policy specified by
 * {@link EntityCachePolicy#CACHE}.
 *
 */
final class DatastoreBackedEntityCachingStrategy extends EntityCachingStrategy {

  private final EntityCache cache;
  private final DatastoreServiceConfig datastoreServiceConfig;

  DatastoreBackedEntityCachingStrategy(DatastoreServiceConfig datastoreServiceConfig) {
    MemcacheServiceHelper memcacheServiceHelper =
        MemcacheServiceHelper.Builder.withLogAndAbsorbMemcacheServiceErrors();
    double datastoreRpcDeadline = (datastoreServiceConfig.getDeadline() == null) ?
        DEFAULT_DATASTORE_RPC_DEADLINE_SECS : datastoreServiceConfig.getDeadline();
    cache = new EntityCache(memcacheServiceHelper, datastoreRpcDeadline);
    this.datastoreServiceConfig = datastoreServiceConfig;
  }

  DatastoreBackedEntityCachingStrategy(EntityCache cache,
      DatastoreServiceConfig datastoreServiceConfig) {
    this.cache = cache;
    this.datastoreServiceConfig = datastoreServiceConfig;
  }

  @Override
  public PreGetCachingResult preGet(CurrentTransactionProvider currentTxnProvider,
      List<Key> keysToGet, Map<Key, Entity> resultMap) {
    Set<Key> keysToSkipLoading = Sets.newHashSet();
    Future<Set<Key>> readInProgressKeys =
        new FutureHelper.FakeFuture<Set<Key>>(ImmutableSet.<Key>of());
    if ((currentTxnProvider.getCurrentTransaction(null) != null) ||
        (datastoreServiceConfig.getReadPolicy().getConsistency() == Consistency.EVENTUAL)) {
      return new DatastoreBackedPreGetCachingResult(keysToSkipLoading, readInProgressKeys);
    }
    List<Key> cacheableKeys = getCacheableKeys(datastoreServiceConfig, keysToGet);
    Map<Key, IdentifiableCacheValue> getResults = quietGet(
        cache.getIdentifiableAsync(cacheableKeys));
    HashSet<Key> uncachedKeys = Sets.newHashSet(cacheableKeys);
    for (Map.Entry<Key, IdentifiableCacheValue> result : getResults.entrySet()) {
      Key key = result.getKey();
      uncachedKeys.remove(key);
      CacheValue value = result.getValue().getValue();
      if (value.getStateEnum() == State.ENTITY) {
        keysToSkipLoading.add(key);
        if (value.hasEntity()) {
          resultMap.put(key, EntityTranslator.createFromPb(value.getEntity().getV3Entity()));
        }
      }
    }
    if (!uncachedKeys.isEmpty()) {
      readInProgressKeys = cache.putStateAsync(
          uncachedKeys, State.READ_IN_PROGRESS, SetPolicy.ADD_ONLY_IF_NOT_PRESENT);
    }
    return new DatastoreBackedPreGetCachingResult(keysToSkipLoading, readInProgressKeys);
  }

  @Override
  protected void postGet(PreGetCachingResult preGetResult, Map<Key, Entity> resultMap) {
    DatastoreBackedPreGetCachingResult preGetStrategyResult =
        (DatastoreBackedPreGetCachingResult) preGetResult;
    Set<Key> readInProgressKeys = quietGet(preGetStrategyResult.getReadInProgressKeys());
    if (!readInProgressKeys.isEmpty()) {
      Map<Key, IdentifiableCacheValue> readInProgressCacheValues =
          quietGet(cache.getIdentifiableAsync(readInProgressKeys));
      Map<Key, CasCacheValues> cacheValuesToUpdate =
          Maps.newHashMapWithExpectedSize(readInProgressCacheValues.size());
      for (Map.Entry<Key, IdentifiableCacheValue> readInProgressMapEntry :
          readInProgressCacheValues.entrySet()) {
        Key key = readInProgressMapEntry.getKey();
        IdentifiableCacheValue oldIdCacheValue = readInProgressMapEntry.getValue();
        CacheValue oldCacheValue = oldIdCacheValue.getValue();
        if (oldCacheValue.getStateEnum() != State.READ_IN_PROGRESS) {
          continue;
        }
        Entity entity = resultMap.get(key);
        CacheValue newCacheValue = CacheValueUtil.createCacheValue(State.ENTITY,
            (entity == null) ? null : EntityTranslator.convertToPb(entity));
        cacheValuesToUpdate.put(key, new CasCacheValues(oldIdCacheValue, newCacheValue));
      }
      if (!cacheValuesToUpdate.isEmpty()) {
        cache.putIfUntouchedAsync(cacheValuesToUpdate);
      }
    }
  }

  @Override
  public PreMutationCachingResult prePut(CurrentTransactionProvider currentTxnProvider,
      List<Entity> entitiesToPut) {
    if (currentTxnProvider.getCurrentTransaction(null) == null) {
      return preCommit(entitiesToPut, ImmutableList.<Key>of());
    } else {
      return new PreMutationCachingResult(ImmutableSet.<Key>of());
    }
  }

  @Override
  public PreMutationCachingResult preDelete(CurrentTransactionProvider currentTxnProvider,
      List<Key> keysToDelete) {
    if (currentTxnProvider.getCurrentTransaction(null) == null) {
      return preCommit(ImmutableList.<Entity>of(), keysToDelete);
    } else {
      return new PreMutationCachingResult(ImmutableSet.<Key>of());
    }
  }

  @Override
  public PreMutationCachingResult preCommit(List<Entity> entitiesToPut, List<Key> keysToDelete) {
    List<Entity> cacheableEntitiesToPut =
        getCacheableEntities(datastoreServiceConfig, entitiesToPut);
    List<Key> cacheableKeysToDelete = getCacheableKeys(datastoreServiceConfig, keysToDelete);
    Set<Key> completeKeys = Sets.newHashSetWithExpectedSize(
        cacheableEntitiesToPut.size() + cacheableKeysToDelete.size());
    completeKeys.addAll(cacheableKeysToDelete);
    for (Entity entity : cacheableEntitiesToPut) {
      Key key = entity.getKey();
      if (key.isComplete()) {
        completeKeys.add(key);
      }
    }
    Map<Key, IdentifiableCacheValue> mutationInProgressCacheValues;
    if (completeKeys.isEmpty()) {
      mutationInProgressCacheValues = ImmutableMap.of();
    } else {
      mutationInProgressCacheValues = cache.putStateIdentifiable(
          completeKeys, State.MUTATION_IN_PROGRESS, SetPolicy.SET_ALWAYS);
    }
    return new DatastoreBackedPreMutationCachingResult(completeKeys, mutationInProgressCacheValues);
  }

  @Override
  protected void postMutation(PreMutationCachingResult preMutationResult) {
    DatastoreBackedPreMutationCachingResult preMutationStrategyResult =
        (DatastoreBackedPreMutationCachingResult) preMutationResult;
    if (preMutationStrategyResult.getMutationKeys().isEmpty()) {
      return;
    }
    Set<Key> updatedKeys = ImmutableSet.of();
    if (!preMutationStrategyResult.getMutationInProgressCacheValues().isEmpty()) {
      updatedKeys = quietGet(cache.evictIfUntouchedAsync(
          preMutationStrategyResult.getMutationInProgressCacheValues()));
    }
    Set<Key> nonUpdatedKeys = preMutationStrategyResult.getMutationKeys();
    nonUpdatedKeys.removeAll(updatedKeys);
    if (!nonUpdatedKeys.isEmpty()) {
      Map<Key, IdentifiableCacheValue> cacheEntriesNotUpdated =
          quietGet(cache.getIdentifiableAsync(nonUpdatedKeys));
      Iterator<Map.Entry<Key, IdentifiableCacheValue>> cacheEntriesNotUpdatedIter =
          cacheEntriesNotUpdated.entrySet().iterator();
      while (cacheEntriesNotUpdatedIter.hasNext()) {
        Map.Entry<Key, IdentifiableCacheValue> cacheEntry =
            cacheEntriesNotUpdatedIter.next();
        CacheValue value = cacheEntry.getValue().getValue();
        if ((value.getStateEnum() != State.ENTITY) &&
            (value.getStateEnum() != State.READ_IN_PROGRESS)) {
          cacheEntriesNotUpdatedIter.remove();
        }
      }
      quietGet(cache.evictIfUntouchedAsync(cacheEntriesNotUpdated));
    }
  }

  static final class DatastoreBackedPreGetCachingResult extends PreGetCachingResult {
    private final Future<Set<Key>> readInProgressKeys;

    public DatastoreBackedPreGetCachingResult(Set<Key> keysToSkipLoading,
        Future<Set<Key>> readInProgressKeys) {
      super(keysToSkipLoading);
      this.readInProgressKeys = readInProgressKeys;
    }

    public Future<Set<Key>> getReadInProgressKeys() {
      return readInProgressKeys;
    }
  }

  static final class DatastoreBackedPreMutationCachingResult
      extends PreMutationCachingResult {
    private final Set<Key> mutationKeys;
    private final Map<Key, IdentifiableCacheValue> mutationInProgressCacheValues;

    public DatastoreBackedPreMutationCachingResult(Set<Key> mutationKeys,
        Map<Key, IdentifiableCacheValue> mutationInProgressCacheValues) {
      super(ImmutableSet.<Key>of());
      this.mutationKeys = mutationKeys;
      this.mutationInProgressCacheValues = mutationInProgressCacheValues;
    }

    public Set<Key> getMutationKeys() {
      return mutationKeys;
    }

    public Map<Key, IdentifiableCacheValue> getMutationInProgressCacheValues() {
      return mutationInProgressCacheValues;
    }
  }
}

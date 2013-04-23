// Copyright 2011 Google Inc.  All rights reserved

package com.google.appengine.api.memcache;

import static com.google.appengine.api.memcache.MemcacheServiceApiHelper.makeAsyncCall;

import com.google.appengine.api.memcache.MemcacheSerialization.ValueAndFlags;
import com.google.appengine.api.memcache.MemcacheService.CasValues;
import com.google.appengine.api.memcache.MemcacheService.IdentifiableValue;
import com.google.appengine.api.memcache.MemcacheService.SetPolicy;
import com.google.appengine.api.memcache.MemcacheServiceApiHelper.Provider;
import com.google.appengine.api.memcache.MemcacheServiceApiHelper.RpcResponseHandler;
import com.google.appengine.api.memcache.MemcacheServiceApiHelper.Transformer;
import com.google.appengine.api.memcache.MemcacheServicePb.MemcacheBatchIncrementRequest;
import com.google.appengine.api.memcache.MemcacheServicePb.MemcacheBatchIncrementResponse;
import com.google.appengine.api.memcache.MemcacheServicePb.MemcacheDeleteRequest;
import com.google.appengine.api.memcache.MemcacheServicePb.MemcacheDeleteResponse;
import com.google.appengine.api.memcache.MemcacheServicePb.MemcacheDeleteResponse.DeleteStatusCode;
import com.google.appengine.api.memcache.MemcacheServicePb.MemcacheFlushRequest;
import com.google.appengine.api.memcache.MemcacheServicePb.MemcacheFlushResponse;
import com.google.appengine.api.memcache.MemcacheServicePb.MemcacheGetRequest;
import com.google.appengine.api.memcache.MemcacheServicePb.MemcacheGetResponse;
import com.google.appengine.api.memcache.MemcacheServicePb.MemcacheIncrementRequest;
import com.google.appengine.api.memcache.MemcacheServicePb.MemcacheIncrementRequest.Direction;
import com.google.appengine.api.memcache.MemcacheServicePb.MemcacheIncrementResponse;
import com.google.appengine.api.memcache.MemcacheServicePb.MemcacheIncrementResponse.IncrementStatusCode;
import com.google.appengine.api.memcache.MemcacheServicePb.MemcacheServiceError;
import com.google.appengine.api.memcache.MemcacheServicePb.MemcacheSetRequest;
import com.google.appengine.api.memcache.MemcacheServicePb.MemcacheSetResponse;
import com.google.appengine.api.memcache.MemcacheServicePb.MemcacheSetResponse.SetStatusCode;
import com.google.appengine.api.memcache.MemcacheServicePb.MemcacheStatsRequest;
import com.google.appengine.api.memcache.MemcacheServicePb.MemcacheStatsResponse;
import com.google.appengine.api.memcache.MemcacheServicePb.MergedNamespaceStats;
import com.google.appengine.api.utils.FutureWrapper;
import com.google.apphosting.api.ApiProxy;
import com.google.common.base.Objects;
import com.google.protobuf.ByteString;
import com.google.protobuf.Message;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.Future;
import java.util.concurrent.TimeUnit;

/**
 * Java bindings for the AsyncMemcache service.
 *
 */
class AsyncMemcacheServiceImpl extends BaseMemcacheServiceImpl implements AsyncMemcacheService {

  static class StatsImpl implements Stats {
    private final long hits, misses, bytesFetched, items, bytesStored;
    private final int maxCachedTime;

    StatsImpl(MergedNamespaceStats stats) {
      if (stats != null) {
        hits = stats.getHits();
        misses = stats.getMisses();
        bytesFetched = stats.getByteHits();
        items = stats.getItems();
        bytesStored = stats.getBytes();
        maxCachedTime = stats.getOldestItemAge();
      } else {
        hits = misses = bytesFetched = items = bytesStored = 0;
        maxCachedTime = 0;
      }
    }

    @Override
    public long getHitCount() {
      return hits;
    }

    @Override
    public long getMissCount() {
      return misses;
    }

    @Override
    public long getBytesReturnedForHits() {
      return bytesFetched;
    }

    @Override
    public long getItemCount() {
      return items;
    }

    @Override
    public long getTotalItemBytes() {
      return bytesStored;
    }

    @Override
    public int getMaxTimeWithoutAccess() {
      return maxCachedTime;
    }

    @Override
    public String toString() {
      StringBuilder builder = new StringBuilder();
      builder.append("Hits: ").append(hits).append('\n');
      builder.append("Misses: ").append(misses).append('\n');
      builder.append("Bytes Fetched: ").append(bytesFetched).append('\n');
      builder.append("Bytes Stored: ").append(bytesStored).append('\n');
      builder.append("Items: ").append(items).append('\n');
      builder.append("Max Cached Time: ").append(maxCachedTime).append('\n');
      return builder.toString();
    }
  }

  static final class IdentifiableValueImpl implements IdentifiableValue {
    private final Object value;
    private final long casId;

    IdentifiableValueImpl(Object value, long casId) {
      this.value = value;
      this.casId = casId;
    }

    @Override
    public Object getValue() {
      return value;
    }

    long getCasId() {
      return casId;
    }

    @Override
    public boolean equals(Object otherObj) {
      if (this == otherObj) {
        return true;
      }
      if ((otherObj == null) || (getClass() != otherObj.getClass())) {
        return false;
      }
      IdentifiableValueImpl otherIdentifiableValue = (IdentifiableValueImpl) otherObj;
      return Objects.equal(value, otherIdentifiableValue.value) &&
          (casId == otherIdentifiableValue.casId);
    }

    @Override
    public int hashCode() {
      return Objects.hashCode(value, casId);
    }
  }

  private static class DefaultValueProviders {

    @SuppressWarnings("rawtypes")
    private static final Provider NULL_PROVIDER = new Provider() {
          @Override public Object get() {
            return null;
          }
        };

    private static final Provider<Boolean> FALSE_PROVIDER = new Provider<Boolean>() {
          @Override public Boolean get() {
            return Boolean.FALSE;
          }
        };

    @SuppressWarnings("rawtypes")
    private static final Provider SET_PROVIDER = new Provider<Set<?>>() {
          @Override public Set<?> get() {
            return new HashSet(0, 1);
          }
        };

    @SuppressWarnings("rawtypes")
    private static final Provider MAP_PROVIDER = new Provider<Map<?, ?>>() {
          @Override public Map<?, ?> get() {
            return new HashMap(0, 1);
          }
        };

    private static final Provider<Stats> STATS_PROVIDER = new Provider<Stats>() {
          final Stats emptyStats =  new AsyncMemcacheServiceImpl.StatsImpl(null);

          @Override public Stats get() {
            return emptyStats;
          }
        };

    static Provider<Boolean> falseValue() {
      return FALSE_PROVIDER;
    }

    @SuppressWarnings("unchecked")
    static <T> Provider<T> nullValue() {
      return NULL_PROVIDER;
    }

    @SuppressWarnings("unchecked")
    static <T> Provider<Set<T>> emptySet() {
      return SET_PROVIDER;
    }

    @SuppressWarnings("unchecked")
    static <K, V> Provider<Map<K, V>> emptyMap() {
      return MAP_PROVIDER;
    }

    static Provider<Stats> emptyStats() {
      return STATS_PROVIDER;
    }
  }

  private static class VoidFutureWrapper<K> extends FutureWrapper<K, Void> {

    private VoidFutureWrapper(Future<K> parent) {
      super(parent);
    }

    private static <K> Future<Void> wrap(Future<K> parent) {
      return new VoidFutureWrapper<K>(parent);
    }

    @Override
    protected Void wrap(K value) {
      return null;
    }

    @Override
    protected Throwable convertException(Throwable cause) {
      return cause;
    }
  }

  private static final class KeyValuePair<K, V> {
    private final K key;
    private final V value;

    private KeyValuePair(K key, V value) {
      this.key = key;
      this.value = value;
    }

    static <K, V> KeyValuePair<K, V> of(K key, V value) {
      return new KeyValuePair<K, V>(key, value);
    }
  }

  AsyncMemcacheServiceImpl(String namespace) {
    super(namespace);
  }

  static <T, V> Map<T, V> makeMap(Collection<T> keys, V value) {
    Map<T, V> map = new LinkedHashMap<T, V>(keys.size(), 1);
    for (T key : keys) {
      map.put(key, value);
    }
    return map;
  }

  private static ByteString makePbKey(Object key) {
    try {
      return ByteString.copyFrom(MemcacheSerialization.makePbKey(key));
    } catch (IOException ex) {
      throw new IllegalArgumentException("Cannot use as a key: '" + key + "'", ex);
    }
  }

  private static ValueAndFlags serializeValue(Object value) {
    try {
      return MemcacheSerialization.serialize(value);
    } catch (IOException ex) {
      throw new IllegalArgumentException("Cannot use as value: '" + value + "'", ex);
    }
  }

  private Object deserializeItem(Object key, MemcacheGetResponse.Item item) {
    try {
      return MemcacheSerialization.deserialize(item.getValue().toByteArray(), item.getFlags());
    } catch (ClassNotFoundException ex) {
      getErrorHandler().handleDeserializationError(
          new InvalidValueException("Can't find class for value of key '" + key + "'", ex));
    } catch (IOException ex) {
      getErrorHandler().handleDeserializationError(
          new InvalidValueException("Failed to parse the value for '" + key + "'", ex));
    }
    return null;
  }

  private <M extends Message, T> RpcResponseHandler<M, T> createRpcResponseHandler(
      M response, String errorText, Transformer<M, T> responseTransformer) {
    return new RpcResponseHandler<M, T>(
        response, errorText, responseTransformer, getErrorHandler());
  }

  @Override
  public Future<Boolean> contains(Object key) {
    return doGet(key, false, "Memcache contains: exception testing contains (" + key + ")",
        new Transformer<MemcacheGetResponse, Boolean>() {
          @Override public Boolean transform(MemcacheGetResponse response) {
            return response.getItemCount() > 0;
          }
        }, DefaultValueProviders.falseValue());
  }

  private <T> Future<T> doGet(Object key, boolean forCas, String errorText,
      final Transformer<MemcacheGetResponse, T> responseTransfomer, Provider<T> defaultValue) {
    MemcacheGetRequest.Builder requestBuilder = MemcacheGetRequest.newBuilder();
    requestBuilder.addKey(makePbKey(key));
    requestBuilder.setNameSpace(getEffectiveNamespace());
    if (forCas) {
      requestBuilder.setForCas(true);
    }
    return makeAsyncCall("Get", requestBuilder.build(),
        createRpcResponseHandler(MemcacheGetResponse.getDefaultInstance(), errorText,
            responseTransfomer), defaultValue);
  }

  @Override
  public Future<Object> get(final Object key) {
    return doGet(key, false, "Memcache get: exception getting 1 key (" + key + ")",
        new Transformer<MemcacheGetResponse, Object>() {
          @Override public Object transform(MemcacheGetResponse response) {
            return response.getItemCount() == 0 ? null : deserializeItem(key, response.getItem(0));
          }
        }, DefaultValueProviders.nullValue());
  }

  @Override
  public Future<IdentifiableValue> getIdentifiable(final Object key) {
    return doGet(key, true, "Memcache getIdentifiable: exception getting 1 key (" + key + ")",
        new Transformer<MemcacheGetResponse, IdentifiableValue>() {
          @Override public IdentifiableValue transform(MemcacheGetResponse response) {
            if (response.getItemCount() == 0) {
              return null;
            }
            MemcacheGetResponse.Item item = response.getItem(0);
            return new IdentifiableValueImpl(deserializeItem(key, item), item.getCasId());
          }
        }, DefaultValueProviders.<IdentifiableValue>nullValue());
  }

  @Override
  public <K> Future<Map<K, IdentifiableValue>> getIdentifiables(Collection<K> keys) {
    return doGetAll(keys, true,
        "Memcache getIdentifiables: exception getting multiple keys",
        new Transformer<KeyValuePair<K, MemcacheGetResponse.Item>, IdentifiableValue>() {
          @Override
          public IdentifiableValue transform(KeyValuePair<K, MemcacheGetResponse.Item> pair) {
            MemcacheGetResponse.Item item = pair.value;
            Object value = deserializeItem(pair.key, item);
            return new IdentifiableValueImpl(value, item.getCasId());
          }
        }, DefaultValueProviders.<K, IdentifiableValue>emptyMap());
  }

  @Override
  public <K> Future<Map<K, Object>> getAll(Collection<K> keys) {
    return doGetAll(keys, false,
        "Memcache getAll: exception getting multiple keys",
        new Transformer<KeyValuePair<K, MemcacheGetResponse.Item>, Object>() {
          @Override
          public Object transform(KeyValuePair<K, MemcacheGetResponse.Item> pair) {
            return deserializeItem(pair.key, pair.value);
          }
        }, DefaultValueProviders.<K, Object>emptyMap());
  }

  private <K, V> Future<Map<K, V>> doGetAll(Collection<K> keys, boolean forCas,
      String errorText,
      final Transformer<KeyValuePair<K, MemcacheGetResponse.Item>, V> responseTransfomer,
      Provider<Map<K, V>> defaultValue) {
    MemcacheGetRequest.Builder requestBuilder = MemcacheGetRequest.newBuilder();
    requestBuilder.setNameSpace(getEffectiveNamespace());
    final Map<ByteString, K> byteStringToKey = new HashMap<ByteString, K>(keys.size(), 1);
    for (K key : keys) {
      ByteString pbKey = makePbKey(key);
      byteStringToKey.put(pbKey, key);
      requestBuilder.addKey(pbKey);
    }
    if (forCas) {
      requestBuilder.setForCas(forCas);
    }
    return makeAsyncCall("Get", requestBuilder.build(), createRpcResponseHandler(
        MemcacheGetResponse.getDefaultInstance(), errorText,
        new Transformer<MemcacheGetResponse, Map<K, V>>() {
          @Override
          public Map<K, V> transform(MemcacheGetResponse response) {
            Map<K, V> result = new HashMap<K, V>();
            for (MemcacheGetResponse.Item item : response.getItemList()) {
              K key = byteStringToKey.get(item.getKey());
              V obj = responseTransfomer.transform(KeyValuePair.of(key, item));
              result.put(key, obj);
            }
            return result;
          }
        }), defaultValue);
  }

  /**
   * Note: non-null oldValue implies Compare-and-Swap operation.
   */
  private Future<Boolean> doPut(final Object key, IdentifiableValue oldValue, Object value,
      Expiration expires, MemcacheSetRequest.SetPolicy policy) {
    MemcacheSetRequest.Builder requestBuilder = MemcacheSetRequest.newBuilder();
    requestBuilder.setNameSpace(getEffectiveNamespace());
    MemcacheSetRequest.Item.Builder itemBuilder = MemcacheSetRequest.Item.newBuilder();
    ValueAndFlags vaf = serializeValue(value);
    itemBuilder.setValue(ByteString.copyFrom(vaf.value));
    itemBuilder.setFlags(vaf.flags.ordinal());
    itemBuilder.setKey(makePbKey(key));
    itemBuilder.setExpirationTime(expires == null ? 0 : expires.getSecondsValue());
    itemBuilder.setSetPolicy(policy);
    if (policy == MemcacheSetRequest.SetPolicy.CAS) {
      if (oldValue == null) {
        throw new IllegalArgumentException("oldValue must not be null.");
      }
      if (!(oldValue instanceof IdentifiableValueImpl)) {
        throw new IllegalArgumentException(
            "oldValue is an instance of an unapproved IdentifiableValue implementation.  " +
            "Perhaps you implemented your own version of IdentifiableValue?  " +
            "If so, don't do this.");
      }
      itemBuilder.setCasId(((IdentifiableValueImpl) oldValue).getCasId());
    }
    requestBuilder.addItem(itemBuilder);
    return makeAsyncCall("Set", requestBuilder.build(), createRpcResponseHandler(
        MemcacheSetResponse.getDefaultInstance(),
        String.format("Memcache put: exception setting 1 key (%s) to '%s'", key, value),
        new Transformer<MemcacheSetResponse, Boolean>() {
          @Override public Boolean transform(MemcacheSetResponse response) {
            if (response.getSetStatusCount() != 1) {
              throw new MemcacheServiceException("Memcache put: Set one item, got "
                  + response.getSetStatusCount() + " response statuses");
            }
            SetStatusCode status = response.getSetStatus(0);
            if (status == SetStatusCode.ERROR) {
              throw new MemcacheServiceException(
                  "Memcache put: Error setting single item (" + key + ")");
            }
            return status == SetStatusCode.STORED;
          }
        }), DefaultValueProviders.falseValue());
  }

  private static MemcacheSetRequest.SetPolicy convertSetPolicyToPb(SetPolicy policy) {
    switch (policy) {
      case SET_ALWAYS:
        return MemcacheSetRequest.SetPolicy.SET;
      case ADD_ONLY_IF_NOT_PRESENT:
        return MemcacheSetRequest.SetPolicy.ADD;
      case REPLACE_ONLY_IF_PRESENT:
        return MemcacheSetRequest.SetPolicy.REPLACE;
    }
    throw new IllegalArgumentException("Unknown policy: " + policy);
  }

  @Override
  public Future<Boolean> put(Object key, Object value, Expiration expires, SetPolicy policy) {
    return doPut(key, null, value, expires, convertSetPolicyToPb(policy));
  }

  @Override
  public Future<Void> put(Object key, Object value, Expiration expires) {
    return VoidFutureWrapper.wrap(
        doPut(key, null, value, expires, MemcacheSetRequest.SetPolicy.SET));
  }

  @Override
  public Future<Void> put(Object key, Object value) {
    return VoidFutureWrapper.wrap(
        doPut(key, null, value, null, MemcacheSetRequest.SetPolicy.SET));
  }

  @Override
  public Future<Boolean> putIfUntouched(Object key, IdentifiableValue oldValue,
      Object newValue, Expiration expires) {
    return doPut(key, oldValue, newValue, expires, MemcacheSetRequest.SetPolicy.CAS);
  }

  @Override
  public Future<Boolean> putIfUntouched(Object key, IdentifiableValue oldValue, Object newValue) {
    return doPut(key, oldValue, newValue, null, MemcacheSetRequest.SetPolicy.CAS);
  }

  @Override
  public <T> Future<Set<T>> putIfUntouched(Map<T, CasValues> values) {
    return doPutAll(values, null, MemcacheSetRequest.SetPolicy.CAS, "putIfUntouched");
  }

  @Override
  public <T> Future<Set<T>> putIfUntouched(Map<T, CasValues> values, Expiration expiration) {
    return doPutAll(values, expiration, MemcacheSetRequest.SetPolicy.CAS, "putIfUntouched");
  }

  private <T> Future<Set<T>> doPutAll(Map<T, ?> values, Expiration expires,
      MemcacheSetRequest.SetPolicy policy, String operation) {
    MemcacheSetRequest.Builder requestBuilder = MemcacheSetRequest.newBuilder();
    requestBuilder.setNameSpace(getEffectiveNamespace());
    final List<T> requestedKeys = new ArrayList<T>(values.size());
    for (Map.Entry<T, ?> entry : values.entrySet()) {
      MemcacheSetRequest.Item.Builder itemBuilder = MemcacheSetRequest.Item.newBuilder();
      requestedKeys.add(entry.getKey());
      itemBuilder.setKey(makePbKey(entry.getKey()));
      ValueAndFlags vaf;
      if (policy == MemcacheSetRequest.SetPolicy.CAS) {
        CasValues value = (CasValues) entry.getValue();
        if (value == null) {
          throw new IllegalArgumentException(entry.getKey() + " has a null for CasValues");
        }
        vaf = serializeValue(value.getNewValue());
        if (!(value.getOldValue() instanceof IdentifiableValueImpl)) {
          throw new IllegalArgumentException(
            entry.getKey() + " CasValues has an oldValue instance of an unapproved " +
            "IdentifiableValue implementation.  Perhaps you implemented your own " +
            "version of IdentifiableValue?  If so, don't do this.");
        }
        itemBuilder.setCasId(((IdentifiableValueImpl) value.getOldValue()).getCasId());
        if (value.getExipration() != null) {
          itemBuilder.setExpirationTime(value.getExipration().getSecondsValue());
        } else {
          itemBuilder.setExpirationTime(expires == null ? 0 : expires.getSecondsValue());
        }
      } else {
        vaf = serializeValue(entry.getValue());
        itemBuilder.setExpirationTime(expires == null ? 0 : expires.getSecondsValue());
      }
      itemBuilder.setValue(ByteString.copyFrom(vaf.value));
      itemBuilder.setFlags(vaf.flags.ordinal());
      itemBuilder.setSetPolicy(policy);
      requestBuilder.addItem(itemBuilder);
    }
    return makeAsyncCall("Set", requestBuilder.build(), createRpcResponseHandler(
        MemcacheSetResponse.getDefaultInstance(),
        "Memcache " + operation + ": Unknown exception setting " + values.size() + " keys",
        new Transformer<MemcacheSetResponse, Set<T>>() {
          @Override public Set<T> transform(MemcacheSetResponse response) {
            if (response.getSetStatusCount() != requestedKeys.size()) {
              throw new MemcacheServiceException(String.format(
                  "Memcache put: Set %d items, got %d response statuses",
                  requestedKeys.size(),
                  response.getSetStatusCount()));
            }
            HashSet<T> result = new HashSet<T>();
            HashSet<T> errors = new HashSet<T>();
            Iterator<SetStatusCode> statusIter = response.getSetStatusList().iterator();
            for (T requestedKey : requestedKeys) {
              SetStatusCode status = statusIter.next();
              if (status == MemcacheSetResponse.SetStatusCode.ERROR) {
                errors.add(requestedKey);
              } else if (status == MemcacheSetResponse.SetStatusCode.STORED) {
                result.add(requestedKey);
              }
            }
            if (!errors.isEmpty()) {
              StringBuilder builder = new StringBuilder("Memcache put: Set failed to set ");
              builder.append(errors.size()).append(" keys: ");
              for (Object err : errors) {
                builder.append(err).append(", ");
              }
              builder.setLength(builder.length() - 2);
              throw new MemcacheServiceException(builder.toString());
            }
            return result;
          }
        }), DefaultValueProviders.<T>emptySet());
  }

  @Override
  public <T> Future<Set<T>> putAll(Map<T, ?> values, Expiration expires, SetPolicy policy) {
    return doPutAll(values, expires, convertSetPolicyToPb(policy), "putAll");
  }

  @Override
  public Future<Void> putAll(Map<?, ?> values, Expiration expires) {
    return VoidFutureWrapper.wrap(
        doPutAll(values, expires, MemcacheSetRequest.SetPolicy.SET, "putAll"));
  }

  @Override
  public Future<Void> putAll(Map<?, ?> values) {
    return VoidFutureWrapper.wrap(
        doPutAll(values, null, MemcacheSetRequest.SetPolicy.SET, "putAll"));
  }

  @Override
  public Future<Boolean> delete(Object key) {
    return delete(key, 0);
  }

  @Override
  public Future<Boolean> delete(Object key, long millisNoReAdd) {
    MemcacheDeleteRequest request = MemcacheDeleteRequest.newBuilder()
        .setNameSpace(getEffectiveNamespace())
        .addItem(MemcacheDeleteRequest.Item.newBuilder()
            .setKey(makePbKey(key))
            .setDeleteTime((int) TimeUnit.SECONDS.convert(millisNoReAdd, TimeUnit.MILLISECONDS)))
        .build();
    return makeAsyncCall("Delete", request, createRpcResponseHandler(
        MemcacheDeleteResponse.getDefaultInstance(),
        "Memcache delete: Unknown exception deleting key: " + key,
        new Transformer<MemcacheDeleteResponse, Boolean>() {
          @Override public Boolean transform(MemcacheDeleteResponse response) {
            return response.getDeleteStatus(0) == DeleteStatusCode.DELETED;
          }
        }), DefaultValueProviders.falseValue());
  }

  @Override
  public <T> Future<Set<T>> deleteAll(Collection<T> keys) {
    return deleteAll(keys, 0);
  }

  @Override
  public <T> Future<Set<T>> deleteAll(Collection<T> keys, long millisNoReAdd) {
    MemcacheDeleteRequest.Builder requestBuilder =
        MemcacheDeleteRequest.newBuilder().setNameSpace(getEffectiveNamespace());
    final List<T> requestedKeys = new ArrayList<T>(keys.size());
    for (T key : keys) {
      requestedKeys.add(key);
      requestBuilder.addItem(MemcacheDeleteRequest.Item.newBuilder()
                                 .setDeleteTime((int) (millisNoReAdd / 1000))
                                 .setKey(makePbKey(key)));
    }
    return makeAsyncCall("Delete", requestBuilder.build(), createRpcResponseHandler(
        MemcacheDeleteResponse.getDefaultInstance(),
        "Memcache deleteAll: Unknown exception deleting multiple keys",
        new Transformer<MemcacheDeleteResponse, Set<T>>() {
          @Override public Set<T> transform(MemcacheDeleteResponse response) {
            Set<T> retval = new LinkedHashSet<T>();
            Iterator<T> requestedKeysIter = requestedKeys.iterator();
            for (DeleteStatusCode deleteStatus : response.getDeleteStatusList()) {
              T requestedKey = requestedKeysIter.next();
              if (deleteStatus == DeleteStatusCode.DELETED) {
                retval.add(requestedKey);
              }
            }
            return retval;
          }
        }), DefaultValueProviders.<T>emptySet());
  }

  private static MemcacheIncrementRequest.Builder newIncrementRequestBuilder(
      Object key, long delta, Long initialValue) {
    MemcacheIncrementRequest.Builder requestBuilder = MemcacheIncrementRequest.newBuilder();
    requestBuilder.setKey(makePbKey(key));
    if (delta > 0) {
      requestBuilder.setDirection(Direction.INCREMENT);
      requestBuilder.setDelta(delta);
    } else {
      requestBuilder.setDirection(Direction.DECREMENT);
      requestBuilder.setDelta(-delta);
    }
    if (initialValue != null) {
      requestBuilder.setInitialValue(initialValue);
      requestBuilder.setInitialFlags(MemcacheSerialization.Flag.LONG.ordinal());
    }
    return requestBuilder;
  }

  @Override
  public Future<Long> increment(Object key, long delta) {
    return increment(key, delta, null);
  }

  @Override
  public Future<Long> increment(final Object key, long delta, Long initialValue) {
    MemcacheIncrementRequest request = newIncrementRequestBuilder(key, delta, initialValue)
        .setNameSpace(getEffectiveNamespace())
        .build();
    return makeAsyncCall("Increment", request,
        new RpcResponseHandler<MemcacheIncrementResponse, Long>(
            MemcacheIncrementResponse.getDefaultInstance(),
            "Memcache increment: exception when incrementing key '" + key + "'",
            new Transformer<MemcacheIncrementResponse, Long>() {
              @Override public Long transform(MemcacheIncrementResponse response) {
                return response.hasNewValue() ? response.getNewValue() : null;
              }
            }, getErrorHandler()) {
          @Override void handleApiProxyException(Throwable cause) throws Exception {
            if (cause instanceof ApiProxy.ApplicationException) {
              ApiProxy.ApplicationException applicationException =
                  (ApiProxy.ApplicationException) cause;
              getLogger().info(applicationException.getErrorDetail());
              if (applicationException.getApplicationError() ==
                  MemcacheServiceError.ErrorCode.INVALID_VALUE_VALUE) {
                throw new InvalidValueException("Non-incrementable value for key '" + key + "'");
              }
            }
            super.handleApiProxyException(cause);
          }
        }, DefaultValueProviders.<Long>nullValue());
  }

  @Override
  public <T> Future<Map<T, Long>> incrementAll(Collection<T> keys, long delta) {
    return incrementAll(keys, delta, null);
  }

  @Override
  public <T> Future<Map<T, Long>> incrementAll(Collection<T> keys, long delta, Long initialValue) {
    return incrementAll(makeMap(keys, delta), initialValue);
  }

  @Override
  public <T> Future<Map<T, Long>> incrementAll(Map<T, Long> offsets) {
    return incrementAll(offsets, null);
  }

  @Override
  public <T> Future<Map<T, Long>> incrementAll(Map<T, Long> offsets, Long initialValue) {
    MemcacheBatchIncrementRequest.Builder requestBuilder =
        MemcacheBatchIncrementRequest.newBuilder().setNameSpace(getEffectiveNamespace());
    final List<T> requestedKeys = new ArrayList<T>(offsets.size());
    for (Map.Entry<T, Long> entry : offsets.entrySet()) {
      requestedKeys.add(entry.getKey());
      requestBuilder.addItem(
          newIncrementRequestBuilder(entry.getKey(), entry.getValue(), initialValue));
    }
    return makeAsyncCall("BatchIncrement", requestBuilder.build(), createRpcResponseHandler(
        MemcacheBatchIncrementResponse.getDefaultInstance(),
        "Memcache incrmentAll: exception incrementing multiple keys",
        new Transformer<MemcacheBatchIncrementResponse, Map<T, Long>>() {
          @Override public Map<T, Long> transform(MemcacheBatchIncrementResponse response) {
            Map<T, Long> result = new LinkedHashMap<T, Long>(requestedKeys.size(), 1);
            Iterator<MemcacheIncrementResponse> items = response.getItemList().iterator();
            for (T requestedKey : requestedKeys) {
              MemcacheIncrementResponse item = items.next();
              if (item.getIncrementStatus().equals(IncrementStatusCode.OK) && item.hasNewValue()) {
                result.put(requestedKey, item.getNewValue());
              } else {
                result.put(requestedKey, null);
              }
            }
            return result;
          }
        }),
        new Provider<Map<T, Long>>() {
            @Override public Map<T, Long> get() {
              return makeMap(requestedKeys, null);
            }
          });
  }

  @Override
  public Future<Void> clearAll() {
    return makeAsyncCall("FlushAll", MemcacheFlushRequest.getDefaultInstance(),
        createRpcResponseHandler(MemcacheFlushResponse.getDefaultInstance(),
            "Memcache clearAll: exception",
            new Transformer<MemcacheFlushResponse, Void>() {
              @Override public Void transform(MemcacheFlushResponse response) {
                return null;
              }
            }), DefaultValueProviders.<Void>nullValue());
  }

  @Override
  public Future<Stats> getStatistics() {
    return makeAsyncCall("Stats",  MemcacheStatsRequest.getDefaultInstance(),
        createRpcResponseHandler(MemcacheStatsResponse.getDefaultInstance(),
            "Memcache getStatistics: exception",
            new Transformer<MemcacheStatsResponse, Stats>() {
              @Override public Stats transform(MemcacheStatsResponse response) {
                return new StatsImpl(response.getStats());
              }
            }), DefaultValueProviders.emptyStats());
  }
}

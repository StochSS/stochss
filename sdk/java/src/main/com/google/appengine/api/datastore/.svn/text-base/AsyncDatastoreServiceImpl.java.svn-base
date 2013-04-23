// Copyright 2010 Google Inc. All rights reserved.

package com.google.appengine.api.datastore;

import static com.google.appengine.api.datastore.DatastoreApiHelper.makeAsyncCall;
import static com.google.appengine.api.datastore.DatastoreAttributes.DatastoreType.HIGH_REPLICATION;
import static com.google.appengine.api.datastore.FutureHelper.quietGet;
import static com.google.appengine.api.datastore.ImplicitTransactionManagementPolicy.AUTO;
import static com.google.appengine.api.datastore.ReadPolicy.Consistency.EVENTUAL;
import static com.google.appengine.api.datastore.ReadPolicy.Consistency.STRONG;

import com.google.appengine.api.datastore.DatastoreAttributes.DatastoreType;
import com.google.appengine.api.datastore.EntityCachingStrategy.PreGetCachingResult;
import com.google.appengine.api.datastore.EntityCachingStrategy.PreMutationCachingResult;
import com.google.appengine.api.datastore.FutureHelper.CumulativeAggregateFuture;
import com.google.appengine.api.datastore.Index.IndexState;
import com.google.appengine.api.datastore.Index.Property;
import com.google.appengine.api.datastore.Query.SortDirection;
import com.google.appengine.api.utils.FutureWrapper;
import com.google.apphosting.api.ApiBasePb.StringProto;
import com.google.apphosting.api.DatastorePb.AllocateIdsRequest;
import com.google.apphosting.api.DatastorePb.AllocateIdsResponse;
import com.google.apphosting.api.DatastorePb.CompositeIndices;
import com.google.apphosting.api.DatastorePb.DeleteRequest;
import com.google.apphosting.api.DatastorePb.DeleteResponse;
import com.google.apphosting.api.DatastorePb.GetRequest;
import com.google.apphosting.api.DatastorePb.GetResponse;
import com.google.apphosting.api.DatastorePb.PutRequest;
import com.google.apphosting.api.DatastorePb.PutResponse;
import com.google.common.base.Pair;
import com.google.common.collect.Lists;
import com.google.common.collect.Sets;
import com.google.io.protocol.Protocol;
import com.google.storage.onestore.v3.OnestoreEntity.CompositeIndex;
import com.google.storage.onestore.v3.OnestoreEntity.EntityProto;
import com.google.storage.onestore.v3.OnestoreEntity.Reference;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.Future;
import java.util.logging.Level;

/**
 * Implements AsyncDatastoreService by making calls to ApiProxy.
 *
 */
class AsyncDatastoreServiceImpl extends BaseDatastoreServiceImpl
      implements AsyncDatastoreService, CurrentTransactionProvider {

  /***
   * An aggregate future that uses an iterator to match results to requested elements.
   *
   * @param <K> response type
   * @param <I> type being iterated over
   * @param <V> result type
   */
  private abstract static class IteratingAggregateFuture<K, I, V>
      extends CumulativeAggregateFuture<K, Pair<Iterator<I>, V>, V> {
    public IteratingAggregateFuture(Iterable<Future<K>> futures) {
      super(futures);
    }

    protected abstract V aggregate(K intermediateResult, Iterator<I> iterator, V result);
    protected abstract Iterator<I> initIterator();
    protected abstract V initResult();

    @Override
    protected final Pair<Iterator<I>, V> aggregate(K intermediateResult,
        Pair<Iterator<I>, V> result) {
      return Pair.of(result.first, aggregate(intermediateResult, result.first, result.second));
    }

    @Override
    protected V finalizeResult(Pair<Iterator<I>, V> result) {
      return result.second;
    }

    @Override
    protected final Pair<Iterator<I>, V> initIntermediateResult() {
      return Pair.of(initIterator(), initResult());
    }
  }

  /**
   * Models an item and its associated index in some ordered collection.
   *
   * @param <T> The type of the item.
   */
  static class IndexedItem<T> implements Comparable<IndexedItem<T>> {
    final T item;
    final int index;

    IndexedItem(T item, int index) {
      this.item = item;
      this.index = index;
    }

    @Override
    public int compareTo(IndexedItem<T> other) {
      return Integer.valueOf(index).compareTo(other.index);
    }
  }

  /**
   * {@link Iterable} implementation that converts a
   * Iterable<IndexedItem<T>> to a Iterable<T>.
   */
  private static class UnwrappingIterable<T> implements Iterable<T> {
    private final Iterable<IndexedItem<T>> innerIterable;

    private UnwrappingIterable(Iterable<IndexedItem<T>> innerIterable) {
      this.innerIterable = innerIterable;
    }

    @Override
    public Iterator<T> iterator() {
      return new AbstractIterator<T>() {
        Iterator<IndexedItem<T>> inner = innerIterable.iterator();
        @Override
        protected T computeNext() {
          if (inner.hasNext()) {
            return inner.next().item;
          }
          endOfData();
          return null;
        }
      };
    }
  }

  /**
   * A class that knows how to group items by entity group.
   * @param <T> The type of item.
   */
  abstract static class EntityGroupGrouper<T> {

    /**
     * Arranges the given items by entity group.
     *
     * @param items The items to arrange by entity group.
     * @return A {@link Collection} of {@link List Lists} where each
     * {@link List} contains all items belonging to the same entity group.
     */
    public Collection<List<T>> getItemsByEntityGroup(Iterable<T> items) {
      Map<Key, List<T>> entitiesByEntityGroup = new LinkedHashMap<Key, List<T>>();
      for (T item : items) {
        Key entityGroupKey = extractEntityGroupKey(item);
        List<T> entitiesInGroup = entitiesByEntityGroup.get(entityGroupKey);
        if (entitiesInGroup == null) {
          entitiesInGroup = new ArrayList<T>();
          entitiesByEntityGroup.put(entityGroupKey, entitiesInGroup);
        }
        entitiesInGroup.add(item);
      }
      return entitiesByEntityGroup.values();
    }

    static Key getEntityGroupKey(Key key) {
      Key curKey = key;
      while (curKey.getParent() != null) {
        curKey = curKey.getParent();
      }
      return curKey;
    }

    /**
     * Given an item, extract the entity group key.
     */
    abstract Key extractEntityGroupKey(T item);
  }

  /**
   * {@link EntityGroupGrouper} that groups entities by their entity groups.
   */
  static final EntityGroupGrouper<IndexedItem<Entity>> ENTITY_GROUPER =
      new EntityGroupGrouper<IndexedItem<Entity>>() {
    @Override
    Key extractEntityGroupKey(IndexedItem<Entity> item) {
      return getEntityGroupKey(item.item.getKey());
    }
  };

  /**
   * {@link EntityGroupGrouper} that groups keys by their entity groups.
   */
  static final EntityGroupGrouper<Key> KEY_GROUPER = new EntityGroupGrouper<Key>() {
    @Override
    Key extractEntityGroupKey(Key key) {
      return getEntityGroupKey(key);
    }
  };

  private DatastoreType datastoreType;

  public AsyncDatastoreServiceImpl(
      DatastoreServiceConfig datastoreServiceConfig, TransactionStack defaultTxnProvider) {
    super(validateDatastoreServiceConfig(datastoreServiceConfig), defaultTxnProvider);
  }

  /**
   * @param datastoreServiceConfig Config to validate.
   * @return The config that was passed in as a parameter.
   */
  private static DatastoreServiceConfig validateDatastoreServiceConfig(
      DatastoreServiceConfig datastoreServiceConfig) {
    if (datastoreServiceConfig.getImplicitTransactionManagementPolicy() == AUTO) {
      throw new IllegalArgumentException("The async datastore service does not support an "
          + "implicit transaction management policy of AUTO");
    }
    return datastoreServiceConfig;
  }

  @Override
  public Future<Entity> get(Key key) {
    GetOrCreateTransactionResult result = getOrCreateTransaction();
    return get(result.getTransaction(), key);
  }

  @Override
  public Future<Entity> get( Transaction txn, final Key key) {
    if (key == null) {
      throw new NullPointerException("key cannot be null");
    }
    Future<Map<Key, Entity>> entities = get(txn, Arrays.asList(key));
    return new FutureWrapper<Map<Key, Entity>, Entity>(entities) {
      @Override
      protected Entity wrap(Map<Key, Entity> entities) throws Exception {
        Entity entity = entities.get(key);
        if (entity == null) {
          throw new EntityNotFoundException(key);
        }
        return entity;
      }

      @Override
      protected Throwable convertException(Throwable cause) {
        return cause;
      }
    };
  }

  @Override
  public Future<Map<Key, Entity>> get(Iterable<Key> keys) {
    GetOrCreateTransactionResult result = getOrCreateTransaction();
    return get(result.getTransaction(), keys);
  }

  @Override
  public Future<Map<Key, Entity>> get(Transaction txn, Iterable<Key> keys) {
    if (keys == null) {
      throw new NullPointerException("keys cannot be null");
    }

    List<Key> keyList = Lists.newArrayList(keys);

    final Map<Key, Entity> resultMap = new HashMap<Key, Entity>();
    PreGetContext preGetContext = new PreGetContext(this, keyList, resultMap);
    getDatastoreServiceConfig().getDatastoreCallbacks().executePreGetCallbacks(preGetContext);
    if (!resultMap.isEmpty()) {
      keyList.removeAll(resultMap.keySet());
    }
    PreGetCachingResult preGetCachingResult =
        getEntityCachingStrategy().preGet(this, keyList, resultMap);
    keyList.removeAll(preGetCachingResult.getKeysToSkipLoading());
    Future<Map<Key, Entity>> result = null;
    if (txn == null && getDatastoreServiceConfig().getReadPolicy().getConsistency() == STRONG &&
        getDatastoreType() == HIGH_REPLICATION) {
      Collection<List<Key>> keysByEntityGroup = KEY_GROUPER.getItemsByEntityGroup(keyList);
      if (keysByEntityGroup.size() > 1) {
        result = doBatchGetByEntityGroups(keysByEntityGroup, resultMap);
      }
    }
    if (result == null) {
      result = doBatchGetBySize(txn, keyList, resultMap);
    }
    result = getEntityCachingStrategy().createPostGetFuture(result, preGetCachingResult);
    return new PostLoadFuture(result, getDatastoreServiceConfig().getDatastoreCallbacks(), this);
  }

  /**
   * Executes a batch get, possibly by splitting into multiple rpcs to keep
   * each rpc smaller than the maximum size.
   *
   * @param txn The transaction in which to execute the batch get.  Can be
   * null.
   * @param keys The {@link Key keys} of the entities to fetch.
   *
   * @return A {@link Future} that provides the results of the operation.
   */
  private Future<Map<Key, Entity>> doBatchGetBySize( Transaction txn,
      final Iterable<Key> keys, final Map<Key, Entity> resultMap) {
    GetRequest baseReq = new GetRequest();
    if (txn != null) {
      TransactionImpl.ensureTxnActive(txn);
      baseReq.setTransaction(localTxnToRemoteTxn(txn));
    }
    if (getDatastoreServiceConfig().getReadPolicy().getConsistency() == EVENTUAL) {
      baseReq.setFailoverMs(ARBITRARY_FAILOVER_READ_MS);
      baseReq.setStrong(false);
    }
    final int baseEncodedReqSize = baseReq.encodingSize();

    final List<Future<GetResponse>> futures = new ArrayList<Future<GetResponse>>();
    GetRequest req = baseReq.clone();
    int encodedReqSize = baseEncodedReqSize;
    for (Key key : keys) {
      if (!key.isComplete()) {
        throw new IllegalArgumentException(key + " is incomplete.");
      }
      Reference ref = KeyTranslator.convertToPb(key);

      int encodedKeySize = Protocol.stringSize(ref.encodingSize()) + 1;
      if (getDatastoreServiceConfig().exceedsReadLimits(
          req.keySize() + 1, encodedReqSize + encodedKeySize)) {
        futures.add(makeAsyncCall(apiConfig, "Get", req, new GetResponse()));
        encodedReqSize = baseEncodedReqSize;
        req = baseReq.clone();
      }

      encodedReqSize += encodedKeySize;
      req.addKey(ref);
    }

    if (req.keySize() > 0) {
      futures.add(makeAsyncCall(apiConfig, "Get", req, new GetResponse()));
    }

    return registerInTransaction(txn,
        new IteratingAggregateFuture<GetResponse, Key, Map<Key, Entity>>(futures) {
          @Override
          protected Map<Key, Entity> initResult() {
            return resultMap;
          }

          @Override
          protected Iterator<Key> initIterator() {
            return keys.iterator();
          }

          @Override
          protected Map<Key, Entity> aggregate(GetResponse response, Iterator<Key> keyIterator,
              Map<Key, Entity> results) {
            for (GetResponse.Entity responseEntity : response.entitys()) {
              Key key = keyIterator.next();
              if (responseEntity.hasEntity()) {
                results.put(key, EntityTranslator.createFromPb(responseEntity.getEntity()));
              }
            }
            return results;
          }
        });
  }

  /**
   * Executes a batch get by executing multiple rpcs in parallel.  Should only
   * be used for HRD apps.
   *
   * @param keysByEntityGroup A {@link Collection} of {@link List Lists} where
   * all keys in each list belong to the same entity group.
   *
   * @return A {@link Future} that provides the results of all the get() rpcs.
   */
  private Future<Map<Key, Entity>> doBatchGetByEntityGroups(
      Collection<List<Key>> keysByEntityGroup, final Map<Key, Entity> resultMap) {
    List<Future<Map<Key, Entity>>> subFutures = new ArrayList<Future<Map<Key, Entity>>>();
    List<Key> keysToGet = new ArrayList<Key>();
    int numEntityGroups = 0;
    for (List<Key> keysInGroup : keysByEntityGroup) {
      keysToGet.addAll(keysInGroup);
      numEntityGroups++;
      if (numEntityGroups == getDatastoreServiceConfig().getMaxEntityGroupsPerRpcInternal()) {
        subFutures.add(doBatchGetBySize(null, keysToGet, resultMap));
        keysToGet = new ArrayList<Key>();
        numEntityGroups = 0;
      }
    }
    if (!keysToGet.isEmpty()) {
      subFutures.add(doBatchGetBySize(null, keysToGet, resultMap));
    }
    return new CumulativeAggregateFuture<Map<Key, Entity>, Map<Key, Entity>, Map<Key, Entity>>(
        subFutures) {
      @Override
      protected Map<Key, Entity> initIntermediateResult() {
        return resultMap;
      }

      @Override
      protected Map<Key, Entity> aggregate(Map<Key, Entity> intermediateResult,
          Map<Key, Entity> result) {
        intermediateResult.putAll(result);
        return intermediateResult;
      }

      @Override
      protected Map<Key, Entity> finalizeResult(Map<Key, Entity> result) {
        return result;
      }
    };
  }

  @Override
  public Future<Key> put(Entity entity) {
    GetOrCreateTransactionResult result = getOrCreateTransaction();
    return put(result.getTransaction(), entity);
  }

  @Override
  public Future<Key> put(Transaction txn, Entity entity) {
    return new FutureWrapper<List<Key>, Key>(put(txn, Arrays.asList(entity))) {
      @Override
      protected Key wrap(List<Key> keys) throws Exception {
        return keys.get(0);
      }

      @Override
      protected Throwable convertException(Throwable cause) {
        return cause;
      }
    };
  }

  @Override
  public Future<List<Key>> put(Iterable<Entity> entities) {
    GetOrCreateTransactionResult result = getOrCreateTransaction();
    return put(result.getTransaction(), entities);
  }

  @Override
  public Future<List<Key>> put( Transaction txn, Iterable<Entity> entities) {
    List<Entity> entityList = List.class.isAssignableFrom(entities.getClass()) ?
                                    (List<Entity>) entities : Lists.newArrayList(entities);
    PutContext prePutContext = new PutContext(this, entityList);
    getDatastoreServiceConfig().getDatastoreCallbacks().executePrePutCallbacks(prePutContext);
    PreMutationCachingResult preMutationCachingResult =
        getEntityCachingStrategy().prePut(this, entityList);

    List<IndexedItem<Key>> indexedKeysToSkip = Lists.newArrayList();
    List<IndexedItem<Entity>> indexedEntitiesToPut = Lists.newArrayList();
    Set<Key> mutationKeysToSkip = preMutationCachingResult.getMutationKeysToSkip();
    int index = 0;
    for (Entity entity : entityList) {
      if (mutationKeysToSkip.contains(entity.getKey())) {
        indexedKeysToSkip.add(new IndexedItem<Key>(entity.getKey(), index++));
      } else {
        indexedEntitiesToPut.add(new IndexedItem<Entity>(entity, index++));
      }
    }

    Future<List<IndexedItem<Key>>> partialResult = null;
    if (txn == null) {
      Collection<List<IndexedItem<Entity>>> entitiesByEntityGroup =
          ENTITY_GROUPER.getItemsByEntityGroup(indexedEntitiesToPut);
      if (entitiesByEntityGroup.size() > 1) {
        partialResult = doIndexedEntityBatchPutByEntityGroups(entitiesByEntityGroup);
      }
    }
    if (partialResult == null) {
      partialResult = doIndexedEntityBatchPutBySize(txn, indexedEntitiesToPut);
    }

    Future<List<Key>> result = combineAndSortPutResult(partialResult, indexedKeysToSkip);

    if (txn == null) {
      result =
          getEntityCachingStrategy().createPostMutationFuture(result, preMutationCachingResult);
      PutContext postPutContext = new PutContext(this, entityList);
      result = new PostPutFuture(result, getDatastoreServiceConfig().getDatastoreCallbacks(),
          postPutContext);
    } else {
      defaultTxnProvider.addPutEntities(txn, entityList);
    }
    return result;
  }

  /**
   * Combines and sorts the results of a put operation.
   *
   * @param rpcResult the results from the put RPC.
   * @param skippedKeys the keys that were skipped for mutation by the pre-put-callbacks.
   * @return the keys that were assigned to the entities that were put. The keys are in the same
   *     order as the entities specified to the put request.
   */
  private Future<List<Key>> combineAndSortPutResult(Future<List<IndexedItem<Key>>> rpcResult,
      final List<IndexedItem<Key>> skippedKeys) {
    return new FutureWrapper<List<IndexedItem<Key>>, List<Key>>(rpcResult) {
      @Override
      protected List<Key> wrap(List<IndexedItem<Key>> unorderedResult) throws Exception {
        unorderedResult.addAll(skippedKeys);
        Collections.sort(unorderedResult);
        List<Key> orderedResult = Lists.newArrayListWithCapacity(unorderedResult.size());
        for (IndexedItem<Key> key : unorderedResult) {
          orderedResult.add(key.item);
        }
        return orderedResult;
      }

      @Override
      protected Throwable convertException(Throwable cause) {
        return cause;
      }
    };
  }

  /**
   * Executes a batch put, possibly by splitting into multiple rpcs to keep
   * each rpc smaller than the maximum size.
   *
   * @param txn The transaction in which to execute the batch put.  Can be
   * null.
   * @param entities The {@link Entity entities} to fetch.
   *
   * @return A {@link Future} that provides the results of the operation.
   */
  private Future<List<Key>> doBatchPutBySize( Transaction txn,
      final Iterable<Entity> entities) {
    PutRequest baseReq = new PutRequest();
    if (txn != null) {
      TransactionImpl.ensureTxnActive(txn);
      baseReq.setTransaction(localTxnToRemoteTxn(txn));
    }
    final int baseEncodedReqSize = baseReq.encodingSize();
    final List<Future<PutResponse>> futures = new ArrayList<Future<PutResponse>>();
    int encodedReqSize = baseEncodedReqSize;
    PutRequest req = baseReq.clone();
    for (Entity entity : entities) {
      EntityProto proto = EntityTranslator.convertToPb(entity);
      int encodedEntitySize = Protocol.stringSize(proto.encodingSize()) + 1;
      if (getDatastoreServiceConfig().exceedsWriteLimits(
          req.entitySize() + 1, encodedReqSize + encodedEntitySize)) {
        futures.add(makeAsyncCall(apiConfig, "Put", req, new PutResponse()));
        encodedReqSize = baseEncodedReqSize;
        req = baseReq.clone();
      }

      encodedReqSize += encodedEntitySize;
      req.addEntity(proto);
    }

    if (req.entitySize() > 0) {
      futures.add(makeAsyncCall(apiConfig, "Put", req, new PutResponse()));
    }

    return registerInTransaction(txn,
        new IteratingAggregateFuture<PutResponse, Entity, List<Key>>(futures) {
          @Override
          protected List<Key> initResult() {
            return new ArrayList<Key>();
          }

          @Override
          protected Iterator<Entity> initIterator() {
            return entities.iterator();
          }

          @Override
          protected List<Key> aggregate(PutResponse intermediateResult,
              Iterator<Entity> entitiesIterator, List<Key> keysInOrder) {
            for (Reference reference : intermediateResult.keys()) {
              Entity entity = entitiesIterator.next();
              KeyTranslator.updateKey(reference, entity.getKey());
              keysInOrder.add(entity.getKey());
            }
            return keysInOrder;
          }
    });
  }

  /**
   * Executes a batch put by executing multiple rpcs in parallel.
   *
   * @param entitiesByEntityGroup A {@link Collection} of {@link List Lists}
   * where all entities in each list belong to the same entity group.
   *
   * @return A {@link Future} that provides the results of all the put() rpcs.
   */
  private Future<List<IndexedItem<Key>>> doIndexedEntityBatchPutByEntityGroups(
      Collection<List<IndexedItem<Entity>>> entitiesByEntityGroup) {
    List<Future<List<IndexedItem<Key>>>> subFutures =
        new ArrayList<Future<List<IndexedItem<Key>>>>();
    List<IndexedItem<Entity>> entitiesToPut = new ArrayList<IndexedItem<Entity>>();
    int numEntityGroups = 0;
    for (List<IndexedItem<Entity>> indexedEntitiesInGroup : entitiesByEntityGroup) {
      entitiesToPut.addAll(indexedEntitiesInGroup);
      numEntityGroups++;
      if (numEntityGroups == getDatastoreServiceConfig().getMaxEntityGroupsPerRpcInternal()) {
        assemblePutFuture(entitiesToPut, subFutures);
        numEntityGroups = 0;
      }
    }
    if (!entitiesToPut.isEmpty()) {
      assemblePutFuture(entitiesToPut, subFutures);
    }
    return new IndexedKeyAggregateFuture(subFutures);
  }

  /**
   * Assembles a {@link Future} that puts the provided entities and then adds
   * that Future to the provided {@link List}.
   *
   * @param entitiesToPut The entities to put.
   * @param subFutures The list of Futures.
   */
  private void assemblePutFuture(List<IndexedItem<Entity>> entitiesToPut,
      List<Future<List<IndexedItem<Key>>>> subFutures) {
    subFutures.add(doIndexedEntityBatchPutBySize(null, entitiesToPut));
    entitiesToPut.clear();
  }

  /**
   * Executes a batch put, possibly by splitting into multiple rpcs to keep each rpc smaller
   * than the maximum size, and retains the order in which the entities were specified to the
   * put request.
   *
   * @param txn The transaction in which to execute the batch put.
   * @param entities The {@link Entity entities} to update.
   * @return A {@link Future} that provides the results of the operation along with the
   *     API ordering information.
   */
  private Future<List<IndexedItem<Key>>> doIndexedEntityBatchPutBySize( Transaction txn, List<IndexedItem<Entity>> entities) {
    final List<IndexedItem<Entity>> entitiesToPutCopy =
        new ArrayList<IndexedItem<Entity>>(entities);
    Iterable<Entity> unwrappedEntitiesToPut = new UnwrappingIterable<Entity>(entitiesToPutCopy);
    Future<List<Key>> future = doBatchPutBySize(txn, unwrappedEntitiesToPut);
    return new FutureWrapper<List<Key>, List<IndexedItem<Key>>>(future) {
      @Override
      protected List<IndexedItem<Key>> wrap(List<Key> keys) throws Exception {
        List<IndexedItem<Key>> orderedKeys = new ArrayList<IndexedItem<Key>>(keys.size());
        int keyIndex = 0;
        for (Key key : keys) {
          orderedKeys.add(new IndexedItem<Key>(key, entitiesToPutCopy.get(keyIndex++).index));
        }
        return orderedKeys;
      }

      @Override
      protected Throwable convertException(Throwable cause) {
        return cause;
      }
    };
  }

  /**
   * {@link CumulativeAggregateFuture} implementation that operates on Futures
   * that return List<IndexedItem<Key>>.  The final result produced by this
   * Future returns the Keys sorted by their indexes.
   */
  private static class IndexedKeyAggregateFuture extends
      CumulativeAggregateFuture<List<IndexedItem<Key>>, List<IndexedItem<Key>>,
      List<IndexedItem<Key>>> {
    private IndexedKeyAggregateFuture(Iterable<Future<List<IndexedItem<Key>>>> futures) {
      super(futures);
    }

    @Override
    protected List<IndexedItem<Key>> initIntermediateResult() {
      return new ArrayList<IndexedItem<Key>>();
    }

    @Override
    protected List<IndexedItem<Key>> aggregate(
        List<IndexedItem<Key>> intermediateResult,
        List<IndexedItem<Key>> result) {
      intermediateResult.addAll(result);
      return intermediateResult;
    }

    @Override
    protected List<IndexedItem<Key>> finalizeResult(List<IndexedItem<Key>> result) {
      return result;
    }
  }

  @Override
  public Future<Void> delete(Key... keys) {
    GetOrCreateTransactionResult result = getOrCreateTransaction();
    return delete(result.getTransaction(), keys);
  }

  @Override
  public Future<Void> delete(Transaction txn, Key... keys) {
    return delete(txn, Arrays.asList(keys));
  }

  @Override
  public Future<Void> delete(Iterable<Key> keys) {
    GetOrCreateTransactionResult result = getOrCreateTransaction();
    return delete(result.getTransaction(), keys);
  }

  @Override
  public Future<Void> delete(Transaction txn, Iterable<Key> keys) {
    List<Key> allKeys =
        List.class.isAssignableFrom(keys.getClass()) ? (List<Key>) keys : Lists.newArrayList(keys);
    DeleteContext preDeleteContext = new DeleteContext(this, allKeys);
    getDatastoreServiceConfig().getDatastoreCallbacks().executePreDeleteCallbacks(preDeleteContext);
    PreMutationCachingResult preMutationCachingResult =
        getEntityCachingStrategy().preDelete(this, allKeys);
    Future<Void> result = null;
    Iterable<Key> keysToDelete;
    Set<Key> keysToSkip = preMutationCachingResult.getMutationKeysToSkip();
    if (keysToSkip.isEmpty()) {
      keysToDelete = allKeys;
    } else {
      Set<Key> keySet = Sets.newHashSet(allKeys);
      keySet.removeAll(keysToSkip);
      keysToDelete = keySet;
    }
    if (txn == null) {
      Collection<List<Key>> keysByEntityGroup = KEY_GROUPER.getItemsByEntityGroup(keysToDelete);
      if (keysByEntityGroup.size() > 1) {
        result = doBatchDeleteByEntityGroups(keysByEntityGroup);
      }
    }
    if (result == null) {
      result = doBatchDeleteBySize(txn, keysToDelete);
    }
    if (txn == null) {
      result =
          getEntityCachingStrategy().createPostMutationFuture(result, preMutationCachingResult);
      result = new PostDeleteFuture(
          result, getDatastoreServiceConfig().getDatastoreCallbacks(),
          new DeleteContext(this, allKeys));
    } else {
      defaultTxnProvider.addDeletedKeys(txn, allKeys);
    }
    return result;
  }

  /**
   * Executes a batch delete, possibly by splitting into multiple rpcs to keep
   * each rpc smaller than the maximum size.
   *
   * @param txn The transaction in which to execute the batch delete.  Can be
   * null.
   * @param keys The {@link Key keys} of the entities to delete.
   *
   * @return A {@link Future} that provides the results of the operation.
   */
  private Future<Void> doBatchDeleteBySize( Transaction txn, Iterable<Key> keys) {
    DeleteRequest baseReq = new DeleteRequest();

    if (txn != null) {
      TransactionImpl.ensureTxnActive(txn);
      baseReq.setTransaction(localTxnToRemoteTxn(txn));
    }
    final int baseEncodedReqSize = baseReq.encodingSize();

    final List<Future<DeleteResponse>> futures = new ArrayList<Future<DeleteResponse>>();
    int encodedReqSize = baseEncodedReqSize;
    DeleteRequest req = baseReq.clone();
    for (Key key : keys) {
      if (!key.isComplete()) {
        throw new IllegalArgumentException(key + " is incomplete.");
      }
      Reference ref = KeyTranslator.convertToPb(key);

      int encodedKeySize = Protocol.stringSize(ref.encodingSize()) + 1;
      if (getDatastoreServiceConfig().exceedsWriteLimits(
          req.keySize() + 1, encodedReqSize + encodedKeySize)) {
        futures.add(makeAsyncCall(apiConfig, "Delete", req, new DeleteResponse()));
        encodedReqSize = baseEncodedReqSize;
        req = baseReq.clone();
      }

      encodedReqSize += encodedKeySize;
      req.addKey(ref);
    }

    if (req.keySize() > 0) {
      futures.add(makeAsyncCall(apiConfig, "Delete", req, new DeleteResponse()));
    }

    return registerInTransaction(txn,
        new CumulativeAggregateFuture<DeleteResponse, Void, Void>(futures) {
          @Override
          protected Void aggregate(DeleteResponse intermediateResult, Void result) {
            return null;
          }

          @Override
          protected Void finalizeResult(Void result) {
            return null;
          }

          @Override
          protected Void initIntermediateResult() {
            return null;
          }
    });
  }

  /**
   * Executes a batch delete by executing multiple rpcs in parallel.
   *
   * @param keysByEntityGroup A {@link Collection} of {@link List Lists} where
   * all keys in each list belong to the same entity group.
   *
   * @return A {@link Future} that provides the results of all the delete()
   * rpcs.
   */
  private Future<Void> doBatchDeleteByEntityGroups(Collection<List<Key>> keysByEntityGroup) {
    List<Future<Void>> subFutures = new ArrayList<Future<Void>>();
    List<Key> keysToDelete = new ArrayList<Key>();
    int numEntityGroups = 0;
    for (List<Key> keysInGroup : keysByEntityGroup) {
      keysToDelete.addAll(keysInGroup);
      numEntityGroups++;
      if (numEntityGroups == getDatastoreServiceConfig().getMaxEntityGroupsPerRpcInternal()) {
        subFutures.add(doBatchDeleteBySize(null, keysToDelete));
        keysToDelete = new ArrayList<Key>();
        numEntityGroups = 0;
      }
    }
    if (!keysToDelete.isEmpty()) {
      subFutures.add(doBatchDeleteBySize(null, keysToDelete));
    }
    return new CumulativeAggregateFuture<Void, Void, Void>(subFutures) {
      @Override
      protected Void initIntermediateResult() {
        return null;
      }

      @Override
      protected Void aggregate(Void intermediateResult, Void result) {
        return null;
      }

      @Override
      protected Void finalizeResult(Void result) {
        return null;
      }
    };
  }

  @Override
  public Collection<Transaction> getActiveTransactions() {
    return defaultTxnProvider.getAll();
  }

  /**
   * Register the provided future with the provided txn so that we know to
   * perform a {@link java.util.concurrent.Future#get()} before the txn is
   * committed.
   *
   * @param txn The txn with which the future must be associated.
   * @param future The future to associate with the txn.
   * @param <T> The type of the Future
   * @return The same future that was passed in, for caller convenience.
   */
  private <T> Future<T> registerInTransaction( Transaction txn, Future<T> future) {
    if (txn != null) {
      defaultTxnProvider.addFuture(txn, future);
      return new FutureHelper.TxnAwareFuture<T>(future, txn, defaultTxnProvider);
    }
    return future;
  }

  @Override
  public Future<Transaction> beginTransaction() {
    return beginTransaction(TransactionOptions.Builder.withDefaults());
  }

  @Override
  public Future<Transaction> beginTransaction(TransactionOptions options) {
    return new FutureHelper.FakeFuture<Transaction>(beginTransactionInternal(options));
  }

  @Override
  public PreparedQuery prepare(Query query) {
    return prepare(null, query);
  }

  @Override
  public PreparedQuery prepare(Transaction txn, Query query) {
    PreQueryContext context = new PreQueryContext(this, query);
    getDatastoreServiceConfig().getDatastoreCallbacks().executePreQueryCallbacks(context);

    query = context.getElements().get(0);
    validateQuery(query);
    List<MultiQueryBuilder> queriesToRun = QuerySplitHelper.splitQuery(query);
    query.setFilter(null);
    query.getFilterPredicates().clear();
    if (queriesToRun.size() == 1 && queriesToRun.get(0).isSingleton()) {
      query.getFilterPredicates().addAll(queriesToRun.get(0).getBaseFilters());
      return new PreparedQueryImpl(apiConfig, getDatastoreServiceConfig(), query, txn);
    }
    return new PreparedMultiQuery(apiConfig, getDatastoreServiceConfig(), query, queriesToRun, txn);
  }

  @Override
  public Future<KeyRange> allocateIds(String kind, long num) {
    return allocateIds(null, kind, num);
  }

  static Reference buildAllocateIdsRef(
      Key parent, String kind, AppIdNamespace appIdNamespace) {
    if (parent != null && !parent.isComplete()) {
      throw new IllegalArgumentException("parent key must be complete");
    }
    Key key = new Key(kind, parent, Key.NOT_ASSIGNED, "ignored", appIdNamespace);
    return KeyTranslator.convertToPb(key);
  }

  @Override
  public Future<KeyRange> allocateIds(final Key parent, final String kind, long num) {
    if (num <= 0) {
      throw new IllegalArgumentException("num must be > 0");
    }

    if (num > 1000000000) {
      throw new IllegalArgumentException("num must be < 1 billion");
    }

    final AppIdNamespace appIdNamespace = getDatastoreServiceConfig().getAppIdNamespace();
    Reference allocateIdsRef = buildAllocateIdsRef(parent, kind, appIdNamespace);
    AllocateIdsRequest req =
        new AllocateIdsRequest().setSize(num).setModelKey(allocateIdsRef);
    AllocateIdsResponse resp = new AllocateIdsResponse();
    Future<AllocateIdsResponse> future = makeAsyncCall(apiConfig, "AllocateIds", req, resp);
    return new FutureWrapper<AllocateIdsResponse, KeyRange>(future) {
      @Override
      protected KeyRange wrap(AllocateIdsResponse resp) throws Exception {
        return new KeyRange(parent, kind, resp.getStart(), resp.getEnd(), appIdNamespace);
      }

      @Override
      protected Throwable convertException(Throwable cause) {
        return cause;
      }
    };
  }

  protected DatastoreType getDatastoreType() {
    if (datastoreType == null) {
      datastoreType = quietGet(getDatastoreAttributes()).getDatastoreType();
    }
    return datastoreType;
  }

  @Override
  public Future<DatastoreAttributes> getDatastoreAttributes() {
    String appId = getDatastoreServiceConfig().getAppIdNamespace().getAppId();
    DatastoreAttributes attributes = new DatastoreAttributes(appId);
    return new FutureHelper.FakeFuture<DatastoreAttributes>(attributes);
  }

  @Override
  public Future<Map<Index, IndexState>> getIndexes() {
    StringProto req = new StringProto();
    req.setValue(getDatastoreServiceConfig().getAppIdNamespace().getAppId());
    return new FutureWrapper<CompositeIndices, Map<Index, IndexState>>(
        makeAsyncCall(apiConfig, "GetIndices", req, new CompositeIndices())) {
      @Override
      protected Map<Index, IndexState> wrap(CompositeIndices indices) throws Exception {
        Map<Index, IndexState> answer = new LinkedHashMap<Index, IndexState>();
        for (CompositeIndex ci : indices.indexs()) {
          Index index = translateCompositeIndexProtobufToIndex(ci);
          switch (ci.getStateEnum()) {
            case DELETED:
              answer.put(index, IndexState.DELETING);
              break;
            case ERROR:
              answer.put(index, IndexState.ERROR);
              break;
            case READ_WRITE:
              answer.put(index, IndexState.SERVING);
              break;
            case WRITE_ONLY:
              answer.put(index, IndexState.BUILDING);
              break;
            default:
              logger.log(Level.WARNING, "Unrecognized index state for " + index);
              break;
          }
        }
        return answer;
      }

      @Override
      protected Throwable convertException(Throwable cause) {
        return cause;
      }
    };
  }

  static Index translateCompositeIndexProtobufToIndex(CompositeIndex ci) {
    String kind = ci.getDefinition().getEntityType();
    boolean isAncestor = ci.getDefinition().isAncestor();
    List<Property> properties = new ArrayList<Property>(ci.getDefinition().propertySize());
    for (com.google.storage.onestore.v3.OnestoreEntity.Index.Property p :
        ci.getDefinition().propertys()) {
      properties.add(
          new Property(p.getName(), SortDirection.valueOf(p.getDirectionEnum().name())));
    }
    Index index = new Index(ci.getId(), kind, isAncestor, properties);
    return index;
  }
}

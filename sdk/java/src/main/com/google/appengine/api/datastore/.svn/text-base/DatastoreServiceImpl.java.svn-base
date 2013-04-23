// Copyright 2007 Google Inc. All rights reserved.

package com.google.appengine.api.datastore;

import static com.google.appengine.api.datastore.FetchOptions.Builder.withLimit;
import static com.google.appengine.api.datastore.FutureHelper.quietGet;
import static com.google.appengine.api.datastore.ImplicitTransactionManagementPolicy.NONE;

import com.google.apphosting.api.DatastorePb;

import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.Map;

/**
 * Implements DatastoreService by making calls to ApiProxy.
 *
 */
final class DatastoreServiceImpl extends BaseDatastoreServiceImpl implements DatastoreService {

  final AsyncDatastoreServiceImpl async;

  public DatastoreServiceImpl(
      DatastoreServiceConfig datastoreServiceConfig, TransactionStack defaultTxnProvider) {
    super(datastoreServiceConfig, defaultTxnProvider);
    async = new AsyncDatastoreServiceImpl(
        disableAutoTxnCreation(datastoreServiceConfig), defaultTxnProvider);
  }

  /**
   * The async datastore service doesn't support implicit creation of txns so
   * if the provided config does auto-create, construct a config that does not.
   * @param datastoreServiceConfig Config that may have implicit txn creation
   * enabled.
   * @return A config with implicit creation of txns disabled.
   */
  private static DatastoreServiceConfig disableAutoTxnCreation(
      DatastoreServiceConfig datastoreServiceConfig) {
    if (datastoreServiceConfig.getImplicitTransactionManagementPolicy() == NONE) {
      return datastoreServiceConfig;
    }
    return new DatastoreServiceConfig(datastoreServiceConfig)
        .implicitTransactionManagementPolicy(NONE);
  }

  @Override
  public Entity get(Transaction txn, Key key) throws EntityNotFoundException {
    return quietGet(async.get(txn, key), EntityNotFoundException.class);
  }

  @Override
  public Entity get(Key key) throws EntityNotFoundException {
    Entity result = get(Collections.singleton(key)).get(key);
    if (result == null) {
      throw new EntityNotFoundException(key);
    }
    return result;
  }

  @Override
  public Map<Key, Entity> get(final Iterable<Key> keys) {
    final GetOrCreateTransactionResult result = getOrCreateTransaction();
    return new TransactionRunner<Map<Key, Entity>>(result.getTransaction(), result.isNew()) {
      @Override
      protected Map<Key, Entity> runInternal() {
        return quietGet(async.get(result.getTransaction(), keys));
      }
    }.runInTransaction();
  }

  @Override
  public Map<Key, Entity> get(Transaction txn, Iterable<Key> keys) {
    return quietGet(async.get(txn, keys));
  }

  @Override
  public Key put(Entity entity) {
    return put(Collections.singleton(entity)).get(0);
  }

  @Override
  public Key put(Transaction txn, Entity entity) {
    return quietGet(async.put(txn, entity));
  }

  @Override
  public List<Key> put(final Iterable<Entity> entities) {
    final GetOrCreateTransactionResult result = getOrCreateTransaction();
    return new TransactionRunner<List<Key>>(result.getTransaction(), result.isNew()) {
      @Override
      protected List<Key> runInternal() {
        return quietGet(async.put(result.getTransaction(), entities));
      }
    }.runInTransaction();
  }

  @Override
  public List<Key> put(Transaction txn, Iterable<Entity> entities) {
    return quietGet(async.put(txn, entities));
  }

  @Override
  public void delete(Key... keys) {
    delete(Arrays.asList(keys));
  }

  @Override
  public void delete(Transaction txn, Key... keys) {
    quietGet(async.delete(txn, keys));
  }

  @Override
  public void delete(final Iterable<Key> keys) {
    final GetOrCreateTransactionResult result = getOrCreateTransaction();
    new TransactionRunner<Void>(result.getTransaction(), result.isNew()) {
      @Override
      protected Void runInternal() {
        return quietGet(async.delete(result.getTransaction(), keys));
      }
    }.runInTransaction();
  }

  @Override
  public void delete(Transaction txn, Iterable<Key> keys) {
    quietGet(async.delete(txn, keys));
  }

  @Override
  public PreparedQuery prepare(Query query) {
    return async.prepare(query);
  }

  @Override
  public PreparedQuery prepare(Transaction txn, Query query) {
    return async.prepare(txn, query);
  }

  @Override
  public Collection<Transaction> getActiveTransactions() {
    return async.getActiveTransactions();
  }

  @Override
  public KeyRange allocateIds(String kind, long num) {
    return quietGet(async.allocateIds(kind, num));
  }

  @Override
  public KeyRange allocateIds(Key parent, String kind, long num) {
    return quietGet(async.allocateIds(parent, kind, num));
  }

  @Override
  public KeyRangeState allocateIdRange(KeyRange range) {
    Key parent = range.getParent();
    String kind = range.getKind();
    long start = range.getStart().getId();
    long end = range.getEnd().getId();

    DatastorePb.AllocateIdsRequest req = new DatastorePb.AllocateIdsRequest()
        .setModelKey(AsyncDatastoreServiceImpl.buildAllocateIdsRef(parent, kind, null))
        .setMax(end);
    DatastorePb.AllocateIdsResponse resp = new DatastorePb.AllocateIdsResponse();
    resp = quietGet(DatastoreApiHelper.makeAsyncCall(
        apiConfig, "AllocateIds", req, resp));

    Query query = new Query(kind).setKeysOnly();
    query.addFilter("__key__", Query.FilterOperator.GREATER_THAN_OR_EQUAL, range.getStart());
    query.addFilter("__key__", Query.FilterOperator.LESS_THAN_OR_EQUAL, range.getEnd());
    List<Entity> collision = prepare(query).asList(withLimit(1));

    if (!collision.isEmpty()) {
      return KeyRangeState.COLLISION;
    }

    boolean raceCondition = start < resp.getStart();
    return raceCondition ? KeyRangeState.CONTENTION : KeyRangeState.EMPTY;
  }

  @Override
  public Transaction beginTransaction() {
    return beginTransaction(TransactionOptions.Builder.withDefaults());
  }

  @Override
  public Transaction beginTransaction(TransactionOptions options) {
    return beginTransactionInternal(options);
  }

  @Override
  public DatastoreAttributes getDatastoreAttributes() {
    return quietGet(async.getDatastoreAttributes());
  }

  @Override
  public Map<Index, Index.IndexState> getIndexes() {
    return quietGet(async.getIndexes());
  }
}

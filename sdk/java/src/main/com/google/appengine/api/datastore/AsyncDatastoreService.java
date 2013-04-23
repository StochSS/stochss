// Copyright 2010 Google Inc. All Rights Reserved.
package com.google.appengine.api.datastore;

import java.util.List;
import java.util.Map;
import java.util.concurrent.Future;

/**
 * An asynchronous version of {@link DatastoreService}.  All methods return
 * immediately and provide {@link Future Futures} as their return values.
 * <p>
 * The key difference between implementations of {@link AsyncDatastoreService}
 * and implementations of {@link DatastoreService} is that async
 * implementations do not perform implicit transaction management.  The reason
 * is that implicit transaction management requires automatic commits of some
 * transactions, and without some sort of callback mechanism there is no way
 * to determine that a put/get/delete that has been implicitly enrolled in a
 * transaction is complete and therefore ready to be committed.  See
 * {@link ImplicitTransactionManagementPolicy} for more information.
 *
 */
public interface AsyncDatastoreService extends BaseDatastoreService {

  /**
   * @see DatastoreService#beginTransaction()
   */
  Future<Transaction> beginTransaction();

  /**
   * @see DatastoreService#beginTransaction(TransactionOptions)
   */
  Future<Transaction> beginTransaction(TransactionOptions options);

  /**
   * @see DatastoreService#get(Key)
   */
  Future<Entity> get(Key key);

  /**
   * @see DatastoreService#get(Transaction, Key)
   */
  Future<Entity> get(Transaction txn, Key key);

  /**
   * @see DatastoreService#get(Iterable)
   */
  Future<Map<Key, Entity>> get(Iterable<Key> keys);

  /**
   * @see DatastoreService#get(Transaction, Iterable)
   */
  Future<Map<Key, Entity>> get(Transaction txn, Iterable<Key> keys);

  /**
   * @see DatastoreService#put(Entity)
   */
  Future<Key> put(Entity entity);

  /**
   * @see DatastoreService#put(Transaction, Entity)
   */
  Future<Key> put(Transaction txn, Entity entity);

  /**
   * @see DatastoreService#put(Iterable)
   */
  Future<List<Key>> put(Iterable<Entity> entities);

  /**
   * @see DatastoreService#put(Transaction, Iterable)
   */
  Future<List<Key>> put(Transaction txn, Iterable<Entity> entities);

  /**
   * @see DatastoreService#delete(Key...)
   */
  Future<Void> delete(Key... keys);

  /**
   * @see DatastoreService#delete(Transaction, Iterable)
   */
  Future<Void> delete(Transaction txn, Key... keys);

  /**
   * @see DatastoreService#delete(Iterable)
   */
  Future<Void> delete(Iterable<Key> keys);

  /**
   * @see DatastoreService#delete(Transaction, Iterable)
   */
  Future<Void> delete(Transaction txn, Iterable<Key> keys);

  /**
   * @see DatastoreService#allocateIds(String, long)
   */
  Future<KeyRange> allocateIds(String kind, long num);

  /**
   * @see DatastoreService#allocateIds(Key, String, long)
   */
  Future<KeyRange> allocateIds(Key parent, String kind, long num);

  /**
   * @see DatastoreService#getDatastoreAttributes()
   */
  Future<DatastoreAttributes> getDatastoreAttributes();

  /**
   * @see DatastoreService#getIndexes()
   */
  Future<Map<Index, Index.IndexState>> getIndexes();
}

// Copyright 2013 Google Inc. All Rights Reserved.
package com.google.appengine.api.datastore;

import static com.google.appengine.api.datastore.DatastoreServiceConfig.Builder.withDefaults;
import static com.google.common.base.Preconditions.checkArgument;
import static com.google.common.base.Preconditions.checkNotNull;

import com.google.appengine.api.datastore.Index.IndexState;
import com.google.apphosting.api.AppEngineInternal;

import java.util.Arrays;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.concurrent.Future;

/**
 * An AsyncDatastoreService implementation that is pinned to a specific appId and namesapce.
 * This implementation ignores the "current" appId provided by
 * {@code ApiProxy.getCurrentEnvironment().getAppId()} and the "current" namespace provided
 * by {@code NamespaceManager.get()}.
 * Note, this is particularly important in the following methods:<ul>
 * <li>{@link  AsyncDatastoreService#getIndexes()}</li>
 * <li>{@link AsyncDatastoreService#getDatastoreAttributes()}</li>
 * <li>{@link AsyncDatastoreService#allocateIds(String, long)}</li></ul>
 *
 * In addition this class provides ways to create {@link Query}, {@link Entity} and {@link Key}
 * that are pinned to the same appId/namespace.
 *
 * <p>Note: users should not access this class directly.
 *
 */
@AppEngineInternal
public final class AdminDatastoreService implements AsyncDatastoreService {

  /**
   * A {@link Query} builder that pins it to the AdminUtils {@code appId}
   * and {@code namespace}.
   */
  public static final class QueryBuilder {

    private final AppIdNamespace appIdNamespace;
    private String kind;

    private QueryBuilder(AppIdNamespace appIdNamespace) {
      this.appIdNamespace = appIdNamespace;
    }

    public QueryBuilder setKind(String kind) {
      this.kind = kind;
      return this;
    }

    public String getKind() {
      return kind;
    }

    public Query build() {
      return new Query(kind, null, null, false, appIdNamespace, false, null);
    }
  }

  private abstract static class AbstractKeyBuilder<T extends AbstractKeyBuilder<T>> {
    protected final AppIdNamespace appIdNamespace;
    protected String kind;
    protected String name;
    protected Long id;
    protected Key parent;

    protected AbstractKeyBuilder(AppIdNamespace appIdNamespace, String kind) {
      this.appIdNamespace = appIdNamespace;
      setKind(kind);
    }

    public String getKind() {
      return kind;
    }

    @SuppressWarnings("unchecked")
    public T setKind(String kind) {
      checkNotNull(kind);
      this.kind = kind;
      return (T) this;
    }

    public String getName() {
      return name;
    }

    @SuppressWarnings("unchecked")
    public T setName(String name) {
      this.name = name;
      return (T) this;
    }

    public Long getId() {
      return id;
    }

    protected long getIdAsPrimitiveLong() {
      return id == null ? Key.NOT_ASSIGNED : id;
    }

    @SuppressWarnings("unchecked")
    public T setId(Long id) {
      this.id = id;
      return (T) this;
    }

    public Key getParent() {
      return parent;
    }

    /**
     * When {@code parent} is not {@code null} its application and namespace will be used
     * instead of the ones associated with AdminUtils.
     */
    @SuppressWarnings("unchecked")
    public T setParent(Key parent) {
      this.parent = parent;
      return (T) this;
    }

    protected Key createKey() {
      return new Key(kind, parent, getIdAsPrimitiveLong(), name, appIdNamespace);
    }
  }

  /**
   * A {@link Key} builder that pins it to the AdminUtils {@code appId}
   * and {@code namespace}.
   */
  public static final class KeyBuilder extends AbstractKeyBuilder<KeyBuilder> {

    private KeyBuilder(AppIdNamespace appIdNamespace, String kind) {
      super(appIdNamespace, kind);
    }

    public Key build() {
      return createKey();
    }
  }

  /**
   * An {@link Entity} builder that pins it to the AdminUtils {@code appId}
   * and {@code namespace}.
   */
  public static final class EntityBuilder extends AbstractKeyBuilder<EntityBuilder> {

    private EntityBuilder(AppIdNamespace appIdNamespace, String kind) {
      super(appIdNamespace, kind);
    }

    public Entity build() {
      return new Entity(createKey());
    }
  }

  private final AsyncDatastoreServiceImpl delegate;
  private final AppIdNamespace appIdNamespace;

  interface AsyncDatastoreServiceImplFactory {
    AsyncDatastoreServiceImpl getInstance(DatastoreServiceConfig config);
  }

  static AsyncDatastoreServiceImplFactory factory = new AsyncDatastoreServiceImplFactory() {
    @Override public AsyncDatastoreServiceImpl getInstance(DatastoreServiceConfig config) {
      return (AsyncDatastoreServiceImpl) DatastoreServiceFactory.getAsyncDatastoreService(config);
    }
  };

  private AdminDatastoreService(DatastoreServiceConfig config, String appId, String namespace) {
    appIdNamespace = new AppIdNamespace(appId, namespace);
    config = new DatastoreServiceConfig(config).appIdNamespace(appIdNamespace);
    delegate = factory.getInstance(config);
  }

  /**
   * Returns an AdminUtils instance for the given {@code appId} and the "" (empty) namespace.
   */
  public static AdminDatastoreService getInstance(String appId) {
    return getInstance(withDefaults(), appId, "");
  }

  /**
   * Returns an AdminUtils instance for the given {@code appId} and {@code namespace}.
   */
  public static AdminDatastoreService getInstance(String appId, String namespace) {
    return getInstance(withDefaults(), appId, namespace);
  }

  /**
   * Returns an AdminUtils instance for the given {@code appId} and the "" (empty) namespace.
   */
  public static AdminDatastoreService getInstance(DatastoreServiceConfig config, String appId) {
    return getInstance(config, appId, "");
  }

  /**
   * Returns an AdminUtils instance for the given {@code appId} and {@code namespace}.
   */
  public static AdminDatastoreService getInstance(
      DatastoreServiceConfig config, String appId, String namespace) {
    return new AdminDatastoreService(config, appId, namespace);
  }

  public String getAppId() {
    return appIdNamespace.getAppId();
  }

  public String getNamespace() {
    return appIdNamespace.getNamespace();
  }

  DatastoreServiceConfig getDatastoreServiceConfig() {
    return delegate.getDatastoreServiceConfig();
  }

  public QueryBuilder newQueryBuilder() {
    return new QueryBuilder(appIdNamespace);
  }

  public QueryBuilder newQueryBuilder(String kind) {
    return new QueryBuilder(appIdNamespace).setKind(kind);
  }

  public KeyBuilder newKeyBuilder(String kind) {
    return new KeyBuilder(appIdNamespace, kind);
  }

  public EntityBuilder newEntityBuilder(String kind) {
    return new EntityBuilder(appIdNamespace, kind);
  }

  @Override
  public PreparedQuery prepare(Query query) {
    validateQuery(query);
    return delegate.prepare(query);
  }

  @Override
  public PreparedQuery prepare(Transaction txn, Query query) {
    validateQuery(query);
    return delegate.prepare(txn, query);
  }

  @Override
  public Transaction getCurrentTransaction() {
    return delegate.getCurrentTransaction();
  }

  @Override
  public Transaction getCurrentTransaction(Transaction returnedIfNoTxn) {
    return delegate.getCurrentTransaction(returnedIfNoTxn);
  }

  @Override
  public Collection<Transaction> getActiveTransactions() {
    return delegate.getActiveTransactions();
  }

  @Override
  public Future<Transaction> beginTransaction() {
    return delegate.beginTransaction();
  }

  @Override
  public Future<Transaction> beginTransaction(TransactionOptions options) {
    return delegate.beginTransaction(options);
  }

  @Override
  public Future<Entity> get(Key key) {
    validateKey(key);
    return delegate.get(key);
  }

  @Override
  public Future<Entity> get(Transaction txn, Key key) {
    validateKey(key);
    return delegate.get(txn, key);
  }

  @Override
  public Future<Map<Key, Entity>> get(Iterable<Key> keys) {
    validateKeys(keys);
    return delegate.get(keys);
  }

  @Override
  public Future<Map<Key, Entity>> get(Transaction txn, Iterable<Key> keys) {
    validateKeys(keys);
    return delegate.get(txn, keys);
  }

  @Override
  public Future<Key> put(Entity entity) {
    validateEntity(entity);
    return delegate.put(entity);
  }

  @Override
  public Future<Key> put(Transaction txn, Entity entity) {
    validateEntity(entity);
    return delegate.put(txn, entity);
  }

  @Override
  public Future<List<Key>> put(Iterable<Entity> entities) {
    validateEntities(entities);
    return delegate.put(entities);
  }

  @Override
  public Future<List<Key>> put(Transaction txn, Iterable<Entity> entities) {
    validateEntities(entities);
    return delegate.put(txn, entities);
  }

  @Override
  public Future<Void> delete(Key... keys) {
    validateKeys(Arrays.asList(keys));
    return delegate.delete(keys);
  }

  @Override
  public Future<Void> delete(Transaction txn, Key... keys) {
    validateKeys(Arrays.asList(keys));
    return delegate.delete(txn, keys);
  }

  @Override
  public Future<Void> delete(Iterable<Key> keys) {
    validateKeys(keys);
    return delegate.delete(keys);
  }

  @Override
  public Future<Void> delete(Transaction txn, Iterable<Key> keys) {
    validateKeys(keys);
    return delegate.delete(txn, keys);
  }

  @Override
  public Future<KeyRange> allocateIds(String kind, long num) {
    return delegate.allocateIds(kind, num);
  }

  @Override
  public Future<KeyRange> allocateIds(Key parent, String kind, long num) {
    return delegate.allocateIds(parent, kind, num);
  }

  @Override
  public Future<DatastoreAttributes> getDatastoreAttributes() {
    return delegate.getDatastoreAttributes();
  }

  @Override
  public Future<Map<Index, IndexState>> getIndexes() {
    return delegate.getIndexes();
  }

  private void validateQuery(Query query) {
    checkArgument(query.getAppIdNamespace().equals(appIdNamespace),
        "Query is associated with a different appId or namespace");
  }

  private void validateKey(Key key) {
    checkArgument(key.getAppIdNamespace().equals(appIdNamespace),
        "key %s is associated with a different appId or namespace", key);
  }

  private void validateKeys(Iterable<Key> keys) {
    for (Key key : keys) {
      validateKey(key);
    }
  }

  private void validateEntity(Entity entity) {
    checkArgument(entity.getAppIdNamespace().equals(appIdNamespace),
        "Entity %s is associated with a different appId or namespace", entity.getKey());
  }

  private void validateEntities(Iterable<Entity> entities) {
    for (Entity entity : entities) {
      validateEntity(entity);
    }
  }
}

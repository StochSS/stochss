package com.google.appengine.api.datastore;

import com.google.appengine.api.utils.FutureWrapper;
import com.google.common.collect.ImmutableSet;
import com.google.common.collect.Lists;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.Future;

/**
 * The entity caching strategy interface for level-2 entity caching.
 * <p>
 * For correct entity caching strategy execution it's required that between any pre-datastore
 * operation strategy hook and the initiation of the datastore operation RPC that there be no waits.
 * Similarly, it's required that between a reaped datastore operation RPC and the corresponding
 * post-datastore operation strategy hook that there be no waits.
 *
 */
abstract class EntityCachingStrategy {

  static final double DEFAULT_DATASTORE_RPC_DEADLINE_SECS = 60;

  /**
   * Constructs an {@link EntityCachingStrategy} based on the {@link EntityCacheConfig} specified
   * in the {@code datastoreServiceConfig}.
   *
   * @param datastoreServiceConfig the datastore service config.
   * @return the newly created {@link EntityCachingStrategy} instance.
   */
  public static EntityCachingStrategy createStrategy(
      DatastoreServiceConfig datastoreServiceConfig) {
    EntityCacheConfig cacheConfig = datastoreServiceConfig.getEntityCacheConfig();
    if (cacheConfig.getEntityCachePolicy() == EntityCachePolicy.CACHE) {
      return new DatastoreBackedEntityCachingStrategy(datastoreServiceConfig);
    } else if (cacheConfig.getEntityCachePolicy() == EntityCachePolicy.CACHE_ONLY) {
      return new CacheOnlyEntityCachingStrategy(datastoreServiceConfig);
    } else {
      throw new IllegalStateException(
          "Unknown cache policy: " + cacheConfig.getEntityCachePolicy());
    }
  }

  /**
   * Executes the pre datastore-get entity caching strategy
   *
   * @param currentTxnProvider the current transaction provider.
   * @param keysToGet the keys for the get request.
   * @param resultMap a map containing the results for the get operation. Any items added
   *     to the map will not be fetched by the datastore.
   * @return a {@link PreGetCachingResult} object.
   */
  public abstract PreGetCachingResult preGet(CurrentTransactionProvider currentTxnProvider,
      List<Key> keysToGet, Map<Key, Entity> resultMap);

  /**
   * Executes the post datastore-get entity caching strategy.
   *
   * @param preGetResult the result from the execution of {@link #preGet} for the associated
   *     datastore get request.
   * @param resultMap a map containing the results for the datastore get operation.
   */
  protected abstract void postGet(PreGetCachingResult preGetResult, Map<Key, Entity> resultMap);

  /**
   * Executes the pre datastore-put entity caching strategy.
   *
   * @param currentTxnProvider the current transaction provider.
   * @param entitiesToPut the entities for the put request.
   * @return a {@link PreMutationCachingResult} object.
   */
  public abstract PreMutationCachingResult prePut(CurrentTransactionProvider currentTxnProvider,
      List<Entity> entitiesToPut);

  /**
   * Executes the pre datastore-delete entity caching strategy.
   *
   * @param currentTxnProvider the current transaction provider.
   * @param keysToDelete the keys for the delete request.
   * @return a {@link PreMutationCachingResult} object.
   */
  public abstract PreMutationCachingResult preDelete(CurrentTransactionProvider currentTxnProvider,
      List<Key> keysToDelete);

  /**
   * Executes the pre datastore-commit entity caching strategy.
   *
   * @param entitiesToPut all entities being put in the associated transaction.
   * @param keysToDelete all keys being deleted in the associated transaction.
   * @return a {@link PreMutationCachingResult} object.
   */
  public abstract PreMutationCachingResult preCommit(List<Entity> entitiesToPut,
      List<Key> keysToDelete);

  /**
   * Executes the post datastore-mutation entity caching strategy. This method is invoked
   * after every non-transactional put and delete request and also after every commit
   * request.
   *
   * @param preMutationResult the result from executing the pre-mutation entity caching strategy
   *     for the associated datastore mutation request.
   */
  protected abstract void postMutation(PreMutationCachingResult preMutationResult);

  /**
   * Creates a {@code Future} that wraps a datastore get {@code Future} result to invoke
   * {@link #postGet} once the datastore get result is reaped.
   *
   * @param resultMap the result of the get operation.
   * @param preGetResult the result from executing the pre-get entity caching strategy
   *     for the associated datastore get request.
   * @return the result of the get operation.
   */
  public Future<Map<Key, Entity>> createPostGetFuture(
      Future<Map<Key, Entity>> resultMap, final PreGetCachingResult preGetResult) {
    return new FutureWrapper<Map<Key, Entity>, Map<Key, Entity>>(resultMap) {
      @Override
      protected Map<Key, Entity> wrap(Map<Key, Entity> resultMap) throws Exception {
        postGet(preGetResult, resultMap);
        return resultMap;
      }

      @Override
      protected Throwable convertException(Throwable cause) {
        return cause;
      }
    };
  }

  /**
   * Creates a {@code Future} that wraps a datastore mutation {@code Future} result in order to
   * invoke {@link #postMutation} once the datastore mutation result is reaped. Every
   * non-transactional put and delete {@code Future} result and also every commit {@code Future}
   * result should be wrapped by this method.
   *
   * @param result the datastore result being wrapped.
   * @param preMutationResult the result from executing the pre-mutation entity caching strategy
   *     for the associated datastore mutation request.
   * @return the result of the mutation operation.
   */
  public <T> Future<T> createPostMutationFuture(Future<T> result,
      final PreMutationCachingResult preMutationResult) {
    return new FutureWrapper<T, T>(result) {
      @Override
      protected T wrap(T result) throws Exception {
        postMutation(preMutationResult);
        return result;
      }

      @Override
      protected Throwable convertException(Throwable cause) {
        return cause;
      }
    };
  }

  /**
   * @return a new {@code List} containing only the entities that satisfied the
   *     {@link EntityCachingCriteria}.
   */
  protected static List<Entity> getCacheableEntities(DatastoreServiceConfig datastoreServiceConfig,
      List<Entity> entities) {
    EntityCachingCriteria cachingCriteria =
        datastoreServiceConfig.getEntityCacheConfig().getEntityCachingCriteria();
    List<Entity> filteredEntities = Lists.newArrayListWithExpectedSize(entities.size());
    for (Entity entity : entities) {
      Key key = entity.getKey();
      if (cachingCriteria.isCacheable(key)) {
        filteredEntities.add(entity);
      }
    }
    return filteredEntities;
  }

  /**
   * @return a new {@code List} containing only the keys that satisfied the
   *     {@link EntityCachingCriteria}.
   */
  protected static List<Key> getCacheableKeys(DatastoreServiceConfig datastoreServiceConfig,
      List<Key> keys) {
    EntityCachingCriteria cachingCriteria =
        datastoreServiceConfig.getEntityCacheConfig().getEntityCachingCriteria();
    List<Key> filteredKeys = Lists.newArrayListWithExpectedSize(keys.size());
    for (Key key : keys) {
      if (cachingCriteria.isCacheable(key)) {
        filteredKeys.add(key);
      }
    }
    return filteredKeys;
  }

  /**
   * The pre-get operation entity caching strategy result. Along with storing state
   * for the entity caching strategies, this object specifies which entity gets to
   * skip loading in the associated datastore get request.
   */
  public static class PreGetCachingResult {

    private Set<Key> keysToSkipLoading;

    protected PreGetCachingResult(Set<Key> keysToSkipLoading) {
      this.keysToSkipLoading = keysToSkipLoading;
    }

    /**
     * Sets the keys to skip loading in the associated datastore get request.
     *
     * @param keysToSkipLoading the set of keys to skip loading.
     */
    public void setKeysToSkipLoading(Set<Key> keysToSkipLoading) {
      this.keysToSkipLoading = keysToSkipLoading;
    }

    /**
     * @return the set of keys to skip loading in the associated datastore get request.
     */
    public Set<Key> getKeysToSkipLoading() {
      return keysToSkipLoading;
    }
  }

  /**
   * The pre-mutation operation entity caching strategy result. Along with storing state for
   * the entity caching strategy, this object specifies which entity mutations to skip
   * in the associated pre-mutation operation.
   */
  public static class PreMutationCachingResult {

    private Set<Key> mutationKeysToSkip;

    protected PreMutationCachingResult(Set<Key> mutationKeysToSkip) {
      this.mutationKeysToSkip = mutationKeysToSkip;
    }

    /**
     * Sets the keys to skip mutating in the associated datastore mutation request.
     *
     * @param mutationKeysToSkip the set of keys to skip.
     */
    public void setMutationKeysToSkip(Set<Key> mutationKeysToSkip) {
      this.mutationKeysToSkip = mutationKeysToSkip;
    }

    /**
     * @return the set of keys to skip mutating in the associated datastore mutation request.
     */
    public Set<Key> getMutationKeysToSkip() {
      return mutationKeysToSkip;
    }
  }

  /**
   * A no-op entity caching strategy implementation.
   */
  public static final class NoOpEntityCachingStrategy extends EntityCachingStrategy {

    public static final EntityCachingStrategy INSTANCE = new NoOpEntityCachingStrategy();

    @Override
    public PreGetCachingResult preGet(CurrentTransactionProvider currentTxnProvider,
        List<Key> keysToGet, Map<Key, Entity> resultMap) {
      return new PreGetCachingResult(ImmutableSet.<Key>of());
    }

    @Override
    protected void postGet(PreGetCachingResult preGetResult, Map<Key, Entity> resultMap) {
    }

    @Override
    public PreMutationCachingResult prePut(CurrentTransactionProvider currentTxnProvider,
        List<Entity> entitiesToPut) {
      return new PreMutationCachingResult(ImmutableSet.<Key>of());
    }

    @Override
    public PreMutationCachingResult preDelete(CurrentTransactionProvider currentTxnProvider,
        List<Key> keysToDelete) {
      return new PreMutationCachingResult(ImmutableSet.<Key>of());
    }

    @Override
    public PreMutationCachingResult preCommit(List<Entity> entitiesToPut,
        List<Key> keysToDelete) {
      return new PreMutationCachingResult(ImmutableSet.<Key>of());
    }

    @Override
    protected void postMutation(PreMutationCachingResult preMutationResult) {
    }
  }
}

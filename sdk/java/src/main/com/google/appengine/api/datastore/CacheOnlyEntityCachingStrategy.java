package com.google.appengine.api.datastore;

import static com.google.appengine.api.datastore.FutureHelper.quietGet;

import com.google.appengine.api.datastore.EntityCache.IdentifiableCacheValue;
import com.google.appengine.api.datastore.FutureHelper.FakeFuture;
import com.google.appengine.api.memcache.MemcacheService.SetPolicy;
import com.google.apphosting.datastore.EntityStorage.CacheValue;
import com.google.apphosting.datastore.EntityStorage.CacheValue.State;
import com.google.common.collect.ImmutableList;
import com.google.common.collect.ImmutableMap;
import com.google.common.collect.ImmutableSet;
import com.google.common.collect.Maps;
import com.google.common.collect.Sets;
import com.google.storage.onestore.v3.OnestoreEntity.EntityProto;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.Future;

/**
 * A cache-only entity caching strategy implementation. This class implements the policy specified
 * by {@link EntityCachePolicy#CACHE_ONLY}.
 *
 */
final class CacheOnlyEntityCachingStrategy extends EntityCachingStrategy {

  private final EntityCache cache;
  private final DatastoreServiceConfig datastoreServiceConfig;

  CacheOnlyEntityCachingStrategy(DatastoreServiceConfig datastoreServiceConfig) {
    MemcacheServiceHelper memcacheServiceHelper = MemcacheServiceHelper.Builder.withDefaults();
    double datastoreRpcDeadline = (datastoreServiceConfig.getDeadline() == null) ?
        DEFAULT_DATASTORE_RPC_DEADLINE_SECS : datastoreServiceConfig.getDeadline();
    cache = new EntityCache(memcacheServiceHelper, datastoreRpcDeadline);
    this.datastoreServiceConfig = datastoreServiceConfig;
  }

  CacheOnlyEntityCachingStrategy(EntityCache cache, DatastoreServiceConfig datastoreServiceConfig) {
    this.cache = cache;
    this.datastoreServiceConfig = datastoreServiceConfig;
  }

  @Override
  public PreGetCachingResult preGet(CurrentTransactionProvider currentTxnProvider,
      List<Key> keysToGet, Map<Key, Entity> resultMap) {
    List<Key> cacheableKeys = getCacheableKeys(datastoreServiceConfig, keysToGet);
    Future<Map<Key, IdentifiableCacheValue>> cacheGetResults;
    if (cacheableKeys.isEmpty()) {
      cacheGetResults = new FakeFuture<Map<Key, IdentifiableCacheValue>>(
          ImmutableMap.<Key, IdentifiableCacheValue>of());
    } else {
      cacheGetResults = cache.getIdentifiableAsync(cacheableKeys);
    }
    return new CacheOnlyPreGetCachingResult(Sets.newHashSet(cacheableKeys), cacheGetResults);
  }

  @Override
  protected void postGet(PreGetCachingResult preGetResult, Map<Key, Entity> resultMap) {
    CacheOnlyPreGetCachingResult preGetStrategyResult = (CacheOnlyPreGetCachingResult) preGetResult;
    Map<Key, IdentifiableCacheValue> cacheResults =
        quietGet(preGetStrategyResult.getCacheResults());
    for (Map.Entry<Key, IdentifiableCacheValue> cacheEntry : cacheResults.entrySet()) {
      CacheValue cacheValue = cacheEntry.getValue().getValue();
      if ((cacheValue.getStateEnum() == State.ENTITY) && cacheValue.hasEntity()) {
        resultMap.put(cacheEntry.getKey(),
            EntityTranslator.createFromPb(cacheValue.getEntity().getV3Entity()));
      }
    }
  }

  @Override
  public PreMutationCachingResult prePut(CurrentTransactionProvider currentTxnProvider,
      List<Entity> entitiesToPut) {
    if (currentTxnProvider.getCurrentTransaction(null) == null) {
      return preCommit(entitiesToPut, ImmutableList.<Key>of());
    } else {
      PreMutationCachingResult preMutationResult =
          new PreMutationCachingResult(ImmutableSet.<Key>of());
      List<Entity> cacheableEntities = getCacheableEntities(datastoreServiceConfig, entitiesToPut);
      Set<Key> mutationKeysToSkip = Sets.newHashSetWithExpectedSize(cacheableEntities.size());
      for (Entity cacheableEntity : cacheableEntities) {
        mutationKeysToSkip.add(cacheableEntity.getKey());
      }
      preMutationResult.setMutationKeysToSkip(mutationKeysToSkip);
      return preMutationResult;
    }
  }

  @Override
  public PreMutationCachingResult preDelete(CurrentTransactionProvider currentTxnProvider,
      List<Key> keysToDelete) {
    if (currentTxnProvider.getCurrentTransaction(null) == null) {
      return preCommit(ImmutableList.<Entity>of(), keysToDelete);
    } else {
      PreMutationCachingResult preMutationResult =
          new PreMutationCachingResult(ImmutableSet.<Key>of());
      List<Key> cacheableKeys = getCacheableKeys(datastoreServiceConfig, keysToDelete);
      preMutationResult.setMutationKeysToSkip(Sets.newHashSet(cacheableKeys));
      return preMutationResult;
    }
  }

  @Override
  public PreMutationCachingResult preCommit(List<Entity> entitiesToPut, List<Key> keysToDelete) {
    List<Entity> cacheableEntitiesToPut =
        getCacheableEntities(datastoreServiceConfig, entitiesToPut);
    List<Key> cacheableKeysToDelete = getCacheableKeys(datastoreServiceConfig, keysToDelete);
    Future<Set<Key>> keysPut = new FakeFuture<Set<Key>>(ImmutableSet.<Key>of());
    Future<Set<Key>> keysEvicted = new FakeFuture<Set<Key>>(ImmutableSet.<Key>of());
    if (!cacheableEntitiesToPut.isEmpty()) {
      Set<Key> cacheableKeysToDeleteSet = Sets.newHashSet(cacheableKeysToDelete);
      Map<Key, EntityProto> entityMap =
          Maps.newHashMapWithExpectedSize(cacheableEntitiesToPut.size());
      for (Entity entity : cacheableEntitiesToPut) {
        Key entityKey = entity.getKey();
        if (entityKey.isComplete() && !cacheableKeysToDeleteSet.contains(entityKey)) {
          entityMap.put(entityKey, EntityTranslator.convertToPb(entity));
        }
      }
      if (!entityMap.isEmpty()) {
        keysPut = cache.putEntitiesAsync(entityMap, SetPolicy.SET_ALWAYS);
      }
    }
    if (!cacheableKeysToDelete.isEmpty()) {
      keysEvicted = cache.evictAsync(cacheableKeysToDelete);
    }
    Set<Key> mutationKeysToSkip = Sets.newHashSetWithExpectedSize(cacheableEntitiesToPut.size());
    for (Entity cacheableEntity : cacheableEntitiesToPut) {
      mutationKeysToSkip.add(cacheableEntity.getKey());
    }
    mutationKeysToSkip.addAll(cacheableKeysToDelete);
    return new CacheOnlyPreMutationCachingResult(mutationKeysToSkip, keysPut, keysEvicted);
  }

  @Override
  protected void postMutation(PreMutationCachingResult preMutationResult) {
    CacheOnlyPreMutationCachingResult preMutationStrategyResult =
        (CacheOnlyPreMutationCachingResult) preMutationResult;
    quietGet(preMutationStrategyResult.getKeysPut());
    quietGet(preMutationStrategyResult.getKeysEvicted());
  }

  static final class CacheOnlyPreGetCachingResult extends PreGetCachingResult {
    private final Future<Map<Key, IdentifiableCacheValue>> cacheResults;

    public CacheOnlyPreGetCachingResult(Set<Key> keysToSkipLoading,
        Future<Map<Key, IdentifiableCacheValue>> cacheResults) {
      super(keysToSkipLoading);
      this.cacheResults = cacheResults;
    }

    public Future<Map<Key, IdentifiableCacheValue>> getCacheResults() {
      return cacheResults;
    }
  }

  static final class CacheOnlyPreMutationCachingResult extends PreMutationCachingResult {
    private final Future<Set<Key>> keysPut;
    private final Future<Set<Key>> keysEvicted;

    public CacheOnlyPreMutationCachingResult(Set<Key> mutationKeysToSkip, Future<Set<Key>> keysPut,
        Future<Set<Key>> keysEvicted) {
      super(mutationKeysToSkip);
      this.keysPut = keysPut;
      this.keysEvicted = keysEvicted;
    }

    public Future<Set<Key>> getKeysPut() {
      return keysPut;
    }

    public Future<Set<Key>> getKeysEvicted() {
      return keysEvicted;
    }
  }
}

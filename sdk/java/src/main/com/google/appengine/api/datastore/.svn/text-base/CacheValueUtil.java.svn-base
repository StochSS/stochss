package com.google.appengine.api.datastore;

import static com.google.common.base.Preconditions.checkArgument;

import com.google.apphosting.datastore.EntityStorage.CacheValue;
import com.google.apphosting.datastore.EntityStorage.CacheValue.State;
import com.google.apphosting.datastore.EntityStorage.VersionedEntity;
import com.google.storage.onestore.v3.OnestoreEntity.EntityProto;

/**
 * Utility methods for the {@link CacheValue} protocol buffer object.
 *
 */
final class CacheValueUtil {

  /**
   * Creates a {@link CacheValue} object.
   *
   * @param state the state of the cache value.
   * @param entity the entity to store in the cache value.
   * @return a {@code CacheValue} object for the specified {@code state} and {@code entity}.
   * @throws IllegalArgumentException if a non-null {@code entity} is specified with
   *     a {@code state} other than {@link State#ENTITY}.
   */
  public static CacheValue createCacheValue(State state, EntityProto entity) {
    if (state == State.ENTITY) {
      CacheValue cacheValue = new CacheValue();
      if (entity != null) {
        VersionedEntity versionedEntity = new VersionedEntity();
        versionedEntity.setV3Entity(entity);
        cacheValue.setEntity(versionedEntity);
      }
      return cacheValue;
    } else {
      checkArgument(entity == null, "An entity can only be specified with state " + State.ENTITY);
      CacheValue cacheValue = new CacheValue();
      cacheValue.setState(state);
      return cacheValue;
    }
  }

  /**
   * @return {@code true} if the {@code state} is used to demarcate datastore operations.
   */
  public static boolean isDatastoreOpState(State state) {
    return (state == State.READ_IN_PROGRESS) || (state == State.MUTATION_IN_PROGRESS);
  }

  private CacheValueUtil() {
  }
}

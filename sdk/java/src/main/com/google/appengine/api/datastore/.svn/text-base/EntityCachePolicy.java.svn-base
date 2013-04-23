package com.google.appengine.api.datastore;

/**
 * This class specifies datastore specific entity caching policies.
 * <p>
 * See {@link EntityCacheConfig} for details on how to configure entity caching for the datastore.
 *
 */
enum EntityCachePolicy {

  /**
   * Specifies that entities associated with this policy will be cached in the entity cache.
   * However, on cache misses the entities will be retrieved from the datastore. And every entity
   * creation, update, or deletion will also be persisted in the datastore.
   *
   * The datastore operations that benefit from this policy are {@link DatastoreService#get} and
   * {@link AsyncDatastoreService#get}. These operations (when executed outside of a transaction)
   * will first attempt to find the entities in the entity cache. And only when that fails will an
   * attempt be made to find the entities in the datastore. When there is a high cache hit rate
   * this will reduce the number of datastore read operations and also reduce the overall
   * entity retrieval latency.
   *
   * With this policy, the datastore updates the entity cache in a way to minimize the chances
   * of stale entities being returned from the cache, but it does not completely eliminate the
   * possibility of stale entities being returned. For this reason, any entity reads done within
   * a transaction bypass the cache. However, for all other entity reads the application code
   * should tolerate stale entities being returned when entity caching is enabled.
   */
  CACHE,

  /**
   * Specifies that entities associated with this policy will only be retrieved from and
   * persisted to the entity cache. The following datastore operations will not be invoked
   * for the associated entities:
   * <ul>
   * <li>{@link DatastoreService#put}, {@link AsyncDatastoreService#put}
   * <li>{@link DatastoreService#get}, {@link AsyncDatastoreService#get}
   * <li>{@link DatastoreService#delete}, {@link AsyncDatastoreService#delete}
   * </ul>
   * Only entities with complete keys will be put into the entity cache. All other entities on
   * which a put operation is performed will not be written to the entity cache and the keys
   * for those entities will not be completed.
   */
  CACHE_ONLY
}

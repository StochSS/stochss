package com.google.appengine.api.datastore;

import static com.google.common.base.Preconditions.checkNotNull;

/**
 * Specifies the entity cache configuration for the datastore service.
 * <p>
 * The default entity cache configuration values for an {@code EntityCacheConfig} instance are
 * a memcache backed entity cache, {@link EntityCachingCriteria#ALL_KEYS} for the caching criteria,
 * and {@link EntityCachePolicy#CACHE} for the caching policy.
 * <p>
 * See {@link DatastoreServiceConfig#entityCacheConfig} for details on how to specify an
 * {@code EntityCacheConfig} to enable caching of datastore entities when using the
 * datastore service.
 */
final class EntityCacheConfig {

  private EntityCachingCriteria entityCachingCriteria = EntityCachingCriteria.ALL_KEYS;
  private EntityCachePolicy entityCachePolicy = EntityCachePolicy.CACHE;

  /**
   * Sets the {@link EntityCachingCriteria}.
   *
   * @param entityCachingCriteria the {@link EntityCachingCriteria} to use to determine if an entity
   *     should be cached.
   * @return {@code this} (for chaining)
   */
  public EntityCacheConfig entityCachingCriteria(EntityCachingCriteria entityCachingCriteria) {
    this.entityCachingCriteria =
        checkNotNull(entityCachingCriteria, "The entityCachingCriteria argument can not be null");
    return this;
  }

  /**
   * @return the {@link EntityCachingCriteria} specified in this entity cache configuration.
   */
  public EntityCachingCriteria getEntityCachingCriteria() {
    return entityCachingCriteria;
  }

  /**
   * Sets the {@link EntityCachePolicy}.
   *
   * @param entityCachePolicy the {@link EntityCachePolicy} to use for entity caching.
   * @return {@code this} (for chaining)
   */
  public EntityCacheConfig entityCachePolicy(EntityCachePolicy entityCachePolicy) {
    this.entityCachePolicy =
        checkNotNull(entityCachePolicy, "The entityCachePolicy argument can not be null");
    return this;
  }

  /**
   * @return the {@link EntityCachePolicy} specified in this entity cache configuration.
   */
  public EntityCachePolicy getEntityCachePolicy() {
    return entityCachePolicy;
  }

  private EntityCacheConfig() {
  }

  /**
   * Contains static creation methods for {@link EntityCacheConfig} instances.
   */
  public static final class Builder {

    /**
     * Create an {@link EntityCacheConfig} instance with the specified
     * {@code entityCachingCriteria} and with the default configuration values for all other fields.
     *
     * @param entityCachingCriteria the {@link EntityCachingCriteria} to use to determine if an
     *     entity should be cached.
     * @return the newly created EntityCacheConfig instance.
     */
    public static EntityCacheConfig withEntityCachingCriteria(
        EntityCachingCriteria entityCachingCriteria) {
      return withDefaults().entityCachingCriteria(entityCachingCriteria);
    }

    /**
     * Create an {@link EntityCacheConfig} instance with the specified {@code entityCachePolicy} and
     * with the default configuration values for all other fields.
     *
     * @param entityCachePolicy the {@link EntityCachePolicy} to use for entity caching.
     * @return the newly created EntityCacheConfig instance.
     */
    public static EntityCacheConfig withEntityCachePolicy(EntityCachePolicy entityCachePolicy) {
      return withDefaults().entityCachePolicy(entityCachePolicy);
    }

    /**
     * Create an {@link EntityCacheConfig} instance with the default configuration values.
     *
     * @return the newly created EntityCacheConfig instance.
     */
    public static EntityCacheConfig withDefaults() {
      return new EntityCacheConfig();
    }

    private Builder() {}
  }
}

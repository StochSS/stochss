package com.google.appengine.api.datastore;

/**
 * Specifies whether the entity associated with the {@link Key} is eligible for caching.
 */
abstract class EntityCachingCriteria {

  /**
   * Returns that every entity is cacheable.
   */
  public static final EntityCachingCriteria ALL_KEYS = new EntityCachingCriteria() {
    @Override
    public boolean isCacheable(Key key) {
      return true;
    }
  };

  /**
   * Returns whether the entity associated with the {@code key} is eligible for caching.
   *
   * @param key the entity {@link Key} to check.
   * @return {@code true} if the entity with the specified {@code key} is cacheable.
   *     {@code false} otherwise.
   */
  public abstract boolean isCacheable(Key key);
}
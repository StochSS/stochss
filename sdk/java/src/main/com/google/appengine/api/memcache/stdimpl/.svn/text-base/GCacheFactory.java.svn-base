// Copyright 2009 Google Inc. All Rights Reserved.

package com.google.appengine.api.memcache.stdimpl;

import java.util.Map;

import javax.cache.Cache;
import javax.cache.CacheFactory;

/**
 * JCache CacheFactory implementation using Memcache.
 *
 */
public class GCacheFactory implements CacheFactory {

  /**
   * Property key for expiration time in seconds set for all put operations as
   * an Integer.
   */
  public static final int EXPIRATION_DELTA = 0;

  /**
   * Property key for expiration time in milliseconds set for all put
   * operations as an Integer.
   */
  public static final int EXPIRATION_DELTA_MILLIS = 1;

  /**
   * Property key for absolute expiration time for all put operations as a
   * {@link Date}.
   */
  public static final int EXPIRATION = 2;

  /**
   * Property key for put operation policy as a
   * {@link com.google.appengine.api.memcache.MemcacheService.SetPolicy}.
   * Defaults to {@link SetPolicy.SET_ALWAYS} if not specified.
   */
  public static final int SET_POLICY = 3;

  /**
   * Property key for memcache service to use as a
   * {@link com.google.appengine.api.memcache.MemcacheService}. Defaults to
   * that provided by {@link MemcacheServiceFactory.getMemcacheService} if not
   * specified.
   */
  public static final int MEMCACHE_SERVICE = 4;

  /**
   * Property key for defining a non-default namespace. This has the
   * same effect setting a namespace using {@link
   * com.google.appengine.api.memcache.MemcacheServiceFactory#getMemcacheService(String)}.
   * This property is ignored if MEMCACHE_SERVICE property specified.
   */
  public static final int NAMESPACE = 5;

  /**
   * Creates a cache instance using the memcache service.
   * @param map A map of properties.
   * @return a cache.
   */
  public Cache createCache(Map map) {
    return new GCache(map);
  }
}

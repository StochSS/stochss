// Copyright 2008 Google Inc. All Rights Reserved.
package com.google.appengine.api.memcache;

/**
 * Statistics from the cache, available via {@link MemcacheService#getStatistics()}
 *
 */
public interface Stats {
  /**
   * The counter of "successful" {@link MemcacheService#get(Object)} or
   * {@link MemcacheService#contains(Object)} operations.
   */
  long getHitCount();

  /**
   * The counter of "unsuccessful" {@link MemcacheService#get(Object)} or
   * {@link MemcacheService#contains(Object)} operations.
   */
  long getMissCount();

  /**
   * Sum of key and value bytes in successful get() and contains().
   */
  long getBytesReturnedForHits();

  /**
   * Number of entries currently "alive" in the cache.
   */
  long getItemCount();

  /**
   * Sum of key and value sizes for all live entries currently in cache.
   */
  long getTotalItemBytes();

  /**
   * Milliseconds since last access of least-recently-used live entry.
   */
  int getMaxTimeWithoutAccess();
}

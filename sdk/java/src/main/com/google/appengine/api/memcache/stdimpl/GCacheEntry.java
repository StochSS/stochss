// Copyright 2009 Google Inc. All Rights Reserved.

package com.google.appengine.api.memcache.stdimpl;

import com.google.common.base.Objects;

import javax.cache.Cache;
import javax.cache.CacheEntry;

/**
 * JCache CacheEntry implementation using Memcache.
 *
 */
public class GCacheEntry implements CacheEntry {

  private Object key;
  private Object value;
  private Cache cache;

  /**
   * Creates a GCacheEntry contained within the GCache {@code cache}, with key
   * {@code key} and value {@code value}.
   * @param cache The cache containing this entry.
   * @param key The key of this entry.
   * @param value The value of this entry.
   */
  GCacheEntry(Cache cache, Object key, Object value) {
    this.cache = cache;
    this.key = key;
    this.value = value;
  }

  /**
   * Not supported.
   */
  public long getCost() {
    throw new UnsupportedOperationException();
  }

  /**
   * Not supported.
   */
  public long getCreationTime() {
    throw new UnsupportedOperationException();
  }

  /**
   * Not supported.
   */
  public long getExpirationTime() {
    throw new UnsupportedOperationException();
  }

  /**
   * Not supported.
   */
  public long getHits() {
    throw new UnsupportedOperationException();
  }

  /**
   * Not supported.
   */
  public long getLastAccessTime() {
    throw new UnsupportedOperationException();
  }

  /**
   * Not supported.
   */
  public long getLastUpdateTime() {
    throw new UnsupportedOperationException();
  }

  /**
   * Not supported.
   */
  public long getVersion() {
    throw new UnsupportedOperationException();
  }

  public boolean equals(Object obj) {
    if (obj instanceof CacheEntry) {
      CacheEntry other = (CacheEntry) obj;
      return Objects.equal(key, other.getKey()) && Objects.equal(value, other.getValue());
    }
    return false;
  }

  public int hashCode() {
    return Objects.hashCode(key, value);
  }

  public boolean isValid() {
    return Objects.equal(this, cache.getCacheEntry(key));
  }

  public Object getKey() {
    return key;
  }

  public Object getValue() {
    return value;
  }

  @SuppressWarnings("unchecked")
  public Object setValue(Object newValue) {
    this.value = newValue;
    return cache.put(key, value);
  }
}

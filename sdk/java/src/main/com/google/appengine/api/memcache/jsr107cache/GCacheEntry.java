// Copyright 2010 Google Inc. All Rights Reserved.

package com.google.appengine.api.memcache.jsr107cache;

import net.sf.jsr107cache.Cache;
import net.sf.jsr107cache.CacheEntry;

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
  public int getHits() {
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
      if ((key == null) ? (other.getKey() == null) : key.equals(other.getKey())) {
        if ((value == null) ? (other.getValue() == null) : value.equals(other.getValue())) {
          return true;
        }
      }
    }
    return false;
  }

  public int hashCode() {
    return key.hashCode() * 37 + value.hashCode();
  }

  public boolean isValid() {
    return equals(cache.getCacheEntry(key));
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

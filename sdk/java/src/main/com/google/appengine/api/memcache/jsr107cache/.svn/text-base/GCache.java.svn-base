// Copyright 2010 Google Inc. All Rights Reserved.

package com.google.appengine.api.memcache.jsr107cache;

import com.google.appengine.api.memcache.MemcacheService;
import com.google.appengine.api.memcache.MemcacheServiceFactory;
import com.google.appengine.api.memcache.Expiration;
import com.google.appengine.api.memcache.Stats;

import java.util.Collection;
import java.util.Date;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Set;

import net.sf.jsr107cache.Cache;
import net.sf.jsr107cache.CacheEntry;
import net.sf.jsr107cache.CacheListener;
import net.sf.jsr107cache.CacheStatistics;

/**
 * JCache Cache implementation using Memcache.
 *
 */
public class GCache implements Cache {

  private final MemcacheService service;
  private final List<CacheListener> listeners;
  private final Expiration expiration;
  private final MemcacheService.SetPolicy setPolicy;
  private final boolean throwOnPutFailure;

  /**
   * Creates a JCache implementation over the provided service with the given
   * properties.
   * @param properties Properties for this cache.
   */
  public GCache(Map properties) {
    listeners = new LinkedList<CacheListener>();
    if (properties != null) {
      Object expirationProperty = properties.get(
          GCacheFactory.EXPIRATION_DELTA);
      int millis = 0;
      if (expirationProperty instanceof Integer) {
        millis = (Integer) expirationProperty * 1000;
      }
      expirationProperty = properties.get(
          GCacheFactory.EXPIRATION_DELTA_MILLIS);
      if (expirationProperty instanceof Integer) {
        millis = (Integer) expirationProperty;
      }
      if (millis != 0) {
        expiration = Expiration.byDeltaMillis(millis);
      } else {
        expirationProperty = properties.get(GCacheFactory.EXPIRATION);
        if (expirationProperty instanceof Date) {
          expiration = Expiration.onDate((Date) expirationProperty);
        } else {
          expiration = null;
        }
      }
      Object setProperty = properties.get(GCacheFactory.SET_POLICY);
      if (setProperty instanceof MemcacheService.SetPolicy) {
        setPolicy = (MemcacheService.SetPolicy) setProperty;
      } else {
        setPolicy = MemcacheService.SetPolicy.SET_ALWAYS;
      }
      Object memcacheService = properties.get(GCacheFactory.MEMCACHE_SERVICE);
      if (memcacheService instanceof MemcacheService) {
        this.service = (MemcacheService) memcacheService;
      } else {
        Object namespace = properties.get(GCacheFactory.NAMESPACE);
        if (!(namespace instanceof String)) {
          namespace = null;
        }
        this.service = MemcacheServiceFactory.getMemcacheService(
            (String) namespace);
      }
      Object throwOnPutFailureValue = (Boolean) properties.get(GCacheFactory.THROW_ON_PUT_FAILURE);
      if (throwOnPutFailureValue instanceof Boolean) {
        throwOnPutFailure = ((Boolean) throwOnPutFailureValue).booleanValue();
      } else {
        throwOnPutFailure = false;
      }
    } else {
      expiration = null;
      throwOnPutFailure = false;
      setPolicy = MemcacheService.SetPolicy.SET_ALWAYS;
      this.service = MemcacheServiceFactory.getMemcacheService();
    }
  }

  public void addListener(CacheListener cacheListener) {
    listeners.add(cacheListener);
  }

  public void evict() {
  }

  @SuppressWarnings("unchecked")
  public Map getAll(Collection collection) {
    return service.getAll(collection);
  }

  public CacheEntry getCacheEntry(Object o) {
    Object value = service.get(o);
    if (value == null && !service.contains(o)) {
      return null;
    }
    return new GCacheEntry(this, o, value);
  }

  public CacheStatistics getCacheStatistics() {
    return new GCacheStats(service.getStatistics());
  }

  /**
   * Not supported.
   */
  public void load(Object o) {
    throw new UnsupportedOperationException();
  }

  /**
   * Not supported.
   */
  public void loadAll(Collection collection) {
    throw new UnsupportedOperationException();
  }

  public Object peek(Object o) {
    return get(o);
  }

  public void removeListener(CacheListener cacheListener) {
    listeners.remove(cacheListener);
  }

  public int size() {
    return getCacheStatistics().getObjectCount();
  }

  public boolean isEmpty() {
    return size() == 0;
  }

  public boolean containsKey(Object key) {
    return service.contains(key);
  }

  /**
   * Not supported.
   */
  public boolean containsValue(Object value) {
    throw new UnsupportedOperationException();
  }

  public Object get(Object key) {
    return service.get(key);
  }

  public Object put(Object key, Object value) {
    for (CacheListener listener : listeners) {
      listener.onPut(value);
    }
    boolean added = service.put(key, value, expiration, setPolicy);
    if (!added && throwOnPutFailure) {
      throw new GCacheException("Policy prevented put operation");
    }
    return null;
  }

  public Object remove(Object key) {
    for (CacheListener listener : listeners) {
      listener.onRemove(key);
    }
    Object value = service.get(key);
    service.delete(key);
    return value;
  }

  @SuppressWarnings("unchecked")
  public void putAll(Map m) {
    Set added = service.putAll(m, expiration, setPolicy);
    if (throwOnPutFailure && added.size() < m.size()) {
      throw new GCacheException("Policy prevented some put operations");
    }
  }

  public void clear() {
    for (CacheListener listener : listeners) {
      listener.onClear();
    }
    service.clearAll();
  }

  /**
   * Not supported.
   */
  public Set keySet() {
    throw new UnsupportedOperationException();
  }

  /**
   * Not supported.
   */
  public Collection values() {
    throw new UnsupportedOperationException();
  }

  /**
   * Not supported.
   */
  public Set entrySet() {
    throw new UnsupportedOperationException();
  }

  /**
   * Implementation of the JCache {@link CacheStatistics} using memcache
   * provided statistics.
   */
  private static class GCacheStats implements CacheStatistics {

    private Stats stats;

    /**
     * Creates a statistics snapshot using the provided stats.
     * @param stats Statistics to use.
     */
    private GCacheStats(Stats stats) {
      this.stats = stats;
    }

    public void clearStatistics() {
      throw new UnsupportedOperationException();
    }

    public int getCacheHits() {
      return (int) stats.getHitCount();
    }

    public int getCacheMisses() {
      return (int) stats.getMissCount();
    }

    public int getObjectCount() {
      return (int) stats.getItemCount();
    }

    public int getStatisticsAccuracy() {
      throw new UnsupportedOperationException();
    }

    public String toString() {
      return stats.toString();
    }
  }
}

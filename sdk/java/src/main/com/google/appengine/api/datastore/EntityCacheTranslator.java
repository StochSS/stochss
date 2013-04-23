package com.google.appengine.api.datastore;

import static com.google.appengine.api.datastore.CacheValueUtil.createCacheValue;

import com.google.appengine.api.datastore.EntityCache.CasCacheValues;
import com.google.appengine.api.datastore.EntityCache.IdentifiableCacheValue;
import com.google.appengine.api.memcache.Expiration;
import com.google.appengine.api.memcache.MemcacheService.CasValues;
import com.google.appengine.api.memcache.MemcacheService.IdentifiableValue;
import com.google.apphosting.datastore.EntityStorage.CacheValue;
import com.google.apphosting.datastore.EntityStorage.CacheValue.State;

import java.util.Calendar;
import java.util.GregorianCalendar;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * Translates keys and values from the {@link EntityCache} to the
 * {@link com.google.appengine.api.memcache.MemcacheService MemcacheService} in a cross-platform
 * compatible way.
 *
 */
final class EntityCacheTranslator {
  static Logger logger = Logger.getLogger(EntityCacheTranslator.class.getName());
  private static final Level LOG_LEVEL = Level.INFO;

  static final Expiration EVICT_IMMEDIATELY =
      Expiration.onDate(new GregorianCalendar(2013, Calendar.JANUARY, 1).getTime());

  static final byte[] READ_IN_PROGRESS_MEMCACHE_VALUE =
      createCacheValue(State.READ_IN_PROGRESS, null).toByteArray();
  static final byte[] MUTATION_IN_PROGRESS_MEMCACHE_VALUE =
      createCacheValue(State.MUTATION_IN_PROGRESS, null).toByteArray();
  static final byte[] EMPTY_MEMCACHE_VALUE =
      createCacheValue(State.EMPTY, null).toByteArray();

  /**
   * @return the memcache value for the the specified {@link CacheValue} object. The returned
   *     value should not be modified.
   */
  public static byte[] toMemcacheValue( CacheValue value) {
    if (value == null) {
      return EMPTY_MEMCACHE_VALUE;
    } else {
      switch (value.getStateEnum()) {
        case ENTITY:
          return value.toByteArray();
        case READ_IN_PROGRESS:
          return READ_IN_PROGRESS_MEMCACHE_VALUE;
        case MUTATION_IN_PROGRESS:
          return MUTATION_IN_PROGRESS_MEMCACHE_VALUE;
        case EMPTY:
          return EMPTY_MEMCACHE_VALUE;
        default:
          throw new IllegalArgumentException(
              "Unexpected cache value state: " + value.getStateEnum());
      }
    }
  }

  public static CasValues toMemcacheCasValues(CasCacheValues casCacheValues) {
    CacheValue newValue = casCacheValues.getNewValue();
    IdentifiableCacheValue oldValue = casCacheValues.getOldValue();
    if (newValue == null) {
      return new CasValues(oldValue.getMemcacheValue(),
          EMPTY_MEMCACHE_VALUE, EVICT_IMMEDIATELY);
    } else {
      return new CasValues(oldValue.getMemcacheValue(), toMemcacheValue(newValue));
    }
  }

  public static CacheValue fromMemcacheValue( byte[] memcacheValue) {
    if (memcacheValue == null) {
      return null;
    } else {
      CacheValue cacheValue = new CacheValue();
      if (!cacheValue.mergeFrom(memcacheValue)) {
        logger.log(LOG_LEVEL, "Cache value deserialization error");
        return null;
      }
      if (cacheValue.getStateEnum() == State.EMPTY) {
        return null;
      } else {
        return cacheValue;
      }
    }
  }

  public static IdentifiableCacheValue fromMemcacheIdentifiableValue(
      IdentifiableValue memcacheValue) {
    byte[] memcacheValueAsBytes;
    try {
      memcacheValueAsBytes = (byte[]) memcacheValue.getValue();
    } catch (ClassCastException e) {
      logger.log(LOG_LEVEL, "Unexpected cache value type", e);
      return null;
    }
    CacheValue cacheValue = fromMemcacheValue(memcacheValueAsBytes);
    if (cacheValue == null) {
      return null;
    } else {
      return new IdentifiableCacheValue(memcacheValue, cacheValue);
    }
  }

  public static final String toMemcacheKey(Key key) {
    return KeyFactory.keyToString(key);
  }

  public static final Key fromMemcacheKey(String memcacheKey) {
    return KeyFactory.stringToKey(memcacheKey);
  }

  private EntityCacheTranslator() {
  }
}

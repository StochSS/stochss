package com.google.appengine.api.datastore;

import static com.google.common.base.Preconditions.checkArgument;

import com.google.appengine.api.memcache.AsyncMemcacheService;
import com.google.appengine.api.memcache.ConsistentErrorHandler;
import com.google.appengine.api.memcache.ErrorHandlers;
import com.google.appengine.api.memcache.Expiration;
import com.google.appengine.api.memcache.InvalidValueException;
import com.google.appengine.api.memcache.MemcacheService.CasValues;
import com.google.appengine.api.memcache.MemcacheService.IdentifiableValue;
import com.google.appengine.api.memcache.MemcacheService.SetPolicy;
import com.google.appengine.api.memcache.MemcacheServiceException;
import com.google.appengine.api.memcache.MemcacheServiceFactory;

import java.util.Collection;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.Future;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * Helper class for the memcache service.
 *
 */
class MemcacheServiceHelper {

  static final double DEFAULT_MEMCACHE_RPC_DEADLINE_SECS = 1;

  static Logger logger = Logger.getLogger(MemcacheServiceHelper.class.getName());
  private static final Level LOG_LEVEL = Level.INFO;

  static final String NAMESPACE = "__ah-datastore-l2-v1__";

  private double rpcDeadlineSecs = DEFAULT_MEMCACHE_RPC_DEADLINE_SECS;
  private Expiration defaultValueExpirationTime;
  private final AsyncMemcacheService memcacheService;

  private MemcacheServiceHelper() {
    memcacheService = MemcacheServiceFactory.getAsyncMemcacheService(NAMESPACE);
    memcacheService.setErrorHandler(new MemcacheExceptionConvertingErrorHandler());
  }

  MemcacheServiceHelper(AsyncMemcacheService memcacheService) {
    this.memcacheService = memcacheService;
  }

  /**
   * Updates the memcache operation RPC deadline to use for memcache RPCs.
   *
   * @param rpcDeadlineSecs the memcache operation RPC deadline in seconds.
   * @return {@code this} (for chaining).
   * @throws IllegalArgumentException if the {@code rpcDeadlineSecs} is not greater than zero.
   */
  public MemcacheServiceHelper rpcDeadlineSecs(double rpcDeadlineSecs) {
    checkArgument(rpcDeadlineSecs > 0, "The rpcDeadlineSecs argument must be greater than 0");
    this.rpcDeadlineSecs = rpcDeadlineSecs;
    return this;
  }

  /**
   * @return the memcache operation RPC deadline in seconds.
   */
  public double getRpcDeadlineSecs() {
    return rpcDeadlineSecs;
  }

  /**
   * Updates the expiration time for values stored in the cache without an explicit expiration time.
   * By default, values without an explicit expiration time are cached for as long of a duration as
   * possible.
   *
   * @param defaultValueExpirationTime the default value expiration time. Or {@code null} to specify
   *     an indefinite default expiration time.
   * @return {@code this} (for chaining).
   */
  public MemcacheServiceHelper defaultValueExpirationTime( Expiration defaultValueExpirationTime) {
    this.defaultValueExpirationTime = defaultValueExpirationTime;
    return this;
  }

  /**
   * @return the default value expiration time for values stored in the cache without
   *     an explicit expiration time or {@code null} if no default expiration time has been
   *     specified.
   */
  public Expiration getDefaultValueExpirationTime() {
    return defaultValueExpirationTime;
  }

  /**
   * Updates the {@link MemcacheServiceHelper} instance to log and absorb any memcache
   * service errors. By default, memcache service errors are converted to
   * {@code DatastoreFailureException} exceptions and thrown from the memcache operation
   * methods.
   *
   * @return the newly created {@code MemcacheServiceHelper} instance.
   */
  public MemcacheServiceHelper logAndAbsorbMemcacheServiceErrors() {
    memcacheService.setErrorHandler(ErrorHandlers.getConsistentLogAndContinue(LOG_LEVEL));
    return this;
  }

  /**
   * Fetches previously-stored cache values. The values returned can be used in subsequent calls
   * to {@link #putIfUntouched}.
   *
   * @param keys a collection of keys for which values should be retrieved
   * @return a mapping from keys to values of any entries found. If a requested
   *     key is not found in the cache the key will not be in the returned Map.
   * @throws IllegalArgumentException if any element of {@code keys} is {@code null}
   *     or not {@link Serializable}.
   * @throws DatastoreFailureException if a memcache service error occurs and
   *     {@link #logAndAbsorbMemcacheServiceErrors} has not been specified.
   */
  public <K> Future<Map<K, IdentifiableValue>> getIdentifiable(Collection<K> keys) {
    return memcacheService.getIdentifiables(keys);
  }

  /**
   * Sets the value in the cache for each key/value pair in the {@code values} map if the update
   * satisfies the cache update {@code policy}.
   * <p>
   * The expiration time for each value stored is specified by
   * {@link #defaultValueExpirationTime(Expiration)}.
   *
   * @param values the key/value mappings to add to the cache
   * @param policy what to do if the cache entry is or is not already present
   * @return the set of keys for which entries were created.  Keys in {@code values} may not be
   *     in the returned set because of the {@code policy} regarding pre-existing entries.
   * @throws IllegalArgumentException if any of the keys or values are {@code null} or
   *     or are not {@link Serializable}.
   * @throws DatastoreFailureException if a memcache service error occurs and
   *     {@link #logAndAbsorbMemcacheServiceErrors} has not been specified.
   */
  public <K> Future<Set<K>> put(Map<K, ?> values, SetPolicy policy) {
    return put(values, policy, defaultValueExpirationTime);
  }

  /**
   * Sets the value in the cache for each key/value pair in the {@code values} map if the update
   * satisfies the cache update {@code policy}.
   *
   * @param values the key/value mappings to add to the cache
   * @param policy what to do if the cache entry is or is not already present
   * @param valueExpirationTime the memcache value expiration time to use for each value updated
   *     in the cache. This overrides the default value expiration time. If {@code null} the
   *     expiration time is indefinite.
   * @return the set of keys for which entries were created.  Keys in {@code values} may not be
   *     in the returned set because of the {@code policy} regarding pre-existing entries.
   * @throws IllegalArgumentException if any of the keys or values are {@code null} or
   *     or are not {@link Serializable}.
   * @throws DatastoreFailureException if a memcache service error occurs and
   *     {@link #logAndAbsorbMemcacheServiceErrors} has not been specified.
   */
  public <K> Future<Set<K>> put(Map<K, ?> values, SetPolicy policy, Expiration valueExpirationTime) {
    return memcacheService.putAll(values, valueExpirationTime, policy);
  }

  /**
   * Atomically stores the new value of each {@link CasValues} object in the {@code values} map if
   * no other value has been stored in the cache since the {@code CasValues} object's old value
   * was retrieved from {@link #getIdentifiable}. If another value in the cache for {@code key}
   * has been stored, or if the cache entry has been evicted then nothing is stored by this call.
   * <p>
   * The expiration time for each {@CasValues} object with a {@code null} expiration time is
   * specified by {@link #defaultValueExpirationTime(Expiration)}.
   *
   * @param values the key/values mappings to compare and swap.
   * @return the set of keys for which the new value was stored.
   * @throws IllegalArgumentException If any of the keys or newValues are {@code null} or
   *     or are not {@link Serializable}. Also throws IllegalArgumentException if {@code values} has
   *     any nulls.
   * @throws DatastoreFailureException if a memcache service error occurs and
   *     {@link #logAndAbsorbMemcacheServiceErrors} has not been specified.
   */
  public <K> Future<Set<K>> putIfUntouched(Map<K, CasValues> values) {
    return putIfUntouched(values, defaultValueExpirationTime);
  }

  /**
   * Atomically stores the new value of each {@link CasValues} object in the {@code values} map if
   * no other value has been stored in the cache since the {@code CasValues} object's old value
   * was retrieved from {@link #getIdentifiable}. If another value in the cache for {@code key}
   * has been stored, or if the cache entry has been evicted then nothing is stored by this call.
   * <p>
   *
   * @param values the key/values mappings to compare and swap.
   * @param valueExpirationTime the expiration time to use for all {@code values} with a
   *     {@code null} {@link Expiration expiration} value in the {@code CasValues} object.
   *     This overrides the default value expiration time. If this is {@code null} and the
   *     {@code CasValues} object's expiration time is {@code null} then an indefinite expiration
   *     time will be specified for that {@code CasValue} object.
   * @return the set of keys for which the new value was stored.
   * @throws IllegalArgumentException If any of the keys or newValues are {@code null} or
   *     or are not {@link Serializable}. Also throws IllegalArgumentException if {@code values} has
   *     any nulls.
   * @throws DatastoreFailureException if a memcache service error occurs and
   *     {@link #logAndAbsorbMemcacheServiceErrors} has not been specified.
   */
  public <K> Future<Set<K>> putIfUntouched(Map<K, CasValues> values, Expiration valueExpirationTime) {
    return memcacheService.putIfUntouched(values, valueExpirationTime);
  }

  /**
   * Deletes cache entries for the specified keys.
   *
   * @param keys a collection of keys for entries to delete
   * @return the set of keys successfully deleted.  Any keys in {@code keys} but not in the
   *     returned set were not found in the cache. The iteration order of the returned set matches
   *     the iteration order of the provided {@code keys}.
   * @throws IllegalArgumentException if any element of {@code keys} is not {@link Serializable}
   *     and is not {@code null}
   * @throws DatastoreFailureException if a memcache service error occurs and
   *     {@link #logAndAbsorbMemcacheServiceErrors} has not been specified.
   */
  public <K> Future<Set<K>> delete(Collection<K> keys) {
    return memcacheService.deleteAll(keys);
  }

  /**
   * A memcache service error handler that converts memcache service errors into
   * {@link DatastoreFailureException} exceptions.
   */
  private static class MemcacheExceptionConvertingErrorHandler implements ConsistentErrorHandler {

    @Override
    public void handleDeserializationError(InvalidValueException t) {
      throw new DatastoreFailureException("Memcache deserialization error", t);
    }

    @Override
    public void handleServiceError(MemcacheServiceException t) {
      throw new DatastoreFailureException("Memcache service error", t);
    }
  }

  /**
   * Contains static creation methods for {@link MemcacheServiceHelper} instances.
   */
  public static final class Builder {

    /**
     * Creates a {@link MemcacheServiceHelper} instance with the specified memcache RPC deadline to
     * use for memcache RPCs.
     *
     * @param rpcDeadlineSecs the memcache operation RPC deadline in seconds.
     * @return the newly created {@code MemcacheServiceHelper} instance.
     * @throws IllegalArgumentException if the {@code rpcDeadlineSecs} is not greater than zero.
     */
    public static MemcacheServiceHelper withRpcDeadlineSecs(double rpcDeadlineSecs) {
      return new MemcacheServiceHelper().rpcDeadlineSecs(rpcDeadlineSecs);
    }

    /**
     * Creates a {@link MemcacheServiceHelper} instance with the specified expiration time for
     * values stored in the cache without an explicit expiration time. By default, values without
     * an explicit expiration time are cached for as long of a duration as possible.
     *
     * @param defaultValueExpirationTime the default value expiration time. Or {@code null} to
     *     specify an indefinite default expiration time.
     * @return the newly created {@code MemcacheServiceHelper} instance.
     */
    public static MemcacheServiceHelper withDefaultValueExpirationTime( Expiration defaultValueExpirationTime) {
      return new MemcacheServiceHelper().defaultValueExpirationTime(defaultValueExpirationTime);
    }

    /**
     * Creates a {@link MemcacheServiceHelper} instance which logs and absorbs any memcache
     * service errors. By default, memcache service errors are converted to
     * {@code DatastoreFailureException} exceptions and thrown from the memcache operation methods.
     *
     * @return the newly created {@code MemcacheServiceHelper} instance.
     */
    public static MemcacheServiceHelper withLogAndAbsorbMemcacheServiceErrors() {
      return new MemcacheServiceHelper().logAndAbsorbMemcacheServiceErrors();
    }

    /**
     * Creates a {@link MemcacheServiceHelper} instance with the default configuration.
     */
    public static MemcacheServiceHelper withDefaults() {
      return new MemcacheServiceHelper();
    }

    private Builder() {}
  }
}

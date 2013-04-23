// Copyright 2008 Google Inc. All Rights Reserved.
package com.google.appengine.api.memcache;

/**
 * Handles errors raised by the {@code MemcacheService}, registered with
 * {@link MemcacheService#setErrorHandler(ErrorHandler)}.
 *
 * The default error handler is an instance of {@link LogAndContinueErrorHandler}.
 * In most cases this will log the underlying error condition, but emulate
 * cache-miss behavior in response rather than surfacing the problem to calling
 * code. A less permissive alternative is {@link StrictErrorHandler},
 * which will instead throw a {@link MemcacheServiceException} to expose any
 * errors for application code to resolve.
 * To guarantee that all {@link MemcacheServiceException} are directed to the
 * error handler use {@link ConsistentErrorHandler} instead.
 *
 * @deprecated Use {@link ConsistentErrorHandler} instead
 */
@Deprecated
public interface ErrorHandler {

  /**
   * Handles deserialization errors.  This method is called from either of the
   * {@link MemcacheService#get(Object) get} methods, if the retrieved value
   * cannot be deserialized.  This normally indicates an application upgrade
   * since the cache entry was stored, and should thus be treated as a cache
   * miss, which is the behavior of {@link LogAndContinueErrorHandler} (the
   * default).
   */
  void handleDeserializationError(InvalidValueException ivx);

  /**
   * Handles back-end service errors.  This method is called
   * from most of the {@code MemcacheService} methods in the event of a
   * service error.  The handler may throw any {@link RuntimeException},
   * or it may simply return for "permissive" error handling, which will
   * generally emulate behavior of a cache miss due to a discarded entry.
   *
   *  @param ex the service error exception
   */
  void handleServiceError(MemcacheServiceException ex);

}

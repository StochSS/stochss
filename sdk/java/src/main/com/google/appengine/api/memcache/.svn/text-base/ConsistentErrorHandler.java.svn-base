// Copyright 2011 Google Inc. All Rights Reserved.

package com.google.appengine.api.memcache;

/**
 * A marker interface to indicate that all {@link MemcacheServiceException}
 * exceptions should be handled by
 * {@link ErrorHandler#handleServiceError(MemcacheServiceException)}.
 * This interface was added to enable handling {@link MemcacheServiceException}
 * thrown by the various {@link MemcacheService#put(Object, Object)} methods while
 * preserving backward compatibility with {@link ErrorHandler} which did not handle
 * such cases.
 *
 */
@SuppressWarnings("deprecation")
public interface ConsistentErrorHandler extends ErrorHandler {

  @Override
  void handleDeserializationError(InvalidValueException ivx);

  @Override
  void handleServiceError(MemcacheServiceException ex);
}

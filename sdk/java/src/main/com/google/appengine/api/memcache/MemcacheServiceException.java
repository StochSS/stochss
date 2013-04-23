// Copyright 2008 Google Inc. All Rights Reserved.
package com.google.appengine.api.memcache;

/**
 * An exception for backend non-availability or similar error states which
 * may occur, but are not necessarily indicative of a coding or usage error
 * by the application.  In most cases these will be given to the
 * {@link ErrorHandler} to resolve. Use {@link ConsistentErrorHandler} if in
 * all cases this exception should be directed to the {@code ErrorHandler}.
 *
 */
public class MemcacheServiceException extends RuntimeException {
  public MemcacheServiceException(String message, Throwable ex) {
    super(message, ex);
  }
  public MemcacheServiceException(String message) {
    super(message);
  }
}

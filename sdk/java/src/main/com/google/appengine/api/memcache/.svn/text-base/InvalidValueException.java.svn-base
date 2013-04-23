// Copyright 2008 Google Inc. All Rights Reserved.
package com.google.appengine.api.memcache;

/**
 * Thrown when a cache entry has content, but it cannot be read.  For example:
 * <ul>
 * <li>An attempt to {@link MemcacheService#increment} a non-integral value
 * <li>Version skew between your application and the data in the cache,
 *     causing a serialization error.
 * </ul>
 *
 */
public class InvalidValueException extends RuntimeException {
  public InvalidValueException(String message, Throwable t) {
    super(message, t);
  }

  public InvalidValueException(String message) {
    super(message);
  }
}

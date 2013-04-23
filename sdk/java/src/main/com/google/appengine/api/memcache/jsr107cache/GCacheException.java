// Copyright 2010 Google Inc. All Rights Reserved.

package com.google.appengine.api.memcache.jsr107cache;

/**
 * An exception for events where an operation could not be completed by the
 * memcache service as requested by the GCache interface.
 *
 */
public class GCacheException extends RuntimeException {
  public GCacheException(String message, Throwable ex) {
    super(message, ex);
  }
  public GCacheException(String message) {
    super(message);
  }
}

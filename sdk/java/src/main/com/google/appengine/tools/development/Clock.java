// Copyright 2010 Google Inc. All Rights Reserved.
package com.google.appengine.tools.development;

/**
 * Clock abstraction used by all local service implementations.
 * Allows tests to override 'now'.
 *
 */
public interface Clock {
  /**
   * @return current time in milliseconds-since-epoch.
   */
  long getCurrentTime();

  /**
   * The Clock instance used by local services if no override is
   * provided via {@link ApiProxyLocal#setClock(Clock)}
   */
  Clock DEFAULT = new Clock() {
    @Override
    public long getCurrentTime() {
      return System.currentTimeMillis();
    }
  };
}

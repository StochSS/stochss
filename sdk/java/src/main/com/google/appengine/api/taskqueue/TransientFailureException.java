// Copyright 2010 Google Inc. All rights reserved.
package com.google.appengine.api.taskqueue;

/**
 * Intermittent failure.
 * <p>The requested operation may succeed if attempted again.
 *
 */
public class TransientFailureException extends RuntimeException {
  public TransientFailureException(String detail) {
    super(detail);
  }
}

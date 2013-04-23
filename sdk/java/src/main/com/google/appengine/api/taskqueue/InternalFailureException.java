// Copyright 2010 Google Inc. All rights reserved.
package com.google.appengine.api.taskqueue;

/**
 * Internal task queue error.
 *
 */
public class InternalFailureException extends RuntimeException {
  public InternalFailureException(String detail) {
    super(detail);
  }
}

// Copyright 2011 Google Inc. All Rights Reserved.

package com.google.appengine.api.taskqueue;

/**
 * Indicates a failure to create a task payload.  This is
 * most likely an issue with serialization.
 *
 */
public class DeferredTaskCreationException extends RuntimeException {
  DeferredTaskCreationException(Throwable e) {
    super(e);
  }
}

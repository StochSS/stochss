// Copyright 2011 Google Inc. All Rights Reserved.
package com.google.appengine.api.taskqueue;

/**
 * Mismatch of task method and queue mode.
 * e.g. {@link Queue#leaseTasks(long, java.util.concurrent.TimeUnit, long)} called on a push queue,
 * {@link Queue#add(TaskOptions)} with method {@link TaskOptions.Method} PULL to
 * a push queue, or with {@link TaskOptions.Method} not equal to PULL to a pull
 * queue.
 *
 */
public class InvalidQueueModeException extends RuntimeException {
  public InvalidQueueModeException(String detail) {
    super(detail);
  }
}

// Copyright 2010 Google Inc. All rights reserved.
package com.google.appengine.api.taskqueue;

/**
 * The task name already exists in the queue.
 *
 */
public class TaskAlreadyExistsException extends RuntimeException {
  public TaskAlreadyExistsException(String detail) {
    super(detail);
  }
}

// Copyright 2012 Google Inc. All rights reserved.
package com.google.appengine.api.taskqueue;

/**
 * Creates {@link Queue} objects.
 * {@link QueueFactory} is thread safe.
 *
 */
public interface IQueueFactory {

  /**
   * Returns the {@link Queue} by name.
   * <p>The returned {@link Queue} object may not necessarily refer
   * to an existing queue.  Queues must be configured before
   * they may be used.  Attempting to use a non-existing queue name
   * may result in errors at the point of use of the {@link Queue} object
   * and not when calling {@link #getQueue(String)}.
   */
  Queue getQueue(String queueName);

}

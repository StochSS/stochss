// Copyright 2010 Google Inc. All rights reserved.
package com.google.appengine.api.taskqueue;

import com.google.appengine.spi.ServiceFactoryFactory;

/**
 * Creates {@link Queue} objects.
 * {@link QueueFactory} is thread safe.
 *
 */
public final class QueueFactory {

  /**
   * Returns the default {@code QueueService}.
   */
  public static Queue getDefaultQueue() {
    return getQueue(Queue.DEFAULT_QUEUE);
  }

  /**
   * Returns the {@link Queue} by name.
   * <p>The returned {@link Queue} object may not necessarily refer
   * to an existing queue.  Queues must be configured before
   * they may be used.  Attempting to use a non-existing queue name
   * may result in errors at the point of use of the {@link Queue} object
   * and not when calling {@link #getQueue(String)}.
   */
  public static Queue getQueue(String queueName) {
    return getFactory().getQueue(queueName);
  }

  private QueueFactory() {
  }

  private static IQueueFactory getFactory() {
    return ServiceFactoryFactory.getFactory(IQueueFactory.class);
  }
}

// Copyright 2012 Google Inc. All rights reserved.
package com.google.appengine.api.taskqueue;

import java.util.HashMap;
import java.util.Map;

/**
 * Creates {@link Queue} objects.
 * {@link QueueFactory} is thread safe.
 *
 */
final class QueueFactoryImpl implements IQueueFactory {
  private static final QueueApiHelper helper = new QueueApiHelper();
  private static final Map<String, Queue> queueMap = new HashMap<String, Queue>();

  @Override
  public synchronized Queue getQueue(String queueName) {
    Queue queue = queueMap.get(queueName);
    if (queue == null) {
      queue = new QueueImpl(queueName, helper);
      queueMap.put(queueName, queue);
    }
    return queue;
  }

}

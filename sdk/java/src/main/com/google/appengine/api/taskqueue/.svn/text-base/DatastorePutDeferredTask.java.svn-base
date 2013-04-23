// Copyright 2012 Google Inc. All Rights Reserved.
package com.google.appengine.api.taskqueue;

import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;

/**
 * A {@link DeferredTask} implementation that puts the provided entities when
 * it runs.
 *
 */
class DatastorePutDeferredTask implements DeferredTask {
  private final Entity putMe;

  public DatastorePutDeferredTask(Entity putMe) {
    if (putMe == null) {
      throw new NullPointerException("putMe cannot be null");
    }
    this.putMe = putMe;
  }

  @Override
  public void run() {
    DatastoreServiceFactory.getDatastoreService().put(putMe);
  }
}

// Copyright 2012 Google Inc. All Rights Reserved.
package com.google.appengine.api.taskqueue;

import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Key;

/**
 * A {@link DeferredTask} implementation that deletes the entities uniquely
 * identified by the provided {@link Key Keys} when it runs.
 *
 */
class DatastoreDeleteDeferredTask implements DeferredTask {
  private final Key deleteMe;

  public DatastoreDeleteDeferredTask(Key deleteMe) {
    if (deleteMe == null) {
      throw new NullPointerException("deleteMe cannot be null");
    }
    this.deleteMe = deleteMe;
  }

  @Override
  public void run() {
    DatastoreServiceFactory.getDatastoreService().delete(deleteMe);
  }
}

// Copyright 2011 Google Inc. All Rights Reserved.
package com.google.appengine.api.datastore;

import java.util.List;
import java.util.concurrent.Future;

/**
 * {@link PostOpFuture} implementation that invokes PostPut callbacks.
 *
 */
class PostPutFuture extends PostOpFuture<List<Key>> {
  private final PutContext postPutContext;

  PostPutFuture(Future<List<Key>> delegate, DatastoreCallbacks callbacks,
      PutContext postPutContext) {
    super(delegate, callbacks);
    this.postPutContext = postPutContext;
  }

  @Override
  void executeCallbacks(List<Key> result) {
    datastoreCallbacks.executePostPutCallbacks(postPutContext);
  }
}

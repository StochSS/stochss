// Copyright 2011 Google Inc. All Rights Reserved.
package com.google.appengine.api.datastore;

import java.util.concurrent.Future;

/**
 * {@link PostOpFuture} implementation that invokes PostDelete callbacks.
 *
 */
class PostDeleteFuture extends PostOpFuture<Void> {
  private final DeleteContext postDeleteContext;

  PostDeleteFuture(Future<Void> delegate, DatastoreCallbacks callbacks,
      DeleteContext postDeleteContext) {
    super(delegate, callbacks);
    this.postDeleteContext = postDeleteContext;
  }

  @Override
  void executeCallbacks(Void ignore) {
    datastoreCallbacks.executePostDeleteCallbacks(postDeleteContext);
  }
}

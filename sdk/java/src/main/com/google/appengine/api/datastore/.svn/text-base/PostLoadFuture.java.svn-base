// Copyright 2012 Google Inc. All Rights Reserved.
package com.google.appengine.api.datastore;

import com.google.common.collect.Lists;

import java.util.Map;
import java.util.concurrent.Future;

/**
 * {@link PostOpFuture} implementation that invokes PostLoad callbacks.
 *
 */
class PostLoadFuture extends PostOpFuture<Map<Key, Entity>> {
  private final CurrentTransactionProvider txnProvider;

  PostLoadFuture(Future<Map<Key, Entity>> delegate, DatastoreCallbacks callbacks,
      CurrentTransactionProvider txnProvider) {
    super(delegate, callbacks);
    this.txnProvider = txnProvider;
  }

  @Override
  void executeCallbacks(Map<Key, Entity> result) {
    PostLoadContext postGetContext =
        new PostLoadContext(txnProvider, Lists.newArrayList(result.values()));
    datastoreCallbacks.executePostLoadCallbacks(postGetContext);
  }
}

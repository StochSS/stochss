// Copyright 2011 Google Inc. All Rights Reserved.
package com.google.appengine.api.datastore;

import com.google.appengine.api.utils.FutureWrapper;

import java.util.concurrent.Future;

/**
 * An abstract {@link FutureWrapper} implementation that invokes callbacks
 * before returning its value.  The base class ensures that callbacks only run
 * once.
 *
 * @param <T> The type of Future.
 *
 */
abstract class PostOpFuture<T> extends FutureWrapper<T, T> {

  final DatastoreCallbacks datastoreCallbacks;

  PostOpFuture(Future<T> delegate, DatastoreCallbacks datastoreCallbacks) {
    super(delegate);
    this.datastoreCallbacks = datastoreCallbacks;
  }

  @Override
  protected final T wrap(T result) {
    executeCallbacks(result);
    return result;
  }

  @Override
  protected final Throwable convertException(Throwable cause) {
    return cause;
  }

  /**
   * Responsible for actual execution of the callbacks.
   */
  abstract void executeCallbacks(T result);
}

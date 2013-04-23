// Copyright 2013 Google Inc. All rights reserved.

package com.google.appengine.api.taskqueue;

import com.google.appengine.api.utils.FutureWrapper;

import java.util.concurrent.Future;

/**
 * {@code FutureAdapter} is a simple {@link FutureWrapper} for situations where
 * no conversion of exceptions is required. This class is thread-safe.
 *
 * @param <K> The type of this {@link Future}
 * @param <V> The type of the wrapped {@link Future}
 */
abstract class FutureAdapter<K, V> extends FutureWrapper<K, V> {

  FutureAdapter(Future<K> parent) {
    super(parent);
  }

  protected final Throwable convertException(Throwable cause) {
    return cause;
  }
}

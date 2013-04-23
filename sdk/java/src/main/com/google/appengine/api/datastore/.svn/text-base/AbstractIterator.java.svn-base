// Copyright 2009 Google Inc. All Rights Reserved.
package com.google.appengine.api.datastore;

import java.util.Iterator;
import java.util.NoSuchElementException;

/**
 * @see com.google.common.collect.AbstractIterator
 */
abstract class AbstractIterator<T> implements Iterator<T> {
  private State state = State.NOT_READY;

  enum State {
    READY,
    NOT_READY,
    DONE,
    FAILED,
  }

  private T next;

  protected abstract T computeNext();

  protected final T endOfData() {
    state = State.DONE;
    return null;
  }

  @Override
  public final boolean hasNext() {
    if (state == State.FAILED) {
      throw new IllegalStateException();
    }
    switch (state) {
      case DONE:
        return false;
      case READY:
        return true;
      default:
    }
    return tryToComputeNext();
  }

  private boolean tryToComputeNext() {
    state = State.FAILED;
    next = computeNext();
    if (state != State.DONE) {
      state = State.READY;
      return true;
    }
    return false;
  }

  @Override
  public final T next() {
    if (!hasNext()) {
      throw new NoSuchElementException();
    }
    state = State.NOT_READY;
    return next;
  }

  @Override
  public void remove() {
    throw new UnsupportedOperationException();
  }
}

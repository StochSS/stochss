// Copyright 2009 Google Inc. All Rights Reserved.
package com.google.appengine.api.datastore;

import java.util.Iterator;

/**
 * {@link Iterator} implementation that respects the provided offset and limit.
 *
 */
class SlicingIterator<T> extends AbstractIterator<T> {

  private final Iterator<T> delegate;
  private int remainingOffset;
  private final Integer limit;
  private Integer numEntitiesReturned = 0;

  /**
   * @param delegate The {@link Iterator} that we're slicing.
   * @param offset The number of results to consume before we actually return
   * any data.  Can be null.
   * @param limit The maximum number of results we'll return.  Can be null.
   */
  SlicingIterator(Iterator<T> delegate, Integer offset, Integer limit) {
    this.remainingOffset = offset == null ? 0 : offset;
    this.limit = limit;
    this.delegate = delegate;
  }

  @Override
  protected T computeNext() {
    if (numEntitiesReturned.equals(limit)) {
      endOfData();
    }
    T next = null;
    while (delegate.hasNext() && remainingOffset-- >= 0) {
      next = delegate.next();
    }

    if (remainingOffset >= 0 || next == null) {
      endOfData();
    } else {
      remainingOffset = 0;
      numEntitiesReturned++;
    }
    return next;
  }
}

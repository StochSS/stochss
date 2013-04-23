// Copyright 2011 Google Inc. All Rights Reserved.

package com.google.appengine.api.datastore;

import java.util.Iterator;
import java.util.List;

/**
 * A class that simply forwards {@link Iterator} methods to one delegate
 * and forwards {@link List} to another.
 *
 * @param <T> the type of result returned by the query
 *
 */
class QueryResultIteratorDelegator<T> implements QueryResultIterator<T> {

  private final QueryResult queryResultDelegate;
  private final Iterator<T> iteratorDelegate;

  QueryResultIteratorDelegator(QueryResult queryResultDelegate,
                               Iterator<T> iteratorDelegate) {
    this.queryResultDelegate = queryResultDelegate;
    this.iteratorDelegate = iteratorDelegate;
  }

  @Override
  public List<Index> getIndexList() {
    return queryResultDelegate.getIndexList();
  }

  @Override
  public Cursor getCursor() {
    return queryResultDelegate.getCursor();
  }

  @Override
  public boolean hasNext() {
    return iteratorDelegate.hasNext();
  }

  @Override
  public T next() {
    return iteratorDelegate.next();
  }

  @Override
  public void remove() {
    iteratorDelegate.remove();
  }

}

// Copyright 2009 Google Inc. All Rights Reserved.
package com.google.appengine.api.datastore;

/**
 * A class that produces {@link QueryResultIterator}s.
 *
 * @param <T> the type of result returned by the query
 *
 */
public interface QueryResultIterable<T> extends Iterable<T> {
  @Override
  QueryResultIterator<T> iterator();
}

// Copyright 2009 Google Inc. All Rights Reserved.
package com.google.appengine.api.datastore;

import java.util.Iterator;
import java.util.List;

/**
 * A class that iterates through the results of a {@link Query}
 *
 * @param <T> the type of result returned by the query
 *
 */
public interface QueryResultIterator<T> extends Iterator<T> {
  /**
   * Get the indexes used to perform the query.
   *
   * @return A list of index references, with no duplicates, or {@code null} if
   * the indexes are not known.
   */
  List<Index> getIndexList();

  /**
   * Gets a {@link Cursor} that points to the {@link Entity} immediately after
   * the last {@link Entity} that was retrieved by {@link #next()}.
   *
   * @return a {@link Cursor} or {@code null} if this query result cannot be resumed
   */
  Cursor getCursor();
}

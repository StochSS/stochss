// Copyright 2009 Google Inc. All Rights Reserved.
package com.google.appengine.api.datastore;

import java.util.List;

/**
 * A list of results returned by executing a {@link Query}.
 *
 * @param <T> the type of result returned by the query
 *
 */
public interface QueryResultList<T> extends List<T> {
  /**
   * Get the indexes used to perform the query.
   *
   * @return A list of index references, with no duplicates, or {@code null} if
   * the indexes are not known.
   */
  List<Index> getIndexList();

  /**
   * Gets a {@link Cursor} that points to the result immediately after
   * the last one in this list.
   *
   * @return a {@link Cursor} or {@code null} if this query result cannot be resumed
   */
  Cursor getCursor();
}

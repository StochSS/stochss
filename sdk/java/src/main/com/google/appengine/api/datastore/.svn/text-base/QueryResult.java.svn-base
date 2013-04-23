// Copyright 2011 Google Inc. All Rights Reserved.

package com.google.appengine.api.datastore;

import java.util.List;

/**
 * An interface shared by all QueryResult classes.
 *
 */
interface QueryResult {

  /**
   * Get the indexes used to perform the query.
   *
   * @return A list of index references, with no duplicates, or {@code null} if
   * the indexes are not known.
   */
  List<Index> getIndexList();

  /**
   * Gets a {@link Cursor} that points to the {@link Entity} immediately after
   * the last {@link Entity} retrieved.
   *
   * @return a {@link Cursor} or {@code null} if this query result cannot be resumed
   */
  Cursor getCursor();

}

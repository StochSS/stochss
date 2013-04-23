// Copyright 2007 Google Inc. All rights reserved.

package com.google.appengine.api.datastore;

import java.util.List;

/**
 * Provides an abstraction for retrieving {@code Entity} objects in
 * arbitrarily-sized batches.
 *
 */
interface QueryResultsSource {
  /**
   * Returns true when there maybe more {@code Entity} objects that
   * can be returned from this {@code QueryResultsSource}.
   */
  boolean hasMoreEntities();

  /**
   * Load at least one {@code Entity} object if there are more entities.
   *
   * @param buffer An out parameter to which the requested entities will be added.
   * @return the cursor that points to the {@link Entity} after the last {@link Entity}
   * returned or {@code null} (see {@link #loadMoreEntities(int, List)} for a description of
   * when this will be {@code null})
   */
  Cursor loadMoreEntities(List<Entity> buffer);

  /**
   * Load the specified number of {@code Entity} objects and add them to the
   * given buffer. This method will only return less than {@code numberToLoad} if
   * less than {@code numberToLoad} entities are present. However this method may
   * return more than {@code numberToLoad} entities at any time.
   *
   * Requesting 0 results to be loaded has the effect of ensuring any offset requested
   * has been satisfied but not requiring any results be loaded (although some might be.
   * This is usually needed before calling {@link #getNumSkipped()} or to get the first
   * {@link Cursor}.
   *
   * This will return {@code null} in any of the following conditions:
   * <ul>
   * <li>{@link #hasMoreEntities()} is false
   * <li>No results were requested and no offset needed to be satisfied.
   * <li>the query does not support the compile flag
   * <li>the compile flag was not set on the {@link FetchOptions} used to run the query
   * <ul>
   *
   * @param numberToLoad the number of entities to get.
   * @param buffer An out parameter to which the requested entities will be added.
   * @return the cursor that points to the {@link Entity} after the last {@link Entity}
   * returned or {@code null}
   */
  Cursor loadMoreEntities(int numberToLoad, List<Entity> buffer);

  /**
   * Returns the number of entities that have been skipped so far.
   *
   * Entities are skipped when an offset has been set on the query.
   */
  int getNumSkipped();

  /**
   * Get the indexes used to perform the query.
   * May sometimes return only the indexes used so far.
   *
   * @return A list of index ids, with no duplicates, or {@code null} if the
   * indexes are not known.
   */
  List<Index> getIndexList();

}

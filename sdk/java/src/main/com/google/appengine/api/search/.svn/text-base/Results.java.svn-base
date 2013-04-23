// Copyright 2010 Google Inc. All Rights Reserved.

package com.google.appengine.api.search;

import com.google.appengine.api.search.checkers.Preconditions;

import java.io.Serializable;
import java.util.Collection;
import java.util.Collections;
import java.util.Iterator;

/**
 * Represents a result of executing a search.
 * The Results include an {@link OperationResult}, a collection of
 * results, and a number of found and returned results.
 *
 * @param <T> The type of search result.
 *
 */
public class Results<T> implements Iterable<T>, Serializable {
  private static final long serialVersionUID = -8342630524311776674L;

  private static final int MAX_RESULTS_TO_STRING = 10;

  private final OperationResult operationResult;
  private final Collection<T> results;
  private final long numberFound;
  private final int numberReturned;
  private final Cursor cursor;

  /**
   * Creates a {@link Results} by specifying a collection of search
   * results, the number of results found, and the number of results
   * returned.
   *
   * @param operationResult the result of the search operation
   * @param results a collection of results that resulted from the search
   * @param numberFound the number of results found by the search
   * @param numberReturned the number of results returned
   * @param cursor the {@link Cursor} if there are more results and user
   * requested it
   */
  protected Results(OperationResult operationResult, Collection<T> results,
      long numberFound, int numberReturned, Cursor cursor) {
    this.operationResult = Preconditions.checkNotNull(operationResult,
        "operation result cannot be null");
    this.results = Collections.unmodifiableCollection(
        Preconditions.checkNotNull(results, "search results cannot be null"));
    this.numberFound = numberFound;
    this.numberReturned = numberReturned;
    this.cursor = cursor;
  }

  @Override
  public Iterator<T> iterator() {
    return results.iterator();
  }

  /**
   * @return the result of the search operation
   */
  public OperationResult getOperationResult() {
    return operationResult;
  }

  /**
   * The number of results found by the search.
   * If the value is less than or equal to the corresponding
   * {@link QueryOptions#getNumberFoundAccuracy()},
   * then it is accurate, otherwise it is an approximation
   *
   * @return the number of results found
   */
  public long getNumberFound() {
    return numberFound;
  }

  /**
   * @return the number of results returned
   */
  public int getNumberReturned() {
    return numberReturned;
  }

  /**
   * @return an unmodifiable collection of search results
   */
  public Collection<T> getResults() {
    return results;
  }

  /**
   * A cursor to be used to continue the search after all the results
   * in this search response. For this field to be populated,
   * use {@link QueryOptions.Builder#setCursor} with a value of
   * {@code Cursor.newBuilder().build()}, otherwise {@link #getCursor}
   * will return null.
   *
   * @return cursor to be used to get the next set of results after the
   * end of these results. Can be {@code null}
   */
  public Cursor getCursor() {
    return cursor;
  }

  @Override
  public String toString() {
    return String.format("Results(operationResult=%s, results=%s, numberFound=%d, " +
        "numberReturned=%d, cursor=%s)",
        operationResult, Util.iterableToString(results, MAX_RESULTS_TO_STRING),
        numberFound, numberReturned, cursor);
  }
}

// Copyright 2011 Google Inc. All Rights Reserved.

package com.google.appengine.api.search;

import com.google.appengine.api.search.checkers.Preconditions;

import java.io.Serializable;
import java.util.Collections;
import java.util.Iterator;
import java.util.List;

/**
 * Represents a result of executing a {@link GetRequest}. The
 * response contains a list of T.
 *
 * @param <T> The type of object to be listed from an index
 *
 */
public class GetResponse<T> implements Iterable<T>, Serializable {
  private static final long serialVersionUID = 7050146612334976140L;

  private final List<T> results;

  /**
   * Creates a {@link GetResponse} by specifying a list of T.
   *
   * @param results a list of T returned from the index
   */
  protected GetResponse(List<T> results) {
    this.results = Collections.unmodifiableList(
        Preconditions.checkNotNull(results, "results cannot be null"));
  }

  @Override
  public Iterator<T> iterator() {
    return results.iterator();
  }

  /**
   * @return an unmodifiable list of T from the index
   */
  public List<T> getResults() {
    return results;
  }

  @Override
  public String toString() {
    return String.format("GetResponse(results=%s)", Util.iterableToString(results, 0));
  }
}

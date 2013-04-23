// Copyright 2011 Google Inc. All Rights Reserved.

package com.google.appengine.api.search;

import com.google.appengine.api.search.checkers.Preconditions;

import java.io.Serializable;
import java.util.Collections;
import java.util.Iterator;
import java.util.List;

/**
 * Represents a result of putting a list of objects (documents or queries)
 * into an index. The response contains a list of {@link OperationResult}
 * indicating success or not of putting each of the objects into the index,
 * and a list of Id of the objects which are those given in the request or
 * allocated by the search service to those objects which do not have an
 * Id supplied.
 *
 */
public class PutResponse implements Iterable<OperationResult>, Serializable {
  private static final long serialVersionUID = 3063892804095727768L;

  private final List<OperationResult> results;
  private final List<String> ids;

  /**
   * Creates a {@link PutResponse} by specifying a list of
   * {@link OperationResult} and a list of document or query ids.
   *
   * @param results a list of {@link OperationResult} that indicate the
   * success or not putting each object into the index
   * @param ids a list of Id of objects that were requested to be
   * put into the index. The search service may supply Ids for those objects
   * where none was supplied
   */
  protected PutResponse(List<OperationResult> results, List<String> ids) {
    this.results = Collections.unmodifiableList(
        Preconditions.checkNotNull(results, "results cannot be null"));
    this.ids = Collections.unmodifiableList(
        Preconditions.checkNotNull(ids, "ids cannot be null"));
  }

  @Override
  public Iterator<OperationResult> iterator() {
    return results.iterator();
  }

  /**
   * @return an unmodifiable list of {@link OperationResult} indicating
   * whether each {@link Document} was put or not
   */
  public List<OperationResult> getResults() {
    return results;
  }

  /**
   * @return an unmodifiable list of Ids
   */
  public List<String> getIds() {
    return ids;
  }

  @Override
  public String toString() {
    return String.format("PutResponse(results=%s, ids=%s)",
        Util.iterableToString(getResults(), 0), Util.iterableToString(getIds(), 0));
  }
}

// Copyright 2011 Google Inc. All rights reserved.
package com.google.appengine.api.search;

/**
 * Thrown to indicate that a search service failure occurred while performing
 * a search request.
 *
 */
public class SearchException extends SearchBaseException {
  private static final long serialVersionUID = 3608247775865189592L;

  /**
   * Constructs an exception when some error occurred in
   * the search service when processing a search request.
   *
   * @param message the error detail associated with the failure
   */
  public SearchException(String message) {
    this(new OperationResult(StatusCode.INTERNAL_ERROR, message));
  }

  /**
   * Constructs an exception when some error occurred in
   * the search service when processing a search request.
   *
   * @param operationResult the error code and message detail associated with
   * the failure
   */
  public SearchException(OperationResult operationResult) {
    super(operationResult);
  }
}

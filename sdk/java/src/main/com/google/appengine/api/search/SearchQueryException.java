// Copyright 2011 Google Inc. All rights reserved.
package com.google.appengine.api.search;

/**
 * Thrown to indicate that a search query was invalid.
 *
 */
public class SearchQueryException extends SearchBaseException {
  private static final long serialVersionUID = 3608247775865189592L;

  /**
   * Constructs an exception when a search query is invalid.
   *
   * @param message the error detail associated with the invalid
   * query
   */
  public SearchQueryException(String message) {
    super(new OperationResult(StatusCode.INVALID_REQUEST, message));
  }
}

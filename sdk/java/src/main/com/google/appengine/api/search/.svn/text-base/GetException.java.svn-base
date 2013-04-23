// Copyright 2011 Google Inc. All rights reserved.
package com.google.appengine.api.search;

/**
 * Thrown to indicate that a search service failure occurred while performing
 * a request to get requested objects.
 *
 */
public class GetException extends SearchBaseException {

  /**
   * Constructs an exception when some error occurred in
   * the search service when processing a request to get objects.
   *
   * @param message the error detail associated with the failure
   */
  public GetException(String message) {
    this(new OperationResult(StatusCode.INTERNAL_ERROR, message));
  }

  /**
   * Constructs an exception when some error occurred in
   * the search service when processing a request to get objects.
   *
   * @param operationResult the error code and message detail associated with
   * the failure
   */
  public GetException(OperationResult operationResult) {
    super(operationResult);
  }
}

// Copyright 2010 Google Inc. All rights reserved.
package com.google.appengine.api.search;

/**
 * Thrown to indicate that a search service failure occurred.
 *
 */
public class SearchBaseException extends RuntimeException {
  private static final long serialVersionUID = 3608247775865189592L;

  private final OperationResult operationResult;

  /**
   * Constructs an exception when some error occurred in
   * the search service.
   *
   * @param operationResult the error code and message detail associated with
   * the failure
   */
  public SearchBaseException(OperationResult operationResult) {
    super(operationResult.getMessage());
    this.operationResult = operationResult;
  }

  /**
   * @return the error code and message detail associated with
   * the failure
   */
  public OperationResult getOperationResult() {
    return operationResult;
  }
}

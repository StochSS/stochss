// Copyright 2011 Google Inc. All rights reserved.
package com.google.appengine.api.search;

import java.util.ArrayList;
import java.util.List;

/**
 * Thrown to indicate that a search service failure occurred while deleting
 * objects.
 *
 */
public class DeleteException extends SearchBaseException {
  private static final long serialVersionUID = 4601083521504723236L;

  private final List<OperationResult> results;

  /**
   * Constructs an exception when some error occurred in
   * the search service whilst processing a delete operation.
   *
   * @param operationResult the error code and message detail associated with
   * the failure
   */
  public DeleteException(OperationResult operationResult) {
    this(operationResult, new ArrayList<OperationResult>());
  }

  /**
   * Constructs an exception when some error occurred in
   * the search service whilst processing a delete operation.
   *
   * @param operationResult the error code and message detail associated with
   * the failure
   * @param results the list of {@link OperationResult} where each result is
   * associated with the id of the object that was requested to be deleted
   */
  public DeleteException(OperationResult operationResult,
      List<OperationResult> results) {
    super(operationResult);
    this.results = results;
  }

  /**
   * @return the list of {@link OperationResult} where each result is
   * associated with the id of the object that was requested to be deleted
   */
  public List<OperationResult> getResults() {
    return results;
  }
}

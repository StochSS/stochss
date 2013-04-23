// Copyright 2012 Google Inc. All Rights Reserved.

package com.google.appengine.api.search.query;

/**
 * A parsing exception thrown when the tree resulting from
 * parsing a query is in some sense invalid.
 *
 */
public class QueryTreeException extends RuntimeException {

  private final int position;

  public QueryTreeException(String message, int position) {
    super(message);
    this.position = position;
  }

  /**
   * @return the position at which the error was detected
   */
  public int getPosition() {
    return position;
  }
}

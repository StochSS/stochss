// Copyright 2008 Google Inc. All Rights Reserved.
package com.google.appengine.api.urlfetch;

/**
 * {@code ResponseTooLargeException} is thrown when the result of a
 * {@link URLFetchService} operation is too large.
 *
 */
public class ResponseTooLargeException extends RuntimeException {

  private static final String MESSAGE_FORMAT = "The response from url %s was too large.";

  public ResponseTooLargeException(String url) {
    super(String.format(MESSAGE_FORMAT, url));
  }
}

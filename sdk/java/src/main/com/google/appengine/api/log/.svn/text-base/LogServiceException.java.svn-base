// Copyright 2011 Google Inc. All Rights Reserved.

package com.google.appengine.api.log;

/**
 * Log errors apart from InvalidRequestException.  These errors will generally
 * benefit from retrying the operation.
 *
 *
 */
public final class LogServiceException extends RuntimeException {
  private static final long serialVersionUID = 4330439878478751420L;

  /**
   * Constructs a new LogServiceException with an error message.
   * @param errorDetail Log service error detail.
   */
  LogServiceException(String errorDetail) {
    super(errorDetail);
  }
}

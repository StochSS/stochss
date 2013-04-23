// Copyright 2008 Google Inc. All Rights Reserved.

package com.google.appengine.tools.admin;

/**
 * Thrown when an unrecoverable failure occurs while communicating
 * with the remote administration console. This may happen, for example,
 * in case of a network failure. In cases of failure, it may be necessary
 * to {@link AppAdmin#rollback rollback} the prior application update
 * before attempting another.
 *
 */
public class AdminException extends RuntimeException {

  public AdminException(String message, Throwable cause) {
    super(message, cause);
  }

  public AdminException(String message) {
    super(message);
  }
}

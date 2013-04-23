// Copyright 2012 Google Inc. All Rights Reserved.
package com.google.appengine.api.log;

/**
 * Log errors caused by an invalid request due either to an out of range option
 * or an unsupported combination of options.  The exception detail will
 * typically provide more specific information about the error.
 *
 */
public class InvalidRequestException extends RuntimeException {
  public InvalidRequestException(String detail) {
    super(detail);
  }
}

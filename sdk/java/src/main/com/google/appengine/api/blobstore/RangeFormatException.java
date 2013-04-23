// Copyright 2010 Google Inc. All Rights Reserved.

package com.google.appengine.api.blobstore;

/**
 * {@code RangeFormatException} is an unchecked exception that is thrown
 * when an invalid Range header format is provided.
 *
 */
public class RangeFormatException extends RuntimeException {
  public RangeFormatException(String message) {
    super(message);
  }

  public RangeFormatException(String message, Throwable cause) {
    super(message, cause);
  }
}

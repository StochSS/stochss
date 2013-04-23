// Copyright 2012 Google Inc. All Rights Reserved.
package com.google.appengine.api.urlfetch;

import java.io.IOException;

/**
 * {@code InternalTransientException} is thrown when
 * a temporary error occurs in retrieving the URL.
 *
 */
public final class InternalTransientException extends IOException {

  private static final String MESSAGE_FORMAT =
      "A temporary internal error has occured. Please try again. URL: %s";

  public InternalTransientException(String url) {
    super(String.format(MESSAGE_FORMAT, url));
  }
}

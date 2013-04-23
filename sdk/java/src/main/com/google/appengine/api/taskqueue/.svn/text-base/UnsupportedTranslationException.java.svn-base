// Copyright 2010 Google Inc. All rights reserved.
package com.google.appengine.api.taskqueue;

import java.io.UnsupportedEncodingException;

/**
 * Attempt to convert String to an unsupported charset.
 *
 */
public class UnsupportedTranslationException extends RuntimeException {
  public UnsupportedTranslationException(String string, UnsupportedEncodingException exception) {
    super(string, exception);
  }

  public UnsupportedTranslationException(UnsupportedEncodingException exception) {
    super(exception);
  }
}

// Copyright 2010 Google Inc. All Rights Reserved.

package com.google.appengine.api.files;

import com.google.apphosting.api.ApiProxy;

import java.io.IOException;

/**
 * An {@code Exception} that indicates that a file is in the wrong finalization
 * state. This occurs if an attempt is made to write to a file that has already
 * been finalized or to read from a file that has not yet been finalized.
 *
 */
public class FinalizationException extends IOException {
  FinalizationException() {
  }

  FinalizationException(String message, ApiProxy.ApplicationException cause) {
    super(message, cause);
  }
}

// Copyright 2012 Google Inc. All Rights Reserved.

package com.google.appengine.tools.admin;

/**
 * Exception thrown when the VerificationCodeReceiver could not be stopped.
 *
 */
public class VerificationCodeReceiverStopException extends Exception {
  public VerificationCodeReceiverStopException(String message, Throwable cause) {
    super(message, cause);
  }

  public VerificationCodeReceiverStopException(String message) {
    super(message);
  }

  public VerificationCodeReceiverStopException() {
    super();
  }
}

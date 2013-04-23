// Copyright 2008 Google Inc. All Rights Reserved.

package com.google.appengine.tools.admin;

/**
 * Received by an {@link UpdateListener}.  This event indicates that an
 * operation failed.
 *
 */
public class UpdateFailureEvent {

  private String failureMessage;
  private Throwable cause;
  private final String details;

  public UpdateFailureEvent(Throwable cause, String failureMessage, String details) {
    this.failureMessage = failureMessage;
    this.cause = cause;
    this.details = details;
  }

  /**
   * Returns the failure message for the operation.
   *
   * @return a not {@code null} message.
   */
  public String getFailureMessage() {
    return failureMessage;
  }

  /**
   * Returns the cause, if any, for the operation failure.
   *
   * @return a {@link Throwable}, or {@code null}.
   */
  public Throwable getCause() {
    return cause;
  }

  /**
   * Returns the detailed output from the operation process.
   */
  public String getDetails() {
    return details;
  }
}

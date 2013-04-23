// Copyright 2008 Google Inc. All Rights Reserved.

package com.google.appengine.tools.admin;

/**
 * Received by an {@link com.google.appengine.tools.admin.UpdateListener}
 * periodically during an operation to indicate progress.
 *
 */
public class UpdateProgressEvent {

  private String message;
  private int percentageComplete;
  private Thread updateThread;

  public UpdateProgressEvent(Thread updateThread, String message, int percentageComplete) {
    this.message = message;
    this.percentageComplete = percentageComplete;
    this.updateThread = updateThread;
  }

  /**
   * Cancels the operation. A
   * {@link com.google.appengine.tools.admin.AppAdmin#rollback rollback} is
   * implicitly issued.
   */
  public void cancel() {
    updateThread.interrupt();
  }

  /**
   * Retrieves the current status message.
   *
   * @return a not {@code null} status message.
   */
  public String getMessage() {
    return message;
  }

  /**
   * Retrieves the current percentage complete.
   *
   * @return a number inclusively between 0 and 100.
   */
  public int getPercentageComplete() {
    return percentageComplete;
  }
}

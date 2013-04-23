// Copyright 2008 Google Inc. All Rights Reserved.

package com.google.appengine.tools.admin;

/**
 * A listener which receives events during a long running operation that
 * involves interaction with the server. Implement
 * this interface to be notified of progress during application update.
 */
public interface UpdateListener {

  /**
   * Called each time some progress is made during the operation. 
   * 
   * @param event a not {@code null} event.
   */
  void onProgress(UpdateProgressEvent event);
  
  /**
   * Called if the operation has completed successfully. 
   *
   * @param event a not {@code null} event.
   */
  void onSuccess(UpdateSuccessEvent event);

  /**
   * Called if the operation has failed. 
   *
   * @param event a not {@code null} event.
   */
  void onFailure(UpdateFailureEvent event);
}

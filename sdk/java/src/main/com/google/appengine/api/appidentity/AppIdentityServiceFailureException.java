// Copyright 2011 Google Inc. All Rights Reserved.
package com.google.appengine.api.appidentity;

/**
 * {@link AppIdentityServiceFailureException} is thrown when any unknown
 * error occurs while communicating with the app identity service.
 *
 */
public final class AppIdentityServiceFailureException extends RuntimeException {

  /**
   * Creates an exception with the supplied message.
   *
   * @param message A message describing the reason for the exception.
   */
  public AppIdentityServiceFailureException(String message) {
    super(message);
  }
}

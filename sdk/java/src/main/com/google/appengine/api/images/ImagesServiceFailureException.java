// Copyright 2009 Google Inc. All Rights Reserved.

package com.google.appengine.api.images;

/**
 * {@code ImagesServiceFailureException} is thrown when any unknown
 * error occurs while communicating with the images service.
 *
 */
public class ImagesServiceFailureException extends RuntimeException {

  static final long serialVersionUID = -3666552183703569527L;

  /**
   * Creates an exception with the supplied message.
   * @param message A message describing the reason for the exception.
   */
  public ImagesServiceFailureException(String message) {
    super(message);
  }

  public ImagesServiceFailureException(String message, Throwable cause) {
    super(message, cause);
  }
}

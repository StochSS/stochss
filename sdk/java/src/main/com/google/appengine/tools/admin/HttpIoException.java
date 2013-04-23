// Copyright 2011 Google Inc. All Rights Reserved.

package com.google.appengine.tools.admin;

import java.io.IOException;

/**
 * A subclass of IOException that also carries the HTTP status code that
 * generated the exception.
 *
 *
 */
public class HttpIoException extends IOException {
  /**
   * Constructs an HttpIoException (a subclass of IOException that carries
   * the HTTP status code).
   *
   * @param responseCode The HTTP response code.
   */
  public HttpIoException(int responseCode) {
    this.responseCode = responseCode;
  }

  /**
   * Constructs an HttpIoException (a subclass of IOException that carries
   * the HTTP status code).
   *
   * @param message The exception's detail message.
   * @param responseCode The HTTP response code.
   */
  public HttpIoException(String message, int responseCode) {
    super(message);
    this.responseCode = responseCode;
  }

  /**
   * Constructs an HttpIoException (a subclass of IOException that carries
   * the HTTP status code).
   *
   * @param cause The exception's cause (i.e. the wrapped exception).
   * @param responseCode The HTTP response code.
   */
  public HttpIoException(Throwable cause, int responseCode) {
    super(cause);
    this.responseCode = responseCode;
  }

  /**
   * Constructs an HttpIoException (a subclass of IOException that carries
   * the HTTP status code).
   *
   * @param message The exception's detail message.
   * @param cause The exception's cause (i.e. the wrapped exception).
   * @param responseCode The HTTP response code.
   */
  public HttpIoException(String message, Throwable cause, int responseCode) {
    super(message, cause);
    this.responseCode = responseCode;
  }

  /**
   * @returns The HTTP response code.
   */
  public int getResponseCode() {
    return responseCode;
  }

  private int responseCode;
}

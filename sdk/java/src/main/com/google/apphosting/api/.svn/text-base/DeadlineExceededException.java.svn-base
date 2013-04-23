// Copyright 2007 Google Inc. All rights reserved.

package com.google.apphosting.api;

/**
 * {@code DeadlineExceededException} is an unchecked exception thrown
 * whenever a request has exceeded the 30 second request deadline.
 *
 * <p>It will typically be thrown from API methods that did not finish
 * by the deadline.  However, this exception may also be thrown <b>at
 * any time</b>, at any arbitrary point in the execution of your
 * code.</p>
 *
 * An application may catch {@code DeadlineExceededException} to
 * perform cleanup, but it must finish execution shortly afterwards.
 * If the application delays too long, an uncatchable {@code Error} is
 * thrown to force termination of the request with extreme prejudice.
 *
 */
public class DeadlineExceededException extends RuntimeException {
  public DeadlineExceededException() {
    super();
  }

  public DeadlineExceededException(String message) {
    super(message);
  }
}

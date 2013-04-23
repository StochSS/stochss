// Copyright 2011 Google Inc. All Rights Reserved.
package com.google.appengine.api.memcache;

import java.util.logging.Level;

/**
 * Static utility for getting built-in {@link ErrorHandler}s.
 *
 */
public final class ErrorHandlers {

  private static final StrictErrorHandler STRICT = new StrictErrorHandler();
  private static final ErrorHandler DEFAULT = new LogAndContinueErrorHandler(Level.INFO);

  private ErrorHandlers() {
  }

  /**
   * Returns an instance of {@link StrictErrorHandler}.
   */
  public static StrictErrorHandler getStrict() {
    return STRICT;
  }

  /**
   * Returns an instance of {@link LogAndContinueErrorHandler}.
   * To make sure that all {@link MemcacheServiceException} exceptions
   * are handled by the {@code ErrorHandler} use
   * {@link #getConsistentLogAndContinue(Level)} instead.
   *
   * @deprecated Use {@link #getConsistentLogAndContinue(Level)} instead
   */
  @Deprecated
  public static LogAndContinueErrorHandler getLogAndContinue(Level logLevel) {
    return new LogAndContinueErrorHandler(logLevel);
  }

  /**
   * Returns an instance of {@link LogAndContinueErrorHandler} that handles all
   * {@link MemcacheServiceException} exceptions.
   */
  public static LogAndContinueErrorHandler getConsistentLogAndContinue(Level logLevel) {

    return new ConsistentLogAndContinueErrorHandler(logLevel);
  }

  /**
   * Returns the default error handler.
   */
  public static ErrorHandler getDefault() {
    return DEFAULT;
  }
}

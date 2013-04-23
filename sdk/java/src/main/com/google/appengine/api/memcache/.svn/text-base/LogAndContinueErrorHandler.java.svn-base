// Copyright 2008 Google Inc. All Rights Reserved.
package com.google.appengine.api.memcache;

import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * The default error handler, which will cause most service errors to behave
 * as though there were a cache miss, not an error.
 *
 * @deprecated Use {@link ConsistentLogAndContinueErrorHandler} instead
 */
@Deprecated
public class LogAndContinueErrorHandler implements ErrorHandler {

  private static final Logger logger =
      Logger.getLogger(LogAndContinueErrorHandler.class.getName());

  private final Level level;

  /**
   * Constructor for a given logging level.
   *
   * @param level the level at which back-end errors should be logged.
   */
  public LogAndContinueErrorHandler(Level level) {
    this.level = level;
  }

  /**
   * Logs the {@code thrown} error condition, but does not expose it to
   * application code.
   *
   * @param thrown the classpath error exception
   */
  @Override
  public void handleDeserializationError(InvalidValueException thrown) {
    getLogger().log(level, "Deserialization error in memcache", thrown);
  }

  /**
   * Logs the {@code thrown} error condition, but does not expose it to
   * application code.
   *
   * @param thrown the service error exception
   */
  @Override
  public void handleServiceError(MemcacheServiceException thrown) {
    getLogger().log(level, "Service error in memcache", thrown);
  }

  Logger getLogger() {
    return logger;
  }
}

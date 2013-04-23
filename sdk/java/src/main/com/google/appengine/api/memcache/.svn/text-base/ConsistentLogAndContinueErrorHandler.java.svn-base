// Copyright 2012 Google Inc. All Rights Reserved.

package com.google.appengine.api.memcache;

import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * Similar to the deprecated {@link LogAndContinueErrorHandler} but consistently
 * handles all back-end related errors.
 *
 */
@SuppressWarnings("deprecation")
public class ConsistentLogAndContinueErrorHandler extends LogAndContinueErrorHandler
    implements ConsistentErrorHandler {

  private static final Logger logger =
      Logger.getLogger(ConsistentLogAndContinueErrorHandler.class.getName());

  public ConsistentLogAndContinueErrorHandler(Level level) {
    super(level);
  }

  @Override
  Logger getLogger() {
    return logger;
  }
}

// Copyright 2011 Google Inc. All Rights Reserved.

package com.google.appengine.api.log;

import com.google.appengine.spi.ServiceFactoryFactory;

/**
 * Creates {@link LogService} implementations.
 *
 */
public final class LogServiceFactory {

  /**
   * Creates a {@code LogService}.
   */
  public static LogService getLogService() {
    return getFactory().getLogService();
  }

  private static ILogServiceFactory getFactory() {
    return ServiceFactoryFactory.getFactory(ILogServiceFactory.class);
  }
}

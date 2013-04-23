// Copyright 2011 Google Inc. All rights reserved.

package com.google.appengine.api.backends;

import com.google.appengine.spi.ServiceFactoryFactory;

/**
 * Factory for getting the Backends API implementation for the current
 * environment.
 *
 */
public class BackendServiceFactory {

  private BackendServiceFactory() {
  }

  /**
   * Gets a handle to the backends API for the current running environment.
   *
   * @return An implementation of the backends API.
   */
  public static BackendService getBackendService() {
    return getFactory().getBackendService();
  }

  private static IBackendServiceFactory getFactory() {
    return ServiceFactoryFactory.getFactory(IBackendServiceFactory.class);
  }
}

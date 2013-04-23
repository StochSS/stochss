// Copyright 2012 Google Inc. All rights reserved.
package com.google.appengine.api.capabilities;

import com.google.appengine.spi.ServiceFactoryFactory;

/**
 * Factory for creating a {@link CapabilitiesService}.
 *
 */
public class CapabilitiesServiceFactory {

  /**
   * Creates an implementation of the {@link CapabilitiesService}.
   *
   * @return an instance of the capabilities service.
   */
  public static CapabilitiesService getCapabilitiesService() {
    return getFactory().getCapabilitiesService();
  }

  private static ICapabilitiesServiceFactory getFactory() {
    return ServiceFactoryFactory.getFactory(ICapabilitiesServiceFactory.class);
  }
}

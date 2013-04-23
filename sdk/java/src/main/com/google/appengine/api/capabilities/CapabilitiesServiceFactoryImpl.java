// Copyright 2012 Google Inc. All rights reserved.
package com.google.appengine.api.capabilities;

/**
 * Factory for creating a {@link CapabilitiesService}.
 *
 */
final class CapabilitiesServiceFactoryImpl implements ICapabilitiesServiceFactory {

  @Override
  public CapabilitiesService getCapabilitiesService() {
    return new CapabilitiesServiceImpl();
  }

}

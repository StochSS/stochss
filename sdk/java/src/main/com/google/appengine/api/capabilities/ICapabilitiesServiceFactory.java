// Copyright 2012 Google Inc. All rights reserved.
package com.google.appengine.api.capabilities;

/**
 * Factory for creating a {@link CapabilitiesService}.
 *
 */
public interface ICapabilitiesServiceFactory {

  /**
   * Creates an implementation of the {@link CapabilitiesService}.
   *
   * @return an instance of the capabilities service.
   */
   CapabilitiesService getCapabilitiesService();

}

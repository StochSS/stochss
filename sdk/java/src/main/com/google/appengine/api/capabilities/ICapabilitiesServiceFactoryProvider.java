// Copyright 2012 Google Inc. All rights reserved.
package com.google.appengine.api.capabilities;

import com.google.appengine.spi.FactoryProvider;
import com.google.appengine.spi.ServiceProvider;

/**
 * Factory provider for {@link ICapabilitiesServiceFactory}.
 *
 * <p><b>Note:</b> This class is not intended for end users.
 *
 */
@ServiceProvider(value = FactoryProvider.class, precedence = Integer.MIN_VALUE)
public final class ICapabilitiesServiceFactoryProvider
    extends FactoryProvider<ICapabilitiesServiceFactory> {

  private final CapabilitiesServiceFactoryImpl implementation
      = new CapabilitiesServiceFactoryImpl();

  public ICapabilitiesServiceFactoryProvider() {
    super(ICapabilitiesServiceFactory.class);
  }

  @Override
  protected ICapabilitiesServiceFactory getFactoryInstance() {
    return implementation;
  }

}

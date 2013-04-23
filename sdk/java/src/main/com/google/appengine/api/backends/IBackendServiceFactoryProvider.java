// Copyright 2012 Google Inc. All rights reserved.
package com.google.appengine.api.backends;

import com.google.appengine.spi.FactoryProvider;
import com.google.appengine.spi.ServiceProvider;

/**
 * Factory provider for {@link IBackendServiceFactory}.
 *
 * <p><b>Note:</b> This class is not intended for end users.
 *
 */
@ServiceProvider(value = FactoryProvider.class, precedence = Integer.MIN_VALUE)
public final class IBackendServiceFactoryProvider extends FactoryProvider<IBackendServiceFactory> {

  private final BackendServiceFactoryImpl implementation = new BackendServiceFactoryImpl();

  public IBackendServiceFactoryProvider() {
    super(IBackendServiceFactory.class);
  }

  @Override
  protected IBackendServiceFactory getFactoryInstance() {
    return implementation;
  }

}

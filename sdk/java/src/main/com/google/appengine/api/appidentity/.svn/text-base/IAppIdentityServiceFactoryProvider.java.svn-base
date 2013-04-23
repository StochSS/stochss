// Copyright 2012 Google Inc. All rights reserved.
package com.google.appengine.api.appidentity;

import com.google.appengine.spi.FactoryProvider;
import com.google.appengine.spi.ServiceProvider;

/**
 * Factory provider for {@link IAppIdentityServiceFactory}.
 *
 * <p><b>Note:</b> This class is not intended for end users.
 *
 */
@ServiceProvider(value = FactoryProvider.class, precedence = Integer.MIN_VALUE)
public final class IAppIdentityServiceFactoryProvider
    extends FactoryProvider<IAppIdentityServiceFactory> {

  private final AppIdentityServiceFactoryImpl implementation = new AppIdentityServiceFactoryImpl();

  public IAppIdentityServiceFactoryProvider() {
    super(IAppIdentityServiceFactory.class);
  }

  @Override
  protected IAppIdentityServiceFactory getFactoryInstance() {
    return implementation;
  }

}

// Copyright 2012 Google Inc. All rights reserved.

package com.google.appengine.api.users;

import com.google.appengine.spi.FactoryProvider;
import com.google.appengine.spi.ServiceProvider;

/**
 * Creates {@code IUserServiceFactory} implementations.
 *
 * <p><b>Note:</b> This class is not intended for end users.
 *
 */
@ServiceProvider(value = FactoryProvider.class, precedence = Integer.MIN_VALUE)
public final class IUserServiceFactoryProvider extends FactoryProvider<IUserServiceFactory> {

  private UserServiceFactoryImpl implementation = new UserServiceFactoryImpl();

  public IUserServiceFactoryProvider() {
    super(IUserServiceFactory.class);
  }

  @Override
  protected IUserServiceFactory getFactoryInstance() {
    return implementation;
  }

}

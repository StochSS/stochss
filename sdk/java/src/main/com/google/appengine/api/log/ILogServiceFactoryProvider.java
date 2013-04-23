// Copyright 2012 Google Inc. All rights reserved.
package com.google.appengine.api.log;

import com.google.appengine.spi.FactoryProvider;
import com.google.appengine.spi.ServiceProvider;

/**
 * Factory provider for {@link ILogServiceFactory}.
 *
 * <p><b>Note:</b> This class is not intended for end users.
 *
 */
@ServiceProvider(value = FactoryProvider.class, precedence = Integer.MIN_VALUE)
public final class ILogServiceFactoryProvider extends FactoryProvider<ILogServiceFactory> {

  private final LogServiceFactoryImpl implementation = new LogServiceFactoryImpl();

  public ILogServiceFactoryProvider() {
    super(ILogServiceFactory.class);
  }

  @Override
  protected ILogServiceFactory getFactoryInstance() {
    return implementation;
  }

}

// Copyright 2012 Google Inc. All rights reserved.
package com.google.appengine.api.oauth;

import com.google.appengine.spi.FactoryProvider;
import com.google.appengine.spi.ServiceProvider;

/**
 * Factory provider for {@link IOAuthServiceFactory}.
 *
 * <p><b>Note:</b> This class is not intended for end users.
 *
 */
@ServiceProvider(value = FactoryProvider.class, precedence = Integer.MIN_VALUE)
public final class IOAuthServiceFactoryProvider extends FactoryProvider<IOAuthServiceFactory> {

  private final OAuthServiceFactoryImpl implementation = new OAuthServiceFactoryImpl();

  public IOAuthServiceFactoryProvider() {
    super(IOAuthServiceFactory.class);
  }

  @Override
  protected IOAuthServiceFactory getFactoryInstance() {
    return implementation;
  }

}

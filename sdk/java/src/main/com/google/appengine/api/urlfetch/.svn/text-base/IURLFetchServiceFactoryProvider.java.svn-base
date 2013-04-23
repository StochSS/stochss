// Copyright 2012 Google Inc. All rights reserved.
package com.google.appengine.api.urlfetch;

import com.google.appengine.spi.FactoryProvider;
import com.google.appengine.spi.ServiceProvider;

/**
 * Factory provider for {@link IURLFetchServiceFactory}.
 *
 * <p><b>Note:</b> This class is not intended for end users.
 *
 */
@ServiceProvider(value = FactoryProvider.class, precedence = Integer.MIN_VALUE)
public final class IURLFetchServiceFactoryProvider
    extends FactoryProvider<IURLFetchServiceFactory> {

  private final URLFetchServiceFactoryImpl implementation = new URLFetchServiceFactoryImpl();

  public IURLFetchServiceFactoryProvider() {
    super(IURLFetchServiceFactory.class);
  }

  @Override
  protected IURLFetchServiceFactory getFactoryInstance() {
    return implementation;
  }

}

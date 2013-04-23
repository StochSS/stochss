// Copyright 2012 Google Inc. All rights reserved.
package com.google.appengine.api.search;

import com.google.appengine.spi.FactoryProvider;
import com.google.appengine.spi.ServiceProvider;

/**
 * Factory provider for {@link ISearchServiceFactory}.
 *
 * <p><b>Note:</b> This class is not intended for end users.
 *
 */
@ServiceProvider(value = FactoryProvider.class, precedence = Integer.MIN_VALUE)
public final class ISearchServiceFactoryProvider extends FactoryProvider<ISearchServiceFactory> {

  private final SearchServiceFactoryImpl implementation = new SearchServiceFactoryImpl();

  public ISearchServiceFactoryProvider() {
    super(ISearchServiceFactory.class);
  }

  @Override
  protected ISearchServiceFactory getFactoryInstance() {
    return implementation;
  }

}

// Copyright 2012 Google Inc. All rights reserved.
package com.google.appengine.api.quota;

import com.google.appengine.spi.FactoryProvider;
import com.google.appengine.spi.ServiceProvider;

/**
 * Factory provider for {@link IQuotaServiceFactory}.
 *
 * <p><b>Note:</b> This class is not intended for end users.
 *
 */
@ServiceProvider(value = FactoryProvider.class, precedence = Integer.MIN_VALUE)
public final class IQuotaServiceFactoryProvider extends FactoryProvider<IQuotaServiceFactory> {

  private final QuotaServiceFactoryImpl implementation = new QuotaServiceFactoryImpl();

  public IQuotaServiceFactoryProvider() {
    super(IQuotaServiceFactory.class);
  }

  @Override
  protected IQuotaServiceFactory getFactoryInstance() {
    return implementation;
  }

}

// Copyright 2012 Google Inc. All rights reserved.
package com.google.appengine.api.memcache;

import com.google.appengine.spi.FactoryProvider;
import com.google.appengine.spi.ServiceProvider;

/**
 * Factory provider for {@link IMemcacheServiceFactory}.
 *
 * <p><b>Note:</b> This class is not intended for end users.
 *
 */
@ServiceProvider(value = FactoryProvider.class, precedence = Integer.MIN_VALUE)
public final class IMemcacheServiceFactoryProvider
    extends FactoryProvider<IMemcacheServiceFactory> {

  private final MemcacheServiceFactoryImpl implementation = new MemcacheServiceFactoryImpl();

  public IMemcacheServiceFactoryProvider() {
    super(IMemcacheServiceFactory.class);
  }

  @Override
  protected IMemcacheServiceFactory getFactoryInstance() {
    return implementation;
  }

}

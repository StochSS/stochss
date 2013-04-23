// Copyright 2012 Google Inc. All rights reserved.
package com.google.appengine.api.channel;

import com.google.appengine.spi.FactoryProvider;
import com.google.appengine.spi.ServiceProvider;

/**
 * Factory provider for {@link IChannelServiceFactory}.
 *
 * <p><b>Note:</b> This class is not intended for end users.
 *
 */
@ServiceProvider(value = FactoryProvider.class, precedence = Integer.MIN_VALUE)
public final class IChannelServiceFactoryProvider extends FactoryProvider<IChannelServiceFactory> {

  private final ChannelServiceFactoryImpl implementation = new ChannelServiceFactoryImpl();

  public IChannelServiceFactoryProvider() {
    super(IChannelServiceFactory.class);
  }

  @Override
  protected IChannelServiceFactory getFactoryInstance() {
    return implementation;
  }

}

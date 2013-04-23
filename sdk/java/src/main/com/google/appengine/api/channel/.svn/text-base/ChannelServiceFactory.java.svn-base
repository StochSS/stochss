// Copyright 2010 Google Inc. All rights reserved.

package com.google.appengine.api.channel;

import com.google.appengine.spi.ServiceFactoryFactory;

/**
 * Constructs and instance of the Channel service.
 *
 */
public final class ChannelServiceFactory {

  /**
   * Creates an implementation of the ChannelService.
   */
  public static ChannelService getChannelService() {
    return getFactory().getChannelService();
  }

  private static IChannelServiceFactory getFactory() {
    return ServiceFactoryFactory.getFactory(IChannelServiceFactory.class);
  }
}

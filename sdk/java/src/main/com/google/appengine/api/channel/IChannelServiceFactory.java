// Copyright 2012 Google Inc. All rights reserved.

package com.google.appengine.api.channel;

/**
 * Constructs and instance of the Channel service.
 *
 */
public interface IChannelServiceFactory {

  /**
   * Creates an implementation of the ChannelService.
   */
   ChannelService getChannelService();

}

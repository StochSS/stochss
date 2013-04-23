// Copyright 2010 Google Inc. All rights reserved.

package com.google.appengine.api.channel;

/**
 * Class that represents a channel message.  {@code ChannelMessages} can be
 * sent as outgoing messages or can be parsed as incoming messages by
 * {@link ChannelService#parseMessage}.
 *
 */
public final class ChannelMessage {

  private final String clientId;
  private final String message;

  /**
   * Constructor for a channel message.
   *
   * @param clientId identifies the client that will receive this message. The
   *     client should be connected to the channel using a token created by
   *     ChannelService.CreateChannel, using the same client id. The client id
   *     must be fewer than 64 bytes when encoded to UTF-8.
   * @param message the message payload. The payload must be smaller than 32K
   *     when encoded to UTF-8.
   */
  public ChannelMessage(String clientId, String message) {
    this.clientId = clientId;
    this.message = message;
  }

  public String getClientId() {
    return clientId;
  }

  public String getMessage() {
    return message;
  }

}

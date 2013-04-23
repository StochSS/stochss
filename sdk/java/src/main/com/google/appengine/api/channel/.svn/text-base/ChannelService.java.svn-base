// Copyright 2010 Google Inc. All rights reserved.

package com.google.appengine.api.channel;

import java.io.IOException;

import javax.servlet.http.HttpServletRequest;

/**
 * {@code ChannelService} allows you to manage manage two-way connections
 * with clients.
 *
 */
public interface ChannelService {

  /**
   * Creates a channel associated with the provided {@code clientId} and returns
   * a token that is valid for the default amount of time (2 hours)
   *
   * @param clientId A string uniquely identifying the client that will use the
   *     returned token to connect to this channel. This string must be fewer
   *     than 64 bytes when encoded to UTF-8.
   *
   * @return the token the client will use to connect to this channel.
   *
   * @throws ChannelFailureException if there is an error encountered while
   * communicating with the channel service.
   */
  String createChannel(String clientId);

  /**
   * Creates a channel associated with the provided {@code clientId} and returns
   * a token that is valid for the specified period of time.
   *
   * @param clientId A string uniquely identifying the client that will use the
   *     returned token to connect to this channel. This string must be fewer
   *     than 64 bytes when encoded to UTF-8.
   * @param durationMinutes the amount of time for which the returned token will
   *     be valid, in minutes. Must be greater than zero and less than 24 * 60.
   *
   * @return the token the client will use to connect to this channel.
   *
   * @throws ChannelFailureException if there is an error encountered while
   * communicating with the channel service.
   */
  String createChannel(String clientId, int durationMinutes);

  /**
   * Sends a {@link ChannelMessage} to the client.
   *
   * @param message the message to be sent to all connected clients.
   *
   * @throws ChannelFailureException if there is an error encountered while
   * communicating with the channel service.
   */
  void sendMessage(ChannelMessage message);

  /**
   * Parse the incoming message in {@code request}.  This method should only
   * be called within a channel webhook.
   *
   * @param request the source HTTP request.
   * @return the incoming {@link ChannelMessage}.
   *
   * @throws IllegalStateException if the required HTTP parameters are not
   * present.
   */
  ChannelMessage parseMessage(HttpServletRequest request);

  /**
   * Parse the incoming presence in {@code request}. This method should only
   * be called within a channel presence request handler.
   *
   * @param request the source HTTP request.
   * @return the incoming {@link ChannelPresence}.
   *
   * @throws IOException if the MIME body isn't parseable.
   * @throws IllegalArgumentException if the HTTP request doesn't conform to
   * expectations.
   */
  ChannelPresence parsePresence(HttpServletRequest request) throws IOException;
}

// Copyright 2010 Google Inc. All rights reserved.

package com.google.appengine.api.channel;

import com.google.appengine.api.channel.ChannelServicePb.ChannelServiceError.ErrorCode;
import com.google.appengine.api.channel.ChannelServicePb.CreateChannelRequest;
import com.google.appengine.api.channel.ChannelServicePb.CreateChannelResponse;
import com.google.appengine.api.channel.ChannelServicePb.SendMessageRequest;
import com.google.apphosting.api.ApiProxy;

import java.io.IOException;

import javax.servlet.http.HttpServletRequest;

/**
 * An implementation of the {@link ChannelService}.
 *
 */
class ChannelServiceImpl implements ChannelService {

  public static final String PACKAGE = "channel";
  public static final String CLIENT_ID_PARAM = "key";
  public static final String MESSAGE_PARAM = "msg";

  public static final int MAXIMUM_CLIENT_ID_CHARS = 256;
  public static final int MAXIMUM_MESSAGE_CHARS = 32767;
  public static final int MAXIMUM_TOKEN_DURATION_MINUTES = 24 * 60;

  @Override
  public String createChannel(String clientId) {
    return createChannelImpl(clientId, null);
  }

  @Override
  public String createChannel(String clientId, int durationMinutes) {
    return createChannelImpl(clientId, durationMinutes);
  }

  private String createChannelImpl(String clientId, Integer durationMinutes) {
    CreateChannelRequest request = new CreateChannelRequest()
        .setApplicationKey(clientId);

    if (durationMinutes != null) {
      if (durationMinutes <= 0 || durationMinutes > MAXIMUM_TOKEN_DURATION_MINUTES) {
        throw getExceptionForPrecondition(ErrorCode.INVALID_CHANNEL_TOKEN_DURATION);
      }
      request.setDurationMinutes(durationMinutes);
    }

    if (request.getApplicationKeyAsBytes().length > MAXIMUM_CLIENT_ID_CHARS) {
      throw getExceptionForPrecondition(ErrorCode.INVALID_CHANNEL_KEY);
    }

    byte[] responseBytes;
    try {
      responseBytes = ApiProxy.makeSyncCall(PACKAGE, "CreateChannel", request.toByteArray());
    } catch (ApiProxy.ApplicationException e) {
      throw getExceptionForError(ErrorCode.valueOf(e.getApplicationError()), e);
    }

    CreateChannelResponse response = new CreateChannelResponse();
    response.mergeFrom(responseBytes);
    return response.getToken();
  }

  @Override
  public void sendMessage(ChannelMessage message) {
    SendMessageRequest request = new SendMessageRequest()
        .setApplicationKey(message.getClientId())
        .setMessage(message.getMessage());

    if (request.getApplicationKeyAsBytes().length > MAXIMUM_CLIENT_ID_CHARS) {
      throw getExceptionForPrecondition(ErrorCode.INVALID_CHANNEL_KEY);
    }

    if (request.getMessageAsBytes().length > MAXIMUM_MESSAGE_CHARS) {
      throw getExceptionForPrecondition(ErrorCode.BAD_MESSAGE);
    }

    byte[] responseBytes;
    try {
      responseBytes = ApiProxy.makeSyncCall(PACKAGE, "SendChannelMessage", request.toByteArray());
    } catch (ApiProxy.ApplicationException e) {
      throw getExceptionForError(ErrorCode.valueOf(e.getApplicationError()), e);
    }
  }

  @Override
  public ChannelMessage parseMessage(HttpServletRequest request) {
    String clientId = request.getParameter(CLIENT_ID_PARAM);
    String message = request.getParameter(MESSAGE_PARAM);

    if (clientId == null) {
      throw new IllegalStateException("Client id parameter not found in HTTP request.");
    }

    if (message == null) {
      throw new IllegalStateException("Message parameter not found in HTTP request.");
    }

    return new ChannelMessage(clientId, message);
  }

  @Override
  public ChannelPresence parsePresence(HttpServletRequest request) throws IOException {
    return ChannelPresenceParser.parsePresence(request);
  }

  private RuntimeException getExceptionForPrecondition(ErrorCode errorCode) {
    String description;
    switch (errorCode) {
      case INVALID_CHANNEL_KEY:
        description =
            "Invalid client ID. The clientid must be fewer than 256 bytes when encoded to UTF-8.";
        break;
      case BAD_MESSAGE:
        description = "The message must be fewer than 32767 bytes when encoded to UTF-8.";
        break;
      case INVALID_CHANNEL_TOKEN_DURATION:
        description = "The channel token duration must be greater than 0 and less than 24 * 60.";
        break;
      default:
        description = "An unexpected error occurred.";
        break;
    }

    return new IllegalArgumentException(description);
  }

  private RuntimeException getExceptionForError(ErrorCode errorCode, Exception e) {
    String description;
    switch (errorCode) {
      case INTERNAL_ERROR:
        return new ChannelFailureException("An internal channel error occured.");
      case APPID_ALIAS_REQUIRED:
        return new ChannelFailureException("You must create an application alias (on the" +
            "'Application Settings' page in the Administrator Console) to use the Channel API.");
      default:
        return new ChannelFailureException("An unexpected error occurred.", e);
    }
  }
}

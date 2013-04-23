// Copyright 2008 Google Inc. All Rights Reserved.

package com.google.appengine.api.xmpp;

import com.google.appengine.api.xmpp.XMPPServicePb.BulkPresenceRequest;
import com.google.appengine.api.xmpp.XMPPServicePb.BulkPresenceResponse;
import com.google.appengine.api.xmpp.XMPPServicePb.PresenceRequest;
import com.google.appengine.api.xmpp.XMPPServicePb.PresenceResponse;
import com.google.appengine.api.xmpp.XMPPServicePb.XmppInviteRequest;
import com.google.appengine.api.xmpp.XMPPServicePb.XmppInviteResponse;
import com.google.appengine.api.xmpp.XMPPServicePb.XmppMessageRequest;
import com.google.appengine.api.xmpp.XMPPServicePb.XmppMessageResponse;
import com.google.appengine.api.xmpp.XMPPServicePb.XmppMessageResponse.XmppMessageStatus;
import com.google.appengine.api.xmpp.XMPPServicePb.XmppSendPresenceRequest;
import com.google.appengine.api.xmpp.XMPPServicePb.XmppSendPresenceResponse;
import com.google.appengine.api.xmpp.XMPPServicePb.XmppServiceError;
import com.google.apphosting.api.ApiProxy;
import com.google.common.collect.ImmutableList;

import java.io.IOException;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

/**
 * Implementation for access to XMPP service.
 *
 * @author kushal@google.com (Kushal Dave)
 */
class XMPPServiceImpl implements XMPPService {
  static final String PACKAGE = "xmpp";

  static final int MAX_STATUS_MESSAGE_SIZE = 1024;

  @Override
  public Presence getPresence(JID jabberId) {
    return getPresence(jabberId, null);
  }

  @Override
  public Presence getPresence(JID jabberId, JID fromJid) {
    checkArgument(jabberId != null, "Jabber ID cannot be null");

    PresenceRequest request = new PresenceRequest();
    request.setJid(jabberId.getId());
    if (fromJid != null) {
      request.setFromJid(fromJid.getId());
    }

    byte[] responseBytes;
    try {
      responseBytes = ApiProxy.makeSyncCall(PACKAGE, "GetPresence", request.toByteArray());
    } catch (ApiProxy.ApplicationException ex) {
      switch (XmppServiceError.ErrorCode.valueOf(ex.getApplicationError())) {
        case INVALID_JID:
          throw new IllegalArgumentException("Invalid jabber ID: " + jabberId);
        case NO_BODY:
        case UNSPECIFIED_ERROR:
        default:
          throw new XMPPFailureException(
              "Unknown error retrieving presence for jabber ID: " + jabberId);
      }
    }

    PresenceResponse response = new PresenceResponse();
    response.mergeFrom(responseBytes);

    return presenceFromPresenceResponse(jabberId, fromJid, response,
          true);
  }

  @Override
  public List<Presence> getPresence(Iterable<JID> jabberIds) {
    return getPresence(jabberIds, null);
  }

  @Override
  public List<Presence> getPresence(Iterable<JID> jabberIds, JID fromJid) {
    checkArgument(jabberIds != null, "Jabber ID list cannot be null");

    BulkPresenceRequest request = new BulkPresenceRequest();
    for (JID jabberId : jabberIds) {
      request.addJid(jabberId.getId());
    }

    checkArgument(request.jids().size() != 0, "Jabber ID list cannot be empty");

    if (fromJid != null) {
      request.setFromJid(fromJid.getId());
    }

    byte[] responseBytes;
    try {
      responseBytes = ApiProxy.makeSyncCall(PACKAGE, "BulkGetPresence", request.toByteArray());
    } catch (ApiProxy.ApplicationException ex) {
      switch (XmppServiceError.ErrorCode.valueOf(ex.getApplicationError())) {
        case INVALID_JID:
          throw new IllegalArgumentException(
              "One or more jabber ID is invalid: " + jabberIds.toString());
        case NO_BODY:
        case UNSPECIFIED_ERROR:
        default:
          throw new XMPPFailureException(
              String.format("Unknown error [code %d] retrieving presence for jabber IDs: %s",
                  ex.getApplicationError(), jabberIds));
      }
    }

    BulkPresenceResponse response = new BulkPresenceResponse();
    response.mergeFrom(responseBytes);
    ImmutableList.Builder<Presence> retVal = new ImmutableList.Builder<Presence>();
    for (int i = 0; i < response.presenceResponseSize(); i++) {
      PresenceResponse presenceResponse = response.getPresenceResponse(i);
      retVal.add(presenceFromPresenceResponse(new JID(request.getJid(i)), fromJid, presenceResponse,
         presenceResponse.isValid()));
    }

    return retVal.build();
  }

  @Override
  public void sendPresence(JID jabberId, PresenceType type, PresenceShow show, String status) {
    sendPresence(jabberId, type, show, status, null);
  }

  @Override
  public void sendPresence(JID jabberId, PresenceType type, PresenceShow show, String status,
                           JID fromJid) {

    checkArgument(jabberId != null, "Jabber ID cannot be null");
    checkArgument(status == null || status.length() <= MAX_STATUS_MESSAGE_SIZE,
                  "Status message is too long");

    XmppSendPresenceRequest request = new XmppSendPresenceRequest();
    request.setJid(jabberId.getId());

    if (type != null) {
      switch (type) {
        case AVAILABLE:
          break;

        default:
          request.setType(type.toString().toLowerCase());
          break;
      }
    }

    if (show != null) {
      switch (show) {
        case NONE:
          break;

        default:
          request.setShow(show.toString().toLowerCase());
          break;
      }
    }

    if (status != null) {
      request.setStatus(status);
    }

    if (fromJid != null) {
      request.setFromJid(fromJid.getId());
    }

    byte[] responseBytes;
    try {
      responseBytes = ApiProxy.makeSyncCall(PACKAGE, "SendPresence", request.toByteArray());
    } catch (ApiProxy.ApplicationException ex) {
      switch (XmppServiceError.ErrorCode.valueOf(ex.getApplicationError())) {
        case INVALID_JID:
          throw new IllegalArgumentException("Invalid jabber ID: " + jabberId);
        case INVALID_SHOW:
          throw new IllegalArgumentException("Invalid show: " + show);
        case INVALID_TYPE:
          throw new IllegalArgumentException("Invalid type: " + type);
        case UNSPECIFIED_ERROR:
        default:
          throw new XMPPFailureException(
              "Unknown error sending presence to jabber ID: " + jabberId);
      }
    }

    XmppSendPresenceResponse response = new XmppSendPresenceResponse();
    response.mergeFrom(responseBytes);
    return;
  }

  @Override
  public void sendInvitation(JID jabberId) {
    sendInvitation(jabberId, null);
  }

  @Override
  public void sendInvitation(JID jabberId, JID fromJid) {
    checkArgument(jabberId != null, "Jabber ID cannot be null");
    XmppInviteRequest request = new XmppInviteRequest();
    request.setJid(jabberId.getId());
    if (fromJid != null) {
      request.setFromJid(fromJid.getId());
    }

    byte[] responseBytes;
    try {
      responseBytes = ApiProxy.makeSyncCall(PACKAGE, "SendInvite", request.toByteArray());
    } catch (ApiProxy.ApplicationException ex) {
      switch (XmppServiceError.ErrorCode.valueOf(ex.getApplicationError())) {
        case INVALID_JID:
          throw new IllegalArgumentException("Invalid jabber ID: " + jabberId);
        case UNSPECIFIED_ERROR:
        default:
          throw new XMPPFailureException(
              "Unknown error sending invitation to jabber ID: " + jabberId);
      }
    }

    XmppInviteResponse response = new XmppInviteResponse();
    response.mergeFrom(responseBytes);
    return;
  }

  /**
   * Sends an outgoing XMPP message.
   */
  public SendResponse sendMessage(Message message) {
    checkArgument(message != null, "Message cannot be null");
    checkArgument(message.getBody() != null && !message.getBody().equals(""),
        "Body cannot be null or empty");
    checkArgument(message.getRecipientJids() != null && message.getRecipientJids().length > 0,
        "Must provide at least one recipient");

    XmppMessageRequest request = createMessageRequest(message);
    XmppMessageResponse response = doMessageRpc(request);
    return translateMessageResponse(response, message.getRecipientJids());
  }

  public Message parseMessage(HttpServletRequest request) throws IOException {
    return InboundMessageParser.parseMessage(request);
  }

  public Presence parsePresence(HttpServletRequest request) throws IOException {
    return InboundPresenceParser.parsePresence(request);
  }

  public Subscription parseSubscription(HttpServletRequest request) throws IOException {
    return InboundSubscriptionParser.parseSubscription(request);
  }

  /**
   * @param jabberId The JID that was given by the user
   * @param fromJid The JID that the presence request is "from".
   * @param response The response from the XMPP service.
   * @param valid Whether jabberId was valid, as determined by the XMPP service.
   * @return A {@link Presence} object, made from response.
   */
  private Presence presenceFromPresenceResponse(
      JID jabberId, JID fromJid, PresenceResponse response, boolean valid) {
    PresenceBuilder builder = new PresenceBuilder().
        withToJid(jabberId).
        withFromJid(fromJid).
        withValid(valid).
        withPresenceType(
            response.isIsAvailable() ? PresenceType.AVAILABLE : PresenceType.UNAVAILABLE);

    if (response.hasPresence()) {
      PresenceResponse.SHOW responseShow = PresenceResponse.SHOW.valueOf(response.getPresence());
      builder.withPresenceShow(PresenceShow.fromPresenceResponseEnum(responseShow));
    }

    return builder.build();
  }

  /**
   * Given a set of parameters, create a request to send to the backend.
   */
  private XmppMessageRequest createMessageRequest(Message message) {
    XmppMessageRequest request = new XmppMessageRequest();
    for (JID jabberId : message.getRecipientJids()) {
      request.addJid(jabberId.getId());
    }
    request.setBody(message.getBody());
    request.setRawXml(message.isXml());
    request.setType(message.getMessageType().getInternalName());
    if (message.getFromJid() != null) {
      request.setFromJid(message.getFromJid().getId());
    }
    return request;
  }

  /**
   * Given a raw response from the backend, translate into an API response object.
   */
  private SendResponse translateMessageResponse(XmppMessageResponse response,
      JID... jabberIds) {
    SendResponse retVal = new SendResponse();
    for (int i = 0; i < jabberIds.length; i++) {
      switch (XmppMessageStatus.valueOf(response.getStatus(i))) {
        case INVALID_JID:
          retVal.addStatus(jabberIds[i], SendResponse.Status.INVALID_ID);
          break;
        case NO_ERROR:
          retVal.addStatus(jabberIds[i], SendResponse.Status.SUCCESS);
          break;
        case OTHER_ERROR:
          retVal.addStatus(jabberIds[i], SendResponse.Status.OTHER_ERROR);
          break;
      }
    }
    return retVal;
  }

  /**
   * Use the ApiProxy to send the XmppMessageRequest and parse the response.
   * Throw exceptions in case of service-level errors.
   */
  private XmppMessageResponse doMessageRpc(XmppMessageRequest request) {
    byte[] responseBytes;
    try {
      responseBytes = ApiProxy.makeSyncCall(PACKAGE, "SendMessage", request.toByteArray());
    } catch (ApiProxy.ApplicationException ex) {
      switch (XmppServiceError.ErrorCode.valueOf(ex.getApplicationError())) {
        case INVALID_JID:
          throw new IllegalArgumentException("Invalid jabber ID");
        case NO_BODY:
          throw new IllegalArgumentException("Missing message body");
        case INVALID_XML:
          throw new IllegalArgumentException("XML was invalid");
        case INVALID_TYPE:
          throw new IllegalArgumentException("Type attribute is invalid");
        case UNSPECIFIED_ERROR:
        default:
          throw new XMPPFailureException("Unknown error sending message");
      }
    }

    XmppMessageResponse response = new XmppMessageResponse();
    response.mergeFrom(responseBytes);
    return response;
  }

  /**
   * Helper method to check preconditions for methods.
   */
  private void checkArgument(boolean expression, String message) {
    if (!expression) {
      throw new IllegalArgumentException(message);
    }
  }
}

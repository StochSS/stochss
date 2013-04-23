// Copyright 2009 Google Inc. All Rights Reserved.

package com.google.appengine.api.xmpp;

import java.util.Arrays;

/**
 * Class that represents an XMPP message.  {@code Message} objects can
 * be constructed (via {@link MessageBuilder} and sent as outgoing
 * messages, or can be parsed as incoming messages by {@link
 * XMPPService#parseMessage}.
 *
 */
public class Message {
  private final MessageType messageType;
  private final boolean asXml;
  private final String body;
  private final String stanza;
  private final JID fromJid;
  private final JID[] recipientJids;

  /**
   * Constructor for an XMPP message.
   *
   * @param messageType Type of the message.
   * @param asXml Whether the body should be interpreted as XML.
   * @param body The body of the message.
   * @param fromJid The JID to use as the sender.
   * @param recipientJids Recipients of the message.
   * @param stanza The full XMP message stanza, or {@code null} if not
   * available.
   */
  Message(MessageType messageType, boolean asXml, String body, String stanza,
          JID fromJid,
          JID... recipientJids) {
    this.messageType = messageType;
    this.asXml = asXml;
    this.body = body;
    this.stanza = stanza;
    this.fromJid = fromJid;
    this.recipientJids = recipientJids;
  }

  public MessageType getMessageType() {
    return messageType;
  }

  public boolean isXml() {
    return asXml;
  }

  public String getBody() {
    return body;
  }

  public JID getFromJid() {
    return fromJid;
  }

  public JID[] getRecipientJids() {
    return recipientJids;
  }

  /**
   * This returns the entire XML message stanza for incoming XMPP
   * messages.  For outgoing messages, this field will be ignored.
   */
  public String getStanza() {
    return stanza;
  }

  @Override
  public String toString() {
    String formattedStanza;
    if (stanza == null) {
      formattedStanza = "null";
    } else {
      formattedStanza = "\"" + stanza.replace("\"", "\\\"") + "\"";
    }

    String formattedBody;
    if (body == null) {
      formattedBody = "null";
    } else {
      formattedBody = "\"" + body.replace("\"", "\\\"") + "\"";
    }

    return String.format(
        "Message(messageType=%s, asXml=%b, body=%s, stanza=%s, " +
        "fromJid=%s, recipientJids=%s)",
        messageType, asXml, formattedBody, formattedStanza, fromJid,
        Arrays.toString(recipientJids));
  }
}

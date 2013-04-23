// Copyright 2009 Google Inc. All Rights Reserved.

package com.google.appengine.api.xmpp;

/**
 * Builder used to generate {@link Message} instances to represent
 * incoming or outgoing XMPP messages.
 *
 */
public class MessageBuilder {

  private MessageType messageType = MessageType.CHAT;
  private boolean asXml = false;
  private String body = null;
  private JID fromJid = null;
  private JID[] recipientJids = null;
  private String stanza = null;

  public MessageBuilder withMessageType(MessageType type) {
    this.messageType = type;
    return this;
  }

  public MessageBuilder asXml(boolean asXml) {
    this.asXml = asXml;
    return this;
  }

  public MessageBuilder withBody(String body) {
    this.body = body;
    return this;
  }

  public MessageBuilder withFromJid(JID fromJid) {
    this.fromJid = fromJid;
    return this;
  }

  public MessageBuilder withRecipientJids(JID... recipientJids) {
    this.recipientJids = recipientJids;
    return this;
  }

  MessageBuilder withStanza(String stanza) {
    this.stanza = stanza;
    return this;
  }

  public Message build() {
    if (this.body == null) {
      throw new IllegalArgumentException("Must set a body");
    }

    if (this.recipientJids == null || this.recipientJids.length == 0) {
      throw new IllegalArgumentException("Must set recipient JIDs");
    }

    return new Message(messageType, asXml, body, stanza, fromJid, recipientJids);
  }
}

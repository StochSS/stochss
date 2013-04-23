// Copyright 2011 Google Inc. All Rights Reserved.

package com.google.appengine.api.xmpp;

/**
 * Builder used to generate {@link Presence} instances to represent
 * incoming XMPP presence stanzas.
 *
 */
public class PresenceBuilder {

  private PresenceType presenceType;
  private PresenceShow presenceShow;
  private String status;
  private JID fromJid;
  private JID toJid;
  private String stanza;
  private boolean valid;

  public PresenceBuilder withPresenceType(PresenceType presenceType) {
    this.presenceType = presenceType;
    return this;
  }

  public PresenceBuilder withPresenceShow(PresenceShow presenceShow) {
    this.presenceShow = presenceShow;
    return this;
  }

  public PresenceBuilder withStatus(String status) {
    this.status = status;
    return this;
  }

  public PresenceBuilder withFromJid(JID fromJid) {
    this.fromJid = fromJid;
    return this;
  }

  public PresenceBuilder withToJid(JID toJid) {
    this.toJid = toJid;
    return this;
  }

  PresenceBuilder withStanza(String stanza) {
    this.stanza = stanza;
    return this;
  }

  PresenceBuilder withValid(boolean valid) {
    this.valid = valid;
    return this;
  }

  public Presence build() {
    if (this.presenceType == null) {
      throw new IllegalArgumentException("Must have a type");
    }

    return new Presence(presenceType, presenceShow, status, toJid, fromJid, stanza, valid);
  }

}

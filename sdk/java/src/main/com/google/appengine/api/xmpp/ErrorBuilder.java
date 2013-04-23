// Copyright 2011 Google Inc. All Rights Reserved.

package com.google.appengine.api.xmpp;

import com.google.appengine.api.xmpp.Error;
import com.google.appengine.api.xmpp.JID;

/**
 * Builder used to generate {@link Error} instances to represent
 * incoming XMPP errors.
 *
 */
public class ErrorBuilder {
  private JID fromJid = null;
  private String stanza = null;

  public ErrorBuilder withFromJid(JID fromJid) {
    this.fromJid = fromJid;
    return this;
  }

  public ErrorBuilder withStanza(String stanza) {
    this.stanza = stanza;
    return this;
  }

  public Error build() {
    if (this.stanza == null) {
      throw new IllegalArgumentException("Must set stanza.");
    }

    return new Error(fromJid, stanza);
  }

}

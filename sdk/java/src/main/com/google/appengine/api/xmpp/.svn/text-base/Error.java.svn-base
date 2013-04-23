// Copyright 2011 Google Inc. All Rights Reserved.

package com.google.appengine.api.xmpp;

import com.google.appengine.api.xmpp.JID;

/**
 * Class that represents an XMPP error. Error objects are returned by
 * {@link InboundErrorParser#parseError(javax.servlet.http.HttpServletRequest);
 * there is no method for sending an outbound error.
 *
 */
public class Error {
  private JID fromJid;
  private String stanza;

  /**
   * Constructor for an Error object.
   * @param fromJid the sender of the error.
   * @param stanza the XMPP stanza representing the error.
   */
  public Error(JID fromJid, String stanza) {
    this.fromJid = fromJid;
    this.stanza = stanza;
  }

  public JID getFromJid() {
    return fromJid;
  }

  public String getStanza() {
    return stanza;
  }
}

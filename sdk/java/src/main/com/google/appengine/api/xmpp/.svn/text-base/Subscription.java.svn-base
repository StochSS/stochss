// Copyright 2011 Google Inc. All Rights Reserved.

package com.google.appengine.api.xmpp;

/**
 * Represents an incoming subscription stanza from the server.
 *
 * @see SubscriptionBuilder
 *
 */
public class Subscription {

  private final SubscriptionType subscriptionType;
  private final JID toJid;
  private final JID fromJid;
  private final String stanza;

  Subscription(SubscriptionType subscriptionType, JID toJid, JID fromJid, String stanza) {
    this.subscriptionType = subscriptionType;
    this.toJid = toJid;
    this.fromJid = fromJid;
    this.stanza = stanza;
  }

  public SubscriptionType getSubscriptionType() {
    return subscriptionType;
  }

  public JID getToJid() {
    return toJid;
  }

  public JID getFromJid() {
    return fromJid;
  }

  public String getStanza() {
    return stanza;
  }

}

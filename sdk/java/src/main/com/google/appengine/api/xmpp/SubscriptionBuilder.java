// Copyright 2011 Google Inc. All Rights Reserved.

package com.google.appengine.api.xmpp;

/**
 * Builder used to generate {@link Subscription} instances to represent
 * incoming XMPP subscription stanzas.
 *
 */
public class SubscriptionBuilder {

  private SubscriptionType subscriptionType;
  private JID toJid;
  private JID fromJid;
  private String stanza;

  public SubscriptionBuilder withSubscriptionType(SubscriptionType subscriptionType) {
    this.subscriptionType = subscriptionType;
    return this;
  }

  public SubscriptionBuilder withToJid(JID toJid) {
    this.toJid = toJid;
    return this;
  }

  public SubscriptionBuilder withFromJid(JID fromJid) {
    this.fromJid = fromJid;
    return this;
  }

  public SubscriptionBuilder withStanza(String stanza) {
    this.stanza = stanza;
    return this;
  }

  public Subscription build() {
    return new Subscription(subscriptionType, toJid, fromJid, stanza);
  }

}

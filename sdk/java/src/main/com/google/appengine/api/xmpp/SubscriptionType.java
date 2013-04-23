// Copyright 2011 Google Inc. All Rights Reserved.

package com.google.appengine.api.xmpp;

/**
 * Values for the 'type' attributes used for presence subscription.
 * These are only types from stanzas dealing with subscriptions. Types
 * used for presence information are enumerated in {@link
 * PresenceType} even though they are both communicated via presence
 * stanzas.
 *
 * @see <a href="http://tools.ietf.org/html/rfc3921#section-6">RFC
 * 3921, Section 6</a> for the specification of XMPP Presence
 * Subscription.
 */
public enum SubscriptionType {
  /**
   * Signals that a contact has requested a subscription.
   */
  SUBSCRIBE,

  /**
   * Signals that a contact has accepted a request for subscription.
   */
  SUBSCRIBED,

  /**
   * Signals that a contact is requesting an end to a subscription.
   */
  UNSUBSCRIBE,

  /**
   * Signals that a contact has ended a subscription.
   */
  UNSUBSCRIBED
}

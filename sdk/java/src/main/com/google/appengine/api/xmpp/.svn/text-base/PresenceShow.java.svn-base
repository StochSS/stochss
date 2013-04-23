// Copyright 2011 Google Inc. All Rights Reserved.

package com.google.appengine.api.xmpp;

import com.google.appengine.api.xmpp.XMPPServicePb.PresenceResponse;

/**
 * Values for the 'show' sub-stanza of presences.
 *
 * @see <a href="http://tools.ietf.org/html/rfc3921#section-2.2.2.1">
 * RFC 3921, Section 2.2.2.1</a> for the specification of XMPP message
 * Presence Show.
 */
public enum PresenceShow {
  /**
   * The entity is assumed to be online and available.
   */
  NONE,

  /**
   * The entity or resource is temporarily away.
   */
  AWAY,

  /**
   * The entity or resource is actively interested in chatting.
   */
  CHAT,

  /**
   * The entity or resource is busy (dnd = "Do Not Disturb").
   */
  DND,

  /**
   * The entity or resource is away for an extended period
   * (xa = "eXtended Away").
   */
  XA;

  public static PresenceShow fromPresenceResponseEnum(PresenceResponse.SHOW value) {
    switch (value) {
      case NORMAL:
        return NONE;
      case AWAY:
        return AWAY;
      case DO_NOT_DISTURB:
        return DND;
      case CHAT:
        return CHAT;
      case EXTENDED_AWAY:
        return XA;
      default:
        return NONE;
    }
  }
}

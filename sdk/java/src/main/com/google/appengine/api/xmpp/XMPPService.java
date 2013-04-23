// Copyright 2008 Google Inc. All rights reserved.

package com.google.appengine.api.xmpp;

import java.io.IOException;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

/**
 * Interface for accessing XMPP status information, sending
 * XMPP messages, and parsing XMPP responses.
 *
 * @see <a href="http://tools.ietf.org/html/rfc3921">RFC 3921</a> for
 * the XMPP specification.
 * @author kushal@google.com (Kushal Dave)
 */
public interface XMPPService {
  /**
   * Given a JID, look up the user's status and return it.  If the JID is invalid, an
   * IllegalArgumentException will be thrown.  Because of this, the isValid method on
   * the returned Presence object will always return true.
   * @param jabberId JID of the user whose presence should be fetched.
   * @throws IllegalArgumentException if the id is not valid
   */
  Presence getPresence(JID jabberId);

  /**
   * Given a JID, look up the user's status and return it.  If the JID is invalid, an
   * IllegalArgumentException will be thrown.  Because of this, the isValid method on
   * the returned Presence object will always return true.
   * @param jabberId JID of the user whose presence should be fetched.
   * @param fromJid JID of the chat bot. Can be null.
   * @throws IllegalArgumentException if the id is not valid
   */
  Presence getPresence(JID jabberId, JID fromJid);

  /**
   * Given a JID, look up the user's status and return it. Uses a custom
   * JID as the sender.  Note that rather than raising an exception, the validity of
   * a JID is indicated via the isValid method on Presence.
   * @param jabberIds A collection of JIDs for users whose presence should be fetched.
   */
  List<Presence> getPresence(Iterable<JID> jabberIds);

  /**
   * Given a JID, look up the user's status and return it. Uses a custom
   * JID as the sender.  Note that rather than raising an exception, the validity of
   * a JID is indicated via the isValid method on Presence.
   * @param jabberIds A collection of JIDs for users whose presence should be fetched.
   * @param fromJid JID of the chat bot. Can be null.
   */
  List<Presence> getPresence(Iterable<JID> jabberIds, JID fromJid);

  /**
   * Given a JID, type and optional show and status value, sends
   * a presence packet.
   * @param jabberId JID of the user to send presence to.
   * @param type Type of presence. Can be null (available).
   * @param show Value for show element. Can be null.
   * @param status String for status element. Can be null.
   * @throws IllegalArgumentException If the one or more of the parameters
   *                                  are not valid.
   */
  void sendPresence(JID jabberId, PresenceType type, PresenceShow show, String status);

  /**
   * Given a JID, type and optional show and status value, sends
   * a presence packet.
   * @param jabberId JID of the user to send presence to.
   * @param type Type of presence. Can be null (available).
   * @param show Value for show element. Can be null.
   * @param status String for status element.  Can be null.
   * @param fromJid JID of the chat bot. Can be null.
   * @throws IllegalArgumentException If the one or more of the parameters
   *                                  are not valid.
   */
  void sendPresence(JID jabberId, PresenceType type, PresenceShow show, String status, JID fromJid);

  /**
   * Given a JID, sends a chat invitation.
   * @param jabberId JID of the user to invite.
   * @throws IllegalArgumentException if the id is not valid
   */
  void sendInvitation(JID jabberId);

  /**
   * Given a JID, sends a chat invitation. Uses a custom JID as the sender.
   * @param fromJid JID of the chat bot. Can be null.
   * @throws IllegalArgumentException if the id is not valid
   */
  void sendInvitation(JID jabberId, JID fromJid);

  /**
   * Send provided message to specified JIDs.
   * @param message Message to send.
   * @throws IllegalArgumentException if the message or ids are not valid
   */
  SendResponse sendMessage(Message message);

  /**
   * Parse the incoming message provided in {@code request}.  This
   * method should only be called from within an XMPP webhook.
   */
  Message parseMessage(HttpServletRequest request) throws IOException;

  /**
   * Parse the incoming presence notification provided in {@code request}.  This
   * method should only be called from within an XMPP webhook.
   */
  Presence parsePresence(HttpServletRequest request) throws IOException;

  /**
   * Parse the incoming subscription notification provided in {@code request}.
   * This method should only be called from within an XMPP webhook.
   */
  Subscription parseSubscription(HttpServletRequest request) throws IOException;
}

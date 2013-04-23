// Copyright 2008 Google Inc. All Rights Reserved.

package com.google.appengine.api.xmpp;

/**
 * Object representing a single Jabber ID.
 *
 * @author kushal@google.com (Kushal Dave)
 */
public final class JID {

  private final String id;

  public JID(String id) {
    this.id = id;
  }

  public String getId() {
    return id;
  }

  @Override
  public String toString() {
    return "<JID: " + id + ">";
  }
}

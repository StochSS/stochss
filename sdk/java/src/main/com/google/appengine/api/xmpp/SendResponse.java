// Copyright 2008 Google Inc. All Rights Reserved.

package com.google.appengine.api.xmpp;

import java.util.HashMap;
import java.util.Map;

/**
 * Represents results of sending a message.
 *
 * @author kushal@google.com (Kushal Dave)
 */
public final class SendResponse {

  private final Map<JID, Status> statusMap =
      new HashMap<JID, Status>();

  public SendResponse() { }

  public void addStatus(JID jabberId, Status status) {
    statusMap.put(jabberId, status);  
  }
  
  public Map<JID, Status> getStatusMap() {
    return statusMap;
  }

  /**
   * Possible per-id responses to sending a message.
   */
  public enum Status {
    SUCCESS,
    INVALID_ID,
    OTHER_ERROR
  }
}

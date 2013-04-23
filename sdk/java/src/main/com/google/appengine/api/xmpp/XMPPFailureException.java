// Copyright 2008 Google Inc. All Rights Reserved.
package com.google.appengine.api.xmpp;

/**
 * {@code XMPPFailureException} is thrown when any unknown
 * error occurs while communicating with the XMPP service.
 *
 */
public class XMPPFailureException extends RuntimeException {
  public XMPPFailureException(String message) {
    super(message);
  }
}

// Copyright (c) 2011 Google Inc.

package com.google.appengine.tools.admin;
/**
 * Verification code receiver.
 *
 */
public interface VerificationCodeReceiver {
  /** Returns the redirect URI. */
  String getRedirectUri() throws VerificationCodeReceiverRedirectUriException;

  /** Waits for a verification code. */
  String waitForCode();

  /** Releases any resources and stops any processes started. */
  void stop() throws VerificationCodeReceiverStopException;
}

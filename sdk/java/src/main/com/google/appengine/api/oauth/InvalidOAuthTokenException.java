// Copyright 2010 Google Inc. All Rights Reserved.

package com.google.appengine.api.oauth;

/**
 * {@code InvalidOAuthTokenException} is thrown when a request contains an
 * invalid OAuth token (for example, a token that has been revoked by the user).
 *
 */
public class InvalidOAuthTokenException extends OAuthRequestException {
  public InvalidOAuthTokenException(String message) {
    super(message);
  }
}

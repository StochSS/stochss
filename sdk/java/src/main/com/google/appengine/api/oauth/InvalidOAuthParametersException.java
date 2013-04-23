// Copyright 2010 Google Inc. All Rights Reserved.

package com.google.appengine.api.oauth;

/**
 * {@code InvalidOAuthParametersException} is thrown when a request is a
 * malformed OAuth request (for example, it omits a required parameter or
 * contains an invalid signature).
 *
 */
public class InvalidOAuthParametersException extends OAuthRequestException {
  public InvalidOAuthParametersException(String message) {
    super(message);
  }
}

// Copyright 2010 Google Inc. All Rights Reserved.

package com.google.appengine.api.oauth;

/**
 * {@code OAuthRequestException} is thrown when a request is not a valid OAuth
 * request.
 *
 */
public class OAuthRequestException extends Exception {
  public OAuthRequestException(String message) {
    super(message);
  }
}

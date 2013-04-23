// Copyright 2010 Google Inc. All rights reserved.

package com.google.appengine.api.oauth;

import com.google.appengine.api.users.User;

/**
 * The OAuthService provides methods useful for validating OAuth requests.
 *
 * @see <a href="http://tools.ietf.org/html/rfc5849">RFC 5849</a> for
 * the OAuth specification.
 */
public interface OAuthService {
  /**
   * Returns the {@link User} on whose behalf the request was made.
   *
   * @throws OAuthRequestException If the request was not a valid OAuth request.
   * @throws OAuthServiceFailureException If an unknown OAuth error occurred.
   */
  User getCurrentUser() throws OAuthRequestException;

  /**
   * Returns the {@link User} on whose behalf the request was made.
   * @param scope The custom OAuth scope that is accepted.
   *
   * @throws OAuthRequestException If the request was not a valid OAuth request.
   * @throws OAuthServiceFailureException If an unknown OAuth error occurred.
   */
  User getCurrentUser(String scope) throws OAuthRequestException;

  /**
   * Returns true if the user on whose behalf the request was made is an admin
   * for this application, false otherwise.
   *
   * @throws OAuthRequestException If the request was not a valid OAuth request.
   * @throws OAuthServiceFailureException If an unknown OAuth error occurred.
   */
  boolean isUserAdmin() throws OAuthRequestException;

  /**
   * Returns true if the user on whose behalf the request was made is an admin
   * for this application, false otherwise.
   * @param scope The custom OAuth scope that is accepted.
   *
   * @throws OAuthRequestException If the request was not a valid OAuth request.
   * @throws OAuthServiceFailureException If an unknown OAuth error occurred.
   *
   * @since App Engine 1.7.3.
   */
  boolean isUserAdmin(String scope) throws OAuthRequestException;

  /**
   * Returns the oauth_consumer_key OAuth parameter from the request.
   *
   * @throws OAuthRequestException If the request was not a valid OAuth request.
   * @throws OAuthServiceFailureException If an unknown OAuth error occurred.
   */
  String getOAuthConsumerKey() throws OAuthRequestException;

  /**
   * Returns the client_id from oauth2 request
   *
   * @throws OAuthRequestException If the request was not a valid OAuth2 request.
   * @throws OAuthServiceFailureException If an unknown OAuth error occurred.
   */
  String getClientId(String scope) throws OAuthRequestException;
}

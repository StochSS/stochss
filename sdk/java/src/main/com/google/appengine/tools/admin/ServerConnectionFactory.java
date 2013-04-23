// Copyright 2011 Google Inc. All Rights Reserved.

package com.google.appengine.tools.admin;

import com.google.appengine.tools.admin.AppAdminFactory.ConnectOptions;

/**
 * Factory for retrieving a ServerConnection instance. Returns either a
 * ClientLogin or OAuth2-based implementation.
 *
 */
public final class ServerConnectionFactory {

  private static ServerConnection connection;

  /**
   * Get a new {@link ServerConnection} instance.
   */
  public static ServerConnection getServerConnection(ConnectOptions options) {
    if (connection != null) {
      return connection;
    }
    if (options.getOauthToken() != null) {
      return new OAuth2ServerConnection(options);
    }
    return new ClientLoginServerConnection(options);
  }

  /**
   * Statically set the {@link ServerConnection} object that is returned from getServerConnection.
   *
   * This should be used for testing only.
   */
  static void setServerConnectionForTesting(ServerConnection testConnection) {
    connection = testConnection;
  }

  private ServerConnectionFactory() {
  }
}

// Copyright 2011 Google Inc. All Rights Reserved.

package com.google.appengine.tools.admin;

import com.google.appengine.tools.admin.AppAdminFactory.ConnectOptions;

import java.io.BufferedReader;
import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.List;
import java.util.Map;

/**
 * Connection to the AppEngine hosting service that uses an OAuth 2 token.
 */
public class OAuth2ServerConnection extends AbstractServerConnection {

  /**
   * Exception type for general OAuth-related failures.
   */
  public static class OAuthException extends IOException {
    public OAuthException(String s) {
      super(s);
    }

    public OAuthException(String s, Throwable c) {
      super(s);
      initCause(c);
    }
  }

  /**
   * Exception type for OAuth failures resulting from invalid/expired tokens.
   */
  public static class OAuthInvalidTokenException extends OAuthException {
    public OAuthInvalidTokenException(String s) {
      super(s);
    }

    public OAuthInvalidTokenException(String s, Throwable c) {
      super(s, c);
    }
  }

  public OAuth2ServerConnection(ConnectOptions options) {
    super(options);
  }

  @Override
  protected void doHandleSendErrors(int status, URL url, HttpURLConnection conn,
      BufferedReader connReader) throws IOException {
    String reason = conn.getHeaderField("X-OAuth-Error");
    if (status == 401) {
      if ("InvalidOAuthToken".equals(reason)) {
        throw new OAuthInvalidTokenException(constructHttpErrorMessage(conn, connReader));
      } else if ("BadOAuthRequest".equals(reason) || "OAuthError".equals(reason)) {
        throw new OAuthException(constructHttpErrorMessage(conn, connReader));
      } else {
        throw new HttpIoException(constructHttpErrorMessage(conn, connReader),
            status);
      }
    } else if (status == 403) {
      logger.finer(constructHttpErrorMessage(conn, connReader));
    } else if (status >= 500 && status <= 600) {
    } else if (status == 302) {
      Map<String, List<String>> headers = conn.getHeaderFields();
      String location = headers.get("Location").get(0);
      logger.finer("Redirect Location: " + location + ", not following redirect.");
    }
  }

  @Override
  protected void doPostConnect(String method, HttpURLConnection conn, DataPoster data) {
  }

  @Override
  protected void doPreConnect(String method, HttpURLConnection conn, DataPoster data) {
    if (options.getOauthToken() != null) {
      conn.setRequestProperty("Authorization", "OAuth " + options.getOauthToken());
    }
  }
}

// Copyright 2010 Google Inc. All Rights Reserved.

package com.google.appengine.tools.remoteapi;

import org.apache.commons.httpclient.Cookie;
import org.apache.commons.httpclient.util.EncodingUtil;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

/**
 * Abstract class that handles making HTTP requests to App Engine.  The actual
 * mechanism by which the HTTP requests are made is left to subclasses to
 * implement.
 * <p> This class is thread-safe. </p>
 *
 */
abstract class AppEngineClient {
  private final String hostname;
  private final int port;
  private final String userEmail;
  private final Cookie[] authCookies;
  private final String remoteApiPath;
  private final int maxResponseSize;

  private final String appId;

  AppEngineClient(RemoteApiOptions options,
      List<Cookie> authCookies, String appId) {
    if (options == null) {
      throw new IllegalArgumentException("options not set");
    }
    if (authCookies == null) {
      throw new IllegalArgumentException("authCookies not set");
    }
    this.hostname = options.getHostname();
    this.port = options.getPort();
    this.userEmail = options.getUserEmail();
    this.authCookies = authCookies.toArray(new Cookie[0]);
    this.remoteApiPath = options.getRemoteApiPath();
    this.maxResponseSize = options.getMaxHttpResponseSize();

    this.appId = appId;
  }

  /**
   * @return the {@link Cookie} objects that should be used for authentication
   */
  Cookie[] getAuthCookies() {
    return authCookies;
  }

  int getMaxResponseSize() {
    return maxResponseSize;
  }

  /**
   * @return the path to the remote api for this app (if logged in), {@code null} otherwise
   */
  String getRemoteApiPath() {
    return remoteApiPath;
  }

  /**
   * @return the app id for this app (if logged in), {@code null} otherwise
   */
  String getAppId() {
    return appId;
  }

  int getPort() {
    return port;
  }

  String serializeCredentials() {
    StringBuilder out = new StringBuilder();
    out.append("host=" + hostname + "\n");
    out.append("email=" + userEmail + "\n");
    for (Cookie cookie : authCookies) {
      out.append("cookie=" + cookie.getName() + "=" + cookie.getValue() + "\n");
    }
    return out.toString();
  }

  String makeUrl(String path) {
    if (!path.startsWith("/")) {
      throw new IllegalArgumentException("path doesn't start with a slash: " + path);
    }
    String protocol = port == 443 ? "https" : "http";
    return protocol + "://" + hostname + ":" + port + path;
  }

  List<String[]> getHeadersForPost(String mimeType) {
    List<String[]> headers = getHeadersBase();
    headers.add(new String[]{"Content-type", mimeType});
    return headers;
  }

  List<String[]> getHeadersForGet() {
    return getHeadersBase();
  }

  List<String[]> getHeadersBase() {
    List<String[]> headers = new ArrayList<String[]>();
    headers.add(new String[]{"Host", hostname});
    headers.add(new String[]{"X-appcfg-api-version", "1"});
    return headers;
  }

  abstract Response get(String path) throws IOException;

  abstract Response post(String path, String mimeType, byte[] body) throws IOException;

  static class Response {
    private final int statusCode;
    private final byte[] responseBody;
    private final String responseCharSet;

    Response(int statusCode, byte[] responseBody, String responseCharSet) {
      this.statusCode = statusCode;
      this.responseBody = responseBody;
      this.responseCharSet = responseCharSet;
    }

    int getStatusCode() {
      return statusCode;
    }

    byte[] getBodyAsBytes() {
      return responseBody;
    }

    String getBodyAsString() {
      return EncodingUtil.getString(responseBody, responseCharSet);
    }
  }
}

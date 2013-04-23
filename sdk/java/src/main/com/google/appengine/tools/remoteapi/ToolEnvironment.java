// Copyright 2010 Google Inc. All Rights Reserved.

package com.google.appengine.tools.remoteapi;

import com.google.apphosting.api.ApiProxy;

import java.util.HashMap;
import java.util.Map;

/**
 * A fake environment to use in client-side tools that use App Engine APIs,
 * such the remote API, or any other code that uses a KeyFactory.
 */
class ToolEnvironment implements ApiProxy.Environment {

  private final String appId;
  private final String userEmail;
  private final Map<String, Object> attributes = new HashMap<String, Object>();

  public ToolEnvironment(String appId, String userEmail) {
    this.appId = appId;
    this.userEmail = userEmail;
  }

  @Override
  public String getAppId() {
    return appId;
  }

  @Override
  public Map<String, Object> getAttributes() {
    return attributes;
  }

  @Override
  public String getAuthDomain() {
    return "gmail.com";
  }

  @Override
  public String getEmail() {
    return userEmail;
  }

  @Override
  @Deprecated
  public String getRequestNamespace() {
    return "";
  }

  @Override
  public String getVersionId() {
    return "1";
  }

  @Override
  public boolean isAdmin() {
    return true;
  }

  @Override
  public boolean isLoggedIn() {
    return true;
  }

  @Override
  public long getRemainingMillis() {
    return Long.MAX_VALUE;
  }
}

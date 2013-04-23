// Copyright 2011 Google Inc. All Rights Reserved.
package com.google.appengine.tools.development.testing;

import java.io.File;

/**
 * Base {@link DevAppServerTestConfig} implementation with common defaults:
 * Use <app dir>/WEB-INF/web.xml.
 * Use <app dir>/WEB-INF/appengine-web.xml.
 * Install the security manager.
 * Make the dev appserver port available in a system property named
 * {@link #DEFAULT_PORT_SYSTEM_PROPERTY}.
 *
 */
public abstract class BaseDevAppServerTestConfig implements DevAppServerTestConfig {

  public static final String DEFAULT_PORT_SYSTEM_PROPERTY = "appengine.devappserver.test.port";

  @Override
  public File getWebXml() {
    return null;
  }

  @Override
  public File getAppEngineWebXml() {
    return null;
  }

  @Override
  public boolean installSecurityManager() {
    return true;
  }

  @Override
  public String getPortSystemProperty() {
    return DEFAULT_PORT_SYSTEM_PROPERTY;
  }
}

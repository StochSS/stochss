// Copyright 2011 Google. All Rights Reserved.
package com.google.appengine.tools.development.testing;

import com.google.appengine.tools.development.DevAppServer;
import com.google.appengine.tools.development.DevAppServerFactory;
import com.google.appengine.tools.info.SdkInfo;

/**
 * A helper that manages a dev appserver.
 * The dev appserver can be configured to run against an exploded war or
 * an explicitly provided classpath, web.xml, and appengine-web.xml.
 *
 * You can only start one dev appserver per classloader.
 *
 */
class DevAppServerTestHelper {

  private static final String SDK_ROOT_PROP = "appengine.sdk.root";

  static DevAppServer server;
  static String originalSdkRoot;
  static boolean started = false;

  /**
   * Run the app in the dev appserver with the provided configuration.  All
   * classes required by the application and the test must be available on the
   * provided classpath.  This method ignores wars.
   *
   * @param testConfig the config
   * @return the dv appserver wer started
   *
   * @throws IllegalStateException If a dev appserver started by this class is
   * already running.
   */
  public static DevAppServer startServer(DevAppServerTestConfig testConfig) {
    if (started) {
      throw new IllegalStateException("Dev Appserver is already running.");
    }
    originalSdkRoot = System.getProperty(SDK_ROOT_PROP);
    System.setProperty(SDK_ROOT_PROP, testConfig.getSdkRoot().getAbsolutePath());

    String address = "127.0.0.1";
    SdkInfo.includeTestingJarOnSharedPath(true);
    server = new DevAppServerFactory().createDevAppServer(testConfig.getAppDir(),
        testConfig.getWebXml(), testConfig.getAppEngineWebXml(), address, 0, true,
        testConfig.installSecurityManager(), testConfig.getClasspath());
    try {
      server.start();
      System.setProperty(testConfig.getPortSystemProperty(), Integer.toString(server.getPort()));
      started = true;
      return server;
    } catch (Exception e) {
      if (e instanceof RuntimeException) {
        throw (RuntimeException) e;
      }
      throw new RuntimeException(e);
    } finally {
      if (!started) {
        server = null;
        SdkInfo.includeTestingJarOnSharedPath(false);
      }
    }
  }

  /**
   * Shut down the dev appserver.
   */
  public static void stopServer() {
    SdkInfo.includeTestingJarOnSharedPath(false);
    if (server != null) {
      try {
        server.shutdown();
        server = null;
      } catch (Exception e) {
        if (e instanceof RuntimeException) {
          throw (RuntimeException) e;
        }
        throw new RuntimeException(e);
      }
    }
    if (originalSdkRoot == null) {
      System.clearProperty(SDK_ROOT_PROP);
    } else {
      System.setProperty(SDK_ROOT_PROP, originalSdkRoot);
    }
  }
}

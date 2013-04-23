// Copyright 2009 Google Inc. All Rights Reserved.
package com.google.appengine.tools.development;

import java.io.File;

/**
 * Provides access to common attributes of a local server.
 *
 */
public interface LocalServerEnvironment {

  /**
   * @return the directory containing the application files
   */
  File getAppDir();

  /**
   * @return the address at which the server is running
   */
  String getAddress();

  /**
   * @return the port to which the server is bound
   */
  int getPort();

  /**
   * @return the host name at which the server is running.
   */
  String getHostName();
  /**
   * This call will block until the server is fully initialized
   * and ready to process incoming http requests.
   */
  void waitForServerToStart() throws InterruptedException;

  /**
   * @return Whether or not API deadlines should be emulated.
   */
  boolean enforceApiDeadlines();

  /**
   * @return Whether or not local services should simulate production
   * latencies.
   */
  boolean simulateProductionLatencies();
}

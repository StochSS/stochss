// Copyright 2009 Google Inc. All Rights Reserved.

package com.google.appengine.tools.development;

/**
 * Context object for local services to initialize in.
 *
 */
public interface LocalServiceContext {

  /**
   * Fetches the local server environment.
   */
  LocalServerEnvironment getLocalServerEnvironment();

  /**
   * Fetches the local Capabilities environment
   */
  LocalCapabilitiesEnvironment getLocalCapabilitiesEnvironment();

  /**
   * Fetches the clock that local services should use to determine the current time.
   */
  Clock getClock();

  /**
   * Retrieves the local service identified by the package name.
   */
  LocalRpcService getLocalService(String packageName);
}

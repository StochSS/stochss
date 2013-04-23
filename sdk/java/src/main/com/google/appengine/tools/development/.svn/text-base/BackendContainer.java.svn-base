// Copyright 2011 Google Inc. All Rights Reserved.

package com.google.appengine.tools.development;

import com.google.appengine.tools.development.ApplicationConfigurationManager.ServerConfigurationHandle;

import java.io.File;
import java.util.Map;

/**
 * Interface to backend instances
 */
public interface BackendContainer {

  public void setServiceProperties(Map<String, String> properties);

  /**
   * Shutdown all backend servers
   *
   * @throws Exception
   */
  public void shutdownAll() throws Exception;

  /**
   * Start all backend servers, the number of servers to start is specified
   * in the {@code appConfig} parameter
   *
   * @param backendsXml Parsed backends.xml file with servers configuration
   * @param local The api proxy that each container should use.
   * @throws Exception
   */
  public void startupAll(ApiProxyLocal local) throws Exception;

  public void init(String address, final ServerConfigurationHandle serverConfigurationHandle,
      File externalResourceDirectory, Map<String, Object> containerConfigProperties,
      DevAppServer devAppServer);
}

// Copyright 2008 Google Inc. All Rights Reserved.

package com.google.appengine.tools.development;

import com.google.appengine.tools.development.ApplicationConfigurationManager.ServerConfigurationHandle;
import com.google.apphosting.utils.config.AppEngineWebXml;

import java.io.File;
import java.io.IOException;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Provides the backing servlet container support for the {@link DevAppServer},
 * as discovered via {@link ServiceProvider}.
 * <p>
 * More specifically, this interface encapsulates the interactions between the
 * {@link DevAppServer} and the underlying servlet container, which by default
 * uses Jetty.
 *
 */
interface ContainerService {

  /**
   * Sets up the necessary configuration parameters.
   *
   * @param devAppServerVersion Version of the devAppServer.
   * @param address The address on which the server will run
   * @param port The port to which the server will be bound.  If 0, an
   *        available port will be selected.
   * @param serverConfigurationHandle Handle to access and reread the configuration.
   * @param externalResourceDirectory If not {@code null}, a resource directory external
   *        to the applicationDirectory. This will be searched before
   *        applicationDirectory when looking for resources.
   * @param instance the 0 based instance number for this container's instance or
   *        {@link LocalEnvironment#MAIN_INSTANCE}.
   * @param containerConfigProperties Additional properties used in the
   *        configuration of the specific container implementation.  This map travels
   *        across classloader boundaries, so all values in the map must be JRE
   *        classes.
   *
   * @return A LocalServerEnvironment describing the environment in which
   * the server is running.
   */
  LocalServerEnvironment configure(String devAppServerVersion, String address, int port,
      ServerConfigurationHandle serverConfigurationHandle, File externalResourceDirectory,
      Map<String, Object> containerConfigProperties, int instance, DevAppServer devAppServer);

  /**
   * Create's this containers network connections. After this returns
   * {@link #getAddress}, {@link #getPort} and {@link getHostName} return
   * correct values for this container.
   */
  void createConnection() throws Exception;

  /**
   * Starts up the servlet container.
   *
   * @throws Exception Any exception from the container will be rethrown as is.
   */
  void startup() throws Exception;

  /**
   * Shuts down the servlet container.
   *
   * @throws Exception Any exception from the container will be rethrown as is.
   */
  void shutdown() throws Exception;

  /**
   * Returns the listener network address, however it's decided during
   * the servlet container deployment.
   */
  String getAddress();

  /**
   * Returns the listener port number, however it's decided during the servlet
   * container deployment.
   */
  int getPort();

  /**
   * Returns the host name of the server, however it's decided during the
   * the servlet container deployment.
   */
  String getHostName();

  /**
   * Returns the context representing the currently executing webapp.
   */
  AppContext getAppContext();

  /**
   * Return the AppEngineWebXml configuration of this container
   */
  AppEngineWebXml getAppEngineWebXmlConfig();

  /**
   * Get a set of properties to be passed to each service, based on the
   * AppEngineWebXml configuration.
   *
   * @return the map of properties to be passed to each service.
   */
  Map<String, String> getServiceProperties();

  /**
   * Forwards an HttpRequest request to this container.
   */
  void forwardToServer(HttpServletRequest hrequest, HttpServletResponse hresponse)
      throws IOException, ServletException;

}

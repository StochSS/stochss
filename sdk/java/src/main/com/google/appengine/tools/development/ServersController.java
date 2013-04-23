package com.google.appengine.tools.development;

import com.google.apphosting.api.ApiProxy;

/**
 * Servers query and control operations needed by the ServersService.
 */
public interface ServersController {
  /**
   * Returns all the known server names.
   */
  Iterable<String> getServerNames();

  /**
   * Returns all known versions of the requested server.
   *
   * @throws ApiProxy.ApplicationException with error code {@link com.google.appengine.api
   * .labs.servers.ServersServicePb.ServersServiceError.ErrorCode#INVALID_SERVER_VALUE} if
   * the requested server is not configured
   */
  Iterable<String> getVersions(String serverName) throws ApiProxy.ApplicationException;

  /**
   * Returns the default version for a named server.
   *
   * @throws ApiProxy.ApplicationException with error code {@link com.google.appengine.api
   * .labs.servers.ServersServicePb.ServersServiceError.ErrorCode#INVALID_SERVER_VALUE} if
   * the requested server is not configured
   */
  String getDefaultVersion(String serverName) throws ApiProxy.ApplicationException;

  /**
   * Returns the number of instances for the requested server/version.
   *
   * @throws ApiProxy.ApplicationException with error code {@link com.google.appengine.api
   * .labs.servers.ServersServicePb.ServersServiceError.ErrorCode#INVALID_SERVER_VALUE} if
   * the requested server is not configured and {@link  com.google.appengine.api
   * .labs.servers.ServersServicePb.ServersServiceError.ErrorCode#INVALID_VERSION_VALUE}
   * if the requested version is not configured.
   */
  int getNumInstances(String serverName, String version) throws ApiProxy.ApplicationException;

  /**
   * Returns the hostname the requested server/version/instance.
   *
   * @param serverName the serverName whose host we return.
   * @param version the version whose host we return.
   * @param instance the instance whose host we return or {@link com.google.appengine
   *     .tools.development.LocalEnvironment#MAIN_INSTANCE}
   *
   * @throws ApiProxy.ApplicationException with error code {@link com.google.appengine.api
   * .labs.servers.ServersServicePb.ServersServiceError.ErrorCode#INVALID_SERVER_VALUE} if
   * the requested server is not configured and {@link  com.google.appengine.api
   * .labs.servers.ServersServicePb.ServersServiceError.ErrorCode#INVALID_VERSION_VALUE}
   * if the requested version is not configured and {@link  com.google.appengine.api
   * .labs.servers.ServersServicePb.ServersServiceError.ErrorCode#INVALID_INSTANCES_VALUE}
   * if the requested instance is not configured.
   */
 String getHostname(String serverName, String version, int instance)
     throws ApiProxy.ApplicationException;
}

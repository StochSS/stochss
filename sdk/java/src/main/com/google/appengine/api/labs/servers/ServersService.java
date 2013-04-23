package com.google.appengine.api.labs.servers;

import java.util.Set;

/**
 * ServersService allows the application to fetch information about its
 * own server and version information.  Additionally, the service has the
 * ability to start, stop and change the number of instances associated with a
 * server version.
 *
 */
public interface ServersService {

  /**
   * Get the name of the current server.
   *
   * @return the name of the server
   */
  String getCurrentServer();

  /**
   * Get the name of the current version.
   *
   * @return the name of the version
   */
  String getCurrentVersion();

  /**
   * Get the id of the current instance.
   *
   * @return current instance id
   * @throws ServersException when no instance id exists for the current instance
   */
  String getCurrentInstanceId();

  /**
   * Get the set of servers that are available to the application.
   *
   * @return Set of servers available to the application
   * @throws ServersException when an error occurs
   */
  Set<String> getServers();

  /**
   * Returns the set of versions that are available to the given server.
   *
   * @param server the name of the server
   * @throws ServersException when input is invalid
   */
  Set<String> getVersions(String server);

  /**
   * Returns the name of the default version for the server.
   *
   * @param server the name of the server
   * @throws ServersException when an error occurs
   */
  String getDefaultVersion(String server);

  /**
   * Returns the number of instances that are available to the given server+version.
   *
   * @param server the name of the server
   * @param version the name of the version
   * @throws ServersException when input is invalid
   */
  long getNumInstances(String server, String version);

  /**
   * Set the number of instances that are available to the given server+version.
   *
   * @param server the name of the server
   * @param version the name of the version
   * @param instances the number of instances to set
   * @throws ServersException when input is invalid
   */
  void setNumInstances(String server, String version, long instances);

  /**
   * Start a given server+version.
   *
   * @param server the name of the server
   * @param version the name of the version
   * @throws ServersException when input or existing state is invalid
   */
  void startServer(String server, String version);

  /**
   * Stop a given server+version.
   *
   * @param server the name of the server
   * @param version the name of the version
   * @throws ServersException when input or existing state is invalid
   */
  void stopServer(String server, String version);

  /**
   * Returns a hostname to use for the given server and version.
   *
   * @param server the name of the server
   * @param version the name of the version
   * @throws ServersException when input is invalid
   */
  String getServerHostname(String server, String version);

  /**
   * Returns a hostname to use for the given server and version.
   *
   * @param server the name of the server
   * @param version the name of the version
   * @param instance the id of a particular instance to address
   * @return the hostname of the given instance
   * @throws ServersException when input is invalid
   */
  String getServerHostname(String server, String version, int instance);
}

package com.google.appengine.tools.development;

import java.util.Map;

/**
 * Holder for both configuration and runtime information for a single
 * {@link DevAppServer} server and all its instances.
 *
 */
interface Server {
  /**
   * Configure this {@link Server}.
   * <p>
   * Note {@link #configure} fits into the {@link DevAppServer} startup
   * sequence. The user may adjust {@link DevAppServer#setServiceProperties}
   * values after construction and before calling {@link DevAppServer#start()}
   * which calls {@link #configure}. To retain compatibility operations that
   * make use of these user specified settings such as port selection must not
   * not be performed during construction.
   * @param containerConfigProperties container configuration properties.
   * @throws Exception
   */
  void configure(Map<String, Object>containerConfigProperties) throws Exception;

  /**
   * Creates the network connections for this {@link Server}.
   * @throws Exception
   */
  void createConnection() throws Exception;

  /**
   * Starts all the instances for this {@link Server}. Once this returns the
   * {@link Server} can handle HTTP requests.
   * @throws Exception
   */
  void startup() throws Exception;

  /**
   * Stops all the instances for this {@link Server}. Once this returns the
   * {@link Server} cannot handle HTTP requests.
   * @throws Exception
   */
  void shutdown() throws Exception;

  /**
   * Returns the name for this {@link Server}.
   */
  String getServerName();

  /**
   * Returns the {@link ContainerService} for the primary instance for this
   * {@link Server}.
   */
  ContainerService getMainContainer();

  /**
   * Returns the {@link LocalServerEnvironment} for the primary instance for
   * this {@link Server}.
   */
  LocalServerEnvironment getLocalServerEnvironment();

  /**
   * Returns the host and port for the requested instance or null if the
   * instance does not exist.
   * @param instance The instance number or {@link LocalEnvironment#MAIN_INSTANCE}.
   */
  String getHostAndPort(int instance);

  /**
   * Returns the requested {@link InstanceHolder} or null if the instance does
   * not exist.
   * @param instance the instance number or {@link LocalEnvironment#MAIN_INSTANCE}.
   */
  InstanceHolder getInstanceHolder(int instance);

  /**
   * Returns the number of instances for this server. This will return 0 for
   * an {@link AutomaticServer}.
   */
  int getInstanceCount();

  /**
   * Acquires a serving permit and returns an {@link InstanceHolder} for an
   * instance which is available to handle a request or returns null if there
   * is no such instance.
   * <p>
   * throws {@link UnsupportedOperationException} unless this is a
   * {@link ManualServer}.
   */
  InstanceHolder getAndReserveAvailableInstanceHolder();
}

package com.google.appengine.tools.development;

/**
 * Holder for per server instance state.
 */
interface InstanceHolder {

  /**
   * Returns the {@link ContainerService} for this instance.
   */
  ContainerService getContainerService();

  /**
   * Returns the id for this instance.
   */
  int getInstance();

  /**
   * Returns true if this is the main instance, meaning the load balancing
   * instance for a {@link ManualServer} and the only instance for an
   * {@link AutomaticServer}.
   */
  boolean isMainInstance();

  /**
   * Starts the instance.
   */
  void startUp() throws Exception;

  /**
   * Acquire a serving permit for this instance. This may block and have side effects such as
   * sending a startUp request.
   */
  boolean acquireServingPermit();

  /**
   * Returns true if this instance is a load balancing server.
   */
  boolean isServerLoadBalancingServer();

  /**
   * Returns true if this instance expects an internally generated
   * "_ah/start" requests to be sent.
   */
  boolean expectsGeneratedStartRequest();
}

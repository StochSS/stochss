package com.google.appengine.tools.development;

/**
 * {@link InstanceHolder} for an {@link AutomaticServer}.
 */
class AutomaticServerInstanceHolder extends AbstractServerInstanceHolder {

  /**
   * Construct an instance holder.
   * @param containerService for the instance.
   * @param instance nonnegative instance number or
   *     {link {@link LocalEnvironment#MAIN_INSTANCE}.
   */
  AutomaticServerInstanceHolder(ContainerService containerService, int instance) {
    super(containerService, instance);
  }

  @Override
  public String toString() {
    return "AutomaticServerInstanceHolder: containerservice=" + getContainerService()
        + " instance=" + getInstance();
  }

  @Override
  public void startUp() throws Exception {
    getContainerService().startup();
  }

  @Override
  public boolean acquireServingPermit() {
    return true;
  }

  @Override
  public boolean isServerLoadBalancingServer() {
    return false;
  }

  @Override
  public boolean expectsGeneratedStartRequest() {
    return false;
  }
}

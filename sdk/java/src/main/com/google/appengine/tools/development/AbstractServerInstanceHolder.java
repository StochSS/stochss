package com.google.appengine.tools.development;

/**
 * Abstract {@link InstanceHolder}.
 */
public abstract class AbstractServerInstanceHolder implements InstanceHolder {
  private final ContainerService containerService;
  private final int instance;

  AbstractServerInstanceHolder(ContainerService containerService, int instance){
    this.containerService = containerService;
    this.instance = instance;
  }

  @Override
  public ContainerService getContainerService() {
    return containerService;
  }

  @Override
  public int getInstance() {
    return instance;
  }

  @Override
  public boolean isMainInstance() {
    return instance < 0;
  }
}

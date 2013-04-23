package com.google.appengine.tools.development;

import com.google.appengine.tools.development.InstanceStateHolder.InstanceState;

import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;
import java.util.logging.Logger;

/**
 * {@link InstanceHolder} for a {@link ManualServer}.
 */
class ManualServerInstanceHolder extends AbstractServerInstanceHolder  {
  private static final int MAX_START_QUEUE_TIME_MS = 30 * 1000;
  private static final Logger LOGGER = Logger.getLogger(ManualServerInstanceHolder.class.getName());

  private final String serverName;
  private final InstanceStateHolder stateHolder;
  private final InstanceHelper instanceHelper;
  private final CountDownLatch latch;

  /**
   * Construct an instance holder.
   * @param serverName the server's name or 'default'
   * @param containerService for the instance.
   * @param instance nonnegative instance number or
   *     {link {@link LocalEnvironment#MAIN_INSTANCE}.
   * @param stateHolder holder for the instance state.
   * @param instanceHelper helper for operating on the instance.
   */
  ManualServerInstanceHolder(String serverName, ContainerService containerService, int instance,
      InstanceStateHolder stateHolder, InstanceHelper instanceHelper) {
    super(containerService, instance);
    this.serverName = serverName;
    this.stateHolder = stateHolder;
    this.instanceHelper = instanceHelper;
    this.latch = new CountDownLatch(1);
  }

  @Override
  public boolean isServerLoadBalancingServer() {
    return isMainInstance();
  }

  @Override
  public boolean expectsGeneratedStartRequest() {
    return !isMainInstance();
  }

  @Override
  public String toString() {
    return "ManualServerInstanceHolder: containerservice=" + getContainerService() + " instance="
        + getInstance();
  }

  @Override
  public void startUp() throws Exception {
    stateHolder.testAndSet(InstanceState.INITIALIZING, InstanceState.SHUTDOWN);
    getContainerService().startup();
    if (isMainInstance()) {
      stateHolder.testAndSet(InstanceState.RUNNING, InstanceState.INITIALIZING);
    } else {
      stateHolder.testAndSet(InstanceState.SLEEPING, InstanceState.INITIALIZING);
      sendStartRequest();
    }
  }

  private void sendStartRequest() {
    instanceHelper.sendStartRequest(new Runnable() {

      @Override
      public void run() {
        latch.countDown();
      }
    });
  }

  @Override
  public boolean acquireServingPermit() {
    LOGGER.finest(String.format("trying to get serving permit for server %d.%s", getInstance(),
        serverName));
    int maxWaitTime = 0;
    synchronized (stateHolder) {
      if (!stateHolder.acceptsConnections()) {
        LOGGER.finest(serverName + ": got request but server is not in a serving state");
        return false;
      }
      if (stateHolder.test(InstanceState.SLEEPING)) {
        LOGGER.finest(serverName + ": waking up sleeping server");
        sendStartRequest();
      }

      if (stateHolder.test(InstanceState.RUNNING_START_REQUEST)) {
        maxWaitTime = MAX_START_QUEUE_TIME_MS;
      }
    }
    try {
      boolean gotPermit = latch.await(maxWaitTime, TimeUnit.MILLISECONDS);
      LOGGER.finest(getInstance() + "." + serverName + ": tried to get server permit, timeout="
          + maxWaitTime  + " success=" + gotPermit);
      return gotPermit;
    } catch (InterruptedException e) {
      LOGGER.finest(
          getInstance() + "." + serverName + ": got interrupted while waiting for serving permit");
      return false;
    }
  }
}

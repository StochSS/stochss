package com.google.appengine.tools.development;

import com.google.appengine.tools.development.ApplicationConfigurationManager.ServerConfigurationHandle;
import com.google.apphosting.utils.config.AppEngineConfigException;
import com.google.apphosting.utils.config.AppEngineWebXml;
import com.google.common.collect.AbstractIterator;
import com.google.common.collect.ImmutableList;

import java.io.File;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * {@link Server} implementation for manual servers.
 */
public class ManualServer extends AbstractServer<ManualServerInstanceHolder> {
  private final AtomicInteger instanceCounter = new AtomicInteger();

  ManualServer(ServerConfigurationHandle serverConfigurationHandle, String serverInfo,
      String address, DevAppServerImpl devAppServer,
      AppEngineWebXml appEngineWebXml) {
    super(serverConfigurationHandle, serverInfo, null, address, devAppServer,
        makeInstanceHolders(serverConfigurationHandle, appEngineWebXml));
  }

  private static List<ManualServerInstanceHolder> makeInstanceHolders(
      ServerConfigurationHandle serverConfigurationHandle, AppEngineWebXml appEngineWebXml) {
    String instancesString = appEngineWebXml.getManualScaling().getInstances();
    int instances = instancesString == null ? 0 : Integer.parseInt(instancesString);
    if (instances < 0) {
      throw new AppEngineConfigException("Invalid instances " + instances + " in file "
        + serverConfigurationHandle.getModule().getAppEngineWebXmlFile());
    }

    ImmutableList.Builder<ManualServerInstanceHolder> listBuilder = ImmutableList.builder();
    for (int ix = LocalEnvironment.MAIN_INSTANCE; ix < instances; ix++) {
      String serverName = serverConfigurationHandle.getModule().getServerName();
      InstanceStateHolder stateHolder = new InstanceStateHolder(serverName, ix);
      ContainerService containerService = ContainerUtils.loadContainer();
      InstanceHelper instanceHelper =
          new InstanceHelper(serverName, ix, stateHolder, containerService);
      listBuilder.add(new ManualServerInstanceHolder(serverName, containerService, ix, stateHolder,
          instanceHelper));
    }
    return listBuilder.build();
  }

  @Override
  public LocalServerEnvironment doConfigure(
      ServerConfigurationHandle serverConfigurationHandle, String serverInfo,
      File externalResourceDir, String address, Map<String, Object> containerConfigProperties,
      DevAppServerImpl devAppServer) throws Exception {
    LocalServerEnvironment result = null;
    for (ManualServerInstanceHolder instanceHolder : getInstanceHolders()) {
      int port = DevAppServerPortPropertyHelper.getPort(getServerName(),
          instanceHolder.getInstance(), devAppServer.getServiceProperties());
      LocalServerEnvironment thisEnvironment = instanceHolder.getContainerService().configure(
          serverInfo, address, port, serverConfigurationHandle, externalResourceDir,
          containerConfigProperties, instanceHolder.getInstance(), devAppServer);
      if (result == null) {
        result = thisEnvironment;
      }
    }
    return result;
  }

  @Override
  public int getInstanceCount() {
    return getInstanceHolders().size() - 1;
  }

  private ManualServerInstanceHolder getFirstMaybeAvailableInstanceHolder() {
    int instance = instanceCounter.getAndIncrement() % getInstanceCount();
    return getInstanceHolder(instance);
  }

  @Override
  public ManualServerInstanceHolder getAndReserveAvailableInstanceHolder() {
    ManualServerInstanceHolder result = null;
    for (ManualServerInstanceHolder instanceHolder : new Iterable<ManualServerInstanceHolder>() {
          @Override
          public Iterator<ManualServerInstanceHolder> iterator() {
            return new FromFirstMaybeAvailableInstanceIterator();
          }
        }) {
      if (instanceHolder.acquireServingPermit()) {
        result = instanceHolder;
        break;
      }
    }
    return result;
  }

  /**
   * Iterator for iterating through {@link InstanceHolder} values starting with
   * {@link #getFirstMaybeAvailableInstanceHolder}.
   */
  private class FromFirstMaybeAvailableInstanceIterator
      extends AbstractIterator<ManualServerInstanceHolder> {
    private static final int INVALID_INSTANCE_ID = -1;
    private int startInstanceId = INVALID_INSTANCE_ID;
    private int currentInstanceId = INVALID_INSTANCE_ID;

    @Override
    protected ManualServerInstanceHolder computeNext() {
      if (getInstanceCount() == 0) {
        endOfData();
        return null;
      }

      if (startInstanceId == INVALID_INSTANCE_ID) {
        ManualServerInstanceHolder instanceHolder = getFirstMaybeAvailableInstanceHolder();
        startInstanceId = instanceHolder.getInstance();
        currentInstanceId = startInstanceId;
        return instanceHolder;
      }

      int nextInstanceId = (currentInstanceId + 1) % getInstanceCount();
      if (nextInstanceId == startInstanceId) {
        endOfData();
        return null;
      } else {
        currentInstanceId = nextInstanceId;
        return getInstanceHolder(currentInstanceId);
      }
    }
  }
}

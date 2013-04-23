package com.google.appengine.tools.development;

import com.google.appengine.tools.development.ApplicationConfigurationManager.ServerConfigurationHandle;
import com.google.common.collect.ImmutableList;

import java.io.File;
import java.util.List;
import java.util.Map;

/**
 * {@link Server} implementation for automatic servers.
 */
class AutomaticServer extends AbstractServer<AutomaticServerInstanceHolder> {
  private final int devAppServerPort;

  /**
   * @param devAppServerPort port from the DevAppServerImple constructor for
   * the primary container and 0 otherwise.
   */
  AutomaticServer(ServerConfigurationHandle serverConfigurationHandle, String serverInfo,
      File externalResourceDir, String address, int devAppServerPort,
      DevAppServerImpl devAppServer) {
    super(serverConfigurationHandle, serverInfo, externalResourceDir, address,
      devAppServer, makeInstanceHolders());
    this.devAppServerPort = devAppServerPort;
  }

  private static List<AutomaticServerInstanceHolder> makeInstanceHolders() {
    return ImmutableList.of(new AutomaticServerInstanceHolder(ContainerUtils.loadContainer(),
        LocalEnvironment.MAIN_INSTANCE));
  }

  @Override
  public LocalServerEnvironment doConfigure(
      ServerConfigurationHandle serverConfigurationHandle, String serverInfo,
      File externalResourceDir, String address, Map<String, Object> containerConfigProperties,
      DevAppServerImpl devAppServer) throws Exception{
    int port = devAppServerPort;
    if (port == 0) {
      port = DevAppServerPortPropertyHelper.getPort(getServerName(),
          devAppServer.getServiceProperties());
     }
    return getInstanceHolders().get(0).getContainerService().configure(serverInfo, address, port,
        serverConfigurationHandle, externalResourceDir, containerConfigProperties,
        LocalEnvironment.MAIN_INSTANCE, devAppServer);
  }

  @Override
  public int getInstanceCount() {
    return 0;
  }
}

package com.google.appengine.tools.development;

import com.google.appengine.api.labs.servers.ServersServicePb.ServersServiceError;
import com.google.apphosting.api.ApiProxy;
import com.google.apphosting.api.ApiProxy.ApplicationException;
import com.google.apphosting.utils.config.AppEngineConfigException;
import com.google.apphosting.utils.config.AppEngineWebXml;
import com.google.apphosting.utils.config.AppEngineWebXml.ManualScaling;
import com.google.common.collect.ImmutableList;
import com.google.common.collect.ImmutableMap;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Manager for {@link DevAppServer} servers.
 *
 */
public class Servers implements ServersController, ServersFilterHelper {
  private final List<Server> servers;
  private final Map<String, Server> serverNameToServerMap;

  static Servers createServers(ApplicationConfigurationManager applicationConfigurationManager,
      String serverInfo, File externalResourceDir, String address, int port,
      DevAppServerImpl devAppServer) {
    ImmutableList.Builder<Server> builder = ImmutableList.builder();
    LocalServerEnvironment mainEnvironment = null;
    for (ApplicationConfigurationManager.ServerConfigurationHandle serverConfigurationHandle :
      applicationConfigurationManager.getServerConfigurationHandles()) {
      AppEngineWebXml appEngineWebXml =
          serverConfigurationHandle.getModule().getAppEngineWebXml();
      Server server = null;
      if (!appEngineWebXml.getBasicScaling().isEmpty()) {
        throw new AppEngineConfigException("Basic scaling servers are currently not supported");
      } else if (!appEngineWebXml.getManualScaling().isEmpty()) {
        server = new ManualServer(serverConfigurationHandle, serverInfo, address, devAppServer,
            appEngineWebXml);
      } else {
        server = new AutomaticServer(serverConfigurationHandle, serverInfo, externalResourceDir,
            address, port, devAppServer);
      }
      builder.add(server);

      port = 0;
      externalResourceDir = null;
    }
    return new Servers(builder.build());
  }

  void shutdown() throws Exception {
    for (Server server : servers) {
      server.shutdown();
    }
  }

  void configure(Map<String, Object>containerConfigProperties) throws Exception {
    for (Server server : servers) {
      server.configure(containerConfigProperties);
    }
  }

  void createConnections() throws Exception {
    for (Server server : servers) {
      server.createConnection();
    }
  }

  void startup() throws Exception {
    for (Server server : servers) {
      server.startup();
    }
  }

  Server getMainServer() {
    return servers.get(0);
  }

  private Servers(List<Server> servers) {
    if (servers.size() < 1) {
      throw new IllegalArgumentException("servers must not be empty.");
    }
    this.servers = servers;

    ImmutableMap.Builder<String, Server> mapBuilder = ImmutableMap.builder();
    for (Server server : this.servers) {
      mapBuilder.put(server.getServerName(), server);
    }
    serverNameToServerMap = mapBuilder.build();
  }

  LocalServerEnvironment getLocalServerEnvironment() {
    return servers.get(0).getLocalServerEnvironment();
  }

  Server getServer(String serverName) {
    return serverNameToServerMap.get(serverName);
  }

  @Override
  public Iterable<String> getServerNames() {
    return serverNameToServerMap.keySet();
  }

  @Override
  public Iterable<String> getVersions(String serverName) throws ApplicationException {
    return ImmutableList.of(getDefaultVersion(serverName));
  }

  @Override
  public String getDefaultVersion(String serverName) throws ApplicationException {
    Server server = getRequiredServer(serverName);
    return server.getMainContainer().getAppEngineWebXmlConfig().getMajorVersionId();
  }

  @Override
  public int getNumInstances(String serverName, String version) throws ApplicationException {
    Server server = getRequiredServer(serverName);
    checkVersion(version, server);
    ManualScaling manualScaling = getRequiredManualScaling(server);
    return Integer.parseInt(manualScaling.getInstances());
  }

  @Override
  public String getHostname(String serverName, String version, int instance)
      throws ApplicationException {
    Server server = getRequiredServer(serverName);
    checkVersion(version, server);
    if (instance != LocalEnvironment.MAIN_INSTANCE) {
      getRequiredManualScaling(server);
    }
    String hostAndPort = server.getHostAndPort(instance);
    if (hostAndPort == null) {
      throw new ApiProxy.ApplicationException(
          ServersServiceError.ErrorCode.INVALID_INSTANCES_VALUE,
          "Instance " + instance + " not found");
    }
    return hostAndPort;
  }

  private Server getRequiredServer(String serverName) {
    Server server = serverNameToServerMap.get(serverName);
    if (server == null) {
      throw new ApiProxy.ApplicationException(ServersServiceError.ErrorCode.INVALID_SERVER_VALUE,
          "Server not found");
    }
    return server;
  }

  private ManualScaling getRequiredManualScaling(Server server) {
    ManualScaling manualScaling =
        server.getMainContainer().getAppEngineWebXmlConfig().getManualScaling();
    if (manualScaling.isEmpty()) {
      throw new ApiProxy.ApplicationException(ServersServiceError.ErrorCode.INVALID_VERSION_VALUE,
          "Manual scaling is required.");
    }
    return manualScaling;
  }

  private void checkVersion(String version, Server server) {
    String serverVersion =
        server.getMainContainer().getAppEngineWebXmlConfig().getMajorVersionId();
    if (version == null || !version.equals(serverVersion)) {
      throw new ApiProxy.ApplicationException(ServersServiceError.ErrorCode.INVALID_VERSION_VALUE,
          "Version not found");
    }
  }

  @Override
  public boolean acquireServingPermit(
    String serverName, int instanceNumber, boolean allowQueueOnBackends) {
    Server server = getServer(serverName);
    InstanceHolder instanceHolder = server.getInstanceHolder(instanceNumber);
    return instanceHolder.acquireServingPermit();
  }

  @Override
  public int getAndReserveFreeInstance(String requestedServer) {
    Server server = getServer(requestedServer);
    InstanceHolder instanceHolder = server.getAndReserveAvailableInstanceHolder();
    return instanceHolder == null ? -1 : instanceHolder.getInstance();
  }

  @Override
  public void returnServingPermit(String serverName, int instance) {
  }

  @Override
  public boolean checkInstanceExists(String serverName, int instance) {
    Server server = getServer(serverName);
    return server != null && server.getInstanceHolder(instance) != null;
  }

  @Override
  public boolean checkServerExists(String serverName) {
     return getServer(serverName) != null;
  }

  @Override
  public boolean checkServerStopped(String serverName) {
    return false;
  }

  @Override
  public boolean checkInstanceStopped(String serverName, int instance) {
    return false;
  }

  @Override
  public void forwardToServer(String requestedServer, int instance, HttpServletRequest hrequest,
      HttpServletResponse hresponse) throws IOException, ServletException {
    Server server = getServer(requestedServer);
    InstanceHolder instanceHolder = server.getInstanceHolder(instance);
    instanceHolder.getContainerService().forwardToServer(hrequest, hresponse);
  }

  @Override
  public boolean isServerLoadBalancingServer(String serverName, int instance) {
    Server server = getServer(serverName);
    InstanceHolder instanceHolder = server.getInstanceHolder(instance);
    return instanceHolder.isServerLoadBalancingServer();
  }

  @Override
  public boolean expectsGeneratedStartRequests(String serverName,
      int instance) {
    Server server = getServer(serverName);
    InstanceHolder instanceHolder = server.getInstanceHolder(instance);
    return instanceHolder.expectsGeneratedStartRequest();
  }
}

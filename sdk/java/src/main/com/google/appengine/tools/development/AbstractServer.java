package com.google.appengine.tools.development;

import com.google.appengine.tools.development.ApplicationConfigurationManager.ServerConfigurationHandle;

import java.io.File;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.logging.Logger;

/**
 * Abstract super class for {@link Server} implementations.
 *
 * @param <I> An {@link InstanceHolder} type with needed server type specific
 * state which is available to the server's implementation but not reflected in the
 * {@link Server} interface.
 */
public abstract class AbstractServer<I extends InstanceHolder> implements Server {
   static final Logger LOGGER = Logger.getLogger(AbstractServer.class.getName());

  private final ServerConfigurationHandle serverConfigurationHandle;
  private final String serverInfo;
  private final File externalResourceDir;
  private final String address;
  private final DevAppServerImpl devAppServer;
  private final List<I> instancesHolders;

  private LocalServerEnvironment localServerEnvironment;

  protected AbstractServer(ServerConfigurationHandle serverConfigurationHandle,
      String serverInfo, File externalResourceDir, String address,
      DevAppServerImpl devAppServer,
      List<I> instances) {
    this.serverConfigurationHandle = serverConfigurationHandle;
    this.serverInfo = serverInfo;
    this.externalResourceDir = externalResourceDir;
    this.address = address;
    this.devAppServer = devAppServer;
    this.instancesHolders = new CopyOnWriteArrayList<I>(instances);
  }

  @Override
  public String getServerName() {
    return serverConfigurationHandle.getModule().getServerName();
  }

  protected List<I> getInstanceHolders() {
    return instancesHolders;
  }

  @Override
  public LocalServerEnvironment getLocalServerEnvironment() {
    return localServerEnvironment;
  }

  @Override
  public final void configure(Map<String, Object> containerConfigProperties) throws Exception {
    if (localServerEnvironment == null) {
        localServerEnvironment = doConfigure(serverConfigurationHandle, serverInfo,
            externalResourceDir, address, containerConfigProperties, devAppServer);
    }
  }

  @Override
  public void createConnection() throws Exception {
    for (I instanceHolder : instancesHolders) {
      ContainerService containerService = instanceHolder.getContainerService();
      containerService.createConnection();
     }
  }

  @Override
  public void startup() throws Exception {
    for (I instanceHolder : instancesHolders) {
      instanceHolder.startUp();
      String listeningHostAndPort = getHostAndPort(instanceHolder);
      if (instanceHolder.isMainInstance()) {
        LOGGER.info(String.format("Server %s is running at http://%s/", getServerName(),
            listeningHostAndPort));
      } else {
        LOGGER.info(String.format("Server %s instance %s is running at http://%s/",
            getServerName(), instanceHolder.getInstance(), listeningHostAndPort));
      }
      LOGGER.info("The admin console is running at http://" + listeningHostAndPort + "/_ah/admin");
    }
  }

  @Override
  public String getHostAndPort(int instance) {
    I instanceHolder = getInstanceHolder(instance);
    if (instanceHolder == null) {
      return null;
    } else {
      return getHostAndPort(instanceHolder);
    }
  }

  private String getHostAndPort(I instanceHolder) {
    ContainerService containerService = instanceHolder.getContainerService();
    String prettyAddress = containerService.getAddress();
    if (prettyAddress.equals("0.0.0.0") || prettyAddress.equals("127.0.0.1")) {
      prettyAddress = "localhost";
    }
    String listeningHostAndPort = prettyAddress + ":" + containerService.getPort();
    return listeningHostAndPort;
  }

  @Override
  public I getInstanceHolder(int instance) {
    if (instance < LocalEnvironment.MAIN_INSTANCE || instance + 1 > instancesHolders.size()) {
      return null;
    } else {
      return instancesHolders.get(instance + 1);
    }
  }

  @Override
  public void shutdown() throws Exception {
    for (I instanceHolder : instancesHolders) {
      instanceHolder.getContainerService().shutdown();
      if (instanceHolder.isMainInstance()) {
        LOGGER.info("Shutting down server " + getServerName());
      } else {
        LOGGER.info("Shutting down server " + getServerName() + " instance "
            + instanceHolder.getInstance());
      }
    }
  }

  @Override
  public ContainerService getMainContainer() {
    return instancesHolders.get(0).getContainerService();
  }

  @Override
  public I getAndReserveAvailableInstanceHolder() {
    throw new UnsupportedOperationException();
  }

  /**
   * Configures the containers for a {@link Server} and returns the
   * {@link LocalServerEnvironment} for the main container.
   */
  protected abstract LocalServerEnvironment doConfigure(
      ServerConfigurationHandle serverConfigurationHandle, String serverInfo,
      File externalResourceDir, String address, Map<String, Object> containerConfigProperties,
      DevAppServerImpl devAppServer) throws Exception;
}

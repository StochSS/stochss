// Copyright 2008 Google Inc. All Rights Reserved.

package com.google.appengine.tools.development;

import com.google.appengine.api.labs.servers.dev.LocalServersService;
import com.google.appengine.tools.development.EnvironmentVariableChecker.MismatchReportingPolicy;
import com.google.appengine.tools.info.SdkInfo;
import com.google.apphosting.api.ApiProxy;
import com.google.apphosting.api.ApiProxy.Environment;
import com.google.apphosting.utils.config.AppEngineConfigException;
import com.google.apphosting.utils.config.AppEngineWebXmlReader;
import com.google.apphosting.utils.config.EarHelper;
import com.google.common.base.Joiner;
import com.google.common.collect.ImmutableMap;
import com.google.common.collect.ImmutableSet;

import java.io.File;
import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.net.BindException;
import java.util.HashMap;
import java.util.Map;
import java.util.TimeZone;
import java.util.concurrent.ConcurrentHashMap;
import java.util.logging.ConsoleHandler;
import java.util.logging.Handler;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * {@code DevAppServer} launches a local Jetty server (by default) with a single
 * hosted web application.  It can be invoked from the command-line by
 * providing the path to the directory in which the application resides as the
 * only argument.
 *
 */
class DevAppServerImpl implements DevAppServer {
  public static final String SERVERS_FILTER_HELPER_PROPERTY =
      "com.google.appengine.tools.development.servers_filter_helper";
  private static final Logger logger = Logger.getLogger(DevAppServerImpl.class.getName());

  private final ApplicationConfigurationManager applicationConfigurationManager;
  private final Servers servers;
  private Map<String, String> serviceProperties = new HashMap<String, String>();
  private final Map<String, Object> containerConfigProperties;

  enum ServerState { INITIALIZING, RUNNING, STOPPING, SHUTDOWN }

  /**
   * The current state of the server.
   */
  private ServerState serverState = ServerState.INITIALIZING;

  /**
   * Contains the backend servers configured as part of the "Servers" feature.
   * Each backend server is started on a separate port and keep their own
   * internal state. Memcache, datastore, and other API services are shared by
   * all servers, including the "main" server.
   */
  private final BackendServers backendContainer;

  /**
   * The api proxy we created when we started the web containers. Not initialized until after
   * {@link #start()} is called.
   */
  private ApiProxyLocal apiProxyLocal;

  /**
   * We defer reporting construction time configuration exceptions until
   * {@link #start()} for compatibility.
   */
  private final AppEngineConfigException configurationException;

  /**
   * Constructs a development application server that runs the single
   * application located in the given directory.  The application is configured
   * via <webXmlLocation> and the {@link com.google.apphosting.utils.config.AppEngineWebXml}
   * instance returned by the provided {@link AppEngineWebXmlReader}.
   *
   * @param appDir The location of the application to run.
   * @param externalResourceDir If not {@code null}, a resource directory external to the appDir.
   *        This will be searched before appDir when looking for resources.
   * @param webXmlLocation The location of a file whose format complies with
   * http://java.sun.com/xml/ns/javaee/web-app_2_5.xsd.  If {@code null},
   * defaults to <appDir>/WEB-INF/web.xml
   * @param appEngineWebXmlLocation The name of the app engine config file.  If
   * {@code null}, defaults to <appDir>/WEB-INF/appengine-web.xml
   * @param address The address on which to run
   * @param port The port on which to run
   * @param useCustomStreamHandler If {@code true}, install
   * {@link StreamHandlerFactory}.  This is "normal" behavior for the dev app
   * server.
   * @param containerConfigProperties Additional properties used in the
   * configuration of the specific container implementation.
   */
  public DevAppServerImpl(File appDir, File externalResourceDir, File webXmlLocation,
      File appEngineWebXmlLocation, String address, int port, boolean useCustomStreamHandler,
      Map<String, Object> containerConfigProperties) {
    String serverInfo = ContainerUtils.getServerInfo();
    if (useCustomStreamHandler) {
      StreamHandlerFactory.install();
    }
    DevSocketImplFactory.install();

    backendContainer = BackendServers.getInstance();
    ApplicationConfigurationManager tempManager = null;
    try {
      if (EarHelper.isEar(appDir.getAbsolutePath())) {
        tempManager = ApplicationConfigurationManager.newEarConfigurationManager(appDir,
            SdkInfo.getLocalVersion().getRelease());
      } else {
        tempManager = ApplicationConfigurationManager.newWarConfigurationManager(
            appDir, appEngineWebXmlLocation, webXmlLocation, externalResourceDir,
            SdkInfo.getLocalVersion().getRelease());
      }
    } catch (AppEngineConfigException configurationException) {
      servers = null;
      applicationConfigurationManager = null;
      this.containerConfigProperties = null;
      this.configurationException = configurationException;
      return;
    }
    this.applicationConfigurationManager = tempManager;
    this.servers = Servers.createServers(applicationConfigurationManager, serverInfo,
        externalResourceDir, address, port, this);
    DelegatingServersFilterHelper serversFilterHelper =
        new DelegatingServersFilterHelper(backendContainer, servers);
    this.containerConfigProperties =
        ImmutableMap.<String, Object>builder()
        .putAll(containerConfigProperties)
        .put(SERVERS_FILTER_HELPER_PROPERTY, serversFilterHelper)
        .put(AbstractContainerService.PORT_MAPPING_PROVIDER_PROP, backendContainer)
        .build();
    backendContainer.init(address,
        applicationConfigurationManager.getPrimaryServerConfigurationHandle(),
        externalResourceDir, this.containerConfigProperties, this);
    configurationException = null;
  }

  /**
   * Sets the properties that will be used by the local services to
   * configure themselves. This method must be called before the server
   * has been started.
   *
   * @param properties a, maybe {@code null}, set of properties.
   *
   * @throws IllegalStateException if the server has already been started.
   */
  @Override
  public void setServiceProperties(Map<String,String> properties) {
    if (serverState != ServerState.INITIALIZING) {
      String msg = "Cannot set service properties after the server has been started.";
      throw new IllegalStateException(msg);
    }

    if (configurationException == null) {
      serviceProperties = new ConcurrentHashMap<String, String>(properties);
      backendContainer.setServiceProperties(properties);
    }
  }

  Map<String, String> getServiceProperties() {
    return serviceProperties;
  }

  /**
   * Starts the server.
   *
   * @throws IllegalStateException If the server has already been started or
   * shutdown.
   * @throws AppEngineConfigException If no WEB-INF directory can be found or
   * WEB-INF/appengine-web.xml does not exist.
   */
  @Override
  public void start() throws Exception {
    if (serverState != ServerState.INITIALIZING) {
      throw new IllegalStateException("Cannot start a server that has already been started.");
    }

    reportDeferredConfigurationException();

    initializeLogging();
    servers.configure(containerConfigProperties);
    try {
      servers.createConnections();
    } catch (BindException ex) {
      System.err.println();
      System.err.println("************************************************");
      System.err.println("Could not open the requested socket: " + ex.getMessage());
      System.err.println("Try overriding --address and/or --port.");
      System.exit(2);
    }

    ApiProxyLocalFactory factory = new ApiProxyLocalFactory();
    apiProxyLocal = factory.create(servers.getLocalServerEnvironment());
    setInboundServicesProperty();
    apiProxyLocal.setProperties(serviceProperties);
    ApiProxy.setDelegate(apiProxyLocal);
    LocalServersService localServersService =
        (LocalServersService) apiProxyLocal.getService(LocalServersService.PACKAGE);
    localServersService.setServersControler(servers);
    TimeZone currentTimeZone = null;
    try {
      currentTimeZone = setServerTimeZone();
      backendContainer.configureAll(apiProxyLocal);
      servers.startup();
      Server mainServer = servers.getMainServer();
      Map<String, String> portMapping = backendContainer.getPortMapping();
      AbstractContainerService.installLocalInitializationEnvironment(
          mainServer.getMainContainer().getAppEngineWebXmlConfig(), LocalEnvironment.MAIN_INSTANCE,
          getPort(), null, -1, portMapping);
      backendContainer.startupAll(apiProxyLocal);
    } finally {
      ApiProxy.clearEnvironmentForCurrentThread();
      restoreLocalTimeZone(currentTimeZone);
    }
    serverState = ServerState.RUNNING;
    logger.info("Dev App Server is now running");
  }

  public void setInboundServicesProperty() {
    ImmutableSet.Builder<String> setBuilder = ImmutableSet.builder();
    for (ApplicationConfigurationManager.ServerConfigurationHandle serverConfigurationHandle :
      applicationConfigurationManager.getServerConfigurationHandles()) {
      setBuilder.addAll(
          serverConfigurationHandle.getModule().getAppEngineWebXml().getInboundServices());
    }

    serviceProperties.put("appengine.dev.inbound-services",
        Joiner.on(",").useForNull("null").join(setBuilder.build()));
  }

  /**
   * Change the TimeZone for the current thread. By calling this method before
   * {@link ContainerService#startup()} start}, we set the default TimeZone for the
   * DevAppServer and all of its related services.
   *
   * @return the previously installed ThreadLocal TimeZone
   */
  private TimeZone setServerTimeZone() {
    String sysTimeZone = serviceProperties.get("appengine.user.timezone.impl");
    if (sysTimeZone != null && sysTimeZone.trim().length() > 0) {
      return null;
    }

    TimeZone utc = TimeZone.getTimeZone("UTC");
    assert utc.getID().equals("UTC") : "Unable to retrieve the UTC TimeZone";

    try {
      Field f = TimeZone.class.getDeclaredField("defaultZoneTL");
      f.setAccessible(true);
      ThreadLocal<?> tl = (ThreadLocal<?>) f.get(null);
      Method getZone = ThreadLocal.class.getMethod("get");
      TimeZone previousZone = (TimeZone) getZone.invoke(tl);
      Method setZone = ThreadLocal.class.getMethod("set", Object.class);
      setZone.invoke(tl, utc);
      return previousZone;
    } catch (Exception e) {
      try {
        Method getZone = TimeZone.class.getDeclaredMethod("getDefaultInAppContext");
        getZone.setAccessible(true);
        TimeZone previousZone = (TimeZone) getZone.invoke(null);
        Method setZone = TimeZone.class.getDeclaredMethod("setDefaultInAppContext", TimeZone.class);
        setZone.setAccessible(true);
        setZone.invoke(null, utc);
        return previousZone;
      } catch (Exception ex) {
        throw new RuntimeException("Unable to set the TimeZone to UTC", ex);
      }
    }
  }

  /**
   * Restores the ThreadLocal TimeZone to {@code timeZone}.
   */
  private void restoreLocalTimeZone(TimeZone timeZone) {
    String sysTimeZone = serviceProperties.get("appengine.user.timezone.impl");
    if (sysTimeZone != null && sysTimeZone.trim().length() > 0) {
      return;
    }

    try {
      Field f = TimeZone.class.getDeclaredField("defaultZoneTL");
      f.setAccessible(true);
      ThreadLocal<?> tl = (ThreadLocal<?>) f.get(null);
      Method setZone = ThreadLocal.class.getMethod("set", Object.class);
      setZone.invoke(tl, timeZone);
    } catch (Exception e) {
      try {
        Method setZone = TimeZone.class.getDeclaredMethod("setDefaultInAppContext", TimeZone.class);
        setZone.setAccessible(true);
        setZone.invoke(null, timeZone);
      } catch (Exception ex) {
        throw new RuntimeException("Unable to restore the previous TimeZone", ex);
      }
    }
  }

  @Override
  public void restart() throws Exception {
    if (serverState != ServerState.RUNNING) {
      throw new IllegalStateException("Cannot restart a server that is not currently running.");
    }
    servers.shutdown();
    backendContainer.shutdownAll();
    servers.createConnections();
    backendContainer.configureAll(apiProxyLocal);
    servers.startup();
    backendContainer.startupAll(apiProxyLocal);
  }

  @Override
  public void shutdown() throws Exception {
    if (serverState != ServerState.RUNNING) {
      throw new IllegalStateException("Cannot shutdown a server that is not currently running.");
    }
    servers.shutdown();
    backendContainer.shutdownAll();
    ApiProxy.setDelegate(null);
    apiProxyLocal = null;
    serverState = ServerState.SHUTDOWN;
  }

  @Override
  public int getPort() {
    reportDeferredConfigurationException();
    return servers.getMainServer().getMainContainer().getPort();
  }

  protected void reportDeferredConfigurationException() {
    if (configurationException != null) {
      throw new AppEngineConfigException("Invalid configuration", configurationException);
    }
  }

  @Override
  public AppContext getAppContext() {
    reportDeferredConfigurationException();
    return servers.getMainServer().getMainContainer().getAppContext();
  }

  @Override
  public AppContext getCurrentAppContext() {
    AppContext result = null;
    Environment env = ApiProxy.getCurrentEnvironment();
    if (env != null && env.getVersionId() != null) {
      String serverName = LocalEnvironment.getServerName(env.getVersionId());
      result = servers.getServer(serverName).getMainContainer().getAppContext();
    }
    return result;
  }

  @Override
  public void setThrowOnEnvironmentVariableMismatch(boolean throwOnMismatch) {
    if (configurationException == null) {
      applicationConfigurationManager.setEnvironmentVariableMismatchReportingPolicy(
          throwOnMismatch ? MismatchReportingPolicy.EXCEPTION : MismatchReportingPolicy.LOG);
    }
  }

  /**
   * We're happy with the default logging behavior, which is to
   * install a {@link ConsoleHandler} at the root level.  The only
   * issue is that we want its level to be FINEST to be consistent
   * with our runtime environment.
   *
   * <p>Note that this does not mean that any fine messages will be
   * logged by default -- each Logger still defaults to INFO.
   * However, it is sufficient to call {@link Logger#setLevel(Level)}
   * to adjust the level.
   */
  private void initializeLogging() {
    for (Handler handler : Logger.getLogger("").getHandlers()) {
      if (handler instanceof ConsoleHandler) {
        handler.setLevel(Level.FINEST);
      }
    }
  }

  ServerState getServerState() {
    return serverState;
  }
}

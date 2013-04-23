// Copyright 2008 Google Inc. All Rights Reserved.

package com.google.appengine.tools.development;

import static com.google.appengine.tools.development.LocalEnvironment.DEFAULT_VERSION_HOSTNAME;

import com.google.appengine.api.backends.BackendService;
import com.google.appengine.api.log.dev.LocalLogService;
import com.google.appengine.tools.development.ApplicationConfigurationManager.ServerConfigurationHandle;
import com.google.appengine.tools.info.SdkImplInfo;
import com.google.apphosting.api.ApiProxy;
import com.google.apphosting.api.ApiProxy.Environment;
import com.google.apphosting.utils.config.AppEngineWebXml;
import com.google.apphosting.utils.config.ClassPathBuilder;
import com.google.apphosting.utils.config.WebModule;
import com.google.apphosting.utils.config.WebXml;
import com.google.common.base.Joiner;
import com.google.common.collect.ImmutableMap;

import java.io.File;
import java.io.IOException;
import java.net.InetAddress;
import java.net.URL;
import java.net.UnknownHostException;
import java.security.Permissions;
import java.util.Collection;
import java.util.Collections;
import java.util.Map;
import java.util.concurrent.CountDownLatch;
import java.util.logging.Handler;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.annotation.concurrent.GuardedBy;

/**
 * Common implementation for the {@link ContainerService} interface.
 *
 * There should be no reference to any third-party servlet container from here.
 *
 */
abstract class AbstractContainerService implements ContainerService {

  private static final Logger log = Logger.getLogger(AbstractContainerService.class.getName());

  protected static final String _AH_URL_RELOAD = "/_ah/reloadwebapp";

  private static final String USER_CODE_CLASSPATH_MANAGER_PROP =
      "devappserver.userCodeClasspathManager";

  private static final String USER_CODE_CLASSPATH = USER_CODE_CLASSPATH_MANAGER_PROP + ".classpath";
  private static final String USER_CODE_REQUIRES_WEB_INF =
      USER_CODE_CLASSPATH_MANAGER_PROP + ".requiresWebInf";

  static final String PORT_MAPPING_PROVIDER_PROP = "devappserver.portMappingProvider";

  protected ServerConfigurationHandle serverConfigurationHandle;
  protected String devAppServerVersion;
  protected File appDir;
  protected File externalResourceDir;

  /**
   * The location of web.xml.  If not provided, defaults to
   * <appDir>/WEB-INF/web.xml
   */
  protected File webXmlLocation;

  /**
   * The hostname on which the server is listening for http requests.
   */
  protected String hostName;

  /**
   * The network address on which the server is listening for http requests.
   */
  protected String address;

  /**
   * The port on which the server is listening for http requests.
   */
  protected int port;

  /**
   * The 0 based index for this instance or {@link LocalEnvironment#MAIN_INSTANCE}.
   */
  protected int instance;

  /**
   * A reference to the parent DevAppServer that configured this container.
   */
  protected DevAppServer devAppServer;

  protected AppEngineWebXml appEngineWebXml;

  protected WebXml webXml;

  private String backendName;

  private int backendInstance;

  private PortMappingProvider portMappingProvider = new PortMappingProvider() {
    @Override
    public Map<String, String> getPortMapping() {
      return Collections.emptyMap();
    }
  };

  @GuardedBy("AbstractContainerService.class")
  private static SystemPropertiesManager systemPropertiesManager;

  /**
   * Latch that will open once the server is fully initialized.
   * TODO(user): This is used by some services but only for the
   * default instance of the default server. Investigate. Does server
   * start/stop cause issues? There is some issue with tasks during
   * Servlet initialization.
   */
  private CountDownLatch serverInitLatch;

  /**
   * Not initialized until {@link #startup()} has been called.
   */
  protected ApiProxyLocal apiProxyLocal;

  protected UserCodeClasspathManager userCodeClasspathManager;

  protected ServersFilterHelper serversFilterHelper;

  @Override
  public final LocalServerEnvironment configure(String devAppServerVersion, final String address,
      int port, final ServerConfigurationHandle serverConfigurationHandle, File externalResourceDir,
      Map<String, Object> containerConfigProperties, int instance, DevAppServer devAppServer) {
    this.devAppServerVersion = devAppServerVersion;
    this.serverConfigurationHandle = serverConfigurationHandle;
    extractFieldsFromWebModule(serverConfigurationHandle.getModule());
    this.externalResourceDir = externalResourceDir;
    this.address = address;
    this.port = port;
    this.serverInitLatch = new CountDownLatch(1);
    this.hostName = "localhost";
    this.devAppServer = devAppServer;
    if ("0.0.0.0".equals(address)) {
      try {
        InetAddress localhost = InetAddress.getLocalHost();
        this.hostName = localhost.getHostName();
      } catch (UnknownHostException ex) {
        log.log(Level.WARNING,
            "Unable to determine hostname - defaulting to localhost.");
      }
    }

    this.userCodeClasspathManager = newUserCodeClasspathProvider(containerConfigProperties);
    this.serversFilterHelper = (ServersFilterHelper)
        containerConfigProperties.get(DevAppServerImpl.SERVERS_FILTER_HELPER_PROPERTY);
    this.backendName =
        (String) containerConfigProperties.get(BackendService.BACKEND_ID_ENV_ATTRIBUTE);
    Object rawBackendInstance =
        containerConfigProperties.get(BackendService.INSTANCE_ID_ENV_ATTRIBUTE);
    this.backendInstance =
        rawBackendInstance == null ? -1 : ((Integer) rawBackendInstance).intValue();
    PortMappingProvider callersPortMappingProvider =
        (PortMappingProvider) containerConfigProperties.get(PORT_MAPPING_PROVIDER_PROP);
    if (callersPortMappingProvider == null) {
      log.warning("Null value for containerConfigProperties.get("
          + PORT_MAPPING_PROVIDER_PROP + ")");
    } else {
      this.portMappingProvider = callersPortMappingProvider;
    }

    this.instance = instance;

    return new LocalServerEnvironment() {
      @Override
      public File getAppDir() {
        return serverConfigurationHandle.getModule().getApplicationDirectory();
      }

      @Override
      public String getAddress() {
        return address;
      }

      @Override
      public String getHostName() {
        return hostName;
      }

      @Override
      public int getPort() {
        return AbstractContainerService.this.port;
      }

      @Override
      public void waitForServerToStart() throws InterruptedException {
        serverInitLatch.await();
      }

      @Override
      public boolean simulateProductionLatencies() {
        return false;
      }

      @Override
      public boolean enforceApiDeadlines() {
        return !Boolean.getBoolean("com.google.appengine.disable_api_deadlines");
      }
    };
  }

  /**
   * @param webModule
   */
  protected void extractFieldsFromWebModule(WebModule webModule) {
    this.appDir = webModule.getApplicationDirectory();
    this.webXml = webModule.getWebXml();
    this.webXmlLocation = webModule.getWebXmlFile();
    this.appEngineWebXml = webModule.getAppEngineWebXml();
  }

  /**
   * Constructs a {@link UserCodeClasspathManager} from the given properties.
   */
  private static UserCodeClasspathManager newUserCodeClasspathProvider(
      Map<String, Object> containerConfigProperties) {
    if (containerConfigProperties.containsKey(USER_CODE_CLASSPATH_MANAGER_PROP)) {
      @SuppressWarnings("unchecked")
      final Map<String, Object> userCodeClasspathManagerProps =
          (Map<String, Object>) containerConfigProperties.get(USER_CODE_CLASSPATH_MANAGER_PROP);
      return new UserCodeClasspathManager() {
        @SuppressWarnings("unchecked")
        @Override
        public Collection<URL> getUserCodeClasspath(File root) {
          return (Collection<URL>) userCodeClasspathManagerProps.get(USER_CODE_CLASSPATH);
        }

        @Override
        public boolean requiresWebInf() {
          return (Boolean) userCodeClasspathManagerProps.get(USER_CODE_REQUIRES_WEB_INF);
        }
      };
    }
    return new WebAppUserCodeClasspathManager();
  }

  protected void installLoggingServiceHandler() {
    Logger root = Logger.getLogger("");

    ApiProxyLocal proxy = (ApiProxyLocal) ApiProxy.getDelegate();
    LocalLogService logService = (LocalLogService) proxy.getService(LocalLogService.PACKAGE);
    root.addHandler(logService.getLogHandler());

    Handler[] handlers = root.getHandlers();
    if (handlers != null) {
      for (Handler handler : handlers) {
        handler.setLevel(Level.FINEST);
      }
    }
  }

  @Override
  public final void createConnection() throws Exception {
    connectContainer();
  }

  @Override
  public final void startup() throws Exception {
    apiProxyLocal = (ApiProxyLocal) ApiProxy.getDelegate();
    Environment prevEnvironment = ApiProxy.getCurrentEnvironment();
    try {
      initContext();
      installLoggingServiceHandler();
      if (appEngineWebXml == null) {
        throw new IllegalStateException("initContext failed to initialize appEngineWebXml.");
      }

      startContainer();
      startHotDeployScanner();
      serverInitLatch.countDown();
    } finally {
      ApiProxy.setEnvironmentForCurrentThread(prevEnvironment);
    }
  }

  @Override
  public final void shutdown() throws Exception {
    stopHotDeployScanner();
    stopContainer();
    serverConfigurationHandle.restoreSystemProperties();
  }

  @Override
  public Map<String, String> getServiceProperties() {
    return ImmutableMap.of("appengine.dev.inbound-services",
        Joiner.on(",").useForNull("null").join(appEngineWebXml.getInboundServices()));
  }

  /**
   * Set up the webapp context in a container specific way.
   * <p>Note that {@link #initContext()} is required to call
   * {@link #installLocalInitializationEnvironment()} for the service to be correctly
   * initialized.
   *
   * @return the effective webapp directory.
   */
  protected abstract File initContext() throws IOException;

  /**
   * Creates the servlet container's network connections.
   */
  protected abstract void connectContainer() throws Exception;

  /**
   * Start up the servlet container runtime.
   */
  protected abstract void startContainer() throws Exception;

  /**
   * Stop the servlet container runtime.
   */
  protected abstract void stopContainer() throws Exception;

  /**
   * Start up the hot-deployment scanner.
   */
  protected abstract void startHotDeployScanner() throws Exception;

  /**
   * Stop the hot-deployment scanner.
   */
  protected abstract void stopHotDeployScanner() throws Exception;

  /**
   * Re-deploy the current webapp context in a container specific way,
   * while taking into account possible appengine-web.xml change too,
   * without restarting the server.
   */
  protected abstract void reloadWebApp() throws Exception;

  @Override
  public String getAddress() {
    return address;
  }

  @Override
  public AppEngineWebXml getAppEngineWebXmlConfig(){
    return appEngineWebXml;
  }

  @Override
  public int getPort() {
    return port;
  }

  @Override
  public String getHostName() {
    return hostName;
  }

  protected Permissions getUserPermissions() {
    return appEngineWebXml.getUserPermissions();
  }

  /**
   * Installs a {@link LocalInitializationEnvironment} with
   * {@link ApiProxy#setEnvironmentForCurrentThread}.
   * <p>
   * Filters and servlets get initialized when we call server.start(). If any of
   * those filters and servlets need access to the current execution environment
   * they'll call ApiProxy.getCurrentEnvironment(). We set a special initialization
   * environment so that there is an environment available when this happens.
   * <p>
   * This depends on port which may not be set to its final value until{@link #connectContainer()}
   * is called.
   */
  protected void installLocalInitializationEnvironment() {
    installLocalInitializationEnvironment(appEngineWebXml, instance, port, backendName,
        backendInstance, portMappingProvider.getPortMapping());
  }

  /** Returns {@code true} if appengine-web.xml <sessions-enabled> is true. */
  protected boolean isSessionsEnabled() {
    return appEngineWebXml.getSessionsEnabled();
  }

  /**
   * Gets all of the URLs that should be added to the classpath for an
   * application located at {@code root}.
   */
  protected URL[] getClassPathForApp(File root) {
    ClassPathBuilder classPathBuilder =
        new ClassPathBuilder(appEngineWebXml.getClassLoaderConfig());

    classPathBuilder.addUrls(SdkImplInfo.getAgentRuntimeLibs());

    classPathBuilder.addUrls(userCodeClasspathManager.getUserCodeClasspath(root));
    classPathBuilder.addUrls(SdkImplInfo.getUserJspLibs());
    classPathBuilder.addUrls(SdkImplInfo.getWebApiToolLibs());
    return getUrls(classPathBuilder);
  }

  private static URL[] getUrls(ClassPathBuilder classPathBuilder) {
    URL[] urls = classPathBuilder.getUrls();
    String message = classPathBuilder.getLogMessage();
    if (!message.isEmpty()) {
      log.warning(message);
    }
    return urls;
  }

  /**
   * Sets up an {@link com.google.apphosting.api.ApiProxy.Environment} for container
   * initialization.
   */
  static void installLocalInitializationEnvironment(AppEngineWebXml appEngineWebXml, int instance,
      int defaultVersionMainPort, String backendName, int backendInstance,
      Map<String, String> portMapping) {
    Environment environment = new LocalInitializationEnvironment(
        appEngineWebXml.getAppId(), WebModule.getServerName(appEngineWebXml),
        appEngineWebXml.getMajorVersionId(), instance);
    environment.getAttributes().put(DEFAULT_VERSION_HOSTNAME, "localhost:"
        + defaultVersionMainPort);
    ApiProxy.setEnvironmentForCurrentThread(environment);
    DevAppServerServersFilter.injectBackendServiceCurrentApiInfo(backendName, backendInstance,
        portMapping);
  }

  /**
   * A fake {@link LocalEnvironment} implementation that is used during the
   * initialization of the Development AppServer.
   */
  public static class LocalInitializationEnvironment extends LocalEnvironment {
    public LocalInitializationEnvironment(String appId, String serverName, String majorVersionId,
        int instance) {
      super(appId, serverName, majorVersionId, instance, null);
    }

    @Override
    public String getEmail() {
      return null;
    }

    @Override
    public boolean isLoggedIn() {
      return false;
    }

    @Override
    public boolean isAdmin() {
      return false;
    }
  }

  /**
   * Provider for the 'portMapping'.
   * <p>
   * The provided map contains an entry for every backend instance.
   * For the main instance the key is the backend name and the value is
   * the hostname:port for sending http requests to the instance (i.e.
   * bob->127.0.0.1:1234). For other instances the key is
   * instance-id.hostname and the value is again the hostname:port for
   * sending http requests to the instance (i.e. 2.bob->127.0.0.1:1234).
   */
  interface PortMappingProvider {
    Map<String, String> getPortMapping();
  }
}

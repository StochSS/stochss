package com.google.appengine.tools.development;

import com.google.appengine.tools.development.EnvironmentVariableChecker.MismatchReportingPolicy;
import com.google.apphosting.utils.config.AppEngineConfigException;
import com.google.apphosting.utils.config.AppEngineWebXml;
import com.google.apphosting.utils.config.BackendsXml;
import com.google.apphosting.utils.config.BackendsXmlReader;
import com.google.apphosting.utils.config.BackendsYamlReader;
import com.google.apphosting.utils.config.EarHelper;
import com.google.apphosting.utils.config.EarInfo;
import com.google.apphosting.utils.config.WebModule;
import com.google.common.collect.ImmutableList;
import com.google.common.collect.ImmutableSortedSet;

import java.io.File;
import java.util.List;
import java.util.Set;
import java.util.logging.Logger;

import javax.annotation.concurrent.GuardedBy;

/**
 * Manager for an application's configuration. Supports both single WAR
 * directory configurations and EAR directory configurations. Also includes
 * support for rereading configurations.
 * <p>
 */
public class ApplicationConfigurationManager {
  private static final Logger LOGGER =
      Logger.getLogger(ApplicationConfigurationManager.class.getName());

  private final File configurationRoot;
  private final SystemPropertiesManager systemPropertiesManager;
  private final String sdkRelease;
  @GuardedBy("this")
  private MismatchReportingPolicy environmentVariableMismatchReportingPolicy =
    MismatchReportingPolicy.EXCEPTION;
  @GuardedBy("this")
  private final List<ServerConfigurationHandle> serverConfigurationHandles;

  /**
   * Creates a new {@link ApplicationConfigurationManager} from an EAR directory.
   */
  static ApplicationConfigurationManager newEarConfigurationManager(File earRoot,
      String sdkVersion)
      throws AppEngineConfigException {
    if (!EarHelper.isEar(earRoot.getAbsolutePath())) {
      String message = String.format(
          "ApplicationConfigurationManager.newEarConfigurationManager passed an invalid EAR: %s",
          earRoot.getAbsolutePath());
      LOGGER.severe(message);
      throw new AppEngineConfigException(message);
    }
    return new ApplicationConfigurationManager(earRoot, null, null, null, sdkVersion);
  }

  /**
   * Creates a new {@link ApplicationConfigurationManager} from a WAR directory.
   * <p>
   * @param warRoot The location of the war directory.
   * @param externalResourceDirectory If not {@code null}, a resource directory external
   *        to the applicationDirectory. This will be searched before
   *        applicationDirectory when looking for resources.
   * @param webXmlLocation The location of a file whose format complies with
   *        http://java.sun.com/xml/ns/javaee/web-app_2_5.xsd.  If null we will use
   *        <appDir>/WEB-INF/web.xml.
   * @param appEngineWebXmlLocation The location of the app engine config file.
   *        If null we will use <appDir>/WEB-INF/appengine-web.xml.
   * @param sdkRelease The sdk version (SdkInfo.getLocalVersion().getRelease()).
   */
  static ApplicationConfigurationManager newWarConfigurationManager(File warRoot,
      File appEngineWebXmlLocation, File webXmlLocation, File externalResourceDirectory,
      String sdkRelease) throws AppEngineConfigException {
    if (EarHelper.isEar(warRoot.getAbsolutePath())) {
      String message = String.format(
          "ApplicationConfigurationManager.newWarConfigurationManager passed an EAR: %s",
          warRoot.getAbsolutePath());
      LOGGER.severe(message);
      throw new AppEngineConfigException(message);
    }
    return new ApplicationConfigurationManager(warRoot,
        appEngineWebXmlLocation, webXmlLocation, externalResourceDirectory, sdkRelease);
  }

  /**
   * Returns the {@link ServerConfigurationHandle} for the primary server which
   * will be the only server for configurations read from a single WAR directory
   * or the first server in applicationDirectory/META-INF/application.xml
   * module order for configurations read from an EAR directory.
   */
  ServerConfigurationHandle getPrimaryServerConfigurationHandle() {
    return serverConfigurationHandles.get(0);
  }

  /**
   * Returns {@link List} with a {@link ServerConfigurationHandle} for each
   * configured server.
   * <p>
   * The returned list is immutable.
   */
  List<ServerConfigurationHandle> getServerConfigurationHandles() {
    return serverConfigurationHandles;
  }

  /**
   * Constructs an {@link ApplicationConfigurationManager} by reading the
   * configuration from an exploded WAR directory or EAR directory.
   *
   * @param configurationRoot the root directory for the applications EAR or WAR.
   * @param appEngineWebXmlLocation for a WAR configuration a non null value
   *   overrides the default of configurationRoot/WEB-INF/appengine-web.xml and
   *   ignored for an EAR configuration.
   * @param webXmlLocation for a WAR configuration a non null value
   *   overrides the default of configurationRoot/WEB-INF/web.xml and ignored
   *   for an EAR configuration.
   * @param externalResourceDirectory for a WAR configuration the optional
   *   external resource directory or null and ignored for an EAR configuration.
   * @param sdkRelease the SDK verison string.
   */
  private ApplicationConfigurationManager(File configurationRoot, File appEngineWebXmlLocation,
      File webXmlLocation, File externalResourceDirectory, String sdkRelease) {
    this.configurationRoot  = configurationRoot;
    this.systemPropertiesManager = new SystemPropertiesManager();
    this.sdkRelease = sdkRelease;
    if (EarHelper.isEar(configurationRoot.getAbsolutePath())) {
      EarInfo earInfo = readEarConfiguration();
      ImmutableList.Builder<ServerConfigurationHandle> builder = ImmutableList.builder();
      for (WebModule module : earInfo.getWebModules()) {
        builder.add(new EarServerConfigurationHandle(module));
      }
      serverConfigurationHandles = builder.build();
    } else {
      ServerConfigurationHandle warConfigurationHandle = new WarServerConfigurationHandle(
          appEngineWebXmlLocation, webXmlLocation, externalResourceDirectory);
      warConfigurationHandle.readConfiguration();
      serverConfigurationHandles = ImmutableList.of(warConfigurationHandle);
    }
  }

  /**
   * Performs various validations and registers logging configuration and
   * system properties for a {@link WebModule} so they may be combined with
   * values from other modules to construct an applications runtime
   * configuration.
   * <p>
   * Though this function provides little or no real abstraction and badly
   * fails the 'does one thing' test it avoids some code duplication..
   *
   * @param module module
   * @param loggingConfigurationManager for validating and combining the
   *     the applications logging configuration.
   * @param externalResourceDirectory the externalResourceDirectory for
   *     obtaining logging configuration.
   */
  private synchronized void validateAndRegisterGlobalValues(WebModule module,
      LoggingConfigurationManager loggingConfigurationManager,
      File externalResourceDirectory) {
    module.getWebXml().validate();
    AppEngineWebXml appEngineWebXml = module.getAppEngineWebXml();
    loggingConfigurationManager.read(systemPropertiesManager.getOriginalSystemProperties(),
        appEngineWebXml.getSystemProperties(), module.getApplicationDirectory(),
        externalResourceDirectory);
    systemPropertiesManager.setSystemProperties(appEngineWebXml, module.getAppEngineWebXmlFile());
  }

  /**
   * Reads or rereads an application's EAR configuration, performs validations,
   * and calculate the application's logging configuration and system
   * properties.
   * @return the {@link EarInfo} for the configuration.
   */
  private synchronized EarInfo readEarConfiguration() {
    if (!EarHelper.isEar(configurationRoot.getAbsolutePath())) {
      String message = String.format("Unsupported update from EAR to WAR for: %s",
          configurationRoot.getAbsolutePath());
      LOGGER.severe(message);
      throw new AppEngineConfigException(message);
    }
    EarInfo earInfo = EarHelper.readEarInfo(configurationRoot.getAbsolutePath());
    String majorVersionId = null;
    LoggingConfigurationManager loggingConfigurationManager = new LoggingConfigurationManager();
    for (WebModule module : earInfo.getWebModules()) {
      module.getWebXml().validate();
      AppEngineWebXml appEngineWebXml = module.getAppEngineWebXml();
      if (majorVersionId == null) {
        majorVersionId = appEngineWebXml.getMajorVersionId();
      }
      validateAndRegisterGlobalValues(module, loggingConfigurationManager, null);
    }
    systemPropertiesManager.setAppengineSystemProperties(sdkRelease,
        earInfo.getAppengineApplicationXml().getApplicationId(), majorVersionId);
    loggingConfigurationManager.updateLoggingConfiguration();
    return earInfo;
  }

  /**
   * Checks that the applications combined environment variables are consistent
   * and reports inconsistencies based on {@link
   * #getEnvironmentVariableMismatchReportingPolicy}.
   */
  private synchronized void checkEnvironmentVariables() {
    EnvironmentVariableChecker environmentVariableChecker =
        new EnvironmentVariableChecker(environmentVariableMismatchReportingPolicy);
    for (ServerConfigurationHandle serverConfigurationHandle : serverConfigurationHandles) {
      WebModule module = serverConfigurationHandle.getModule();
      environmentVariableChecker.add(module.getAppEngineWebXml(), module.getAppEngineWebXmlFile());
    }
    environmentVariableChecker.check();
  }

  synchronized void setEnvironmentVariableMismatchReportingPolicy(
      MismatchReportingPolicy environmentVariableMismatchReportingPolicy) {
     this.environmentVariableMismatchReportingPolicy = environmentVariableMismatchReportingPolicy;
  }

  synchronized MismatchReportingPolicy getEnvironmentVariableMismatchReportingPolicy() {
    return this.environmentVariableMismatchReportingPolicy;
  }

  @Override
  public synchronized String toString() {
    return "ApplicationConfigurationManager: configurationRoot="  + configurationRoot
        + " systemPropertiesManager=" + systemPropertiesManager
        + " sdkVersion=" + sdkRelease
        + " environmentVariableMismatchReportingPolicy="
        + environmentVariableMismatchReportingPolicy
        + " serverConfigurationHandles=" + serverConfigurationHandles;
  }

  /**
   * Handle for accessing and rereading a server configuration.
   * <p>
   * A WAR configuration supports a single server with additional
   * backends specified in war/WEB-INF/backends.xml. All instances
   * of the single server and all backends instances share a single
   * {@link ServerConfigurationHandle} so updates made by a call to
   * {@link #readConfiguration()} will be visible to all server and backend
   * instances. An EAR configuration supports multiple servers. All instances
   * of a server share a single {@link ServerConfigurationHandle} so updates
   * made by a call to {@link #readConfiguration()} for a particular server are
   * visible to all instances of the server.
   * <p>
   * To control when changes become visible clients should keep and refresh
   * references to values which will be replaced when the configuration is
   * reread including {@link #getModule()} and for WAR configurations
   * {@link #getBackendsXml()}.
   * <p>
   * Implementations synchronize operations that read or write state
   * that may be changed by {@link #readConfiguration()} on
   * ApplicationConfigurationManager.this. Note that configuration updates
   * involving edits to multiple configuration files are not guaranteed to be
   * atomic in the case {@link #readConfiguration()} is called after one write
   * and before another during a multi-write configuration change. Given this
   * and that backends are about to be deprecated, no synchronized operation
   * is provided for a client to obtain the combined values returned by calling
   * {@link #getModule()} and then calling {@link #getBackendsXml()}.
   */
  interface ServerConfigurationHandle {
    /**
     * Returns the {@link WebModule} for this configuration.
     */
    WebModule getModule();
    /**
     * Checks if the configuration specifies environment variables that do not
     * match the JVM's environment variables.
     * <p>
     * This check is broken out rather than implemented during construction for
     * backwards compatibility. The check is deferred until {@link DevAppServer#start()}
     * to give {@link DevAppServer} clients a chance to call
     * {@link DevAppServer#setThrowOnEnvironmentVariableMismatch(boolean)}
     * before reporting errors.
     */
    void checkEnvironmentVariables();

    /**
     * Returns the {@link BackendsXml} for this configuration.
     * <p>
     * For EAR configurations this will return null. For WAR configurations this
     * will return a value read from the war/WEB-INF/backends.xml if one is
     * specified or null otherwise.
     */
    BackendsXml getBackendsXml();

    /**
     * Reads or rereads the configuration from disk to pick up any changes.
     * Calling this function affects global state visible to all the servers
     * in the application including:
     * <ol>
     * <li> system properties
     * <li> the logging configuration
     * </ol>
     *
     * Because for EAR configurations the global includes information from
     * all the servers in the EAR, this rereads the configuration for every server.
     * This does not update the {@link ServerConfigurationHandle} for any other
     * servers. Certain configuration changes are not currently supp[orted
     * including changes that
     * <ol>
     * <li> Adds entries to {@link ApplicationConfigurationManager#getServerConfigurationHandles()}
     * <li> removes entries from
     *      {@link ApplicationConfigurationManager#getServerConfigurationHandles()}
     * <li> Changes the application directory for a {@link ServerConfigurationHandle} returned
     *      by {@link ApplicationConfigurationManager#getServerConfigurationHandles()}
     * </ol>
     * @throws AppEngineConfigException if the configuration on disk is not valid
     *     or includes unsupported changes.
     */
    void readConfiguration() throws AppEngineConfigException;

    /**
     * Clears {link {@link System#getProperties()} values that have been set by this
     * configuration.
     */
    void restoreSystemProperties();
  }

  private class WarServerConfigurationHandle implements ServerConfigurationHandle {
    private final File rawAppEngineWebXmlLocation;
    private final File rawWebXmlLocation;
    private final File externalResourceDirectory;
    @GuardedBy("ApplicationConfigurationManager.this")
    private BackendsXml backendsXml;
    @GuardedBy("ApplicationConfigurationManager.this")
    private WebModule webModule;
    /**
     * @param appEngineWebXmlLocation absolute paths are accepted, relative
     *        paths are under applicationDirectory and null means to use
     *        applicationDirectory/WEB-INF/appengine-web.xml.
     * @param webXmlLocation absolute paths are accepted, relative
     *        paths are under applicationDirectory and null means to use
     *        applicationDirectory/WEB-INF/web.xml.
     * @param externalResourceDirectory If not {@code null}, a resource directory external
     *        to the applicationDirectory. This will be searched before
     *        applicationDirectory when looking for resources.
     */
    WarServerConfigurationHandle(File appEngineWebXmlLocation, File webXmlLocation,
        File externalResourceDirectory) {
      this.rawAppEngineWebXmlLocation = appEngineWebXmlLocation;
      this.rawWebXmlLocation = webXmlLocation;
      this.externalResourceDirectory = externalResourceDirectory;
    }

    @Override
    public WebModule getModule() {
      synchronized (ApplicationConfigurationManager.this) {
        return webModule;
      }
    }

    @Override
    public void checkEnvironmentVariables() {
      ApplicationConfigurationManager.this.checkEnvironmentVariables();
    }

    @Override
    public BackendsXml getBackendsXml() {
      synchronized (ApplicationConfigurationManager.this) {
        return backendsXml;
      }
    }

    @Override
    public void readConfiguration() {
      synchronized (ApplicationConfigurationManager.this) {
        if (EarHelper.isEar(configurationRoot.getAbsolutePath())) {
          String message = String.format("Unsupported update from WAR to EAR for: %s",
              configurationRoot.getAbsolutePath());
          LOGGER.severe(message);
          throw new AppEngineConfigException(message);
        }
        webModule = EarHelper.readWebModule(null, configurationRoot, rawAppEngineWebXmlLocation,
            rawWebXmlLocation);
        String baseDir = configurationRoot.getAbsolutePath();
        File webinf = new File(baseDir, "WEB-INF");
        backendsXml =
            new BackendsXmlReader(baseDir).readBackendsXml();
        if (backendsXml == null) {
          BackendsYamlReader backendsYaml = new BackendsYamlReader(webinf.getPath());
          backendsXml = backendsYaml.parse();
        }
        AppEngineWebXml appEngineWebXml = webModule.getAppEngineWebXml();
        if (appEngineWebXml.getAppId() == null || appEngineWebXml.getAppId().length() == 0) {
          appEngineWebXml.setAppId("no_app_id");
        }
        LoggingConfigurationManager loggingConfigurationManager = new LoggingConfigurationManager();
        validateAndRegisterGlobalValues(webModule, loggingConfigurationManager,
            externalResourceDirectory);
        systemPropertiesManager.setAppengineSystemProperties(sdkRelease,
            appEngineWebXml.getAppId(), appEngineWebXml.getMajorVersionId());
        loggingConfigurationManager.updateLoggingConfiguration();
      }
    }

    @Override
    public void restoreSystemProperties() {
      synchronized (ApplicationConfigurationManager.this) {
        systemPropertiesManager.restoreSystemProperties();
      }
    }

    @Override
    public String toString() {
      synchronized (ApplicationConfigurationManager.this) {
        return "WarConfigurationHandle: webModule=" + webModule
            + " backendsXml=" + backendsXml
            + " appEngineWebXmlLocation=" + rawAppEngineWebXmlLocation
            + " webXmlLocation=" + rawWebXmlLocation
            + " externalResourceDirectory=" + externalResourceDirectory;
      }
    }
  }

  private class EarServerConfigurationHandle implements ServerConfigurationHandle {
    @GuardedBy("ApplicationConfigurationManager.this")
    private WebModule webModule;

    EarServerConfigurationHandle(WebModule webModule) {
      this.webModule = webModule;
    }

    @Override
    public WebModule getModule() {
      synchronized (ApplicationConfigurationManager.this) {
        return webModule;
      }
    }

    @Override
    public void checkEnvironmentVariables() {
      synchronized (ApplicationConfigurationManager.this) {
        ApplicationConfigurationManager.this.checkEnvironmentVariables();
      }
    }

    @Override
    public BackendsXml getBackendsXml() {
      return null;
    }

    @Override
    public void readConfiguration() {
      synchronized (ApplicationConfigurationManager.this) {
        EarInfo earInfo = readEarConfiguration();
        checkServersMatch(earInfo);
        for (WebModule module : earInfo.getWebModules()) {
          if (module.getApplicationDirectory().equals(webModule.getApplicationDirectory())) {
            webModule = module;
            return;
          }
        }

        throw new IllegalStateException("Expected web module not found.");
      }
    }

    /**
     * Checks that the servers from the passed in {@link EarInfo} which was
     * presumably read from the EAR directory matches the servers for this
     * {@link ApplicationConfigurationManager}.
     * @throws AppEngineConfigException if the servers do not match.
     */
    private void checkServersMatch(EarInfo earInfo) throws AppEngineConfigException {
      ImmutableSortedSet.Builder<File> gotBuilder = ImmutableSortedSet.naturalOrder();
      for (WebModule module : earInfo.getWebModules()) {
        gotBuilder.add(module.getApplicationDirectory());
      }

      ImmutableSortedSet.Builder<File> expectBuilder = ImmutableSortedSet.naturalOrder();
      for (ServerConfigurationHandle handle : serverConfigurationHandles) {
        expectBuilder.add(handle.getModule().getApplicationDirectory());
      }

      Set<File> got = gotBuilder.build();
      Set<File> expect = expectBuilder.build();
      if (!expect.equals(got)) {
        String message = String.format(
            "Unsupported configuration change of web moudlues from '%s' to '%s'", expect, got);
        LOGGER.severe(message);
        throw new AppEngineConfigException(message);
      }
    }

    @Override
    public void restoreSystemProperties() {
      synchronized (ApplicationConfigurationManager.this) {
        systemPropertiesManager.restoreSystemProperties();
      }
    }

    @Override
    public String toString() {
      synchronized (ApplicationConfigurationManager.this) {
        return "WarConfigurationHandle: webModule=" + webModule;
      }
    }
  }
}

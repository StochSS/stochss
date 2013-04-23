// Copyright 2009 Google Inc. All Rights Reserved.
package com.google.appengine.tools.development.gwt;

import com.google.appengine.tools.info.SdkInfo;
import com.google.appengine.tools.info.UpdateCheck;
import com.google.appengine.tools.development.DevAppServer;
import com.google.appengine.tools.development.DevAppServerFactory;
import com.google.appengine.tools.util.Logging;
import com.google.gwt.core.ext.ServletContainer;
import com.google.gwt.core.ext.ServletContainerLauncher;
import com.google.gwt.core.ext.TreeLogger;
import com.google.gwt.core.ext.UnableToCompleteException;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.PrintStream;
import java.util.Map;

/**
 * A GWT SCL that allows DevAppServer to be embedded within GWT Development Mode.
 *
 */
public class AppEngineLauncher extends ServletContainerLauncher {

  /**
   * Instead of the default address of 127.0.0.1, we use this address
   * to bind to all interfaces.  This is what most IDE-users will
   * expect.
   */
  private static final String ADDRESS = "0.0.0.0";

  private static class AppEngineServletContainer extends ServletContainer {
    private final TreeLogger logger;
    private final DevAppServer server;

    public AppEngineServletContainer(TreeLogger logger, DevAppServer server) {
      this.logger = logger;
      this.server = server;
    }

    @Override
    public int getPort() {
      return server.getPort();
    }

    @Override
    public void refresh() throws UnableToCompleteException {
      TreeLogger branch = logger.branch(TreeLogger.INFO, "Reloading App Engine server");
      try {
        server.restart();
      } catch (Exception e) {
        branch.log(TreeLogger.ERROR, "Unable to reload AppEngine server", e);
        throw new UnableToCompleteException();
      }
      branch.log(TreeLogger.INFO, "Reload completed successfully");
    }

    @Override
    public void stop() throws UnableToCompleteException {
      TreeLogger branch = logger.branch(TreeLogger.INFO, "Stopping App Engine server");
      try {
        server.shutdown();
      } catch (Exception e) {
        branch.log(TreeLogger.ERROR, "Unable to stop App Engine server", e);
        throw new UnableToCompleteException();
      }
      branch.log(TreeLogger.INFO, "Stopped successfully");
    }
  }

  @Override
  public ServletContainer start(TreeLogger logger, int port, File appRootDir)
      throws UnableToCompleteException {
    Logging.initializeLogging();
    checkStartParams(logger, port, appRootDir);

    TreeLogger branch = logger.branch(TreeLogger.INFO, "Initializing App Engine server");
    maybePerformUpdateCheck(branch);

    DevAppServer server = new DevAppServerFactory().createDevAppServer(
        appRootDir, ADDRESS, port);

    server.setThrowOnEnvironmentVariableMismatch(false);

    @SuppressWarnings("rawtypes")
    Map properties = System.getProperties();
    @SuppressWarnings("unchecked")
    Map<String, String> stringProperties = properties;
    server.setServiceProperties(stringProperties);

    try {
      server.start();
      return new AppEngineServletContainer(logger, server);
    } catch (Exception e) {
      branch.log(TreeLogger.ERROR, "Unable to start App Engine server", e);
      throw new UnableToCompleteException();
    }
  }

  protected void maybePerformUpdateCheck(TreeLogger logger) {
    UpdateCheck updateCheck = new UpdateCheck(SdkInfo.getDefaultServer());
    if (updateCheck.allowedToCheckForUpdates()) {
      ByteArrayOutputStream baos = new ByteArrayOutputStream();
      if (updateCheck.maybePrintNagScreen(new PrintStream(baos))) {
        logger.log(TreeLogger.WARN, new String(baos.toByteArray()));
      }
    }
    ByteArrayOutputStream baos = new ByteArrayOutputStream();
    if (updateCheck.checkJavaVersion(new PrintStream(baos))) {
      logger.log(TreeLogger.WARN, new String(baos.toByteArray()));
    }
  }

  private void checkStartParams(TreeLogger logger, int port, File appRootDir) {
    if (logger == null) {
      throw new NullPointerException("logger cannot be null");
    }

    if (port < 0 || port > 65535) {
      throw new IllegalArgumentException("port must be either 0 (for auto) or less than 65536");
    }

    if (appRootDir == null) {
      throw new NullPointerException("app root directory cannot be null");
    }
  }
}

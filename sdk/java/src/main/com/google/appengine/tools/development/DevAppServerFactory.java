// Copyright 2008 Google Inc. All Rights Reserved.

package com.google.appengine.tools.development;

import com.google.appengine.tools.development.agent.AppEngineDevAgent;
import com.google.apphosting.utils.security.SecurityManagerInstaller;

import sun.security.util.SecurityConstants;

import java.io.File;
import java.lang.reflect.Constructor;
import java.lang.reflect.InvocationTargetException;
import java.net.SocketPermission;
import java.net.URL;
import java.security.Permission;
import java.util.Collection;
import java.util.HashMap;
import java.util.Map;
import java.util.PropertyPermission;

/**
 * Creates new {@link DevAppServer DevAppServers} which can be used to launch
 * web applications.
 * TODO(user): Describe the difference between standalone and testing servers.
 *
 */
public class DevAppServerFactory {

  static final String DEV_APP_SERVER_CLASS =
      "com.google.appengine.tools.development.DevAppServerImpl";

  private static final Class<?>[] DEV_APPSERVER_CTOR_ARG_TYPES = {File.class, File.class,
    File.class, File.class, String.class, Integer.TYPE, Boolean.TYPE, Map.class};

  private static final String USER_CODE_CLASSPATH_MANAGER_PROP =
      "devappserver.userCodeClasspathManager";
  private static final String USER_CODE_CLASSPATH = USER_CODE_CLASSPATH_MANAGER_PROP + ".classpath";
  private static final String USER_CODE_REQUIRES_WEB_INF =
      USER_CODE_CLASSPATH_MANAGER_PROP + ".requiresWebInf";

  /**
   * Creates a new {@link DevAppServer} ready to start serving
   *
   * @param appDir The top-level directory of the web application to be run
   * @param address Address to bind to
   * @param port Port to bind to
   *
   * @return a {@code DevAppServer}
   */
  public DevAppServer createDevAppServer(File appDir, String address, int port) {
    return createDevAppServer(appDir, null, address, port);
  }

  /**
   * Creates a new {@link DevAppServer} ready to start serving
   *
   * @param appDir The top-level directory of the web application to be run
   * @param externalResourceDir If not {@code null}, a resource directory external to the appDir.
   *        This will be searched before appDir when looking for resources.
   * @param address Address to bind to
   * @param port Port to bind to
   *
   * @return a {@code DevAppServer}
   */
  public DevAppServer createDevAppServer(File appDir, File externalResourceDir, String address,
      int port) {
    return createDevAppServer(appDir, externalResourceDir, null, null, address, port, true,
        true, new HashMap<String, Object>());
  }

  /**
   * Creates a new {@link DevAppServer} with a custom classpath for the web
   * app..
   *
   * @param appDir The top-level directory of the web application to be run
   * @param webXmlLocation The location of a file whose format complies with
   * http://java.sun.com/xml/ns/javaee/web-app_2_5.xsd.  If {@code null},
   * defaults to <appDir>/WEB-INF/web.xml
   * @param appEngineWebXmlLocation The name of the app engine config file.  If
   * {@code null}, defaults to <appDir>/WEB-INF/appengine-web.xml.
   * @param address Address to bind to
   * @param port Port to bind to
   * @param useCustomStreamHandler If {@code true}, install
   * {@link StreamHandlerFactory}.  This is "normal" behavior for the dev
   * app server but tests may want to disable this since there are some
   * compatibility issues with our custom handler and Selenium.
   * @param installSecurityManager Whether or not to install the dev appserver
   * security manager.  It is strongly recommended you pass {@code true} unless
   * there is something in your test environment that prevents you from
   * installing a security manager.
   * @param classpath The classpath of the test and all its dependencies
   * (possibly the entire app)..
   *
   * @return a {@code DevAppServer}
   */
  public DevAppServer createDevAppServer(File appDir, File webXmlLocation,
      File appEngineWebXmlLocation, String address, int port,
      boolean useCustomStreamHandler, boolean installSecurityManager, Collection<URL> classpath) {
    Map<String, Object> containerConfigProps = newContainerConfigPropertiesForTest(classpath);
    return createDevAppServer(appDir, null, webXmlLocation, appEngineWebXmlLocation,
        address, port, useCustomStreamHandler, installSecurityManager, containerConfigProps);
  }

  /**
   * Creates a new {@link DevAppServer} ready to start serving.  Only exposed
   * to clients that can access it via reflection to keep it out of the public
   * api.
   *
   * @param appDir The top-level directory of the web application to be run
   * @param webXmlLocation The location of a file whose format complies with
   * http://java.sun.com/xml/ns/javaee/web-app_2_5.xsd.  If {@code null},
   * defaults to <appDir>/WEB-INF/web.xml
   * @param appEngineWebXmlLocation The location of the app engine config file.  If
   * {@code null}, defaults to <appDir>/WEB-INF/appengine-web.xml.
   * @param address Address to bind to
   * @param port Port to bind to
   * @param useCustomStreamHandler If {@code true}, install
   * {@link StreamHandlerFactory}.  This is "normal" behavior for the dev
   * app server but tests may want to disable this since there are some
   * compatibility issues with our custom handler and Selenium.
   *
   * @return a {@code DevAppServer}
   */
  @SuppressWarnings("unused")
  private DevAppServer createDevAppServer(File appDir,File webXmlLocation,
      File appEngineWebXmlLocation, String address, int port, boolean useCustomStreamHandler) {
    return createDevAppServer(appDir, null, webXmlLocation, appEngineWebXmlLocation,
        address, port, useCustomStreamHandler, true, new HashMap<String, Object>());
  }

  @SuppressWarnings("unused")
  private DevAppServer createDevAppServer(File appDir, File webXmlLocation,
      File appEngineWebXmlLocation, String address, int port, boolean useCustomStreamHandler,
      boolean installSecurityManager, Map<String, Object> containerConfigProperties) {
    return createDevAppServer(appDir, null, webXmlLocation, appEngineWebXmlLocation, address, port,
        useCustomStreamHandler,installSecurityManager, containerConfigProperties);
  }

  private DevAppServer createDevAppServer(File appDir, File externalResourceDir,
      File webXmlLocation, File appEngineWebXmlLocation, String address, int port,
      boolean useCustomStreamHandler, boolean installSecurityManager,
      Map<String, Object> containerConfigProperties) {
    if (installSecurityManager) {
      SecurityManagerInstaller.install();
    }

    DevAppServerClassLoader loader = DevAppServerClassLoader.newClassLoader(
        DevAppServerFactory.class.getClassLoader());

    testAgentIsInstalled();

    DevAppServer devAppServer;
    try {
      Class<?> devAppServerClass = Class.forName(DEV_APP_SERVER_CLASS, true, loader);
      Constructor<?> cons = devAppServerClass.getConstructor(DEV_APPSERVER_CTOR_ARG_TYPES);
      cons.setAccessible(true);
      devAppServer = (DevAppServer) cons.newInstance(
          appDir, externalResourceDir, webXmlLocation, appEngineWebXmlLocation, address, port,
          useCustomStreamHandler, containerConfigProperties);
    } catch (Exception e) {
      Throwable t = e;
      if (e instanceof InvocationTargetException) {
        t = e.getCause();
      }
      throw new RuntimeException("Unable to create a DevAppServer", t);
    }
    if (installSecurityManager) {
      System.setSecurityManager(new CustomSecurityManager(devAppServer));
    }
    return devAppServer;
  }

  /**
   * Build a {@link Map} that contains settings that will allow us to inject
   * our own classpath and to not require a WEB-INF directory.  This map will
   * travel across classloader boundaries so all values in the map must be jre
   * classes.
   */
  private Map<String, Object> newContainerConfigPropertiesForTest(Collection<URL> classpath) {
    Map<String, Object> containerConfigProps = new HashMap<String, Object>();
    Map<String, Object> userCodeClasspathManagerProps = new HashMap<String, Object>();
    userCodeClasspathManagerProps.put(USER_CODE_CLASSPATH, classpath);
    userCodeClasspathManagerProps.put(USER_CODE_REQUIRES_WEB_INF, false);
    containerConfigProps.put(USER_CODE_CLASSPATH_MANAGER_PROP, userCodeClasspathManagerProps);
    return containerConfigProps;
  }

  private void testAgentIsInstalled() {
    try {
      AppEngineDevAgent.getAgent();
    } catch (Throwable t) {
      String msg = "Unable to locate the App Engine agent. Please use dev_appserver, KickStart, "
          + " or set the jvm flag: \"-javaagent:<sdk_root>/lib/agent/appengine-agent.jar\"";
      throw new RuntimeException(msg, t);
    }
  }

  /**
   * Implements custom security behavior. This SecurityManager only applies
   * checks when code is running in the context of a DevAppServer thread
   * handling an http request.
   */
  private static class CustomSecurityManager extends SecurityManager {

    private static final RuntimePermission PERMISSION_MODIFY_THREAD_GROUP =
        new RuntimePermission("modifyThreadGroup");

    private static final RuntimePermission PERMISSION_MODIFY_THREAD =
        new RuntimePermission("modifyThread");

    private static final String KEYCHAIN_JNILIB = "/libkeychain.jnilib";

    private static final Object PERMISSION_LOCK = new Object();

    private final DevAppServer devAppServer;

    public CustomSecurityManager(DevAppServer devAppServer) {
      this.devAppServer = devAppServer;
    }

    private synchronized boolean appHasPermission(Permission perm) {
      synchronized (PERMISSION_LOCK) {
        AppContext context = devAppServer.getCurrentAppContext();
        if (context.getUserPermissions().implies(perm) ||
            context.getApplicationPermissions().implies(perm)) {
          return true;
        }
      }

      if (PERMISSION_MODIFY_THREAD.equals(perm)) {
        StackTraceElement frame = getCallerFrame();
        if ("java.util.concurrent.ThreadPoolExecutor".equals(frame.getClassName()) ||
            ("java.lang.Thread".equals(frame.getClassName()) &&
             "interrupt".equals(frame.getMethodName())) ||
            ("java.lang.Thread".equals(frame.getClassName()) &&
             "setUncaughtExceptionHandler".equals(frame.getMethodName()))) {
          return true;
        }
      }

      if (perm instanceof SocketPermission) {
        return true;
      }

      return SecurityConstants.FILE_READ_ACTION.equals(perm.getActions()) &&
          perm.getName().endsWith(KEYCHAIN_JNILIB);
    }

    @Override
    public void checkPermission(Permission perm) {
      if (perm instanceof PropertyPermission) {
        return;
      }

      if (isDevAppServerThread()) {
        if (appHasPermission(perm)) {
          return;
        }

        super.checkPermission(perm);
      }
    }

    @Override
    public void checkPermission(Permission perm, Object context) {
      if (isDevAppServerThread()) {
        if (appHasPermission(perm)) {
          return;
        }
        super.checkPermission(perm, context);
      }
    }

    /**
     * Don't allow user code permission to muck with Threads.
     * Normally the JDK only enforces this for the root ThreadGroup, but
     * we enforce it at all times.
     */
    @Override
    public void checkAccess(ThreadGroup g) {
      if (g == null) {
        throw new NullPointerException("thread group can't be null");
      }

      checkPermission(PERMISSION_MODIFY_THREAD_GROUP);
    }

    /**
     * Enforces the same thread policy as {@link #checkAccess(ThreadGroup)}.
     */
    @Override
    public void checkAccess(Thread t) {
      if (t == null) {
        throw new NullPointerException("thread can't be null");
      }

      checkPermission(PERMISSION_MODIFY_THREAD);
    }

    private boolean isDevAppServerThread() {

      return (Boolean.getBoolean("devappserver-thread-" + Thread.currentThread().getName())
          && devAppServer.getCurrentAppContext() != null);
    }

    /**
     * Find the first {@link StackTraceElement} on the current thread
     * which does not come from this class or from a method named
     * {@code checkAccess} (e.g. {@link Thread#checkAccess}).
     */
    private StackTraceElement getCallerFrame() {
      StackTraceElement[] frames = Thread.currentThread().getStackTrace();
      for (int i = 1; i < frames.length; i++) {
        if ("checkAccess".equals(frames[i].getMethodName())) {
        } else if (!getClass().getName().equals(frames[i].getClassName())) {
          return frames[i];
        }
      }
      throw new IllegalStateException("Unable to determine calling frame.");
    }
  }
}

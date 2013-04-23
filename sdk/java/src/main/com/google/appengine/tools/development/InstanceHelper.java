package com.google.appengine.tools.development;

import com.google.appengine.tools.development.AbstractContainerService.LocalInitializationEnvironment;
import com.google.appengine.tools.development.InstanceStateHolder.InstanceState;
import com.google.apphosting.api.ApiProxy;
import com.google.apphosting.api.ApiProxy.Environment;
import com.google.apphosting.utils.config.AppEngineWebXml;
import com.google.apphosting.utils.config.WebModule;

import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.methods.GetMethod;

import java.io.InputStream;
import java.lang.reflect.Method;
import java.net.MalformedURLException;
import java.util.logging.Logger;

/**
 * Utility functions to access a server instance.
 */
public class InstanceHelper {
  private static final String X_GOOGLE_DEV_APPSERVER_SKIPADMINCHECK =
      "X-Google-DevAppserver-SkipAdminCheck";
  private static final int AH_REQUEST_INFINITE_TIMEOUT = 0;
  private static final int AH_REQUEST_DEFAULT_TIMEOUT = 30 * 1000;

  private static final Logger LOGGER = Logger.getLogger(InstanceHelper.class.getName());

  private final String serverOrBackendName;
  private final int instance;
  private final InstanceStateHolder instanceStateHolder;
  private final ContainerService containerService;

  /**
   * Constructs an {@link InstanceHelper}.
   *
   * @param serverOrBackendName For server instances the server name and for backend instances the
   *     backend name.
   * @param instance The instance number or -1 for load balancing servers and automatic servers.
   * @param instanceStateHolder Holder for the instances state.
   * @param containerService The container service for the instance.
   */
  InstanceHelper(String serverOrBackendName, int instance, InstanceStateHolder instanceStateHolder,
      ContainerService containerService) {
    this.serverOrBackendName = serverOrBackendName;
    this.instance = instance;
    this.instanceStateHolder = instanceStateHolder;
    this.containerService = containerService;
  }

  /**
   * Triggers an HTTP GET to /_ah/start in a background thread
   *
   * This method will keep on trying until it receives a non-error response
   * code from the server.
   *
   * @param runOnSuccess {@link Runnable#run} invoked when the startup request succeeds.
   */
  void sendStartRequest(final Runnable runOnSuccess) {
    instanceStateHolder.testAndSet(InstanceState.RUNNING_START_REQUEST, InstanceState.SLEEPING);
    if (instance >= 0) {
      Thread requestThread = new Thread(new Runnable() {
        @Override
        public void run() {
          sendStartRequest(AH_REQUEST_INFINITE_TIMEOUT, runOnSuccess);
        }
      });
      requestThread.setDaemon(true);
      requestThread.setName(
          "BackendServersStartRequestThread." + instance + "." + serverOrBackendName);
      requestThread.start();
    }
  }

  /**
   * Triggers an HTTP GET to /_ah/start
   *
   *  This method will keep on trying until it receives a non-error response
   * code from the server.
   *
   * @param timeoutInMs Timeout in milliseconds, 0 indicates no timeout.
   * @param runOnSuccess {@link Runnable#run} invoked when the startup request succeeds.
   */
  private void sendStartRequest(int timeoutInMs, Runnable runOnSuccess) {
    try {
      String urlString = String.format("http://%s:%d/_ah/start", containerService.getAddress(),
          containerService.getPort());
      LOGGER.finer("sending start request to: " + urlString);

      HttpClient httpClient = new HttpClient();
      httpClient.getParams().setConnectionManagerTimeout(timeoutInMs);

      GetMethod request = new GetMethod(urlString);
      request.addRequestHeader(X_GOOGLE_DEV_APPSERVER_SKIPADMINCHECK, "true");
      try {
        int returnCode = httpClient.executeMethod(request);

        byte[] buffer = new byte[1024];
        InputStream in = request.getResponseBodyAsStream();
        while (in.read(buffer) != -1) {
        }
        if ((returnCode >= 200 && returnCode < 300) || returnCode == 404) {
          LOGGER.fine(
              String.format("backend server %d.%s request to /_ah/start completed, code=%d",
                  instance, serverOrBackendName, returnCode));
          instanceStateHolder.testAndSet(InstanceState.RUNNING,
              InstanceState.RUNNING_START_REQUEST);
          runOnSuccess.run();
        } else {
          LOGGER.warning("Start request to /_ah/start on server " + instance + "."
              + serverOrBackendName + " failed (HTTP status code=" + returnCode
              + "). Retrying...");
          Thread.sleep(1000);
          sendStartRequest(timeoutInMs, runOnSuccess);
        }
      } finally {
        request.releaseConnection();
      }
    } catch (MalformedURLException e) {
      LOGGER.severe(String.format(
          "Unable to send start request to server: %d.%s, " + "MalformedURLException: %s",
          instance, serverOrBackendName, e.getMessage()));
    } catch (Exception e) {
      LOGGER.warning(String.format(
          "Got exception while performing /_ah/start " + "request on server: %d.%s, %s: %s",
          instance, serverOrBackendName, e.getClass().getName(), e.getMessage()));
    }
  }

  /**
   * This method will trigger any shutdown hooks registered with the current
   * server.
   *
   * Some class loader trickery is required to make sure that we get the
   * {@link com.google.appengine.api.LifecycleManager} responsible for this
   * server instance.
   */
  private void triggerLifecycleShutdownHookImpl() {
    Environment prevEnvironment = ApiProxy.getCurrentEnvironment();
    try {
      ClassLoader serverClassLoader = containerService.getAppContext().getClassLoader();

      Class<?> lifeCycleManagerClass =
          Class.forName("com.google.appengine.api.LifecycleManager", true, serverClassLoader);
      Method lifeCycleManagerGetter = lifeCycleManagerClass.getMethod("getInstance");
      Object userThreadLifeCycleManager = lifeCycleManagerGetter.invoke(null, new Object[0]);

      Method beginShutdown = lifeCycleManagerClass.getMethod("beginShutdown", long.class);
      AppEngineWebXml appEngineWebXml = containerService.getAppEngineWebXmlConfig();
      String serverName = WebModule.getServerName(appEngineWebXml);
      ApiProxy.setEnvironmentForCurrentThread(new LocalInitializationEnvironment(
          appEngineWebXml.getAppId(), serverName, appEngineWebXml.getMajorVersionId(), instance));

      try {
        beginShutdown.invoke(userThreadLifeCycleManager, AH_REQUEST_DEFAULT_TIMEOUT);
      } catch (Exception e) {
        LOGGER.warning(
            String.format("got exception when running shutdown hook on server %d.%s",
                instance, serverOrBackendName));
        e.printStackTrace();
      }
    } catch (Exception e) {
      LOGGER.severe(
          String.format("Exception during reflective call to "
              + "LifecycleManager.beginShutdown on server %d.%s, got %s: %s", instance,
              serverOrBackendName, e.getClass().getName(), e.getMessage()));
    } finally {
      ApiProxy.setEnvironmentForCurrentThread(prevEnvironment);
    }
  }

  /**
   * Shut down the server.
   *
   * Will trigger any shutdown hooks installed by the
   * {@link com.google.appengine.api.LifecycleManager}
   *
   * @throws Exception
   */
  void shutdown() throws Exception {
    synchronized (instanceStateHolder) {
      if (instanceStateHolder.test(InstanceState.RUNNING, InstanceState.RUNNING_START_REQUEST)) {
        triggerLifecycleShutdownHookImpl();
      }
      containerService.shutdown();
      instanceStateHolder.set(InstanceState.SHUTDOWN);
    }
  }
}

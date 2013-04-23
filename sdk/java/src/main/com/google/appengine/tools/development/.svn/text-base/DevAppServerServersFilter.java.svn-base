// Copyright 2011 Google Inc. All Rights Reserved.

package com.google.appengine.tools.development;

import com.google.appengine.api.backends.BackendService;
import com.google.appengine.api.backends.dev.LocalServerController;
import com.google.appengine.api.labs.servers.ServersException;
import com.google.appengine.api.labs.servers.ServersService;
import com.google.appengine.api.labs.servers.ServersServiceFactory;
import com.google.apphosting.api.ApiProxy;
import com.google.common.annotations.VisibleForTesting;

import java.io.IOException;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * This filter intercepts all request sent to all servers.
 *
 *  There are 6 different request types that this filter will see:
 *
 *  * DIRECT_BACKEND_REQUEST: a client request sent to a non load balancing/non backend
 *    server instance.
 *
 *  * REDIRECT_REQUESTED: a request requesting a redirect in one of three ways
 *     1) The request contains a BackendService.REQUEST_HEADER_BACKEND_REDIRECT
 *        header or parameter
 *     2) The request is sent to a load balancing instance of a server
 *     3) The request is sent to a load balancing instance of a backend.
 *
 *    If the request specifies an instance with the
 *    BackendService.REQUEST_HEADER_INSTANCE_REDIRECT header or parameter
 *    this filter will verify that the instance is available, obtain a
 *    serving permit and either forward the request. If the requested instance is
 *    not available this filter will respond with a 500 error.
 *
 *    If the request does not specify an instance the filter will pick one,
 *    obtain a serving permit, and and forward the request, if no instance is
 *    available this filter will respond with a 500 error.
 *
 *  * DIRECT_SERVER_REQUEST: a request sent directly to the listening port of a
 *    specific server instance. The filter will verify that the instance is
 *    available, obtain a serving permit and send the request to the handler.
 *    If no instance is available this filter will respond with a 500 error.
 *
 *  * REDIRECTED_BACKEND_REQUEST: a request redirected to a backend instance.
 *    The filter will send the request to the handler. The serving permit has
 *    already been obtained when this filter performed the redirect.
 *
 *  * REDIRECTED_SERVER_REQUEST: a request redirected to a specific instance.
 *    The filter will send the request to the handler. The serving permit has
 *    already been obtained when this filter performed the redirect.
 *
 * * SERVER_STARTUP_REQUEST: startup request sent when servers are started.
 *
 *
 */
public class DevAppServerServersFilter implements Filter {

  static final String BACKEND_REDIRECT_ATTRIBUTE = "com.google.appengine.backend.BackendName";
  static final String BACKEND_INSTANCE_REDIRECT_ATTRIBUTE =
      "com.google.appengine.backend.BackendInstance";
  static final String SERVER_INSTANCE_REDIRECT_ATTRIBUTE =
      "com.google.appengine.server.ServerInstance";

  static final int SERVER_BUSY_ERROR_CODE = HttpServletResponse.SC_INTERNAL_SERVER_ERROR;

  static final int SERVER_STOPPED_ERROR_CODE = HttpServletResponse.SC_NOT_FOUND;

  static final int SERVER_MISSING_ERROR_CODE = HttpServletResponse.SC_BAD_GATEWAY;

  private final AbstractBackendServers backendServersManager;
  private final ServersService serversService;

  private final Logger logger = Logger.getLogger(DevAppServerServersFilter.class.getName());

  @VisibleForTesting
  DevAppServerServersFilter(AbstractBackendServers backendServers, ServersService serversService) {
    this.backendServersManager = backendServers;
    this.serversService = serversService;
  }

  public DevAppServerServersFilter() {
    this(BackendServers.getInstance(), ServersServiceFactory.getServersService());
  }

  @Override
  public void destroy() {
  }

  /**
   * Main filter method. All request to the dev-appserver pass this method.
   */
  @Override
  public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
      throws IOException, ServletException {
    HttpServletRequest hrequest = (HttpServletRequest) request;
    HttpServletResponse hresponse = (HttpServletResponse) response;
    RequestType requestType = getRequestType(hrequest);
    switch (requestType) {
      case DIRECT_SERVER_REQUEST:
        doDirectServerRequest(hrequest, hresponse, chain);
        break;
      case REDIRECT_REQUESTED:
        doRedirect(hrequest, hresponse);
        break;
      case DIRECT_BACKEND_REQUEST:
        doDirectBackendRequest(hrequest, hresponse, chain);
        break;
      case REDIRECTED_BACKEND_REQUEST:
        doRedirectedBackendRequest(hrequest, hresponse, chain);
        break;
      case REDIRECTED_SERVER_REQUEST:
        doRedirectedServerRequest(hrequest, hresponse, chain);
        break;
      case SERVER_STARTUP_REQUEST:
        doStartupRequest(hrequest, hresponse, chain);
        break;
    }
  }

  /**
   * Determine the request type for a given request.
   *
   * @param hrequest The Request to categorize
   * @return The RequestType of the request
   */
  @VisibleForTesting
  RequestType getRequestType(HttpServletRequest hrequest) {
    int serverPort = hrequest.getServerPort();
    String backendServerName = backendServersManager.getServerNameFromPort(serverPort);
    if (hrequest.getRequestURI().equals("/_ah/start") &&
        expectsGeneratedStartRequests(backendServerName, serverPort)) {
      return RequestType.SERVER_STARTUP_REQUEST;
    } else if (hrequest.getAttribute(BACKEND_REDIRECT_ATTRIBUTE) != null &&
               hrequest.getAttribute(BACKEND_REDIRECT_ATTRIBUTE) instanceof String) {
      return RequestType.REDIRECTED_BACKEND_REQUEST;
    } else if (hrequest.getAttribute(SERVER_INSTANCE_REDIRECT_ATTRIBUTE) != null &&
        hrequest.getAttribute(SERVER_INSTANCE_REDIRECT_ATTRIBUTE) instanceof Integer) {
      return RequestType.REDIRECTED_SERVER_REQUEST;
    } else if (backendServerName != null) {
      int backendInstance = backendServersManager.getServerInstanceFromPort(serverPort);
      if (backendInstance == -1) {
        return RequestType.REDIRECT_REQUESTED;
      } else {
        return RequestType.DIRECT_BACKEND_REQUEST;
      }
    } else {
      String serverRedirectHeader =
          getHeaderOrParameter(hrequest, BackendService.REQUEST_HEADER_BACKEND_REDIRECT);
      if (serverRedirectHeader == null && !isServerLoadBalancingServerRequest()) {
        return RequestType.DIRECT_SERVER_REQUEST;
      } else {
        return RequestType.REDIRECT_REQUESTED;
      }
    }
  }

  private boolean isServerLoadBalancingServerRequest() {
    ServersFilterHelper serversFilterHelper = getServersFilterHelper();
    String server = serversService.getCurrentServer();
    int instance = getCurrentServerInstance();
    return serversFilterHelper.isServerLoadBalancingServer(server, instance);
  }

  private boolean expectsGeneratedStartRequests(String backendName,
      int requestPort) {
    String serverOrBackendName = backendName;
    if (serverOrBackendName == null) {
      serverOrBackendName = serversService.getCurrentServer();
    }

    int instance = backendName == null ? getCurrentServerInstance() :
      backendServersManager.getServerInstanceFromPort(requestPort);
    ServersFilterHelper serversFilterHelper = getServersFilterHelper();
    return serversFilterHelper.expectsGeneratedStartRequests(
        serverOrBackendName, instance);
  }

  /**
   * Returns the instance id for the server handling the current request or -1
   * if a back end server or load balancing server is handling the request.
   */
  private int getCurrentServerInstance() {
    String instance = "-1";
    try {
      instance = serversService.getCurrentInstanceId();
    } catch (ServersException se) {
      logger.log(Level.FINE, "Exception getting server instance", se);
    }
    return Integer.parseInt(instance);
  }

  private ServersFilterHelper getServersFilterHelper() {
    Map<String, Object> attributes = ApiProxy.getCurrentEnvironment().getAttributes();
    return (ServersFilterHelper) attributes.get(DevAppServerImpl.SERVERS_FILTER_HELPER_PROPERTY);
  }

  private boolean tryToAcquireServingPermit(
      String requestedServer, int instance, HttpServletResponse hresponse) throws IOException {
    ServersFilterHelper serversFilterHelper = getServersFilterHelper();
    if (!serversFilterHelper.checkInstanceExists(requestedServer, instance)) {
      String msg =
          String.format("Got request to non-configured instance: %d.%s", instance, requestedServer);
      logger.warning(msg);
      hresponse.sendError(HttpServletResponse.SC_BAD_GATEWAY, msg);
      return false;
    }
    if (serversFilterHelper.checkInstanceStopped(requestedServer, instance)) {
      String msg =
          String.format("Got request to stopped instance: %d.%s", instance, requestedServer);
      logger.warning(msg);
      hresponse.sendError(SERVER_STOPPED_ERROR_CODE, msg);
      return false;
    }

    if (!serversFilterHelper.acquireServingPermit(requestedServer, instance, true)) {
      String msg = String.format(
          "Got request to server %d.%s but the instance is busy.", instance, requestedServer);
      logger.finer(msg);
      hresponse.sendError(SERVER_BUSY_ERROR_CODE, msg);
      return false;
    }

    return true;
  }

  /**
   * Request that contains either headers or parameters specifying that it
   * should be forwarded either to a specific server and instance, or to a free
   * instance of a specific server.
   */
  private void doRedirect(HttpServletRequest hrequest, HttpServletResponse hresponse)
      throws IOException, ServletException {
    String requestedServer =
        backendServersManager.getServerNameFromPort(hrequest.getServerPort());
    if (requestedServer == null) {
      requestedServer =
          getHeaderOrParameter(hrequest, BackendService.REQUEST_HEADER_BACKEND_REDIRECT);
    }

    boolean isServersLoadBalancingServer = false;
    if (requestedServer == null) {
      ServersService serversService = ServersServiceFactory.getServersService();
      requestedServer = serversService.getCurrentServer();
      isServersLoadBalancingServer = true;
    }
    ServersFilterHelper serversFilterHelper = getServersFilterHelper();
    int instance = getInstanceIdFromRequest(hrequest);
    logger.finest(String.format("redirect request to server: %d.%s", instance, requestedServer));
    if (instance != -1) {
      if (!tryToAcquireServingPermit(requestedServer, instance, hresponse)) {
        return;
      }
    } else {
      if (!serversFilterHelper.checkServerExists(requestedServer)) {
        String msg = String.format("Got request to non-configured server: %s", requestedServer);
        logger.warning(msg);
        hresponse.sendError(HttpServletResponse.SC_BAD_GATEWAY, msg);
        return;
      }
      if (serversFilterHelper.checkServerStopped(requestedServer)) {
        String msg = String.format("Got request to stopped server: %s", requestedServer);
        logger.warning(msg);
        hresponse.sendError(SERVER_STOPPED_ERROR_CODE, msg);
        return;
      }
      instance = serversFilterHelper.getAndReserveFreeInstance(requestedServer);
      if (instance == -1) {
        String msg = String.format("all instances of server %s are busy", requestedServer);
        logger.finest(msg);
        hresponse.sendError(SERVER_BUSY_ERROR_CODE, msg);
        return;
      }
    }

    try {
      if (isServersLoadBalancingServer) {
        logger.finer(String.format("forwarding request to server: %d.%s", instance,
            requestedServer));
        hrequest.setAttribute(SERVER_INSTANCE_REDIRECT_ATTRIBUTE, Integer.valueOf(instance));
      } else {
        logger.finer(String.format("forwarding request to backend: %d.%s", instance,
            requestedServer));
        hrequest.setAttribute(BACKEND_REDIRECT_ATTRIBUTE, requestedServer);
        hrequest.setAttribute(BACKEND_INSTANCE_REDIRECT_ATTRIBUTE, Integer.valueOf(instance));
      }
      serversFilterHelper.forwardToServer(requestedServer, instance, hrequest, hresponse);
    } finally {
      serversFilterHelper.returnServingPermit(requestedServer, instance);
    }
  }

  private void doDirectBackendRequest(
      HttpServletRequest hrequest, HttpServletResponse hresponse, FilterChain chain)
      throws IOException, ServletException {
    int serverPort = hrequest.getServerPort();
    String requestedServer = backendServersManager.getServerNameFromPort(serverPort);
    int requestedInstance = backendServersManager.getServerInstanceFromPort(serverPort);
    injectApiInfo(requestedServer, requestedInstance);
    doDirectRequest(requestedServer, requestedInstance, hrequest, hresponse, chain);
  }

  private void doDirectServerRequest(
      HttpServletRequest hrequest, HttpServletResponse hresponse, FilterChain chain)
      throws IOException, ServletException {
    String requestedServer =  serversService.getCurrentServer();
    int requestedInstance = getCurrentServerInstance();
    injectApiInfo(null, -1);
    doDirectRequest(requestedServer, requestedInstance, hrequest, hresponse, chain);
  }

  private void doDirectRequest(String serverOrBackendName, int serverOrBackendInstance,
      HttpServletRequest hrequest, HttpServletResponse hresponse, FilterChain chain)
      throws IOException, ServletException {
    logger.finest("request to specific server instance: " + serverOrBackendInstance
        + "." + serverOrBackendName);

    if (!tryToAcquireServingPermit(serverOrBackendName, serverOrBackendInstance, hresponse)) {
      return;
    }
    try {
      logger.finest("Acquired serving permit for: " + serverOrBackendInstance + "."
          + serverOrBackendName);
      injectApiInfo(null, -1);
      chain.doFilter(hrequest, hresponse);
    } finally {
      ServersFilterHelper serversFilterHelper = getServersFilterHelper();
      serversFilterHelper.returnServingPermit(serverOrBackendName, serverOrBackendInstance);
    }
  }

  /**
   * A request forwarded from a different server. The forwarding server is
   * responsible for acquiring the serving permit. All we need to do is to add
   * the ServerApiInfo and forward the request along the chain.
   */
  private void doRedirectedBackendRequest(
      HttpServletRequest hrequest, HttpServletResponse hresponse, FilterChain chain)
      throws IOException, ServletException {
    String backendServer = (String) hrequest.getAttribute(BACKEND_REDIRECT_ATTRIBUTE);
    Integer instance = (Integer) hrequest.getAttribute(BACKEND_INSTANCE_REDIRECT_ATTRIBUTE);
    logger.finest("redirected request to backend server instance: " + instance + "."
        + backendServer);
    injectApiInfo(backendServer, instance);
    chain.doFilter(hrequest, hresponse);
  }

  /**
   * A request forwarded from a different server. The forwarding server is
   * responsible for acquiring the serving permit. All we need to do is to add
   * the ServerApiInfo and forward the request along the chain.
   */
  private void doRedirectedServerRequest(
      HttpServletRequest hrequest, HttpServletResponse hresponse, FilterChain chain)
      throws IOException, ServletException {
    Integer instance = (Integer) hrequest.getAttribute(SERVER_INSTANCE_REDIRECT_ATTRIBUTE);
    logger.finest("redirected request to server instance: " + instance + "." +
        ApiProxy.getCurrentEnvironment().getVersionId());
    injectApiInfo(null, -1);
    LocalEnvironment.setInstance(ApiProxy.getCurrentEnvironment().getAttributes(), instance);
    chain.doFilter(hrequest, hresponse);
  }

  /**
   * Startup requests do not require any serving permits and can be forwarded
   * along the chain straight away.
   */
  private void doStartupRequest(
      HttpServletRequest hrequest, HttpServletResponse hresponse, FilterChain chain)
      throws IOException, ServletException {
    int serverPort = hrequest.getServerPort();
    String backendServer = backendServersManager.getServerNameFromPort(serverPort);
    int instance = backendServersManager.getServerInstanceFromPort(serverPort);
    logger.finest("startup request to: " + instance + "." + backendServer);
    injectApiInfo(backendServer, instance);
    chain.doFilter(hrequest, hresponse);
  }

  @SuppressWarnings("unused")
  @Override
  public void init(FilterConfig filterConfig) throws ServletException {
  }

  /**
   * Inject information about the current backend server setup so it is available
   * to the BackendService API. This information is stored in the threadLocalAttributes
   * in the current environment.
   *
   * @param currentServer The server that is handling the request
   * @param instance The server instance that is handling the request
   */
  private void injectApiInfo(String currentServer, int instance) {
    Map<String, String> portMapping = backendServersManager.getPortMapping();
    if (portMapping == null) {
      throw new IllegalStateException("backendServersManager.getPortMapping() is null");
    }
    injectBackendServiceCurrentApiInfo(currentServer, instance, portMapping);
    if (portMapping.size() > 0) {
      Map<String, Object> threadLocalAttributes = ApiProxy.getCurrentEnvironment().getAttributes();
      threadLocalAttributes.put(
          LocalServerController.BACKEND_CONTROLLER_ATTRIBUTE_KEY, backendServersManager);
    }
  }

  /**
   * Sets up {@link ApiProxy} attributes needed {@link BackendService}.
   */
  static void injectBackendServiceCurrentApiInfo(String backendServer, int backendInstance,
      Map<String, String> portMapping) {
    Map<String, Object> threadLocalAttributes = ApiProxy.getCurrentEnvironment().getAttributes();
    if (backendInstance != -1) {
      threadLocalAttributes.put(BackendService.INSTANCE_ID_ENV_ATTRIBUTE, backendInstance + "");
    }
    if (backendServer != null) {
      threadLocalAttributes.put(BackendService.BACKEND_ID_ENV_ATTRIBUTE, backendServer);
    }
    threadLocalAttributes.put(BackendService.DEVAPPSERVER_PORTMAPPING_KEY, portMapping);
  }

  /**
   * Checks the request headers and request parameters for the specified key
   */
  @VisibleForTesting
  static String getHeaderOrParameter(HttpServletRequest request, String key) {
    String value = request.getHeader(key);
    if (value != null) {
      return value;
    }
    if ("GET".equals(request.getMethod())) {
      return request.getParameter(key);
    }
    return null;
  }

  /**
   * Checks request headers and parameters to see if an instance id was
   * specified.
   */
  @VisibleForTesting
  static int getInstanceIdFromRequest(HttpServletRequest request) {
    try {
      return Integer.parseInt(
          getHeaderOrParameter(request, BackendService.REQUEST_HEADER_INSTANCE_REDIRECT));
    } catch (NumberFormatException e) {
      return -1;
    }
  }

  @VisibleForTesting
  static enum RequestType {
    DIRECT_SERVER_REQUEST, REDIRECT_REQUESTED, DIRECT_BACKEND_REQUEST, REDIRECTED_BACKEND_REQUEST,
    REDIRECTED_SERVER_REQUEST, SERVER_STARTUP_REQUEST;
  }
}

package com.google.appengine.tools.development;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Support interface for {@link DevAppServerServersFilter}.
 */
public interface ServersFilterHelper {
  /**
   * This method guards access to servers to limit the number of concurrent
   * requests. Each request running on a server must acquire a serving permit.
   * If no permits are available a 500 response should be sent.
   *
   * @param serverName The server for which to acquire a permit.
   * @param instanceNumber The server instance for which to acquire a permit.
   * @param allowQueueOnBackends If set to false the method will return
   *        instantly, if set to true (and the specified server allows pending
   *        queues) this method can block for up to 10 s waiting for a serving
   *        permit to become available.
   * @return true if a permit was acquired, false otherwise
   */
  boolean acquireServingPermit(String serverName, int instanceNumber,
      boolean allowQueueOnBackends);
  /**
   * Acquires a serving permit for an instance with capacity and returns the instance
   * id. If no instance has capacity this returns -1.
   * <p>
   * For backends which support queued requests this may block for a limited
   * time waiting for an instance to become available (see {@link
   * AbstractBackendServers#getAndReserveFreeInstance} for details).
   *
   * Supported for servers that support load balancing (currently {@link ManualServer}).
   * The client can check with {@link #isServerLoadBalancingServer(String, int)}.
   *
   * @param requestedServer Name of the requested server.
   * @return the instance id of an available server instance, or -1 if no
   *         instance is available.
   */
  int getAndReserveFreeInstance(String requestedServer);

  /**
   * Returns a serving permit after a request has completed.
   *
   * @param serverName The server name
   * @param instance The server instance
   */
  public void returnServingPermit(String serverName, int instance);

  /**
   * Verifies if a specific server/instance is configured.
   *
   * @param serverName The server name
   * @param instance The server instance
   * @return true if the server/instance is configured, false otherwise.
   */
  boolean checkInstanceExists(String serverName, int instance);

  /**
   * Verifies if a specific server is configured.
   *
   * @param serverName The server name
   * @return true if the server is configured, false otherwise.
   */
  boolean checkServerExists(String serverName);

  /**
   * Verifies if a specific server is stopped.
   *
   * @param serverName The server name
   * @return true if the server is stopped, false otherwise.
   */
  boolean checkServerStopped(String serverName);

  /**
   * Verifies if a specific server/instance is stopped.
   *
   * @param serverName The server name
   * @param instance The server instance
   * @return true if the server/instance is stopped, false otherwise.
   */
  boolean checkInstanceStopped(String serverName, int instance);

  /**
   * Forward a request to a specific server and instance. This will call the
   * specified instance request dispatcher so the request is handled in the
   * right server context. The caller must hold a serving permit for the
   * requested server and instance before calling this method.
   */
  void forwardToServer(String requestedServer, int instance, HttpServletRequest hrequest,
      HttpServletResponse hresponse) throws IOException, ServletException;

  /**
   * Returns true if the specified server instance is a designated load balancing
   * server which will forward requests to an available instance.
   *
   * @param serverName The server name
   * @param instance The server instance which can be -1.
   */
  boolean isServerLoadBalancingServer(String serverName, int instance);

  /**
   * Returns true if internally generated "/_ah/start" requests are provided
   * for the specified server and instance.
   * <p>
   * Http "/_ah/start" requests for such instances where this returns true are presumed to be
   * internally generated and receive special treatment by {@link DevAppServerServersFilter}.
   * Requests to "/_ah/start" for other instances are treated as normal requests.
   *
   * @param serverName The server name
   * @param instance The server instance which can be -1.
   */
  boolean expectsGeneratedStartRequests(String serverName, int instance);
}

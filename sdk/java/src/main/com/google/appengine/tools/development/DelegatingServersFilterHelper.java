package com.google.appengine.tools.development;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * A {@link ServersFilterHelper} for delegating requests to either
 * {@link BackendServers} for backends or {@link Servers} for actual servers.
 */
public class DelegatingServersFilterHelper implements ServersFilterHelper {

  private final BackendServers backendServers;
  private final Servers servers;

  public DelegatingServersFilterHelper(BackendServers backendServers, Servers servers) {
    this.backendServers = backendServers;
    this.servers = servers;
  }

  @Override
  public boolean acquireServingPermit(
      String serverName, int instanceNumber, boolean allowQueueOnBackends) {
    if (isBackend(serverName)) {
     return backendServers.acquireServingPermit(serverName, instanceNumber, allowQueueOnBackends);
    } else {
     return servers.acquireServingPermit(serverName, instanceNumber, allowQueueOnBackends);
    }
  }

  @Override
  public int getAndReserveFreeInstance(String serverName) {
    if (isBackend(serverName)) {
      return backendServers.getAndReserveFreeInstance(serverName);
     } else {
       return servers.getAndReserveFreeInstance(serverName);
     }
  }

  @Override
  public void returnServingPermit(String serverName, int instance) {
    if (isBackend(serverName)) {
      backendServers.returnServingPermit(serverName, instance);
     } else {
       servers.returnServingPermit(serverName, instance);
     }
  }

  @Override
  public boolean checkInstanceExists(String serverName, int instance) {
    if (isBackend(serverName)) {
      return backendServers.checkInstanceExists(serverName, instance);
    } else {
      return servers.checkInstanceExists(serverName, instance);
    }
  }

  @Override
  public boolean checkServerExists(String serverName) {
    if (isBackend(serverName)) {
      return backendServers.checkServerExists(serverName);
    } else {
     return servers.checkServerExists(serverName);
    }
  }

  @Override
  public boolean checkServerStopped(String serverName) {
    if (isBackend(serverName)) {
      return backendServers.checkServerStopped(serverName);
    } else {
      return servers.checkServerStopped(serverName);
    }
  }

  @Override
  public boolean checkInstanceStopped(String serverName, int instance) {
    if (isBackend(serverName)) {
      return backendServers.checkInstanceStopped(serverName, instance);
    } else {
      return servers.checkInstanceStopped(serverName, instance);
    }
  }

  @Override
  public void forwardToServer(String serverName, int instance, HttpServletRequest hrequest,
      HttpServletResponse response) throws IOException, ServletException {
      if (isBackend(serverName)) {
        backendServers.forwardToServer(serverName, instance, hrequest, response);
     } else {
       servers.forwardToServer(serverName, instance, hrequest, response);
     }
  }

  @Override
  public boolean isServerLoadBalancingServer(String serverName, int instance) {
    if (isBackend(serverName)) {
      return false;
    } else {
      return servers.isServerLoadBalancingServer(serverName, instance);
    }
  }

  private boolean isBackend(String serverName) {
    return backendServers.checkServerExists(serverName);
  }

  @Override
  public boolean expectsGeneratedStartRequests(String serverName, int instance) {
    if (isBackend(serverName)) {
      return instance >= 0;
    } else {
      return servers.expectsGeneratedStartRequests(serverName, instance);
    }
  }

}

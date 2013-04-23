// Copyright 2011 Google Inc. All Rights Reserved.

package com.google.appengine.api.backends;

import com.google.appengine.api.utils.SystemProperty;
import com.google.apphosting.api.ApiProxy;
import com.google.apphosting.api.ApiProxy.Environment;

import java.util.Map;

/**
 * The implementation of the Backends API for the production appserver.
 *
 */
class BackendServiceImpl implements BackendService {
  static final String DATACENTER_ATTR_KEY = "com.google.apphosting.api.ApiProxy.datacenter";

  static final String DEFAULT_VERSION_HOSTNAME =
      "com.google.appengine.runtime.default_version_hostname";

  BackendServiceImpl() {
  }

  @Override
  public String getCurrentBackend() {
    return (String) getThreadLocalAttributes().get(BACKEND_ID_ENV_ATTRIBUTE);
  }

  @Override
  public int getCurrentInstance() {
    try {
      return Integer.parseInt((String) getThreadLocalAttributes().get(INSTANCE_ID_ENV_ATTRIBUTE));
    } catch (NumberFormatException e) {
      return -1;
    }
  }

  @Override
  public String getBackendAddress(String backendName) {
    if (isProduction()) {
      return backendName + "." + getDefaultVersionHostname();
    } else {
      return getDevAppServerLocalAddress(backendName);
    }
  }

  @Override
  public String getBackendAddress(String backendName, int instance) {
    String backendInstance = instance + "." + backendName;
    if (isProduction()) {
      return backendInstance + "." + getDefaultVersionHostname();
    } else {
      return getDevAppServerLocalAddress(backendInstance);
    }
  }

  /**
   * Returns the local address in the devappserver given the url-prefix of a
   * backend.
   *
   *  Examples: <instace>.<backend> for a specific backend instance, or <backend>
   * for the backend without instance specified.
   *
   * @param string The url prefix for the backend
   * @return The local address of that backend
   */
  private String getDevAppServerLocalAddress(String string) {
    @SuppressWarnings("unchecked")
    Map portMap = (Map) getThreadLocalAttributes().get(DEVAPPSERVER_PORTMAPPING_KEY);
    Object addr = portMap.get(string);
    if (addr == null) {
      throw new IllegalStateException("Tried to get local address of unknown backend");
    }
    return (String) addr;
  }

  static String getDefaultVersionHostname() {
    return (String) getThreadLocalAttributes().get(DEFAULT_VERSION_HOSTNAME);
  }

  private static Map<String, Object> getThreadLocalAttributes() {
    Environment env = ApiProxy.getCurrentEnvironment();
    Map<String, Object> attr = env.getAttributes();
    if (attr == null) {
      throw new RuntimeException(
          "Local environment is corrupt (thread local attributes map is null)");
    }
    return attr;
  }

  private static boolean isProduction() {
    return SystemProperty.environment.value() == SystemProperty.Environment.Value.Production;
  }
}

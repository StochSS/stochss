// Copyright 2011 Google Inc. All Rights Reserved.

package com.google.appengine.api.backends;

/**
 * {@link BackendService} allows you to retrieve information about
 * backend servers. Backend servers are long running addressable
 * servers that can be used for applications that need to keep
 * persistent state in ram between requests.
 * <p>
 * This API allows you to retrieve information about the backend
 * handling the current request. It also allows you to to get the
 * address of a specific backend instance in such a way that a local
 * server is used during development and a production server is used
 * in production.
 *
 */
public interface BackendService {
  public static final String REQUEST_HEADER_BACKEND_REDIRECT = "X-AppEngine-BackendName";
  public static final String REQUEST_HEADER_INSTANCE_REDIRECT = "X-AppEngine-BackendInstance";

  /**
   * Environment attribute key where the instance id is stored.
   *
   * @see BackendService#getCurrentInstance()
   */
  public static final String INSTANCE_ID_ENV_ATTRIBUTE = "com.google.appengine.instance.id";

  /**
   * Environment attribute key where the backend name is stored.
   *
   * @see BackendService#getCurrentBackend()
   */
  public static final String BACKEND_ID_ENV_ATTRIBUTE = "com.google.appengine.backend.id";

  public static final String DEVAPPSERVER_PORTMAPPING_KEY =
      "com.google.appengine.devappserver.portmapping";

  /**
   * Get the name of the backend handling the current request.
   *
   * @return The name of the backend or null if the request is not handled by a
   *         backend.
   */
  public String getCurrentBackend();

  /**
   * Get the instance handling the current request.
   *
   * @return The instance id or -1 if the request is not handled by a backend.
   */
  public int getCurrentInstance();

  /**
   * Get the address of a specific backend in such a way that a local server is
   * used during development and a production server is used in production.
   *
   * @param backend The name of the backend
   * @return The address of the backend
   */
  public String getBackendAddress(String backend);

  /**
   * Get the address of a specific backend instance in such a way that a local
   * instance is used during development and a production server instance is
   * used in production.
   *
   * @param backend The name of the backend
   * @param instance The instance id
   * @return The address of the backend instance
   */
  public String getBackendAddress(String backend, int instance);
}

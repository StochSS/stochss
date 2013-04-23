// Copyright 2012 Google Inc. All rights reserved.

package com.google.appengine.api.backends;

/**
 * Factory for getting the Backends API implementation for the current
 * environment.
 *
 */
public interface IBackendServiceFactory {

  /**
   * Gets a handle to the backends API for the current running environment.
   *
   * @return An implementation of the backends API.
   */
   BackendService getBackendService();
}

// Copyright 2009 Google Inc.  All rights reserved.

package com.google.appengine.tools.development;

import com.google.apphosting.api.ApiProxy;

/**
 * Factory class for an {@link ApiProxy.Delegate} object configured to use local
 * services.
 *
 */
public class ApiProxyLocalFactory {
  LocalServerEnvironment localServerEnvironment;

  public ApiProxyLocalFactory() {
  }

  /**
   * Creates a new local proxy.
   * @param localServerEnvironment the local server env
   *
   * @return a new local proxy object
   */
  public ApiProxyLocal create(LocalServerEnvironment localServerEnvironment) {
    return new ApiProxyLocalImpl(localServerEnvironment);
  }
}

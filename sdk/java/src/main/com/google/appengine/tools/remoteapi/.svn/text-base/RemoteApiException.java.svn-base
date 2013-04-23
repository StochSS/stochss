// Copyright 2011 Google Inc. All Rights Reserved.

package com.google.appengine.tools.remoteapi;

import com.google.apphosting.api.ApiProxy;

/**
 * Indicates an internal exception in the remote API.
 *
 */
public class RemoteApiException extends ApiProxy.ApiProxyException {

  public RemoteApiException(String message, String packageName, String methodName,
      Throwable cause) {
    super(message, packageName, methodName);
    if (cause != null) {
      initCause(cause);
    }
  }
}

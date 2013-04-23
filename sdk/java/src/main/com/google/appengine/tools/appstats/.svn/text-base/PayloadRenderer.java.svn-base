// Copyright 2010 Google Inc. All Rights Reserved.

package com.google.appengine.tools.appstats;

/**
 * Represents an object that can turn a binary request payload into
 * a string that can be persisted in app stats.
 *
 * Thread safety: Implementations of this interface are expected to be
 * thread safe.
 *
 */
public interface PayloadRenderer {

  /**
   * Converts a binary payload into a string that can be stored with the app
   * stats information.
   * @param packageName the name of the package the rpc belongs to
   * @param methodName the name of the rpc method being invoked
   * @param payload the binary payload
   * @param isRequestPayload true if the payload is request data, false if it is
   *   response data.
   * @return the string that should be persisted in app stats.
   */
  String renderPayload(
      String packageName,
      String methodName,
      byte[] payload,
      boolean isRequestPayload);

}

// Copyright 2012 Google Inc. All Rights Reserved.

package com.google.appengine.api.socket;

import java.net.SocketException;

/**
 * A client of socket options.
 */
interface AppEngineSocketOptionsClient {
  void setSocketOptionAsBytes(AppEngineSocketOptions.Option option, byte[] value)
      throws SocketException;

  void setTimeout(int timeout);

  /**
   * Get socket option as bytes.
   * @throws SocketException
   */
  byte[] getSocketOptionAsBytes(AppEngineSocketOptions.Option option) throws SocketException;
}

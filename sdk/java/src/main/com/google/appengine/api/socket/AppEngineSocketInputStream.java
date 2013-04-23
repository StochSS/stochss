// Copyright 2012 Google Inc. All Rights Reserved.

package com.google.appengine.api.socket;

import java.io.IOException;
import java.io.InputStream;

/**
 */
class AppEngineSocketInputStream extends InputStream {
  final AppEngineSocketImpl socketImpl;

  AppEngineSocketInputStream(AppEngineSocketImpl socketImpl) {
    this.socketImpl = socketImpl;
  }

  /**
   * @see java.io.InputStream#read()
   */
  @Override
  public int read() throws IOException {
    byte buff[] = new byte[1];
    int count = read(buff, 0, 1);
    if (count <= 0) {
        return -1;
    }
    return buff[0] & 0xff;
  }

  /**
   * @see java.io.InputStream#read(byte[], int, int)
   */
  @Override
  public int read(byte b[], int off, int len) throws IOException {
    return socketImpl.receive(b, off, len);
  }

  /**
   * @see java.io.InputStream#available()
   */
  @Override
  public int available() throws IOException {
    return socketImpl.available();
  }
}

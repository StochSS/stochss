// Copyright 2012 Google Inc. All Rights Reserved.

package com.google.appengine.api.socket;

import java.io.IOException;
import java.io.OutputStream;

/**
 * A socket output stream.
 *
 */
class AppEngineSocketOutputStream extends OutputStream {
  final AppEngineSocketImpl socketImpl;

  AppEngineSocketOutputStream(AppEngineSocketImpl socket) {
    this.socketImpl = socket;
  }

  /**
   * @see java.io.OutputStream#write(int)
   */
  @Override
  public void write(int b) throws IOException {
    byte buf[] = { (byte) b };
    write(buf, 0, 1);
  }

  /**
   * @see java.io.OutputStream#write(byte[], int, int)
   */
  @Override
  public void write(byte buf[], int off, int len) throws IOException {
    socketImpl.send(buf, off, len);
  }

  /**
   * Closes the stream.
   */
  @Override
  public void close() throws IOException {
    socketImpl.close();
  }
}

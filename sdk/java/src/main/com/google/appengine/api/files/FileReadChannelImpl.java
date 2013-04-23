// Copyright 2011 Google Inc. All Rights Reserved.

package com.google.appengine.api.files;

import java.io.IOException;
import java.nio.ByteBuffer;
import java.nio.channels.ClosedChannelException;

/**
 * An implementation of {@code FileReadChannel}.
 *
 */
class FileReadChannelImpl implements FileReadChannel {

  private FileServiceImpl fileService;
  private AppEngineFile file;
  private long position;
  private boolean isOpen;
  private boolean reachedEOF;
  private final Object lock = new Object();

  FileReadChannelImpl(AppEngineFile f, FileServiceImpl fs) {
    this.file = f;
    this.fileService = fs;
    isOpen = true;
    reachedEOF = false;
    if (null == file) {
      throw new NullPointerException("file is null");
    }
    if (null == fs) {
      throw new NullPointerException("fs is null");
    }
    if (!f.isReadable()) {
      throw new IllegalArgumentException("file is not readable");
    }
  }

  private void checkOpen() throws ClosedChannelException {
    synchronized (lock) {
      if (!isOpen) {
        throw new ClosedChannelException();
      }
    }
  }

  /**
   * {@inheritDoc}
   * @throws ClosedChannelException
   */
  @Override
  public long position() throws ClosedChannelException {
    synchronized (lock) {
      checkOpen();
      return position;
    }
  }

  /**
   * {@inheritDoc}
   */
  @Override
  public FileReadChannel position(long newPosition) throws IOException {
    if (newPosition < 0) {
      throw new IllegalArgumentException("newPosition may not be negative");
    }
    synchronized (lock) {
      checkOpen();
      position = newPosition;
      reachedEOF = false;
      return this;
    }
  }

  /**
   * {@inheritDoc}
   */
  @Override
  public int read(ByteBuffer dst) throws IOException {
    synchronized (lock) {
      if (reachedEOF) {
        return -1;
      }
      int numBytesRead = fileService.read(file, dst, position);
      if (numBytesRead >= 0) {
        position += numBytesRead;
      } else {
        reachedEOF = true;
      }
      return numBytesRead;
    }
  }

  /**
   * {@inheritDoc}
   */
  @Override
  public boolean isOpen() {
    synchronized (lock) {
      return isOpen;
    }
  }

  /**
   * {@inheritDoc}
   */
  @Override
  public void close() throws IOException {
    synchronized (lock) {
      if (!isOpen) {
        return;
      }
      fileService.close(file, false);
      isOpen = false;
    }
  }
}

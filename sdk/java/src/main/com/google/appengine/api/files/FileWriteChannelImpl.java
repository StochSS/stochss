// Copyright 2011 Google Inc. All Rights Reserved.

package com.google.appengine.api.files;

import java.io.IOException;
import java.nio.ByteBuffer;
import java.nio.channels.ClosedChannelException;

/**
 * An implementation of {@code FileWriteChannel}.
 *
 */
class FileWriteChannelImpl implements FileWriteChannel {

  private FileServiceImpl fileService;
  private AppEngineFile file;
  private boolean lockHeld;
  private boolean isOpen;
  private final Object lock = new Object();

  FileWriteChannelImpl(AppEngineFile f, boolean lock, FileServiceImpl fs) {
    this.file = f;
    this.lockHeld = lock;
    this.fileService = fs;
    isOpen = true;
    if (null == file) {
      throw new NullPointerException("file is null");
    }
    if (!f.isWritable()) {
      throw new IllegalArgumentException("file is not writable");
    }
  }

  private void checkOpen() throws ClosedChannelException {
    if (!isOpen) {
      throw new ClosedChannelException();
    }
  }

  /**
   * {@inheritDoc}
   */
  @Override
  public int write(ByteBuffer src) throws IOException {
    synchronized (lock) {
      return write(src, null);
    }
  }

  /**
   * {@inheritDoc}
   */
  @Override
  public int write(ByteBuffer buffer, String sequenceKey) throws IOException {
    synchronized (lock) {
      checkOpen();
      return fileService.append(file, buffer, sequenceKey);
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

  /**
   * {@inheritDoc}
   */
  @Override
  public void closeFinally() throws IllegalStateException, IOException {
    synchronized (lock) {
      if (!lockHeld) {
        throw new IllegalStateException(
            "The lock for this file is not held by the current request");
      }
      if (isOpen) {
        fileService.close(file, true);
      } else {
        try {
          fileService.openForAppend(file, true);
          fileService.close(file, true);
        } catch (FinalizationException e) {
        }
      }
      isOpen = false;
    }
  }

}

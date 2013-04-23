// Copyright 2012 Google Inc. All rights reserved.

package com.google.appengine.api.files;

/**
 * A factory for producing instances of {@link FileService}.
 *
 */
final class FileServiceFactoryImpl implements IFileServiceFactory {
  /**
   * Returns an instance of {@link FileService}.
   */
  @Override
  public FileService getFileService() {
    return new FileServiceImpl();
  }
}

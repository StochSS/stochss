// Copyright 2011 Google Inc. All Rights Reserved.

package com.google.appengine.api.files;

import com.google.appengine.spi.ServiceFactoryFactory;

/**
 * A factory for producing instances of {@link FileService}.
 *
 */
public class FileServiceFactory {
  /**
   * Returns an instance of {@link FileService}.
   */
  public static FileService getFileService() {
    return getFactory().getFileService();
  }

  private static IFileServiceFactory getFactory() {
    return ServiceFactoryFactory.getFactory(IFileServiceFactory.class);
  }
}

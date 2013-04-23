// Copyright 2010 Google Inc. All Rights Reserved.
package com.google.appengine.tools.development.testing;

import com.google.appengine.api.files.dev.LocalFileService;

/**
 * Config for accessing the local file service in tests.
 *
 */
public final class LocalFileServiceTestConfig implements LocalServiceTestConfig {

  @Override
  public void setUp() {
    getLocalFileService();
  }

  @Override
  public void tearDown() {
    getLocalFileService().stop();
  }

  /**
   * Creates or returns the existing local file service.
   *
   * (The LocalServiceTestHelper will create the implementation if it does not already have one and
   * will return the existing one if it does.)
   */
  public static LocalFileService getLocalFileService() {
    return (LocalFileService) LocalServiceTestHelper.getLocalService(LocalFileService.PACKAGE);
  }
}

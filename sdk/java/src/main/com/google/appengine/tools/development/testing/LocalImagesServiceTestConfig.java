// Copyright 2009 Google Inc. All Rights Reserved.
package com.google.appengine.tools.development.testing;

import com.google.appengine.api.images.dev.LocalImagesService;

/**
 * Config for accessing the local images service in tests.
 *
 */
public class LocalImagesServiceTestConfig implements LocalServiceTestConfig {

  @Override
  public void setUp() {
  }

  @Override
  public void tearDown() {
  }

  public static LocalImagesService getLocalImagesService() {
    return (LocalImagesService) LocalServiceTestHelper.getLocalService(LocalImagesService.PACKAGE);
  }
}
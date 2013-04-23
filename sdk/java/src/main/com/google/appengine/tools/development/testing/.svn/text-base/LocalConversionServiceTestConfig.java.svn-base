// Copyright 2011 Google Inc. All Rights Reserved.
package com.google.appengine.tools.development.testing;

import com.google.appengine.api.conversion.dev.LocalConversionService;

/**
 * Config for accessing the local Conversion service in tests.
 *
 */
public final class LocalConversionServiceTestConfig
    implements LocalServiceTestConfig {

  @Override
  public void setUp() {}

  @Override
  public void tearDown() {}

  public static LocalConversionService getLocalConversionService() {
    return (LocalConversionService)
        LocalServiceTestHelper.getLocalService(LocalConversionService.PACKAGE);
  }
}

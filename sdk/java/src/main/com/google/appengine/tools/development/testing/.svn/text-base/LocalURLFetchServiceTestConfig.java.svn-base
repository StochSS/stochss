// Copyright 2009 Google Inc. All Rights Reserved.
package com.google.appengine.tools.development.testing;

import com.google.appengine.api.urlfetch.dev.LocalURLFetchService;

/**
 * Config for accessing the local url fetch service in tests.
 *
 */
public class LocalURLFetchServiceTestConfig implements LocalServiceTestConfig {

  @Override
  public void setUp() {
  }

  @Override
  public void tearDown() {
  }

  public static LocalURLFetchService getLocalURLFetchService() {
    return (LocalURLFetchService) LocalServiceTestHelper.getLocalService(
        LocalURLFetchService.PACKAGE);
  }
}

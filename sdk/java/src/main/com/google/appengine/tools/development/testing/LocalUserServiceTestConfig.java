// Copyright 2009 Google Inc. All Rights Reserved.
package com.google.appengine.tools.development.testing;

import com.google.appengine.api.users.dev.LocalUserService;

/**
 * Config for accessing the local user service in tests.
 *
 */
public class LocalUserServiceTestConfig implements LocalServiceTestConfig {

  @Override
  public void setUp() {
  }

  @Override
  public void tearDown() {
  }

  public static LocalUserService getLocalUserService() {
    return (LocalUserService) LocalServiceTestHelper.getLocalService(LocalUserService.PACKAGE);
  }
}
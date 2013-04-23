// Copyright 2011 Google Inc. All Rights Reserved.
package com.google.appengine.tools.development.testing;

import com.google.appengine.api.appidentity.dev.LocalAppIdentityService;

/**
 * Config for accessing the local app identity service in tests.
 *
 */
public class LocalAppIdentityServiceTestConfig implements LocalServiceTestConfig {

  @Override
  public void setUp() {}

  @Override
  public void tearDown() {}

  public static LocalAppIdentityService getLocalSecretsService() {
    return (LocalAppIdentityService)
        LocalServiceTestHelper.getLocalService(LocalAppIdentityService.PACKAGE);
  }
}

// Copyright 2009 Google Inc. All Rights Reserved.
package com.google.appengine.tools.development.testing;

import com.google.appengine.api.xmpp.dev.LocalXMPPService;

/**
 * Config for accessing the local xmpp service in tests.
 *
 */
public class LocalXMPPServiceTestConfig implements LocalServiceTestConfig {

  @Override
  public void setUp() {
  }

  @Override
  public void tearDown() {
  }

  public static LocalXMPPService getLocalXMPPService() {
    return (LocalXMPPService) LocalServiceTestHelper.getLocalService(LocalXMPPService.PACKAGE);
  }
}

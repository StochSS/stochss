// Copyright 2010 Google Inc. All rights reserved.

package com.google.appengine.tools.development.testing;

import com.google.appengine.api.channel.dev.LocalChannelService;

/**
 * Config for accessing the local channel service in tests.
 *
 */
public class LocalChannelServiceTestConfig implements LocalServiceTestConfig {

  @Override
  public void setUp() {
  }

  @Override
  public void tearDown() {
  }

  public static LocalChannelService getLocalChannelService() {
    String pkg = LocalChannelService.PACKAGE;
    return (LocalChannelService) LocalServiceTestHelper.getLocalService(pkg);
  }

}

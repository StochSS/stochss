// Copyright 2009 Google Inc. All Rights Reserved.
package com.google.appengine.tools.development.testing;

import com.google.appengine.api.capabilities.Capability;
import com.google.appengine.api.capabilities.CapabilityStatus;
import com.google.appengine.api.capabilities.dev.LocalCapabilitiesService;
import com.google.appengine.tools.development.ApiProxyLocal;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

/**
 * Config for accessing the local capabilities service in tests.
 *
 */
public class LocalCapabilitiesServiceTestConfig implements LocalServiceTestConfig {

  Map<String, String> properties = Collections.synchronizedMap(new HashMap<String, String>());

  @Override
  public void setUp() {
    ApiProxyLocal proxy = LocalServiceTestHelper.getApiProxyLocal();
    proxy.appendProperties(properties);
    LocalCapabilitiesService capabilityService = LocalCapabilitiesServiceTestConfig
        .getLocalCapabilitiesService();
  }

  @Override
  public void tearDown() {
    properties.clear();
  }

  /**
   * Controls the state of a capability in testing mode.
   *
   * @param capability the {@link Capability} to change the status of
   * @param status     the {@CapabilityStatus} to set for the given Capability
   * @return {@code this} (for chaining)
   */
  public LocalCapabilitiesServiceTestConfig setCapabilityStatus(Capability capability,
      CapabilityStatus status) {
    String key = LocalCapabilitiesService.geCapabilityPropertyKey(capability.getPackageName(),
        capability.getName());
    properties.put(key, status.name());
    return this;
  }

  public static LocalCapabilitiesService getLocalCapabilitiesService() {
    return (LocalCapabilitiesService) LocalServiceTestHelper
        .getLocalService(LocalCapabilitiesService.PACKAGE);
  }
}

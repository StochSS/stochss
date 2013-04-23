// Copyright 2011 Google Inc. All rights reserved.
package com.google.appengine.api.appidentity;

import com.google.appengine.spi.ServiceFactoryFactory;

/**
 * Creates new instances of the App identity service.
 *
 */
public final class AppIdentityServiceFactory {
  private AppIdentityServiceFactory() {}

  public static AppIdentityService getAppIdentityService() {
    return getFactory().getAppIdentityService();
  }

  private static IAppIdentityServiceFactory getFactory() {
    return ServiceFactoryFactory.getFactory(IAppIdentityServiceFactory.class);
  }
}

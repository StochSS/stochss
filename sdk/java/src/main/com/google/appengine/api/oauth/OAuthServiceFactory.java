// Copyright 2010 Google Inc. All rights reserved.

package com.google.appengine.api.oauth;

import com.google.appengine.spi.ServiceFactoryFactory;

/**
 * Creates an OAuthService.
 *
 */
public final class OAuthServiceFactory {
  /**
   * Creates an implementation of the OAuthService.
   */
  public static OAuthService getOAuthService() {
    return getFactory().getOAuthService();
  }

  private OAuthServiceFactory() {
  }

  private static IOAuthServiceFactory getFactory() {
    return ServiceFactoryFactory.getFactory(IOAuthServiceFactory.class);
  }
}

// Copyright 2007 Google Inc. All rights reserved.

package com.google.appengine.api.users;

import com.google.appengine.spi.ServiceFactoryFactory;

/**
 * Creates a UserService.
 *
 */
public final class UserServiceFactory {

  /**
   * Creates an implementation of the UserService.
   */
  public static UserService getUserService() {
    return getFactory().getUserService();
  }

  private UserServiceFactory() {}

  private static IUserServiceFactory getFactory() {
    return ServiceFactoryFactory.getFactory(IUserServiceFactory.class);
  }

}

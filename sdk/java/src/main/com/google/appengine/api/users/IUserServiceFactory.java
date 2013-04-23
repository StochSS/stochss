// Copyright 2012 Google Inc. All rights reserved.

package com.google.appengine.api.users;

/**
 * This interface should be implemented by providers of the {@link UserService} and registered with
 * {@link com.google.appengine.spi.ServiceFactoryFactory}.
 *
 */
public interface IUserServiceFactory {

  /**
   * Creates an implementation of the UserService.
   */
  UserService getUserService();

}

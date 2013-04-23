// Copyright 2012 Google Inc. All rights reserved.

package com.google.appengine.api.users;

/**
 * Creates a UserService.
 *
 */
final class UserServiceFactoryImpl implements IUserServiceFactory {

  @Override
  public UserService getUserService() {
    return new UserServiceImpl();
  }

}

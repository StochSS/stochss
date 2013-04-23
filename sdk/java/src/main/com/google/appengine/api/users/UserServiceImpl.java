// Copyright 2007 Google Inc. All rights reserved.

package com.google.appengine.api.users;

import com.google.apphosting.api.ApiProxy;
import com.google.apphosting.api.UserServicePb.CreateLoginURLRequest;
import com.google.apphosting.api.UserServicePb.CreateLoginURLResponse;
import com.google.apphosting.api.UserServicePb.CreateLogoutURLRequest;
import com.google.apphosting.api.UserServicePb.CreateLogoutURLResponse;
import com.google.apphosting.api.UserServicePb.UserServiceError;
import com.google.io.protocol.ProtocolMessage;

import java.util.Set;

/**
 * The UserService provides information useful for forcing a user to
 * log in or out, and retrieving information about the user who is
 * currently logged-in.
 *
 */
final class UserServiceImpl implements UserService {
  static final String USER_ID_KEY =
      "com.google.appengine.api.users.UserService.user_id_key";

  static final String FEDERATED_IDENTITY_KEY =
    "com.google.appengine.api.users.UserService.federated_identity";

  static final String FEDERATED_AUTHORITY_KEY =
    "com.google.appengine.api.users.UserService.federated_authority";

  static final String IS_FEDERATED_USER_KEY =
    "com.google.appengine.api.users.UserService.is_federated_user";

  private static final String PACKAGE = "user";
  private static final String LOGIN_URL_METHOD = "CreateLoginURL";
  private static final String LOGOUT_URL_METHOD = "CreateLogoutURL";

  public String createLoginURL(String destinationURL) {
    return createLoginURL(destinationURL, null, null, null);
  }

  public String createLoginURL(String destinationURL,
                               String authDomain) {
    return createLoginURL(destinationURL, authDomain, null, null);
  }

  public String createLoginURL(String destinationURL,
                               String authDomain,
                               String federatedIdentity,
                               Set<String> attributesRequest) {
    CreateLoginURLRequest request = new CreateLoginURLRequest();
    request.setDestinationUrl(destinationURL);
    if (authDomain != null) {
      request.setAuthDomain(authDomain);
    }
    if (federatedIdentity != null) {
      request.setFederatedIdentity(federatedIdentity);
    }
    byte[] responseBytes = makeSyncCall(LOGIN_URL_METHOD, request,
                                        destinationURL);
    CreateLoginURLResponse response = new CreateLoginURLResponse();
    response.mergeFrom(responseBytes);
    return response.getLoginUrl();
  }

  public String createLogoutURL(String destinationURL) {
    return createLogoutURL(destinationURL, null);
  }

  public String createLogoutURL(String destinationURL,
                                String authDomain) {
    CreateLogoutURLRequest request = new CreateLogoutURLRequest();
    request.setDestinationUrl(destinationURL);
    if (authDomain != null) {
      request.setAuthDomain(authDomain);
    }
    byte[] responseBytes = makeSyncCall(LOGOUT_URL_METHOD, request,
                                        destinationURL);
    CreateLogoutURLResponse response = new CreateLogoutURLResponse();
    response.mergeFrom(responseBytes);
    return response.getLogoutUrl();
  }

  public boolean isUserLoggedIn() {
    ApiProxy.Environment environment = ApiProxy.getCurrentEnvironment();
    return environment.isLoggedIn();
  }

  public boolean isUserAdmin() {
    if (isUserLoggedIn()) {
      return ApiProxy.getCurrentEnvironment().isAdmin();
    } else {
      throw new IllegalStateException("The current user is not logged in.");
    }
  }

  public User getCurrentUser() {
    ApiProxy.Environment environment = ApiProxy.getCurrentEnvironment();
    if (!environment.isLoggedIn()) {
      return null;
    }
    String userId = (String) environment.getAttributes().get(USER_ID_KEY);
    Boolean isFederated = (Boolean) environment.getAttributes().get(IS_FEDERATED_USER_KEY);
    if ((isFederated == null) || !isFederated) {
        return new User(environment.getEmail(), environment.getAuthDomain(), userId);
    } else {
      return new User(environment.getEmail(),
          (String) environment.getAttributes().get(FEDERATED_AUTHORITY_KEY),
          userId,
          (String) environment.getAttributes().get(FEDERATED_IDENTITY_KEY));
    }
  }

  private byte[] makeSyncCall(String methodName,
                              ProtocolMessage request,
                              String destinationURL) {
    byte[] responseBytes;
    try {
      byte[] requestBytes = request.toByteArray();
      responseBytes = ApiProxy.makeSyncCall(PACKAGE, methodName, requestBytes);
    } catch (ApiProxy.ApplicationException ex) {
      UserServiceError.ErrorCode errorCode =
          UserServiceError.ErrorCode.valueOf(ex.getApplicationError());
      switch (errorCode) {
        case REDIRECT_URL_TOO_LONG:
          throw new IllegalArgumentException("URL too long: " + destinationURL);
        case NOT_ALLOWED:
          throw new IllegalArgumentException("The requested URL was not allowed: " +
                                             destinationURL);
        default:
          throw new UserServiceFailureException(ex.getErrorDetail());
      }
    }

    return responseBytes;
  }
}

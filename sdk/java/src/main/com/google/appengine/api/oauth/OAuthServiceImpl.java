// Copyright 2010 Google Inc. All rights reserved.

package com.google.appengine.api.oauth;

import com.google.appengine.api.users.User;
import com.google.apphosting.api.ApiProxy;
import com.google.apphosting.api.UserServicePb.CheckOAuthSignatureRequest;
import com.google.apphosting.api.UserServicePb.CheckOAuthSignatureResponse;
import com.google.apphosting.api.UserServicePb.GetOAuthUserRequest;
import com.google.apphosting.api.UserServicePb.GetOAuthUserResponse;
import com.google.apphosting.api.UserServicePb.UserServiceError;
import com.google.common.base.Objects;
import com.google.io.protocol.ProtocolMessage;

/**
 * Implementation of {@link OAuthService}.
 *
 */
final class OAuthServiceImpl implements OAuthService {
  static final String GET_OAUTH_USER_RESPONSE_KEY =
      "com.google.appengine.api.oauth.OAuthService.get_oauth_user_response";
  static final String GET_OAUTH_USER_SCOPE_KEY =
      "com.google.appengine.api.oauth.OAuthService.get_oauth_user_scope";

  private static final String PACKAGE = "user";
  private static final String CHECK_SIGNATURE_METHOD = "CheckOAuthSignature";
  private static final String GET_OAUTH_USER_METHOD = "GetOAuthUser";

  public User getCurrentUser() throws OAuthRequestException {
    return getCurrentUser(null);
  }

  public User getCurrentUser(String scope) throws OAuthRequestException {
    GetOAuthUserResponse response = getGetOAuthUserResponse(scope);
    return new User(response.getEmail(), response.getAuthDomain(),
        response.getUserId());
  }

  public boolean isUserAdmin() throws OAuthRequestException {
    return isUserAdmin(null);
  }

  public boolean isUserAdmin(String scope) throws OAuthRequestException {
    return getGetOAuthUserResponse(scope).isIsAdmin();
  }

  public String getOAuthConsumerKey() throws OAuthRequestException {
    CheckOAuthSignatureRequest request = new CheckOAuthSignatureRequest();
    byte[] responseBytes = makeSyncCall(CHECK_SIGNATURE_METHOD, request);
    CheckOAuthSignatureResponse response = new CheckOAuthSignatureResponse();
    response.mergeFrom(responseBytes);
    return response.getOauthConsumerKey();
  }

  private GetOAuthUserResponse getGetOAuthUserResponse(String scope)
      throws OAuthRequestException {
    if (scope == null) {
      scope = "";
    }
    ApiProxy.Environment environment = ApiProxy.getCurrentEnvironment();
    GetOAuthUserResponse response = (GetOAuthUserResponse)
        environment.getAttributes().get(GET_OAUTH_USER_RESPONSE_KEY);
    String lastScope = (String) environment.getAttributes().get(GET_OAUTH_USER_SCOPE_KEY);
    if (response == null || !Objects.equal(lastScope, scope)) {
      GetOAuthUserRequest request = new GetOAuthUserRequest();
      if (!scope.isEmpty()) {
        request.setScope(scope);
      }
      byte[] responseBytes = makeSyncCall(GET_OAUTH_USER_METHOD, request);
      response = new GetOAuthUserResponse();
      response.mergeFrom(responseBytes);
      environment.getAttributes().put(GET_OAUTH_USER_RESPONSE_KEY, response);
      environment.getAttributes().put(GET_OAUTH_USER_SCOPE_KEY, scope);
    }
    return response;
  }

  private byte[] makeSyncCall(String methodName, ProtocolMessage request)
      throws OAuthRequestException {
    byte[] responseBytes;
    try {
      byte[] requestBytes = request.toByteArray();
      responseBytes = ApiProxy.makeSyncCall(PACKAGE, methodName, requestBytes);
    } catch (ApiProxy.ApplicationException ex) {
      UserServiceError.ErrorCode errorCode =
          UserServiceError.ErrorCode.valueOf(ex.getApplicationError());
      switch (errorCode) {
        case NOT_ALLOWED:
        case OAUTH_INVALID_REQUEST:
          throw new InvalidOAuthParametersException(ex.getErrorDetail());
        case OAUTH_INVALID_TOKEN:
          throw new InvalidOAuthTokenException(ex.getErrorDetail());
        case OAUTH_ERROR:
        default:
          throw new OAuthServiceFailureException(ex.getErrorDetail());
      }
    }

    return responseBytes;
  }

  @Override
  public String getClientId(String scope) throws OAuthRequestException {
    GetOAuthUserResponse response = getGetOAuthUserResponse(scope);
    return response.getClientId();
  }
}

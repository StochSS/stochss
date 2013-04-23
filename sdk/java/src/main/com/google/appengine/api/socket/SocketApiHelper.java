// Copyright 2012 Google Inc. All Rights Reserved.

package com.google.appengine.api.socket;

import com.google.appengine.api.socket.SocketServicePb.RemoteSocketServiceError;
import com.google.appengine.api.socket.SocketServicePb.RemoteSocketServiceError.ErrorCode;
import com.google.apphosting.api.ApiProxy;
import com.google.io.protocol.ProtocolMessage;

import java.io.Serializable;
import java.net.SocketException;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 */
class SocketApiHelper implements Serializable {
  static final String PACKAGE = "remote_socket";

  private static final Pattern MESSAGE_PATTERN = Pattern.compile(
      "system_error:\\s*(-?\\d+)\\s*,?\\s*error_detail:\\s*\"([^\"]*)\"\\s*");
  static void parseErrorDetail(CharSequence string, RemoteSocketServiceError serviceError) {
    Matcher matcher = MESSAGE_PATTERN.matcher(string);
    if (!matcher.matches()) {
      return;
    }

    serviceError.setErrorDetail(matcher.group(2));
    serviceError.setSystemError(Integer.parseInt(matcher.group(1)));
  }

  /**
   * Make an appserver call and optionally return transform certain
   * application errors into the passed in serviceError.
   * @param <T> The request type.
   * @param <V> The response type.
   * @param method The service method to call.
   * @param request The request proto buffer.
   * @param response The response proto buffer.
   * @param serviceError The system error proto buffer.  May be null if
   *     not the client is not interested.
   * @return True if the request was successful, otherwise false only if the
   *     error is represented in the serviceError object. Other errors will
   *     throw an appropriate exception. If serviceError is null it will
   *     always throw on error.
   * @throws SocketException
   */
  <T extends ProtocolMessage<T>, V extends ProtocolMessage<V>> boolean makeSyncCall(
      String method, T request, V response,
      RemoteSocketServiceError serviceError) throws SocketException {
    try {
      byte[] responseBytes = apiProxyMakeSyncCall(method, request.toByteArray());
      if (responseBytes != null) {
        response.mergeFrom(responseBytes);
      }
      return true;
    } catch (ApiProxy.ApplicationException exception) {
      if (serviceError != null) {
        ErrorCode errorCode =
            RemoteSocketServiceError.ErrorCode.valueOf(exception.getApplicationError());
        switch (errorCode) {
          case SYSTEM_ERROR:
          case GAI_ERROR: {
            parseErrorDetail(exception.getErrorDetail(), serviceError);
            if (serviceError.hasErrorDetail() || serviceError.hasSystemError()) {
              return false;
            }
          }
        }
      }
      throw translateError(exception);
    } catch (ApiProxy.ApiDeadlineExceededException e) {
      throw new SocketException("Socket operation timed out: " + e.getMessage());
    }
  }

  byte[] apiProxyMakeSyncCall(String method, byte[] request) {
    return ApiProxy.makeSyncCall(PACKAGE, method, request);
  }

  static SocketException translateError(int error, String detail) {
    ErrorCode errorCode = RemoteSocketServiceError.ErrorCode.valueOf(error);

    switch (errorCode) {
      case SYSTEM_ERROR:
        return new SocketException("System error: " + detail);
      case GAI_ERROR:
        return new SocketException("Resolver error: " + detail);
      case SSL_ERROR:
        return new SocketException("SSL Error: " + detail);
      case FAILURE:
        return new SocketException("Operation failure: " + detail);
      case PERMISSION_DENIED:
        return new SocketException("Permission denied: " + detail);
      case INVALID_REQUEST:
        return new SocketException("Invalid request: " + detail);
      case SOCKET_CLOSED:
        return new SocketException("Socket is closed: " + detail);
      default:
        return new SocketException("Unspecified error (" + errorCode + ") : " + detail);
    }
  }

  static SocketException translateError(ApiProxy.ApplicationException exception) {
    return translateError(exception.getApplicationError(), exception.getErrorDetail());
  }
}

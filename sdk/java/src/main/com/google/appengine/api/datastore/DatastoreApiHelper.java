// Copyright 2008 Google Inc. All Rights Reserved.
package com.google.appengine.api.datastore;

import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.utils.FutureWrapper;
import com.google.apphosting.api.ApiProxy;
import com.google.apphosting.api.ApiProxy.ApiConfig;
import com.google.apphosting.api.DatastorePb.Error;
import com.google.io.protocol.ProtocolMessage;

import java.util.ConcurrentModificationException;
import java.util.concurrent.Future;

/**
 * Helper methods and constants shared by classes that implement the java api
 * on top of the datastore.
 * Note: user should not access this class directly.
 *
 */
public final class DatastoreApiHelper {

  static final String PACKAGE = "datastore_v3";

  private DatastoreApiHelper() {}

  public static RuntimeException translateError(ApiProxy.ApplicationException exception) {
    Error.ErrorCode errorCode = Error.ErrorCode.valueOf(exception.getApplicationError());
    if (errorCode == null) {
      return new DatastoreFailureException(exception.getErrorDetail());
    }
    switch (errorCode) {
      case BAD_REQUEST:
        return new IllegalArgumentException(exception.getErrorDetail());

      case CONCURRENT_TRANSACTION:
        return new ConcurrentModificationException(exception.getErrorDetail());

      case NEED_INDEX:
        return new DatastoreNeedIndexException(exception.getErrorDetail());

      case TIMEOUT:
      case BIGTABLE_ERROR:
        return new DatastoreTimeoutException(exception.getErrorDetail());

      case COMMITTED_BUT_STILL_APPLYING:
        return new CommittedButStillApplyingException(exception.getErrorDetail());

      case INTERNAL_ERROR:
      default:
        return new DatastoreFailureException(exception.getErrorDetail());
    }
  }

  static <T extends ProtocolMessage<T>> Future<T> makeAsyncCall(ApiConfig apiConfig, String method,
      ProtocolMessage<?> request, final T responseProto) {
    Future<byte[]> response =
        ApiProxy.makeAsyncCall(PACKAGE, method, request.toByteArray(), apiConfig);
    return new FutureWrapper<byte[], T>(response) {
      @Override
      protected T wrap(byte[] responseBytes) {
        if (responseBytes != null) {
          responseProto.parseFrom(responseBytes);
        }
        return responseProto;
      }

      @Override
      protected Throwable convertException(Throwable cause) {
        if (cause instanceof ApiProxy.ApplicationException) {
          return translateError((ApiProxy.ApplicationException) cause);
        }
        return cause;
      }
    };
  }

  static String getCurrentAppId() {
    ApiProxy.Environment environment = ApiProxy.getCurrentEnvironment();
    if (environment == null) {
      throw new NullPointerException("No API environment is registered for this thread.");
    }
    return environment.getAppId();
  }

  /**
   * Returns a new {@link AppIdNamespace} with the current appId and the namespace
   * registered with the {@link NamespaceManager}
   */
  static AppIdNamespace getCurrentAppIdNamespace() {
    return getCurrentAppIdNamespace(getCurrentAppId());
  }

  /**
   * Returns a new {@link AppIdNamespace} with the namespace currently
   * registered with the {@link NamespaceManager} for a given appid.
   */
  static AppIdNamespace getCurrentAppIdNamespace(String appId) {
    String namespace = NamespaceManager.get();
    namespace = namespace == null ? "" : namespace;
    return new AppIdNamespace(appId, namespace);
  }
}

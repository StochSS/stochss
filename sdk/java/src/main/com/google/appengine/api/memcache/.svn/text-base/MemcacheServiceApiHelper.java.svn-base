// Copyright 2011 Google Inc. All Rights Reserved.
package com.google.appengine.api.memcache;

import com.google.appengine.api.utils.FutureWrapper;
import com.google.apphosting.api.ApiProxy;
import com.google.common.base.Throwables;
import com.google.protobuf.InvalidProtocolBufferException;
import com.google.protobuf.Message;
import com.google.protobuf.Message.Builder;

import java.util.concurrent.Future;
import java.util.logging.Logger;

/**
 * Helper methods and constants shared by classes that implement the java api
 * of MemcacheService.
 *
 */
class MemcacheServiceApiHelper {

  static final String PACKAGE = "memcache";
  private static final Logger logger = Logger.getLogger(MemcacheServiceApiHelper.class.getName());

  private MemcacheServiceApiHelper() {
  }

  public interface Provider<T> {
    T get();
  }

  interface Transformer<F, T> {
    T transform(F from);
  }

  /**
   * An RPC response handler to convert an ApiProxy rpc response
   * (byte[] or exceptions) to an API level response.
   */
  static class RpcResponseHandler<M extends Message, T> {

    private final String errorText;
    private final Builder builder;
    private final Transformer<M, T> responseTransfomer;
    private final ErrorHandler errorHandler;

    RpcResponseHandler(M response, String errorText,
        Transformer<M, T> responseTransfomer, ErrorHandler errorHandler) {
      this.builder = response.newBuilderForType();
      this.errorText = errorText;
      this.responseTransfomer = responseTransfomer;
      this.errorHandler = errorHandler;
    }

    T convertResponse(byte[] responseBytes) throws InvalidProtocolBufferException {
      @SuppressWarnings("unchecked")
      M response = (M) builder.mergeFrom(responseBytes).build();
      return responseTransfomer.transform(response);
    }

    void handleApiProxyException(Throwable cause) throws Exception {
      try {
        throw cause;
      } catch (InvalidProtocolBufferException ex) {
        errorHandler.handleServiceError(
            new MemcacheServiceException("Could not decode response:", ex));
      } catch (ApiProxy.ApplicationException ex) {
        logger.info(errorText + ": " + ex.getErrorDetail());
        errorHandler.handleServiceError(new MemcacheServiceException(errorText));
      } catch (ApiProxy.ApiProxyException ex) {
        errorHandler.handleServiceError(new MemcacheServiceException(errorText, ex));
      } catch (MemcacheServiceException ex) {
        if (errorHandler instanceof ConsistentErrorHandler) {
          errorHandler.handleServiceError(ex);
        } else {
          throw ex;
        }
      } catch (Throwable ex) {
        Throwables.propagateIfInstanceOf(ex, Exception.class);
        Throwables.propagate(ex);
      }
    }

    Logger getLogger() {
      return logger;
    }
  }

  /**
   * Issue an async rpc against the memcache package with the given request and
   * response pbs as input and apply standard exception handling.  Do not
   * use this helper function if you need non-standard exception handling.
   */
  static <M extends Message, T> Future<T> makeAsyncCall(String methodName, Message request,
      final RpcResponseHandler<M, T> responseHandler, final Provider<T> defaultValue) {
    Future<byte[]> asyncResp = ApiProxy.makeAsyncCall(PACKAGE, methodName, request.toByteArray());
    return new FutureWrapper<byte[], T>(asyncResp) {

      @Override
      protected T wrap(byte[] bytes) throws Exception {
        try {
          return bytes == null ? null : responseHandler.convertResponse(bytes);
        } catch (Exception ex) {
          return absorbParentException(ex);
        }
      }

      @Override
      protected T absorbParentException(Throwable cause) throws Exception {
        responseHandler.handleApiProxyException(cause);
        return defaultValue.get();
      }

      @Override
      protected Throwable convertException(Throwable cause) {
        return cause;
      }
    };
  }
}

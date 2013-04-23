// Copyright 2010 Google Inc. All rights reserved.
package com.google.appengine.api.search;

import com.google.appengine.api.utils.FutureWrapper;
import com.google.apphosting.api.ApiProxy;
import com.google.protobuf.GeneratedMessage;
import com.google.protobuf.InvalidProtocolBufferException;

import java.util.concurrent.Future;

/**
 * Provides support for translation of calls between userland and appserver
 * land.
 *
 */
class SearchApiHelper {

  private static final String PACKAGE = "search";

  /**
   * Makes an asynchronous call.
   *
   * @param method the method on the API to call
   * @param request the request to forward to the API
   * @param responseBuilder the response builder used to fill the response
   * from the call
   */
  <T extends GeneratedMessage.Builder<T>>
  Future<T> makeAsyncCall(String method, GeneratedMessage request, final T responseBuilder) {
    Future<byte[]> response =
        ApiProxy.makeAsyncCall(PACKAGE, method, request.toByteArray());
    return new FutureWrapper<byte[], T>(response) {
      @Override
      protected T wrap(byte[] responseBytes) {
        if (responseBytes != null) {
          try {
            responseBuilder.mergeFrom(responseBytes);
          } catch (InvalidProtocolBufferException e) {
            throw new SearchServiceException(e.toString());
          }
        }
        return responseBuilder;
      }

      @Override
      protected Throwable convertException(Throwable cause) {
        return cause;
      }
    };
  }
}

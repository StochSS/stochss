// Copyright 2011 Google Inc. All Rights Reserved.

package com.google.appengine.tools.remoteapi;

import com.google.apphosting.utils.remoteapi.RemoteApiPb;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.ObjectInputStream;
import java.util.ConcurrentModificationException;
import java.util.logging.Logger;

/**
 * An RPC transport that sends protocol buffers over HTTP.
 */
class RemoteRpc {
  private static final Logger logger = Logger.getLogger(RemoteRpc.class.getName());

  private final AppEngineClient client;
  private int rpcCount = 0;

  RemoteRpc(AppEngineClient client) {
    this.client = client;
  }

  /**
   * Makes an RPC call using the injected RemoteRpc instance. Logs how long it took and
   * any exceptions.
   * @throws RemoteApiException if the RPC fails.
   * @throws RuntimeException if the server threw a Java runtime exception
   */
  byte[] call(String serviceName, String methodName, String logSuffix, byte[] request) {
    logger.fine("remote API call: " + serviceName + "." + methodName + logSuffix);

    long startTime = System.currentTimeMillis();
    try {

      RemoteApiPb.Request requestProto = makeRequest(serviceName, methodName, request);
      RemoteApiPb.Response responseProto = callImpl(requestProto);

      if (responseProto.hasJavaException()) {
        logger.fine("remote API call: failed due to a server-side Java exception");
        Object contents = parseJavaException(responseProto,
            requestProto.getServiceName(), requestProto.getMethod());
        if (contents instanceof ConcurrentModificationException) {
          ConcurrentModificationException serverSide = (ConcurrentModificationException) contents;
          ConcurrentModificationException clientSide =
              new ConcurrentModificationException(serverSide.getMessage());
          clientSide.initCause(serverSide);
          throw clientSide;
        } else if (contents instanceof IllegalArgumentException) {
          IllegalArgumentException serverSide = (IllegalArgumentException) contents;
          throw new IllegalArgumentException(serverSide.getMessage(), serverSide);
        } else if (contents instanceof RuntimeException) {
            throw (RuntimeException) contents;
        } else if (contents instanceof Throwable) {
          throw new RemoteApiException("response was an exception",
              requestProto.getServiceName(), requestProto.getMethod(), (Throwable) contents);
        } else {
          throw new RemoteApiException("unexpected response type: " + contents.getClass(),
              requestProto.getServiceName(), requestProto.getMethod(), null);
        }
      } else if (responseProto.hasException()) {
        String pickle = responseProto.getException();

        logger.fine("remote API call: failed due to a server-side Python exception:\n" + pickle);
        throw new RemoteApiException("response was a python exception:\n" + pickle,
            requestProto.getServiceName(), requestProto.getMethod(), null);
      }

      return responseProto.getResponseAsBytes();

    } finally {
      long elapsedTime = System.currentTimeMillis() - startTime;
      logger.fine("remote API call: took " + elapsedTime + " ms");
    }
  }

  RemoteApiPb.Response callImpl(RemoteApiPb.Request requestProto) {
    rpcCount++;

    byte[] requestBytes = requestProto.toByteArray();

    AppEngineClient.Response httpResponse;
    try {
      String path = client.getRemoteApiPath();
      httpResponse = client.post(path, "application/octet-stream", requestBytes);
    } catch (IOException e) {
      throw makeException("I/O error", e, requestProto);
    }

    if (httpResponse.getStatusCode() != 200) {
      throw makeException("unexpected HTTP response: " + httpResponse.getStatusCode(),
          null, requestProto);
    }

    RemoteApiPb.Response parsedResponse = new RemoteApiPb.Response();
    parsedResponse.parseFrom(httpResponse.getBodyAsBytes());
    return parsedResponse;
  }

  void resetRpcCount() {
    rpcCount = 0;
  }

  int getRpcCount() {
    return rpcCount;
  }

  private static RemoteApiPb.Request makeRequest(String packageName, String methodName,
      byte[] payload) {
    RemoteApiPb.Request result = new RemoteApiPb.Request();
    result.setServiceName(packageName);
    result.setMethod(methodName);
    result.setRequestAsBytes(payload);

    return result;
  }

  private static Object parseJavaException(RemoteApiPb.Response parsedResponse, String packageName,
      String methodName) {
    try {
      InputStream ins = new ByteArrayInputStream(parsedResponse.getJavaExceptionAsBytes());
      ObjectInputStream in = new ObjectInputStream(ins);
      return in.readObject();
    } catch (IOException e) {
      throw new RemoteApiException(
          "remote API call: " + "can't deserialize server-side exception", packageName, methodName,
          e);
    } catch (ClassNotFoundException e) {
      throw new RemoteApiException(
          "remote API call: " + "can't deserialize server-side exception", packageName, methodName,
          e);
    }
  }

  private static RemoteApiException makeException(String message, Throwable cause,
      RemoteApiPb.Request request) {
    logger.fine("remote API call: " + message);
    return new RemoteApiException("remote API call: " + message,
        request.getServiceName(), request.getMethod(), cause);
  }

  AppEngineClient getClient() {
    return client;
  }
}

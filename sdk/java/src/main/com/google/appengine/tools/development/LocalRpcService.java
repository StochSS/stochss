// Copyright 2008 Google Inc. All Rights Reserved.

package com.google.appengine.tools.development;

import java.util.Map;

/**
 * A local implementation of an RPC service. Services adheres to the following
 * method convention:
 * <pre>
 * {@code <Request extends ProtocolMessage, Response extends ProtocolMessage>}
 * Response methodName(Status status, Request request)
 * </pre>
 *
 * For example,
 <pre>
 public class DatabaseService {
   public GetResponse get(Status status, GetRequest req) throws RpcException;
   public PutResponse put(Status status, PutRequest req) throws RpcException;
   // ...
 }
 </pre>
 *
 * {@link DevAppServer} discovers {@code LocalRpcServices} implementations with
 * {@link java.util.ServiceLoader}.
 *
 */
public interface LocalRpcService {

  /**
   * The RPC status code.
   */
  public class Status {
    private boolean successful = true;
    private int errorCode;

    public void setSuccessful(boolean successful) {
      this.successful = successful;
    }

    public boolean isSuccessful() {
      return successful;
    }

    public int getErrorCode() {
      return errorCode;
    }

    public void setErrorCode(int errorCode) {
      this.errorCode = errorCode;
    }
  }

  /**
   * Returns the package for the service, for example, "datastore_v3".
   *
   * @return a not {@code null} package name.
   */
  String getPackage();

  /**
   * Initializes the service with a set of configuration properties.
   * Must be called before a service is {@link #start started}.
   *
   * @param context A context object for the application
   * @param properties A read-only {@code Map} of properties.
   */
  void init(LocalServiceContext context, Map<String, String> properties);

  /**
   * Puts a new service into "serving" mode. Aside from setting
   * properties, the service is not functional until after having been
   * started.
   */
  void start();

  /**
   * Stops the service, releasing all of its resources.
   */
  void stop();

  /**
   * Return the number of seconds that should be used as a deadline
   * for each API call if no other deadline is requested by the user.
   * This method may return {@code null} if the service has no opinion
   * about the deadline, in which case a global deadline will be used
   * instead.
   */
  Double getDefaultDeadline(boolean isOfflineRequest);

  /**
   * Return the maximum number of seconds that is allowed as a
   * deadline for each API call.  The user cannot request a deadline
   * higher than this value.  This method may return {@code null} if
   * the service has no opinion about the maximum deadline, in which
   * case a global maximum deadline will be used instead.
   */
  Double getMaximumDeadline(boolean isOfflineRequest);

  /**
   * Returns the maximum size of an encoded API request in bytes, or
   * {@code null} for the default size.
   */
  Integer getMaxApiRequestSize();
}

// Copyright 2010 Google Inc. All Rights Reserved.

package com.google.appengine.tools.remoteapi;

import com.google.apphosting.api.ApiProxy.Delegate;
import com.google.apphosting.api.ApiProxy.Environment;

/**
 * Handles App Engine API calls by making HTTP requests to a remote server.
 * The exact mechanism by which the requests are made is an implementation
 * detail of subclasses.  Users of this class are expected to call
 * {@link #shutdown()} when they are done with an instance.
 *
 */
abstract class RemoteApiDelegate implements Delegate<Environment> {
  private final RemoteRpc remoteRpc;
  private final RemoteDatastore remoteDatastore;

  /**
   * Factory method.
   */
  public static RemoteApiDelegate newInstance(RemoteRpc remoteRpc, RemoteApiOptions options, Delegate<Environment> containerDelegate) {
    return containerDelegate != null ?
        new HostedRemoteApiDelegate(remoteRpc, options, containerDelegate) :
        new StandaloneRemoteApiDelegate(remoteRpc, options);
  }

  /**
   * Do not call directly, use
   * {@link #newInstance(RemoteRpc, RemoteApiOptions, Delegate)} instead.
   */
  RemoteApiDelegate(RemoteRpc rpc, RemoteApiOptions options) {
    this.remoteRpc = rpc;
    this.remoteDatastore = new RemoteDatastore(remoteRpc, options);
  }

  void resetRpcCount() {
    remoteRpc.resetRpcCount();
  }

  int getRpcCount() {
    return remoteRpc.getRpcCount();
  }

  final byte[] makeDefaultSyncCall(
      Environment env, String serviceName, String methodName, byte[] request) {
    if (serviceName.equals(RemoteDatastore.DATASTORE_SERVICE)) {
      return remoteDatastore.handleDatastoreCall(methodName, request);
    } else {
      return remoteRpc.call(serviceName, methodName, "", request);
    }
  }

  /**
   * Perform any necessary clean up and shut down.
   */
  public abstract void shutdown();
}

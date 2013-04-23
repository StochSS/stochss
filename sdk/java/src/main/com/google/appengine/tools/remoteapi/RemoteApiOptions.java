// Copyright 2010 Google Inc. All Rights Reserved.

package com.google.appengine.tools.remoteapi;

/**
 * A mutable object containing settings for installing the remote API.
 *
 * <p>Example for connecting to a development app server:</p>
 *
 * <pre>
 * RemoteApiOptions options = new RemoteApiOptions()
 *     .server("localhost", 8888),
 *     .credentials("username", "password does not matter");
 * </pre>
 *
 * <p>Example for connecting to a deployed app:</p>
 *
 * <pre>
 * RemoteApiOptions options = new RemoteApiOptions()
 *     .server("myappid.appspot.com", 443),
 *     .credentials(adminUsername, adminPassword);
 * </pre>
 *
 * <p>
 * The options should be passed to {@link RemoteApiInstaller#install}.
 * </p>
 *
 */
public class RemoteApiOptions {

  private String hostname;
  private int port;
  private String userEmail;
  private String password;
  private String credentialsToReuse;
  private String remoteApiPath = "/remote_api";
  private int maxConcurrentRequests = 5;
  private int datastoreQueryFetchSize = 500;
  private int maxHttpResponseSize = 33 * 1024 * 1024;

  public RemoteApiOptions() {}

  RemoteApiOptions(RemoteApiOptions original) {
    this.hostname = original.hostname;
    this.port = original.port;
    this.userEmail = original.userEmail;
    this.password = original.password;
    this.credentialsToReuse = original.credentialsToReuse;
    this.remoteApiPath = original.remoteApiPath;
    this.maxConcurrentRequests = original.maxConcurrentRequests;
    this.datastoreQueryFetchSize = original.datastoreQueryFetchSize;
    this.maxHttpResponseSize = original.maxHttpResponseSize;
  }

  /**
   * Sets the host and port port where we will connect.
   */
  public RemoteApiOptions server(String newHostname, int newPort) {
    hostname = newHostname;
    port = newPort;
    return this;
  }

  /**
   * Sets a username and password to be used for logging in via the
   * ClientLogin API.
   */
  public RemoteApiOptions credentials(String newUserEMail, String newPassword) {
    userEmail = newUserEMail;
    password = newPassword;
    credentialsToReuse = null;
    return this;
  }

  /**
   * Reuses credentials from another AppEngineClient. Credentials can only
   * be reused from a client with the same hostname and user.
   * @param newUserEmail  the email address of the user we want to log in as.
   * @param serializedCredentials a string returned by calling
   * {@link AppEngineClient#serializeCredentials} on the previous client
   */
  public RemoteApiOptions reuseCredentials(String newUserEmail, String serializedCredentials) {
    userEmail = newUserEmail;
    password = null;
    credentialsToReuse = serializedCredentials;
    return this;
  }

  /**
   * Sets the path used to access the remote API. If not set, the default
   * is /remote_api.
   */
  public RemoteApiOptions remoteApiPath(String newPath) {
    remoteApiPath = newPath;
    return this;
  }

  /**
   * This parameter controls the maximum number of async API requests that will be
   * in flight at once. Each concurrent request will likely be handled by a separate
   * <a href="http://code.google.com/appengine/docs/adminconsole/instances.html"
   * >instance</a> of your App. Having more instances increases throughput but may
   * result in errors due to exceeding quota. Defaults to 5.
   */
  public RemoteApiOptions maxConcurrentRequests(int newValue) {
    maxConcurrentRequests = newValue;
    return this;
  }

  /**
   * When executing a datastore query, this is the number of results to fetch
   * per HTTP request. Increasing this value will reduce the number of round trips
   * when running large queries, but too high a value can be wasteful when not
   * all results are needed. Defaults to 500.
   *
   * <p>(This value can be overridden by the code using the datastore API.)</p>
   */
  public RemoteApiOptions datastoreQueryFetchSize(int newValue) {
    datastoreQueryFetchSize = newValue;
    return this;
  }

  /**
   * When making a remote call, this is the maximum size of the HTTP response.
   * The default is 33M. Normally there's no reason to change this.  This
   * setting has no effect when running in an App Engine container.
   */
  public RemoteApiOptions maxHttpResponseSize(int newValue) {
    maxHttpResponseSize = newValue;
    return this;
  }

  public RemoteApiOptions copy() {
    return new RemoteApiOptions(this);
  }

  public String getHostname() {
    return hostname;
  }

  public int getPort() {
    return port;
  }

  public String getUserEmail() {
    return userEmail;
  }

  public String getPassword() {
    return password;
  }

  public String getCredentialsToReuse() {
    return credentialsToReuse;
  }

  public String getRemoteApiPath() {
    return remoteApiPath;
  }

  public int getMaxConcurrentRequests() {
    return maxConcurrentRequests;
  }

  public int getDatastoreQueryFetchSize() {
    return datastoreQueryFetchSize;
  }

  public int getMaxHttpResponseSize() {
    return maxHttpResponseSize;
  }
}

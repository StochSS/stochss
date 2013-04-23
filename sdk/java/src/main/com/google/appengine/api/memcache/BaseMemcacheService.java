// Copyright 2011 Google Inc. All Rights Reserved.

package com.google.appengine.api.memcache;

/**
 * Methods that are common between {@link MemcacheService} and
 * {@link AsyncMemcacheService}.
 *
 */
public interface BaseMemcacheService {

  /**
   * Method returns non-null value if the MemcacheService overrides the
   * default namespace in API calls. Default namespace is the one returned
   * by {@link com.google.appengine.api.NamespaceManager#get()}.
   *
   * @return {@code null} if the MemcacheService uses default namespace in
   * API calls. Otherwise it returns {@code namespace} which is overrides
   * default namespace on the API calls.
   */
  String getNamespace();

  /**
   * Fetches the current error handler.
   */
  ErrorHandler getErrorHandler();

  /**
   * Registers a new {@code ErrorHandler}.  The {@code handler} is called
   * for errors which are not the application's fault, like a network timeout.
   * The handler can choose to propagate the error or suppress it.
   * Errors which are caused by an incorrect use of the API will not be
   * directed to the {@code handler} but rather will be thrown directly.
   *
   * @param handler the new {@code ErrorHandler} to use
   */
  void setErrorHandler(ErrorHandler handler);

}

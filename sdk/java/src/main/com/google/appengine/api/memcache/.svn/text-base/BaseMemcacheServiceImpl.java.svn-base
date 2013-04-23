// Copyright 2011 Google Inc. All Rights Reserved.

package com.google.appengine.api.memcache;

import com.google.appengine.api.NamespaceManager;

/**
 * State and behavior that is common to both synchronous and asynchronous
 * MemcacheService API implementations.
 *
 */
abstract class BaseMemcacheServiceImpl implements BaseMemcacheService {

  /**
   * Default handler just logs errors at INFO.
   */
  private volatile ErrorHandler handler = ErrorHandlers.getDefault();

  /**
   * If the namespace is not null it overrides current namespace on all API
   * calls. The current namespace is defined as the one returned by
   * {@link NamespaceManager#get()}.
   */
  private String namespace;

  BaseMemcacheServiceImpl(String namespace) {
    if (namespace != null) {
      NamespaceManager.validateNamespace(namespace);
    }
    this.namespace = namespace;
  }

  @Override
  public ErrorHandler getErrorHandler() {
    return handler;
  }

  @Override
  public void setErrorHandler(ErrorHandler newHandler) {
    if (newHandler == null) {
      throw new NullPointerException("ErrorHandler must not be null");
    }
    handler = newHandler;
  }

  @Override
  public String getNamespace() {
    return namespace;
  }

  void setNamespace(String newNamespace) {
    namespace = newNamespace;
  }

  /**
   * Returns namespace which is about to be used by API call. By default it is
   * the value returned by {@link NamespaceManager#get()} with the exception
   * that {@code null} is substituted with "" (empty string).
   * If the {@link #namespace} is not null it overrides the default value.
   */
  protected String getEffectiveNamespace() {
    if (namespace != null) {
      return namespace;
    }
    String namespace1 = NamespaceManager.get();
    return namespace1 == null ? "" : namespace1;
  }
}

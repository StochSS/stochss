// Copyright 2012 Google Inc. All rights reserved.

package com.google.appengine.api.memcache;

/**
 * The factory by which users acquire a handle to the MemcacheService.
 *
 */
public interface IMemcacheServiceFactory {
  /**
   * Gets a handle to the cache service, forcing use of specific namespace.
   *
   * <p>Although there is only one actual cache, an application may make as many
   * {@code MemcacheService} instances as it finds convenient. If using multiple instances, note
   * that the error handler established with {@link MemcacheService#setErrorHandler(ErrorHandler)}
   * is specific to each instance.
   *
   * @param namespace if not {@code null} forces the use of {@code namespace}
   * for all operations in {@code MemcacheService} . If {@code namespace} is
   * {@code null} - created {@MemcacheService} will use current namespace
   * provided by {@link com.google.appengine.api.NamespaceManager#get()}.
   *
   * @return a new {@code MemcacheService} instance.
   */
   MemcacheService getMemcacheService(String namespace);

  /**
   * Similar to {@link #getMemcacheService(String)} but returns a handle to an
   * asynchronous version of the cache service.
   */
   AsyncMemcacheService getAsyncMemcacheService(String namespace);

}

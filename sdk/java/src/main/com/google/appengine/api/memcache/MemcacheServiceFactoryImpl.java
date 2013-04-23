// Copyright 2012 Google Inc. All rights reserved.

package com.google.appengine.api.memcache;

/**
 * The factory by which users acquire a handle to the MemcacheService.
 *
 */
final class MemcacheServiceFactoryImpl implements IMemcacheServiceFactory {
  @Override
  public MemcacheService getMemcacheService(String namespace) {
    return new MemcacheServiceImpl(namespace);
  }

  @Override
  public AsyncMemcacheService getAsyncMemcacheService(String namespace) {
    return new AsyncMemcacheServiceImpl(namespace);
  }

}

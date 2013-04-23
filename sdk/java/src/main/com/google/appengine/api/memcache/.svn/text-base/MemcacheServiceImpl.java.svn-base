// Copyright 2008 Google Inc.  All rights reserved

package com.google.appengine.api.memcache;

import java.lang.reflect.UndeclaredThrowableException;
import java.util.Collection;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Future;

/**
 * Java bindings for the Memcache service.
 *
 */
class MemcacheServiceImpl implements MemcacheService {

  private final AsyncMemcacheServiceImpl async;

  MemcacheServiceImpl(String namespace) {
    async = new AsyncMemcacheServiceImpl(namespace);
  }

  private static <T> T quietGet(Future<T> future) {
    try {
      return future.get();
    } catch (InterruptedException e) {
      Thread.currentThread().interrupt();
      throw new MemcacheServiceException("Unexpected failure", e);
    } catch (ExecutionException e) {
      Throwable cause = e.getCause();
      if (cause instanceof RuntimeException) {
        throw (RuntimeException) cause;
      } else if (cause instanceof Error) {
        throw (Error) cause;
      } else {
        throw new UndeclaredThrowableException(cause);
      }
    }
  }

  @Override
  public boolean contains(Object key) {
    return quietGet(async.contains(key));
  }

  @Override
  public Object get(Object key) {
    return quietGet(async.get(key));
  }

  @Override
  public IdentifiableValue getIdentifiable(Object key) {
    return quietGet(async.getIdentifiable(key));
  }

  @Override
  public <T> Map<T, IdentifiableValue> getIdentifiables(Collection<T> keys) {
    return quietGet(async.getIdentifiables(keys));
  }

  @Override
  public <T> Map<T, Object> getAll(Collection<T> keys) {
    return quietGet(async.getAll(keys));
  }

  @Override
  public boolean put(Object key, Object value, Expiration expires, SetPolicy policy) {
    return quietGet(async.put(key, value, expires, policy));
  }

  @Override
  public void put(Object key, Object value, Expiration expires) {
    quietGet(async.put(key, value, expires));
  }

  @Override
  public void put(Object key, Object value) {
    quietGet(async.put(key, value));
  }

  @Override
  public boolean putIfUntouched(Object key, IdentifiableValue oldValue, Object newValue,
      Expiration expires) {
    return quietGet(async.putIfUntouched(key, oldValue, newValue, expires));
  }

  @Override
  public boolean putIfUntouched(Object key, IdentifiableValue oldValue, Object newValue) {
    return quietGet(async.putIfUntouched(key, oldValue, newValue));
  }

  @Override
  public <T> Set<T> putIfUntouched(Map<T, CasValues> values) {
    return quietGet(async.putIfUntouched(values));
  }

  @Override
  public <T> Set<T> putIfUntouched(Map<T, CasValues> values, Expiration expiration) {
    return quietGet(async.putIfUntouched(values, expiration));
  }

  @Override
  public <T> Set<T> putAll(Map<T, ?> values, Expiration expires, SetPolicy policy) {
    return quietGet(async.putAll(values, expires, policy));
  }

  @Override
  public void putAll(Map<?, ?> values, Expiration expires) {
    quietGet(async.putAll(values, expires));
  }

  @Override
  public void putAll(Map<?, ?> values) {
    quietGet(async.putAll(values));
  }

  @Override
  public boolean delete(Object key) {
    return quietGet(async.delete(key));
  }

  @Override
  public boolean delete(Object key, long millisNoReAdd){
    return quietGet(async.delete(key, millisNoReAdd));
  }

  @Override
  public <T> Set<T> deleteAll(Collection<T> keys) {
    return quietGet(async.deleteAll(keys));
  }

  @Override
  public <T> Set<T> deleteAll(Collection<T> keys, long millisNoReAdd) {
    return quietGet(async.deleteAll(keys, millisNoReAdd));
  }

  @Override
  public Long increment(Object key, long delta) {
    return  quietGet(async.increment(key, delta));
  }

  @Override
  public Long increment(Object key, long delta, Long initialValue) {
    return quietGet(async.increment(key, delta, initialValue));
  }

  @Override
  public <T> Map<T, Long> incrementAll(Collection<T> keys, long delta) {
    return quietGet(async.incrementAll(keys, delta));
  }

  @Override
  public <T> Map<T, Long> incrementAll(Collection<T> keys, long delta, Long initialValue) {
    return quietGet(async.incrementAll(keys, delta, initialValue));
  }

  @Override
  public <T> Map<T, Long> incrementAll(Map<T, Long> offsets) {
     return quietGet(async.incrementAll(offsets));
  }

  @Override
  public <T> Map<T, Long> incrementAll(final Map<T, Long> offsets, Long initialValue) {
    return quietGet(async.incrementAll(offsets, initialValue));
  }

  @Override
  public void clearAll() {
    quietGet(async.clearAll());
  }

  @Override
  public Stats getStatistics() {
    return quietGet(async.getStatistics());
  }

  @Override
  public String getNamespace() {
    return async.getNamespace();
  }

  @Deprecated
  @Override
  public void setNamespace(String newNamespace) {
    async.setNamespace(newNamespace);
  }

  @Override
  public ErrorHandler getErrorHandler() {
    return async.getErrorHandler();
  }

  @Override
  public void setErrorHandler(ErrorHandler newHandler) {
    async.setErrorHandler(newHandler);
  }
}

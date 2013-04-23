// Copyright 2012 Google Inc. All rights reserved.

package com.google.appengine.spi;

import com.google.common.collect.Maps;

import java.util.Collection;
import java.util.Map;

/**
 * Encapsulates a mapping from a base interface to {@link FactoryProvider} entities that return
 * instances implementing the aforementioned base interface. Since this class is <b>not
 * thread-safe</b>, clients should ensure proper synchronization.
 *
 */
class FactoryProviderRegistry {

  private Map<Class<?>, FactoryProvider<?>> providerMap = Maps.newHashMap();

  FactoryProviderRegistry() {}

  /**
   * Register a provider for a given base interface. Will overwrite any previous mapping for that
   * interface.
   *
   * @param p the provider
   * @return The previous provider registered for a given base class (or null if there wasn't one).
   *
   */
  <I> FactoryProvider<?> register(FactoryProvider<I> p) {
    return providerMap.put(p.getBaseInterface(), p);
  }

  /**
   * Get the provider for a given interface. N.B. this method has no notion of "subtypes"; the
   * passed interface must exactly match the base interface of a registered provider.
   *
   * @param baseInterface the the caller wants a provider for.
   *
   */
  <I> FactoryProvider<I> getFactoryProvider(Class<I> baseInterface) {
    @SuppressWarnings("unchecked")
    FactoryProvider<I> p = (FactoryProvider<I>) providerMap.get(baseInterface);
    return p;
  }

  /**
   * Get a view of the registered providers (see {@link HashMap#values()}).
   */
  Collection<FactoryProvider<?>> getAllProviders() {
    return providerMap.values();
  }

}

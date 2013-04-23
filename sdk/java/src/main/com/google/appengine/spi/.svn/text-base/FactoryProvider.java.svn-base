// Copyright 2012 Google Inc. All rights reserved.

package com.google.appengine.spi;

import com.google.common.base.Objects;
import com.google.common.primitives.Ints;

/**
 * A base class for service factory creation that can be registered with the ProviderRegistry.
 *
 * @param <I> is the interface the provided factory must implement.
 */
public abstract class FactoryProvider<I> implements Comparable<FactoryProvider<?>> {
  private final Class<I> baseInterface;

  protected FactoryProvider(Class<I> baseInterface) {
    this.baseInterface = baseInterface;
  }

  protected Class<I> getBaseInterface() {
    return baseInterface;
  }

  /**
   * Return an instance of the factory
   */
  protected abstract I getFactoryInstance();

  private int getPrecedence() {
    ServiceProvider annotation = getClass().getAnnotation(ServiceProvider.class);
    return (annotation != null) ? annotation.precedence() : ServiceProvider.DEFAULT_PRECEDENCE;
  }

  /**
   * This ensures that a list of these will be sorted so that higher precedence entries come later
   * in the list.
   */
  @Override
  public int compareTo(FactoryProvider<?> o) {
    int result =
        getBaseInterface().getCanonicalName().compareTo(o.getBaseInterface().getCanonicalName());
    return result != 0 ? result : Ints.compare(getPrecedence(), o.getPrecedence());
  }

  @Override
  public int hashCode() {
    return Objects.hashCode(getBaseInterface().getCanonicalName(), getPrecedence());
  }

  /**
   * Included to support sorting by precedence (@see #compareTo(FactoryProvider))
   */
  @SuppressWarnings("unchecked")
  @Override
  public boolean equals(Object o) {
    if (o == null || !(o instanceof FactoryProvider)) {
      return false;
    }
    return (compareTo((FactoryProvider<I>) o) == 0);
  }

}

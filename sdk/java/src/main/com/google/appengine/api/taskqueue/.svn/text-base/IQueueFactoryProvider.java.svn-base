// Copyright 2012 Google Inc. All rights reserved.
package com.google.appengine.api.taskqueue;

import com.google.appengine.spi.FactoryProvider;
import com.google.appengine.spi.ServiceProvider;

/**
 * Factory provider for {@link IQueueFactory}.
 *
 * <p><b>Note:</b> This class is not intended for end users.
 *
 */
@ServiceProvider(value = FactoryProvider.class, precedence = Integer.MIN_VALUE)
public final class IQueueFactoryProvider extends FactoryProvider<IQueueFactory> {

  private final QueueFactoryImpl implementation = new QueueFactoryImpl();

  public IQueueFactoryProvider() {
    super(IQueueFactory.class);
  }

  @Override
  protected IQueueFactory getFactoryInstance() {
    return implementation;
  }

}

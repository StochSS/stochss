// Copyright 2012 Google Inc. All rights reserved.

package com.google.appengine.api.datastore;

import com.google.appengine.spi.FactoryProvider;
import com.google.appengine.spi.ServiceProvider;

/**
 * Creates {@code IDatastoreServiceFactory} implementations.
 *
 * <p><b>Note:</b> This class is not intended for end users.
 *
 */
@ServiceProvider(value = FactoryProvider.class, precedence = Integer.MIN_VALUE)
public final class IDatastoreServiceFactoryProvider
    extends FactoryProvider<IDatastoreServiceFactory> {

  private DatastoreServiceFactoryImpl implementation = new DatastoreServiceFactoryImpl();

  public IDatastoreServiceFactoryProvider() {
    super(IDatastoreServiceFactory.class);
  }

  @Override
  protected IDatastoreServiceFactory getFactoryInstance() {
    return implementation;
  }

}

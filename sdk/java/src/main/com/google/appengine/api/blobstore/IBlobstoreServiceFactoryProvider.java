// Copyright 2012 Google Inc. All rights reserved.
package com.google.appengine.api.blobstore;

import com.google.appengine.spi.FactoryProvider;
import com.google.appengine.spi.ServiceProvider;

/**
 * Factory provider for {@link IBlobstoreServiceFactory}.
 *
 * <p><b>Note:</b> This class is not intended for end users.
 *
 */
@ServiceProvider(value = FactoryProvider.class, precedence = Integer.MIN_VALUE)
public final class IBlobstoreServiceFactoryProvider
    extends FactoryProvider<IBlobstoreServiceFactory> {

  private final BlobstoreServiceFactoryImpl implementation = new BlobstoreServiceFactoryImpl();

  public IBlobstoreServiceFactoryProvider() {
    super(IBlobstoreServiceFactory.class);
  }

  @Override
  protected IBlobstoreServiceFactory getFactoryInstance() {
    return implementation;
  }

}

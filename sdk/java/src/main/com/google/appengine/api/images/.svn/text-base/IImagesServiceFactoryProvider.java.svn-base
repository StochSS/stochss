// Copyright 2012 Google Inc. All rights reserved.
package com.google.appengine.api.images;

import com.google.appengine.spi.FactoryProvider;
import com.google.appengine.spi.ServiceProvider;

/**
 * Factory provider for {@link IImagesServiceFactory}.
 *
 * <p><b>Note:</b> This class is not intended for end users.
 *
 */
@ServiceProvider(value = FactoryProvider.class, precedence = Integer.MIN_VALUE)
public final class IImagesServiceFactoryProvider extends FactoryProvider<IImagesServiceFactory> {

  private final ImagesServiceFactoryImpl implementation = new ImagesServiceFactoryImpl();

  public IImagesServiceFactoryProvider() {
    super(IImagesServiceFactory.class);
  }

  @Override
  protected IImagesServiceFactory getFactoryInstance() {
    return implementation;
  }

}

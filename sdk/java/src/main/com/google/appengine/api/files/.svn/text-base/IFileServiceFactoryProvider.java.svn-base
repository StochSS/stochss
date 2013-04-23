// Copyright 2012 Google Inc. All rights reserved.
package com.google.appengine.api.files;

import com.google.appengine.spi.FactoryProvider;
import com.google.appengine.spi.ServiceProvider;

/**
 * Factory provider for {@link IFileServiceFactory}.
 *
 * <p><b>Note:</b> This class is not intended for end users.
 *
 */
@ServiceProvider(value = FactoryProvider.class, precedence = Integer.MIN_VALUE)
public final class IFileServiceFactoryProvider extends FactoryProvider<IFileServiceFactory> {

  private final FileServiceFactoryImpl implementation = new FileServiceFactoryImpl();

  public IFileServiceFactoryProvider() {
    super(IFileServiceFactory.class);
  }

  @Override
  protected IFileServiceFactory getFactoryInstance() {
    return implementation;
  }

}

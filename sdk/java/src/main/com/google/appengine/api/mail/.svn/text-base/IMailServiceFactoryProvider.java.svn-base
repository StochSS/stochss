// Copyright 2012 Google Inc. All rights reserved.
package com.google.appengine.api.mail;

import com.google.appengine.spi.FactoryProvider;
import com.google.appengine.spi.ServiceProvider;

/**
 * Factory provider for {@link IMailServiceFactory}.
 *
 * <p><b>Note:</b> This class is not intended for end users.
 *
 */
@ServiceProvider(value = FactoryProvider.class, precedence = Integer.MIN_VALUE)
public final class IMailServiceFactoryProvider extends FactoryProvider<IMailServiceFactory> {

  private final MailServiceFactoryImpl implementation = new MailServiceFactoryImpl();

  public IMailServiceFactoryProvider() {
    super(IMailServiceFactory.class);
  }

  @Override
  protected IMailServiceFactory getFactoryInstance() {
    return implementation;
  }

}

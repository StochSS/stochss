// Copyright 2012 Google Inc. All rights reserved.
package com.google.appengine.api.xmpp;

import com.google.appengine.spi.FactoryProvider;
import com.google.appengine.spi.ServiceProvider;

/**
 * Factory provider for {@link IXMPPServiceFactory}.
 *
 * <p><b>Note:</b> This class is not intended for end users.
 *
 */
@ServiceProvider(value = FactoryProvider.class, precedence = Integer.MIN_VALUE)
public final class IXMPPServiceFactoryProvider extends FactoryProvider<IXMPPServiceFactory> {

  private final XMPPServiceFactoryImpl implementation = new XMPPServiceFactoryImpl();

  public IXMPPServiceFactoryProvider() {
    super(IXMPPServiceFactory.class);
  }

  @Override
  protected IXMPPServiceFactory getFactoryInstance() {
    return implementation;
  }

}

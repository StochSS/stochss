// Copyright 2012 Google Inc. All rights reserved.

package com.google.appengine.api.xmpp;

/**
 * Constructs an instance of the XMPP service.
 *
 */
final class XMPPServiceFactoryImpl implements IXMPPServiceFactory {

  @Override
  public XMPPService getXMPPService() {
    return new XMPPServiceImpl();
  }

}

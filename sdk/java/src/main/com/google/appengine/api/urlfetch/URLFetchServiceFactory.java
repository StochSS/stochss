// Copyright 2007 Google Inc. All rights reserved.

package com.google.appengine.api.urlfetch;

import com.google.appengine.spi.ServiceFactoryFactory;

/**
 * Factory for {@link URLFetchService}
 *
 */
public class URLFetchServiceFactory {
  public static URLFetchService getURLFetchService() {
    return getFactory().getURLFetchService();
  }

  private static IURLFetchServiceFactory getFactory() {
    return ServiceFactoryFactory.getFactory(IURLFetchServiceFactory.class);
  }
}

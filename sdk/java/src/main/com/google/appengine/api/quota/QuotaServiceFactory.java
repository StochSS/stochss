// Copyright 2009 Google Inc. All Rights Reserved.

package com.google.appengine.api.quota;

import com.google.appengine.spi.ServiceFactoryFactory;

/**
 * The factory by which users acquire a handle to the QuotaService.
 *
 */
public class QuotaServiceFactory {

  /**
   * Gets a handle to the quota service.  Note that the quota service
   * always exists, regardless of how many of its features are supported
   * by a particular app server. If a particular feature (like
   * {@link QuotaService#getApiTimeInMegaCycles()}) is not accessible, the
   * instance will not be able to provide that feature and throw an
   * appropriate exception.
   *
   * @return a {@code QuotaService} instance.
   */
  public static QuotaService getQuotaService() {
    return getFactory().getQuotaService();
  }

  private static IQuotaServiceFactory getFactory() {
    return ServiceFactoryFactory.getFactory(IQuotaServiceFactory.class);
  }
}

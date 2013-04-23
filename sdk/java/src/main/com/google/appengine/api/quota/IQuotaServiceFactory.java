// Copyright 2012 Google Inc. All rights reserved.

package com.google.appengine.api.quota;

/**
 * The factory by which users acquire a handle to the QuotaService.
 *
 */
public interface IQuotaServiceFactory {

  /**
   * Gets a handle to the quota service.  Note that the quota service
   * always exists, regardless of how many of its features are supported
   * by a particular app server. If a particular feature (like
   * {@link QuotaService#getApiTimeInMegaCycles()}) is not accessible, the
   * the instance will not be able to provide that feature and throw an
   * appropriate exception.
   *
   * @return a {@code QuotaService} instance.
   */
   QuotaService getQuotaService();

}

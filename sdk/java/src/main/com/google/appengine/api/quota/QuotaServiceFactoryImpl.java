// Copyright 2012 Google Inc. All rights reserved.

package com.google.appengine.api.quota;

/**
 * The factory by which users acquire a handle to the QuotaService.
 *
 */
final class QuotaServiceFactoryImpl implements IQuotaServiceFactory {

  private static final QuotaServiceImpl INSTANCE = new QuotaServiceImpl();

  @Override
  public QuotaService getQuotaService() {
    return INSTANCE;
  }

}

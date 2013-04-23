// Copyright 2009 Google Inc. All rights reserved.

package com.google.appengine.api.blobstore;

import com.google.appengine.spi.ServiceFactoryFactory;

/**
 * Creates {@link BlobstoreService} implementations.
 *
 */
public final class BlobstoreServiceFactory {

  /**
   * Creates a {@code BlobstoreService}.
   */
  public static BlobstoreService getBlobstoreService() {
    return getFactory().getBlobstoreService();
  }

  private static IBlobstoreServiceFactory getFactory() {
    return ServiceFactoryFactory.getFactory(IBlobstoreServiceFactory.class);
  }
}

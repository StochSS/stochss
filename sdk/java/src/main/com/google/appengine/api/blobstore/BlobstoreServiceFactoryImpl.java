// Copyright 2012 Google Inc. All rights reserved.

package com.google.appengine.api.blobstore;

/**
 * Creates {@link BlobstoreService} implementations.
 *
 */
final class BlobstoreServiceFactoryImpl implements IBlobstoreServiceFactory {

  @Override
  public BlobstoreService getBlobstoreService() {
    return new BlobstoreServiceImpl();
  }
}

// Copyright 2012 Google Inc. All rights reserved.

package com.google.appengine.api.blobstore;

/**
 * Creates {@link BlobstoreService} implementations.
 *
 */
public interface IBlobstoreServiceFactory {

  /**
   * Creates a {@code BlobstoreService}.
   */
   BlobstoreService getBlobstoreService();
}

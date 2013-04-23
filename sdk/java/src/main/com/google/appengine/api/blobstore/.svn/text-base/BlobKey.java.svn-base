// Copyright 2009 Google Inc. All rights reserved.

package com.google.appengine.api.blobstore;

import java.io.Serializable;

/**
 * {@code BlobKey} contains the string identifier of a large (possibly
 * larger than 1MB) blob of binary data that was uploaded in a
 * previous request and can be streamed directly to users.
 *
 */
public final class BlobKey implements Serializable, Comparable<BlobKey> {
  private final String blobKey;

  /**
   * Construct a new {@code BlobKey} with the specified key string.
   *
   * @throws IllegalArgumentException If the specified string was null.
   */
  public BlobKey(String blobKey) {
    if (blobKey == null) {
      throw new IllegalArgumentException("Argument must not be null.");
    }
    this.blobKey = blobKey;
  }

  /**
   * Returns the blob key as a String.
   */
  public String getKeyString() {
    return blobKey;
  }

  @Override
  public int hashCode() {
    return blobKey.hashCode();
  }

  /**
   * Two {@code BlobKey} objects are considered equal if they point
   * to the same blobs.
   */
  @Override
  public boolean equals(Object object) {
    if (object instanceof BlobKey) {
      BlobKey key = (BlobKey) object;
      return key.blobKey.equals(blobKey);
    }
    return false;
  }

  @Override
  public String toString() {
    return "<BlobKey: " + blobKey + ">";
  }

  @Override
  public int compareTo(BlobKey o) {
    return blobKey.compareTo(o.blobKey);
  }
}

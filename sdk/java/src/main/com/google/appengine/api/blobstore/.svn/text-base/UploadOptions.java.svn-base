// Copyright 2011 Google Inc. All Rights Reserved.

package com.google.appengine.api.blobstore;

/**
 * Allows users to customize the behavior of a single upload to the
 * {@link BlobstoreService}.
 *
 */
public final class UploadOptions {

  private Long maxUploadSizeBytesPerBlob;

  private Long maxUploadSizeBytes;

  private String gsBucketName;

  private UploadOptions() {
  }

  /**
   * Sets the maximum size in bytes for any one blob in the upload. If any blob
   * in the upload exceeds this value then a 413 error will be returned to the
   * client.
   * @param maxUploadSizeBytesPerBlob The maximum size in bytes that any one
   * blob in the upload can be.
   * @return {@code this} (for chaining)
   */
  public UploadOptions maxUploadSizeBytesPerBlob(long maxUploadSizeBytesPerBlob) {
    if (maxUploadSizeBytesPerBlob < 1) {
      throw new IllegalArgumentException("maxUploadSizeBytesPerBlob must be positive.");
    }
    this.maxUploadSizeBytesPerBlob = maxUploadSizeBytesPerBlob;
    return this;
  }

  boolean hasMaxUploadSizeBytesPerBlob() {
    return maxUploadSizeBytesPerBlob != null;
  }

  long getMaxUploadSizeBytesPerBlob() {
    if (maxUploadSizeBytesPerBlob == null) {
      throw new IllegalStateException("maxUploadSizeBytesPerBlob has not been set.");
    }
    return maxUploadSizeBytesPerBlob;
  }

  /**
   * Sets the maximum size in bytes that for the total upload. If the upload
   * exceeds this value then a 413 error will be returned to the client.
   * @param maxUploadSizeBytes The maximum size in bytes for the upload.
   * @return {@code this} (for chaining)
   */
  public UploadOptions maxUploadSizeBytes(long maxUploadSizeBytes) {
    if (maxUploadSizeBytes < 1) {
      throw new IllegalArgumentException("maxUploadSizeBytes must be positive.");
    }
    this.maxUploadSizeBytes = maxUploadSizeBytes;
    return this;
  }

  boolean hasMaxUploadSizeBytes() {
    return maxUploadSizeBytes != null;
  }

  long getMaxUploadSizeBytes() {
    if (maxUploadSizeBytes == null) {
      throw new IllegalStateException("maxUploadSizeBytes has not been set.");
    }
    return maxUploadSizeBytes;
  }

  public UploadOptions googleStorageBucketName(String bucketName) {
    this.gsBucketName = bucketName;
    return this;
  }

  boolean hasGoogleStorageBucketName() {
    return this.gsBucketName != null;
  }

  String getGoogleStorageBucketName() {
    if (gsBucketName == null) {
      throw new IllegalStateException("gsBucketName has not been set.");
    }
    return gsBucketName;
  }

  @Override
  public int hashCode() {
    int hash = 17;
    if (maxUploadSizeBytesPerBlob != null) {
      hash = hash * 37 + maxUploadSizeBytesPerBlob.hashCode();
    }
    if (maxUploadSizeBytes != null) {
      hash = hash * 37 + maxUploadSizeBytes.hashCode();
    }
    if (gsBucketName != null) {
      hash = hash * 37 + gsBucketName.hashCode();
    }
    return hash;
  }

  @Override
  public boolean equals(Object object) {
    if (object instanceof UploadOptions) {
      UploadOptions key = (UploadOptions) object;

      if (hasMaxUploadSizeBytesPerBlob() != key.hasMaxUploadSizeBytesPerBlob()) {
        return false;
      }
      if (hasMaxUploadSizeBytesPerBlob()) {
        if (!maxUploadSizeBytesPerBlob.equals(key.getMaxUploadSizeBytesPerBlob())) {
          return false;
        }
      }

      if (hasMaxUploadSizeBytes() != key.hasMaxUploadSizeBytes()) {
        return false;
      }
      if (hasMaxUploadSizeBytes()) {
        if (!maxUploadSizeBytes.equals(key.getMaxUploadSizeBytes())) {
          return false;
        }
      }

      if (hasGoogleStorageBucketName() != key.hasGoogleStorageBucketName()) {
        return false;
      }
      if (hasGoogleStorageBucketName()) {
        if (!gsBucketName.equals(key.gsBucketName)) {
          return false;
        }
      }
      return true;
    }
    return false;
  }

  @Override
  public String toString() {
    StringBuilder buffer = new StringBuilder("UploadOptions: maxUploadSizeBytes=");
    if (maxUploadSizeBytes != null) {
      buffer.append(maxUploadSizeBytes);
    } else {
      buffer.append("unlimited");
    }
    buffer.append(", maxUploadSizeBytesPerBlob=");
    if (maxUploadSizeBytesPerBlob != null) {
      buffer.append(maxUploadSizeBytesPerBlob);
    } else {
      buffer.append("unlimited");
    }
    buffer.append(", gsBucketName=");
    if (gsBucketName != null) {
      buffer.append(gsBucketName);
    } else {
      buffer.append("None");
    }
    buffer.append(".");
    return buffer.toString();
  }

  /**
   * Contains static creation methods for {@link UploadOptions}.
   */
  public static final class Builder {
    /**
     * Returns default {@link UploadOptions} and calls
     * {@link UploadOptions#maxUploadSizeBytes(long)}.
     */
    public static UploadOptions withMaxUploadSizeBytes(long maxUploadSizeBytes) {
      return withDefaults().maxUploadSizeBytes(maxUploadSizeBytes);
    }

    /**
     * Returns default {@link UploadOptions} and calls
     * {@link UploadOptions#maxUploadSizeBytesPerBlob(long)}.
     */
    public static UploadOptions withMaxUploadSizeBytesPerBlob(long maxUploadSizeBytesPerBlob) {
      return withDefaults().maxUploadSizeBytesPerBlob(maxUploadSizeBytesPerBlob);
    }

    /**
     * Returns default {@link UploadOptions} and calls
     * {@link UploadOptions#googleStorageBucketName(String)}.
     */
    public static UploadOptions withGoogleStorageBucketName(String gsBucketName) {
      return withDefaults().googleStorageBucketName(gsBucketName);
    }

    /**
     * Returns default {@link UploadOptions} with default values.
     */
    public static UploadOptions withDefaults() {
      return new UploadOptions();
    }

    private Builder() {
    }
  }
}

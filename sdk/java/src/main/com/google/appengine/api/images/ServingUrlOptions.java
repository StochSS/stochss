// Copyright 2012 Google Inc. All Rights Reserved.

package com.google.appengine.api.images;

import com.google.appengine.api.blobstore.BlobKey;
import static com.google.appengine.api.images.ImagesService.SERVING_SIZES_LIMIT;

/**
 * Allow users to customize the behavior of creating a image serving URL using
 * the {@link ImagesService}.
 *
 */
public final class ServingUrlOptions {

  private BlobKey blobKey;

  private Boolean secureUrl;

  private Integer imageSize;

  private Boolean crop;

  private String googleStorageFileName;

  private ServingUrlOptions() {
  }

  public ServingUrlOptions blobKey(BlobKey blobKey) {
    if (googleStorageFileName != null) {
      throw new IllegalArgumentException("Cannot specify both a blobKey and a " +
          "googleStorageFileName.");
    }
    this.blobKey = blobKey;
    return this;
  }

  boolean hasBlobKey() {
    return blobKey != null;
  }

  BlobKey getBlobKey() {
    if (blobKey == null) {
      throw new IllegalStateException("blobKey has not been set.");
    }
    return blobKey;
  }

  public ServingUrlOptions googleStorageFileName(String fileName) {
    if (blobKey != null) {
      throw new IllegalArgumentException("Cannot specify both a blobKey and a " +
          "googleStorageFileName.");
    }
    this.googleStorageFileName = fileName;
    return this;
  }

  boolean hasGoogleStorageFileName() {
    return googleStorageFileName != null;
  }

  String getGoogleStorageFileName() {
    if (googleStorageFileName == null) {
      throw new IllegalStateException("googleStorageFileName has not been set.");
    }
    return googleStorageFileName;
  }

  public ServingUrlOptions secureUrl(boolean secureUrl) {
    this.secureUrl = secureUrl;
    return this;
  }

  boolean hasSecureUrl() {
    return secureUrl != null;
  }

  boolean getSecureUrl() {
    if (secureUrl == null) {
      throw new IllegalStateException("secureUrl has not been set.");
    }
    return secureUrl;
  }

  public ServingUrlOptions crop(boolean crop) {
    this.crop = crop;
    return this;
  }

  boolean hasCrop() {
    return crop != null;
  }

  boolean getCrop() {
    if (crop == null) {
      throw new IllegalStateException("crop has not been set.");
    }
    return crop;
  }

  public ServingUrlOptions imageSize(int imageSize) {
    if (imageSize > SERVING_SIZES_LIMIT || imageSize < 0) {
      throw new IllegalArgumentException("Unsupported size: " + imageSize +
          ". Valid sizes must be between 0 and  " + SERVING_SIZES_LIMIT);
    }
    this.imageSize = imageSize;
    return this;
  }

  boolean hasImageSize() {
    return imageSize != null;
  }

  int getImageSize() {
    if (imageSize == null) {
      throw new IllegalStateException("imageSize has not been set.");
    }
    return imageSize;
  }

  @Override
  public int hashCode() {
    int hash = 17;
    if (blobKey != null) {
      hash = hash * 37 + blobKey.hashCode();
    }
    if (googleStorageFileName != null) {
      hash = hash * 37 + googleStorageFileName.hashCode();
    }
    if (secureUrl != null) {
      hash = hash * 37 + secureUrl.hashCode();
    }
    if (crop != null) {
      hash = hash * 37 + crop.hashCode();
    }
    if (imageSize != null) {
      hash = hash * 37 + imageSize.hashCode();
    }
    return hash;
  }

  @Override
  public boolean equals(Object object) {
    if (object instanceof ServingUrlOptions) {
      ServingUrlOptions key = (ServingUrlOptions) object;

      if (hasBlobKey() != key.hasBlobKey()) {
        return false;
      }
      if (hasBlobKey()) {
        if (!blobKey.equals(key.blobKey)) {
          return false;
        }
      }

      if (hasGoogleStorageFileName() != key.hasGoogleStorageFileName()) {
        return false;
      }
      if (hasGoogleStorageFileName()) {
        if (!googleStorageFileName.equals(key.googleStorageFileName)) {
          return false;
        }
      }

      if (hasSecureUrl() != key.hasSecureUrl()) {
        return false;
      }
      if (hasSecureUrl()) {
        if (!secureUrl.equals(key.secureUrl)) {
          return false;
        }
      }

      if (hasCrop() != key.hasCrop()) {
        return false;
      }
      if (hasCrop()) {
        if (!crop.equals(key.crop)) {
          return false;
        }
      }

      if (hasImageSize() != key.hasImageSize()) {
        return false;
      }
      if (hasImageSize()) {
        if (!imageSize.equals(key.imageSize)) {
          return false;
        }
      }
      return true;
    }
    return false;
  }

  @Override
  public String toString() {
    StringBuilder buffer = new StringBuilder("ServingUrlOptions: blobKey=");
    if (blobKey != null) {
      buffer.append(blobKey.toString());
    } else {
      buffer.append("None");
    }
    buffer.append(", googleStorageFileName=");
    if (googleStorageFileName != null) {
      buffer.append(googleStorageFileName);
    } else {
      buffer.append("None");
    }
    buffer.append(", secureUrl=");
    if (secureUrl != null) {
      buffer.append(secureUrl);
    } else {
      buffer.append("false");
    }
    buffer.append(", hasCrop=");
    if (crop != null) {
      buffer.append(crop);
    } else {
      buffer.append("false");
    }
    buffer.append(", imageSize=");
    if (imageSize != null) {
      buffer.append(imageSize);
    } else {
      buffer.append("Not Set");
    }
    buffer.append(".");
    return buffer.toString();
  }

  /**
   * Contains static creation methods for {@link ServingUrlOptions}.
   */
  public static final class Builder {
    /**
     * Returns default {@link ServingUrlOptions} and calls
     * {@link ServingUrlOptions#blobKey(BlobKey)}.
     */
    public static ServingUrlOptions withBlobKey(BlobKey blobKey) {
      return withDefaults().blobKey(blobKey);
    }

    /**
     * Returns default {@link ServingUrlOptions} and calls
     * {@link ServingUrlOptions#googleStorageFileName(String)}.
     */
    public static ServingUrlOptions withGoogleStorageFileName(String googleStorageFileName) {
      return withDefaults().googleStorageFileName(googleStorageFileName);
    }

    /**
     * Returns default {@link ServingUrlOptions}.
     */
    private static ServingUrlOptions withDefaults() {
      return new ServingUrlOptions();
    }

    private Builder() {
    }
  }
}

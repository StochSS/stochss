// Copyright 2011 Google Inc. All Rights Reserved.

package com.google.appengine.api.conversion;

import com.google.common.base.Objects;
import com.google.common.base.Preconditions;

/**
 * An immutable asset for conversion. A conversion document must contain at
 * least one asset, typically the document contents. Additional asset can be
 * referenced from the main asset, such as in case of images or CSS files from
 * HTML documents.
 *
 */
public final class Asset {

  private final String mimeType;
  private final byte[] data; private final String name;

  /**
   * Constructs an asset.
   *
   * @param mimeType the asset's mime type
   * @param data the asset's data
   */
  public Asset(String mimeType, byte[] data) {
    this(mimeType, data, null);
  }

  /**
   * Constructs an asset.
   *
   * @param mimeType the asset's mime type
   * @param data the asset's data
   * @param name the asset's name, or null if none
   */
  public Asset(String mimeType, byte[] data, String name) {
    this.mimeType = Preconditions.checkNotNull(mimeType).toLowerCase();
    this.data = data;
    this.name = name;
  }

  /**
   * Returns the asset's mime type.
   */
  public String getMimeType() {
    return mimeType;
  }

  /**
   * Returns the asset's data.
   */
  public byte[] getData() {
    return data;
  }

  /**
   * Returns the asset's name, or null if not present.
   */
  public String getName() {
    return name;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }

    Asset other = ((Asset) o);
    return Objects.equal(mimeType, other.getMimeType())
           && Objects.deepEquals(data, other.getData())
           && Objects.equal(name, other.getName());
  }

  @Override
  public int hashCode() {
    return Objects.hashCode(mimeType, data, name);
  }
}

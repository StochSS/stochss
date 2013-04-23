// Copyright 2007 Google Inc. All rights reserved.

package com.google.appengine.api.datastore;

import java.io.Serializable;
import java.util.Arrays;

/**
 * {@code ShortBlob} contains an array of bytes no longer than
 * {@link DataTypeUtils#MAX_SHORT_BLOB_PROPERTY_LENGTH}.  Unlike {@link Blob},
 * {@code ShortBlobs} are indexed by the datastore and can therefore be
 * filtered and sorted on in queries.  If your data is too large to fit
 * in a {@code ShortBlob} use {@link Blob} instead.
 *
 */
public final class ShortBlob implements Serializable, Comparable<ShortBlob> {

  public static final long serialVersionUID = -3427166602866836472L;

  private byte[] bytes;

  /**
   * This constructor exists for frameworks (e.g. Google Web Toolkit)
   * that require it for serialization purposes.  It should not be
   * called explicitly.
   */
  @SuppressWarnings("unused")
  private ShortBlob() {
    bytes = null;
  }

  /**
   * Construct a new {@code ShortBlob} with the specified bytes.  This
   * blob cannot be modified after construction.
   */
  public ShortBlob(byte[] bytes) {

    this.bytes = new byte[bytes.length];
    System.arraycopy(bytes, 0, this.bytes, 0, bytes.length);
  }

  /**
   * Return the bytes stored in this {@code ShortBlob}.
   */
  public byte[] getBytes() {
    return bytes;
  }

  @Override
  public int hashCode() {
    return Arrays.hashCode(bytes);
  }

  /**
   * Two {@code ShortBlob} objects are considered equal if their contained
   * bytes match exactly.
   */
  @Override
  public boolean equals(Object object) {
    if (object instanceof ShortBlob) {
      ShortBlob other = (ShortBlob) object;
      return Arrays.equals(bytes, other.bytes);
    }
    return false;
  }

  /**
   * Simply prints the number of bytes contained in this {@code ShortBlob}.
   */
  @Override
  public String toString() {
    return "<ShortBlob: " + bytes.length + " bytes>";
  }

  @Override
  public int compareTo(ShortBlob other) {
    DataTypeTranslator.ComparableByteArray cba1 = new DataTypeTranslator.ComparableByteArray(bytes);
    DataTypeTranslator.ComparableByteArray cba2 =
        new DataTypeTranslator.ComparableByteArray(other.bytes);
    return cba1.compareTo(cba2);
  }
}

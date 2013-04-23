// Copyright 2009 Google Inc. All rights reserved.

package com.google.appengine.api.blobstore;

import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.Serializable;
import java.util.Date;

/**
 * {@code BlobInfo} contains metadata about a blob. This metadata is gathered by
 * parsing the HTTP headers included in the blob upload.
 *
 * @see <a href="http://tools.ietf.org/html/rfc1867">RFC 1867</a> for
 * the specification of HTTP file uploads.
 */
public class BlobInfo implements Serializable {
  private static final long serialVersionUID = 4530115855912621409L;
  private static final String DEFAULT_MD5_HASH = "";
  protected final BlobKey blobKey;
  protected final String contentType;
  protected final Date creation;
  protected final String filename;
  protected final long size;
  protected String md5Hash;

  /**
   * Creates a {@code BlobInfo} by providing the {@link BlobKey} and all
   * associated metadata. This is typically done by the API on the developer's
   * behalf.
   *
   * @param blobKey      the {@link BlobKey} of the Blob.
   * @param contentType  the MIME Content-Type provided in the HTTP header during upload of this
   *                     Blob.
   * @param creation     the time and date the blob was uploaded.
   * @param filename     the file included in the Content-Disposition HTTP header during upload of
   *                     this Blob.
   * @param size         the size in bytes of this Blob.
   * @param md5Hash      the md5Hash of this Blob.
   */
  public BlobInfo(BlobKey blobKey, String contentType, Date creation, String filename,
                  long size, String md5Hash) {
    if (blobKey == null) {
      throw new NullPointerException("blobKey must not be null");
    }
    if (contentType == null) {
      throw new NullPointerException("contentType must not be null");
    }
    if (creation == null) {
      throw new NullPointerException("creation must not be null");
    }
    if (filename == null) {
      throw new NullPointerException("filename must not be null");
    }
    if (md5Hash == null) {
      throw new NullPointerException("md5Hash must not be null");
    }

    this.blobKey = blobKey;
    this.contentType = contentType;
    this.creation = creation;
    this.filename = filename;
    this.size = size;
    this.md5Hash = md5Hash;
  }

  public BlobInfo(BlobKey blobKey, String contentType, Date creation, String filename, long size) {
    this(blobKey, contentType, creation, filename, size, DEFAULT_MD5_HASH);
  }

  /**
   * Returns the {@link BlobKey} of the Blob this {@code BlobInfo} describes.
   */
  public BlobKey getBlobKey() {
    return blobKey;
  }

  /**
   * Returns the MIME Content-Type provided in the HTTP header during upload of
   * this Blob.
   */
  public String getContentType() {
    return contentType;
  }

  /**
   * Returns the time and date the blob was upload.
   */
  public Date getCreation() {
    return creation;
  }

  /**
   * Returns the file included in the Content-Disposition HTTP header during
   * upload of this Blob.
   */
  public String getFilename() {
    return filename;
  }

  /**
   * Returns the size in bytes of this Blob.
   */
  public long getSize() {
    return size;
  }

  /**
   * Returns the md5Hash of this Blob.
   */
  public String getMd5Hash() {
    return md5Hash;
  }

  @Override
  public boolean equals(Object obj) {
    if (obj instanceof BlobInfo) {
      BlobInfo bi = (BlobInfo) obj;
      return blobKey.equals(bi.blobKey) &&
          contentType.equals(bi.contentType)
          &&
          creation.equals(bi.creation) &&
          filename.equals(bi.filename) &&
          size == bi.size &&
          md5Hash.equals(bi.md5Hash);
    }
    return false;
  }

  @Override
  public int hashCode() {
    int hash = 17;
    hash = hash * 37 + blobKey.hashCode();
    hash = hash * 37 + contentType.hashCode();
    hash = hash * 37 + filename.hashCode();
    hash = hash * 37 + md5Hash.hashCode();
    return hash;
  }

  @Override
  public String toString() {
    StringBuilder builder = new StringBuilder();
    builder.append("<BlobInfo: ");
    builder.append(blobKey);
    builder.append(", contentType = ");
    builder.append(contentType);
    builder.append(", creation = ");
    builder.append(creation.toString());
    builder.append(", filename = ");
    builder.append(filename);
    builder.append(", size = ");
    builder.append(Long.toString(size));
    builder.append(", md5Hash = ");
    builder.append(md5Hash);
    builder.append(">");
    return builder.toString();
  }

  private void readObject(ObjectInputStream in)
      throws IOException, ClassNotFoundException {
    in.defaultReadObject();
    if (md5Hash == null) {
      md5Hash = DEFAULT_MD5_HASH;
    }
  }
}

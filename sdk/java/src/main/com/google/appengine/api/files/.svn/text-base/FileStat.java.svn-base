// Copyright 2012 Google Inc. All Rights Reserved.

package com.google.appengine.api.files;

import static java.lang.String.format;

/**
 * A {@link FileStat} contains information about a single file.
 *
 */
public final class FileStat {

  private String filename;
  private boolean finalized;
  private Long length;
  private Long ctime;
  private Long mtime;

  @Override
  public boolean equals(Object obj) {
    if (obj instanceof FileStat) {
      return filename.equals(((FileStat) obj).filename);
    }
    return false;
  }

  @Override
  public int hashCode() {
    return filename.hashCode();
  }

  @Override
  public String toString() {
    return format("FileStat for %s: length %d, ctime %d, mtime %d, finalized %b.",
        filename, length, ctime, mtime, finalized);
  }

  /**
   * @param filename the uploaded filename of the file.
   */
  public void setFilename(String filename) {
    this.filename = filename;
  }

  /**
   * @param finalized whether the file is finalized.
   */
  public void setFinalized(boolean finalized) {
    this.finalized = finalized;
  }

  /**
   * @param length the number of bytes of the file.
   */
  public void setLength(long length) {
    this.length = length;
  }

  /**
   * @param ctime creation time.
   */
  public void setCtime(long ctime) {
    this.ctime = ctime;
  }

  /**
   * @param mtime modification time.
   */
  public void setMtime(long mtime) {
    this.mtime = mtime;
  }

  /**
   * @return the filename.
   */
  public String getFilename() {
    return filename;
  }

  /**
   * @return whether or not the file is finalized
   */
  public boolean isFinalized() {
    return finalized;
  }

  /**
   * @return the length. {@code null} if not set.
   */
  public Long getLength() {
    return length;
  }

  /**
   * This field is never set under current implementation.
   *
   * @return the ctime. {@code null} if not set.
   */
  public Long getCtime() {
    return ctime;
  }

  /**
   * This field is never set under current implementation.
   *
   * @return the mtime. {@code null} if not set.
   */
  public Long getMtime() {
    return mtime;
  }
}

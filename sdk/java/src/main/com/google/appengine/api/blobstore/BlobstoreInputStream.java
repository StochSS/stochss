// Copyright 2010 Google Inc. All Rights Reserved.

package com.google.appengine.api.blobstore;

import com.google.common.base.Preconditions;

import java.io.IOException;
import java.io.InputStream;

/**
 * BlobstoreInputStream provides an InputStream view of a blob in
 * Blobstore.
 *
 * It is thread compatible but not thread safe: there is no static state, but
 * any multithreaded use must be externally synchronized.
 *
 */
public final class BlobstoreInputStream extends InputStream {

  /**
   * A subclass of {@link IOException } that indicates operations on a stream after
   * it is closed.
   */
  public static final class ClosedStreamException extends IOException {
    /**
     * Construct an exception with specified message.
     */
    public ClosedStreamException(String message) {
      super(message);
    }

    /**
     * Construct exception with specified message and cause.
     */
    public ClosedStreamException(String message, Throwable cause) {
      super(message, cause);
    }
  }

  /**
   * A subclass of {@link IOException} that indicates that there was a problem
   * interacting with Blobstore.
   */
  public static final class BlobstoreIOException extends IOException {
    /**
     * Constructs a {@code BlobstoreIOException} with the specified detail
     * message.
     */
    public BlobstoreIOException(String message) {
      super(message);
    }

    /**
     * Constructs a {@code BlobstoreIOException} with the specified detail
     * message and cause.
     */
    public BlobstoreIOException(String message, Throwable cause) {
      super(message);
      initCause(cause);
    }
  }

  private final BlobKey blobKey;

  private final BlobInfo blobInfo;

  private long blobOffset;

  private byte[] buffer;

  private int bufferOffset;

  private boolean markSet = false;

  private long markOffset;

  private final BlobstoreService blobstoreService;

  private boolean isClosed = false;

  /**
   * Creates a BlobstoreInputStream that reads data from the blob indicated by
   * blobKey, starting at offset.
   *
   * @param blobKey A valid BlobKey indicating the blob to read from.
   * @param offset An offset to start from.
   *
   * @throws BlobstoreIOException If the blobKey given is invalid.
   * @throws IllegalArgumentException If {@code offset} &lt; 0.
   */
  public BlobstoreInputStream(BlobKey blobKey, long offset) throws IOException {
    this(blobKey, offset, new BlobInfoFactory(), BlobstoreServiceFactory.getBlobstoreService());
  }

  /**
   * Creates a BlobstoreInputStream that reads data from the blob indicated by
   * blobKey, starting at the beginning of the blob.
   *
   * @param blobKey A valid BlobKey indicating the blob to read from.
   * @throws BlobstoreIOException If the blobKey given is invalid.
   * @throws IllegalArgumentException If {@code offset} &lt; 0.
   */
  public BlobstoreInputStream(BlobKey blobKey) throws IOException {
    this(blobKey, 0);
  }

  BlobstoreInputStream(BlobKey blobKey,
                       long offset,
                       BlobInfoFactory blobInfoFactory,
                       BlobstoreService blobstoreService) throws IOException {
    if (offset < 0) {
      throw new IllegalArgumentException("Offset " + offset + " is less than 0");
    }

    this.blobKey = blobKey;
    this.blobOffset = offset;
    this.blobstoreService = blobstoreService;
    blobInfo = blobInfoFactory.loadBlobInfo(blobKey);
    if (blobInfo == null) {
      throw new BlobstoreIOException("BlobstoreInputStream received an invalid blob key: "
          + blobKey.getKeyString());
    }
  }

  /**
   * Check if we have entirely consumed the last buffer read from the blob.
   *
   * @returns true if we have consumed the last buffer or if no buffer has
   *          yet been read.
   */
  private boolean atEndOfBuffer() {
    Preconditions.checkState(buffer == null || bufferOffset <= buffer.length,
        "Buffer offset is past the end of the buffer. This should never happen.");
    return buffer == null || bufferOffset == buffer.length;
  }

  private void checkClosedStream() throws ClosedStreamException {
    if (isClosed) {
      throw new ClosedStreamException("Stream is closed");
    }
  }

  /**
   * @throws IOException - does not actually throw but as it's part of our public API and
   * removing it can cause compilation errors, leaving it in (and documenting to quiet Eclipse
   * warning).
   */
  @Override
  public void close() throws IOException {
    isClosed = true;
    buffer = null;
  }

  @Override
  public int read() throws IOException {
    checkClosedStream();

    if (!ensureDataInBuffer()) {
      return -1;
    }

    return buffer[bufferOffset++] & 0xff;
  }

  @Override
  public int read(byte[] b, int off, int len) throws IOException {
    checkClosedStream();
    Preconditions.checkNotNull(b);
    Preconditions.checkElementIndex(off, b.length);
    Preconditions.checkPositionIndex(off + len, b.length);
    if (len == 0) {
      return 0;
    }

    if (!ensureDataInBuffer()) {
      return -1;
    }

    int amountToCopy = Math.min(buffer.length - bufferOffset, len);
    System.arraycopy(buffer, bufferOffset, b, off, amountToCopy);
    bufferOffset += amountToCopy;
    return amountToCopy;
  }

  @Override
  public boolean markSupported() {
    return true;
  }

  @Override
  public void mark(int readlimit) {
    markSet = true;
    markOffset = blobOffset;
    if (buffer != null) {
      markOffset += bufferOffset - buffer.length;
    }
  }

  @Override
  public void reset() throws IOException {
    checkClosedStream();
    if (!markSet) {
      throw new IOException("Attempted to reset on un-mark()ed BlobstoreInputStream");
    }
    blobOffset = markOffset;
    buffer = null;
    bufferOffset = 0;
    markSet = false;
  }

  /**
   * Attempts to ensure that {@code buffer} contains unprocessed data from the
   * blob.
   *
   * @return {@code true} if the buffer now contains unprocessed data.
   * @throws BlobstoreIOException if there is a problem retrieving data from
   *         the blob.
   */
  private boolean ensureDataInBuffer() throws IOException {
    if (!atEndOfBuffer()) {
      return true;
    }

    long fetchSize = Math.min(
        blobInfo.getSize() - blobOffset,
        BlobstoreService.MAX_BLOB_FETCH_SIZE);
    if (fetchSize <= 0) {
      buffer = null;
      return false;
    }
    try {
      buffer = blobstoreService.fetchData(blobKey, blobOffset, blobOffset + fetchSize - 1);
      blobOffset += buffer.length;
      bufferOffset = 0;
      return true;
    } catch (BlobstoreFailureException bfe) {
      throw new BlobstoreIOException("Error reading data from Blobstore", bfe);
    }
  }
}

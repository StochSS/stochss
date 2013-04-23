// Copyright 2011 Google Inc. All Rights Reserved.

package com.google.appengine.api.files;

import java.io.IOException;
import java.nio.channels.ReadableByteChannel;

/**
 * A {@code ReadableByteChannel} for reading bytes from an {@link AppEngineFile}.
 * <p>
 * A {@code FileReadChannel} has a current <i>position</i> within its file which can be both
 * {@link #position() queried} and {@link #position(long) modified}.
 * <p>
 * An instance of {@code FileReadChannel} is obtained via the method
 * {@link FileService#openReadChannel(AppEngineFile, boolean)}.
 * <p>
 * A {@code FileReadChannel} is associated with a single App Engine request and may not be used
 * outside of the request in which it is constructed. Therefore an instance of
 * {@code FileReadChannel} should not be cached between requests. Instead, {@link #close() close }
 * the channel at the end of the request, cache the {@code AppEngineFile} or just the
 * {@link AppEngineFile#getFullPath() path}, and create a new {@code FileReadChannel} in a later
 * request.
 * <p>
 * When a {@code FileReadChannel} is constructed the underlying file may optionally be
 * <b>locked</b>. Successful aquisition of the lock means that no other App Engine request will be
 * able to read the underlying file until the lock is released. If a lock is acquired, it will be
 * released when the method {@link #close()} is invoked. When the request terminates,
 * {@code close()} will be invoked implicitly if it has not yet been invoked explicitly.
 *
 * Just like {@link ReadableByteChannel} If one thread initiates a read operation upon a channel
 * then any other thread that attempts to initiate another read operation will block until the first
 * operation is complete. This also applies to the {@link #position()} and {@link #position(long)}
 * apis.
 *
 */
public interface FileReadChannel extends ReadableByteChannel {

  /**
   * Returns this channel's file position;
   *
   * @return This channel's file position, a non-negative integer counting the
   *         number of bytes from the beginning of the file to the current
   *         position
   * @throws IOException If any problem occurs
   */
  public long position() throws IOException;

  /**
   * Sets this channel's file position.
   * <p>
   * Setting the position to a value that is greater than the file's size will
   * not result in an exception. A later attempt to read bytes at such a
   * position will immediately return an end-of-file indication.
   *
   * @param newPosition The new position, a non-negative integer counting the
   *        number of bytes from the beginning of the file
   * @return This channel
   * @throws IllegalArgumentException If the new position is negative
   * @throws IOException If any other problem occurs
   */
  public FileReadChannel position(long newPosition) throws IOException;

}

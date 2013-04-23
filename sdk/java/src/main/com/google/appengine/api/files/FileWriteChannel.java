// Copyright 2011 Google Inc. All Rights Reserved.

package com.google.appengine.api.files;

import java.io.IOException;
import java.nio.ByteBuffer;
import java.nio.channels.WritableByteChannel;

/**
 * A {@code WritableByteChannel} for appending bytes to an
 * {@link AppEngineFile}. In addition to the behavior specified by {@code
 * WritableByteChannel} this class also exposes a
 * {@link #write(ByteBuffer, String) sequence key} feature which may be used to
 * recover from certain types of failures.
 * <p>
 * An instance of {@code FileWriteChannel} is obtained from the method
 * {@link FileService#openWriteChannel(AppEngineFile, boolean)}.
 * <p>
 * A {@code FileWriteChannel} is associated with a single App Engine request and
 * may not be used outside of the request in which it is constructed. Therefore
 * an instance of {@code FileWriteChannel} should not be cached between
 * requests. Instead, {@link #close() close } the channel at the end of the
 * request (without {@link #closeFinally() finalizing}), cache the {@code
 * AppEngineFile} or just the {@link AppEngineFile#getFullPath() path}, and
 * create a new {@code FileWriteChannel} in a later request.
 * <p>
 * When the channel is
 * {@link FileService#openWriteChannel(AppEngineFile, boolean) opened}, the
 * underlying file may be <b>locked</b>. Successful aquisition of the
 * lock means that no other App Engine request will be able to read or write the
 * underlying file until the lock is released.
 * <p>
 * One of the {@code close()} methods should be invoked before the request
 * terminates. The version {@link #closeFinally()} causes the underlying file to
 * be <i>finalized</i>. Once a file is finalized it may be read, and it may not
 * be written. In order to finalize a file it is necessary to hold the lock for
 * the file. If no {@code close()} method is invoked before the request
 * terminates then {@link #close()} will implicitly be invoked and so the file
 * will not be finalized. All of the {@code close()} methods have the
 * side-effect of releasing a lock if one is held.
 *
 * Just like {@link WritableByteChannel} If one thread initiates a write operation upon a channel
 * then any other thread that attempts to initiate another write operation will block until the
 * first operation is complete.
 *
 */
public interface FileWriteChannel extends WritableByteChannel {

  /**
   * As specified by {@link WritableByteChannel#write(ByteBuffer)} with the
   * addition of the {@code sequenceKey} parameter. If this parameter is not
   * {@code null} then it will be passed to the back end repository and recorded
   * as the last good sequence key if the back end write succeeds. In this case,
   * if the {@code sequenceKey} is not strictly lexicographically greater than
   * the last good sequence key the back end has already recorded (if there is
   * one), a {@link KeyOrderingException} will be thrown from which the last
   * good sequence key may be retrieved via the method
   * {@link KeyOrderingException#getLastGoodSequenceKey()}. By making use of
   * this feedback system it is possible to recover from certain types of
   * failures that it would otherwise be difficult to recover from. For example,
   * if bytes are being written to a file in a series of App Engine Task Queue
   * tasks and one of the tasks is retried, this technique can be used to avoid
   * writing the same bytes twice. As another example, if during a series of
   * writes the back end loses some of the bytes of a file due to a back end
   * system failure, this feedback system may be used to inform the client of
   * the last write after which the data corruption begins, thus enabling the
   * client to resend all bytes after that point.
   */
  public int write(ByteBuffer src, String sequenceKey) throws IOException;

  /**
   * Close the channel and finalize the file. After the file is finalized it may
   * be read, and it may no longer be written.
   *
   * @throws IllegalStateException if the current request does not hold the lock
   *         for the file
   * @throws IOException if any unexpected problem occurs
   */
  public void closeFinally() throws IllegalStateException, IOException;

}

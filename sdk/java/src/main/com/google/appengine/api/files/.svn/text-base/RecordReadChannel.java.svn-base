// Copyright 2011 Google Inc. All Rights Reserved.

package com.google.appengine.api.files;

import java.io.IOException;
import java.nio.ByteBuffer;

/**
 * A channel for reading records from a {@link FileReadChannel}.
 * <p>
 * The format of these records is defined by the leveldb log format:
 * http://leveldb.googlecode.com/svn/trunk/doc/log_format.txt
 * </p>
 * <p>
 * An instance of {@link RecordReadChannel} may be obtained from the method:
 * {@link FileService#openRecordReadChannel(AppEngineFile, boolean)}.
 * </p>
 *
 */
public interface RecordReadChannel {

  /**
   * Reads a record from the file and returns it in a {@link ByteBuffer}. This ByteBuffer is
   * reused, so if the user would like to save the result of {@link #readRecord()}, they need
   * to copy the output of this method.
   * @return a {@link ByteBuffer} containing the record.
   * @throws IOException
   */
  ByteBuffer readRecord() throws IOException;

  /**
   * Returns the position in the underlying {@link FileReadChannel}.
   * @return the position.
   * @throws IOException
   */
  long position() throws IOException;

  /**
   * Sets the read position of the underlying {@link FileReadChannel}. The position value should
   * only be set using the value obtained from a previous {@link #position()} call.
   * @param newPosition the position at which to set the reader.
   * @throws IOException
   */
  void position(long newPosition) throws IOException;
}

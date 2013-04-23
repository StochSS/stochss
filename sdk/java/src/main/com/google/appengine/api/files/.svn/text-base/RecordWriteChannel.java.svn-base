// Copyright 2011 Google Inc. All Rights Reserved.

package com.google.appengine.api.files;

import java.io.IOException;
import java.nio.ByteBuffer;
import java.nio.channels.WritableByteChannel;

/**
 * A {@link WritableByteChannel} for writing records to a {@link FileWriteChannel}.
 * <p>
 * The format of these records is defined by the leveldb log format:
 * http://leveldb.googlecode.com/svn/trunk/doc/log_format.txt
 * </p>
 * <p>
 * An instance of {@link RecordWriteChannel} may be obtained from the method:
 * {@link FileService#openRecordWriteChannel(AppEngineFile, boolean)}.
 * </p>
 * Just like {@link WritableByteChannel} If one thread initiates a write operation upon a channel
 * then any other thread that attempts to initiate another write operation will block until the
 * first operation is complete.
 *
 *
 */
public interface RecordWriteChannel extends WritableByteChannel {

    /**
     * Writes the data out to FileWriteChannel.
     * @see com.google.appengine.api.files.FileWriteChannel#write(ByteBuffer, String)
     */
    public int write(ByteBuffer src, String sequenceKey) throws IOException;

    /**
     * Closes the file.
     * @see com.google.appengine.api.files.FileWriteChannel#closeFinally()
     */
    public void closeFinally() throws IllegalStateException, IOException;
}

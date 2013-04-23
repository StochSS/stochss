package com.google.appengine.api.files;

import java.io.IOException;
import java.nio.ByteBuffer;

/**
 * Wraps a FileReadChannel to provide buffering of reads.
 */
public class BufferedFileReadChannelImpl implements FileReadChannel {

  private final FileReadChannel readChannel;
  private final int bufferSize;
  private final ByteBuffer buffer;
  private boolean encounteredEof;
  private final Object lock = new Object();

  public BufferedFileReadChannelImpl(FileReadChannel readChannel, int bufferSize) {
    this.readChannel = readChannel;
    this.bufferSize = bufferSize;
    this.buffer = ByteBuffer.allocate(bufferSize);
    makeEmpty();
    this.encounteredEof = false;
  }

  private void makeEmpty() {
    this.buffer.position(buffer.limit());
  }

  @Override
  public int read(ByteBuffer dst) throws IOException {
    synchronized (lock) {
      if (encounteredEof && buffer.remaining() == 0) {
        return -1;
      }
      if (dst.remaining() == 0) {
        if (buffer.remaining() == 0) {
          refillBuffer();
          if (encounteredEof) {
            return -1;
          } else {
            return 0;
          }
        } else {
          return 0;
        }
      }
      int bytesRead;
      if (bufferHasMoreThanNeeded(dst)) {
        bytesRead = readIntoShortBuffer(dst);
      } else {
        bytesRead = buffer.remaining();
        dst.put(buffer);
        assert buffer.remaining() == 0;
        while (dst.remaining() > bufferSize && !encounteredEof) {
          int bytesFromChannel = readChannel.read(dst);
          if (bytesFromChannel == -1) {
            encounteredEof = true;
          } else {
            bytesRead += bytesFromChannel;
          }
        }
        if (dst.remaining() > 0 && dst.remaining() <= bufferSize && !encounteredEof) {
          refillBuffer();
          bytesRead += readIntoShortBuffer(dst);
        }
      }
      return (bytesRead == 0 && encounteredEof) ? -1 : bytesRead;
    }
  }

  private boolean bufferHasMoreThanNeeded(ByteBuffer dst) {
    return dst.remaining() <= buffer.remaining();
  }

  private int readIntoShortBuffer(ByteBuffer dst) {
    int oldLimit = buffer.limit();
    int newLimit = Math.min(oldLimit, buffer.position() + dst.remaining());
    int bytesRead = Math.min(dst.remaining(), buffer.remaining());
    buffer.limit(newLimit);
    try {
      dst.put(buffer);
    } finally {
      buffer.limit(oldLimit);
    }
    return bytesRead;
  }

  private void refillBuffer() throws IOException {
    assert buffer.remaining() == 0;
    buffer.clear();
    int read = readChannel.read(buffer);
    buffer.flip();
    if (read == -1) {
      encounteredEof = true;
    }
  }

  /**
   * {@inheritDoc}
   */
  @Override
  public boolean isOpen() {
    return readChannel.isOpen();
  }

  /**
   * {@inheritDoc}
   */
  @Override
  public void close() throws IOException {
    readChannel.close();
  }

  @Override
  public long position() throws IOException {
    synchronized (lock) {
      long position = readChannel.position();
      return position - buffer.remaining();
    }
  }

  @Override
  public FileReadChannel position(long newPosition) throws IOException {
    synchronized (lock) {
      long startingPosition = position();
      int relativePos = (int) (newPosition - startingPosition);
      if (relativePos < buffer.remaining() && relativePos >= 0) {
        buffer.position(buffer.position() + relativePos);
      } else {
        buffer.clear();
        makeEmpty();
        readChannel.position(newPosition);
      }
      return this;
    }
  }

}

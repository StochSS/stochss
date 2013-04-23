// Copyright 2011 Google Inc. All rights reserved.

package com.google.appengine.api.files;

import static com.google.appengine.api.files.RecordConstants.BLOCK_SIZE;
import static com.google.appengine.api.files.RecordConstants.HEADER_LENGTH;
import static com.google.appengine.api.files.RecordConstants.maskCrc;

import com.google.appengine.api.files.RecordConstants.RecordType;
import com.google.common.base.Preconditions;

import java.io.IOException;
import java.nio.ByteBuffer;
import java.nio.ByteOrder;

/**
 * An implementation of a {@link RecordWriteChannel}.
 *
 */
final class RecordWriteChannelImpl implements RecordWriteChannel {

  /**
   * A class that holds information needed to write a physical record.
   */
  private static final class Record {
    private final RecordType type;
    private final int bytes;

    private Record() {
      type = RecordType.NONE;
      bytes = 0;
    }

    private Record(RecordType type, int bytes) {
      Preconditions.checkArgument(type != RecordType.UNKNOWN);
      Preconditions.checkArgument(bytes >= 0);
      this.type = type;
      this.bytes = bytes;
    }

    /**
     * Returns the number of bytes that needs to be written.
     *
     * @return the number of bytes.
     */
    int getBytes() {
      return bytes;
    }

    /**
     * Returns the type of record that needs to be written.
     *
     * @return the type.
     */
    RecordType getType() {
      return type;
    }

  }
  private final Object lock = new Object();
  private final FileWriteChannel output;
  private int position;
  private ByteBuffer writeBuffer;

  /**
   * @param output a {@link FileWriteChannel} to write the record to.
   */
  public RecordWriteChannelImpl(FileWriteChannel output) {
    this.output = output;
    position = 0;
    writeBuffer = ByteBuffer.allocate(BLOCK_SIZE);
    writeBuffer.order(ByteOrder.LITTLE_ENDIAN);
  }

  /**
   * {@inheritDoc}
   */
  @Override
  public int write(ByteBuffer data) throws IOException {
    synchronized (lock) {
      return write(data, null);
    }
  }

  /**
   * {@inheritDoc}
   */
  @Override
  public boolean isOpen() {
    synchronized (lock) {
    return output.isOpen();
    }
  }

  /**
   * {@inheritDoc}
   */
  @Override
  public int write(ByteBuffer data, String sequenceKey) throws IOException {
    synchronized (lock) {
    writeBuffer.clear();
    extendBufferIfNecessary(data);
    int oldPosition = position;
    Record lastRecord = new Record();
    do {
      Record currentRecord = createRecord(data, lastRecord);
      if (currentRecord.getType() == RecordType.NONE) {
        writeBlanks(currentRecord.getBytes());
      } else {
        writePhysicalRecord(data, currentRecord);
      }
      position = oldPosition + writeBuffer.position();
      lastRecord = currentRecord;
    } while (data.hasRemaining());

    writeBuffer.flip();
    if (sequenceKey == null) {
      return output.write(writeBuffer);
    }
    return output.write(writeBuffer, sequenceKey);
    }
  }

  /**
   * {@inheritDoc}
   */
  @Override
  public void closeFinally() throws IllegalStateException, IOException {
    synchronized (lock) {
    closeStream();
    output.closeFinally();
    }
  }

  /**
   * Closes and finalizes the {@link RecordWriteChannel}.
   */
  @Override
  public void close() throws IOException {
    synchronized (lock) {
    closeStream();
    output.close();
    }
  }

  /**
   * Fills a {@link Record} object with data about the physical record to write.
   *
   * @param data the users data.
   * @param lastRecord a {@link Record} representing the last physical record written.
   * @return the {@link Record} with new write data.
   **/
  private Record createRecord(ByteBuffer data, Record lastRecord) {
    int bytesToBlockEnd = BLOCK_SIZE - (position % BLOCK_SIZE);
    int minBytesToWrite = data.limit() + HEADER_LENGTH - data.position();
    RecordType type = RecordType.UNKNOWN;
    int bytes = -1;
    if (bytesToBlockEnd < HEADER_LENGTH) {
      type = lastRecord.getType();
      bytes = bytesToBlockEnd;
    } else if (lastRecord.getType() == RecordType.NONE && minBytesToWrite <= bytesToBlockEnd) {
      type = RecordType.FULL;
      bytes = minBytesToWrite - HEADER_LENGTH;
    } else if (lastRecord.getType() == RecordType.NONE) {
      type = RecordType.FIRST;
      bytes = bytesToBlockEnd - HEADER_LENGTH;
    } else if (minBytesToWrite <= bytesToBlockEnd) {
      type = RecordType.LAST;
      bytes = data.limit() - data.position();
    } else {
      type = RecordType.MIDDLE;
      bytes = bytesToBlockEnd - HEADER_LENGTH;
    }
    return new Record(type, bytes);
  }

  /**
   * This method creates a record inside of a {@link ByteBuffer}
   *
   * @param data The data to output.
   * @param record A {@link RecordWriteChannelImpl.Record} object that describes
   *        which data to write.
   */
  private void writePhysicalRecord(ByteBuffer data, Record record) {
    writeBuffer.putInt(generateCrc(data.array(), data.position(), record.getBytes(),
        record.getType()));
    writeBuffer.putShort((short) record.getBytes());
    writeBuffer.put(record.getType().value());
    writeBuffer.put(data.array(), data.position(), record.getBytes());
    data.position(data.position() + record.getBytes());
  }

  /**
   * Fills the {@link ByteBuffer} with 0x00;
   *
   * @param numBlanks the number of bytes to pad.
   */
  private void writeBlanks(int numBlanks) {
    for (int i = 0; i < numBlanks; i++) {
      writeBuffer.put((byte) 0x00);
    }
  }

  /**
   * Generates a CRC32C checksum using {@link Crc32c} for a specific record.
   *
   * @param data The user data over which the checksum will be generated.
   * @param off The offset into the user data at which to begin the computation.
   * @param len The length of user data to use in the computation.
   * @param type The {@link RecordType} of the record, which is included in the
   *        checksum.
   * @return the masked checksum.
   */
  private int generateCrc(byte[] data, int off, int len, RecordType type) {
    Crc32c crc = new Crc32c();
    crc.update(type.value());
    crc.update(data, off, len);
    return (int) maskCrc(crc.getValue());
  }

  private void extendBufferIfNecessary(ByteBuffer record) {
    int maxNumHeaders = 1 + (int) Math.ceil(record.limit() / (BLOCK_SIZE - HEADER_LENGTH));
    int maxRecordSize = record.limit() + maxNumHeaders * HEADER_LENGTH;
    int capacity = writeBuffer.capacity();
    while (capacity < maxRecordSize) {
      capacity *= 2;
    }
    writeBuffer = ByteBuffer.allocate(capacity);
    writeBuffer.order(ByteOrder.LITTLE_ENDIAN);

  }

  /**
   * Closes the stream and adds padding to the end of the block without closing
   * the underlying {@link AppEngineFile}.
   *
   * @throws IOException
   */
  private void closeStream() throws IOException {
    writeBuffer.clear();
    int bytesToBlockEnd = BLOCK_SIZE - (position % BLOCK_SIZE);
    if (bytesToBlockEnd == BLOCK_SIZE) {
      return;
    }
    writeBlanks(bytesToBlockEnd);
    writeBuffer.flip();
    position += writeBuffer.limit();
    output.write(writeBuffer);
  }

}

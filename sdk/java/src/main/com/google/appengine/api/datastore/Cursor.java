// Copyright 2008 Google Inc. All Rights Reserved.
package com.google.appengine.api.datastore;

import static com.google.appengine.api.datastore.FetchOptions.Builder.withStartCursor;
import static com.google.common.io.BaseEncoding.base64Url;

import com.google.apphosting.api.DatastorePb.CompiledCursor;
import com.google.apphosting.api.DatastorePb.CompiledCursor.Position;
import com.google.apphosting.api.DatastorePb.Query;
import com.google.common.io.ByteStreams;
import com.google.common.util.Base64;
import com.google.io.protocol.ProtocolSource;

import java.io.IOException;
import java.io.Serializable;

/**
 * A cursor that represents a position in a query.
 *
 * To resume a {@link Query} at the position defined by a {@link Cursor}, the
 * {@link Cursor} must be present in the {@link FetchOptions} passed to a {@link
 * PreparedQuery} identical to the one it was created from.
 * <p>
 * Cursors can be retrieved from {@code PreparedQuery.asQueryResult*} functions.
 * A typical use case would be:
 *
 * <blockquote>
 * <pre>
 * Cursor originalCursor = preparedQuery.asQueryResultList(withLimit(20)).getCursor();
 * String encodedCursor = original.toWebSafeString();
 * </pre>
 * </blockquote>
 *
 * The encoded cursor can then be passed safely in a get or post arg of a web
 * request and on another request the next batch of results can be retrieved with:
 *
 * <blockquote>
 * <pre>
 * Cursor decodedCursor = Cursor.fromWebSafeString(encodedCursor);
 * List<Entity> nextBatch = preparedQuery.asQueryResultList(withLimit(20).cursor(decoded));
 * </pre>
 * </blockquote>
 *
 */
public final class Cursor implements Serializable {
  static final long serialVersionUID = 3515556366838971499L;
  private CompiledCursor compiledCursor;

  Cursor() {
    compiledCursor = new CompiledCursor();
  }

  Cursor(Cursor previousCursor) {
    this(previousCursor.compiledCursor);
  }

  Cursor(CompiledCursor compiledCursor) {
    this.compiledCursor = compiledCursor.clone();
  }

  private void writeObject(java.io.ObjectOutputStream out) throws IOException {
    out.write(compiledCursor.toByteArray());
  }

  private void readObject(java.io.ObjectInputStream in) throws IOException {
    compiledCursor = fromByteArray(ByteStreams.toByteArray(in)).compiledCursor;
  }

  void advance(final int n, PreparedQuery query) {
    if (n > 0) {
      compiledCursor = query.asQueryResultIterator(withStartCursor(this).offset(n).limit(0))
          .getCursor().compiledCursor;
    } else if (n == -1 &&
               compiledCursor.positionSize() == 1 &&
               compiledCursor.getPosition(0).hasStartKey() &&
               !compiledCursor.getPosition(0).isStartInclusive()) {
      compiledCursor.getPosition(0).setStartInclusive(true);
    } else if (n != 0) {
      throw new IllegalArgumentException("Unable to offset cursor by " + n + " results.");
    }
  }

  /**
   * @return a new cursor to the location in a query sorted in the reverse direction
   * @see com.google.appengine.api.datastore.Query#reverse()
   */
  public Cursor reverse() {
    CompiledCursor clone = compiledCursor.clone();
    for (Position pos : clone.positions()) {
      pos.setStartInclusive(!pos.isStartInclusive());
    }
    return new Cursor(clone);
  }

  /**
   * Encodes the current cursor as a web safe string that can later be decoded
   * by {@link #fromWebSafeString(String)}
   */
  public String toWebSafeString() {
    return base64Url().omitPadding().encode(compiledCursor.toByteArray());
  }

  /**
   * Decodes the given encoded cursor
   *
   * @param encodedCursor
   * @return the decoded cursor
   * @throws IllegalArgumentException if the provided string is not a valid encoded cursor
   */
  public static Cursor fromWebSafeString(String encodedCursor) {
    if (encodedCursor == null) {
      throw new NullPointerException("encodedCursor must not be null");
    }

    try {
      return fromByteArray(Base64.decodeWebSafe(encodedCursor));
    } catch (IllegalArgumentException e) {
      throw new IllegalArgumentException("Unable to decode provided cursor.", e);
    }
  }

  private static Cursor fromByteArray(byte[] bytes) {
    Cursor result = new Cursor();
    if (!result.compiledCursor.merge(new ProtocolSource(bytes))) {
      throw new IllegalArgumentException("Unable to decode provided cursor.");
    }
    return result;
  }

  CompiledCursor convertToPb() {
    return compiledCursor;
  }

  @Override
  public boolean equals(Object obj) {
    if (obj == null) {
      return false;
    }

    if (obj.getClass() != this.getClass()) {
      return false;
    }

    return compiledCursor.equals(((Cursor) obj).compiledCursor);
  }

  @Override
  public int hashCode() {
    return compiledCursor.hashCode();
  }

  @Override
  public String toString() {
    return compiledCursor.toString();
  }
}

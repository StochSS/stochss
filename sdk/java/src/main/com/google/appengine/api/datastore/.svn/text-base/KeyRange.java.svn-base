// Copyright 2009 Google Inc. All Rights Reserved.
package com.google.appengine.api.datastore;

import java.io.Serializable;
import java.util.Iterator;
import java.util.NoSuchElementException;

/**
 * Represents a range of unique datastore identifiers from
 * {@code getStart().getId()} to {@code getEnd().getId()} inclusive.
 * If an instance of this class is the result of a call to
 * {@code DatastoreService.allocateIds()}, the {@link Key Keys} returned by
 * this instance have been consumed in the datastore's id-space and are
 * guaranteed never to be reused.
 * <br>
 * This class can be used to construct {@link Entity Entities} with {@link
 * Key Keys} that have specific id values without fear of the datastore
 * creating new records with those same ids at a later date.  This can be
 * helpful as part of a data migration or large bulk upload where you may need
 * to preserve existing ids and relationships between entities.
 * <br>
 * This class is threadsafe but the {@link Iterator Iterators} returned by
 * {@link #iterator()} are not.
 *
 */
public final class KeyRange implements Iterable<Key>, Serializable {
  static final long serialVersionUID = 962890261927141064L;

  private final Key parent;
  private final String kind;
  private final Key start;
  private final Key end;
  private final AppIdNamespace appIdNamespace;

  public KeyRange(Key parent, String kind, long start, long end) {
    this(parent, kind, start, end, DatastoreApiHelper.getCurrentAppIdNamespace());
  }

  KeyRange(Key parent, String kind, long start, long end, AppIdNamespace appIdNamespace) {
    if (parent != null && !parent.isComplete()) {
      throw new IllegalArgumentException("Invalid parent: not a complete key");
    }

    if (kind == null || kind.equals("")) {
      throw new IllegalArgumentException("Invalid kind: cannot be null or empty");
    }

    if (start < 1) {
      throw new IllegalArgumentException("Illegal start " + start + ": less than 1");
    }

    if (end < start) {
      throw new IllegalArgumentException("Illegal end " + end + ": less than start " + start);
    }

    this.parent = parent;
    this.kind = kind;
    this.appIdNamespace = appIdNamespace;
    this.start = KeyFactory.createKey(parent, kind, start, appIdNamespace);
    this.end = KeyFactory.createKey(parent, kind, end, appIdNamespace);
  }

  /**
   * This constructor exists for frameworks (e.g. Google Web Toolkit)
   * that require it for serialization purposes.  It should not be
   * called explicitly.
   */
  @SuppressWarnings("unused")
  private KeyRange() {
    parent = null;
    kind = null;
    start = null;
    end = null;
    appIdNamespace = null;
  }

  AppIdNamespace getAppIdNamespace() {
    return appIdNamespace;
  }

  /**
   * @return The parent {@link Key} of the range.
   */
  Key getParent() {
    return parent;
  }

  /**
   * @return The kind of the range.
   */
  String getKind() {
    return kind;
  }

  /**
   * @return The first {@link Key} in the range.
   */
  public Key getStart() {
    return start;
  }

  /**
   * @return The last {@link Key} in the range.
   */
  public Key getEnd() {
    return end;
  }

  /**
   * @return The size of the range.
   */
  public long getSize() {
    return end.getId() - start.getId() + 1;
  }

  @Override
  public Iterator<Key> iterator() {
    return new IdRangeIterator();
  }

  @Override
  public boolean equals(Object obj) {
    if (obj == null || !(obj instanceof KeyRange)) {
      return false;
    }
    KeyRange that = (KeyRange) obj;

    return (this.start.equals(that.start) && this.end.equals(that.end));
  }

  @Override
  public int hashCode() {
    return 31 * start.hashCode() + end.hashCode();
  }

  /**
   * {@link Iterator} implementation that returns {@link Key Keys}
   * in the range defined by the enclosing {@link KeyRange}.
   */
  private final class IdRangeIterator implements Iterator<Key> {
    private long next = start.getId();

    @Override
    public boolean hasNext() {
      return next <= end.getId();
    }

    @Override
    public Key next() {
      if (!hasNext()) {
        throw new NoSuchElementException();
      }
      return KeyFactory.createKey(parent, kind, next++, appIdNamespace);
    }

    @Override
    public void remove() {
      throw new UnsupportedOperationException();
    }
  }
}

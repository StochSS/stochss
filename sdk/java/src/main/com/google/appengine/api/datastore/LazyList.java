// Copyright 2011 Google Inc. All Rights Reserved.
package com.google.appengine.api.datastore;

import java.io.IOException;
import java.io.ObjectOutputStream;
import java.io.Serializable;
import java.util.AbstractList;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.ListIterator;
import java.util.NoSuchElementException;

/**
 * A {@link List} implementation that pulls query results from the server
 * lazily.
 *
 * Although {@link AbstractList} only requires us to implement
 * {@link #get(int)}, {@link #size()}, {@link #set(int, Entity)}, and
 * {@link #remove(int)}, we provide our own implementations for many other
 * methods.  The reason is that many of the implementations in
 * {@link AbstractList} invoke {@link #size()}, which requires us to pull the
 * entire result set back from the server.  We provide more efficient
 * implementations wherever possible (which is most places).
 *
 * @author Max Ross <max.ross@gmail.com>
 */
class LazyList extends AbstractList<Entity> implements QueryResultList<Entity>, Serializable {
  static final long serialVersionUID = -288529194506134706L;
 private final transient QueryResultIteratorImpl resultIterator;
  final List<Entity> results = new ArrayList<Entity>();
  private boolean endOfData = false;
  private boolean cleared = false;
 private Cursor cursor = null;

  LazyList(QueryResultIteratorImpl resultIterator) {
    this.resultIterator = resultIterator;
  }

  /**
   * Resolves the entire result set.
   */
  private void resolveAllData() {
    resolveToIndex(-1, true);
  }

  /**
   * Resolves enough of the result set to return the {@link Entity} at the
   * specified {@code index}.  There is no guarantee that the result set
   * actually has an {@link Entity} at this index, but it's up to the caller
   * to recognize this and respond appropriately.
   *
   * @param index The index to which we need to resolve.
   */
  private void resolveToIndex(int index) {
    resolveToIndex(index, false);
  }

  /**
   * Resolves enough of the result set to return the {@link Entity} at the
   * specified {@code index}.  There is no guarantee that the result set
   * actually has an {@link Entity} at this index, but it's up to the caller
   * to recognize this and respond appropriately.
   *
   * @param index The index to which we need to resolve.
   * @param fetchAll If {@code true}, ignores the provided index and fetches
   * all data.
   */
  private void resolveToIndex(int index, boolean fetchAll) {
    if (cleared) {
      return;
    }
    forceResolveToIndex(index, fetchAll);
  }

  /**
   * @see #resolveToIndex(int, boolean)   The only difference here is that we
   * ignore the short-circuit that may have been set by a call to
   * {@link #clear()}.
   */
  private void forceResolveToIndex(int index, boolean fetchAll) {
    if (endOfData) {
      return;
    }
    if (fetchAll || results.size() <= index) {
      int numToFetch;
      if (fetchAll) {
        numToFetch = Integer.MAX_VALUE;
      } else {
        numToFetch = (index - results.size()) + 1;
      }

      List<Entity> nextBatch = resultIterator.nextList(numToFetch);
      results.addAll(nextBatch);
      if (nextBatch.size() < numToFetch) {
        endOfData = true;
      }
    }
  }

  /**
   * Implementation required for concrete implementations of
   * {@link AbstractList}.
   */
  @Override
  public Entity get(int i) {
    resolveToIndex(i);
    return results.get(i);
  }

  /**
   * Implementation required for concrete implementations of
   * {@link AbstractList}.
   */
  @Override
  public int size() {
    resolveAllData();
    return results.size();
  }

  /**
   * Implementation required for concrete, modifiable implementations of
   * {@link AbstractList}.
   */
  @Override
  public Entity set(int i, Entity entity) {
    resolveToIndex(i);
    return results.set(i, entity);
  }

  /**
   * Implementation required for concrete, modifiable, variable-length
   * implementations of {@link AbstractList}.
   */
  @Override
  public void add(int i, Entity entity) {
    resolveToIndex(i);
    results.add(i, entity);
  }

  /**
   * Implementation required for concrete, modifiable, variable-length
   * implementations of {@link AbstractList}.
   */
  @Override
  public Entity remove(int i) {
    resolveToIndex(i);
    return results.remove(i);
  }

  /**
   * We provide our own implementation that does not invoke {@link #size()}.
   */
  @Override
  public Iterator<Entity> iterator() {
    return listIterator();
  }

  /**
   * We provide our own implementation that does not invoke {@link #size()}.
   *
   * @see ListIterator for the spec.
   */
  @Override
  public ListIterator<Entity> listIterator() {
    return new ListIterator<Entity>() {
      int currentIndex = 0;
      int indexOfLastElementReturned = -1;
      boolean elementReturned = false;
      boolean addOrRemoveCalledSinceElementReturned = false;

      @Override
      public boolean hasNext() {
        resolveToIndex(currentIndex);
        return currentIndex < results.size();
      }

      @Override
      public Entity next() {
        if (hasNext()) {
          elementReturned = true;
          addOrRemoveCalledSinceElementReturned = false;
          indexOfLastElementReturned = currentIndex++;
          return results.get(indexOfLastElementReturned);
        }
        throw new NoSuchElementException();
      }

      @Override
      public boolean hasPrevious() {
        return currentIndex > 0;
      }

      @Override
      public Entity previous() {
        if (hasPrevious()) {
          elementReturned = true;
          addOrRemoveCalledSinceElementReturned = false;
          indexOfLastElementReturned = --currentIndex;
          return results.get(indexOfLastElementReturned);
        }
        throw new NoSuchElementException();
      }

      @Override
      public int nextIndex() {
        return currentIndex;
      }

      @Override
      public int previousIndex() {
        return currentIndex - 1;
      }

      @Override
      public void remove() {
        if (!elementReturned || addOrRemoveCalledSinceElementReturned) {
          throw new IllegalStateException();
        }
        addOrRemoveCalledSinceElementReturned = true;
        if (indexOfLastElementReturned < currentIndex) {
          currentIndex--;
        }
        LazyList.this.remove(indexOfLastElementReturned);
      }

      @Override
      public void set(Entity entity) {
        if (!elementReturned || addOrRemoveCalledSinceElementReturned) {
          throw new IllegalStateException();
        }
        LazyList.this.set(indexOfLastElementReturned, entity);
      }

      @Override
      public void add(Entity entity) {
        addOrRemoveCalledSinceElementReturned = true;
        LazyList.this.add(currentIndex++, entity);
      }
    };
  }

  /**
   * The spec for this method says we need to throw
   * {@link IndexOutOfBoundsException} if {@code index} is < 0 or > size().
   * Since we need to know size up front, there's no way to service this method
   * without resolving the entire result set.  The only reason for the override
   * is to provide a good location for this comment.
   */
  @Override
  public ListIterator<Entity> listIterator(int index) {
    return super.listIterator(index);
  }

  /**
   * We provide our own implementation that does not invoke {@link #size()}.
   */
  @Override
  public boolean isEmpty() {
    resolveToIndex(0);
    return results.isEmpty();
  }

  /**
   * We provide our own implementation that does not invoke {@link #size()}.
   */
  @Override
  public List<Entity> subList(int from, int to) {
    resolveToIndex(to - 1);
    return results.subList(from, to);
  }

  /**
   * We provide our own implementation that does not invoke {@link #size()}.
   */
  @Override
  public void clear() {
    results.clear();
    cleared = true;
  }

  /**
   * We provide our own implementation that does not invoke {@link #size()}.
   */
  @Override
  public int indexOf(Object o) {
    int index = 0;
    for (Entity e : this) {
      if (o == null) {
        if (e == null) {
          return index;
        }
      } else if (o.equals(e)) {
        return index;
      }
      index++;
    }
    return -1;
  }

  @Override
  public List<Index> getIndexList() {
    List<Index> indexList = null;
    if (resultIterator != null) {
      indexList = resultIterator.getIndexList();
    }
    return indexList;
  }

  @Override
  public Cursor getCursor() {
    if (cursor == null && resultIterator != null) {
      forceResolveToIndex(-1, true);
      cursor = resultIterator.getCursor();
    }
    return cursor;
  }

  /**
   * Custom serialization logic to ensure that we read the entire result set
   * before we serialize.
   */
  private void writeObject(ObjectOutputStream out) throws IOException {
    resolveAllData();
    cursor = getCursor();
    out.defaultWriteObject();
  }
}

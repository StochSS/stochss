// Copyright 2007 Google Inc. All rights reserved.

package com.google.appengine.api.datastore;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.NoSuchElementException;

/**
 * {@link QueryResultIteratorImpl} returns zero or more {@link Entity} objects
 * that are the result of a {@link Query} that has been executed.
 *
 * {@link Entity} objects can be retrieved one-at-a-time using the
 * standard {@link QueryResultIterator} interface.  In addition, we extend this
 * interface to allow access to batches of {@link Entity} objects by
 * calling {@link #nextList}.
 *
 * If the {@link Query} is keys only, i.e. {@link Query#isKeysOnly()} returns
 * true, then the {@link Entity} objects returned by this iterator will only
 * have their key populated. They won't have properties or other data.
 *
 * Note: this class is not thread-safe.
 *
 */
class QueryResultIteratorImpl implements QueryResultIterator<Entity> {
  private final PreparedQuery query;
  private final QueryResultsSource resultsSource;
  private final LinkedList<Entity> entityBuffer;
  private final Transaction txn;
  private Cursor lastCursor = null;
  private Cursor nextCursor;
  private int resultsSinceLastCursor = 0;

  /**
   * Create a QueryIterator that wraps around the specified Cursor.
   * Elements will be retrieved in batches {@code minRequestSize}.
   */
  QueryResultIteratorImpl(
      PreparedQuery query,
      QueryResultsSource resultsSource,
      FetchOptions fetchOptions,
      Transaction txn) {
    this.query = query;
    this.resultsSource = resultsSource;
    this.entityBuffer = new LinkedList<Entity>();
    this.txn = txn;

    if (fetchOptions.getCompile() == Boolean.TRUE) {
      nextCursor = fetchOptions.getStartCursor() == null ?
          new Cursor() :
          new Cursor(fetchOptions.getStartCursor());

      if (fetchOptions.getOffset() != null) {
        resultsSinceLastCursor = fetchOptions.getOffset();
      }
    }
  }

  @Override
  public boolean hasNext() {
    return ensureLoaded();
  }

  @Override
  public Entity next() {
    TransactionImpl.ensureTxnActive(txn);
    if (ensureLoaded()) {
      ++resultsSinceLastCursor;
      return entityBuffer.removeFirst();
    } else {
      throw new NoSuchElementException();
    }
  }

  @Override
  public List<Index> getIndexList() {
    return resultsSource.getIndexList();
  }

  @Override
  public Cursor getCursor() {
    ensureInitialized();
    Cursor cursor = null;
    if (entityBuffer.isEmpty()) {
      cursor = nextCursor;
    } else if (lastCursor != null) {
      lastCursor.advance(resultsSinceLastCursor, query);
      resultsSinceLastCursor = 0;
      cursor = lastCursor;
    }

    if (cursor != null) {
      return new Cursor(cursor);
    } else {
      return null;
    }
  }

  /**
   * Returns a {@code List} of up to {@code maximumElements}
   * elements.  If there are fewer than this many entities left to
   * be retrieved, the {@code List} returned will simply contain
   * less than {@code maximumElements} elements.  In particular,
   * calling this when there are no elements remaining is not an
   * error, it simply returns an empty list.
   */
  public List<Entity> nextList(int maximumElements) {
    TransactionImpl.ensureTxnActive(txn);
    ensureLoaded(maximumElements);

    int numberToReturn = Math.min(maximumElements, entityBuffer.size());
    List<Entity> backingList = entityBuffer.subList(0, numberToReturn);

    List<Entity> returnList = new ArrayList<Entity>(backingList);
    backingList.clear();
    resultsSinceLastCursor += returnList.size();
    return returnList;
  }

  private void saveNextCursor(int bufferSize, Cursor next) {
    if (next != null) {
      lastCursor = nextCursor;
      resultsSinceLastCursor = -bufferSize;
      nextCursor = next;
    }
  }

  private void ensureInitialized() {
    saveNextCursor(entityBuffer.size(), resultsSource.loadMoreEntities(0, entityBuffer));
  }

  /**
   * Request additional {@code Entity} objects from the current cursor so
   * that there is at least one pending object.
   *
   * This function makes a single call to getMoreEntities.
   *
   */
  private boolean ensureLoaded() {
    if (entityBuffer.isEmpty() && resultsSource.hasMoreEntities()) {
      saveNextCursor(entityBuffer.size(), resultsSource.loadMoreEntities(entityBuffer));
    }
    return !entityBuffer.isEmpty();
  }

  /**
   * Request enough additional {@code Entity} objects from the
   * current results source that there are {@code numberDesired} pending
   * objects.
   */
  private boolean ensureLoaded(int numberDesired) {
    int numberToLoad = numberDesired - entityBuffer.size();
    if (numberToLoad > 0 && resultsSource.hasMoreEntities()) {
      saveNextCursor(entityBuffer.size(),
                     resultsSource.loadMoreEntities(numberToLoad, entityBuffer));
    }
    return entityBuffer.size() >= numberDesired;
  }

  /**
   * The optional remove method is not supported.
   * @throws UnsupportedOperationException
   */
  @Override
  public void remove() {
    throw new UnsupportedOperationException();
  }

  public int getNumSkipped() {
    ensureInitialized();
    return resultsSource.getNumSkipped();
  }
}

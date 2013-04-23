// Copyright 2011 Google. All Rights Reserved.
package com.google.appengine.api.datastore;

import com.google.common.base.Preconditions;
import com.google.common.collect.Iterables;
import com.google.common.collect.Multimap;

import java.util.Collection;
import java.util.Collections;
import java.util.List;

/**
 * Abstract base class with a common {@link CallbackContext} implementation.
 *
 */
abstract class BaseCallbackContext<T> implements CallbackContext<T> {
  private final CurrentTransactionProvider currentTxnProvider;

  /**
   * All elements provided to the operation that triggered the callback.
   */
  private final List<T> elements;

  /**
   * The index into {@link #elements} of the "current" element.
   */
  private int currentIndex;

  /**
   * @param currentTxnProvider Provides the current transaction
   * @param elements All elements involved in the operation that triggered the
   * callback.
   */
  BaseCallbackContext(CurrentTransactionProvider currentTxnProvider, List<T> elements) {
    this.currentTxnProvider = Preconditions.checkNotNull(currentTxnProvider);
    this.elements = Collections.unmodifiableList(Preconditions.checkNotNull(elements));
  }

  @Override
  public List<T> getElements() {
    return elements;
  }

  @Override
  public Transaction getCurrentTransaction() {
    return currentTxnProvider.getCurrentTransaction(null);
  }

  @Override
  public int getCurrentIndex() {
    return currentIndex;
  }

  @Override
  public T getCurrentElement() {
    return elements.get(currentIndex);
  }

  /**
   * Executes all appropriate callbacks for the elements in this context.
   *
   * @param callbacksByKind A Multimap containing lists of callbacks, organized by
   * kind.
   * @param noKindCallbacks Callbacks that apply to all elements, independent
   * of kind.
   *
   * @throws IllegalStateException If this method has already been called.
   */
  void executeCallbacks(Multimap<String, DatastoreCallbacksImpl.Callback> callbacksByKind,
      Collection<DatastoreCallbacksImpl.Callback> noKindCallbacks) {
    Preconditions.checkState(currentIndex == 0,
        "executeCallbacks cannot be called more than once.");
    for (T ele : elements) {
      Iterable<DatastoreCallbacksImpl.Callback> allCallbacksToRun =
          Iterables.concat(callbacksByKind.get(getKind(ele)), noKindCallbacks);
      for (DatastoreCallbacksImpl.Callback callback : allCallbacksToRun) {
        callback.run(this);
      }
      currentIndex++;
    }
  }

  /**
   * Abstract method that, given an element, knows how to extract its kind.
   */
  abstract String getKind(T ele);
}

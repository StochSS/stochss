// Copyright 2011 Google Inc. All Rights Reserved.
package com.google.appengine.api.datastore;

import java.util.List;

/**
 * Describes the context in which a callback runs.  The context has access to
 * the current transaction (if any), the element that the callback is
 * operating on (eg the Entity being put or the Key being deleted), as well as
 * all elements being operated on in the operation that triggered the callback..
 *
 * @param <T> the type of element that the callback is acting on.
 *
 */
public interface CallbackContext<T> {
  /**
   * @return An unmodifiable view of the elements involved in the operation
   * that triggered the callback..
   */
  List<T> getElements();

  /**
   * @return The current transaction, or {@code null} if there is no current
   * transaction.
   */
  Transaction getCurrentTransaction();

  /**
   * @return The index in the result of {@link #getElements()} of the element
   * for which the callback has been invoked.
   */
  int getCurrentIndex();

  /**
   * @return The element for which the callback has been invoked.  Shortcut
   * for {@code getElements().getCurrentIndex()}.
   */
  T getCurrentElement();
}

// Copyright 2010 Google Inc. All Rights Reserved.

package com.google.appengine.api.datastore;

import java.util.Collection;

/**
 * Methods that are common between {@link DatastoreService} and
 * {@link AsyncDatastoreService}.
 *
 */
public interface BaseDatastoreService {

  /**
   * Prepares a query for execution.
   * <p>
   * This method returns a {@link PreparedQuery} which can be used
   * to execute and retrieve results from the datastore for {@code query}.
   *
   * This operation will not execute in a transaction even if there is a current
   * transaction and the provided query is an ancestor query.  This operation
   * also ignores the {@link ImplicitTransactionManagementPolicy}.  If you are
   * preparing an ancestory query and you want it to execute in a transaction,
   * use {@link #prepare(Transaction, Query)}.
   *
   * @param query a not {@code null Query}.
   * @return a not {@code null PreparedQuery}.
   */
  PreparedQuery prepare(Query query);

  /**
   * Exhibits the same behavior as {@link #prepare(Query)}, but executes within
   * the provided transaction.  It is up to the caller to commit or
   * rollback.  Transaction can be null.
   *
   * @throws IllegalArgumentException If txn is not null and query is not an
   * ancestor query
   * @throws IllegalStateException If txn is not null and the txn is not active
   */
  PreparedQuery prepare(Transaction txn, Query query);

  /**
   * Returns the current transaction for this thread, or throws an exception if
   * there is no current transaction.  The current transaction is defined as the
   * result of the most recent, same-thread invocation of
   * beginTransaction() that has not been committed or rolled back.
   *
   * Use this method for when you expect there to be
   * a current transaction and consider it an error if there isn't.
   *
   * @return The current transaction.
   * @throws java.util.NoSuchElementException If there is no current transaction.
   */
  Transaction getCurrentTransaction();

  /**
   * Returns the current transaction for this thread, or returns the parameter
   * if there is no current transaction.  You can use {@code null} or provide
   * your own object to represent null.  See {@link #getCurrentTransaction()}
   * for a definition of "current transaction."
   *
   * Use this method when you're not sure if there is a current transaction.
   *
   * @param returnedIfNoTxn The return value of this method if there is no
   * current transaction.  Can be null.
   * @return The current transaction, or the parameter that was passed in
   * if there is no current transaction.
   */
  Transaction getCurrentTransaction(Transaction returnedIfNoTxn);

  /**
   * @return All {@link Transaction}s started by this thread upon which no
   * attempt to commit or rollback has been made.
   */
  Collection<Transaction> getActiveTransactions();

}

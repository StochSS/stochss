// Copyright 2008 Google Inc. All Rights Reserved.
package com.google.appengine.api.datastore;

/**
 * A class that knows how to run things inside transactions.
 *
 * @param <T> The type of result of the operation that we run in a transaction.
 *
 */
abstract class TransactionRunner<T> {

  private final Transaction txn;
  private final boolean finishTxn;

  protected TransactionRunner(Transaction txn, boolean finishTxn) {
    if (txn == null && finishTxn) {
      throw new IllegalArgumentException("Cannot have a null txn when finishTxn is true.  This "
          + "almost certainly represents a programming error on the part of the App Engine team.  "
          + "Please report this via standard support channels and accept our humblest apologies.");
    }
    TransactionImpl.ensureTxnActive(txn);
    this.txn = txn;
    this.finishTxn = finishTxn;
  }

  public T runInTransaction() {
    boolean success = false;
    try {
      T result = runInternal();
      success = true;
      return result;
    } finally {
      if (finishTxn) {
        if (success) {
          txn.commit();
        } else {
          txn.rollback();
        }
      }
    }
  }

  protected abstract T runInternal();
}

// Copyright 2010 Google Inc. All rights reserved.

package com.google.appengine.api.datastore;

/**
 * {@code CommittedButStillApplyingException} is thrown when the write or
 * transaction was committed, but some entities or index rows may not have
 * been fully updated. Those updates should automatically be applied soon. You
 * can roll them forward immediately by reading one of the entities inside a
 * transaction.
 *
 */
public class CommittedButStillApplyingException extends RuntimeException {
  public CommittedButStillApplyingException(String message) {
    super(message);
  }

  public CommittedButStillApplyingException(String message, Throwable cause) {
    super(message, cause);
  }
}

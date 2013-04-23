// Copyright 2008 Google Inc. All Rights Reserved.
package com.google.appengine.api.datastore;

import com.google.appengine.api.datastore.EntityCachingStrategy.PreMutationCachingResult;
import com.google.appengine.api.utils.FutureWrapper;
import com.google.apphosting.api.ApiBasePb;
import com.google.apphosting.api.ApiProxy;
import com.google.apphosting.api.ApiProxy.ApiConfig;
import com.google.apphosting.api.DatastorePb;
import com.google.apphosting.api.DatastorePb.CommitResponse;
import com.google.io.protocol.ProtocolMessage;

import java.util.List;
import java.util.concurrent.Future;

/**
 * Implementation of the {@link Transaction} interface that routes all calls
 * through the {@link ApiProxy}.  Our implementation is implicitly async.
 * BeginTransaction RPCs always return instantly, and this class maintains a
 * reference to the {@link Future} associated with the RPC.  We service as
 * much of the {@link Transaction} interface as we can without retrieving
 * the result of the future.
 *
 * There is no synchronization in this code because transactions are associated
 * with a single thread and are documented as such.
 *
 */
class TransactionImpl implements Transaction, CurrentTransactionProvider {

  enum TransactionState {
    BEGUN,
    COMPLETION_IN_PROGRESS,
    COMMITTED,
    ROLLED_BACK,
    ERROR
  }

  private final ApiConfig apiConfig;

  private final String app;

  /**
   * The {@link Future} associated with the BeginTransaction RPC we sent to the
   * datastore server.
   */
  private final Future<DatastorePb.Transaction> future;

  private final TransactionStack txnStack;

  private final DatastoreCallbacks callbacks;

  private final EntityCachingStrategy entityCachingStrategy;

  TransactionState state = TransactionState.BEGUN;

  /**
   * A {@link PostOpFuture} implementation that runs both post put and post
   * delete callbacks.
   */
  private class PostCommitFuture extends PostOpFuture<Void> {
    private final List<Entity> putEntities;
    private final List<Key> deletedKeys;

    private PostCommitFuture(
        List<Entity> putEntities, List<Key> deletedKeys, Future<Void> delegate) {
      super(delegate, callbacks);
      this.putEntities = putEntities;
      this.deletedKeys = deletedKeys;
    }

    @Override
    void executeCallbacks(Void ignoreMe) {
      PutContext putContext = new PutContext(TransactionImpl.this, putEntities);
      callbacks.executePostPutCallbacks(putContext);
      DeleteContext deleteContext = new DeleteContext(TransactionImpl.this, deletedKeys);
      callbacks.executePostDeleteCallbacks(deleteContext);
    }
  }

  TransactionImpl(ApiConfig apiConfig, String app, Future<DatastorePb.Transaction> future,
      TransactionStack txnStack, DatastoreCallbacks callbacks,
      EntityCachingStrategy entityCachingStrategy) {
    this.apiConfig = apiConfig;
    this.app = app;
    this.future = future;
    this.txnStack = txnStack;
    this.callbacks = callbacks;
    this.entityCachingStrategy = entityCachingStrategy;
  }

  /**
   * Provides the unique identifier for the txn.
   * Blocks on the future since the handle comes back from the datastore
   * server.
   */
  private long getHandle() {
    return FutureHelper.quietGet(future).getHandle();
  }

  <T extends ProtocolMessage<T>> Future<T> makeAsyncCall(
      String methodName, ProtocolMessage<?> request, T response) {
    return DatastoreApiHelper.makeAsyncCall(apiConfig, methodName, request, response);
  }

  private <T extends ProtocolMessage<T>> Future<T> makeAsyncCall(String methodName, T response) {
    DatastorePb.Transaction txn = new DatastorePb.Transaction();
    txn.setApp(app);
    txn.setHandle(getHandle());

    return makeAsyncCall(methodName, txn, response);
  }

  @Override
  public void commit() {
    FutureHelper.quietGet(commitAsync());
  }

  @Override
  public Future<Void> commitAsync() {
    ensureTxnStarted();
    try {
      for (Future<?> f : txnStack.getFutures(this)) {
        FutureHelper.quietGet(f);
      }
      PreMutationCachingResult preMutationCachingResult =
          entityCachingStrategy.preCommit(txnStack.getPutEntities(this),
              txnStack.getDeletedKeys(this));
      Future<CommitResponse> commitResponse = makeAsyncCall("Commit", new CommitResponse());
      state = TransactionState.COMPLETION_IN_PROGRESS;
      Future<Void> result = new FutureWrapper<CommitResponse, Void>(commitResponse) {
        @Override
        protected Void wrap(CommitResponse ignore) throws Exception {
          state = TransactionState.COMMITTED;
          return null;
        }

        @Override
        protected Throwable convertException(Throwable cause) {
          state = TransactionState.ERROR;
          return cause;
        }
      };
      result = entityCachingStrategy.createPostMutationFuture(result, preMutationCachingResult);
      return new PostCommitFuture(txnStack.getPutEntities(this), txnStack.getDeletedKeys(this),
          result);
    } finally {
      txnStack.remove(this);
    }
  }

  @Override
  public void rollback() {
    FutureHelper.quietGet(rollbackAsync());
  }

  @Override
  public Future<Void> rollbackAsync() {
    ensureTxnStarted();
    try {
      for (Future<?> f : txnStack.getFutures(this)) {
        FutureHelper.quietGet(f);
      }
      Future<ApiBasePb.VoidProto> future = makeAsyncCall("Rollback", new ApiBasePb.VoidProto());
      state = TransactionState.COMPLETION_IN_PROGRESS;
      return new FutureWrapper<ApiBasePb.VoidProto, Void>(future) {
        @Override
        protected Void wrap(ApiBasePb.VoidProto ignore) throws Exception {
          state = TransactionState.ROLLED_BACK;
          return null;
        }

        @Override
        protected Throwable convertException(Throwable cause) {
          state = TransactionState.ERROR;
          return cause;
        }
      };
    } finally {
      txnStack.remove(this);
    }
  }

  @Override
  public String getApp() {
    return app;
  }

  @Override
  public String getId() {
    return Long.toString(getHandle());
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }

    TransactionImpl that = (TransactionImpl) o;

    return getHandle() == that.getHandle();
  }

  @Override
  public int hashCode() {
    return (int) (getHandle() ^ (getHandle() >>> 32));
  }

  @Override
  public String toString() {
    return "Txn [" + app + "." + getHandle() + ", " + state + "]";
  }

  @Override
  public boolean isActive() {
    return state == TransactionState.BEGUN || state == TransactionState.COMPLETION_IN_PROGRESS;
  }

  @Override
  public Transaction getCurrentTransaction(Transaction defaultValue) {
    return this;
  }

  /**
   * If {@code txn} is not null and not active, throw
   * {@link IllegalStateException}.
   */
  static void ensureTxnActive(Transaction txn) {
    if (txn != null && !txn.isActive()) {
      throw new IllegalStateException("Transaction with which this operation is "
          + "associated is not active.");
    }
  }

  private void ensureTxnStarted() {
    if (state != TransactionState.BEGUN) {
      throw new IllegalStateException("Transaction is in state " + state + ".  There is no legal "
          + "transition out of this state.");
    }
  }
}

// Copyright 2010 Google Inc. All Rights Reserved.

package com.google.appengine.api.datastore;

import java.lang.reflect.UndeclaredThrowableException;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Future;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;

/**
 * Utilities for working with {@link Future Futures} in the synchronous
 * datastore api.
 *
 */
final class FutureHelper {

  /**
   * Return the result of the provided {@link Future}, converting all
   * checked exceptions to unchecked exceptions so the caller doesn't have to
   * handle them.  If an {@link ExecutionException ExecutionException} is
   * thrown the cause is wrapped in a {@link RuntimeException}.  If an {@link
   * InterruptedException} is thrown it is wrapped in a {@link
   * DatastoreFailureException}.
   *
   * @param future The Future whose result we want to return.
   * @param <T> The type of the provided Future.
   * @return The result of the provided Future.
   */
  static <T> T quietGet(Future<T> future) {
    try {
      return getInternal(future);
    } catch (ExecutionException e) {
      throw propagateAsRuntimeException(e);
    }
  }

  /**
   * Return the result of the provided {@link Future}, converting all
   * checked exceptions except those of the provided type to unchecked
   * exceptions so the caller doesn't have to handle them.  If an {@link
   * ExecutionException ExecutionException} is thrown and the type of the cause
   * does not equal {@code exceptionClass} the cause is wrapped in a {@link
   * RuntimeException}.  If the type of the cause does equal {@code
   * exceptionClass} the cause itself is thrown.  If an {@link
   * InterruptedException} is thrown it is wrapped in a {@link
   * DatastoreFailureException}.
   *
   * @param future The Future whose result we want to return.
   * @param <T> The type of the provided Future.
   * @param exceptionClass Exceptions of this type will be rethrown.
   * @return The result of the provided Future.
   * @throws E Thrown If an ExecutionException with a cause of the appropriate
   * type is caught.
   */
  static <T, E extends Exception> T quietGet(Future<T> future, Class<E> exceptionClass) throws E {
    try {
      return getInternal(future);
    } catch (ExecutionException e) {
      if (e.getCause().getClass().equals(exceptionClass)) {
        @SuppressWarnings("unchecked")
        E exception = (E) e.getCause();
        throw exception;
      }
      throw propagateAsRuntimeException(e);
    }
  }

  private static <T> T getInternal(Future<T> future) throws ExecutionException {
    try {
      return future.get();
    } catch (InterruptedException e) {
      Thread.currentThread().interrupt();
      throw new DatastoreFailureException("Unexpected failure", e);
    }
  }

  /**
   * Propagates the {@code cause} of the given {@link ExecutionException}
   * as a RuntimeException.
   *
   * @return nothing will ever be returned; this return type is only for
   *    convenience.
   */
  private static RuntimeException propagateAsRuntimeException(ExecutionException ee) {
    if (ee.getCause() instanceof RuntimeException) {
      throw (RuntimeException) ee.getCause();
    } else if (ee.getCause() instanceof Error) {
      throw (Error) ee.getCause();
    } else {
      throw new UndeclaredThrowableException(ee.getCause());
    }
  }

  /**
   * A base class for a {@link Future} that accumulates a result one sub-future
   * at a time.
   *
   * @param <K> The type used by sub-futures.
   * @param <I> The type of an intermediate result used to accumulate values.
   * @param <V> The type returned by this future.
   */
  abstract static class CumulativeAggregateFuture<K, I, V> implements Future<V> {
    protected final Iterable<Future<K>> futures;

    public CumulativeAggregateFuture(Iterable<Future<K>> futures) {
      this.futures = futures;
    }

    @Override
    public boolean cancel(boolean mayInterruptIfRunning) {
      boolean result = true;
      for (Future<K> future : futures) {
        result &= future.cancel(mayInterruptIfRunning);
      }
      return result;
    }

    @Override
    public boolean isCancelled() {
      boolean result = true;
      for (Future<K> future : futures) {
        result &= future.isCancelled();
      }
      return result;
    }

    @Override
    public boolean isDone() {
      boolean result = true;
      for (Future<K> future : futures) {
        result &= future.isDone();
      }
      return result;
    }

    @Override
    public final V get()
        throws InterruptedException, ExecutionException {
      I result = initIntermediateResult();
      for (Future<K> future : futures) {
        result = aggregate(future.get(), result);
      }
      return finalizeResult(result);
    }

    @Override
    public final V get(long timeout, TimeUnit unit)
        throws InterruptedException, ExecutionException, TimeoutException {
      I result = initIntermediateResult();
      for (Future<K> future : futures) {
        result = aggregate(future.get(timeout, unit), result);
      }
      return finalizeResult(result);
    }

    /**
     * Return a new intermediate result ready to aggregate values.
     */
    protected abstract I initIntermediateResult();

    /**
     * This function should combine the current result with the previously
     * aggregated result.
     *
     * <p>This function is guaranteed to be called in the order in which futures
     * are returned by the iterable provided to the constructor.
     *
     * <p>It is safe to just update {@code result} and return it as the next
     * aggregate value.
     *
     * @param intermediateResult the intermediate result to aggregate
     * @param result the value returned by aggregating the last result
     */
    protected abstract I aggregate(K intermediateResult, I result);

    /**
     * Finalize the result before returning it to the user.
     */
    protected abstract V finalizeResult(I result);
  }

  /**
   * We need a future implementation that clears out the txn callbacks when
   * any variation of get() is called.  This is important because if get()
   * throws an exception, we don't want that exception to resurface when
   * the txn gets committed or rolled back.
   */
  static final class TxnAwareFuture<T> implements Future<T> {
    private final Future<T> future;
    private final Transaction txn;
    private final TransactionStack txnStack;

    TxnAwareFuture(Future<T> future, Transaction txn, TransactionStack txnStack) {
      this.future = future;
      this.txn = txn;
      this.txnStack = txnStack;
    }

    @Override
    public boolean cancel(boolean mayInterruptIfRunning) {
      return future.cancel(mayInterruptIfRunning);
    }

    @Override
    public boolean isCancelled() {
      return future.isCancelled();
    }

    @Override
    public boolean isDone() {
      return future.isDone();
    }

    @Override
    public T get() throws InterruptedException, ExecutionException {
      txnStack.getFutures(txn).remove(future);
      return future.get();
    }

    @Override
    public T get(long timeout, TimeUnit unit)
        throws InterruptedException, ExecutionException, TimeoutException {
      txnStack.getFutures(txn).remove(future);
      return future.get(timeout, unit);
    }
  }

  /**
   * Wraps an already-resolved result in a {@link Future}.
   * @param <T> The type of the Future.
   */
  static class FakeFuture<T> implements Future<T> {
    private final T result;

    FakeFuture(T result) {
      this.result = result;
    }

    @Override
    public boolean cancel(boolean mayInterruptIfRunning) {
      return false;
    }

    @Override
    public boolean isCancelled() {
      return false;
    }

    @Override
    public boolean isDone() {
      return true;
    }

    @Override
    @SuppressWarnings("unused")
    public T get() throws ExecutionException {
      return result;
    }

    @Override
    public T get(long timeout, TimeUnit unit) {
      return result;
    }
  }
}

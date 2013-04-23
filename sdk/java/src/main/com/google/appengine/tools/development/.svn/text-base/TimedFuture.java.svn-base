// Copyright 2011 Google Inc. All Rights Reserved.

package com.google.appengine.tools.development;

import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeoutException;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.Future;

/**
 * {@code TimedFuture} is a {@link Future} that will not return
 * successfully after the specified amount of time has elapsed.
 *
 * <p>All methods call through to the underlying future.  However, if
 * the specified time elapses (either before or while in one of the
 * {@code get} methods), an ExecutionException will be thrown that
 * wraps the exception returned by {@link #createDeadlineException()}.
 * No attempt is made to automatically cancel the underlying Future in
 * this case.
 *
 */
public abstract class TimedFuture<T> implements Future<T> {
  private final Future<T> future;
  private final Clock clock;
  private final long deadlineTime;

  public TimedFuture(Future<T> future, long deadlineMillis) {
    this(future, deadlineMillis, Clock.DEFAULT);
  }

  public TimedFuture(Future<T> future, long deadlineMillis, Clock clock) {
    this.future = future;
    this.deadlineTime = clock.getCurrentTime() + deadlineMillis;
    this.clock = clock;
  }

  @Override
  public T get() throws InterruptedException, ExecutionException {
    long millisRemaining = getMillisRemaining();
    try {
      return future.get(millisRemaining, TimeUnit.MILLISECONDS);
    } catch (TimeoutException ex) {
      throw new ExecutionException(createDeadlineException());
    }
  }

  @Override
  public T get(long value, TimeUnit units)
      throws InterruptedException, ExecutionException, TimeoutException {
    long millisRequested = units.toMillis(value);
    long millisRemaining = getMillisRemaining();
    if (millisRequested < millisRemaining) {
      return future.get(millisRequested, TimeUnit.MILLISECONDS);
    }
    try {
      return future.get(millisRemaining, TimeUnit.MILLISECONDS);
    } catch (TimeoutException ex) {
      throw new ExecutionException(createDeadlineException());
    }
  }

  protected abstract RuntimeException createDeadlineException();

  private long getMillisRemaining() {
    return Math.max(0, deadlineTime - clock.getCurrentTime());
  }

  @Override
  public boolean isCancelled() {
    return future.isCancelled();
  }

  @Override
  public boolean isDone() {
    return future.isDone() || getMillisRemaining() == 0;
  }

  @Override
  public boolean cancel(boolean force) {
    return future.cancel(force);
  }
}

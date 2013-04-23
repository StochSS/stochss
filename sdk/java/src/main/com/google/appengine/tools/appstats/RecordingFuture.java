// Copyright 2010 Google Inc. All Rights Reserved.

package com.google.appengine.tools.appstats;

import com.google.apphosting.api.ApiProxy;
import com.google.apphosting.api.ApiProxy.ApiResultFuture;
import com.google.apphosting.api.ApiProxy.Environment;

import java.util.concurrent.ExecutionException;
import java.util.concurrent.Future;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;

/**
 * Represents a wrapper around the future that comes from
 * the wrapped delegate.
 *
 */
class RecordingFuture implements Future<byte[]> {

  /**
   * Factory method. Will choose to either return a RecordingFuture or a subclass
   * that also implements ApiResultFuture.
   *
   * @param wrappedFuture the future to decorate
   * @param recordingData the additional recordingData that keeps track of stats
   */
  public static RecordingFuture of(
      Future<byte[]> wrappedFuture,
      RecordingData recordingData,
      Recorder recorder,
      Environment environment,
      byte[] request) {
    if (wrappedFuture instanceof ApiProxy.ApiResultFuture) {
      return new ExtendedFuture(wrappedFuture, recordingData, recorder, environment, request);
    } else {
      return new RecordingFuture(wrappedFuture, recordingData, recorder, environment, request);
    }
  }

  public byte[] getRequest() {
    return request;
  }

  /**
   * A sub-class that also implements ApiResultFuture.
   */
  private static class ExtendedFuture extends RecordingFuture
      implements ApiProxy.ApiResultFuture<byte[]> {

    private final ApiProxy.ApiResultFuture<byte[]> extendedFuture;

    private ExtendedFuture(
        Future<byte[]> wrappedFuture,
        RecordingData recordingData,
        Recorder recorder,
        Environment environment,
        byte[] request) {
      super(wrappedFuture, recordingData, recorder, environment, request);
      extendedFuture = (ApiResultFuture<byte[]>) wrappedFuture;
    }

    @Override
    public long getCpuTimeInMegaCycles() {
      return extendedFuture.getCpuTimeInMegaCycles();
    }

    @Override
    public long getWallclockTimeInMillis() {
      return extendedFuture.getWallclockTimeInMillis();
    }

  }

  final Future<byte[]> wrappedFuture;
  private final RecordingData recordingData;
  private final Recorder recorder;
  private final Environment environment;
  private final byte[] request;

  private RecordingFuture(
      Future<byte[]> wrappedFuture,
      RecordingData recordingData,
      Recorder recorder,
      Environment environment,
      byte[] request) {
    this.wrappedFuture = wrappedFuture;
    this.recordingData = recordingData;
    this.environment = environment;
    this.recorder = recorder;
    this.request = request;
  }

  @Override
  public boolean cancel(boolean mayInterruptIfRunning) {
    try {
      return wrappedFuture.cancel(mayInterruptIfRunning);
    } finally {
      maybeRecordStats();
    }
  }

  @Override
  public byte[] get() throws InterruptedException, ExecutionException {
    try {
      return wrappedFuture.get();
    } finally {
      maybeRecordStats();
    }
  }

  @Override
  public byte[] get(long timeout, TimeUnit unit) throws InterruptedException, ExecutionException,
      TimeoutException {
    try {
      return wrappedFuture.get(timeout, unit);
    } finally {
      maybeRecordStats();
    }
  }

  @Override
  public boolean isCancelled() {
    return wrappedFuture.isCancelled();
  }

  @Override
  public boolean isDone() {
    return wrappedFuture.isDone();
  }

  public RecordingData getRecordingData() {
    return recordingData;
  }

  private void maybeRecordStats() {
    if (!recordingData.isProcessed()) {
      recorder.processAsyncRpc(this, environment);
    }
  }

}

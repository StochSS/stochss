// Copyright 2009 Google Inc. All Rights Reserved.
package com.google.appengine.tools.appstats;

import com.google.appengine.api.NamespaceManager;
import com.google.appengine.tools.appstats.StatsProtos.IndividualRpcStatsProto;
import com.google.appengine.tools.appstats.StatsProtos.RequestStatProto;
import com.google.appengine.tools.appstats.StatsProtos.StackFrameProto;
import com.google.apphosting.api.ApiProxy;
import com.google.apphosting.api.ApiStats;
import com.google.apphosting.api.ApiProxy.ApiConfig;
import com.google.apphosting.api.ApiProxy.ApiProxyException;
import com.google.apphosting.api.ApiProxy.ApiResultFuture;
import com.google.apphosting.api.ApiProxy.Delegate;
import com.google.apphosting.api.ApiProxy.Environment;
import com.google.apphosting.api.ApiProxy.LogRecord;
import com.google.common.collect.Sets;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.ArrayList;
import java.util.Collection;
import java.util.concurrent.CancellationException;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Future;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

/**
 * A decorator that wraps a Delegate and collects information upon rpc calls.
 *
 */
@SuppressWarnings("unchecked")
class Recorder implements Delegate {

  /**
   * Represents a list of strategies that a Recorder may pursue at the end
   * of a http request to decide on what to do with unfinished futures.
   */
  enum UnprocessedFutureStrategy {
    DO_NOTHING() {
      @Override
      void onUnprocessedFuture(RecordingFuture future) {
        future.getRecordingData().setProcessed();
      }
    },
    WAIT_UNTIL_FINISHED() {
      @Override
      void onUnprocessedFuture(RecordingFuture future)
          throws InterruptedException, ExecutionException {
        future.get();
      }
    };
    abstract void onUnprocessedFuture(RecordingFuture future)
        throws InterruptedException, ExecutionException;
  }

  private static final String CURRENT_NAMESPACE_KEY =
      NamespaceManager.class.getName() + ".currentNamespace";

  /**
   * The name that objects are stashed in a request. Visible for unit tests.
   */
  static final String KEY = Recorder.class.getName();

  private static final PayloadRenderer DEFAULT_RENDERER = new NullPayloadRenderer();

  /**
   * Represents a way of storing api usage information for later analysis and retrieval.
   */
  public interface RecordWriter {

    /**
     * Notifies the writer that a batch of RPCs is going to happen. The writer may use this
     * information to collect records and to commit them in bulk at the end of the batch.
     * Begin may be called several times on the same environment; the implementation needs to
     * be able to deal with this!
     * @param wrappedDelegate the delegate that this recorder wraps (enabling the RecordWriter
     *   to bypass the recorder's interception of rpcs)
     * @param environment the current environment.
     * @param request the servlet request that is used in this transaction
     * @return a handle by which the data may be retrieved later on through
     *     {@link RecordWriter#getFull(long)}.
     */
    Long begin(Delegate<?> wrappedDelegate, Environment environment, HttpServletRequest request);

    /**
     * Notifies the writer that a batch of RPCs has been ended. The writer may use this
     * information to write cached records to the data store.
     * @param wrappedDelegate the delegate that this recorder wraps (enabling the RecordWriter
     *   to bypass the recorder's interception of rpcs)
     * @param environment the current environment.
     * @return {@code true} if data was committed, {@code false} otherwise.
     */
    boolean commit(Delegate<?> wrappedDelegate, Environment environment, Integer httpResponseCode);

    /**
     * Marks a record as completed and schedules it for persistence. The overhead of this method
     * is not monitored by the Recorder, so the RecordWriter will either need to keep track of
     * its own overhead or keep the overhead small and near-constant. One recommended approach
     * would be to not persist in the write, but just to buffer the data in the environment, and
     * write all data in bulk at the end of the http request execution
     * (using begin() and commit()).
     * This method should be resilient to programming errors; in other words, it should still
     * behave well if it is called without a begin at the end.
     * Commit may be called several times on the same environment; the implementation needs to
     * be able to deal with this!
     * @param wrappedDelegate the delegate that this recorder wraps (enabling the RecordWriter
     *   to bypass the recorder's interception of rpcs)
     * @param environment the current environment.
     * @param record the record to persist
     * @param correctStartOffset if set to true, the record's start-offset
     *   contains an absolute timestamp, not a relative one.
     *   The recorder is expected to adjust the protobuf accordingly.
     */
    void write(
        Delegate<?> wrappedDelegate,
        Environment environment,
        IndividualRpcStatsProto.Builder record,
        long overheadWalltimeMillis,
        boolean correctStartOffset);

    /**
     * @return a list of all summaries currently persisted
     */
    List<RequestStatProto> getSummaries();

    /**
     * Retrieve data persisted under a certain reference
     * @param ref a handle to the written data
     * @return the data, or null if nothing could be found.
     */
    RequestStatProto getFull(long ref);
  }

  /**
   * A wrapper around the system clock. Can be subclassed (and thus replaced)
   * for unit tests.
   */
  static class Clock {

    public static final Clock INSTANCE = new Clock();

    public long currentTimeMillis() {
      return System.currentTimeMillis();
    }
  }

  private static final Pattern STACK_PATTERN = Pattern.compile(
  "\\s*at\\s([^\\(]+)[^:]+:([^\\)]+)\\)\\s*");

  private static void createStackTrace(
    int numLinesToIgnore, IndividualRpcStatsProto.Builder stats, int maxNumLines) {
    StringWriter stack = new StringWriter();
    new Exception().printStackTrace(new PrintWriter(stack));
    Matcher matcher = STACK_PATTERN.matcher(stack.toString());
    while (matcher.find() && stats.getCallStackCount() < maxNumLines) {
      if (numLinesToIgnore > 0) {
        numLinesToIgnore--;
        continue;
      }
      String classAndMethod = matcher.group(1);
      int lastDot = classAndMethod.lastIndexOf('.');
      String lineNumber = matcher.group(2);
      StackFrameProto.Builder builder = StackFrameProto.newBuilder();
      builder.setClassOrFileName(classAndMethod.substring(0, lastDot));
      builder.setFunctionName(classAndMethod.substring(lastDot + 1));
      try {
        builder.setLineNumber(Integer.parseInt(lineNumber));
      } catch (NumberFormatException e) {
      }
      stats.addCallStack(builder);
    }
  }

  private final Clock clock;
  private final Delegate wrappedDelegate;
  private final RecordWriter writer;
  private int maxLinesOfStackTrace = Integer.MAX_VALUE;
  private PayloadRenderer payloadRenderer = DEFAULT_RENDERER;
  private UnprocessedFutureStrategy unprocessedFutureStrategy =
      UnprocessedFutureStrategy.DO_NOTHING;
  private boolean calculateRpcCosts = false;
  private boolean datastoreDetails = false;

  /**
   * Constructor.
   * @param wrapThis the original delegate that this decorator wraps.
   * @param writer the strategy that persists records.
   */
  public Recorder(Delegate<?> wrapThis, RecordWriter writer) {
    this(wrapThis, writer, Clock.INSTANCE);
  }

  /**
   * Internal constructor, allows replacing the clock for unit tests.
   * @param wrapThis the original delegate that this decorator wraps.
   * @param writer the strategy that persists records.
   * @param clock a handle for measuring system time.
   */
  Recorder(Delegate<?> wrapThis, RecordWriter writer, Clock clock) {
    this.wrappedDelegate = checkNotNull(wrapThis);
    this.clock = checkNotNull(clock);
    this.writer = checkNotNull(writer);
  }

  void setUnprocessedFutureStrategy(UnprocessedFutureStrategy strategy) {
    unprocessedFutureStrategy = strategy;
  }

  void setCalculateRpcCosts(boolean calculateRpcCosts) {
    this.calculateRpcCosts = calculateRpcCosts;
  }

  void setDatastoreDetails(boolean datastoreDetails) {
    this.datastoreDetails = datastoreDetails;
  }

  @Override
  public void log(Environment environment, LogRecord record) {
    wrappedDelegate.log(environment, record);
  }

  @Override
  public void flushLogs(Environment environment) {
    wrappedDelegate.flushLogs(environment);
  }

  public List<Thread> getRequestThreads(Environment environment) {
    return wrappedDelegate.getRequestThreads(environment);
  }

  /**
   * Sets the maximum lines of the stack trace that should be recorded.
   */
  public void setMaxLinesOfStackTrace(int maxLinesOfStackTrace) {
    this.maxLinesOfStackTrace = maxLinesOfStackTrace;
  }

  /**
   * Determines how request/response data should be rendered.
   */
  public void setPayloadRenderer(PayloadRenderer payloadRenderer) {
    this.payloadRenderer = payloadRenderer;
  }

  int getMaxLinesOfStackTrace() {
    return maxLinesOfStackTrace;
  }

  PayloadRenderer getPayloadRenderer() {
    return payloadRenderer;
  }

  /**
   * Create a new recording protobuf that is initialized with any data that
   * can be provided before the rpc is executed.
   */
  private void initializeIntermediary(
      Environment environment, byte[] request, long preNow, RecordingData intermediary) {
    IndividualRpcStatsProto.Builder stats = newBuilder();
    intermediary.setStats(stats);
    stats.setServiceCallName(intermediary.getPackageName() + "." + intermediary.getMethodName());
    if (environment.getAttributes() != null) {
      if (environment.getAttributes().containsKey(CURRENT_NAMESPACE_KEY)) {
        stats.setNamespace((String) environment.getAttributes().get(CURRENT_NAMESPACE_KEY));
      }
    }
    stats.setRequestDataSummary(
        payloadRenderer.renderPayload(
            intermediary.getPackageName(), intermediary.getMethodName(), request, true));
    stats.setStartOffsetMilliseconds(clock.currentTimeMillis());
    createStackTrace(2, stats, maxLinesOfStackTrace);

    ApiStats apiStats = getApiStats(environment);
    intermediary.setApiMcyclesOrNull((apiStats == null) ? null : apiStats.getApiTimeInMegaCycles());
    intermediary.setApiStats(apiStats);
    intermediary.addOverhead(stats.getStartOffsetMilliseconds() - preNow);
  }

  @Override
  public Future<byte[]> makeAsyncCall(Environment environment,
                                      String packageName,
                                      String methodName,
                                      byte[] request,
                                      ApiConfig apiConfig) {

    long preNow = clock.currentTimeMillis();
    RecordingData intermediary = new RecordingData(packageName, methodName, calculateRpcCosts,
        datastoreDetails);
    initializeIntermediary(environment, request, preNow, intermediary);

    Future<byte[]> wrappedFuture = wrappedDelegate.makeAsyncCall(
        environment, packageName, methodName, request, apiConfig);
    RecordingFuture wrappingFuture = RecordingFuture.of(
        wrappedFuture, intermediary, this, environment, request);

    getStashedFutures(environment).add(wrappingFuture);
    return wrappingFuture;
  }

  @Override
  public byte[] makeSyncCall(
      Environment environment, String packageName, String methodName, byte[] request)
      throws ApiProxyException {

    long preNow = clock.currentTimeMillis();
    RecordingData intermediary = new RecordingData(packageName, methodName, calculateRpcCosts,
        datastoreDetails);
    initializeIntermediary(environment, request, preNow, intermediary);
    IndividualRpcStatsProto.Builder stats = intermediary.getStats();

    try {
      intermediary.setResponse(wrappedDelegate.makeSyncCall(
          environment, packageName, methodName, request));
      intermediary.setWasSuccessful(true);
    } catch (Throwable t) {
      intermediary.setExceptionOrError(t);
      intermediary.setWasSuccessful(false);
    }

    intermediary.setDurationMilliseconds(
        clock.currentTimeMillis() - stats.getStartOffsetMilliseconds());
    preNow = clock.currentTimeMillis();
    if (intermediary.getApiStats() != null) {
      intermediary.setApiMcyclesOrNull(
          intermediary.getApiStats().getApiTimeInMegaCycles()
          - intermediary.getApiMcyclesOrNull());
    }
    intermediary.storeResultData(payloadRenderer, request);
    intermediary.addOverhead(clock.currentTimeMillis() - preNow);

    writer.write(wrappedDelegate, environment, stats, intermediary.getOverhead(), true);

    Throwable exceptionOrError = intermediary.getExceptionOrError();
    if (exceptionOrError != null) {
      if (exceptionOrError instanceof Error) {
        throw (Error) exceptionOrError;
      }
      if (exceptionOrError instanceof ApiProxyException) {
        throw (ApiProxyException) exceptionOrError;
      }
      if (exceptionOrError instanceof RuntimeException) {
        throw (RuntimeException) exceptionOrError;
      }
      throw new AssertionError(exceptionOrError);
    } else {
      return intermediary.getResponse();
    }
  }

  IndividualRpcStatsProto.Builder newBuilder() {
    return IndividualRpcStatsProto.newBuilder();
  }

  <T> T checkNotNull(T t) {
    if (t == null) {
      throw new NullPointerException();
    }
    return t;
  }

  ApiStats getApiStats(Environment environment) {
    return ApiStats.get(environment);
  }

  Collection<RecordingFuture> getStashedFutures(Environment environment) {
    Collection<RecordingFuture> futures =
        (Collection<RecordingFuture>) environment.getAttributes().get(KEY);
    if (futures == null) {
      futures = Sets.newHashSet();
      environment.getAttributes().put(KEY, futures);
    }
    return futures;
  }

  /**
   * Called on a single future outside the processAsyncRpcs method.
   */
  void processAsyncRpc(RecordingFuture future, Environment environment) {
    if (!future.getRecordingData().isProcessed()) {
      processRecordingFuture(future, environment);
    }
    getStashedFutures(environment).remove(future);
  }

  /**
   * Called before the recorded data gets committed to the store. This will
   * go through all the stashed futures and converts them into apistats records.
   */
  void processAsyncRpcs(Environment environment) {
    Collection<RecordingFuture> futures = getStashedFutures(environment);
    for (RecordingFuture current : new ArrayList<RecordingFuture>(futures)) {
      if (!current.getRecordingData().isProcessed()) {
        processRecordingFuture(current, environment);
      }

      futures.remove(current);
    }
  }

  private void processRecordingFuture(RecordingFuture current, Environment environment) {
    RecordingData recordingData = current.getRecordingData();

    if (current.isDone() || current.isCancelled()) {
      recordingData.setProcessed();
      try {
        recordingData.setResponse(current.get());
        recordingData.setWasSuccessful(true);
      } catch (InterruptedException e) {
        recordingData.setExceptionOrError(e);
        recordingData.setWasSuccessful(false);
      } catch (ExecutionException e) {
        recordingData.setExceptionOrError(e);
        recordingData.setWasSuccessful(false);
      } catch (CancellationException e) {
        recordingData.setExceptionOrError(e);
        recordingData.setWasSuccessful(false);
      }

      if (current instanceof ApiProxy.ApiResultFuture) {
        ApiProxy.ApiResultFuture<?> future = (ApiResultFuture<?>) current;
        recordingData.setDurationMilliseconds(future.getWallclockTimeInMillis());
        recordingData.setApiMcyclesOrNull(future.getCpuTimeInMegaCycles());
      } else {
        recordingData.setDurationMilliseconds(
            clock.currentTimeMillis() - recordingData.getStats().getStartOffsetMilliseconds());
      }
      recordingData.storeResultData(payloadRenderer, current.getRequest());

      writer.write(
          wrappedDelegate, environment,
          recordingData.getStats(),
          recordingData.getOverhead(),
          true);
    } else {
      try {
        unprocessedFutureStrategy.onUnprocessedFuture(current);
      } catch (InterruptedException e) {
      } catch (ExecutionException e) {
      }
    }
  }

}

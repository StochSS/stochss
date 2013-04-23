// Copyright 2007 Google Inc. All rights reserved.

package com.google.apphosting.api;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.concurrent.Future;
import java.util.concurrent.TimeUnit;

/**
 * ApiProxy is a static class that serves as the collection point for
 * all API calls from user code into the application server.
 *
 * It is responsible for proxying makeSyncCall() calls to a delegate,
 * which actually implements the API calls.  It also stores an
 * Environment for each thread, which contains additional user-visible
 * information about the request.
 *
 */
public class ApiProxy {
  private static final String API_DEADLINE_KEY =
      "com.google.apphosting.api.ApiProxy.api_deadline_key";

  /**
   * Store an environment object for each thread.
   */
  private static final ThreadLocal<Environment> environmentThreadLocal =
      new ThreadLocal<Environment>();

  /**
   * Store a single delegate, to which we proxy all makeSyncCall requests.
   */
  private static Delegate delegate;

  /**
   * Logging records outside the scope of a request are lazily logged.
   */
  private static List<LogRecord> outOfBandLogs = new ArrayList<LogRecord>();

  /**
   * All methods are static.  Do not instantiate.
   */
  private ApiProxy() {
  }

  /**
   * @see #makeSyncCall(String,String,byte[],ApiConfig)
   */
  public static byte[] makeSyncCall(String packageName,
                                    String methodName,
                                    byte[] request)
      throws ApiProxyException {
    return makeSyncCall(packageName, methodName, request, null);
  }

  /**
   * Make a synchronous call to the specified method in the specified
   * API package.
   *
   * <p>Note: if you have not installed a {@code Delegate} and called
   * {@code setEnvironmentForCurrentThread} in this thread before
   * calling this method, it will act like no API calls are available
   * (i.e. always throw {@code CallNotFoundException}).
   *
   * @param packageName the name of the API package.
   * @param methodName the name of the method within the API package.
   * @param request a byte array containing the serialized form of the
   * request protocol buffer.
   * @param apiConfig that specifies API-specific configuration
   * parameters.
   *
   * @return a byte array containing the serialized form of the
   * response protocol buffer.
   *
   *
   * @throws ApplicationException For any error that is the application's fault.
   * @throws RPCFailedException If we could not connect to a backend service.
   * @throws CallNotFoundException If the specified method does not exist.
   * @throws ArgumentException If the request could not be parsed.
   * @throws ApiDeadlineExceededException If the request took too long.
   * @throws CancelledException If the request was explicitly cancelled.
   * @throws CapabilityDisabledException If the API call is currently
   * unavailable.
   * @throws OverQuotaException If the API call required more quota than is
   * available.
   * @throws RequestTooLargeException If the request to the API was too large.
   * @throws ResponseTooLargeException If the response to the API was too large.
   * @throws UnknownException If any other error occurred.
   */
  @SuppressWarnings("unchecked")
  public static byte[] makeSyncCall(String packageName,
                                    String methodName,
                                    byte[] request,
                                    ApiConfig apiConfig)
      throws ApiProxyException {
    Environment env = getCurrentEnvironment();
    if (delegate == null || env == null) {
      throw new CallNotFoundException(packageName, methodName);
    }
    if (apiConfig == null || apiConfig.getDeadlineInSeconds() == null) {
      return delegate.makeSyncCall(env, packageName, methodName, request);
    } else {
      Object oldValue = env.getAttributes().put(API_DEADLINE_KEY, apiConfig.getDeadlineInSeconds());
      try {
        return delegate.makeSyncCall(env, packageName, methodName, request);
      } finally {
        if (oldValue == null) {
          env.getAttributes().remove(API_DEADLINE_KEY);
        } else {
          env.getAttributes().put(API_DEADLINE_KEY, oldValue);
        }
      }
    }
  }

  /**
   * @see #makeAsyncCall(String,String,byte[],ApiConfig)
   */
  public static Future<byte[]> makeAsyncCall(String packageName,
                                             String methodName,
                                             byte[] request) {
    return makeAsyncCall(packageName, methodName, request, new ApiConfig());
  }

  /**
   * Make an asynchronous call to the specified method in the
   * specified API package.
   *
   * <p>Note: if you have not installed a {@code Delegate} and called
   * {@code setEnvironmentForCurrentThread} in this thread before
   * calling this method, it will act like no API calls are available
   * (i.e. the returned {@link Future} will throw {@code
   * CallNotFoundException}).
   *
   * <p>There is a limit to the number of simultaneous asynchronous
   * API calls (currently 100).  Invoking this method while this number
   * of API calls are outstanding will block.
   *
   * @param packageName the name of the API package.
   * @param methodName the name of the method within the API package.
   * @param request a byte array containing the serialized form of
   * the request protocol buffer.
   * @param apiConfig that specifies API-specific configuration
   * parameters.
   *
   * @return a {@link Future} that will resolve to a byte array
   * containing the serialized form of the response protocol buffer
   * on success, or throw one of the exceptions documented for
   * {@link #makeSyncCall(String, String, byte[], ApiConfig)}  on failure.
   */
  @SuppressWarnings("unchecked")
  public static Future<byte[]> makeAsyncCall(final String packageName,
                                             final String methodName,
                                             byte[] request,
                                             ApiConfig apiConfig) {
    Environment env = getCurrentEnvironment();
    if (delegate == null || env == null) {
      return new Future<byte[]>() {
        public byte[] get() {
          throw new CallNotFoundException(packageName, methodName);
        }

        public byte[] get(long deadline, TimeUnit unit) {
          throw new CallNotFoundException(packageName, methodName);
        }

        public boolean isDone() {
          return true;
        }

        public boolean isCancelled() {
          return false;
        }

        public boolean cancel(boolean shouldInterrupt) {
          return false;
        }
      };
    }
    return delegate.makeAsyncCall(env, packageName, methodName, request, apiConfig);
  }

  @SuppressWarnings("unchecked")
  public static void log(LogRecord record) {
    Environment env = getCurrentEnvironment();
    if (delegate != null && env != null) {
      delegate.log(env, record);
      return;
    }

    synchronized (outOfBandLogs) {
      outOfBandLogs.add(record);
    }
  }

  private static void possiblyFlushOutOfBandLogs() {
    Environment env = getCurrentEnvironment();
    if (delegate != null && env != null) {
      synchronized (outOfBandLogs) {
        for (LogRecord record : outOfBandLogs) {
          delegate.log(env, record);
        }
        outOfBandLogs.clear();
      }
    }
  }

  /**
   * Synchronously flush all pending application logs.
   */
  @SuppressWarnings("unchecked")
  public static void flushLogs() {
    if (delegate != null) {
      delegate.flushLogs(getCurrentEnvironment());
    }
  }

  /**
   * Gets the environment associated with this thread.  This can be used
   * to discover additional information about the current request.
   */
  public static Environment getCurrentEnvironment() {
    return environmentThreadLocal.get();
  }

  /**
   * Sets a delegate to which we will proxy requests.  This should not be
   * used from user-code.
   */
  public static void setDelegate(Delegate aDelegate) {
    delegate = aDelegate;
    possiblyFlushOutOfBandLogs();
  }

  /**
   * Gets the delegate to which we will proxy requests.  This should really
   * only be caled from test-code where, for example, you might want to
   * downcast and invoke methods on a specific implementation that you happen
   * to know has been installed.
   */
  public static Delegate getDelegate() {
    return delegate;
  }

  /**
   * Sets an environment for the current thread.  This should not be
   * used from user-code.
   */
  public static void setEnvironmentForCurrentThread(Environment environment) {
    environmentThreadLocal.set(environment);
    possiblyFlushOutOfBandLogs();
  }

  /**
   * Removes any environment associated with the current thread.  This
   * should not be used from user-code.
   */
  public static void clearEnvironmentForCurrentThread() {
    environmentThreadLocal.set(null);
  }

  /**
   * Returns a list of all threads which are currently running requests.
   */
  public static List<Thread> getRequestThreads() {
    Environment env = getCurrentEnvironment();
    if (delegate == null) {
      return Collections.emptyList();
    } else {
      return delegate.getRequestThreads(env);
    }
  }

  /**
   * Environment is a simple data container that provides additional
   * information about the current request (e.g. who is logged in, are
   * they an administrator, etc.).
   */
  public interface Environment {
    /**
     * Gets the application identifier for the current application.
     */
    String getAppId();

    /**
     * Gets the version identifier for the current application version.
     * Result is of the form {@literal <major>.<minor>} where
     * {@literal <major>} is the version name supplied at deploy time and
     * {@literal <minor>} is a timestamp value maintained by App Engine.
     */
    String getVersionId();

    /**
     * Gets the email address of the currently logged-in user.
     */
    String getEmail();

    /**
     * Returns true if the user is logged in.
     */
    boolean isLoggedIn();

    /**
     * Returns true if the currently logged-in user is an administrator.
     */
    boolean isAdmin();

    /**
     * Returns the domain used for authentication.
     */
    String getAuthDomain();

    /**
     * @deprecated Use {@link NamespaceManager}.getGoogleAppsNamespace()
     */
    @Deprecated
    String getRequestNamespace();

    /**
     * Get a {@code Map} containing any attributes that have been set in this
     * {@code Environment}.  The returned {@code Map} is mutable and is a
     * useful place to store transient, per-request information.
     */
    Map<String, Object> getAttributes();

    /**
     * Gets the remaining number of milliseconds left before this request receives a
     * DeadlineExceededException from App Engine. This API can be used for planning how much work
     * you can reasonably accomplish before the soft deadline kicks in.
     *
     * If there is no deadline for the request, then this will reply with Long.MAX_VALUE.
     */
    long getRemainingMillis();
  }

  /**
   * This interface can be used to provide a class that actually
   * implements API calls.
   *
   * @param <E> The concrete class implementing Environment that this
   *          Delegate expects to receive.
   */
  public interface Delegate<E extends Environment> {
    /**
     * Make a synchronous call to the specified method in the specified
     * API package.
     *
     * <p>Note: if you have not installed a {@code Delegate} and called
     * {@code setEnvironmentForCurrentThread} in this thread before
     * calling this method, it will act like no API calls are available
     * (i.e. always throw {@code CallNotFoundException}).
     *
     * @param environment the current request environment.
     * @param packageName the name of the API package.
     * @param methodName the name of the method within the API package.
     * @param request a byte array containing the serialized form of
     * the request protocol buffer.
     *
     * @return a byte array containing the serialized form of the
     * response protocol buffer.
     *
     * @throws ApplicationException For any error that is the application's fault.
     * @throws RPCFailedException If we could not connect to a backend service.
     * @throws CallNotFoundException If the specified method does not exist.
     * @throws ArgumentException If the request could not be parsed.
     * @throws DeadlineExceededException If the request took too long.
     * @throws CancelledException If the request was explicitly cancelled.
     * @throws UnknownException If any other error occurred.
     */
    byte[] makeSyncCall(E environment,
                        String packageName,
                        String methodName,
                        byte[] request)
        throws ApiProxyException;

    /**
     * Make an asynchronous call to the specified method in the specified API package.
     *
     * <p>Note: if you have not installed a {@code Delegate} and called
     * {@code setEnvironmentForCurrentThread} in this thread before
     * calling this method, it will act like no API calls are available
     * (i.e. always throw {@code CallNotFoundException}).
     *
     * @param environment the current request environment.
     * @param packageName the name of the API package.
     * @param methodName the name of the method within the API package.
     * @param request a byte array containing the serialized form of
     * the request protocol buffer.
     * @param apiConfig that specifies API-specific configuration
     * parameters.
     *
     * @return a {@link Future} that will resolve to a byte array
     * containing the serialized form of the response protocol buffer
     * on success, or throw one of the exceptions documented for
     * {@link #makeSyncCall(Environment, String, String, byte[])} on failure.
     */
    Future<byte[]> makeAsyncCall(E environment,
                                 String packageName,
                                 String methodName,
                                 byte[] request,
                                 ApiConfig apiConfig);

    void log(E environment, LogRecord record);

    void flushLogs(E environment);

    /**
     * Returns a list of all threads which are currently running requests.
     */
    List<Thread> getRequestThreads(E environment);
  }

  /**
   * {@code LogRecord} represents a single apphosting log entry,
   * including a Java-specific logging level, a timestamp in
   * microseconds, and a message a formatted string containing the
   * rest of the logging information (e.g. class and line number
   * information, the message itself, the stack trace for any
   * exception associated with the log record, etc.).
   */
  public static final class LogRecord {
    private final Level level;
    private final long timestamp;
    private final String message;

    public enum Level {
      debug,
      info,
      warn,
      error,
      fatal,
    }

    public LogRecord(Level level, long timestamp, String message) {
      this.level = level;
      this.timestamp = timestamp;
      this.message = message;
    }

    /**
     * A partial copy constructor.
     * @param other A {@code LogRecord} from which to
     * copy the {@link #level} and {@link #timestamp}
     * but not the {@link #message}
     * @param message
     */
    public LogRecord(LogRecord other, String message){
      this(other.level, other.timestamp, message);
    }

    public Level getLevel() {
      return level;
    }

    /**
     * Returns the timestamp of the log message, in microseconds.
     */
    public long getTimestamp() {
      return timestamp;
    }

    public String getMessage() {
      return message;
    }
  }

  /**
   * {@code ApiConfig} encapsulates one or more configuration
   * parameters scoped to an individual API call.
   */
  public static final class ApiConfig {
    private Double deadlineInSeconds;

    /**
     * Returns the number of seconds that the API call will be allowed
     * to run, or {@code null} for the default deadline.
     */
    public Double getDeadlineInSeconds() {
      return deadlineInSeconds;
    }

    /**
     * Set the number of seconds that the API call will be allowed to
     * run, or {@code null} for the default deadline.
     */
    public void setDeadlineInSeconds(Double deadlineInSeconds) {
      this.deadlineInSeconds = deadlineInSeconds;
    }

    @Override
    public boolean equals(Object o) {
      if (this == o) {
        return true;
      }
      if (o == null || getClass() != o.getClass()) {
        return false;
      }

      ApiConfig apiConfig = (ApiConfig) o;

      if (deadlineInSeconds != null ? !deadlineInSeconds.equals(apiConfig.deadlineInSeconds)
          : apiConfig.deadlineInSeconds != null) {
        return false;
      }

      return true;
    }

    @Override
    public int hashCode() {
      return deadlineInSeconds != null ? deadlineInSeconds.hashCode() : 0;
    }
  }

  /**
   * A subtype of {@link Future} that provides more detailed
   * information about the timing and resource consumption of
   * particular API calls.
   *
   * <p>Objects returned from {@link
   * #makeAsyncCall(String,String,byte[],ApiConfig)} may implement
   * this interface.  However, callers should not currently assume
   * that all RPCs will.
   */
  public static interface ApiResultFuture<T> extends Future<T> {
    /**
     * Returns the amount of CPU time consumed across any backend
     * servers responsible for serving this API call.  This quantity
     * is measured in millions of CPU cycles to avoid suming times
     * across a hetergeneous machine set with varied CPU clock speeds.
     *
     * @throws IllegalStateException If the RPC has not yet completed.
     */
    long getCpuTimeInMegaCycles();

    /**
     * Returns the amount of wallclock time, measured in milliseconds,
     * that this API call took to complete, as measured from the
     * client side.
     *
     * @throws IllegalStateException If the RPC has not yet completed.
     */
    long getWallclockTimeInMillis();
  }

  public static class ApiProxyException extends RuntimeException {
    public ApiProxyException(String message, String packageName, String methodName) {
      this(String.format(message, packageName, methodName));
    }

    private ApiProxyException(String message, String packageName, String methodName,
        Throwable nestedException) {
      super(String.format(message, packageName, methodName), nestedException);
    }

    public ApiProxyException(String message) {
      super(message);
    }

    /**
     * Clones this exception and then sets this Exception as the cause
     * of the clone and sets the given stack trace in the clone.
     *
     * @param stackTrace The stack trace to set in the returned clone
     * @return a clone of this Exception with this Exception as
     * the cause and with the given stack trace.
     */
    public ApiProxyException copy(StackTraceElement[] stackTrace) {
      ApiProxyException theCopy = cloneWithoutStackTrace();
      theCopy.setStackTrace(stackTrace);
      theCopy.initCause(this);
      return theCopy;
    }

    protected ApiProxyException cloneWithoutStackTrace() {
      return new ApiProxyException(this.getMessage());
    }

  }

  public static class ApplicationException extends ApiProxyException {
    private final int applicationError;
    private final String errorDetail;

    public ApplicationException(int applicationError) {
      this(applicationError, "");
    }

    public ApplicationException(int applicationError, String errorDetail) {
      super("ApplicationError: " + applicationError + ": " + errorDetail);
      this.applicationError = applicationError;
      this.errorDetail = errorDetail;
    }

    public int getApplicationError() {
      return applicationError;
    }

    public String getErrorDetail() {
      return errorDetail;
    }

    @Override
    protected ApplicationException cloneWithoutStackTrace() {
      return new ApplicationException(applicationError, errorDetail);
    }
  }

  public static class RPCFailedException extends ApiProxyException {
    public RPCFailedException(String packageName, String methodName) {
      super("The remote RPC to the application server failed for the " +
            "call %s.%s().",
            packageName, methodName);
    }

    private RPCFailedException(String message) {
      super(message);
    }

    @Override
    protected RPCFailedException cloneWithoutStackTrace() {
      return new RPCFailedException(this.getMessage());
    }
  }

  public static class CallNotFoundException extends ApiProxyException {
    public CallNotFoundException(String packageName, String methodName) {
      super("The API package '%s' or call '%s()' was not found.",
            packageName, methodName);
    }

    private CallNotFoundException(String message) {
      super(message);
    }

    @Override
    public CallNotFoundException cloneWithoutStackTrace() {
      return new CallNotFoundException(this.getMessage());
    }
  }

  public static class ArgumentException extends ApiProxyException {
    public ArgumentException(String packageName, String methodName) {
      super("An error occurred parsing (locally or remotely) the " +
            "arguments to %S.%s().",
            packageName, methodName);
    }

    private ArgumentException(String message) {
      super(message);
    }

    @Override
    public ArgumentException cloneWithoutStackTrace() {
      return new ArgumentException(this.getMessage());
    }
  }

  public static class ApiDeadlineExceededException extends ApiProxyException {
    public ApiDeadlineExceededException(String packageName, String methodName) {
      super("The API call %s.%s() took too long to respond and was cancelled.",
            packageName, methodName);
    }

    private ApiDeadlineExceededException(String message) {
      super(message);
    }

    @Override
    public ApiDeadlineExceededException cloneWithoutStackTrace() {
      return new ApiDeadlineExceededException(this.getMessage());
    }
  }

  public static class CancelledException extends ApiProxyException {
    public CancelledException(String packageName, String methodName) {
      super("The API call %s.%s() was explicitly cancelled.",
            packageName, methodName);
    }

    private CancelledException(String message) {
      super(message);
    }

    @Override
    public CancelledException cloneWithoutStackTrace() {
      return new CancelledException(this.getMessage());
    }

  }

  public static class CapabilityDisabledException extends ApiProxyException {
    public CapabilityDisabledException(String message, String packageName, String methodName) {
      super("The API call %s.%s() is temporarily unavailable: " + message,
            packageName, methodName);
    }

    private CapabilityDisabledException(String message) {
      super(message);
    }

    @Override
    public CapabilityDisabledException cloneWithoutStackTrace() {
      return new CapabilityDisabledException(this.getMessage());
    }
  }

  public static class FeatureNotEnabledException extends ApiProxyException {
    public FeatureNotEnabledException(String message,
                                      String packageName,
                                      String methodName) {
      super(message, packageName, methodName);
    }

    public FeatureNotEnabledException(String message) {
      super(message);
    }

    @Override
    public FeatureNotEnabledException cloneWithoutStackTrace() {
      return new FeatureNotEnabledException(this.getMessage());
    }

  }

  public static class OverQuotaException extends ApiProxyException {
    public OverQuotaException(String packageName, String methodName) {
      super("The API call %s.%s() required more quota than is available.",
            packageName, methodName);
    }

    private OverQuotaException(String message) {
      super(message);
    }

    @Override
    public OverQuotaException cloneWithoutStackTrace() {
      return new OverQuotaException(this.getMessage());
    }

  }

  public static class RequestTooLargeException extends ApiProxyException {
    public RequestTooLargeException(String packageName, String methodName) {
      super("The request to API call %s.%s() was too large.",
            packageName, methodName);
    }

    private RequestTooLargeException(String message) {
      super(message);
    }

    @Override
    public RequestTooLargeException cloneWithoutStackTrace() {
      return new RequestTooLargeException(this.getMessage());
    }
  }

  public static class ResponseTooLargeException extends ApiProxyException {
    public ResponseTooLargeException(String packageName, String methodName) {
      super("The response from API call %s.%s() was too large.",
            packageName, methodName);
    }

    private ResponseTooLargeException(String message) {
      super(message);
    }

    @Override
    public ResponseTooLargeException cloneWithoutStackTrace() {
      return new ResponseTooLargeException(this.getMessage());
    }
  }

  public static class UnknownException extends ApiProxyException {

    public UnknownException(String packageName, String methodName, Throwable nestedException) {
      super("An error occurred for the API request %s.%s().",
          packageName, methodName, nestedException);
    }

    public UnknownException(String packageName, String methodName) {
      super("An error occurred for the API request %s.%s().",
            packageName, methodName);
    }

    public UnknownException(String message) {
      super(message);
    }

    @Override
    public UnknownException cloneWithoutStackTrace() {
      return new UnknownException(this.getMessage());
    }
  }
}

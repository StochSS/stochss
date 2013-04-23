// Copyright 2008 Google Inc. All Rights Reserved.

package com.google.appengine.tools.development;

import com.google.appengine.api.capabilities.CapabilityStatus;
import com.google.appengine.tools.development.LocalRpcService.Status;
import com.google.apphosting.api.ApiProxy;
import com.google.apphosting.api.ApiProxy.CallNotFoundException;
import com.google.apphosting.api.ApiProxy.Environment;
import com.google.apphosting.api.ApiProxy.LogRecord;
import com.google.apphosting.api.ApiProxy.RequestTooLargeException;
import com.google.apphosting.api.ApiProxy.UnknownException;
import com.google.io.protocol.ProtocolMessage;
import com.google.protobuf.Message;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.security.AccessController;
import java.security.PrivilegedAction;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.ServiceLoader;
import java.util.concurrent.Callable;
import java.util.concurrent.CancellationException;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.Semaphore;
import java.util.concurrent.ThreadFactory;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * Implements ApiProxy.Delegate such that the requests are dispatched to local service
 * implementations. Used for both the {@link com.google.appengine.tools.development.DevAppServer}
 * and for unit testing services.
 *
 */
class ApiProxyLocalImpl implements ApiProxyLocal {

  private static final Class<?> BYTE_ARRAY_CLASS = byte[].class;

  /**
   * The maximum size of any given API request.
   */
  private static final int MAX_API_REQUEST_SIZE = 1048576;

  private static final String API_DEADLINE_KEY =
      "com.google.apphosting.api.ApiProxy.api_deadline_key";

  static final String IS_OFFLINE_REQUEST_KEY = "com.google.appengine.request.offline";

  /**
   * Implementation of the {@link LocalServiceContext} interface
   */
  private class LocalServiceContextImpl implements LocalServiceContext {

    /**
     * The local server environment
     */
    private final LocalServerEnvironment localServerEnvironment;

    private final LocalCapabilitiesEnvironment localCapabilitiesEnvironment =
        new LocalCapabilitiesEnvironment(System.getProperties());

    /**
     * Creates a new context, for the given application.
     *
     * @param localServerEnvironment The environment for the local server.
     */
    public LocalServiceContextImpl(LocalServerEnvironment localServerEnvironment) {
      this.localServerEnvironment = localServerEnvironment;
    }

    @Override
    public LocalServerEnvironment getLocalServerEnvironment() {
      return localServerEnvironment;
    }

    @Override
    public LocalCapabilitiesEnvironment getLocalCapabilitiesEnvironment() {
      return localCapabilitiesEnvironment;
    }

    @Override
    public Clock getClock() {
      return clock;
    }

    @Override
    public LocalRpcService getLocalService(String packageName) {
      return ApiProxyLocalImpl.this.getService(packageName);
    }
  }

  private static final Logger logger = Logger.getLogger(ApiProxyLocalImpl.class.getName());

  private final Map<String, LocalRpcService> serviceCache =
      new ConcurrentHashMap<String, LocalRpcService>();

  private final Map<String, Method> methodCache = new ConcurrentHashMap<String, Method>();
  final Map<Method, LatencySimulator> latencySimulatorCache =
      new ConcurrentHashMap<Method, LatencySimulator>();

  private final Map<String, String> properties = new HashMap<String, String>();

  private final ExecutorService apiExecutor = Executors.newCachedThreadPool(
      new DaemonThreadFactory(Executors.defaultThreadFactory()));

  private final LocalServiceContext context;

  private Clock clock = Clock.DEFAULT;

  /**
   * Creates the local proxy in a given context
   *
   * @param environment the local server environment.
   */
  protected ApiProxyLocalImpl(LocalServerEnvironment environment) {
    this.context = new LocalServiceContextImpl(environment);
  }

  @Override
  public void log(Environment environment, LogRecord record) {
    logger.log(toJavaLevel(record.getLevel()), record.getMessage());
  }

  @Override
  public void flushLogs(Environment environment) {
    System.err.flush();
  }

  @Override
  public byte[] makeSyncCall(ApiProxy.Environment environment, String packageName,
      String methodName, byte[] requestBytes) {
    ApiProxy.ApiConfig apiConfig = null;
    Double deadline = (Double) environment.getAttributes().get(API_DEADLINE_KEY);
    if (deadline != null) {
      apiConfig = new ApiProxy.ApiConfig();
      apiConfig.setDeadlineInSeconds(deadline);
    }

    Future<byte[]> future =
        makeAsyncCall(environment, packageName, methodName, requestBytes, apiConfig);
    try {
      return future.get();
    } catch (InterruptedException ex) {
      throw new ApiProxy.CancelledException(packageName, methodName);
    } catch (CancellationException ex) {
      throw new ApiProxy.CancelledException(packageName, methodName);
    } catch (ExecutionException ex) {
      if (ex.getCause() instanceof RuntimeException) {
        throw (RuntimeException) ex.getCause();
      } else if (ex.getCause() instanceof Error) {
        throw (Error) ex.getCause();
      } else {
        throw new ApiProxy.UnknownException(packageName, methodName, ex.getCause());
      }
    }
  }

  @Override
  public Future<byte[]> makeAsyncCall(Environment environment, final String packageName,
      final String methodName, byte[] requestBytes, ApiProxy.ApiConfig apiConfig) {
    Semaphore semaphore = (Semaphore) environment.getAttributes().get(
        LocalEnvironment.API_CALL_SEMAPHORE);
    if (semaphore != null) {
      try {
        semaphore.acquire();
      } catch (InterruptedException ex) {
        throw new RuntimeException("Interrupted while waiting on semaphore:", ex);
      }
    }
    boolean offline = environment.getAttributes().get(IS_OFFLINE_REQUEST_KEY) != null;
    AsyncApiCall asyncApiCall = new AsyncApiCall(
        environment, packageName, methodName, requestBytes, semaphore);
    boolean success = false;
    try {
      Callable<byte[]> callable = Executors.privilegedCallable(asyncApiCall);

      Future<byte[]> resultFuture = AccessController.doPrivileged(
          new PrivilegedApiAction(callable, asyncApiCall));
      success = true;
      if (context.getLocalServerEnvironment().enforceApiDeadlines()) {
        long deadlineMillis = (long) (1000.0 * resolveDeadline(packageName, apiConfig, offline));
        resultFuture = new TimedFuture<byte[]>(resultFuture, deadlineMillis, clock) {
          @Override
          protected RuntimeException createDeadlineException() {
            throw new ApiProxy.ApiDeadlineExceededException(packageName, methodName);
          }
        };
      }
      return resultFuture;
    } finally {
      if (!success) {
        asyncApiCall.tryReleaseSemaphore();
      }
    }
  }

  @Override
  public List<Thread> getRequestThreads(Environment environment) {
    return Arrays.asList(new Thread[]{Thread.currentThread()});
  }

  private double resolveDeadline(String packageName, ApiProxy.ApiConfig apiConfig,
      boolean isOffline) {
    LocalRpcService service = getService(packageName);
    Double deadline = null;
    if (apiConfig != null) {
      deadline = apiConfig.getDeadlineInSeconds();
    }
    if (deadline == null && service != null) {
      deadline = service.getDefaultDeadline(isOffline);
    }
    if (deadline == null) {
      deadline = 5.0;
    }

    Double maxDeadline = null;
    if (service != null) {
      maxDeadline = service.getMaximumDeadline(isOffline);
    }
    if (maxDeadline == null) {
      maxDeadline = 10.0;
    }
    return Math.min(deadline, maxDeadline);
  }

  private class PrivilegedApiAction implements PrivilegedAction<Future<byte[]>> {

    private final Callable<byte[]> callable;
    private final AsyncApiCall asyncApiCall;

    PrivilegedApiAction(Callable<byte[]> callable, AsyncApiCall asyncApiCall) {
      this.callable = callable;
      this.asyncApiCall = asyncApiCall;
    }

    @Override
    public Future<byte[]> run() {
      final Future<byte[]> result = apiExecutor.submit(callable);
      return new Future<byte[]>() {
        @Override
        public boolean cancel(final boolean mayInterruptIfRunning) {
          return AccessController.doPrivileged(
              new PrivilegedAction<Boolean>() {
                @Override
                public Boolean run() {
                  asyncApiCall.tryReleaseSemaphore();
                  return result.cancel(mayInterruptIfRunning);
                }
              });
        }

        @Override
        public boolean isCancelled() {
          return result.isCancelled();
        }

        @Override
        public boolean isDone() {
          return result.isDone();
        }

        @Override
        public byte[] get() throws InterruptedException, ExecutionException {
          return result.get();
        }

        @Override
        public byte[] get(long timeout, TimeUnit unit)
            throws InterruptedException, ExecutionException, TimeoutException {
          return result.get(timeout, unit);
        }
      };
    }
  }

  /**
   * Convert the specified byte array to a protocol buffer representation of the specified type.
   * This type can either be a subclass of {@link ProtocolMessage} (a legacy protocol buffer
   * implementation), or {@link Message} (the open-sourced protocol buffer implementation).
   */
  private <T> T convertBytesToPb(byte[] bytes, Class<T> requestClass)
      throws IllegalAccessException, InstantiationException,
      InvocationTargetException, NoSuchMethodException {
    if (ProtocolMessage.class.isAssignableFrom(requestClass)) {
      ProtocolMessage<?> proto = (ProtocolMessage<?>) requestClass.newInstance();
      proto.mergeFrom(bytes);
      return requestClass.cast(proto);
    }
    if (Message.class.isAssignableFrom(requestClass)) {
      Method method = requestClass.getMethod("parseFrom", BYTE_ARRAY_CLASS);
      return requestClass.cast(method.invoke(null, bytes));
    }
    throw new UnsupportedOperationException(String.format("Cannot assign %s to either %s or %s",
        classDescription(requestClass), ProtocolMessage.class, Message.class));
  }

  /**
   * Convert the protocol buffer representation to a byte array.  The object can either be an
   * instance of {@link ProtocolMessage} (a legacy protocol buffer implementation), or {@link
   * Message} (the open-sourced protocol buffer implementation).
   */
  private byte[] convertPbToBytes(Object object) {
    if (object instanceof ProtocolMessage) {
      return ((ProtocolMessage<?>) object).toByteArray();
    }
    if (object instanceof Message) {
      return ((Message) object).toByteArray();
    }
    throw new UnsupportedOperationException(String.format("%s is neither %s nor %s",
        classDescription(object.getClass()), ProtocolMessage.class, Message.class));
  }

  /**
   * Create a textual description of a class that is appropriate for
   * troubleshooting problems with {@link #convertBytesToPb(byte[], Class)}
   * or {@link #convertPbToBytes(Object)}.
   *
   * @param klass The class to create a description for.
   * @return A string description.
   */
  private static String classDescription(Class<?> klass) {
    return String.format("(%s extends %s loaded from %s)",
        klass, klass.getSuperclass(),
        klass.getProtectionDomain().getCodeSource().getLocation());
  }

  @Override
  public void setProperty(String property, String value) {
    properties.put(property, value);
  }

  /**
   * Resets the service properties to {@code properties}.
   *
   * @param properties a maybe {@code null} set of properties for local services.
   */
  @Override
  public void setProperties(Map<String, String> properties) {
    this.properties.clear();
    if (properties != null) {
      this.appendProperties(properties);
    }
  }

  /**
   * Appends the given service properties to {@code properties}.
   *
   * @param properties a set of properties to append for local services.
   */
  @Override
  public void appendProperties(Map<String, String> properties) {
    this.properties.putAll(properties);
  }

  /**
   * Stops all services started by this ApiProxy and releases all of its resources.
   */
  @Override
  public void stop() {
    for (LocalRpcService service : serviceCache.values()) {
      service.stop();
    }

    serviceCache.clear();
    methodCache.clear();
    latencySimulatorCache.clear();

  }

  int getMaxApiRequestSize(LocalRpcService rpcService) {
    Integer size = rpcService.getMaxApiRequestSize();
    if (size == null) {
      return MAX_API_REQUEST_SIZE;
    }
    return size;
  }

  private Method getDispatchMethod(LocalRpcService service, String packageName, String methodName) {
    String dispatchName = Character.toLowerCase(methodName.charAt(0)) + methodName.substring(1);
    String methodId = packageName + "." + dispatchName;
    Method method = methodCache.get(methodId);
    if (method != null) {
      return method;
    }
    for (Method candidate : service.getClass().getMethods()) {
      if (dispatchName.equals(candidate.getName())) {
        methodCache.put(methodId, candidate);
        LatencyPercentiles latencyPercentiles = candidate.getAnnotation(LatencyPercentiles.class);
        if (latencyPercentiles == null) {

          latencyPercentiles = service.getClass().getAnnotation(LatencyPercentiles.class);
        }
        if (latencyPercentiles != null) {
          latencySimulatorCache.put(candidate, new LatencySimulator(latencyPercentiles));
        }
        return candidate;
      }
    }
    throw new CallNotFoundException(packageName, methodName);
  }

  private class AsyncApiCall implements Callable<byte[]> {

    private final Environment environment;
    private final String packageName;
    private final String methodName;
    private final byte[] requestBytes;
    private final Semaphore semaphore;
    private boolean released;

    public AsyncApiCall(Environment environment, String packageName, String methodName,
        byte[] requestBytes, Semaphore semaphore) {
      this.environment = environment;
      this.packageName = packageName;
      this.methodName = methodName;
      this.requestBytes = requestBytes;
      this.semaphore = semaphore;
    }

    @Override
    public byte[] call() {
      try {
        return callInternal();
      } finally {
        tryReleaseSemaphore();
      }
    }

    private byte[] callInternal() {
      ApiProxy.setEnvironmentForCurrentThread(environment);
      try {
        LocalRpcService service = getService(packageName);
        if (service == null) {
          throw new CallNotFoundException(packageName, methodName);
        }
        LocalCapabilitiesEnvironment capEnv = context.getLocalCapabilitiesEnvironment();
        CapabilityStatus capabilityStatus = capEnv
            .getStatusFromMethodName(packageName, methodName);
        if (!CapabilityStatus.ENABLED.equals(capabilityStatus)) {
          throw new ApiProxy.CapabilityDisabledException(
              "Setup in local configuration.", packageName, methodName);
        }

        if (requestBytes.length > getMaxApiRequestSize(service)) {
          throw new RequestTooLargeException(packageName, methodName);
        }

        Method method = getDispatchMethod(service, packageName, methodName);
        Status status = new Status();
        Class<?> requestClass = method.getParameterTypes()[1];
        Object request = convertBytesToPb(requestBytes, requestClass);

        long start = clock.getCurrentTime();
        try {
          return convertPbToBytes(method.invoke(service, status, request));
        } finally {
          LatencySimulator latencySimulator = latencySimulatorCache.get(method);
          if (latencySimulator != null) {
            if (context.getLocalServerEnvironment().simulateProductionLatencies()) {
              latencySimulator.simulateLatency(clock.getCurrentTime() - start, service, request);
            }
          }
        }
      } catch (IllegalAccessException e) {
        throw new UnknownException(packageName, methodName, e);
      } catch (InstantiationException e) {
        throw new UnknownException(packageName, methodName, e);
      } catch (NoSuchMethodException e) {
        throw new UnknownException(packageName, methodName, e);
      } catch (InvocationTargetException e) {
        if (e.getCause() instanceof RuntimeException) {
          throw (RuntimeException) e.getCause();
        }
        throw new UnknownException(packageName, methodName, e.getCause());
      } finally {
        ApiProxy.clearEnvironmentForCurrentThread();
      }
    }

    /**
     * Synchronized method that ensures the semaphore that was claimed for this API call only gets
     * released once.
     */
    synchronized void tryReleaseSemaphore() {
      if (!released && semaphore != null) {
        semaphore.release();
        released = true;
      }
    }
  }

  /**
   * Method needs to be synchronized to ensure that we don't end up starting multiple instances of
   * the same service.  As an example, we've seen a race condition where the local datastore service
   * has not yet been initialized and two datastore requests come in at the exact same time. The
   * first request looks in the service cache, doesn't find it, starts a new local datastore
   * service, registers it in the service cache, and uses that local datastore service to handle the
   * first request.  Meanwhile the second request looks in the service cache, doesn't find it,
   * starts a new local datastore service, registers it in the service cache (stomping on the
   * original one), and uses that local datastore service to handle the second request.  If both of
   * these requests start txns we can end up with 2 requests receiving the same txn id, and that
   * yields all sorts of exciting behavior.  So, we synchronize this method to ensure that we only
   * register a single instance of each service type.
   */
  @Override
  public synchronized final LocalRpcService getService(final String pkg) {
    LocalRpcService cachedService = serviceCache.get(pkg);
    if (cachedService != null) {
      return cachedService;
    }

    return AccessController.doPrivileged(
        new PrivilegedAction<LocalRpcService>() {
          @Override
          public LocalRpcService run() {
            return startServices(pkg);
          }
        });
  }

  private LocalRpcService startServices(String pkg) {
    for (LocalRpcService service : ServiceLoader.load(LocalRpcService.class,
        ApiProxyLocalImpl.class.getClassLoader())) {
      if (service.getPackage().equals(pkg)) {
        service.init(context, properties);
        service.start();
        serviceCache.put(pkg, service);
        return service;
      }
    }
    return null;
  }

  private static Level toJavaLevel(ApiProxy.LogRecord.Level apiProxyLevel) {
    switch (apiProxyLevel) {
      case debug:
        return Level.FINE;
      case info:
        return Level.INFO;
      case warn:
        return Level.WARNING;
      case error:
        return Level.SEVERE;
      case fatal:
        return Level.SEVERE;
      default:
        return Level.WARNING;
    }
  }

  @Override
  public Clock getClock() {
    return clock;
  }

  @Override
  public void setClock(Clock clock) {
    this.clock = clock;
  }

  private static class DaemonThreadFactory implements ThreadFactory {

    private final ThreadFactory parent;

    public DaemonThreadFactory(ThreadFactory parent) {
      this.parent = parent;
    }

    @Override
    public Thread newThread(Runnable r) {
      Thread thread = parent.newThread(r);
      thread.setDaemon(true);
      return thread;
    }
  }
}

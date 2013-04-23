// Copyright 2009 Google Inc. All Rights Reserved.
package com.google.appengine.tools.development.testing;

import com.google.appengine.api.taskqueue.DeferredTask;
import com.google.appengine.api.taskqueue.DeferredTaskContext;
import com.google.appengine.api.taskqueue.TaskOptions;
import com.google.appengine.api.taskqueue.dev.LocalTaskQueue;
import com.google.appengine.api.taskqueue.dev.LocalTaskQueueCallback;
import com.google.appengine.api.urlfetch.URLFetchServicePb;
import com.google.appengine.tools.development.ApiProxyLocal;
import com.google.protobuf.ByteString;

import java.io.ByteArrayInputStream;
import java.io.ObjectInputStream;
import java.util.Map;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;

/**
 * Config for accessing the local task queue in tests. Default behavior is to
 * configure the local task queue to not automatically execute any tasks.
 * {@link #tearDown()} wipes out all in-memory state so all queues are empty at
 * the end of every test.
 *
 */
public final class LocalTaskQueueTestConfig implements LocalServiceTestConfig {

  private Boolean disableAutoTaskExecution = true;
  private String queueXmlPath;
  private Class<? extends LocalTaskQueueCallback> callbackClass;
  private boolean shouldCopyApiProxyEnvironment = false;
  private CountDownLatch taskExecutionLatch;

  /**
   * Disables/enables automatic task execution. If you enable automatic task
   * execution, keep in mind that the default behavior is to hit the url that
   * was provided when the {@link TaskOptions} was constructed. If you do not
   * have a servlet engine running, this will fail. As an alternative to
   * launching a servlet engine, instead consider providing a
   * {@link LocalTaskQueueCallback} via {@link #setCallbackClass(Class)} so that
   * you can assert on the properties of the URLFetchServicePb.URLFetchRequest.
   *
   * @param disableAutoTaskExecution
   * @return {@code this} (for chaining)
   */
  public LocalTaskQueueTestConfig setDisableAutoTaskExecution(boolean disableAutoTaskExecution) {
    this.disableAutoTaskExecution = disableAutoTaskExecution;
    return this;
  }

  /**
   * Overrides the location of queue.xml. Must be a full path, e.g.
   * /usr/local/dev/myapp/test/queue.xml
   *
   * @param queueXmlPath
   * @return {@code this} (for chaining)
   */
  public LocalTaskQueueTestConfig setQueueXmlPath(String queueXmlPath) {
    this.queueXmlPath = queueXmlPath;
    return this;
  }

  /**
   * Overrides the callback implementation used by the local task queue for
   * async task execution.
   *
   * @param callbackClass fully-qualified name of a class with a public, default
   *        constructor that implements {@link LocalTaskQueueCallback}.
   * @return {@code this} (for chaining)
   */
  public LocalTaskQueueTestConfig setCallbackClass(
      Class<? extends LocalTaskQueueCallback> callbackClass) {
    this.callbackClass = callbackClass;
    return this;
  }

  /**
   * Enables copying of the {@code ApiProxy.Environment} to task handler
   * threads. This setting is ignored unless both
   * <ol>
   * <li>a {@link #setCallbackClass(Class) callback} class has been set, and
   * <li>automatic task execution has been
   * {@link #setDisableAutoTaskExecution(boolean) enabled.}
   * </ol>
   * In this case tasks will be handled locally by new threads and it may be
   * useful for those threads to use the same environment data as the main test
   * thread. Properties such as the
   * {@link LocalServiceTestHelper#setEnvAppId(String) appID}, and the user
   * {@link LocalServiceTestHelper#setEnvEmail(String) email} will be copied
   * into the environment of the task threads. Be aware that
   * {@link LocalServiceTestHelper#setEnvAttributes(java.util.Map) attribute
   * map} will be shallow-copied to the task thread environents, so that any
   * mutable objects used as values of the map should be thread safe. If this
   * property is {@code false} then the task handler threads will have an empty
   * {@code ApiProxy.Environment}. This property is {@code false} by default.
   *
   * @param b should the {@code ApiProxy.Environment} be pushed to task handler
   *        threads
   * @return {@code this} (for chaining)
   */
  public LocalTaskQueueTestConfig setShouldCopyApiProxyEnvironment(boolean b) {
    this.shouldCopyApiProxyEnvironment = b;
    return this;
  }

  /**
   * Sets a {@link CountDownLatch} that the thread executing the task will
   * decrement after a {@link LocalTaskQueueCallback} finishes execution.  This
   * makes it easy for tests to block until a task queue task runs.  Note that
   * the latch is only used when a callback class is provided (via
   * {@link #setCallbackClass(Class)}) and when automatic task execution is
   * enabled (via {@link #setDisableAutoTaskExecution(boolean)}).  Also note
   * that a {@link CountDownLatch} cannot be reused, so if you have a test that
   * requires the ability to "reset" a CountDownLatch you can pass an instance
   * of {@link TaskCountDownLatch}, which exposes additional methods that help
   * with this.
   *
   * @param latch The latch.
   * @return {@code this} (for chaining)
   */
  public LocalTaskQueueTestConfig setTaskExecutionLatch(CountDownLatch latch) {
    this.taskExecutionLatch = latch;
    return this;
  }

  @Override
  public void setUp() {
    ApiProxyLocal proxy = LocalServiceTestHelper.getApiProxyLocal();
    proxy.setProperty(
        LocalTaskQueue.DISABLE_AUTO_TASK_EXEC_PROP, disableAutoTaskExecution.toString());
    if (queueXmlPath != null) {
      proxy.setProperty(LocalTaskQueue.QUEUE_XML_PATH_PROP, queueXmlPath);
    }
    if (callbackClass != null) {
      String callbackName;
      if (!disableAutoTaskExecution) {
        EnvSettingTaskqueueCallback.setProxyProperties(
            proxy, callbackClass, shouldCopyApiProxyEnvironment);
        if (taskExecutionLatch != null) {
          EnvSettingTaskqueueCallback.setTaskExecutionLatch(taskExecutionLatch);
        }
        callbackName = EnvSettingTaskqueueCallback.class.getName();
      } else {
        callbackName = callbackClass.getName();
      }
      proxy.setProperty(LocalTaskQueue.CALLBACK_CLASS_PROP, callbackName);
    }
  }

  @Override
  public void tearDown() {
    LocalTaskQueue ltq = getLocalTaskQueue();
    if (ltq != null) {
      for (String queueName : ltq.getQueueStateInfo().keySet()) {
        ltq.flushQueue(queueName);
      }
      ltq.stop();
    }
  }

  public static LocalTaskQueue getLocalTaskQueue() {
    return (LocalTaskQueue) LocalServiceTestHelper.getLocalService(LocalTaskQueue.PACKAGE);
  }

  /**
   * A {@link LocalTaskQueueCallback} implementation that automatically detects
   * and runs tasks with a {@link DeferredTask} payload.
   *
   * Requests with a payload that is not a {@link DeferredTask} are dispatched
   * to {@link #executeNonDeferredRequest}, which by default does nothing.
   * If you need to handle a payload like this you can extend the class and
   * override this method to do what you need.
   */
  public static class DeferredTaskCallback implements LocalTaskQueueCallback {
    @Override
    public void initialize(Map<String, String> properties) {
    }

    @Override
    public int execute(URLFetchServicePb.URLFetchRequest req) {
      for (URLFetchServicePb.URLFetchRequest.Header header : req.getHeaderList()) {
        if (header.getKey().equals("content-type") &&
            DeferredTaskContext.RUNNABLE_TASK_CONTENT_TYPE.equals(header.getValue())) {
          ByteString payload = req.getPayload();
          ByteArrayInputStream bais = new ByteArrayInputStream(payload.toByteArray());
          ObjectInputStream ois;
          try {
            ois = new ObjectInputStream(bais);
            DeferredTask deferredTask = (DeferredTask) ois.readObject();
            deferredTask.run();
            return 200;
          } catch (Exception e) {
            return 500;
          }
        }
      }
      return executeNonDeferredRequest(req);
    }

    /**
     * Broken out to make it easy for subclasses to provide their own behavior
     * when the request payload is not a {@link DeferredTask}.
     */
    protected int executeNonDeferredRequest(URLFetchServicePb.URLFetchRequest req) {
      return 200;
    }
  }

  /**
   * A {@link CountDownLatch} extension that can be reset.  Pass an instance of
   * this class to {@link LocalTaskQueueTestConfig#setTaskExecutionLatch)} when
   * you need to reuse the latch within or across tests.  Only one thread at a
   * time should ever call any of the {@link #await} or {@link #reset} methods.
   */
  public static final class TaskCountDownLatch extends CountDownLatch {
    private int initialCount;
    private CountDownLatch latch;

    public TaskCountDownLatch(int count) {
      super(count);
      reset(count);
    }

    @Override
    public long getCount() {
      return latch.getCount();
    }

    @Override
    public String toString() {
      return latch.toString();
    }

    @Override
    /**
     * {@inheritDoc}
     * Only one thread at a time should call this.
     */
    public void await() throws InterruptedException {
      latch.await();
    }

    @Override
    /**
     * {@inheritDoc}
     * Only one thread at a time should call this.
     */
    public boolean await(long timeout, TimeUnit unit) throws InterruptedException {
      return latch.await(timeout, unit);
    }

    @Override
    public void countDown() {
      latch.countDown();
    }

    /**
     * Shorthand for calling {@link #await()} followed by {@link #reset()}.
     * Only one thread at a time should call this.
     */
    public void awaitAndReset() throws InterruptedException {
      awaitAndReset(initialCount);
    }

    /**
     * Shorthand for calling {@link #await()} followed by {@link #reset(int)}.
     * Only one thread at a time should call this.
     */
    public void awaitAndReset(int count) throws InterruptedException {
      await();
      reset(count);
    }

    /**
     * Shorthand for calling {@link #await(long, java.util.concurrent.TimeUnit)} followed by
     * {@link #reset()}.  Only one thread at a time should call this.
     */
    public boolean awaitAndReset(long timeout, TimeUnit unit)
        throws InterruptedException {
      return awaitAndReset(timeout, unit, initialCount);
    }

    /**
     * Shorthand for calling {@link #await(long, java.util.concurrent.TimeUnit)} followed by
     * {@link #reset(int)}.  Only one thread at a time should call this.
     */
    public boolean awaitAndReset(long timeout, TimeUnit unit, int count)
        throws InterruptedException {
      boolean result = await(timeout, unit);
      reset(count);
      return result;
    }

    /**
     * Resets the latch to its most recent initial count.  Only one thread at a
     * time should call this.
     */
    public void reset() {
      reset(initialCount);
    }

    /**
     * Resets the latch to the provided count.  Only one thread at a time
     * should call this.
     */
    public void reset(int count) {
      this.initialCount = count;
      this.latch = new CountDownLatch(count);
    }
  }
}

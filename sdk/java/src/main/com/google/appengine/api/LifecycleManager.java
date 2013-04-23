// Copyright 2010 Google Inc. All Rights Reserved.

package com.google.appengine.api;

import com.google.apphosting.api.ApiProxy;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;
import java.security.AccessController;
import java.security.PrivilegedAction;

/**
 * Information about the current status of the Java Runtime.
 *
 */
public final class LifecycleManager {

  private static final LifecycleManager instance = new LifecycleManager();
  private static final Logger log = Logger.getLogger(LifecycleManager.class.getName());
  private boolean shuttingDown = false;
  private long deadline = -1L;

  private LifecycleManager() { }

  public static LifecycleManager getInstance() {
    return instance;
  }

  public boolean isShuttingDown() {
    return shuttingDown;
  }

  /**
   * Register a ShutdownHook to be called when the runtime shuts down.
   */
  public synchronized void setShutdownHook(ShutdownHook hook) {
    hooks.put(currentAppVersionId(), hook);
  }

  /**
   * Calls Thread.interrupt() on all threads running requests for this
   * application.
   */
  public void interruptAllRequests() {
    AccessController.doPrivileged(
        new PrivilegedAction() {
          public Object run() {
            List<Thread> threads = ApiProxy.getRequestThreads();
            if (threads != null) {
              for (Thread thread : threads) {
                thread.interrupt();
              }
            }
            return null;
          }
        });
  }

  /**
   * If the runtime is shutting down, returns how long, in
   * milliseconds, is left for shutdown code to clean up. Otherwise,
   * returns -1.
   */
  public long getRemainingShutdownTime() {
    if (deadline == -1L) {
      return -1L;
    } else {
      return deadline - System.currentTimeMillis();
    }
  }

  /**
   * For testing purposes only:
   * Notifies the LifecycleManager that the runtime is shutting down.
   */
  public synchronized void beginShutdown(long deadline) {
    this.shuttingDown = true;
    this.deadline = deadline;
    ShutdownHook hook = hooks.get(currentAppVersionId());
    if (hook != null) {
      hook.shutdown();
    }
  }

  private String currentAppVersionId() {
    ApiProxy.Environment env = ApiProxy.getCurrentEnvironment();
    return env.getAppId() + "/" + env.getVersionId();
  }

  private Map<String, ShutdownHook> hooks = new HashMap<String, ShutdownHook>();

  public interface ShutdownHook {
    public void shutdown();
  }
}

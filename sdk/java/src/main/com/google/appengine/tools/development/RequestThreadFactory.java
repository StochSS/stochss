// Copyright 2011 Google Inc. All Rights Reserved.

package com.google.appengine.tools.development;

import com.google.apphosting.api.ApiProxy;

import java.security.AccessControlContext;
import java.security.AccessController;
import java.security.PrivilegedAction;
import java.util.Date;
import java.util.Map;
import java.util.concurrent.ThreadFactory;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * This {@link ThreadFactory} creates {@link Thread} objects that
 * replicate the current request's environment, and are interrupted
 * when the current request completes.
 *
 */
public class RequestThreadFactory implements ThreadFactory {
  private static final Logger logger = Logger.getLogger(RequestThreadFactory.class.getName());

  private static final int THREAD_STARTUP_LATENCY_MS = 20;

  private static final int ONLINE_REQUEST_DEADLINE_MS = 60000;
  private static final int OFFLINE_REQUEST_DEADLINE_MS = 600000;

  @Override
  public Thread newThread(final Runnable runnable) {
    final boolean callerNativeMode = DevSocketImplFactory.isNativeSocketMode();

    final AccessControlContext context = AccessController.getContext();
    return AccessController.doPrivileged(new PrivilegedAction<Thread>() {
        @Override
        public Thread run() {
          final ApiProxy.Environment environment = ApiProxy.getCurrentEnvironment();
          DevSocketImplFactory.setSocketNativeMode(callerNativeMode);

          Thread thread = new Thread() {
              /**
               * If the thread is started, install a
               * {@link RequestEndListener} to interrupt the thread
               * at the end of the request.  We don't yet enforce
               * request deadlines in the DevAppServer so we don't
               * need to handle other interrupt cases yet.
               */
              @Override
              public void start() {
                try {
                  Thread.sleep(THREAD_STARTUP_LATENCY_MS);
                } catch (InterruptedException ex) {
                  logger.log(Level.INFO, "Interrupted while simulating thread startup latency", ex);
                  Thread.currentThread().interrupt();
                }
                super.start();
                final Thread thread = this;
                RequestEndListenerHelper.register(new RequestEndListener() {
                    @Override
                    public void onRequestEnd(ApiProxy.Environment environment) {
                      if (thread.isAlive()) {
                        logger.info("Interrupting request thread: " + thread);
                        thread.interrupt();
                        logger.info("Waiting up to 100ms for thread to complete: " + thread);
                        try {
                          thread.join(100);
                        } catch (InterruptedException ex) {
                          logger.info("Interrupted while waiting.");
                        }
                        if (thread.isAlive()) {
                          logger.info("Interrupting request thread again: " + thread);
                          thread.interrupt();
                          long remaining = getRemainingDeadlineMillis(environment);
                          logger.info("Waiting up to " + remaining +
                                      " ms for thread to complete: " + thread);
                          try {
                            thread.join(remaining);
                          } catch (InterruptedException ex) {
                            logger.info("Interrupted while waiting.");
                          }
                          if (thread.isAlive()) {
                            Throwable stack = new Throwable();
                            stack.setStackTrace(thread.getStackTrace());
                            logger.log(Level.SEVERE,
                                       "Thread left running: " + thread + ".  " +
                                       "In production this will cause the request to fail.",
                                       stack);
                          }
                        }
                      }
                    }
                  });
              }

              @Override
              public void run() {
                ApiProxy.setEnvironmentForCurrentThread(environment);
                AccessController.doPrivileged(new PrivilegedAction<Object>() {
                  @Override
                    public Object run() {
                      runnable.run();
                      return null;
                    }
                  }, context);
              }
            };
          System.setProperty("devappserver-thread-" + thread.getName(), "true");
          return thread;
        }
      });
  }

  private long getRemainingDeadlineMillis(ApiProxy.Environment environment) {
    int requestTimeMillis;
    Map<String, Object> attributes = environment.getAttributes();
    Date startTime = (Date) attributes.get(LocalEnvironment.START_TIME_ATTR);
    if (startTime != null) {
      startTime = new Date();
    }
    Boolean offline = (Boolean) attributes.get(ApiProxyLocalImpl.IS_OFFLINE_REQUEST_KEY);
    if (offline != null && offline) {
      requestTimeMillis = OFFLINE_REQUEST_DEADLINE_MS;
    } else {
      requestTimeMillis = ONLINE_REQUEST_DEADLINE_MS;
    }
    return requestTimeMillis - (System.currentTimeMillis() - startTime.getTime());
  }
}

// Copyright 2011 Google Inc. All Rights Reserved.

package com.google.appengine.api.taskqueue;

import com.google.apphosting.api.ApiProxy;

import java.util.Map;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Resources for managing {@link DeferredTask}.
 *
 */
public class DeferredTaskContext {
  /**
   * The content type of a serialized {@link DeferredTask}.
   */
  public static final String RUNNABLE_TASK_CONTENT_TYPE =
      "application/x-binary-app-engine-java-runnable-task";

  /**
   * The URL the DeferredTask servlet is mapped to by default.
   */
  public static final String DEFAULT_DEFERRED_URL = "/_ah/queue/__deferred__";

  static final String DEFERRED_TASK_SERVLET_KEY =
    DeferredTaskContext.class.getName() + ".httpServlet";
  static final String DEFERRED_TASK_REQUEST_KEY =
    DeferredTaskContext.class.getName() + ".httpServletRequest";
  static final String DEFERRED_TASK_RESPONSE_KEY =
    DeferredTaskContext.class.getName() + ".httpServletResponse";
  static final String DEFERRED_DO_NOT_RETRY_KEY =
    DeferredTaskContext.class.getName() + ".doNotRetry";

  /**
   * Returns the {@link HttpServlet} instance for the current running
   * deferred task for the current thread or {@code null} if there is
   * no current deferred task active for this thread.
   */
  public static HttpServlet getCurrentServlet() {
    Map<String, Object> attributes = ApiProxy.getCurrentEnvironment().getAttributes();
    return (HttpServlet) attributes.get(DEFERRED_TASK_SERVLET_KEY);
  }

  /**
   * Returns the {@link HttpServletRequest} instance for the current running
   * deferred task for the current thread or {@code null} if there is
   * no current deferred task active for this thread.
   */
  public static HttpServletRequest getCurrentRequest() {
    Map<String, Object> attributes = ApiProxy.getCurrentEnvironment().getAttributes();
    return (HttpServletRequest) attributes.get(DEFERRED_TASK_REQUEST_KEY);
  }

  /**
   * Returns the {@link HttpServletResponse} instance for the current running
   * deferred task for the current thread or {@code null} if there is
   * no current deferred task active for this thread.
   */
  public static HttpServletResponse getCurrentResponse() {
    Map<String, Object> attributes = ApiProxy.getCurrentEnvironment().getAttributes();
    return (HttpServletResponse) attributes.get(DEFERRED_TASK_RESPONSE_KEY);
  }

  /**
   * Sets the action on task failure. Normally when an exception is thrown,
   * the task will be retried, however if {@link #setDoNotRetry}(false) is
   * set, the task will not be retried.
   */
   public static void setDoNotRetry(boolean value) {
     Map<String, Object> attributes = ApiProxy.getCurrentEnvironment().getAttributes();
     attributes.put(DEFERRED_DO_NOT_RETRY_KEY, value);
   }

   private DeferredTaskContext() {}
}

// Copyright 2009 Google Inc. All Rights Reserved.

package com.google.appengine.tools.appstats;

import com.google.appengine.api.memcache.MemcacheServiceFactory;
import com.google.appengine.tools.appstats.Recorder.UnprocessedFutureStrategy;
import com.google.apphosting.api.ApiProxy;
import com.google.apphosting.api.DeadlineExceededException;
import com.google.apphosting.api.ApiProxy.Delegate;
import com.google.apphosting.api.ApiProxy.Environment;

import java.io.IOException;
import java.lang.reflect.InvocationHandler;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.lang.reflect.Proxy;
import java.util.logging.Logger;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * A servlet filter that will time RPCs going to the server and collect statistics.
 * Add this filter to any servlet that you would like to monitor.
 *
 * The simplest way to configure an application for appstats collection is this:
 *
 *
 * <pre>
   <filter>
    <filter-name>appstats</filter-name>
    <filter-class>com.google.appengine.tools.appstats.AppstatsFilter</filter-class>
  </filter>
  <filter-mapping>
    <filter-name>appstats</filter-name>
    <url-pattern>/*</url-pattern>
  </filter-mapping>
  </pre>
 *
 */
public class AppstatsFilter implements Filter {

  /**
   * Visible for testing
   */
  static final String DEADLINE_MESSAGE = "Deadline exceeded; cannot log app stats";

  /**
   * Visible for testing.
   */
  static Logger log = Logger.getLogger(AppstatsFilter.class.getName());

  /**
   * Name of the HTTP header that will be included in the response.
   */
  static final String TRACE_HEADER_NAME = "X-TraceUrl";

  /**
   * The default values for the basePath init parameter.
   */
  private static final String DEFAULT_BASE_PATH = "/appstats/";

  /**
   * Static to enforce "singleton" even if multiple instances of the filter are created.
   * Visible for testing
   */
  static Recorder.RecordWriter writer = null;

  /**
   * The delegate that was wrapped when the WRITER was created.
   * Visible for testing.
   */
  static Delegate<?> delegate;

  /**
   * The base path where the AppStats dashboard can be found. This is provided
   * as an init parameter.
   */
  private String basePath;

  /**
   * A log messsage that may be used to store a link back to app stats.
   * The ID is referred to as {ID}.
   */
  private String logMessage;

  private Recorder recorder;

  public AppstatsFilter() {
  }

  /**
   * Visible for testing
   */
  AppstatsFilter(String basePath, String logMessage) {
    this.basePath = basePath;
    this.logMessage = logMessage;
  }

  @Override
  public void destroy() {
  }

  @Override
  public void doFilter(ServletRequest request, ServletResponse response, FilterChain filters)
      throws IOException, ServletException {
    Environment environment = getCurrentEvnvironment();
    Long id = writer.begin(delegate, environment, (HttpServletRequest) request);
    final HttpServletResponse innerResponse = (HttpServletResponse) response;
    final Integer[] responseCode = {null};

    innerResponse.addHeader(TRACE_HEADER_NAME,
        basePath + "details?time=" + id + "&type=json");

    final HttpServletResponse outerResponse = (HttpServletResponse) Proxy.newProxyInstance(
        AppstatsFilter.class.getClassLoader(),
        new Class[]{HttpServletResponse.class},
        new InvocationHandler(){
          @Override
          public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
            if (method.getName().equals("sendError") || method.getName().equals("setStatus")) {
              responseCode[0] = ((Number) args[0]).intValue();
            } else if (method.getName().equals("sendRedirect")) {
              responseCode[0] = HttpServletResponse.SC_TEMPORARY_REDIRECT;
            }
            return call(method, innerResponse, args);
          }
        });
    try {
      filters.doFilter(request, outerResponse);
    } catch (DeadlineExceededException e) {
      id = null;
      log.warning(DEADLINE_MESSAGE);
      throw e;
    } finally {
      if (id != null) {
        if (recorder != null) {
          recorder.processAsyncRpcs(environment);
        }
        boolean didCommit = writer.commit(delegate, environment, responseCode[0]);
        if (logMessage != null && didCommit) {
          log.info(logMessage.replace("{ID}", "" + id));
        }
      }
    }
  }

  private static String getAppStatsPathFromConfig(FilterConfig config) {
    String path = config.getInitParameter("basePath");
    if (path == null) {
      return DEFAULT_BASE_PATH;
    } else {
      return path.endsWith("/") ? path : path + "/";
    }
  }

  @SuppressWarnings("unchecked")
  @Override
  public synchronized void init(FilterConfig config) {
    if (writer == null) {
      Recorder.RecordWriter newWriter =
        new MemcacheWriter(
            new Recorder.Clock(),
            MemcacheServiceFactory.getMemcacheService(MemcacheWriter.STATS_NAMESPACE));
      delegate = ApiProxy.getDelegate();

      recorder = new Recorder(delegate, newWriter);
      configureRecorder(config, recorder);
      ApiProxy.setDelegate(wrapPartially(delegate, recorder));
      writer = newWriter;
    }
    basePath = getAppStatsPathFromConfig(config);
    logMessage = config.getInitParameter("logMessage");
  }

  /**
   * Create a proxy that implements all the interfaces that the original
   * implements. Whenever a method is called that the wrapper supports,
   * the wrapper will be called. Otherwise, the method will be invoked on
   * the original object.
   */
  @SuppressWarnings("unchecked")
  static <S, T extends S> S wrapPartially(final S original, final T wrapper) {

    if (!original.getClass().getName().contains("Local")) {
      return wrapper;
    }

    Class<?>[] interfaces = original.getClass().getInterfaces();
    InvocationHandler handler = new InvocationHandler(){
      @Override
      public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
        Method wrapperMethod = null;
        try {
          wrapperMethod = wrapper.getClass().getMethod(
              method.getName(), method.getParameterTypes());
        } catch (NoSuchMethodException e) {
          return call(method, original, args);
        }
        return call(wrapperMethod, wrapper, args);
      }};
    return (S) Proxy.newProxyInstance(
        original.getClass().getClassLoader(), interfaces, handler);
  }

  /**
   * Invoke a method and unwrap exceptions the invoked method may throw.
   */
  private static Object call(Method m, Object o, Object[] args) throws Throwable {
    try {
      return m.invoke(o, args);
    } catch (InvocationTargetException e) {
      throw e.getTargetException();
    }
  }

  /**
   * Visible for testing
   */
  Environment getCurrentEvnvironment() {
    return ApiProxy.getCurrentEnvironment();
  }

  static void configureRecorder(FilterConfig config, Recorder recorder) {
    recorder.setMaxLinesOfStackTrace(getPositiveInt(
        config, "maxLinesOfStackTrace", Integer.MAX_VALUE));
    if (config.getInitParameter("payloadRenderer") != null) {
      try {
        recorder.setPayloadRenderer(
            (PayloadRenderer) Class.forName(config.getInitParameter("payloadRenderer"))
                .newInstance());
      } catch (InstantiationException e) {
        throw new IllegalArgumentException("Cannot instantiate payloadRenderer", e);
      } catch (IllegalAccessException e) {
        throw new IllegalArgumentException("Cannot instantiate payloadRenderer", e);
      } catch (ClassNotFoundException e) {
        throw new IllegalArgumentException("Cannot instantiate payloadRenderer", e);
      } catch (ClassCastException e) {
        throw new IllegalArgumentException("Cannot instantiate payloadRenderer", e);
      }
    }
    if (config.getInitParameter("onPendingAsyncCall") != null) {
      recorder.setUnprocessedFutureStrategy(
          UnprocessedFutureStrategy.valueOf(config.getInitParameter("onPendingAsyncCall")));
    }
    if (config.getInitParameter("calculateRpcCosts") != null) {
      recorder.setCalculateRpcCosts(Boolean.valueOf(config.getInitParameter("calculateRpcCosts")));
    }
    if (config.getInitParameter("datastoreDetails") != null) {
      recorder.setDatastoreDetails(Boolean.valueOf(config.getInitParameter("datastoreDetails")));
    }
  }

  static int getPositiveInt(FilterConfig config, String key, int defaultValue) {
    int result = defaultValue;
    String stringValue = config.getInitParameter(key);
    if (stringValue != null) {
      result = Integer.parseInt(stringValue);
      if (result <= 0) {
        throw new IllegalArgumentException(key + " must be a positive value");
      }
    }
    return result;
  }

}

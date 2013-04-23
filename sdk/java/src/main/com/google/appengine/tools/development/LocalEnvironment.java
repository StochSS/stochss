// Copyright 2009 Google Inc. All Rights Reserved.

package com.google.appengine.tools.development;

import com.google.appengine.api.NamespaceManager;
import com.google.apphosting.api.ApiProxy;
import com.google.apphosting.utils.config.WebModule;

import java.math.BigInteger;
import java.nio.ByteBuffer;
import java.security.MessageDigest;
import java.util.Collection;
import java.util.Collections;
import java.util.Date;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * {@code LocalEnvironment} is a simple
 * {@link com.google.apphosting.api.ApiProxy.Environment} that reads
 * application-specific details (e.g. application identifer) directly from the
 * custom deployment descriptor.
 *
 */
abstract public class LocalEnvironment implements ApiProxy.Environment {
  private static final Logger logger = Logger.getLogger(LocalEnvironment.class.getName());
  static final Pattern APP_ID_PATTERN = Pattern.compile("([^:.]*)(:([^:.]*))?(.*)?");

  private static final String APPS_NAMESPACE_KEY =
      NamespaceManager.class.getName() + ".appsNamespace";

  public static final String INSTANCE_ID_ENV_ATTRIBUTE = "com.google.appengine.instance.id";

  /**
   * {@code ApiProxy.Environment} instances used with {@code
   * ApiProxyLocalFactory} should have a entry in the map returned by
   * {@code getAttributes()} with this key, and a {@link
   * java.util.concurrent.Semaphore} as the value.  This is used
   * internally to track asynchronous API calls.
   */
  public static final String API_CALL_SEMAPHORE =
      "com.google.appengine.tools.development.api_call_semaphore";

  /**
   * The name of an {@link #getAttributes() attribute} that contains a
   * (String) unique identifier for the curent request.
   */
  public static final String REQUEST_ID =
      "com.google.appengine.runtime.request_log_id";

  /**
   * The name of an {@link #getAttributes() attribute} that contains a
   * a {@link Date} object representing the time this request was
   * started.
   */
  public static final String START_TIME_ATTR =
      "com.google.appengine.tools.development.start_time";

  /**
   * The name of an {@link #getAttributes() attribute} that contains a {@code
   * Set<RequestEndListener>}. The set of {@link RequestEndListener
   * RequestEndListeners} is populated by from within the service calls. The
   * listeners are invoked at the end of a user request.
   */
  public static final String REQUEST_END_LISTENERS =
      "com.google.appengine.tools.development.request_end_listeners";

  /**
   * The name of an {@link #getAttributes() attribute} that contains the {@link
   * javax.servlet.http.HttpServletRequest} instance.
   */
  public static final String HTTP_SERVLET_REQUEST =
      "com.google.appengine.http_servlet_request";

  private static final String REQUEST_THREAD_FACTORY_ATTR =
      "com.google.appengine.api.ThreadManager.REQUEST_THREAD_FACTORY";

  private static final String BACKGROUND_THREAD_FACTORY_ATTR =
      "com.google.appengine.api.ThreadManager.BACKGROUND_THREAD_FACTORY";

  /**
   * For historical and probably compatibility reasons dev appserver assigns all
   * versions a minor version of 1.
   */
  private static final String MINOR_VERSION_SUFFIX = ".1";

  /**
   * In production, this is a constant that defines the {@link #getAttributes() attribute} name
   * that contains the hostname on which the default version is listening.
   * In the local development server, the {@link #getAttributes() attribute} contains the
   * listening port in addition to the hostname, and is the one and only frontend app instance
   * hostname and port.
   */
  public static final String DEFAULT_VERSION_HOSTNAME =
      "com.google.appengine.runtime.default_version_hostname";

  private final String appId;
  private final String versionId;

  private final Collection<RequestEndListener> requestEndListeners;

  protected final ConcurrentMap<String, Object> attributes =
      new ConcurrentHashMap<String, Object>();

  private final Long endTime;
  /**
   * Instance number for a server's main instance.
   * <p>
   * Clients depend on this literal having the value -1 so do not change this
   * value without making needed updates to clients.
   */
  public static final int MAIN_INSTANCE = -1;

  @Deprecated
  protected LocalEnvironment(String appId, String majorVersionId) {
    this(appId, WebModule.DEFAULT_SERVER_NAME, majorVersionId, LocalEnvironment.MAIN_INSTANCE,
        null);
  }

  @Deprecated
  protected LocalEnvironment(String appId, String majorVersionId, Long deadlineMillis) {
    this(appId, WebModule.DEFAULT_SERVER_NAME, majorVersionId, LocalEnvironment.MAIN_INSTANCE,
        deadlineMillis);
  }

  protected LocalEnvironment(String appId, String serverName, String majorVersionId, int instance,
      Long deadlineMillis) {
    this.appId = appId;
    if (serverName == null || WebModule.DEFAULT_SERVER_NAME.equals(serverName)) {
      this.versionId = majorVersionId + MINOR_VERSION_SUFFIX;
    } else {
      this.versionId = serverName + ":" + majorVersionId + MINOR_VERSION_SUFFIX;
    }
    if (deadlineMillis == null) {
      this.endTime = null;
    } else if (deadlineMillis < 0) {
      throw new IllegalArgumentException("deadlineMillis must be a non-negative integer.");
    } else {
      this.endTime = System.currentTimeMillis() + deadlineMillis;
    }
    setInstance(attributes, instance);
    requestEndListeners =
        Collections.newSetFromMap(new ConcurrentHashMap<RequestEndListener, Boolean>(10));
    attributes.put(REQUEST_ID, generateRequestId());
    attributes.put(REQUEST_END_LISTENERS, requestEndListeners);
    attributes.put(START_TIME_ATTR, new Date());
    attributes.put(REQUEST_THREAD_FACTORY_ATTR, new RequestThreadFactory());
    attributes.put(BACKGROUND_THREAD_FACTORY_ATTR, new BackgroundThreadFactory(appId,
        serverName, majorVersionId));
  }

  /**
   * Sets the instance for the provided attributes.
   */
  static void setInstance(Map<String, Object> attributes, int instance) {
    attributes.remove(INSTANCE_ID_ENV_ATTRIBUTE);
    if (instance != LocalEnvironment.MAIN_INSTANCE) {
      attributes.put(INSTANCE_ID_ENV_ATTRIBUTE, Integer.toString(instance));
    }
  }

  /**
   * Returns the current instance or {@link #MAIN_INSTANCE} if none is defined.
   */
  static int getCurrentInstance() {
    int result = MAIN_INSTANCE;
    String instance = (String) ApiProxy.getCurrentEnvironment().getAttributes().get(
        LocalEnvironment.INSTANCE_ID_ENV_ATTRIBUTE);
    if (instance != null) {
      result = Integer.parseInt(instance);
    }
    return result;
  }

  private static AtomicInteger requestID = new AtomicInteger();

  /**
   * Generates a unique request ID using the same algorithm as the Python dev
   * appserver. It is similar to the production algorithm, but with less
   * embedded data. The primary goal is that the IDs be sortable by timestamp,
   * so the initial bytes consist of seconds then microseconds packed in
   * big-endian byte order. To ensure uniqueness, a hash of the incrementing
   * counter is appended. Hexadecimal encoding is used instead of base64 in
   * order to preserve comparison order.
   */
  private String generateRequestId(){
    try {
      ByteBuffer buf = ByteBuffer.allocate(12);

      long now = System.currentTimeMillis();
      buf.putInt((int) (now / 1000));
      buf.putInt((int) ((now * 1000) % 1000000));

      String nextID = new Integer(requestID.getAndIncrement()).toString();
      byte[] hashBytes = MessageDigest.getInstance("SHA-1").digest(nextID.getBytes());
      buf.put(hashBytes, 0, 4);

      return String.format("%x", new BigInteger(buf.array()));
    } catch (Exception e) {
      return "";
    }
  }

  @Override
  public String getAppId() {
    return appId;
  }

  @Override
  public String getVersionId() {
    return versionId;
  }

  @Override
  public String getAuthDomain() {
    return "gmail.com";
  }

  @Override
  @Deprecated
  public final String getRequestNamespace() {
    String appsNamespace = (String) getAttributes().get(APPS_NAMESPACE_KEY);
    return appsNamespace == null ? "" : appsNamespace;
  }

  @Override
  public ConcurrentMap<String, Object> getAttributes() {
    return attributes;
  }

  public void callRequestEndListeners() {
    for (RequestEndListener listener : requestEndListeners) {
      try {
        listener.onRequestEnd(this);
      } catch (Exception ex) {
        logger.log(Level.WARNING,
                   "Exception while attempting to invoke RequestEndListener " + listener.getClass()
                   + ": ", ex);
      }
    }
    requestEndListeners.clear();
  }

  @Override
  public long getRemainingMillis() {
    if (endTime != null) {
      return endTime - System.currentTimeMillis();
    }

    return Long.MAX_VALUE;
  }

  /**
   * Returns the major version component from the provided version id or null
   * if the provided version id has no major version component.
   */
  public static String getMajorVersion(String versionId) {
    Matcher matcher = APP_ID_PATTERN.matcher(versionId);
    matcher.find();
    return matcher.group(3) == null ? matcher.group(1) : matcher.group(3);
  }

  /**
   * Returns the server component from the provided version id or
   * {@link WebModule#DEFAULT_SERVER_NAME} if the provided version id has no
   * server component.
   */
  public static String getServerName(String versionId) {
    Matcher matcher = APP_ID_PATTERN.matcher(versionId);
    matcher.find();
    return matcher.group(3) == null ? WebModule.DEFAULT_SERVER_NAME : matcher.group(1);
  }
}

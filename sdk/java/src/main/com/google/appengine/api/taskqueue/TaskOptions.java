// Copyright 2010 Google Inc. All rights reserved.
package com.google.appengine.api.taskqueue;

import com.google.appengine.api.taskqueue.TaskQueuePb.TaskQueueAddRequest.RequestMethod;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.ObjectOutputStream;
import java.io.Serializable;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

/**
 * Contains various options for a task following the builder pattern.
 * Calls to {@link TaskOptions} methods may be chained to specify
 * multiple options in the one {@link TaskOptions} object.
 * <p>taskOptions can have either {@link TaskOptions#Method} PULL or a
 * PUSH-related method, e.g. POST, GET, ... Tasks with PULL method can
 * only be added into a PULL queue and PUSH tasks can only be added
 * into a PUSH queue.  <p>Notes on usage:<br> The recommended way to
 * instantiate a {@link TaskOptions} object is to statically import
 * {@link Builder}.* and invoke a static creation method followed by
 * an instance mutator (if needed):
 *
 * <pre>
 * import static com.google.appengine.api.taskqueue.TaskOptions.Builder.*;
 *
 * ...
 * {@link QueueFactory#getDefaultQueue()}.add(header("X-HEADER", "value"));
 * </pre>
 *
 */
public final class TaskOptions implements Serializable {
  private static final long serialVersionUID = -2702019046191004750L;
  /**
   * Methods supported by {@link Queue}.
   * Tasks added to pull queues must have the {@link #Method} PULL.
   * All other methods are appropriate for push queues.
   * See {@link Queue} for more detail on pull and push mode queues.
   */
  public enum Method {
    DELETE(RequestMethod.DELETE, false),
    GET(RequestMethod.GET, false),
    HEAD(RequestMethod.HEAD, false),
    POST(RequestMethod.POST, true),
    PUT(RequestMethod.PUT, true),
    PULL(null, true);

    private RequestMethod pbMethod;
    private boolean isBodyMethod;

    Method(RequestMethod pbMethod, boolean isBodyMethod) {
      this.pbMethod = pbMethod;
      this.isBodyMethod = isBodyMethod;
    }

    RequestMethod getPbMethod() {
      return pbMethod;
    }

    boolean supportsBody() {
      return isBodyMethod;
    }
  }

  /**
   * Params are currently immutable and need to remain that way to avoid the need to clone them
   * in the TaskOptions copy constructor.
   */
  abstract static class Param implements Serializable {
    protected final String name;

    public Param(String name) {
      if (name == null || name.length() == 0) {
        throw new IllegalArgumentException("name must not be null or empty");
      }
      this.name = name;
    }

    @Override
    public int hashCode() {
      return name.hashCode();
    }

    protected static String encodeURLAsUtf8(String url) throws UnsupportedEncodingException {
      return URLEncoder.encode(url, "UTF-8");
    }

    @Override
    public abstract boolean equals(Object o);

    public String getURLEncodedName() throws UnsupportedEncodingException {
      return encodeURLAsUtf8(name);
    }

    abstract String getURLEncodedValue() throws UnsupportedEncodingException;
  }

  static class StringValueParam extends Param {
    private static final long serialVersionUID = -2306561754387422446L;

    protected final String value;

    StringValueParam(String name, String value) {
      super(name);

      if (value == null) {
        throw new IllegalArgumentException("value must not be null");
      }
      this.value = value;
    }

    @Override
    public String toString() {
      return "StringParam(" + name + "=" + value + ")";
    }

    @Override
    public boolean equals(Object o) {
      if (this == o) {
        return true;
      }

      if (!(o instanceof StringValueParam)) {
        return false;
      }

      StringValueParam that = (StringValueParam) o;

      return value.equals(that.value) && name.equals(that.name);
    }

    @Override
    public String getURLEncodedValue() throws UnsupportedEncodingException {
      return encodeURLAsUtf8(value);
    }
  }

  static class ByteArrayValueParam extends Param {
    private static final long serialVersionUID = 1420600427192025644L;

    protected final byte[] value;

    ByteArrayValueParam(String name, byte[] value) {
      super(name);

      if (value == null) {
        throw new IllegalArgumentException("value must not be null");
      }
      this.value = value;
    }

    @Override
    public String toString() {
      return "ByteArrayParam(" + name + ": " + value.length + " bytes)";
    }

    @Override
    public boolean equals(Object o) {
      if (this == o) {
        return true;
      }

      if (!(o instanceof ByteArrayValueParam)) {
        return false;
      }

      ByteArrayValueParam that = (ByteArrayValueParam) o;

      return Arrays.equals(value, that.value) && name.equals(that.name);
    }

    /**
     * {@inheritDoc}
     * @throws UnsupportedEncodingException
     */
    @Override
    public String getURLEncodedValue() throws UnsupportedEncodingException {
      StringBuilder result = new StringBuilder();
      for (int i = 0; i < value.length; i++) {
        result.append("%");
        char character = Character.toUpperCase(Character.forDigit((value[i] >> 4) & 0xF, 16));
        result.append(character);
        character = Character.toUpperCase(Character.forDigit(value[i] & 0xF, 16));
        result.append(character);
      }
      return result.toString();
    }
  }

  private String taskName;
  private byte[] payload;
  private HashMap<String, List<String>> headers;
  private Method method;
  private List<Param> params;
  private String url;
  private Long countdownMillis;
  private Long etaMillis;
  private RetryOptions retryOptions;
  private byte[] tag;

  private TaskOptions() {
    this.method = Method.POST;
    this.headers = new LinkedHashMap<String, List<String>>();
    this.params = new LinkedList<Param>();
  }

  /**
   * A copy constructor for {@link TaskOptions}.
   */
  public TaskOptions(TaskOptions options) {
    taskName = options.taskName;
    method = options.method;
    url = options.url;
    countdownMillis = options.countdownMillis;
    etaMillis = options.etaMillis;
    tag = options.tag;
    if (options.retryOptions != null) {
      retryOptions = new RetryOptions(options.retryOptions);
    } else {
      retryOptions = null;
    }
    if (options.getPayload() != null) {
      payload(options.getPayload());
    } else {
      payload = null;
    }
    initializeHeaders(options.getHeaders());
    initializeParams(options.getParams());
  }

  private void initializeHeaders(Map<String, List<String>> headers) {
    this.headers = new LinkedHashMap<String, List<String>>();

    for (Map.Entry<String, List<String>> entry : headers.entrySet()) {
      this.headers.put(entry.getKey(), new ArrayList<String>(entry.getValue()));
    }
  }

  private void initializeParams(List<Param> params) {
    this.params = new LinkedList<Param>(params);
  }

  Method getMethod() {
    return method;
  }

  /**
   * Sets the task name.
   *
   * @throws IllegalArgumentException The provided name is null, empty or doesn't match the regular
   *         expression {@link QueueConstants#TASK_NAME_REGEX}
   */
  public TaskOptions taskName(String taskName) {
    if (taskName != null && taskName.length() != 0) {
      TaskHandle.validateTaskName(taskName);
    }
    this.taskName = taskName;
    return this;
  }

  String getTaskName() {
    return taskName;
  }

  byte[] getPayload() {
    return payload;
  }

  /**
   * Sets the payload directly without specifying the content-type.  If this
   * task is added to a push queue, the content-type will be set to
   * 'application/octet-stream' by default.
   * @param payload The bytes representing the paylaod.
   * @return TaskOptions object for chaining.
   */
  public TaskOptions payload(byte[] payload) {
    this.payload = payload.clone();
    return this;
  }

  /**
   * Sets the payload to the serialized form of the deferredTask object.
   * The payload will be generated by serializing the deferredTask object using
   * {@link ObjectOutputStream#writeObject(Object)}. If the deferredTask's
   * {@link Method} is not PULL, the content type will be set to
   * {@link DeferredTaskContext#RUNNABLE_TASK_CONTENT_TYPE}, the method
   * will be forced to {@link Method#POST} and if otherwise not specified, the
   * url will be set to {@link DeferredTaskContext#DEFAULT_DEFERRED_URL}; the
   * {@link DeferredTask} servlet is, by default, mapped to this url.
   *
   * <p>Note: While this may be a convenient API, it requires careful control of the
   * serialization compatibility of objects passed into {@link #payload(DeferredTask)}
   * method as objects placed in the task queue will survive revision updates
   * of the application and hence may fail deserialization when the task is decoded
   * with new revisions of the application. In particular, Java anonymous classes
   * are convenient but may be particularly difficult to control or test for
   * serialization compatibility.
   *
   * @param deferredTask The object to serialize into the payload.
   * @throws DeferredTaskCreationException if there was an IOException serializing object.
   */
  public TaskOptions payload(DeferredTask deferredTask) {
    ByteArrayOutputStream stream = new ByteArrayOutputStream(1024);
    ObjectOutputStream objectStream = null;
    try {
      objectStream = new ObjectOutputStream(stream);
      objectStream.writeObject(deferredTask);
    } catch (IOException e) {
      throw new DeferredTaskCreationException(e);
    }
    payload = stream.toByteArray();
    if (getMethod() != Method.PULL) {
      header("content-type", DeferredTaskContext.RUNNABLE_TASK_CONTENT_TYPE);
      method(Method.POST);
      if (getUrl() == null) {
        url(DeferredTaskContext.DEFAULT_DEFERRED_URL);
      }
    }
    return this;
  }

  /**
   * Sets the payload from a {@link String} given a specific character set.
   * @throws UnsupportedTranslationException
   */
  public TaskOptions payload(String payload, String charset) {
    try {
      return payload(payload.getBytes(charset), "text/plain; charset=" + charset);
    } catch (UnsupportedEncodingException exception) {
      throw new UnsupportedTranslationException(
          "Unsupported charset '" + charset + "' requested.", exception);
    }
  }

  /**
   * Set the payload with the given content type.
   * @param payload The bytes representing the paylaod.
   * @param contentType The content-type of the bytes.
   * @return TaskOptions object for chaining.
   */
  public TaskOptions payload(byte[] payload, String contentType) {
    return payload(payload).
           header("content-type", contentType);
  }

  /**
   * Set the payload by {@link String}.  The charset to convert the
   * String to will be UTF-8 unless the method is PULL, in which case the
   * String's bytes will be used directly.
   * @param payload  The String to be used.
   * @return TaskOptions object for chaining.
   */
  public TaskOptions payload(String payload) {
    if (getMethod() == Method.PULL) {
      return payload(payload.getBytes());
    }
    return payload(payload, "UTF-8");
  }

  HashMap<String, List<String>> getHeaders() {
    return headers;
  }

  /**
   * Replaces the existing headers with the provided header {@code name/value} mapping.
   * @param headers  The headers to copy.
   * @return TaskOptions object for chaining.
   */
  public TaskOptions headers(Map<String, String> headers) {
    this.headers = new LinkedHashMap<String, List<String>>();

    for (Map.Entry<String, String> entry : headers.entrySet()) {
      List<String> values = new ArrayList<String>(1);
      values.add(entry.getValue());
      this.headers.put(entry.getKey(), values);
    }
    return this;
  }

  /**
   * Adds a header {@code name/value} pair.
   *
   * @throws IllegalArgumentException
   */
  public TaskOptions header(String headerName, String value) {
    if (headerName == null || headerName.length() == 0) {
      throw new IllegalArgumentException("headerName must not be null or empty.");
    }
    if (value == null) {
      throw new IllegalArgumentException("header(name, <null>) is not allowed.");
    }

    if (!headers.containsKey(headerName)) {
      headers.put(headerName, new ArrayList<String>());
    }
    headers.get(headerName).add(value);
    return this;
  }

  /**
   * Remove all headers with the given name.
   */
  public TaskOptions removeHeader(String headerName) {
    if (headerName == null || headerName.length() == 0) {
      throw new IllegalArgumentException("headerName must not be null or empty.");
    }
    headers.remove(headerName);
    return this;
  }

  /**
   * Set the method used for this task. Defaults to {@link Method#POST}.
   */
  public TaskOptions method(Method method) {
    this.method = method;
    return this;
  }

  List<Param> getParams() {
    return params;
  }

  TaskOptions param(Param param) {
    params.add(param);
    return this;
  }

  /**
   * Clears the parameters.
   */
  public TaskOptions clearParams() {
    params.clear();
    return this;
  }

  /**
   * Add a named {@link String} parameter.
   * @param name Name of the parameter.  Must not be null or empty.
   * @param value The value of the parameter will undergo a "UTF-8"
   *   character encoding transformation upon being added to the queue.
   *   {@code value} must not be {@code null}.
   * @throws IllegalArgumentException
   */
  public TaskOptions param(String name, String value) {
    return param(new StringValueParam(name, value));
  }

  /**
   * Add a named {@code byte} array parameter.
   * @param name Name of the parameter.  Must not be null or empty.
   * @param value A byte array and encoded as-is
   *    (i.e. without character encoding transformations).
   *    {@code value} must not be {@code null}.
   * @throws IllegalArgumentException
   */
  public TaskOptions param(String name, byte[] value) {
    return param(new ByteArrayValueParam(name, value));
  }

  /**
   * Remove all parameters with the given name.
   * @param paramName Name of the parameter.  Must not be null or empty.
   */
  public TaskOptions removeParam(String paramName) {
    if (paramName == null || paramName.length() == 0) {
      throw new IllegalArgumentException("paramName must not be null or empty.");
    }

    Iterator<Param> paramsIter = params.iterator();
    while (paramsIter.hasNext()) {
      if (paramsIter.next().name == paramName) {
        paramsIter.remove();
      }
    }

    return this;
  }

  public String getUrl() {
    return url;
  }

  /**
   * Set the URL.
   * <p>Default value is {@code null}.
   * @param url String containing URL.
   */
  public TaskOptions url(String url) {
    if (url == null) {
      throw new IllegalArgumentException("null url is not allowed.");
    }
    this.url = url;
    return this;
  }

  /**
   * Delay to apply to the submitted time.  May be {@code null}.
   */
  Long getCountdownMillis() {
    return countdownMillis;
  }

  /**
   * Set the number of milliseconds delay before execution of the task.
   */
  public TaskOptions countdownMillis(long countdownMillis) {
    this.countdownMillis = countdownMillis;
    return this;
  }

  /**
   * Returns the specified ETA for a task.  May be {@code null} if not specified.
   */
  public Long getEtaMillis() {
    return etaMillis;
  }

  /**
   * Sets the approximate absolute time to execute.  (i.e. etaMillis is comparable with
   * {@link System#currentTimeMillis()}).
   */
  public TaskOptions etaMillis(long etaMillis) {
    this.etaMillis = etaMillis;
    return this;
  }

  /**
   * Returns the retry options for a task. May be {@code null} if not specified.
   */
  RetryOptions getRetryOptions() {
    return retryOptions;
  }

  /**
   * Sets retry options for this task. Retry Options must be built with
   * {@code RetryOptions.Builder}.
   */
  public TaskOptions retryOptions(RetryOptions retryOptions) {
    this.retryOptions = retryOptions;
    return this;
  }

  /**
   * Returns the tag for a task. May be {@code null} if tag is not specified.
   */
  public byte[] getTagAsBytes() {
    return tag;
  }

  /**
   * Returns the tag for a task. May be {@code null} if tag is not specified.
   * @throws UnsupportedEncodingException
   */
  public String getTag() throws UnsupportedEncodingException {
    if (tag != null) {
      return new String(tag, "UTF-8");
    }
    return null;
  }

  /**
   * Sets the tag for a task.  Ignores null or zero-length tags.
   */
  public TaskOptions tag(byte[] tag) {
    if (tag != null && tag.length > 0) {
      this.tag = tag.clone();
    } else {
      this.tag = null;
    }
    return this;
  }

  /**
   * Sets the tag for a task. Ignores null or empty tags.
   */
  public TaskOptions tag(String tag) {
    if (tag != null) {
      return tag(tag.getBytes());
    }
    return this;
  }

  @Override
  public int hashCode() {
    final int prime = 31;
    int result = 1;
    result = prime * result + ((countdownMillis == null) ? 0 : countdownMillis.hashCode());
    result = prime * result + ((etaMillis == null) ? 0 : etaMillis.hashCode());
    result = prime * result + ((headers == null) ? 0 : headers.hashCode());
    result = prime * result + ((method == null) ? 0 : method.hashCode());
    result = prime * result + ((params == null) ? 0 : params.hashCode());
    result = prime * result + Arrays.hashCode(payload);
    result = prime * result + ((taskName == null) ? 0 : taskName.hashCode());
    result = prime * result + ((url == null) ? 0 : url.hashCode());
    result = prime * result + ((retryOptions == null) ? 0 : retryOptions.hashCode());
    result = prime * result + Arrays.hashCode(tag);
    return result;
  }

  @Override
  public boolean equals(Object obj) {
    if (this == obj) {
      return true;
    }
    if (obj == null) {
      return false;
    }
    if (getClass() != obj.getClass()) {
      return false;
    }
    TaskOptions other = (TaskOptions) obj;
    if (countdownMillis == null) {
      if (other.countdownMillis != null) {
        return false;
      }
    } else if (!countdownMillis.equals(other.countdownMillis)) {
      return false;
    }
    if (etaMillis == null) {
      if (other.etaMillis != null) {
        return false;
      }
    } else if (!etaMillis.equals(other.etaMillis)) {
      return false;
    }
    if (headers == null) {
      if (other.headers != null) {
        return false;
      }
    } else if (!headers.equals(other.headers)) {
      return false;
    }
    if (method == null) {
      if (other.method != null) {
        return false;
      }
    } else if (!method.equals(other.method)) {
      return false;
    }
    if (params == null) {
      if (other.params != null) {
        return false;
      }
    } else if (!params.equals(other.params)) {
      return false;
    }
    if (!Arrays.equals(payload, other.payload)) {
      return false;
    }
    if (taskName == null) {
      if (other.taskName != null) {
        return false;
      }
    } else if (!taskName.equals(other.taskName)) {
      return false;
    }
    if (url == null) {
      if (other.url != null) {
        return false;
      }
    } else if (!url.equals(other.url)) {
      return false;
    }
    if (retryOptions == null) {
      if (other.retryOptions != null) {
        return false;
      }
    } else if (!retryOptions.equals(other.retryOptions)) {
      return false;
    }
    if (!Arrays.equals(tag, other.tag)) {
      return false;
    }
    return true;
  }

  @Override
  public String toString() {
    String tagString = null;
    try {
      tagString = getTag();
    } catch (UnsupportedEncodingException e) {
      tagString = "not a utf-8 String";
    }
    return "TaskOptions[taskName=" + taskName + ", headers=" + headers
        + ", method=" + method + ", params=" + params + ", url=" + url
        + ", countdownMillis=" + countdownMillis + ", etaMillis=" + etaMillis
        + ", retryOptions=" + retryOptions + ", tag=" + tagString + "]";
  }

  /**
   * Provides static creation methods for {@link TaskOptions}.
   */
  public static final class Builder {
    /**
     * Returns default {@link TaskOptions} and calls {@link TaskOptions#taskName(String)}.
     */
    public static TaskOptions withTaskName(String taskName) {
      return withDefaults().taskName(taskName);
    }

    /**
     * Returns default {@link TaskOptions} and calls {@link TaskOptions#payload(byte[])}.
     */
    static TaskOptions withPayload(byte[] payload) {
      return withDefaults().payload(payload);
    }

    /**
     * Returns default {@link TaskOptions} and calls {@link TaskOptions#payload(String, String)}.
     */
    public static TaskOptions withPayload(String payload, String charset) {
      return withDefaults().payload(payload, charset);
    }

    /**
     * Returns default {@link TaskOptions} and calls {@link TaskOptions#payload(DeferredTask)}.
     */
    public static TaskOptions withPayload(DeferredTask deferredTask) {
      return withDefaults().payload(deferredTask);
    }

    /**
     * Returns default {@link TaskOptions} and calls {@link TaskOptions#payload(byte[], String)}.
     */
    public static TaskOptions withPayload(byte[] payload, String contentType) {
      return withDefaults().payload(payload, contentType);
    }

    /**
     * Returns default {@link TaskOptions} and calls {@link TaskOptions#payload(String)}.
     */
    public static TaskOptions withPayload(String payload) {
      return withDefaults().payload(payload);
    }

    /**
     * Returns default {@link TaskOptions} and calls {@link TaskOptions#headers(Map)}.
     */
    public static TaskOptions withHeaders(Map<String, String> headers) {
      return withDefaults().headers(headers);
    }

    /**
     * Returns default {@link TaskOptions} and calls {@link TaskOptions#header(String, String)}.
     */
    public static TaskOptions withHeader(String headerName, String value) {
      return withDefaults().header(headerName, value);
    }

    /**
     * Returns default {@link TaskOptions} and calls {@link TaskOptions#method(Method)}.
     */
    public static TaskOptions withMethod(Method method) {
      return withDefaults().method(method);
    }

    /**
     * Returns default {@link TaskOptions} and calls {@link TaskOptions#param(String, String)}.
     */
    public static TaskOptions withParam(String paramName, String value) {
      return withDefaults().param(paramName, value);
    }

    /**
     * Returns default {@link TaskOptions} and calls {@link TaskOptions#param(String, byte[])}.
     */
    public static TaskOptions withParam(String paramName, byte[] value) {
      return withDefaults().param(paramName, value);
    }

    /**
     * Returns default {@link TaskOptions} and calls {@link TaskOptions#url(String)}.
     */
    public static TaskOptions withUrl(String url) {
      return withDefaults().url(url);
    }

    /**
     * Returns default {@link TaskOptions} and calls {@link TaskOptions#countdownMillis(long)}.
     */
    public static TaskOptions withCountdownMillis(long countdownMillis) {
      return withDefaults().countdownMillis(countdownMillis);
    }

    /**
     * Returns default {@link TaskOptions} and calls {@link TaskOptions#etaMillis(long)}.
     */
    public static TaskOptions withEtaMillis(long etaMillis) {
      return withDefaults().etaMillis(etaMillis);
    }

    /**
     * Returns default {@link TaskOptions} and calls
     * {@link TaskOptions#retryOptions(RetryOptions)}.
     */
    public static TaskOptions withRetryOptions(RetryOptions retryOptions) {
      return withDefaults().retryOptions(retryOptions);
    }

    /**
     * Returns default {@link TaskOptions} and calls {@link TaskOptions#tag(byte[])}.
     */
    public static TaskOptions withTag(byte[] tag) {
      return withDefaults().tag(tag);
    }

    /**
     * Returns default {@link TaskOptions} and calls {@link TaskOptions#tag(String)}.
     */
    public static TaskOptions withTag(String tag) {
      return withDefaults().tag(tag);
    }

    /**
     * Returns default {@link TaskOptions} with default values.
     */
    public static TaskOptions withDefaults() {
      return new TaskOptions();
    }

    private Builder() {
    }
  }

}

// Copyright 2011 Google Inc. All Rights Reserved.

package com.google.appengine.api.log;

import com.google.appengine.api.log.LogService.LogLevel;
import com.google.common.base.Pair;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Allows users to customize the behavior of {@link LogService#fetch(LogQuery)}.
 * <p>
 * {@code startTime} is the earliest request completion or last-update time
 * that results should be fetched for, in seconds since the Unix epoch. If
 * {@code null} then no requests will be excluded for ending too long ago.
 * <p>
 * {@code endTime} is the latest request completion or last-update time that
 * results should be fetched for, in seconds since the Unix epoch. If
 * {@code null} then no requests will be excluded for ending too recently.
 * <p>
 * {@code offset} is a cursor into the log stream retrieved from a previously
 * emitted {@link RequestLogs#getOffset}. This iterator will begin returning
 * logs immediately after the record from which the offset came. If
 * {@code null}, the query will begin at {@code startTime}.
 * <p>
 * {@code minLogLevel} is a {@link LogService.LogLevel} which serves as a
 * filter on the requests returned. Requests with no application logs at or
 * above the specified level will be omitted. Works even if
 * {@code includeAppLogs} is not True.
 * <p>
 * {@code includeIncomplete} selects whether requests that have started but not
 * yet finished should be included in the query. Defaults to False.
 * <p>
 * {@code includeAppLogs} specifies whether or not to include application logs
 * in the query results. Defaults to False.
 * <p>
 * {@code majorVersionIds} specifies which the version(s) of the application
 * for which logs should be retrieved. If {@code null}, logs for the version
 * making the request will be returned.
 * <p>
 * {@code serverVersions} specifies which the server version(s) of the
 * application for which logs should be retrieved. If {@code null}, logs for
 * the version making the request will be returned.
 * <p>
 * {@code requestIds}, if not {@code null}, indicates that instead of a
 * time-based scan, logs for the specified requests should be returned.
 * See the Request IDs section of <a
 * href="https://developers.google.com/appengine/docs/java/runtime#The_Environment}">
 * the Java Servlet Environment documentation</a> for how to retrieve these IDs
 * at runtime. Malformed request IDs will cause an exception, while
 * unrecognized request IDs be ignored. This option may not be combined with
 * any filtering options such as startTime, endTime, offset, or minLogLevel.
 * majorVersionIds and serverVersions is ignored. IDs that do not correspond to
 * a request log will be ignored. Logs will be returned in the order requested.
 * <p>
 * {@code batchSize} specifies the internal batching strategy of the returned
 * {@link java.lang.Iterable Iterable&lt;RequestLogs&gt;}. Has no impact on the
 * result of the query.
 * <p>
 * Notes on usage:<br>
 * The recommended way to instantiate a {@code LogQuery} object is to
 * statically import {@link Builder}.* and invoke a static
 * creation method followed by an instance mutator (if needed):
 *
 * <pre>
 * import static com.google.appengine.api.log.LogQuery.Builder.*;
 *
 * ...
 *
 * // All requests, including application logs.
 * iter = logService.fetch(withIncludeAppLogs(true));
 *
 * // All requests ending in the past day (or still running) with an info log or higher.
 * Calendar cal = Calendar.getInstance();
 * cal.add(Calendar.DAY_OF_MONTH, -1);
 * iter = logService.fetch(withEndTimeMillis(cal.time())
 *     .includeIncomplete(true).minimumLogLevel(LogService.INFO));
 * </pre>
 *
 */
public final class LogQuery implements Cloneable, Serializable {
  private static final long serialVersionUID = 3660093076203855168L;

  private String offset;

  private Long startTimeUsec;

  private Long endTimeUsec;

  private int batchSize = LogService.DEFAULT_ITEMS_PER_FETCH;

  private LogLevel minLogLevel;
  private boolean includeIncomplete = false;
  private boolean includeAppLogs = false;
  private List<String> majorVersionIds = new ArrayList<String>();
  private List<Pair<String, String>> serverVersions = new ArrayList<Pair<String, String>>();
  private List<String> requestIds = new ArrayList<String>();

  private static final String MAJOR_VERSION_ID_REGEX = "[a-z\\d][a-z\\d\\-]{0,99}";
  private static final Pattern VERSION_PATTERN = Pattern.compile(MAJOR_VERSION_ID_REGEX);
  private static final String REQUEST_ID_REGEX = "\\A\\p{XDigit}+\\z";
  private static final Pattern REQUEST_ID_PATTERN = Pattern.compile(REQUEST_ID_REGEX);

  /**
   * Contains static creation methods for {@link LogQuery}.
   */
  public static final class Builder {
    /**
     * Create a {@link LogQuery} with the given offset.
     * Shorthand for <code>LogQuery.Builder.withDefaults().offset(offset);</code>.
     * Please read the {@link LogQuery} class javadoc for an explanation of
     * how offsets are used.
     * @param offset the offset to use.
     * @return The newly created LogQuery instance.
     */
    public static LogQuery withOffset(String offset) {
      return withDefaults().offset(offset);
    }

    /**
     * Create a {@link LogQuery} with the given start time.
     * Shorthand for <code>LogQuery.Builder.withDefaults().startTimeMillis(startTimeMillis);</code>.
     * Please read the {@link LogQuery} class javadoc for an explanation of
     * how start time is used.
     * @param startTimeMillis the start time to use, in milliseconds.
     * @return The newly created LogQuery instance.
     */
    public static LogQuery withStartTimeMillis(long startTimeMillis) {
      return withDefaults().startTimeMillis(startTimeMillis);
    }

    /**
     * Create a {@link LogQuery} with the given start time.
     * Shorthand for <code>LogQuery.Builder.withDefaults().startTimeUsec(startTimeUsec);</code>.
     * Please read the {@link LogQuery} class javadoc for an explanation of
     * how start time is used.
     * @param startTimeUsec the start time to use, in microseconds.
     * @return The newly created LogQuery instance.
     */
    public static LogQuery withStartTimeUsec(long startTimeUsec) {
      return withDefaults().startTimeUsec(startTimeUsec);
    }

    /**
     * Create a {@link LogQuery} with the given end time.
     * Shorthand for <code>LogQuery.Builder.withDefaults().endTimeMillis(startTimeMillis);</code>.
     * Please read the {@link LogQuery} class javadoc for an explanation of
     * how end time is used.
     * @param endTimeMillis the start time to use, in milliseconds.
     * @return The newly created LogQuery instance.
     */
    public static LogQuery withEndTimeMillis(long endTimeMillis) {
      return withDefaults().endTimeMillis(endTimeMillis);
    }

    /**
     * Create a {@link LogQuery} with the given end time.
     * Shorthand for <code>LogQuery.Builder.withDefaults().endTimeUsec(endTimeUsec);</code>.
     * Please read the {@link LogQuery} class javadoc for an explanation of
     * how end time is used.
     * @param endTimeUsec the start time to use, in microseconds.
     * @return The newly created LogQuery instance.
     */
    public static LogQuery withEndTimeUsec(long endTimeUsec) {
      return withDefaults().endTimeUsec(endTimeUsec);
    }

    /**
     * Create a {@link LogQuery} with the given batch size.
     * Shorthand for <code>LogQuery.Builder.withDefaults().batchSize(batchSize);</code>.
     * Please read the {@link LogQuery} class javadoc for an explanation of
     * how batch size is used.
     * @param batchSize the batch size to set.
     * @return The newly created LogQuery instance.
     */
    public static LogQuery withBatchSize(int batchSize) {
      return withDefaults().batchSize(batchSize);
    }

    /**
     * Create a {@link LogQuery} with the given minimum log level.
     * Shorthand for <code>LogQuery.Builder.withDefaults().minLogLevel(minLogLevel);</code>.
     * Please read the {@link LogQuery} class javadoc for an explanation of
     * how minimum log level is used.
     * @param minLogLevel the minimum log level to set.
     * @return The newly created LogQuery instance.
     */
    public static LogQuery withMinLogLevel(LogLevel minLogLevel) {
      return withDefaults().minLogLevel(minLogLevel);
    }

    /**
     * Create a {@link LogQuery} with the given include incomplete setting.
     * Shorthand for
     * <code>LogQuery.Builder.withDefaults().includeIncomplete(includeIncomplete);</code>.
     * Please read the {@link LogQuery} class javadoc for an explanation of
     * how include incomplete is used.
     * @param includeIncomplete the inclusion value to set.
     * @return The newly created LogQuery instance.
     */
    public static LogQuery withIncludeIncomplete(boolean includeIncomplete) {
      return withDefaults().includeIncomplete(includeIncomplete);
    }

    /**
     * Create a {@link LogQuery} with include application logs set.
     * Shorthand for <code>LogQuery.Builder.withDefaults().includeAppLogs(includeAppLogs);</code>.
     * Please read the {@link LogQuery} class javadoc for an explanation of
     * the include application logs setting.
     * @param includeAppLogs the inclusion value to set.
     * @return The newly created LogQuery instance.
     */
    public static LogQuery withIncludeAppLogs(boolean includeAppLogs) {
      return withDefaults().includeAppLogs(includeAppLogs);
    }

    /**
     * Create a {@link LogQuery} with the given major version IDs.
     * Shorthand for <code>LogQuery.Builder.withDefaults().majorVersionIds(versionIds);</code>.
     * Please read the {@link LogQuery} class javadoc for an explanation of
     * how the list of major version ids is used.
     * @param versionIds the major version id list to set.
     * @return The newly created LogQuery instance.
     */
    public static LogQuery withMajorVersionIds(List<String> versionIds) {
      return withDefaults().majorVersionIds(versionIds);
    }

    /**
     * Create a {@link LogQuery} with the given server and version IDs.
     * Shorthand for <code>LogQuery.Builder.withDefaults().serverVersions(serverVersionIds);</code>.
     * Please read the {@link LogQuery} class javadoc for an explanation of
     * how the list of servers and versions is used.
     * @param serverVersionIds the server version id list to set.
     * @return The newly created LogQuery instance.
     */
    public static LogQuery withServerVersions(List<Pair<String, String>> serverVersionIds) {
      return withDefaults().serverVersions(serverVersionIds);
    }

    /**
     * Create a {@link LogQuery} with the given request IDs.
     * Shorthand for <code>LogQuery.Builder.withDefaults().requestIds(requestIds);</code>.
     * See the {@link LogQuery} class javadoc for an explanation of
     * how the list of request ids is used.
     * @param requestIds the request id list to set.
     * @return The newly created LogQuery instance.
     * @since App Engine 1.7.4.
     */
    public static LogQuery withRequestIds(List<String> requestIds) {
      return withDefaults().requestIds(requestIds);
    }

    /**
     * Helper method for creating a {@link LogQuery} instance with
     * default values. Please read the {@link LogQuery} class javadoc for an
     * explanation of the defaults.
     */
    public static LogQuery withDefaults() {
      return new LogQuery();
    }
  }

  /**
   * Makes a copy of a provided LogQuery.
   *
   * @return A new LogQuery whose fields are copied from the given LogQuery.
   */
  @Override
  public LogQuery clone() {
    LogQuery clone;
    try {
      clone = (LogQuery) super.clone();
    } catch (CloneNotSupportedException e) {
      throw new RuntimeException(e);
    }

    clone.majorVersionIds = new ArrayList<String>(majorVersionIds);
    clone.serverVersions = new ArrayList<Pair<String, String>>(serverVersions);
    clone.requestIds = new ArrayList<String>(requestIds);
    return clone;
  }

  /**
   * Sets the offset.  Please read the class javadoc for an explanation of
   * how offset is used.
   * @param offset The offset to set.
   * @return {@code this} (for chaining)
   */
  public LogQuery offset(String offset) {
    this.offset = offset;
    return this;
  }

  /**
   * Sets the start time to a value in milliseconds.  Please read the class
   * javadoc for an explanation of how start time is used.
   * @param startTimeMillis The start time to set, in milliseconds.
   * @return {@code this} (for chaining)
   */
  public LogQuery startTimeMillis(long startTimeMillis) {
    this.startTimeUsec = startTimeMillis * 1000;
    return this;
  }

  /**
   * Sets the start time to a value in microseconds.  Please read the class
   * javadoc for an explanation of how start time is used.
   * @param startTimeUsec The start time to set, in microseconds.
   * @return {@code this} (for chaining)
   */
  public LogQuery startTimeUsec(long startTimeUsec) {
    this.startTimeUsec = startTimeUsec;
    return this;
  }

  /**
   * Sets the end time to a value in milliseconds.  Please read the class
   * javadoc for an explanation of how end time is used.
   * @param endTimeMillis The end time to set, in milliseconds.
   * @return {@code this} (for chaining)
   */
  public LogQuery endTimeMillis(long endTimeMillis) {
    this.endTimeUsec = endTimeMillis * 1000;
    return this;
  }

  /**
   * Sets the end time to a value in microseconds.  Please read the class
   * javadoc for an explanation of how end time is used.
   * @param endTimeUsec The end time to set, in microseconds.
   * @return {@code this} (for chaining)
   */
  public LogQuery endTimeUsec(long endTimeUsec) {
    this.endTimeUsec = endTimeUsec;
    return this;
  }

  /**
   * Sets the batch size.  Please read the class javadoc for an explanation of
   * how batch size is used.
   * @param batchSize The batch size to set.  Must be greater than 0.
   * @return {@code this} (for chaining)
   */
  public LogQuery batchSize(int batchSize) {
    if (batchSize < 1) {
      throw new IllegalArgumentException("batchSize must be greater than zero");
    }

    this.batchSize = batchSize;
    return this;
  }

  /**
   * Sets the minimum log level.  Please read the class javadoc for an
   * explanation of how minimum log level is used.
   * @param minLogLevel The minimum log level to set.
   * @return {@code this} (for chaining)
   */
  public LogQuery minLogLevel(LogLevel minLogLevel) {
    this.minLogLevel = minLogLevel;
    return this;
  }

  /**
   * Sets include incomplete.  Please read the class javadoc for an
   * explanation of how include incomplete is used.
   * @param includeIncomplete The value to set.
   * @return {@code this} (for chaining)
   */
  public LogQuery includeIncomplete(boolean includeIncomplete) {
    this.includeIncomplete = includeIncomplete;
    return this;
  }

  /**
   * Sets include application logs.  Please read the class javadoc for an
   * explanation of how include application logs is used.
   * @param includeAppLogs The value to set.
   * @return {@code this} (for chaining)
   */
  public LogQuery includeAppLogs(boolean includeAppLogs) {
    this.includeAppLogs = includeAppLogs;
    return this;
  }

  /**
   * Sets the major version identifiers to query.  Please read the class
   * javadoc for an explanation of how major versions are used.
   * @param versionIds The major version identifier list to set.
   * @return {@code this} (for chaining)
   */
  public LogQuery majorVersionIds(List<String> versionIds) {
    if (!this.serverVersions.isEmpty()) {
      throw new IllegalArgumentException(
          "The serverVersions() method has already been called, only one of majorVersionIds() " +
          "or serverVersions() may be called on a LogQuery instance.");
    }
    for (String versionId : versionIds) {
      Matcher matcher = VERSION_PATTERN.matcher(versionId);
      if (!matcher.matches()) {
        throw new IllegalArgumentException("versionIds must only contain valid " +
          "major version identifiers. Version " + versionId + " is not a valid " +
          "major version identifier.");
      }
    }

    this.majorVersionIds = versionIds;
    return this;
  }

  /**
   * Sets the server and version identifiers to query.  Please read the class
   * javadoc for an explanation of how Servers and Versions are used.
   * @param serverVersions The list of Servers and Versions to set.
   * @return {@code this} (for chaining)
   */
  public LogQuery serverVersions(List<Pair<String, String>> serverVersions) {
    if (!this.majorVersionIds.isEmpty()) {
      throw new IllegalArgumentException(
          "The majorVersionIds() method has already been called, only one of majorVersionIds() " +
          "or serverVersions() may be called on a LogQuery instance.");
    }
    for (Pair<String, String> serverVersion : serverVersions) {
      Matcher matcher = VERSION_PATTERN.matcher(serverVersion.first);
      if (!matcher.matches()) {
        throw new IllegalArgumentException("serverVersions must only contain valid " +
          "server identifiers. Server " + serverVersion.first + " is not a valid " +
          "server identifier.");
      }
      matcher = VERSION_PATTERN.matcher(serverVersion.second);
      if (!matcher.matches()) {
        throw new IllegalArgumentException("serverVersions must only contain valid " +
          "version identifiers. Version " + serverVersion.second + " is not a valid " +
          "version identifier.");
      }
    }

    this.serverVersions = serverVersions;
    return this;
  }

  /**
   * Sets the list of request ids to query.  See the class javadoc for an
   * explanation of how request ids are used.
   * @param requestIds The request id list to set.
   * @return {@code this} (for chaining)
   */
  public LogQuery requestIds(List<String> requestIds) {
    Set<String> seen = new HashSet<String>();
    for (String requestId : requestIds) {
      if (!seen.add(requestId)) {
        throw new IllegalArgumentException("requestIds must be unique.");
      }

      Matcher matcher = REQUEST_ID_PATTERN.matcher(requestId);
      if (!matcher.matches()) {
        throw new IllegalArgumentException("requestIds must only contain valid " +
          "request ids. " + requestId + " is not a valid " +
          "request id.");
      }
    }

    this.requestIds = requestIds;
    return this;
  }

  /**
   * @return The offset, or {@code null} if none was provided.
   */
  public String getOffset() {
    return offset;
  }

  /**
   * @return The batch size, or {@code null} if none was provided.
   */
  public Integer getBatchSize() {
    return batchSize;
  }

  /**
   * @return The end time in milliseconds, or {@code null} if none was provided.
   */
  public Long getEndTimeMillis() {
    return endTimeUsec != null ? endTimeUsec / 1000 : null;
  }

  /**
   * @return The end time in microseconds, or {@code null} if none was provided.
   */
  public Long getEndTimeUsec() {
    return endTimeUsec;
  }

  /**
   * @return Whether or not application logs should be returned.
   */
  public Boolean getIncludeAppLogs() {
    return includeAppLogs;
  }

  /**
   * @return Whether or not incomplete request logs should be returned.
   */
  public Boolean getIncludeIncomplete() {
    return includeIncomplete;
  }

  /**
   * @return The minimum log level, or {@code null} if none was provided.
   */
  public LogLevel getMinLogLevel() {
    return minLogLevel;
  }

  /**
   * @return The start time in milliseconds, or {@code null} if none was provided.
   */
  public Long getStartTimeMillis() {
    return startTimeUsec != null ? startTimeUsec / 1000 : null;
  }

  /**
   * @return The start time in microseconds, or {@code null} if none was provided.
   */
  public Long getStartTimeUsec() {
    return startTimeUsec;
  }

  /**
   * @return The list of major app versions that should be queried over, or
   * an empty list if none were set.
   */
  public List<String> getMajorVersionIds() {
    return majorVersionIds;
  }

  /**
   * @return The list of server versions for the application that should be
   * queried over, or an empty list if none were set.
   */
  public List<Pair<String, String>> getServerVersions() {
    return serverVersions;
  }

  /**
   * @return The list of request ids that should be queried over, or
   * {@code null} if none were set.
   */
  public List<String> getRequestIds() {
    return requestIds;
  }
}

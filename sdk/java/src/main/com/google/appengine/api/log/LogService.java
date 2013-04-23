// Copyright 2011 Google Inc. All Rights Reserved.

package com.google.appengine.api.log;

/**
 * {@code LogService} allows callers to request the logs for an application
 * using supplied filters. Logs are returned in an {@code Iterable} that yields
 * {@link RequestLogs}, which contain request-level information and optionally
 * {@link AppLogLine} objects containing the application logs from the request.
 *
 */
public interface LogService {
  /**
   * The number of items that each underlying RPC call will retrieve by default.
   */
  int DEFAULT_ITEMS_PER_FETCH = 20;

  enum LogLevel {
    DEBUG,
    INFO,
    WARN,
    ERROR,
    FATAL,
  }

  /**
   * Retrieve logs for the current application with the constraints provided
   * by the user as parameters to this function. Acts synchronously.
   *
   * @param query A LogQuery object that contains the various query parameters
   * that should be used in the LogReadRequest.
   * @return An Iterable that contains a set of logs matching the
   * requested filters.
   */
  Iterable<RequestLogs> fetch(LogQuery query);
}

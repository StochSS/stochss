// Copyright 2011 Google Inc. All Rights Reserved.

package com.google.appengine.api.log;

import static com.google.common.io.BaseEncoding.base64;

import com.google.apphosting.api.logservice.LogServicePb.LogOffset;
import com.google.apphosting.api.logservice.LogServicePb.LogReadResponse;
import com.google.apphosting.api.logservice.LogServicePb.RequestLog;
import com.google.common.collect.AbstractIterator;
import com.google.common.util.Base64;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Iterator;
import java.util.List;

/**
 * An object that is the result of performing a LogService.fetch() operation.
 * LogQueryResults contain the logs from the user's query. Users of this service
 * should use the {@link LogQueryResult#iterator} provided by this class to
 * retrieve their results.
 *
 */
public final class LogQueryResult implements Iterable<RequestLogs> {
  private final List<RequestLogs> logs;
  private final String cursor;
  private final LogQuery query;

  protected LogQueryResult(LogReadResponse response, LogQuery originalQuery) {
    logs = new ArrayList<RequestLogs>();
    for (RequestLog log : response.logs()) {
      String offset = base64().encode(log.getOffset().toByteArray());
      logs.add(new RequestLogs(log, offset));
    }

    if (response.hasOffset()) {
      cursor = base64().encode(response.getOffset().toByteArray());
    } else {
      cursor = null;
    }

    query = originalQuery.clone();
  }

  /**
   * Returns a LogOffset parsed from the submitted String, which is assumed to
   * be a Base64-encoded offset produced by this class.
   *
   * @return A String to parse as a Base64-encoded LogOffset protocol buffer.
   */
  protected static LogOffset parseOffset(String offset) {
    LogOffset logOffset = new LogOffset();
    try {
      logOffset.parseFrom(Base64.decode(offset));
    } catch (IllegalArgumentException e) {
      throw new IllegalArgumentException("Can not parse provided offset.");
    }
    return logOffset;
  }

  /**
   * Returns the list of logs internally kept by this class. The main user of
   * this method is iterator, who needs it to give the user logs as needed.
   *
   * @return A List of RequestLogs acquired from a fetch() request.
   */
  private List<RequestLogs> getLogs() {
    return Collections.unmodifiableList(logs);
  }

  /**
   * Returns the String version of the database cursor, which can be used to
   * tell subsequent fetch() requests where to start scanning from. The main
   * user of this method is iterator, who uses it to ensure that users get all
   * the logs they requested.
   *
   * @return A String representing the next location in the database to read
   *   from.
   */
  private String getCursor() {
    return cursor;
  }

  /**
   * Returns an Iterator that will yield all of the logs the user has requested.
   * If the user has asked for more logs than a single request can accommodate
   * (which is LogService.MAX_ITEMS_PER_FETCH), then this iterator grabs
   * the first batch and returns them until they are exhausted. Once they are
   * exhausted, a fetch() call is made to get more logs and the process is
   * repeated until either all of the logs have been read or the user has
   * stopped asking for more logs.
   *
   * @return An iterator that provides RequestLogs to the caller.
   */
  @Override
  public Iterator<RequestLogs> iterator() {
    return new AbstractIterator<RequestLogs>() {
      List<RequestLogs> iterLogs = logs;
      String iterCursor = cursor;
      int index = 0;
      int lengthLogs = iterLogs.size();

      @Override
      protected RequestLogs computeNext() {
        while (index >= lengthLogs) {
          if (iterCursor == null) {
            return endOfData();
          }

          query.offset(iterCursor);

          LogQueryResult nextResults = new LogServiceImpl().fetch(query);
          iterLogs = nextResults.getLogs();
          iterCursor = nextResults.getCursor();
          lengthLogs = iterLogs.size();
          index = 0;
        }

        return iterLogs.get(index++);
      }
    };
  }
}

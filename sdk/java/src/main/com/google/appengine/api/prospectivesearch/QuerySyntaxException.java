// Copyright 2011 Google Inc. All Rights Reserved.
package com.google.appengine.api.prospectivesearch;

/**
 * Indicates an error in the query syntax.  See the package
 * documentation for the full query syntax specification.
 *
 */
public class QuerySyntaxException extends RuntimeException {

  final String subId;
  final String topic;
  final String query;

  public QuerySyntaxException(String subId, String topic, String query, String msg) {
    super(msg);
    this.subId = subId;
    this.topic = topic;
    this.query = query;
  }

  public String getSubId() {
    return subId;
  }

  public String getTopic() {
    return topic;
  }

  public String getQuery() {
    return query;
  }
}

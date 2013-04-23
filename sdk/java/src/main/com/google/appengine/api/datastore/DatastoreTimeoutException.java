// Copyright 2008 Google Inc. All Rights Reserved.
package com.google.appengine.api.datastore;

/**
 * {@code DatastoreTimeoutException} is thrown when a datastore operation
 * times out.  This can happen when you attempt to put, get, or delete
 * too many entities or an entity with too many properties, or if the
 * datastore is overloaded or having trouble.
 *
 */
public class DatastoreTimeoutException extends RuntimeException {
  public DatastoreTimeoutException(String message) {
    super(message);
  }
}
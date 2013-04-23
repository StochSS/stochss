package com.google.appengine.api.labs.servers;

/**
 * Exception thrown when the given server name is invalid.
 *
 */
public class InvalidServerException extends ServersException {

  InvalidServerException(String detail) {
    super(detail);
  }
}

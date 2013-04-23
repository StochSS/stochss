package com.google.appengine.api.labs.servers;

/**
 * Exception thrown when the given server version name is invalid.
 *
 */
public class InvalidVersionException extends ServersException {

  InvalidVersionException(String detail) {
    super(detail);
  }
}

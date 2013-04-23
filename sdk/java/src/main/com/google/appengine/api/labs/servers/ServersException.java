package com.google.appengine.api.labs.servers;

/**
 * Exception thrown by the {@link ServersService}.
 *
 */
public class ServersException extends RuntimeException {

  ServersException(String detail) {
    super(detail);
  }
}

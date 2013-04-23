package com.google.appengine.api.labs.servers;

/**
 * Thrown when an application tries to stop a server that is already stopped.
 *
 * @see ServersService#stopServer
 */
public class ServerAlreadyStoppedException extends ServersException {

  ServerAlreadyStoppedException(String detail) {
    super(detail);
  }
}

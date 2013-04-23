package com.google.appengine.tools.development;

import javax.annotation.concurrent.GuardedBy;

/**
 * Holder for the state of a server or backend instance.
 */
public class InstanceStateHolder {
  static enum InstanceState {
    INITIALIZING, SLEEPING, RUNNING_START_REQUEST, RUNNING, STOPPED, SHUTDOWN;
  }
  private final String serverOrBackendName;
  private final int instance;
  @GuardedBy("this")
  private InstanceState currentState = InstanceState.SHUTDOWN;

  /**
   * Constructs an {@link InstanceStateHolder}.
   *
   * @param serverOrBackendName For server instances the server name and for backend instances the
   *     backend name.
   * @param instance The instance number or -1 for load balancing servers and automatic servers.
   */
  InstanceStateHolder(String serverOrBackendName, int instance) {
    this.serverOrBackendName = serverOrBackendName;
    this.instance = instance;
  }

  /**
   * Updates the current server state and verifies that the previous state is
   * what is expected.
   *
   * @param newState The new state to change to
   * @param acceptablePreviousStates Acceptable previous states
   * @throws IllegalStateException If the current state is not one of the
   *         acceptable previous states
   */
  synchronized void testAndSet(InstanceState newState,
      InstanceState... acceptablePreviousStates) throws IllegalStateException {
    if (test(acceptablePreviousStates)) {
      currentState = newState;
      return;
    }
    StringBuilder error = new StringBuilder();
    error.append("Tried to change state to " + newState);
    error.append(" on server " + serverOrBackendName + "." + instance);
    error.append(" but previous state is not ");
    for (int i = 0; i < acceptablePreviousStates.length; i++) {
      error.append(acceptablePreviousStates[i].name() + " | ");
    }
    throw new IllegalStateException(error.toString());
  }

  /**
   * Returns true if current state is one of the provided acceptable states.
   */
  synchronized boolean test(InstanceState... acceptableStates) {
    for (InstanceState acceptable : acceptableStates) {
      if (currentState == acceptable) {
        return true;
      }
    }
    return false;
  }

  /**
   * Checks if the server is in a state where it can accept incoming requests.
   *
   * @return true if the server can accept incoming requests, false otherwise.
   */
  synchronized boolean acceptsConnections() {
    return (currentState == InstanceState.RUNNING
        || currentState == InstanceState.RUNNING_START_REQUEST
        || currentState == InstanceState.SLEEPING);
  }

  /**
   * Returns the display name for the current state.
   */
  synchronized String getDisplayName() {
    return currentState.name().toLowerCase();
  }

  /**
   * Unconditionally sets the state.
   */
  synchronized void set(InstanceState newState) {
    currentState = newState;
  }
}

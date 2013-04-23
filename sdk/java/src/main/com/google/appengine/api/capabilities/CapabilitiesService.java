package com.google.appengine.api.capabilities;

/**
 * Allows applications to identify API outages and scheduled downtime.
 *
 */
public interface CapabilitiesService {

  /**
   * Returns the status of a capability.
   *
   * @param capability a capability to check status for.
   * @return the status of a capability.
   */
  CapabilityState getStatus(Capability capability);

}

package com.google.appengine.api.capabilities;

import java.util.Date;

/**
 * Represents the state of a {@link Capability}.
 *
 * <p>
 * The state of a capability is valid at a particular point in time.
 *
 * If a particular capability is enabled at time T, there is no guarantee as to
 * if it will be available at time T+1. When a maintenance period is scheduled,
 * there will be usually advance notice as to when the capability is disabled.
 *
 *
 */

public class CapabilityState {

  private final Capability capability;
  private final CapabilityStatus status;
  private final Date scheduledDate;

  CapabilityState(Capability capability, CapabilityStatus status, long timeUntilScheduled) {
    this.capability = capability;
    this.status = status;
    if (timeUntilScheduled >= 0) {
      this.scheduledDate = new Date(System.currentTimeMillis() + 1000 * timeUntilScheduled);
    } else {
      scheduledDate = null;
    }
  }

  /**
   * Returns the capability associated with this {@link CapabilityState}.
   *
   * @return the capability associated with this {@link CapabilityState}.
   */
  public Capability getCapability() {
    return capability;
  }

  /**
   * Returns the status of the capability.
   *
   * @return the status of the capability.
   */
  public CapabilityStatus getStatus() {
    return status;
  }

  /**
   * Returns the schedule date of maintenance for this activity.
   *
   * This call will return a {@link Date} instance if and only if the status is
   * SCHEDULED_MAINTENANCE.
   *
   * @return the schedule maintenance date for this activity or
   *         <code>null</code> if no maintenance is planned.
   */
  public Date getScheduledDate() {
    return scheduledDate;
  }

}

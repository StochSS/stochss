// Copyright 2010 Google Inc. All Rights Reserved.

package com.google.appengine.api.datastore;

/**
 * Policy for reads.
 *
 */
public final class ReadPolicy {

  /**
   * Setting the {@code Consistency} for reads allows you to decide whether
   * freshness or availability is more important.
   */
  public enum Consistency {

    /**
     * Selects freshness over availability.  Strongly consistent reads are
     * guaranteed to return the most up-to-date data but will timeout more
     * often than eventually consistent reads.
     */
    STRONG,

    /**
     * Selects availability over freshness.  Eventually consistent reads will
     * timeout less often than Strong reads but will occasionally return
     * stale results.
     */
    EVENTUAL
  }

  private final Consistency consistency;

  public ReadPolicy(Consistency consistency) {
    if (consistency == null) {
      throw new NullPointerException("consistency must not be null");
    }
    this.consistency = consistency;
  }

  public Consistency getConsistency() {
    return consistency;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }

    ReadPolicy that = (ReadPolicy) o;

    if (consistency != that.consistency) {
      return false;
    }

    return true;
  }

  @Override
  public int hashCode() {
    return consistency.hashCode();
  }
}

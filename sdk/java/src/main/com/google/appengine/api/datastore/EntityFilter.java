// Copyright 2010 Google Inc. All Rights Reserved.

package com.google.appengine.api.datastore;

/**
 * An interface for pruning results from a query.
 *
 */
interface EntityFilter {
  /**
   * Returns true if the result should be in the final result set
   */
  boolean apply(Entity entity);
}

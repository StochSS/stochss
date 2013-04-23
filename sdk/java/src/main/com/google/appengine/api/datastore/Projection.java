// Copyright 2012 Google Inc. All Rights Reserved.

package com.google.appengine.api.datastore;

import java.io.Serializable;
import java.util.Map;

/**
 * A query projection.
 *
 * @see Query#getProjections()
 */
public abstract class Projection implements Serializable {

  Projection() {}

  /**
   * Returns the name of the property this projection populates.
   */
  public abstract String getName();

  /**
   * Returns the name of the original datastore property.
   */
  abstract String getPropertyName();

  /**
   * Generates the projection value from the given entity values.
   */
  abstract Object getValue(Map<String, Object> values);
}

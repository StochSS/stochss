// Copyright 2009 Google Inc. All Rights Reserved.

package com.google.apphosting.api;

/**
 * Represents automatic statistics collected by the ApiProxy. If present, this
 * object will be stored under the KEY-variable in an Environment's property.
 * This object is basically a pojo, a simple container for collected values.
 *
 */
public abstract class ApiStats {

  /**
   * The name that this object is stored in.
   */
  private static final String KEY = ApiStats.class.getName();

  /**
   * For a given environment, return the corresponding ApiStats object. If the
   * environment does not have an ApiStats object, null will be returned.
   */
  public static ApiStats get(ApiProxy.Environment env) {
    return (ApiStats) env.getAttributes().get(KEY);
  }

  /**
   * @return the overall time spent in API cycles, as returned by the system.
   *     Unit is megacycles.
   */
  public abstract long getApiTimeInMegaCycles();

  /**
   * @return the overall time spent in CPU processing. Unit is megacycles.
   */
  public abstract long getCpuTimeInMegaCycles();

  /**
   * Creates a new ApiStats object and binds it to a given Environment.
   * @param env the Environment object to bind this object to.
   * @exception IllegalStateException if an object is already bound
   */
  protected ApiStats(ApiProxy.Environment env){
    bind(env);
  }

  /**
   * Binds this object to a particular environment. This step enables the
   * stats object to access and make available request-specific statistics that
   * would usually not be accessible.
   * @param env the Environment object to bind this object to.
   * @exception IllegalStateException if an object is already bound
   */
  private void bind(ApiProxy.Environment env) {
    ApiStats original = get(env);
    if (original != null) {

      if (original != this) {
        throw new IllegalStateException(
            "Cannot replace existing ApiStats object");
      } else {

      }
    } else {
      env.getAttributes().put(KEY, this);
    }
  }

}

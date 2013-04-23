// Copyright 2012 Google Inc. All Rights Reserved.

package com.google.appengine.api.search.checkers;

import com.google.apphosting.api.AppEngineInternal;
import com.google.apphosting.api.search.DocumentPb;

/**
 * Provides checks for {@link com.google.appengine.api.search.GeoPoint}.
 *
 */
@AppEngineInternal
public class GeoPointChecker {

  public GeoPointChecker() {
  }

  /**
   * Checks whether a {@link GoePoint} latitude is valid. The value must be between
   * -90.0 and 90.0 degrees.
   *
   * @param latitude the latitude to check
   * @return the checked latitude
   * @throws IllegalArgumentException if the latitude is out of range
   */
  public static double checkLatitude(double latitude) {
    Preconditions.checkArgument(
        SearchApiLimits.MAXIMUM_NEGATIVE_LATITUDE <= latitude &&
        latitude <= SearchApiLimits.MAXIMUM_POSITIVE_LATITUDE,
        "latitude %f must be between %f and %f", latitude,
        SearchApiLimits.MAXIMUM_NEGATIVE_LATITUDE,
        SearchApiLimits.MAXIMUM_POSITIVE_LATITUDE);
    return latitude;
  }

  /**
   * Checks whether a {@link GoePoint} longitude is valid. The value must be between
   * -180.0 and 180.0 degrees.
   *
   * @param longitude the longitude to check
   * @return the checked longitude
   * @throws IllegalArgumentException if the longitude is out of range
   */
  public static double checkLongitude(double longitude) {
    Preconditions.checkArgument(
        SearchApiLimits.MAXIMUM_NEGATIVE_LONGITUDE <= longitude &&
        longitude <= SearchApiLimits.MAXIMUM_POSITIVE_LONGITUDE,
        "longitude %f must be between %f and %f", longitude,
        SearchApiLimits.MAXIMUM_NEGATIVE_LONGITUDE,
        SearchApiLimits.MAXIMUM_POSITIVE_LONGITUDE);
    return longitude;
  }

  public static DocumentPb.FieldValue.Geo checkValid(DocumentPb.FieldValue.Geo geoPb) {
    checkLatitude(geoPb.getLat());
    checkLongitude(geoPb.getLng());
    return geoPb;
  }
}

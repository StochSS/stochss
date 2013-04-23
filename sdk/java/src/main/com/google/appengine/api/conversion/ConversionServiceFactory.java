// Copyright 2011 Google Inc. All Rights Reserved.

package com.google.appengine.api.conversion;

/**
 * Static factory methods to create new instance of {@link ConversionService}.
 *
 */
public final class ConversionServiceFactory {

  private ConversionServiceFactory() {}

  /**
   * Returns a default {@link ConversionService} instance.
   */
  public static ConversionService getConversionService() {
    return new ConversionServiceImpl();
  }

  /**
   * Returns a {@link ConversionService} instance with deadline setting.
   *
   * @param deadlineSecs the maximum duration, in seconds, that the conversion
   *        request can run
   */
  public static ConversionService getConversionService(double deadlineSecs) {
    return new ConversionServiceImpl(deadlineSecs);
  }
}

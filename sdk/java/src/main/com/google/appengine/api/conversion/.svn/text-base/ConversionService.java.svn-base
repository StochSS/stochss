// Copyright 2011 Google Inc. All Rights Reserved.

package com.google.appengine.api.conversion;

import java.util.List;
import java.util.concurrent.Future;

/**
 * A service which provides document conversion feature for applications.
 *
 *
 * @deprecated This API will be decommissioned in November 2012 and all calls
 * to it will return an error.
 */
@Deprecated
public interface ConversionService {
  /** Maximum bytes size of one conversion to be converted. */
  public static final int CONVERSION_MAX_SIZE_BYTES = 2 * 1024 * 1024;

  /** Maximum number of conversions allowed in one request. */
  public static final int CONVERSION_MAX_NUM_PER_REQUEST = 10;

  /**
   * Runs a conversion.
   *
   * @param conversion the Conversion instance to run
   * @return the ConversionResult instance
   * @throws ConversionServiceException if the conversion fails with the reason
   *         specified in {@link ConversionErrorCode}
   * @throws IllegalArgumentException if the input conversion is invalid
   */
  public ConversionResult convert(Conversion conversion);

  /**
   * Executes multiple conversions in one request to the conversion backend.
   *
   * @param conversions a collection of Conversion instances to run
   * @return a collection of ConversionResult instances, one per Conversion
   *         in the same order
   * @throws ConversionServiceException if the conversion fails with the reason
   *         specified in {@link ConversionErrorCode}
   * @throws IllegalArgumentException if the input conversions are invalid
   */
  public List<ConversionResult> convert(List<Conversion> conversions);

  /**
   * Runs a conversion asynchronously.
   *
   * @param conversion the Conversion instance to run
   * @return a future containing the ConversionResult instance;
   *         {@link Future#get} may throw {@link ConversionServiceException} if
   *         the conversion fails with the reason specified in
   *         {@link ConversionErrorCode}
   * @throws IllegalArgumentException if the input conversion is invalid
   */
  public Future<ConversionResult> convertAsync(Conversion conversion);

  /**
   * Executes multiple conversions in one request to the conversion backend
   * asynchronously.
   *
   * @param conversions a collection of Conversion instances to run
   * @return a future containing a collection of ConversionResult instances,
   *         one per Conversion in the same order; {@link Future#get} may throw
   *         {@link ConversionServiceException} if the conversion fails with
   *         the reason specified in {@link ConversionErrorCode}
   * @throws IllegalArgumentException if the input conversions are invalid
   */
  public Future<List<ConversionResult>> convertAsync(List<Conversion> conversions);
}

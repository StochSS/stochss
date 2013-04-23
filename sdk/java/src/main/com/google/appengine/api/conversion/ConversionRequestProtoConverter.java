// Copyright 2011 Google Inc. All Rights Reserved.

package com.google.appengine.api.conversion;

import com.google.appengine.api.conversion.ConversionServicePb.ConversionInput;
import com.google.appengine.api.conversion.ConversionServicePb.ConversionRequest;
import com.google.common.base.Converter;
import com.google.common.base.Preconditions;
import com.google.common.collect.Lists;

import java.util.List;

/**
 * A reversible converter between a list of {@link Conversion} and its
 * corresponding protocol buffer.
 *
 */
class ConversionRequestProtoConverter extends Converter<List<Conversion>, ConversionRequest> {

  private final ConversionProtoConverter conversionProtoConverter = new ConversionProtoConverter();

  /**
   * Converts a list of {@link Conversion} to its corresponding protocol buffer.
   *
   * @throws IllegalArgumentException if the number of conversions is zero or
   *         over limit
   */
  @Override
  public ConversionRequest doForward(List<Conversion> conversions) {
    Preconditions.checkArgument(conversions.size() > 0,
        "At least one conversion is required in the request");
    Preconditions.checkArgument(
        conversions.size() <= ConversionService.CONVERSION_MAX_NUM_PER_REQUEST,
        String.format("At most %d conversions are allowed in one request.",
            ConversionService.CONVERSION_MAX_NUM_PER_REQUEST));

    ConversionRequest.Builder request = ConversionRequest.newBuilder();
    for (Conversion conversion : conversions) {
      request.addConversion(conversionProtoConverter.convert(conversion));
    }
    return request.build();
  }

  @Override
  public List<Conversion> doBackward(ConversionRequest requestPb) {
    List<Conversion> conversions = Lists.newArrayList();
    for (ConversionInput conversion : requestPb.getConversionList()) {
      conversions.add(conversionProtoConverter.reverse(conversion));
    }
    return conversions;
  }
}

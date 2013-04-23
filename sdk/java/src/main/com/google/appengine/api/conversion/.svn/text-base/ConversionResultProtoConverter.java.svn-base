// Copyright 2011 Google Inc. All Rights Reserved.

package com.google.appengine.api.conversion;

import com.google.appengine.api.conversion.ConversionServicePb.ConversionOutput;
import com.google.appengine.api.conversion.ConversionServicePb.ConversionServiceError.ErrorCode;
import com.google.common.base.Converter;

/**
 * A reversible converter between {@link ConversionResult} and its
 * corresponding protocol buffer.
 *
 */
class ConversionResultProtoConverter extends Converter<ConversionResult, ConversionOutput> {

  private final DocumentProtoConverter documentProtoConverter = new DocumentProtoConverter();

  @Override
  public ConversionOutput doForward(ConversionResult result) {
    if (result.success()) {
      return ConversionOutput.newBuilder()
          .setErrorCode(ErrorCode.OK)
          .setOutput(documentProtoConverter.convert(result.getOutputDoc()))
          .build();
    } else {
      return ConversionOutput.newBuilder()
          .setErrorCode(ConversionErrorCode.enumToProto(result.getErrorCode()))
          .build();
    }
  }

  @Override
  public ConversionResult doBackward(ConversionOutput resultPb) {
    if (resultPb.getErrorCode() == ErrorCode.OK) {
      return new ConversionResult(documentProtoConverter.reverse(resultPb.getOutput()));
    } else {
      return new ConversionResult(
          ConversionErrorCode.intToEnum(resultPb.getErrorCode().getNumber()));
    }
  }
}

// Copyright 2011 Google Inc. All Rights Reserved.

package com.google.appengine.api.conversion;

import com.google.appengine.api.conversion.ConversionServicePb.ConversionServiceError.ErrorCode;
import com.google.common.collect.ImmutableMap;

import java.util.logging.Logger;

/**
 * The error code of Conversion service.
 *
 */
public enum ConversionErrorCode {
  /** Communication to backend service timed-out. */
  TIMEOUT,

  /** Transient error while accessing the backend, please try again later. */
  TRANSIENT_ERROR,

  /** Something wrong in the backend that can't be sent back to application. */
  INTERNAL_ERROR,

  /** Unsupported conversion attempted. */
  UNSUPPORTED_CONVERSION,

  /** Conversion too large. */
  CONVERSION_TOO_LARGE,

  /** Too many conversions in one request. */
  TOO_MANY_CONVERSIONS,

  /** Request not formed properly. */
  INVALID_REQUEST;

  static final ImmutableMap<Integer, ConversionErrorCode> INT_ENUM_MAP =
      new ImmutableMap.Builder<Integer, ConversionErrorCode>()
          .put(ErrorCode.TIMEOUT_VALUE, TIMEOUT)
          .put(ErrorCode.TRANSIENT_ERROR_VALUE, TRANSIENT_ERROR)
          .put(ErrorCode.INTERNAL_ERROR_VALUE, INTERNAL_ERROR)
          .put(ErrorCode.UNSUPPORTED_CONVERSION_VALUE, UNSUPPORTED_CONVERSION)
          .put(ErrorCode.CONVERSION_TOO_LARGE_VALUE, CONVERSION_TOO_LARGE)
          .put(ErrorCode.TOO_MANY_CONVERSIONS_VALUE, TOO_MANY_CONVERSIONS)
          .put(ErrorCode.INVALID_REQUEST_VALUE, INVALID_REQUEST)
          .build();

  static final ImmutableMap<ConversionErrorCode, ErrorCode> ENUM_PROTO_MAP =
    new ImmutableMap.Builder<ConversionErrorCode, ErrorCode>()
        .put(TIMEOUT, ErrorCode.TIMEOUT)
        .put(TRANSIENT_ERROR, ErrorCode.TRANSIENT_ERROR)
        .put(INTERNAL_ERROR, ErrorCode.INTERNAL_ERROR)
        .put(UNSUPPORTED_CONVERSION, ErrorCode.UNSUPPORTED_CONVERSION)
        .put(CONVERSION_TOO_LARGE, ErrorCode.CONVERSION_TOO_LARGE)
        .put(TOO_MANY_CONVERSIONS, ErrorCode.TOO_MANY_CONVERSIONS)
        .put(INVALID_REQUEST, ErrorCode.INVALID_REQUEST)
        .build();

  private static final Logger logger = Logger.getLogger(
      ConversionErrorCode.class.getName());

  /**
   * Maps from integer type error code to enum type error code.
   *
   * @param number the integer type error code
   * @return the enum type error code
   */
  static ConversionErrorCode intToEnum(int number) {
    ConversionErrorCode code = INT_ENUM_MAP.get(number);
    if (code == null) {
      logger.warning(String.format("Error code %d is undefined.", number));
      return INTERNAL_ERROR;
    }
    return code;
  }

  /**
   * Maps from enum type error code to protocol buffer error code.
   *
   * @param errorCode the enum type error code
   * @return the protocol buffer error code
   */
  static ErrorCode enumToProto(ConversionErrorCode errorCode) {
    return ENUM_PROTO_MAP.get(errorCode);
  }
}

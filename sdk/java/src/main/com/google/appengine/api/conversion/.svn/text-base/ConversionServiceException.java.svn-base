// Copyright 2011 Google Inc. All Rights Reserved.

package com.google.appengine.api.conversion;

/**
 * Customized exception for all conversion service errors.
 *
 */
public final class ConversionServiceException extends RuntimeException {

  private final ConversionErrorCode errorCode;

  /**
   * Constructs a new ConversionServiceException without an error message.
   *
   * @param errorCode conversion service error code
   */
  ConversionServiceException(ConversionErrorCode errorCode) {
    this(errorCode, "");
  }

  /**
   * Constructs a new ConversionServiceException with an error message.
   *
   * @param errorCode conversion service error code
   * @param errorDetail conversion service error detail
   */
  ConversionServiceException(
      ConversionErrorCode errorCode, String errorDetail) {
    super("ConversionError " + errorCode.toString() + ": " + errorDetail);
    this.errorCode = errorCode;
  }

  ConversionServiceException(ConversionErrorCode errorCode, Throwable cause) {
    super(cause);
    this.errorCode = errorCode;
  }

  /**
   * Returns the error code.
   */
  public ConversionErrorCode getErrorCode() {
    return errorCode;
  }
}

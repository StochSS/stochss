// Copyright 2011 Google Inc. All Rights Reserved.

package com.google.appengine.api.search;

import com.google.appengine.api.search.SearchServicePb.SearchServiceError.ErrorCode;

/**
 * Status code returned by various index operations.
 */
public enum StatusCode {
  /**
   * The last operation was successfully completed.
   */
  OK,

  /**
   * The last operation failed due to invalid, user specified parameters.
   */
  INVALID_REQUEST,

  /**
   * The last operation failed due to a transient backend error.
   */
  TRANSIENT_ERROR,

  /**
   * The last operation failed due to a internal backend error.
   */
  INTERNAL_ERROR,

  /**
   * The last operation failed due to user not having permission.
   */
  PERMISSION_DENIED_ERROR;

  /**
   * Provides a mapping from protocol buffer enum to user API enum.
   *
   * @param code the proto buffer enum
   * @return the corresponding user API enum
   */
  static StatusCode fromErrorCode(ErrorCode code) {
    switch (code) {
      case OK: return StatusCode.OK;
      case INVALID_REQUEST: return StatusCode.INVALID_REQUEST;
      case TRANSIENT_ERROR: return StatusCode.TRANSIENT_ERROR;
      case INTERNAL_ERROR: return StatusCode.INTERNAL_ERROR;
      case PERMISSION_DENIED: return StatusCode.PERMISSION_DENIED_ERROR;
    }
    throw new IllegalArgumentException("Failed to convert error code to status enum " + code);
  }
}

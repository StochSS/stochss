// Copyright 2011 Google Inc. All Rights Reserved.

package com.google.appengine.api.search;

import com.google.appengine.api.search.SearchServicePb.SearchServiceError.ErrorCode;
import com.google.apphosting.api.ApiProxy;

import java.io.Serializable;

/**
 * The result of an operation involving the search service.
 *
 */
public class OperationResult implements Serializable {
  private static final long serialVersionUID = 3608247775865189592L;

  private final StatusCode code;
  private final String message;

  public OperationResult(SearchServicePb.RequestStatus status) {
    this(status.getCode(), status.hasErrorDetail() ? status.getErrorDetail() : null);
  }

  /**
   * @param code the status code of the request extracted from proto buffers
   * @param errorDetail detailed error message or {@code null}
   */
  public OperationResult(ErrorCode code, String errorDetail) {
    this(StatusCode.fromErrorCode(code), errorDetail);
  }

  /**
   * @param code the status code of the request
   * @param errorDetail detailed error message or {@code null}
   */
  public OperationResult(StatusCode code, String errorDetail) {
    this.code = code;
    this.message = errorDetail;
  }

  /**
   * @return the status code
   */
  public StatusCode getCode() {
    return code;
  }

  /**
   * @return the detailed message or {@code null}
   */
  public String getMessage() {
    return message;
  }

  @Override
  public String toString() {
    if (message == null) {
      return code.name();
    }
    return code.name() + ": " + message;
  }

  @Override
  public boolean equals(Object object) {
    if (object == this) {
      return true;
    }
    if (!getClass().isAssignableFrom(object.getClass())) {
      return false;
    }
    OperationResult result = (OperationResult) object;
    boolean sameMessages = (message == null && result.message == null)
        || (message != null && message.equals(result.message));
    return code.equals(result.code) && sameMessages;
  }

  /**
   * Converts a {@Throwable} into an OperationResult if it is an
   * {@link ApiProxy.ApplicationException} with an error which is not OK. If
   * the error is not known, the OperationResult will default to INTERNAL_ERROR.
   */
  static OperationResult convertToOperationResult(Throwable cause) {
    if (cause instanceof ApiProxy.ApplicationException) {
      ApiProxy.ApplicationException exception = ((ApiProxy.ApplicationException) cause);
      int applicationError = exception.getApplicationError();
      if (applicationError != 0) {
        ErrorCode code = ErrorCode.valueOf(applicationError);
        if (code == null) {
          return new OperationResult(StatusCode.INTERNAL_ERROR, exception.getErrorDetail());
        } else {
          return new OperationResult(StatusCode.fromErrorCode(code), exception.getErrorDetail());
        }
      }
    }
    return null;
  }
}

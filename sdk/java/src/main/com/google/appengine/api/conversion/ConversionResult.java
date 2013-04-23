// Copyright 2011 Google Inc. All Rights Reserved.

package com.google.appengine.api.conversion;

import com.google.common.base.Objects;
import com.google.common.base.Preconditions;

/**
 * A single immutable conversion result returned by the conversion service.
 *
 */
public final class ConversionResult {
 private final ConversionErrorCode errorCode; private final Document output;

  /**
   * Constructs a conversion result when the conversion failed.
   *
   * @param errorCode the conversion error code
   */
  ConversionResult(ConversionErrorCode errorCode) {
    this.errorCode = Preconditions.checkNotNull(errorCode);
    this.output = null;
  }

  /**
   * Constructs a conversion result when the conversion succeeded.
   *
   * @param output the output document
   */
  ConversionResult(Document output) {
    this.errorCode = null;
    this.output = Preconditions.checkNotNull(output);
  }

  /**
   * Returns whether the conversion succeeded.
   */
  public boolean success() {
    return output != null;
  }

  /**
   * Returns the conversion error code, or null if the conversion succeeded.
   */
  public ConversionErrorCode getErrorCode() {
    return errorCode;
  }

  /**
   * Returns the conversion output document, or null if the conversion failed.
   */
  public Document getOutputDoc() {
    return output;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }

    ConversionResult other = (ConversionResult) o;
    return Objects.equal(errorCode, other.getErrorCode())
           && Objects.equal(output, other.getOutputDoc());
  }

  @Override
  public int hashCode() {
    return Objects.hashCode(errorCode, output);
  }
}

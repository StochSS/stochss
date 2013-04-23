// Copyright 2011 Google Inc. All Rights Reserved.

package com.google.appengine.api.conversion;

import com.google.common.base.Objects;
import com.google.common.base.Preconditions;

/**
 * A single immutable conversion from one file format to another.
 *
 */
public final class Conversion {

  private final Document input;
  private final String outputMimeType;
  private final ConversionOptions options;

  /**
   * Constructs a conversion with default options.
   *
   * @param input the input document
   * @param outputMimeType the output mime type
   * @throws IllegalArgumentException if the input document is invalid for
   *         conversion
   */
  public Conversion(Document input, String outputMimeType) {
    this(input, outputMimeType, ConversionOptions.Builder.withDefaults());
  }

  /**
   * Constructs a conversion with specified options.
   *
   * @param input the input document
   * @param outputMimeType the output mime type
   * @param options the conversion options setting
   */
  public Conversion(Document input, String outputMimeType, ConversionOptions options) {
    this.input = Preconditions.checkNotNull(input);
    this.outputMimeType = Preconditions.checkNotNull(outputMimeType).toLowerCase();
    this.options = Preconditions.checkNotNull(options);
  }

  /**
   * Returns the conversion input document.
   */
  public Document getInputDoc() {
    return input;
  }

  /**
   * Returns the conversion output mime type.
   */
  public String getOutputMimeType() {
    return outputMimeType;
  }

  /**
   * Returns the conversion options setting.
   */
  public ConversionOptions getOptions() {
    return options;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }

    Conversion other = (Conversion) o;
    return Objects.equal(input, other.getInputDoc())
           && Objects.equal(outputMimeType, other.getOutputMimeType())
           && Objects.equal(options, other.getOptions());
  }

  @Override
  public int hashCode() {
    return Objects.hashCode(input, outputMimeType, options);
  }
}

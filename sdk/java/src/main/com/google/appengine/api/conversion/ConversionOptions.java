// Copyright 2011 Google Inc. All Rights Reserved.

package com.google.appengine.api.conversion;

import com.google.common.base.Objects;
import com.google.common.base.Preconditions;
import com.google.common.base.StringUtil;

/**
 * The options for a conversion following builder pattern. This class also
 * defines default values for most options.
 *
 */
public final class ConversionOptions {

  private Integer imageWidth = 800;

  private Integer firstPage = 1;

  private Integer lastPage = -1;
   private String ocrInputLanguage;

  private ConversionOptions() {}

  /**
   * Sets the output image width in pixels. Only applies to
   * conversions that generate image files.
   *
   * @param imageWidth the output image width in pixels
   * @return this ConversionOptions instance for chaining
   * @throws IllegalArgumentException if imageWidth is not positive
   */
  public ConversionOptions imageWidth(int imageWidth) {
    Preconditions.checkArgument(imageWidth > 0, "image width must be > 0, got " + imageWidth);
    this.imageWidth = imageWidth;
    return this;
  }

  /**
   * Sets the number of the first page to generate. Only applies to
   * conversions that generate image files.
   *
   * @param firstPage the number of the first page to generate
   * @return this ConversionOptions instance for chaining
   * @throws IllegalArgumentException if firstPage is not positive
   */
  public ConversionOptions firstPage(int firstPage) {
    Preconditions.checkArgument(firstPage > 0, "first page must be > 0, got " + firstPage);
    this.firstPage = firstPage;
    return this;
  }

  /**
   * Sets the number of the last page to generate, defaults to the last page
   * of the document. Only applies to conversions that generate image files.
   *
   * @param lastPage the number of the last page to generate
   * @return this ConversionOptions instance for chaining
   * @throws IllegalArgumentException if lastPage is not positive
   */
  public ConversionOptions lastPage(int lastPage) {
    Preconditions.checkArgument(lastPage > 0, "last page must be > 0, got " + lastPage);
    this.lastPage = lastPage;
    return this;
  }

  /**
   * Sets the language code in BCP 47 format, used by OCR engine to search for
   * language-specific character set.
   *
   * @param ocrInputLanguage the language code used by OCR engine
   * @return this ConversionOptions instance for chaining
   * @throws IllegalArgumentException if ocrInputLanguage is null, empty or
   *         comprises only whitespace characters
   */
  public ConversionOptions ocrInputLanguage(String ocrInputLanguage) {
    Preconditions.checkArgument(!StringUtil.isEmptyOrWhitespace(ocrInputLanguage),
        "OCR input language should not be null, empty or comprises only whitespace characters");
    this.ocrInputLanguage = ocrInputLanguage.toLowerCase();
    return this;
  }

  /**
   * Returns the output image width in pixels.
   */
  Integer getImageWidth() {
    return imageWidth;
  }

  /**
   * Returns the number of the first page to generate.
   */
  Integer getFirstPage() {
    return firstPage;
  }

  /**
   * Returns the number of the last page to generate.
   */
  Integer getLastPage() {
    return lastPage;
  }

  /**
   * Returns the language code used by OCR engine, or null if not present.
   */
  String getOcrInputLanguage() {
    return ocrInputLanguage;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }

    ConversionOptions other = (ConversionOptions) o;
    return Objects.equal(imageWidth, other.getImageWidth())
           && Objects.equal(firstPage, other.getFirstPage())
           && Objects.equal(lastPage, other.getLastPage())
           && Objects.equal(ocrInputLanguage, other.getOcrInputLanguage());
  }

  @Override
  public int hashCode() {
    return Objects.hashCode(imageWidth, firstPage, lastPage, ocrInputLanguage);
  }

  /**
   * Provides static creation methods for {@link ConversionOptions}.
   */
  public static final class Builder {

    private Builder() {}

    /**
     * Returns a {@link ConversionOptions} with default values.
     */
    public static ConversionOptions withDefaults() {
      return new ConversionOptions();
    }

    /**
     * Returns a {@link ConversionOptions} with specified output image width.
     */
    public static ConversionOptions withImageWidth(int imageWidth) {
      return withDefaults().imageWidth(imageWidth);
    }

    /**
     * Returns a {@link ConversionOptions} with specified number of first page.
     */
    public static ConversionOptions withFirstPage(int firstPage) {
      return withDefaults().firstPage(firstPage);
    }

    /**
     * Returns a {@link ConversionOptions} with specified number of last page.
     */
    public static ConversionOptions withLastPage(int lastPage) {
      return withDefaults().lastPage(lastPage);
    }

    /**
     * Returns a {@link ConversionOptions} with specified language code for OCR.
     */
    public static ConversionOptions withOcrInputLanguage(String ocrInputLanguage) {
      return withDefaults().ocrInputLanguage(ocrInputLanguage);
    }
  }
}

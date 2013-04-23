// Copyright 2011 Google Inc. All Rights Reserved.

package com.google.appengine.api.conversion;

import com.google.appengine.api.conversion.ConversionServicePb.ConversionInput;
import com.google.common.base.Converter;
import com.google.common.base.Preconditions;
import com.google.common.base.StringUtil;

/**
 * A reversible converter between {@link Conversion} and its corresponding
 * protocol buffer.
 *
 */
class ConversionProtoConverter extends Converter<Conversion, ConversionInput> {

  private static final String IMAGE_WIDTH_FLAG = "imageWidth";
  private static final String FIRST_PAGE_FLAG = "firstPage";
  private static final String LAST_PAGE_FLAG = "lastPage";
  private static final String INPUT_LANGUAGE_FLAG = "input_language_hint";

  private final DocumentProtoConverter documentProtoConverter = new DocumentProtoConverter();

  /**
   * Converts a {@link Conversion} to its corresponding protocol buffer.
   *
   * @throws IllegalArgumentException if output mime type or additional asset
   *         name is null, empty or comprises only whitespace characters
   */
  @Override
  public ConversionInput doForward(Conversion conversion) {
    ConversionHelper.validateInputDoc(conversion.getInputDoc());
    Preconditions.checkArgument(!StringUtil.isEmptyOrWhitespace(conversion.getOutputMimeType()),
        "Output mime type should not be null, empty or comprises only whitespace characters");

    ConversionInput.Builder builder = ConversionInput.newBuilder();
    builder.setInput(documentProtoConverter.convert(conversion.getInputDoc()))
        .setOutputMimeType(conversion.getOutputMimeType());
    ConversionOptions options = conversion.getOptions();
    builder.addFlag(createAuxData(IMAGE_WIDTH_FLAG, Integer.toString(options.getImageWidth())));
    builder.addFlag(createAuxData(FIRST_PAGE_FLAG, Integer.toString(options.getFirstPage())));
    builder.addFlag(createAuxData(LAST_PAGE_FLAG, Integer.toString(options.getLastPage())));

    if (options.getOcrInputLanguage() != null) {
      builder.addFlag(createAuxData(INPUT_LANGUAGE_FLAG, options.getOcrInputLanguage()));
    }
    return builder.build();
  }

  @Override
  public Conversion doBackward(ConversionInput conversionPb) {
    return new Conversion(
        documentProtoConverter.reverse(conversionPb.getInput()), conversionPb.getOutputMimeType());
  }

  /**
   * Returns a converter-specific auxiliary flag with specified key and value.
   */
  private static ConversionInput.AuxData.Builder createAuxData(String key, String value) {
    return ConversionInput.AuxData.newBuilder()
        .setKey(key)
        .setValue(value);
  }
}

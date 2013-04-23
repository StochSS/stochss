// Copyright 2011 Google Inc. All Rights Reserved.

package com.google.appengine.api.conversion;

import com.google.common.base.Preconditions;
import com.google.common.base.StringUtil;

import java.util.List;

/**
 * Utility methods to validate data structures.
 *
 */
class ConversionHelper {

  private ConversionHelper() {
  }

  /**
    * Validates the size of document is not over limit, returns itself if the
    * validation passes.
    *
    * @throws IllegalArgumentException if the size of document is over limit
    */
  static Document validateDocumentSize(Document document) {
    Preconditions.checkNotNull(document);
    int size = 0;
    for (Asset asset : document.getAssets()) {
      size += asset.getData().length;
    }
    Preconditions.checkArgument(size <= ConversionService.CONVERSION_MAX_SIZE_BYTES,
        String.format("Each conversion should not be over %d bytes.",
            ConversionService.CONVERSION_MAX_SIZE_BYTES));
    return document;
  }

  /**
    * Validates the document can be used as input for a conversion, returns
    * itself if the validation passes.
    *
    * @throws IllegalArgumentException if additional asset name is null, empty
    *         or comprises only whitespace characters
    */
  static Document validateInputDoc(Document document) {
    Preconditions.checkNotNull(document);
    List<Asset> assets = document.getAssets();
    for (Asset asset : assets.subList(1, assets.size())) {
      Preconditions.checkArgument(!StringUtil.isEmptyOrWhitespace(asset.getName()),
          "Additional asset name should not be null, empty or comprises only whitespaces");
    }
    return document;
  }
}

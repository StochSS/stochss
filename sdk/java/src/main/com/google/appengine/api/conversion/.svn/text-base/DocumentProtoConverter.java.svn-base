// Copyright 2011 Google Inc. All Rights Reserved.

package com.google.appengine.api.conversion;

import com.google.appengine.api.conversion.ConversionServicePb.AssetInfo;
import com.google.appengine.api.conversion.ConversionServicePb.DocumentInfo;
import com.google.common.base.Converter;
import com.google.common.collect.Lists;

import java.util.List;

/**
 * A reversible converter between {@link Document} and its corresponding
 * protocol buffer.
 *
 */
class DocumentProtoConverter extends Converter<Document, DocumentInfo> {

  private final AssetProtoConverter assetProtoConverter = new AssetProtoConverter();

  /**
   * Converts a {@link Document} to its corresponding protocol buffer.
   *
   * @throws IllegalArgumentException if the size of document is over limit
   */
  @Override
  public DocumentInfo doForward(Document document) {
    ConversionHelper.validateDocumentSize(document);

    DocumentInfo.Builder documentInfo = DocumentInfo.newBuilder();
    for (Asset asset : document.getAssets()) {
      documentInfo.addAsset(assetProtoConverter.convert(asset));
    }
    return documentInfo.build();
  }

  @Override
  public Document doBackward(DocumentInfo documentPb) {
    List<Asset> assets = Lists.newArrayList();
    for (AssetInfo asset : documentPb.getAssetList()) {
      assets.add(assetProtoConverter.reverse(asset));
    }
    return new Document(assets);
  }
}

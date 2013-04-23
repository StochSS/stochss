// Copyright 2011 Google Inc. All Rights Reserved.

package com.google.appengine.api.conversion;

import com.google.appengine.api.conversion.ConversionServicePb.AssetInfo;
import com.google.common.base.Converter;
import com.google.common.base.Preconditions;
import com.google.common.base.StringUtil;
import com.google.protobuf.ByteString;

/**
 * A reversible converter between {@link Asset} and its corresponding protocol
 * buffer.
 *
 */
class AssetProtoConverter extends Converter<Asset, AssetInfo> {

  /**
   * Converts an {@link Asset} to its corresponding protocol buffer.
   *
   * @throws IllegalArgumentException if the asset mime type is null, empty or
   *         comprises only whitespace characters
   */
  @Override
  public AssetInfo doForward(Asset asset) {
    Preconditions.checkArgument(!StringUtil.isEmptyOrWhitespace(asset.getMimeType()),
        "Asset mime type should not be null, empty or comprises only whitespaces");

    return AssetInfo.newBuilder()
        .setMimeType(asset.getMimeType())
        .setData(ByteString.copyFrom(asset.getData()))
        .setName(asset.getName())
        .build();
  }

  @Override
  public Asset doBackward(AssetInfo assetPb) {
    return new Asset(assetPb.getMimeType(), assetPb.getData().toByteArray(), assetPb.getName());
  }
}

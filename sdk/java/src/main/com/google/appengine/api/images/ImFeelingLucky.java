// Copyright 2009 Google Inc. All Rights Reserved.

package com.google.appengine.api.images;

/**
 * A transform that will automatically adjust the contrast and color levels of
 * an image.
 *
 */
final class ImFeelingLucky extends Transform {

  private static final long serialVersionUID = 6107019337979049746L;

  /** {@inheritDoc} */
  @Override
  void apply(ImagesServicePb.ImagesTransformRequest.Builder request) {
    request.addTransform(ImagesServicePb.Transform.newBuilder().setAutolevels(true));
  }
}

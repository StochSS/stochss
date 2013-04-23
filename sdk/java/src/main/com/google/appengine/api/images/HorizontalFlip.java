// Copyright 2009 Google Inc. All Rights Reserved.

package com.google.appengine.api.images;

/**
 * A transform that will horizontally flip an image.
 *
 */
final class HorizontalFlip extends Transform {

  private static final long serialVersionUID = 356070490376417095L;

  /** {@inheritDoc} */
  @Override
  void apply(ImagesServicePb.ImagesTransformRequest.Builder request) {
    request.addTransform(ImagesServicePb.Transform.newBuilder().setHorizontalFlip(true));
  }
}

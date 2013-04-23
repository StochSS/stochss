// Copyright 2009 Google Inc. All Rights Reserved.

package com.google.appengine.api.images;

/**
 * A transform that will rotate an image by a multiple of 90 degrees.
 *
 */
final class Rotate extends Transform {

  private static final long serialVersionUID = -8585289244565451429L;

  private final int degrees;

  /**
   * Creates a Rotate transform that rotates an image by {@code degrees} degrees.
   * @param degrees number of degrees to rotate
   * @throws IllegalArgumentException If {@code degrees} is not divisible by 90
  */
  Rotate(int degrees) {
    if ((degrees % 90) != 0) {
      throw new IllegalArgumentException("degrees must be a multiple of 90");
    }
    this.degrees = ((degrees % 360) + 360) % 360;
  }

  /** {@inheritDoc} */
  @Override
  void apply(ImagesServicePb.ImagesTransformRequest.Builder request) {
    request.addTransform(ImagesServicePb.Transform.newBuilder().setRotate(degrees));
  }
}

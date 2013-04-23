// Copyright 2009 Google Inc. All Rights Reserved.

package com.google.appengine.api.images;

/**
 * A transform that will crop an image to fit within a given bounding box.
 *
 */
final class Crop extends Transform {

  private static final long serialVersionUID = -5386318194508610219L;

  private final float leftX;
  private final float topY;
  private final float rightX;
  private final float bottomY;

  /**
   * Creates a crop transform.
   * @param leftX X coordinate of the top left corner
   * @param topY Y coordinate of the top left corner
   * @param rightX X coordinate of the bottom right corner
   * @param bottomY Y coordinate of the bottom right corner
   * @throws IllegalArgumentException If any of the arguments are outside the
   * range 0.0 to 1.0 or if {@code leftX >= rightX} or {@code topY >= bottomY}.
   */
  Crop(float leftX, float topY, float rightX, float bottomY) {
    checkCropArgument(leftX);
    checkCropArgument(topY);
    checkCropArgument(rightX);
    checkCropArgument(bottomY);
    if (leftX >= rightX) {
      throw new IllegalArgumentException("leftX must be < rightX");
    }
    if (topY >= bottomY) {
      throw new IllegalArgumentException("topY must be < bottomY");
    }
    this.leftX = leftX;
    this.topY = topY;
    this.rightX = rightX;
    this.bottomY = bottomY;

  }

  /** {@inheritDoc} */
  @Override
  void apply(ImagesServicePb.ImagesTransformRequest.Builder request) {
    request.addTransform(
        ImagesServicePb.Transform.newBuilder()
        .setCropLeftX(leftX)
        .setCropTopY(topY)
        .setCropRightX(rightX)
        .setCropBottomY(bottomY));
  }

  /**
   * Checks that a crop argument is in the valid range.
   * @param arg crop argument
   */
  private void checkCropArgument(float arg) {
    if (arg < 0.0) {
      throw new IllegalArgumentException("Crop arguments must be >= 0");
    }
    if (arg > 1.0) {
      throw new IllegalArgumentException("Crop arguments must be <= 1");
    }
  }

}

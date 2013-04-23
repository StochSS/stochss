// Copyright 2009 Google Inc. All Rights Reserved.

package com.google.appengine.api.images;

/**
 * A transform that will vertically flip an image.
 *
 */
final class VerticalFlip extends Transform {

  private static final long serialVersionUID = 2860776499212609058L;

  /** {@inheritDoc} */
  @Override
  void apply(ImagesServicePb.ImagesTransformRequest.Builder request) {
    request.addTransform(ImagesServicePb.Transform.newBuilder().setVerticalFlip(true));
  }
}

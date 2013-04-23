// Copyright 2009 Google Inc. All Rights Reserved.

package com.google.appengine.api.images;

import java.util.Map;

/**
 * A {@code Composite} represents a composition of an image onto a canvas.
 *
 */
public abstract class Composite {

  /**
   * Valid anchoring positions for a compositing operation. The anchor
   * position of the image is aligned with the anchor position of the
   * canvas.
   */
  public static enum Anchor {TOP_LEFT, TOP_CENTER, TOP_RIGHT, CENTER_LEFT,
    CENTER_CENTER, CENTER_RIGHT, BOTTOM_LEFT, BOTTOM_CENTER, BOTTOM_RIGHT}

  /**
   * Adds this compositing operation to a Composite request.
   * @param request Request for this composite to be added to.
   * @param imageIndexMap Map of images and their indexes in the request.
   */
  abstract void apply(ImagesServicePb.ImagesCompositeRequest.Builder request,
             Map<Image, Integer> imageIndexMap);

}

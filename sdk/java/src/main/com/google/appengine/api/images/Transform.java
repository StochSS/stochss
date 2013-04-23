// Copyright 2009 Google Inc. All Rights Reserved.

package com.google.appengine.api.images;

/**
 * A transform that can be applied to an {@link Image}.
 *
 */
public abstract class Transform implements java.io.Serializable {

  private static final long serialVersionUID = -8951126706057535378L;

  /**
   * Adds this transform to the supplied {@code request}.
   * @param request request for the transform to be added to
   */
  abstract void apply(ImagesServicePb.ImagesTransformRequest.Builder request);

}

// Copyright 2009 Google Inc. All Rights Reserved.

package com.google.appengine.api.images;

import java.util.Collection;
import java.util.LinkedList;
import java.util.List;

/**
 * A transform that represents zero or more transforms executed in series.
 *
 */
public class CompositeTransform extends Transform {

  private static final long serialVersionUID = -7811378887181575342L;

  private final List<Transform> transforms;

  /**
   * Creates a new empty composite transform.
   */
  CompositeTransform() {
    transforms = new LinkedList<Transform>();
  }

  /**
   * Creates a new composite transform consisting of the provided collection of transforms in
   * series.
   * @param transformsToAdd transforms to be executed
   */
  CompositeTransform(Collection<Transform> transformsToAdd) {
    this();
    transforms.addAll(transformsToAdd);
  }

  /**
   * Concatenates a transform to the end of this composite transform.
   * @param other the transform to be appended
   * @return this transform with the other transform appended
   */
  public CompositeTransform concatenate(Transform other) {
    transforms.add(other);
    return this;
  }

  /**
   * Concatenates a transform to the start of this composite transform.
   * @param other the transform to be prepended
   * @return this transform with the other transform prepended
   */
  public CompositeTransform preConcatenate(Transform other) {
    transforms.add(0, other);
    return this;
  }

  /** {@inheritDoc} */
  @Override
  void apply(ImagesServicePb.ImagesTransformRequest.Builder request) {
    for (Transform transform : transforms) {
      transform.apply(request);
    }
  }

}

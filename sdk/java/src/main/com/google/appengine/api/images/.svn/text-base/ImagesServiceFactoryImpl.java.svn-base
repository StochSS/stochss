// Copyright 2012 Google Inc. All rights reserved.

package com.google.appengine.api.images;

import com.google.appengine.api.blobstore.BlobKey;
import com.google.appengine.api.blobstore.BlobstoreServiceFactory;

import java.util.Collection;

/**
 * Factory for creating an {@link ImagesService}, {@link Image}s and
 * {@link Transform}s.
 *
 */
final class ImagesServiceFactoryImpl implements IImagesServiceFactory {

  @Override
  public ImagesService getImagesService() {
    return new ImagesServiceImpl();
  }

  @Override
  public Image makeImage(byte[] imageData) {
    return new ImageImpl(imageData);
  }

  @Override
  public Image makeImageFromBlob(BlobKey blobKey) {
    return new ImageImpl(blobKey);
  }

  @Override
  public Image makeImageFromFilename(String filename) {
    BlobKey blobKey = BlobstoreServiceFactory.getBlobstoreService().createGsBlobKey(filename);
    return new ImageImpl(blobKey);
  }

  @Override
  public Transform makeResize(int width, int height) {
    return new Resize(width, height, false, 0.0f, 0.0f);
  }

  @Override
  public Transform makeResize(int width, int height, boolean allowStretch) {
    return new Resize(width, height, allowStretch);
  }

  @Override
  public Transform makeResize(int width, int height, float cropOffsetX, float cropOffsetY) {
    return new Resize(width, height, true, cropOffsetX, cropOffsetY);
  }

  @Override
  public Transform makeResize(int width, int height, double cropOffsetX,
                                     double cropOffsetY) {
    return new Resize(width, height, true, (float) cropOffsetX, (float) cropOffsetY);
  }

  @Override
  public Transform makeCrop(float leftX, float topY, float rightX,
                                   float bottomY) {
    return new Crop(leftX, topY, rightX, bottomY);
  }

  @Override
  public Transform makeCrop(double leftX, double topY,
                                   double rightX, double bottomY) {
    return makeCrop((float) leftX, (float) topY, (float) rightX, (float) bottomY);
  }

  @Override
  public Transform makeVerticalFlip() {
    return new VerticalFlip();
  }

  @Override
  public Transform makeHorizontalFlip() {
    return new HorizontalFlip();
  }

  @Override
  public Transform makeRotate(int degrees) {
    return new Rotate(degrees);
  }

  @Override
  public Transform makeImFeelingLucky() {
    return new ImFeelingLucky();
  }

  @Override
  public CompositeTransform makeCompositeTransform(
      Collection<Transform> transforms) {
    return new CompositeTransform(transforms);
  }

  @Override
  public CompositeTransform makeCompositeTransform() {
    return new CompositeTransform();
  }

  @Override
  public Composite makeComposite(Image image, int xOffset, int yOffset,
                                        float opacity,
                                        Composite.Anchor anchor) {
    return new CompositeImpl(image, xOffset, yOffset, opacity, anchor);
  }

}

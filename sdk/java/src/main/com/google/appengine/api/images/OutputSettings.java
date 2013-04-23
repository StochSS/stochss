// Copyright 2010 Google Inc. All Rights Reserved.

package com.google.appengine.api.images;

import com.google.appengine.api.images.ImagesService.OutputEncoding;

/**
 * {@code OutputSettings} represents the different settings to specify how
 * a particular transform or composite will return an {@link Image}.
 *
 */
public class OutputSettings {
  /**
   * The output encoding of the image.
   */
  private OutputEncoding outputEncoding;

  /**
   * The quality of the returned image.  The number should be between 1 and 100
   * when set.  This value should only be set for
   * JPEG encoding and will not be honored for other encodings.
   */
  private int quality = -1;

  public OutputSettings(OutputEncoding outputEncoding) {
    this.outputEncoding = outputEncoding;
  }

  /**
   * Gets the output encoding.
   * @return The output encoding.
   */
  public OutputEncoding getOutputEncoding() {
    return outputEncoding;
  }

  /**
   * Sets the output encoding.
   * @param outputEncoding The encoding to set.
   */
  public void setOutputEncoding(OutputEncoding outputEncoding) {
    this.outputEncoding = outputEncoding;
  }

  /**
   * Gets the quality.
   * @return If the quality has been set, a value between 1 and 100.
   * Otherwise, it returns -1.
   */
  public int getQuality() {
    return quality;
  }

  /**
   * Sets the quality of the returned image.  Value must be between
   * 1 and 100.
   * @param quality The quality to set.
   * @throws IllegalArgumentException if quality is not between 1 and 100.
   */
  public void setQuality(int quality) {
    if (quality >= 1 && quality <= 100) {
      this.quality = quality;
    } else {
      throw new IllegalArgumentException("Trying to set an invalid quality: " +
          quality + ".  Value must be between 1 and 100.");
    }
  }

  /**
   * Checks if the quality value has been set.
   * @return If the quality has been set, true. Otherwise, false.
   */
  public boolean hasQuality() {
    return this.quality != -1;
  }
}

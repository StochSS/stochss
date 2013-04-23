// Copyright 2011 Google Inc. All Rights Reserved.

package com.google.appengine.api.conversion;

import com.google.common.base.Objects;
import com.google.common.base.Preconditions;
import com.google.common.collect.Lists;

import java.util.Collections;
import java.util.List;

/**
 * An immutable document for conversion. A document must contain at least one
 * asset, typically the document contents. Additional assets are those needed
 * for the conversion, for example images in HTML.
 *
 */
public final class Document {

  private final List<Asset> assets = Lists.newArrayList();

  /**
   * Constructs a document.
   *
   * @param firstAsset the first asset to add
   */
  public Document(Asset firstAsset) {
    assets.add(Preconditions.checkNotNull(firstAsset));
  }

  /**
   * Constructs a document.
   *
   * @param assets a list of assets to add
   * @throws IllegalArgumentException if the assets list is empty
   */
  public Document(List<Asset> assets) {
    Preconditions.checkNotNull(assets);
    Preconditions.checkArgument(assets.size() > 0, "The assets list should not be empty");
    this.assets.addAll(assets);
  }

  /**
   * Returns all assets associated with the document.
   */
  public List<Asset> getAssets() {
    return Collections.unmodifiableList(assets);
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }

    return Objects.equal(assets, ((Document) o).getAssets());
  }

  @Override
  public int hashCode() {
    return Objects.hashCode(assets);
  }
}

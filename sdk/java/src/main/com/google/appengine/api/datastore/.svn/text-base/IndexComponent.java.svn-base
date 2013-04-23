// Copyright 2012 Google Inc. All Rights Reserved.

package com.google.appengine.api.datastore;

import com.google.storage.onestore.v3.OnestoreEntity.Index.Property;

import java.util.List;

/**
 * An interface that represents a collection of index constraints. It can validate
 * if an index satisfies the constraints.
 *
 */
interface IndexComponent {

  /**
   * Given a list of index {@link Property}s, returns true if the index matches the
   * constraints given by the {@link IndexComponent}.
   *
   * @param indexProperties the index properties to match against
   * @return true if the index satisfies the component
   */
 boolean matches(List<Property> indexProperties);

  /**
   * Returns the list of {@link Property}s that best satisfy this index component.
   */
 List<Property> preferredIndexProperties();

 /**
  * Returns the number of index constraints in this component.
  *
  * If a {@code List<Property>} satisfies this {@link IndexComponent}, and thus
  * {@link IndexComponent#matches} returns true, the number of properties
  * satisfied will be equal to the size of the {@link IndexComponent}.
  *
  * @return the number of index constraints.
  */
  int size();
}

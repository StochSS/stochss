// Copyright 2012 Google Inc. All Rights Reserved.

package com.google.appengine.api.datastore;

import com.google.common.collect.Lists;
import com.google.storage.onestore.v3.OnestoreEntity.Index.Property;
import com.google.storage.onestore.v3.OnestoreEntity.Index.Property.Direction;

import java.util.List;
import java.util.ListIterator;

/**
 * Implements an IndexComponent for an ordered list of properties.
 *
 * Currently, this is used for ordering constraints.
 *
 */
class OrderedIndexComponent implements IndexComponent {
  private final List<Property> matcherProperties;

  public OrderedIndexComponent(List<Property> orderedGroup) {
    this.matcherProperties = orderedGroup;
  }

  @Override
  public boolean matches(List<Property> indexProperties) {
    ListIterator<Property> indexItr = indexProperties.listIterator(indexProperties.size());
    ListIterator<Property> matcherItr = matcherProperties.listIterator(matcherProperties.size());
    while (indexItr.hasPrevious() && matcherItr.hasPrevious()) {
      if (!propertySatisfies(matcherItr.previous(), indexItr.previous())) {
        return false;
      }
    }
    return !matcherItr.hasPrevious();
  }

  @Override
  public List<Property> preferredIndexProperties() {
    List<Property> indexProps = Lists.newArrayListWithExpectedSize(matcherProperties.size());
    for (Property prop : matcherProperties) {
      if (!prop.hasDirection()) {
        prop = prop.clone();
        prop.setDirection(Direction.ASCENDING);
      }
      indexProps.add(prop);
    }
    return indexProps;
  }

  @Override
  public int size() {
    return matcherProperties.size();
  }

  @Override
  public String toString() {
    return "OrderedIndexComponent: " + matcherProperties;
  }

  /**
   * A {@link Property} satisfies a constraint if it is equal to the constraint. However,
   * if the constraint does not specify a direction, then the direction of the actual
   * property does not matter.
   */
  private boolean propertySatisfies(Property constraint, Property property) {
    return constraint.equals(property) ||
        (!constraint.hasDirection() && constraint.getName().equals(property.getName()));
  }

}
// Copyright 2012 Google Inc. All Rights Reserved.

package com.google.appengine.api.datastore;

import com.google.common.collect.Lists;
import com.google.common.collect.Sets;
import com.google.storage.onestore.v3.OnestoreEntity.Index.Property;
import com.google.storage.onestore.v3.OnestoreEntity.Index.Property.Direction;

import java.util.List;
import java.util.ListIterator;
import java.util.Set;
import java.util.SortedSet;

/**
 * Implements an {@link IndexComponent} that is unordered.
 *
 * This is currently used for exists and group by filters.
 *
 */
class UnorderedIndexComponent implements IndexComponent {

  private final SortedSet<String> matcherProperties;

  public UnorderedIndexComponent(Set<String> unorderedGroup) {
    this.matcherProperties = Sets.newTreeSet(unorderedGroup);
  }

  @Override
  public boolean matches(List<Property> indexProperties) {
    Set<String> unorderedProps = Sets.newHashSet(matcherProperties);
    ListIterator<Property> indexItr = indexProperties.listIterator(indexProperties.size());
    while (!unorderedProps.isEmpty() && indexItr.hasPrevious()) {
      if (!unorderedProps.remove(indexItr.previous().getName())) {
        return false;
      }
    }
    return unorderedProps.isEmpty();
  }

  @Override
  public List<Property> preferredIndexProperties() {
    List<Property> indexProps = Lists.newArrayListWithExpectedSize(matcherProperties.size());
    for (String name : matcherProperties) {
      Property indexProperty = new Property();
      indexProperty.setName(name);
      indexProperty.setDirection(Direction.ASCENDING);
      indexProps.add(indexProperty);
    }
    return indexProps;
  }

  @Override
  public int size() {
    return matcherProperties.size();
  }

  @Override
  public String toString() {
    return "UnorderedIndexComponent: " + matcherProperties;
  }
}

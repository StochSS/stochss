// Copyright 2009 Google Inc. All Rights Reserved.

package com.google.appengine.api.datastore;

import com.google.apphosting.api.DatastorePb;
import com.google.apphosting.api.DatastorePb.Query.Filter;
import com.google.apphosting.api.DatastorePb.Query.Filter.Operator;
import com.google.apphosting.api.DatastorePb.Query.Order;
import com.google.common.collect.Lists;
import com.google.common.collect.Sets;
import com.google.storage.onestore.v3.OnestoreEntity.Index.Property;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Set;

/**
 * A query as it is actually planned on the datastore indices.
 *
 * This query should not be used to actually run a query. It is only useful
 * when determining what indices are needed to satisfy a Query
 *
 * In the production datastore, some components of the query can be fulfilled
 * natively, so before we try to determine what composite indexes this query
 * requires we want to strip out those components. An example of this is sort
 * by __key__ ascending. This can always be stripped out as all tables are
 * sorted by __key__ ascending natively
 *
 * This class also categorizes query components into groups that
 * are useful for discerning what indices are needed to satisfy it. Specifically
 * it constructs a set of the properties involved in equality filters, and also
 * constructs a list of index properties.
 */
class IndexComponentsOnlyQuery extends ValidatedQuery {
  private final Set<String> equalityProps = Sets.newHashSet();
  private final List<Property> orderProps = new ArrayList<Property>();
  private final Set<String> existsProps = Sets.newHashSet();
  private final Set<String> groupByProps = Sets.newHashSet();

  private boolean hasKeyProperty = false;

  public IndexComponentsOnlyQuery(DatastorePb.Query query) {
    super(query);
    removeNativelySupportedComponents();
    categorizeQuery();
  }

  private void removeNativelySupportedComponents() {

    for (Filter filter : query.filters()) {
      if (filter.getOpEnum() == Operator.EXISTS) {
        return;
      }
    }

    boolean hasKeyDescOrder = false;
    if (query.orderSize() > 0) {
      Order lastOrder = query.getOrder(query.orderSize()-1);
      if (lastOrder.getProperty().equals(Entity.KEY_RESERVED_PROPERTY)) {
        if (lastOrder.getDirection() == Order.Direction.ASCENDING.getValue()) {
          query.removeOrder(query.orderSize()-1);
        } else {
          hasKeyDescOrder = true;
        }
      }
    }

    if (!hasKeyDescOrder) {
      boolean hasNonKeyInequality = false;
      for (Filter f : query.filters()) {
        if (ValidatedQuery.INEQUALITY_OPERATORS.contains(f.getOpEnum()) &&
            !Entity.KEY_RESERVED_PROPERTY.equals(f.getProperty(0).getName())) {
          hasNonKeyInequality = true;
          break;
        }
      }

      if (!hasNonKeyInequality) {
        Iterator<Filter> itr = query.filterIterator();
        while(itr.hasNext()) {
          if (itr.next().getProperty(0).getName().equals(Entity.KEY_RESERVED_PROPERTY))
            itr.remove();
        }
      }
    }
  }

  private void categorizeQuery() {
    Set<String> ineqProps = new HashSet<String>();
    hasKeyProperty = false;
    for (Filter filter : query.filters()) {
      String propName = filter.getProperty(0).getName();
      switch (filter.getOpEnum()) {
        case EQUAL:
          equalityProps.add(propName);
          break;
        case EXISTS:
          existsProps.add(propName);
          break;
        case GREATER_THAN:
        case GREATER_THAN_OR_EQUAL:
        case LESS_THAN:
        case LESS_THAN_OR_EQUAL:
          ineqProps.add(propName);
          break;
      }
      if (propName.equals(Entity.KEY_RESERVED_PROPERTY)) {
        hasKeyProperty = true;
      }
    }

    if (query.orderSize() == 0 && !ineqProps.isEmpty()) {
      orderProps.add(new Property().setName(ineqProps.iterator().next()));
    }

    groupByProps.addAll(query.groupByPropertyNames());
    existsProps.removeAll(groupByProps);

    for (Order order : query.orders()) {
      if (order.getProperty().equals(Entity.KEY_RESERVED_PROPERTY)) {
        hasKeyProperty = true;
      }
      groupByProps.remove(order.getProperty());
      orderProps.add(
          new Property().setName(order.getProperty()).setDirection(order.getDirection()));
    }
  }

  /**
   * Returns a list of {@link IndexComponent}s that represent the postfix
   * constraints for this query.
   */
  public List<IndexComponent> getPostfix() {
     return Lists.newArrayList(new OrderedIndexComponent(orderProps),
         new UnorderedIndexComponent(groupByProps),
         new UnorderedIndexComponent(existsProps));
  }

  /**
   * Returns the set of names of properties that represent the unordered property
   * constraints of the prefix for this query.
   */
  public Set<String> getPrefix() {
    return equalityProps;
  }

  public boolean hasKeyProperty() {
    return hasKeyProperty;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }

    IndexComponentsOnlyQuery that = (IndexComponentsOnlyQuery) o;

    if (!query.equals(that.query)) {
      return false;
    }

    return true;
  }

  @Override
  public int hashCode() {
    return query.hashCode();
  }
}

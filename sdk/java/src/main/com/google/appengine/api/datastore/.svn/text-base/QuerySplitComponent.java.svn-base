// Copyright 2009 Google Inc. All Rights Reserved.

package com.google.appengine.api.datastore;

import com.google.appengine.api.datastore.Query.FilterPredicate;
import com.google.appengine.api.datastore.Query.SortDirection;
import com.google.appengine.api.datastore.Query.SortPredicate;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * A class that holds information about a given query component that will later
 * be converted into a {@link MultiQueryComponent}.
 *
 */
class QuerySplitComponent implements Comparable<QuerySplitComponent> {
  public enum Order {SEQUENTIAL, ARBITRARY}

  private final Order order;
  private final String propertyName;
  private final int sortIndex;
  private final SortDirection direction;
  private final List<List<FilterPredicate>> filters =
      new ArrayList<List<FilterPredicate>>();

  /**
   * Constructs a new component and uses {@code sorts} to determine how this
   * property should be handled in {@link QuerySplitHelper}
   *
   * @param propertyName the name of the property to which this component
   * applies
   * @param sorts the sort values from the original query
   */
  public QuerySplitComponent(String propertyName, List<SortPredicate> sorts) {
    this.propertyName = propertyName;
    for (int i = 0; i < sorts.size(); ++i) {
      if (sorts.get(i).getPropertyName().equals(propertyName)) {
        this.order = Order.SEQUENTIAL;
        this.sortIndex = i;
        this.direction = sorts.get(i).getDirection();
        return;
      }
    }
    this.order = Order.ARBITRARY;
    this.sortIndex = -1;
    this.direction = null;
  }

  /**
   * Adds a set of filters that are then applied to {@link Query}s generated
   * by {@link MultiQueryBuilder} (in order if order = {@link
   * Order#SEQUENTIAL}).
   */
  public void addFilters(FilterPredicate... filters) {
    this.filters.add(Arrays.asList(filters));
  }

  public List<List<FilterPredicate>> getFilters() {
    return filters;
  }

  public Order getOrder() {
    return order;
  }

  public int getSortIndex() {
    return sortIndex;
  }

  public SortDirection getDirection() {
    return direction;
  }

  @Override
  public int compareTo(QuerySplitComponent o) {
    if (!order.equals(o.order)) {
      return order.compareTo(o.order);
    } else {
      return sortIndex - o.sortIndex;
    }
  }

  @Override
  public int hashCode() {
    return Arrays.hashCode(new Object[] {direction, filters, order, propertyName, sortIndex});
  }

  @Override
  public boolean equals(Object obj) {
    if (this == obj) {
      return true;
    } else if (!(obj instanceof QuerySplitComponent)) {
      return false;
    }

    QuerySplitComponent other = (QuerySplitComponent) obj;

    return (direction == other.direction)
            || ((direction != null) && (direction.equals(other.direction)))
        && (filters == other.filters) || ((filters != null) && (filters.equals(other.filters)))
        && (order == other.order) || ((order != null) && (order.equals(other.order)))
        && (propertyName == other.propertyName)
            || ((propertyName != null) && (propertyName.equals(other.propertyName)))
        && (sortIndex == other.sortIndex);
  }

  @Override
  public String toString() {
    String result = "QuerySplitComponent [filters=" + filters;
    if (direction != null) {
      result += ", direction=" + direction + ", " + "sortIndex=" + sortIndex;
    }
    return result + "]";
  }
}
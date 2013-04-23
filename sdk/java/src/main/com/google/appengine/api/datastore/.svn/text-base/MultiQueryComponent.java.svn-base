// Copyright 2009 Google Inc. All Rights Reserved.
package com.google.appengine.api.datastore;

import com.google.appengine.api.datastore.Query.FilterPredicate;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * This class determines the manner in which multiple queries are generated.
 *
 * @see MultiQueryBuilder
 */
class MultiQueryComponent implements Comparable<MultiQueryComponent>{
  public enum Order {SERIAL, PARALLEL}

  private final Order order;
  private final List<List<FilterPredicate>> filters;

  public MultiQueryComponent(Order order) {
    this.order = order;
    this.filters = new ArrayList<List<FilterPredicate>>();
  }

  public MultiQueryComponent(Order order, List<List<FilterPredicate>> filters) {
    this.order = order;
    this.filters = filters;
  }

  public Order getOrder() {
    return order;
  }

  /**
   * Adds a set of filters that are then applied to {@link Query}s generated
   * by {@link MultiQueryBuilder} (in order).
   * @param filters
   */
  public void addFilters(FilterPredicate... filters) {
    this.filters.add(Arrays.asList(filters));
  }

  public List<List<FilterPredicate>> getFilters() {
    return filters;
  }

  @Override
  public int compareTo(MultiQueryComponent o) {
    return order.compareTo(o.order);
  }

  @Override
  public String toString() {
    return "MultiQueryComponent [filters=" + filters + ", order=" + order + "]";
  }
}

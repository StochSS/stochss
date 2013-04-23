// Copyright 2009 Google Inc. All Rights Reserved.

package com.google.appengine.api.datastore;

import static com.google.appengine.api.datastore.Query.FilterOperator.EQUAL;
import static com.google.appengine.api.datastore.Query.FilterOperator.IN;

import com.google.appengine.api.datastore.Query.FilterPredicate;
import com.google.appengine.api.datastore.Query.SortPredicate;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Iterator;
import java.util.List;

/**
 * This class splits a query with an IN filter using the following logic:
 *
 * <p>Create 1 query for each element in the list of predicate values.  Each
 * query has all the same attributes as the original, except we replace the
 * IN filter with an EQUALS filter for one element in the list of predicate
 * values.  So say we're given:
 * <pre>
 *  select from Person where age IN (33, 44, 55)
 * </pre>
 * <p>We would turn this into:
 * <pre>
 *  select from Person where age == 33
 *  select from Person where age == 44
 *  select from Person where age == 55
 * </pre>
 *
 */
class InQuerySplitter extends BaseQuerySplitter {

  @Override
  public List<QuerySplitComponent> split(List<FilterPredicate> remainingFilters,
                                         List<SortPredicate> sorts) {
    List<QuerySplitComponent> result = new ArrayList<QuerySplitComponent>();
    Iterator<FilterPredicate> itr = remainingFilters.iterator();
    while (itr.hasNext()) {
      FilterPredicate filter = itr.next();
      if (filter.getOperator() == IN) {
        QuerySplitComponent component = new QuerySplitComponent(filter.getPropertyName(), sorts);
        List<ComparableValue> comparableValues = new ArrayList<ComparableValue>();
        for (Object value : (Iterable<?>) filter.getValue()) {
          comparableValues.add(new ComparableValue(value));
        }
        if (comparableValues.size() <= 1) {
          continue;
        }
        if (component.getDirection() != null) {
          Collections.sort(comparableValues, getValueComparator(component.getDirection()));
        }
        for (ComparableValue value : comparableValues) {
          component.addFilters(new FilterPredicate(filter.getPropertyName(), EQUAL,
                                                   value.getValue()));
        }
        result.add(component);
        itr.remove();
      }
    }

    return result;
  }
}

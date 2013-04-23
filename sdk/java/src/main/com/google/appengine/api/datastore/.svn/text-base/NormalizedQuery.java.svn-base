package com.google.appengine.api.datastore;

import com.google.apphosting.api.DatastorePb.Query;
import com.google.apphosting.api.DatastorePb.Query.Filter;
import com.google.apphosting.api.DatastorePb.Query.Filter.Operator;
import com.google.apphosting.api.DatastorePb.Query.Order;
import com.google.common.collect.Iterables;
import com.google.storage.onestore.v3.OnestoreEntity.Property;

import java.util.Arrays;
import java.util.Collections;
import java.util.HashSet;
import java.util.Iterator;
import java.util.Set;

class NormalizedQuery {
  static final Set<Operator> INEQUALITY_OPERATORS = makeImmutableSet(
      Operator.GREATER_THAN,
      Operator.GREATER_THAN_OR_EQUAL,
      Operator.LESS_THAN,
      Operator.LESS_THAN_OR_EQUAL);

  protected final Query query;

  public NormalizedQuery(Query query) {
    this.query = query.clone();
    normalizeQuery();
  }

  public Query getQuery() {
    return query;
  }

  private void normalizeQuery() {

    Set<Property> equalityFilterProperties = new HashSet<Property>();
    Set<String> equalityProperties = new HashSet<String>();
    Set<String> inequalityProperties = new HashSet<String>();

    for (Iterator<Filter> itr = query.filterIterator(); itr.hasNext();) {
      Filter f = itr.next();
      if (f.propertySize() == 1 && f.getOpEnum() == Operator.IN) {
        f.setOp(Operator.EQUAL);
      }
      if (f.propertySize() >= 1) {
        String name = f.getProperty(0).getName();
        if (f.getOpEnum() == Operator.EQUAL) {
          if (!equalityFilterProperties.add(f.getProperty(0))) {
            itr.remove();
          } else {
            equalityProperties.add(name);
          }
        } else if (INEQUALITY_OPERATORS.contains(f.getOpEnum())) {
          inequalityProperties.add(name);
        }
      }
    }

    equalityProperties.removeAll(inequalityProperties);

    for (Iterator<Order> itr = query.orderIterator(); itr.hasNext();) {
      if (!equalityProperties.add(itr.next().getProperty())) {
        itr.remove();
      }
    }

    Set<String> allProperties = equalityProperties;
    allProperties.addAll(inequalityProperties);

    for (Iterator<Filter> itr = query.filterIterator(); itr.hasNext();) {
      Filter f = itr.next();
      if (f.getOpEnum() == Operator.EXISTS && f.propertySize() >= 1 &&
          !allProperties.add(f.getProperty(0).getName())) {
        itr.remove();
      }
    }

    for (String propName : Iterables.concat(query.propertyNames(), query.groupByPropertyNames())) {
      if (allProperties.add(propName)) {
        query.addFilter().setOp(Operator.EXISTS).addProperty()
            .setName(propName).setMultiple(false).getMutableValue();
      }
    }

    for (Filter f : query.filters()) {
      if (f.getOpEnum() == Operator.EQUAL && f.propertySize() >= 1 &&
          f.getProperty(0).getName().equals(Entity.KEY_RESERVED_PROPERTY)) {
        query.clearOrder();
        break;
      }
    }

    boolean foundKeyOrder = false;
    for (Iterator<Order> i = query.orderIterator(); i.hasNext();) {
      String property = i.next().getProperty();
      if (foundKeyOrder) {
        i.remove();
      } else if (property.equals(Entity.KEY_RESERVED_PROPERTY)) {
        foundKeyOrder = true;
      }
    }
  }

  static <T> Set<T> makeImmutableSet(T ...of) {
    return Collections.unmodifiableSet(new HashSet<T>(Arrays.asList(of)));
  }
}

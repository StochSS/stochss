// Copyright 2009 Google Inc. All Rights Reserved.
package com.google.appengine.api.datastore;

import com.google.apphosting.api.DatastorePb;
import com.google.apphosting.api.DatastorePb.Query.Filter;
import com.google.apphosting.api.DatastorePb.Query.Order;
import com.google.apphosting.api.DatastorePb.Query.Order.Direction;
import com.google.common.collect.Lists;
import com.google.storage.onestore.v3.OnestoreEntity;
import com.google.storage.onestore.v3.OnestoreEntity.EntityProto;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Utilities for comparing {@link EntityProto}.  This class is
 * only public because the dev appserver needs access to it.  It should not be
 * accessed by user code.
 *
 */
public final class EntityProtoComparators {

  public static final Comparator<Comparable<Object>> MULTI_TYPE_COMPARATOR =
      new MultiTypeComparator();

  private static final Comparator<Order> ORDER_PROPERTY_COMPARATOR = new Comparator<Order>() {
    @Override
    public int compare(Order o1, Order o2) {
      return o1.getProperty().compareTo(o2.getProperty());
    }
  };

  static final Order KEY_ASC_ORDER = new Order().setProperty(Entity.KEY_RESERVED_PROPERTY)
      .setDirection(Order.Direction.ASCENDING);

  public static final class EntityProtoComparator
      implements Comparator<OnestoreEntity.EntityProto> {

    final List<Order> orders;
    final Map<String, FilterMatcher> filters;

    public EntityProtoComparator(List<Order> orders) {
      this(orders, Collections.<Filter>emptyList());
    }

    public EntityProtoComparator(List<Order> orders, List<Filter> filters) {
      this.orders = makeAdjustedOrders(orders, filters);
      this.filters = makeFilterMatchers(orders, filters);
    }

    private static List<Order> makeAdjustedOrders(List<Order> orders, List<Filter> filters) {
      List<Order> existsOrders = Lists.newArrayList();
      for (Filter filter : filters) {
        if (filter.getOpEnum() == Filter.Operator.EXISTS) {
          existsOrders.add(new Order()
              .setProperty(filter.getProperty(0).getName())
              .setDirection(Direction.ASCENDING));
        }
      }
      Collections.sort(existsOrders, ORDER_PROPERTY_COMPARATOR);

      List<Order> adjusted = new ArrayList<Order>(orders.size() + existsOrders.size() + 1);
      adjusted.addAll(orders);

      if (adjusted.isEmpty()) {
        for(Filter filter : filters) {
          if (ValidatedQuery.INEQUALITY_OPERATORS.contains(filter.getOpEnum())) {
            adjusted.add(new Order()
              .setProperty(filter.getProperty(0).getName())
              .setDirection(Direction.ASCENDING));
            break;
          }
        }
      }

      adjusted.addAll(existsOrders);

      if (adjusted.isEmpty() || !adjusted.get(adjusted.size() - 1).equals(KEY_ASC_ORDER)) {
        adjusted.add(KEY_ASC_ORDER);
      }
      return adjusted;
    }

    private static Map<String, FilterMatcher> makeFilterMatchers(List<Order> orders,
                                                                 List<Filter> filters) {
      Map<String, FilterMatcher> filterMatchers = new HashMap<String, FilterMatcher>();
      for(Filter filter : filters) {
        String name = filter.getProperty(0).getName();
        FilterMatcher filterMatcher = filterMatchers.get(name);
        if (filterMatcher == null) {
          filterMatcher = new FilterMatcher();
          filterMatchers.put(name, filterMatcher);
        }
        filterMatcher.addFilter(filter);
      }

      for (Order order : orders) {
        if (!filterMatchers.containsKey(order.getProperty())) {
          filterMatchers.put(order.getProperty(), FilterMatcher.MATCH_ALL);
        }
        if (order.getProperty().equals(KEY_ASC_ORDER.getProperty())) {
          break;
        }
      }

      return filterMatchers;
    }

    public List<Order> getAdjustedOrders() {
      return Collections.unmodifiableList(orders);
    }

    public boolean matches(OnestoreEntity.EntityProto proto) {
      for(String property : filters.keySet()) {
        List<Comparable<Object>> values = getComparablePropertyValues(proto, property);
        if (values == null || !filters.get(property).matches(values)) {
          return false;
        }
      }
      return true;
    }

    public boolean matches(OnestoreEntity.Property prop) {
      FilterMatcher filter = filters.get(prop.getName());
      if (filter == null) {
        return true;
      }
      return filter.matches(Collections.singletonList(
          DataTypeTranslator.getComparablePropertyValue(prop)));
    }

    @Override
    public int compare(OnestoreEntity.EntityProto protoA, OnestoreEntity.EntityProto protoB) {
      int result;

      for (Order order : orders) {
        String property = order.getProperty();

        Collection<Comparable<Object>> aValues = getComparablePropertyValues(protoA, property);
        Collection<Comparable<Object>> bValues = getComparablePropertyValues(protoB, property);
        if (aValues == null || bValues == null) {
          return 0;
        }
        boolean findMin = order.getDirectionEnum() == DatastorePb.Query.Order.Direction.ASCENDING;
        FilterMatcher matcher = filters.get(property);
        if (matcher == null) {
          matcher = FilterMatcher.MATCH_ALL;
        }
        Comparable<Object> extremeA = multiTypeExtreme(aValues, findMin, matcher);
        Comparable<Object> extremeB = multiTypeExtreme(bValues, findMin, matcher);

        result = MULTI_TYPE_COMPARATOR.compare(extremeA, extremeB);

        if (result != 0) {
          if (order.getDirectionEnum() == DatastorePb.Query.Order.Direction.DESCENDING) {
            result = -result;
          }
          return result;
        }
      }

      return 0;
    }

    /**
     * Retrieves a {@link List} containing the comparable representations of
     * all properties with the given name on the given entity proto.
     *
     * @return A {@link List} of comparable property values, or {@code null} if
     * the entityProto has no property with the given name.
     */
    static List<Comparable<Object>> getComparablePropertyValues(
        OnestoreEntity.EntityProto entityProto, String propertyName) {
      Collection<OnestoreEntity.Property> entityProperties =
          DataTypeTranslator.findIndexedPropertiesOnPb(entityProto, propertyName);
      if (entityProperties.isEmpty()) {
        return null;
      }
      if (propertyName.equals(Entity.KEY_RESERVED_PROPERTY) && !entityProto.hasKey()) {
        return null;
      }
      List<Comparable<Object>> values = new ArrayList<Comparable<Object>>(entityProperties.size());
      for (OnestoreEntity.Property prop : entityProperties) {
        values.add(DataTypeTranslator.getComparablePropertyValue(prop));
      }
      return values;
    }

    /**
     * Find either the smallest or largest element in a potentially
     * heterogenous collection, depending on the value of {@code findMin}.
     */
    static Comparable<Object> multiTypeExtreme(
        Collection<Comparable<Object>> comparables, boolean findMin, FilterMatcher matcher) {
      boolean findMax = !findMin;
      Comparable<Object> extreme = FilterMatcher.NoValue.INSTANCE;
      for (Comparable<Object> value : comparables) {
        if (!matcher.considerValueForOrder(value)) {
          continue;
        }

        if (extreme == FilterMatcher.NoValue.INSTANCE) {
          extreme = value;
        } else if (findMin && MULTI_TYPE_COMPARATOR.compare(value, extreme) < 0) {
          extreme = value;
        } else if (findMax && MULTI_TYPE_COMPARATOR.compare(value, extreme) > 0) {
          extreme = value;
        }
      }
      if (extreme == FilterMatcher.NoValue.INSTANCE) {
        throw new IllegalArgumentException("Entity contains no relevant values.");
      }
      return extreme;
    }
  }

  private static final class MultiTypeComparator implements Comparator<Comparable<Object>> {
    @Override
    public int compare(Comparable<Object> o1, Comparable<Object> o2) {
      if (o1 == null) {
        if (o2 == null) {
          return 0;
        }
        return -1;
      } else if (o2 == null) {
        return 1;
      }
      Integer comp1TypeRank = DataTypeTranslator.getTypeRank(o1.getClass());
      Integer comp2TypeRank = DataTypeTranslator.getTypeRank(o2.getClass());
      if (comp1TypeRank.equals(comp2TypeRank)) {
        return o1.compareTo(o2);
      }
      return comp1TypeRank.compareTo(comp2TypeRank);
    }
  }

  private EntityProtoComparators() {}
}

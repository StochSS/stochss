// Copyright 2007 Google Inc. All rights reserved.

package com.google.appengine.api.datastore;

import com.google.apphosting.api.DatastorePb;
import com.google.apphosting.api.DatastorePb.Query.Filter;
import com.google.apphosting.api.DatastorePb.Query.Filter.Operator;
import com.google.apphosting.api.DatastorePb.Query.Order;
import com.google.apphosting.api.DatastorePb.Query.Order.Direction;
import com.google.storage.onestore.v3.OnestoreEntity.Reference;

import java.util.List;

/**
 * {@code QueryTranslator} contains the logic to translate a {@code
 * Query} into the protocol buffers that are used to pass it to the
 * implementation of the API.
 *
 */
final class QueryTranslator {

  public static DatastorePb.Query convertToPb(Query query, FetchOptions fetchOptions) {
    Key ancestor = query.getAncestor();
    List<Query.FilterPredicate> filterPredicates = query.getFilterPredicates();
    List<Query.SortPredicate> sortPredicates = query.getSortPredicates();

    DatastorePb.Query proto = new DatastorePb.Query();

    if (query.getKind() != null) {
      proto.setKind(query.getKind());
    }

    proto.setApp(query.getAppIdNamespace().getAppId());
    String nameSpace = query.getAppIdNamespace().getNamespace();
    if (nameSpace.length() != 0) {
      proto.setNameSpace(nameSpace);
    }

    if (fetchOptions.getOffset() != null) {
      proto.setOffset(fetchOptions.getOffset());
    }

    if (fetchOptions.getLimit() != null) {
      proto.setLimit(fetchOptions.getLimit());
    }

    if (fetchOptions.getPrefetchSize() != null) {
      proto.setCount(fetchOptions.getPrefetchSize());
    } else if (fetchOptions.getChunkSize() != null) {
      proto.setCount(fetchOptions.getChunkSize());
    }

    if (fetchOptions.getStartCursor() != null) {
      proto.setCompiledCursor(fetchOptions.getStartCursor().convertToPb());
    }

    if (fetchOptions.getEndCursor() != null) {
      proto.setEndCompiledCursor(fetchOptions.getEndCursor().convertToPb());
    }

    if (fetchOptions.getCompile() != null) {
      proto.setCompile(fetchOptions.getCompile());
    }

    if (ancestor != null) {
      Reference ref = KeyTranslator.convertToPb(ancestor);
      if (!ref.getApp().equals(proto.getApp())) {
        throw new IllegalArgumentException("Query and ancestor appid/namespace mismatch");
      }
      proto.setAncestor(ref);
    }

    if (query.getDistinct()) {
      if (query.getProjections().isEmpty()) {
        throw new IllegalArgumentException("Projected properties must be set to " +
            "allow for distinct projections");
      }
      for (Projection projection : query.getProjections()) {
        proto.addGroupByPropertyName(projection.getPropertyName());
      }
    }

    proto.setKeysOnly(query.isKeysOnly());

    for (Query.FilterPredicate filterPredicate : filterPredicates) {
      Filter filter = proto.addFilter();
      filter.copyFrom(convertFilterPredicateToPb(filterPredicate));
    }

    for (Query.SortPredicate sortPredicate : sortPredicates) {
      Order order = proto.addOrder();
      order.copyFrom(convertSortPredicateToPb(sortPredicate));
    }

    for (Projection projection : query.getProjections()) {
      proto.addPropertyName(projection.getPropertyName());
    }

    if (query.getFullTextSearch() != null) {
      proto.setSearchQuery(query.getFullTextSearch());
    }

    return proto;
  }

  static Order convertSortPredicateToPb(Query.SortPredicate predicate) {
    Order order = new Order();
    order.setProperty(predicate.getPropertyName());
    order.setDirection(getSortOp(predicate.getDirection()));
    return order;
  }

  private static Direction getSortOp(Query.SortDirection direction) {
    switch (direction) {
      case ASCENDING:
        return Direction.ASCENDING;
      case DESCENDING:
        return Direction.DESCENDING;
      default:
        throw new UnsupportedOperationException("direction: " + direction);
    }
  }

  private static Filter convertFilterPredicateToPb(
      Query.FilterPredicate predicate) {
    Filter filter = new Filter();
    filter.setOp(getFilterOp(predicate.getOperator()));

    if (predicate.getValue() instanceof Iterable<?>) {
      if (predicate.getOperator() != Query.FilterOperator.IN) {
        throw new IllegalArgumentException("Only the IN operator supports multiple values");
      }
      for (Object value : (Iterable<?>) predicate.getValue()) {
        filter.addProperty(DataTypeTranslator.toProperty(predicate.getPropertyName(), value));
      }
    } else {
      filter.addProperty(
          DataTypeTranslator.toProperty(predicate.getPropertyName(), predicate.getValue()));
    }

    return filter;
  }

  private static Operator getFilterOp(Query.FilterOperator operator) {
    switch (operator) {
      case LESS_THAN:
        return Operator.LESS_THAN;
      case LESS_THAN_OR_EQUAL:
        return Operator.LESS_THAN_OR_EQUAL;
      case GREATER_THAN:
        return Operator.GREATER_THAN;
      case GREATER_THAN_OR_EQUAL:
        return Operator.GREATER_THAN_OR_EQUAL;
      case EQUAL:
        return Operator.EQUAL;
      case IN:
        return Operator.IN;
      default:
        throw new UnsupportedOperationException("operator: " + operator);
    }
  }

  private QueryTranslator() {
  }
}

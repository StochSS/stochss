// Copyright 2009 Google Inc. All Rights Reserved.
package com.google.appengine.api.datastore;

import com.google.apphosting.api.DatastorePb;
import com.google.apphosting.api.DatastorePb.Query.Filter;
import com.google.apphosting.api.DatastorePb.Query.Order;
import com.google.common.base.Pair;
import com.google.common.collect.Lists;
import com.google.common.collect.Sets;
import com.google.storage.onestore.v3.OnestoreEntity.Index;
import com.google.storage.onestore.v3.OnestoreEntity.Index.Property;
import com.google.storage.onestore.v3.OnestoreEntity.Index.Property.Direction;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * Composite index management operations needed by the datastore api.
 *
 */
public class CompositeIndexManager {

  /**
   * The format of a datastore-index xml element when it has properties.
   */
  private static final String DATASTORE_INDEX_WITH_PROPERTIES_XML_FORMAT =
      "    <datastore-index kind=\"%s\" ancestor=\"%s\" source=\"%s\">\n%s"
    + "    </datastore-index>\n\n";

  /**
   * The format of a datastore-index xml element when it does not have
   * properties.
   */
  private static final String DATASTORE_INDEX_NO_PROPERTIES_XML_FORMAT =
      "    <datastore-index kind=\"%s\" ancestor=\"%s\" source=\"%s\"/>\n\n";

  /**
   * The format of a property xml element.
   */
  private static final String PROPERTY_XML_FORMAT =
      "        <property name=\"%s\" direction=\"%s\"/>\n";

  /**
   * Apologies for the lowercase literals, but the whole point of these enums
   * is to represent constants in an xml document, and it's silly to have
   * the code literals not match the xml literals - you end up with a bunch
   * of case conversion just support the java naming conversion.
   */

  /**
   * The source of an index in the index file.  These are used as literals
   * in an xml document that we read and write.
   */
  protected enum IndexSource { auto, manual }

  /**
   * Generate an xml representation of the provided {@link Index}.
   *
   * <datastore-indexes autoGenerate="true">
   *     <datastore-index kind="a" ancestor="false">
   *         <property name="yam" direction="asc"/>
   *         <property name="not yam" direction="desc"/>
   *     </datastore-index>
   * </datastore-indexes>
   *
   * @param index The index for which we want an xml representation.
   * @param source The source of the provided index.
   * @return The xml representation of the provided index.
   */
  protected String generateXmlForIndex(Index index, IndexSource source) {
    boolean isAncestor = index.isAncestor();
    if (index.propertySize() == 0) {
      return String.format(
          DATASTORE_INDEX_NO_PROPERTIES_XML_FORMAT,
          index.getEntityType(), isAncestor, source);
    }
    StringBuilder sb = new StringBuilder();
    for (Property prop : index.propertys()) {
      String dir = prop.getDirectionEnum() == Direction.ASCENDING ? "asc" : "desc";
      sb.append(String.format(PROPERTY_XML_FORMAT, prop.getName(), dir));
    }
    return String.format(
        DATASTORE_INDEX_WITH_PROPERTIES_XML_FORMAT,
        index.getEntityType(), isAncestor, source, sb.toString());
  }

  /**
   * Given a {@link IndexComponentsOnlyQuery}, return the {@link Index}
   * needed to fulfill the query, or {@code null} if no index is needed.
   *
   * This code needs to remain in sync with its counterparts in other
   * languages.  If you modify this code please make sure you make the
   * same update in the local datastore for other languages.
   *
   * @param indexOnlyQuery The query.
   * @return The index that must be present in order to fulfill the query, or
   * {@code null} if no index is needed.
   */
  protected Index compositeIndexForQuery(final IndexComponentsOnlyQuery indexOnlyQuery) {
    DatastorePb.Query query = indexOnlyQuery.getQuery();

    boolean hasKind = query.hasKind();
    boolean isAncestor = query.hasAncestor();
    List<Filter> filters = query.filters();
    List<Order> orders = query.orders();

    if (filters.isEmpty() && orders.isEmpty()) {
      return null;
    }

    Set<String> eqProps = indexOnlyQuery.getPrefix();
    List<Property> indexProperties = getRecommendedIndexProps(indexOnlyQuery);

    if (hasKind && !eqProps.isEmpty() &&
        eqProps.size() == filters.size() &&
        !indexOnlyQuery.hasKeyProperty() &&
        orders.isEmpty()) {
      return null;
    }

    if (hasKind && !isAncestor && indexProperties.size() <= 1 &&
        (!indexOnlyQuery.hasKeyProperty() ||
            indexProperties.get(0).getDirectionEnum() == Property.Direction.ASCENDING)) {
      return null;
    }

    Index index = new Index();
    index.setEntityType(query.getKind());
    index.setAncestor(isAncestor);
    index.mutablePropertys().addAll(indexProperties);
    return index;
  }

  /**
   * We compare {@link Property Properties} by comparing their names.
   */
  private static final Comparator<Property> PROPERTY_NAME_COMPARATOR = new Comparator<Property>() {
    @Override
    public int compare(Property o1, Property o2) {
      return o1.getName().compareTo(o2.getName());
    }
  };

  private List<Property> getRecommendedIndexProps(IndexComponentsOnlyQuery query) {
    List<Property> indexProps = new ArrayList<Property>();

    indexProps.addAll(new UnorderedIndexComponent(query.getPrefix()).preferredIndexProperties());

    for (IndexComponent component : query.getPostfix()) {
      indexProps.addAll(component.preferredIndexProperties());
    }

    return indexProps;
  }

  /**
   * Given a {@link IndexComponentsOnlyQuery} and a collection of existing
   * {@link Index}s, return the minimum {@link Index} needed to fulfill
   * the query, or {@code null} if no index is needed.
   *
   * This code needs to remain in sync with its counterparts in other
   * languages.  If you modify this code please make sure you make the
   * same update in the local datastore for other languages.
   *
   * @param indexOnlyQuery The query.
   * @param indexes The existing indexes.
   * @return The minimum index that must be present in order to fulfill the
   * query, or {@code null} if no index is needed.
   */
  protected Index minimumCompositeIndexForQuery(IndexComponentsOnlyQuery indexOnlyQuery,
      Collection<Index> indexes) {

    Index suggestedIndex = compositeIndexForQuery(indexOnlyQuery);
    if (suggestedIndex == null) {
      return null;
    }

    Map<List<Property>, Pair<Set<String>, Boolean>> remainingMap =
        new HashMap<List<Property>, Pair<Set<String>, Boolean>>();

index_for:
    for (Index index : indexes) {
      if (
          !indexOnlyQuery.getQuery().getKind().equals(index.getEntityType()) ||
          (!indexOnlyQuery.getQuery().hasAncestor() && index.isAncestor())) {
        continue;
      }

      int postfixSplit = index.propertySize();
      for (IndexComponent component : Lists.reverse(indexOnlyQuery.getPostfix())) {
        if (!component.matches(index.propertys().subList(postfixSplit - component.size(),
            postfixSplit))) {
          continue index_for;
        }
        postfixSplit -= component.size();
      }

      Set<String> indexEqProps = Sets.newHashSetWithExpectedSize(postfixSplit);
      for (Property prop : index.propertys().subList(0, postfixSplit)) {
        if (!indexOnlyQuery.getPrefix().contains(prop.getName())) {
          continue index_for;
        }
        indexEqProps.add(prop.getName());
      }

      List<Property> indexPostfix = index.propertys().subList(postfixSplit, index.propertySize());

      Set<String> remainingEqProps;
      boolean remainingAncestor;
      {
        Pair<Set<String>, Boolean> remaining = remainingMap.get(indexPostfix);
        if (remaining == null) {
          remainingEqProps = Sets.newHashSet(indexOnlyQuery.getPrefix());
          remainingAncestor = indexOnlyQuery.getQuery().hasAncestor();
        } else {
          remainingEqProps = remaining.first;
          remainingAncestor = remaining.second;
        }
      }

      boolean modified = remainingEqProps.removeAll(indexEqProps);
      if (remainingAncestor && index.isAncestor()) {
        modified = true;
        remainingAncestor = false;
      }

      if (remainingEqProps.isEmpty() && !remainingAncestor) {
        return null;
      }

      if (!modified) {
        continue;
      }

      remainingMap.put(indexPostfix, Pair.of(remainingEqProps, remainingAncestor));
    }

    if (remainingMap.isEmpty()) {
      return suggestedIndex;
    }

    int minimumCost = Integer.MAX_VALUE;
    List<Property> minimumPostfix = null;
    Pair<Set<String>, Boolean> minimumRemaining = null;
    for (Map.Entry<List<Property>, Pair<Set<String>, Boolean>> entry : remainingMap.entrySet()) {
      int cost = entry.getValue().first.size();
      if (entry.getValue().second) {
        cost += 2;
      }
      if (cost < minimumCost) {
        minimumCost = cost;
        minimumPostfix = entry.getKey();
        minimumRemaining = entry.getValue();
      }
    }

    suggestedIndex.clearProperty();
    suggestedIndex.setAncestor(minimumRemaining.second);
    for (String name : minimumRemaining.first) {
      suggestedIndex.addProperty().setName(name).setDirection(Direction.ASCENDING);
    }
    Collections.sort(suggestedIndex.mutablePropertys(), PROPERTY_NAME_COMPARATOR);

    suggestedIndex.mutablePropertys().addAll(minimumPostfix);
    return suggestedIndex;
  }

  /**
   * Protected alias that allows us to make this class available to the local
   * datastore without publicly exposing it in the api.
   */
  protected static class IndexComponentsOnlyQuery
      extends com.google.appengine.api.datastore.IndexComponentsOnlyQuery {
    public IndexComponentsOnlyQuery(DatastorePb.Query query) {
      super(query);
    }
  }

  /**
   * Protected alias that allows us to make this class available to the local
   * datastore without publicly exposing it in the api.
   */
  protected static class ValidatedQuery
      extends com.google.appengine.api.datastore.ValidatedQuery {
    public ValidatedQuery(DatastorePb.Query query) {
      super(query);
    }
  }

  /**
   * Protected alias that allows us to make this class available to the local
   * datastore without publicly exposing it in the api.
   */
  protected static class KeyTranslator extends com.google.appengine.api.datastore.KeyTranslator {
    protected KeyTranslator() { }
  }
}

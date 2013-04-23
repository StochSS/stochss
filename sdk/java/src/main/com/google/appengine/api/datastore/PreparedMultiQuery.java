// Copyright 2009 Google Inc. All Rights Reserved.

package com.google.appengine.api.datastore;

import static com.google.common.base.Preconditions.checkArgument;

import com.google.appengine.api.datastore.EntityProtoComparators.EntityProtoComparator;
import com.google.appengine.api.datastore.Query.FilterPredicate;
import com.google.appengine.api.datastore.Query.SortPredicate;
import com.google.apphosting.api.ApiProxy.ApiConfig;
import com.google.apphosting.api.DatastorePb.Query.Order;
import com.google.common.base.Function;
import com.google.common.base.Pair;
import com.google.common.collect.Iterables;
import com.google.common.collect.Iterators;
import com.google.common.collect.Lists;
import com.google.common.collect.Sets;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.Iterator;
import java.util.List;
import java.util.PriorityQueue;
import java.util.Set;

/**
 * A {@link PreparedQuery} implementation for use with {@link MultiQueryBuilder}.
 *
 * We run each successively generated list of filters returned by each
 * {@link MultiQueryBuilder} as they are needed and concatenate the result.
 *
 * If a list of filters contains more than one entry or there are multiple
 * {@link MultiQueryBuilder}s we build a {@link Comparator} based on the sort
 * predicates of the base query. We then use this {@link Comparator} to produce
 * an appropriately ordered sequence of results that contains the results from
 * each sub-query. As each sub-query produces results that are already sorted
 * we simply use a {@link PriorityQueue} to merge the results from the sub-query
 * as new results are requested.
 *
 */
class PreparedMultiQuery extends BasePreparedQuery {
  private final ApiConfig apiConfig;
  private final DatastoreServiceConfig datastoreServiceConfig;
  private final Query baseQuery;
  private final List<MultiQueryBuilder> queryBuilders;
  private final EntityComparator entityComparator;
  private final Transaction txn;
  private final Set<String> projected;

  /**
   * @param apiConfig the api config to use
   * @param datastoreServiceConfig the datastore service config to use
   * @param baseQuery the base query on which to apply generate filters filters
   * @param queryBuilders the source of filters to use
   * @param txn the txn in which all queries should execute, can be {@code null}
   *
   * @throws IllegalArgumentException if this multi-query required in memory
   * sorting and the base query is both a keys-only query and sorted by anything
   * other than its key.
   */
  PreparedMultiQuery(ApiConfig apiConfig, DatastoreServiceConfig datastoreServiceConfig,
      Query baseQuery, List<MultiQueryBuilder> queryBuilders, Transaction txn) {
    checkArgument(!queryBuilders.isEmpty());
    checkArgument(baseQuery.getFilter() == null);
    checkArgument(baseQuery.getFilterPredicates().isEmpty());
    this.apiConfig = apiConfig;
    this.datastoreServiceConfig = datastoreServiceConfig;
    this.txn = txn;
    this.baseQuery = baseQuery;
    this.queryBuilders = queryBuilders;

    if (baseQuery.getProjections().isEmpty()) {
      projected = Collections.emptySet();
    } else {
      projected = Sets.newHashSet();
      for (Projection proj : baseQuery.getProjections()) {
        projected.add(proj.getPropertyName());
      }
      if (!baseQuery.getSortPredicates().isEmpty()) {
        Set<String> localProjected = Sets.newHashSet(projected);
        for (SortPredicate sort : baseQuery.getSortPredicates()) {
          if (localProjected.add(sort.getPropertyName())) {
            baseQuery.addProjection(new PropertyProjection(sort.getPropertyName(), null));
          }
        }
      }
    }

    if (queryBuilders.size() > 1 || queryBuilders.get(0).getParallelQuerySize() > 1) {
      if (baseQuery.isKeysOnly()) {
        for (SortPredicate sp : baseQuery.getSortPredicates()) {
          if (!sp.getPropertyName().equals(Entity.KEY_RESERVED_PROPERTY)) {
            throw new IllegalArgumentException(
                "The provided keys-only multi-query needs to perform some " +
                "sorting in memory.  As a result, this query can only be " +
                "sorted by the key property as this is the only property " +
                "that is available in memory.");
          }
        }
      }
      this.entityComparator = new EntityComparator(baseQuery.getSortPredicates());
    } else {
      this.entityComparator = null;
    }
  }

  protected PreparedQuery prepareQuery(List<FilterPredicate> filters, boolean isCountQuery) {
    Query query = new Query(baseQuery);
    if (isCountQuery && query.getProjections().isEmpty()) {
      query.setKeysOnly();
    }

    query.getFilterPredicates().addAll(filters);
    return new PreparedQueryImpl(apiConfig, datastoreServiceConfig, query, txn);
  }

  protected Object getDedupeValue(Entity entity) {
    if (projected.isEmpty()) {
      return entity.getKey();
    } else {
      return Pair.of(entity.getKey(), entity.getProperties());
    }
  }

  /**
   * A helper function to prepare batches of queries.
   * @param filtersList list of the filters for each query to prepare
   * @return a list of prepared queries
   */
  protected List<PreparedQuery> prepareQueries(List<List<FilterPredicate>> filtersList) {
    List<PreparedQuery> preparedQueries = new ArrayList<PreparedQuery>(filtersList.size());
    for (List<FilterPredicate> filters : filtersList) {
      preparedQueries.add(prepareQuery(filters, false));
    }
    return preparedQueries;
  }

  /**
   * An iterator that will correctly process the values returned by a multiquery iterator.
   *
   * This iterator in some cases may not respect the provided FetchOptions.limit().
   */
  private class FilteredMultiQueryIterator extends AbstractIterator<Entity> {
    private final Iterator<List<List<FilterPredicate>>> multiQueryIterator;
    private final FetchOptions fetchOptions;
    private final Set<Object> seenUniqueValues;

    private Iterator<Entity> currentIterator = Iterators.emptyIterator();

    public FilteredMultiQueryIterator(MultiQueryBuilder queryBuilder, FetchOptions fetchOptions,
        Set<Object> seenUniqueValues) {
      this.multiQueryIterator = queryBuilder.iterator();
      this.fetchOptions = fetchOptions;
      this.seenUniqueValues = seenUniqueValues;
    }

    /**
     * Returns an iterator for the next source that has results or null if there are none.
     */
    Iterator<Entity> getNextIterator() {
      while (multiQueryIterator.hasNext()) {
        List<PreparedQuery> queries = prepareQueries(multiQueryIterator.next());

        Iterator<Entity> result;
        if (queries.size() == 1) {
          result = queries.get(0).asIterator(fetchOptions);
        } else {
          result = makeHeapIterator(Iterables.transform(queries,
              new Function<PreparedQuery, Iterator<Entity>>() {
                @Override
                public Iterator<Entity> apply(PreparedQuery input) {
                  return input.asIterator(fetchOptions);
                }
              }));
        }
        if (result.hasNext()) {
          return result;
        }
      }
      return null;
    }

    @Override
    protected Entity computeNext() {
      Entity result = null;
      do {
        if (!currentIterator.hasNext()) {
          currentIterator = getNextIterator();
          if (currentIterator == null) {
            return endOfData();
          }
        }
        result = currentIterator.next();
      } while (!seenUniqueValues.add(getDedupeValue(result)));

      if (!projected.isEmpty()) {
        for (String prop : result.getProperties().keySet()) {
          if (!projected.contains(prop)) {
            result.removeProperty(prop);
          }
        }
      }
      return result;
    }
  }

  static final class HeapIterator extends AbstractIterator<Entity> {
    private final PriorityQueue<EntitySource> heap;

    HeapIterator(PriorityQueue<EntitySource> heap) {
      this.heap = heap;
    }

    @Override
    protected Entity computeNext() {
      Entity result;
      result = nextResult(heap);
      if (result == null) {
        endOfData();
      }
      return result;
    }
  }

  Iterator<Entity> makeHeapIterator(Iterable<Iterator<Entity>> iterators) {
    final PriorityQueue<EntitySource> heap = new PriorityQueue<EntitySource>();
    for (Iterator<Entity> iter : iterators) {
      if (iter.hasNext()) {
        heap.add(new EntitySource(entityComparator, iter));
      }
    }
    return new HeapIterator(heap);
  }

  /**
   * Fetch the next result from the {@link PriorityQueue} and reset the
   * datasource from which the next result was taken.
   */
  static Entity nextResult(PriorityQueue<EntitySource> availableEntitySources) {
    EntitySource current = availableEntitySources.poll();
    if (current == null) {
      return null;
    }
    Entity result = current.currentEntity;
    current.advance();
    if (current.currentEntity != null) {
      availableEntitySources.add(current);
    } else {
    }
    return result;
  }

  /**
   * Data structure that we use in conjunction with the {@link PriorityQueue}.
   * It always compares using its {@code currentEntity} field by delegating to
   * its {@code entityComparator}.
   */
  static final class EntitySource implements Comparable<EntitySource> {
    private final EntityComparator entityComparator;
    private final Iterator<Entity> source;
    private Entity currentEntity;

    EntitySource(EntityComparator entityComparator, Iterator<Entity> source) {
      this.entityComparator = entityComparator;
      this.source = source;
      if (!source.hasNext()) {
        throw new IllegalArgumentException("Source iterator has no data.");
      }
      this.currentEntity = source.next();
    }

    private void advance() {
      currentEntity = source.hasNext() ? source.next() : null;
    }

    @Override
    public int compareTo(EntitySource entitySource) {
      return entityComparator.compare(currentEntity, entitySource.currentEntity);
    }
  }

  /**
   * Compares {@link Entity Entities} by delegating to an
   * {@link EntityProtoComparator}. The proto representation of all the entities
   * being compared is required to be available via
   * {@link Entity#getEntityProto()}.
   */
  static final class EntityComparator implements Comparator<Entity> {
    private final EntityProtoComparator delegate;

    EntityComparator(List<SortPredicate> sortPreds) {
      delegate = new EntityProtoComparator(sortPredicatesToOrders(sortPreds));
    }

    private static List<Order> sortPredicatesToOrders(List<SortPredicate> sortPreds) {
      List<Order> orders = new ArrayList<Order>();
      for (SortPredicate sp : sortPreds) {
        orders.add(QueryTranslator.convertSortPredicateToPb(sp));
      }
      return orders;
    }

    @Override
    public int compare(Entity e1, Entity e2) {
      return delegate.compare(e1.getEntityProto(), e2.getEntityProto());
    }
  }

  @Override
  public Entity asSingleEntity() throws TooManyResultsException {
    List<Entity> result = this.asList(FetchOptions.Builder.withLimit(2));
    if (result.size() == 1) {
      return result.get(0);
    } else if (result.size() > 1) {
      throw new TooManyResultsException();
    } else {
      return null;
    }
  }

  @Override
  public int countEntities(FetchOptions fetchOptions) {
    FetchOptions overrideOptions = new FetchOptions(fetchOptions);
    overrideOptions.chunkSize(Integer.MAX_VALUE);
    if (fetchOptions.getOffset() != null) {
      overrideOptions.clearOffset();
      if (fetchOptions.getLimit() != null) {
        int adjustedLimit = fetchOptions.getOffset() + fetchOptions.getLimit();
        if (adjustedLimit < 0) {
          overrideOptions.clearLimit();
        } else {
          overrideOptions.limit(adjustedLimit);
        }
      }
    }

    Set<Object> seen = Sets.newHashSet();

outer:
    for (MultiQueryBuilder queryBuilder : queryBuilders) {
      for (List<List<FilterPredicate>> filtersList : queryBuilder) {
        for (List<FilterPredicate> filters : filtersList) {
          PreparedQuery preparedQuery = prepareQuery(filters, true);
          Query query = new Query(baseQuery);
          if (query.getProjections().isEmpty()) {
            query.setKeysOnly();
          }
          for (Entity entity : preparedQuery.asIterable(overrideOptions)) {
            if (seen.add(getDedupeValue(entity)) &&
                overrideOptions.getLimit() != null && seen.size() >= overrideOptions.getLimit()) {
              break outer;
            }
          }
        }
      }
    }
    return fetchOptions.getOffset() == null ?
        seen.size() : Math.max(0, seen.size() - fetchOptions.getOffset());
  }

  @Override
  public Iterator<Entity> asIterator(FetchOptions fetchOptions) {

    if ((fetchOptions.getOffset() != null && fetchOptions.getOffset() > 0) ||
        fetchOptions.getLimit() != null) {
      FetchOptions override = new FetchOptions(fetchOptions);
      if (fetchOptions.getOffset() != null) {
        override.clearOffset();
        if (fetchOptions.getLimit() != null) {
          int adjustedLimit = fetchOptions.getOffset() + fetchOptions.getLimit();
          if (adjustedLimit < 0) {
            override.clearLimit();
          } else {
            override.limit(adjustedLimit);
          }
        }
      }
      return new SlicingIterator<Entity>(
          newIterator(override),
          fetchOptions.getOffset(),
          fetchOptions.getLimit());
    } else {
      return newIterator(fetchOptions);
    }
  }

  private Iterator<Entity> newIterator(FetchOptions fetchOptions) {
    Set<Object> dedupeSet = Sets.newHashSet();
    if (queryBuilders.size() == 1) {
      return new FilteredMultiQueryIterator(queryBuilders.get(0), fetchOptions, dedupeSet);
    }

    List<Iterator<Entity>> iterators = Lists.newArrayListWithCapacity(queryBuilders.size());
    for (MultiQueryBuilder queryBuilder : queryBuilders) {
      iterators.add(new FilteredMultiQueryIterator(queryBuilder, fetchOptions, dedupeSet));
    }

    return makeHeapIterator(iterators);
  }

  @Override
  public List<Entity> asList(FetchOptions fetchOptions) {
    FetchOptions override = new FetchOptions(fetchOptions);
    if (override.getChunkSize() == null) {
      override.chunkSize(Integer.MAX_VALUE);
    }

    List<Entity> results = new ArrayList<Entity>();
    for (Entity e : asIterable(override)) {
      results.add(e);
    }
    return results;
  }

  private static class NullQueryResult implements QueryResult {

    public static final NullQueryResult INSTANCE = new NullQueryResult();

    @Override
    public List<Index> getIndexList() {
      return null;
    }

    @Override
    public Cursor getCursor() {
      return null;
    }

  }

  @Override
  public QueryResultIterator<Entity> asQueryResultIterator(FetchOptions fetchOptions) {
    return new QueryResultIteratorDelegator<Entity>(new NullQueryResult(),
                                                    asIterator(fetchOptions));
  }

  @Override
  public QueryResultList<Entity> asQueryResultList(FetchOptions fetchOptions) {
    return new QueryResultListDelegator<Entity>(NullQueryResult.INSTANCE,
                                                asList(fetchOptions));
  }
}

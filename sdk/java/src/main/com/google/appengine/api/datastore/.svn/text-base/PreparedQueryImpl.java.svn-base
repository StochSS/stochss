// Copyright 2007 Google Inc. All rights reserved.

package com.google.appengine.api.datastore;

import static com.google.appengine.api.datastore.FetchOptions.Builder.withLimit;
import static com.google.common.base.Preconditions.checkArgument;

import com.google.appengine.api.datastore.CompositeIndexManager.IndexComponentsOnlyQuery;
import com.google.appengine.api.datastore.CompositeIndexManager.IndexSource;
import com.google.appengine.api.datastore.ReadPolicy.Consistency;
import com.google.appengine.api.utils.FutureWrapper;
import com.google.apphosting.api.ApiProxy.ApiConfig;
import com.google.apphosting.api.DatastorePb;
import com.google.storage.onestore.v3.OnestoreEntity;

import java.util.Iterator;
import java.util.List;
import java.util.concurrent.Future;

/**
 * Implements PreparedQuery.
 *
 */
class PreparedQueryImpl extends BasePreparedQuery {
  private final DatastoreServiceConfig datastoreServiceConfig;
  private final ApiConfig apiConfig;
  private final Query query;
  private final Transaction txn;

  public PreparedQueryImpl(ApiConfig apiConfig, DatastoreServiceConfig datastoreServiceConfig,
      Query query, Transaction txn) {
    this.apiConfig = apiConfig;
    this.datastoreServiceConfig = datastoreServiceConfig;
    this.query = query;
    this.txn = txn;

    checkArgument(query.getFilter() == null);
    checkArgument(txn == null || query.getAncestor() != null,
          "Only ancestor queries are allowed inside transactions.");
    TransactionImpl.ensureTxnActive(txn);
  }

  @Override
  public List<Entity> asList(FetchOptions fetchOptions) {
    return new LazyList(runQuery(query, fetchOptions));
  }

  @Override
  public QueryResultList<Entity> asQueryResultList(FetchOptions fetchOptions) {
    FetchOptions override = new FetchOptions(fetchOptions);
    if (override.getCompile() == null) {
      override.compile(true);
    }
    LazyList lazyList = new LazyList(runQuery(query, override));
    return lazyList;
  }

  @Override
  public Iterator<Entity> asIterator(FetchOptions fetchOptions) {
    return runQuery(query, fetchOptions);
  }

  @Override
  public QueryResultIterator<Entity> asQueryResultIterator(FetchOptions fetchOptions) {
    if (fetchOptions.getCompile() == null) {
      fetchOptions = new FetchOptions(fetchOptions).compile(true);
    }
    return runQuery(query, fetchOptions);
  }

  @Override
  public Entity asSingleEntity() throws TooManyResultsException {
    List<Entity> entities = asList(withLimit(2));
    if (entities.isEmpty()) {
      return null;
    } else if (entities.size() != 1) {
      throw new TooManyResultsException();
    }
    return entities.get(0);
  }

  @Override
  /**
   * Counts the number of entities in the result set.
   *
   * This method will run a query that will offset past all results and return
   * the number of results that have been skipped in the process.
   *
   * (offset, limit) is converted to (offset + limit, 0) so that no results are
   * actually returned. The resulting count is max(0, skipped - offset). This
   * is the number of entities in the range [offset, offset + limit) which is
   * the count.
   */
  public int countEntities(FetchOptions fetchOptions) {
    FetchOptions overrideOptions = new FetchOptions(fetchOptions);

    overrideOptions.limit(0);
    if (fetchOptions.getLimit() != null) {
      if (fetchOptions.getOffset() != null) {
        int offset = fetchOptions.getLimit() + fetchOptions.getOffset();
        overrideOptions.offset(offset >= 0 ? offset : Integer.MAX_VALUE);
      } else {
        overrideOptions.offset(fetchOptions.getLimit());
      }
    } else {
      overrideOptions.offset(Integer.MAX_VALUE);
    }

    int count = runQuery(query, overrideOptions).getNumSkipped();
    if (fetchOptions.getOffset() != null) {
      if (count < fetchOptions.getOffset()) {
        count = 0;
      } else {
        count = count - fetchOptions.getOffset();
      }
    }
    return count;
  }

  private QueryResultIteratorImpl runQuery(Query q, FetchOptions fetchOptions) {
    final DatastorePb.Query queryProto = convertToPb(q, fetchOptions);
    if (datastoreServiceConfig.getReadPolicy().getConsistency() == Consistency.EVENTUAL) {
      queryProto.setFailoverMs(DatastoreServiceImpl.ARBITRARY_FAILOVER_READ_MS);
      queryProto.setStrong(false);
    }

    Future<DatastorePb.QueryResult> result = DatastoreApiHelper.makeAsyncCall(
        apiConfig, "RunQuery", queryProto, new DatastorePb.QueryResult());

    result = new FutureWrapper<DatastorePb.QueryResult, DatastorePb.QueryResult>(result) {
      @Override
      protected Throwable convertException(Throwable cause) {
        if (cause instanceof DatastoreNeedIndexException) {
          addMissingIndexData(queryProto, (DatastoreNeedIndexException) cause);
        }
        return cause;
      }

      @Override
      protected DatastorePb.QueryResult wrap(DatastorePb.QueryResult result) throws Exception {
        return result;
      }
    };

    QueryResultsSourceImpl src = new QueryResultsSourceImpl(apiConfig,
        datastoreServiceConfig.getDatastoreCallbacks(), fetchOptions, txn, query, result);
    return new QueryResultIteratorImpl(this, src, fetchOptions, txn);
  }

  private void addMissingIndexData(
      DatastorePb.Query queryProto, DatastoreNeedIndexException e) {
    IndexComponentsOnlyQuery indexQuery = new IndexComponentsOnlyQuery(queryProto);
    CompositeIndexManager mgr = new CompositeIndexManager();
    OnestoreEntity.Index index = mgr.compositeIndexForQuery(indexQuery);
    if (index != null) {
      String xml = mgr.generateXmlForIndex(index, IndexSource.manual);
      e.setMissingIndexDefinitionXml(xml);
    } else {
    }
  }

  private DatastorePb.Query convertToPb(Query q, FetchOptions fetchOptions) {
    DatastorePb.Query queryProto = QueryTranslator.convertToPb(q, fetchOptions);
    if (txn != null) {
      TransactionImpl.ensureTxnActive(txn);
      queryProto.setTransaction(BaseDatastoreServiceImpl.localTxnToRemoteTxn(txn));
    }
    return queryProto;
  }

  @Override
  public String toString() {
    return query.toString() + (txn != null ? " IN " + txn : "");
  }
}

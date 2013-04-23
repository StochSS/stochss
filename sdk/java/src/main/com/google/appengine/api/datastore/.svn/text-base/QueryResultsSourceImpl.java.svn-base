// Copyright 2007 Google Inc. All rights reserved.

package com.google.appengine.api.datastore;

import static com.google.appengine.api.datastore.DatastoreApiHelper.makeAsyncCall;

import com.google.apphosting.api.ApiProxy.ApiConfig;
import com.google.apphosting.api.DatastorePb;
import com.google.apphosting.api.DatastorePb.NextRequest;
import com.google.storage.onestore.v3.OnestoreEntity.CompositeIndex;
import com.google.storage.onestore.v3.OnestoreEntity.EntityProto;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.concurrent.Future;
import java.util.concurrent.atomic.AtomicLong;
import java.util.logging.Logger;

/**
 * Concrete implementation of QueryResultsSource which knows how to
 * make callbacks back into the datastore to retrieve more entities
 * for the specified cursor.
 *
 */
class QueryResultsSourceImpl implements QueryResultsSource {
  static Logger logger = Logger.getLogger(QueryResultsSourceImpl.class.getName());
  private static final int AT_LEAST_ONE = -1;
  private static final String DISABLE_CHUNK_SIZE_WARNING_SYS_PROP =
      "appengine.datastore.disableChunkSizeWarning";
  private static final int CHUNK_SIZE_WARNING_RESULT_SET_SIZE_THRESHOLD = 1000;
  private static final long MAX_CHUNK_SIZE_WARNING_FREQUENCY_MS = 1000 * 60 * 5;
  static MonitoredIndexUsageTracker monitoredIndexUsageTracker = new MonitoredIndexUsageTracker();
  static final AtomicLong lastChunkSizeWarning = new AtomicLong(0);

  private final ApiConfig apiConfig;
  private final DatastoreCallbacks callbacks;
  private final int chunkSize;
  private final int offset;
  private final Transaction txn;
  private final Query query;
  private final CurrentTransactionProvider currentTransactionProvider;

  private Future<DatastorePb.QueryResult> queryResultFuture;
  private int skippedResults;
  private int totalResults = 0;
  private List<Index> indexList = null;

  public QueryResultsSourceImpl(ApiConfig apiConfig, DatastoreCallbacks callbacks,
      FetchOptions fetchOptions, Transaction txn, Query query,
      Future<DatastorePb.QueryResult> firstQueryResultFuture) {
    this.apiConfig = apiConfig;
    this.callbacks = callbacks;
    this.chunkSize = fetchOptions.getChunkSize() != null ?
        fetchOptions.getChunkSize() : AT_LEAST_ONE;
    this.offset = fetchOptions.getOffset() != null ?
        fetchOptions.getOffset() : 0;
    this.txn = txn;
    this.query = query;
    this.currentTransactionProvider = new CurrentTransactionProvider() {
      @Override
      public Transaction getCurrentTransaction(Transaction defaultValue) {
        return QueryResultsSourceImpl.this.txn;
      }
    };
    this.queryResultFuture = firstQueryResultFuture;
    this.skippedResults = 0;
  }

  @Override
  public boolean hasMoreEntities() {
    return (queryResultFuture != null);
  }

  @Override
  public int getNumSkipped() {
    return skippedResults;
  }

  @Override
  public List<Index> getIndexList() {
    if (indexList == null) {
      peekQueryResultAndIfFirstRecordIndexList();
    }
    return indexList;
  }

  @Override
  public Cursor loadMoreEntities(List<Entity> buffer) {
    return loadMoreEntities(AT_LEAST_ONE, buffer);
  }

  @Override
  public Cursor loadMoreEntities(int numberToLoad, List<Entity> buffer) {
    TransactionImpl.ensureTxnActive(txn);
    if (queryResultFuture != null) {
      if (numberToLoad == 0 &&
          offset <= skippedResults) {
        return null;
      }

      int previousSize = buffer.size();
      DatastorePb.QueryResult res = peekQueryResultAndIfFirstRecordIndexList();
      queryResultFuture = null;
      processQueryResult(res, buffer);

      if (res.isMoreResults()) {
        NextRequest req = new NextRequest();
        req.getMutableCursor().copyFrom(res.getCursor());
        if (res.hasCompiledCursor()) {
          req.setCompile(true);
        }

        boolean setCount = true;
        if (numberToLoad <= 0) {
          setCount = false;
          if (chunkSize != AT_LEAST_ONE) {
            req.setCount(chunkSize);
          }
          if (numberToLoad == AT_LEAST_ONE) {
            numberToLoad = 1;
          }
        }

        while (
            (skippedResults < offset ||
            buffer.size() - previousSize < numberToLoad) &&
            res.isMoreResults()) {
          if (skippedResults < offset) {
            req.setOffset(offset - skippedResults);
          } else {
            req.clearOffset();
          }
          if (setCount) {
            req.setCount(Math.max(chunkSize, numberToLoad - buffer.size() + previousSize));
          }
          queryResultFuture = makeAsyncCall(apiConfig, "Next", req,
                                            new DatastorePb.QueryResult());
          res = peekQueryResultAndIfFirstRecordIndexList();
          queryResultFuture = null;
          processQueryResult(res, buffer);
        }

        if (res.isMoreResults()) {
          if (chunkSize != AT_LEAST_ONE) {
            req.setCount(chunkSize);
          } else {
            req.clearCount();
          }
          req.clearOffset();
          queryResultFuture = makeAsyncCall(apiConfig, "Next", req, new DatastorePb.QueryResult());
        }
      }
      return res.hasCompiledCursor() ? new Cursor(res.getCompiledCursor()) : null;
    }
    return null;
  }

  private DatastorePb.QueryResult peekQueryResultAndIfFirstRecordIndexList() {
    DatastorePb.QueryResult res = FutureHelper.quietGet(queryResultFuture);
    if (indexList == null) {
      indexList = new ArrayList<Index>(res.indexSize());
      HashSet<Index> monitoredIndexes = null;
      for (CompositeIndex indexProtobuf : res.indexs()) {
        Index index =
            AsyncDatastoreServiceImpl.translateCompositeIndexProtobufToIndex(indexProtobuf);
        indexList.add(index);
        if (indexProtobuf.isOnlyUseIfRequired()) {
          if (monitoredIndexes == null) {
            monitoredIndexes = new HashSet<Index>();
          }
          monitoredIndexes.add(index);
        }
      }
      if (monitoredIndexes != null) {
        monitoredIndexUsageTracker.addNewUsage(monitoredIndexes, query);
      }
    }
    return res;
  }

  /**
   * Helper function to process the query results.
   *
   * This function adds results to the given buffer and updates {@link
   * #skippedResults}.
   *
   * @param res The {@link com.google.apphosting.api.DatastorePb.QueryResult} to process
   * @param buffer the buffer to which to add results
   */
  private void processQueryResult(DatastorePb.QueryResult res, List<Entity> buffer) {
    skippedResults += res.getSkippedResults();
    for (EntityProto entityProto : res.results()) {
      Entity entity;
      Collection<Projection> projections = query.getProjections();
      if (projections.isEmpty()) {
        entity = EntityTranslator.createFromPb(entityProto);
      } else {
        entity = EntityTranslator.createFromPb(entityProto, projections);
      }
      buffer.add(entity);
      PostLoadContext postLoadContext = new PostLoadContext(currentTransactionProvider, entity);
      callbacks.executePostLoadCallbacks(postLoadContext);
    }
    totalResults += res.resultSize();
    if (chunkSize == AT_LEAST_ONE && totalResults > CHUNK_SIZE_WARNING_RESULT_SET_SIZE_THRESHOLD &&
        System.getProperty(DISABLE_CHUNK_SIZE_WARNING_SYS_PROP) == null) {
      logChunkSizeWarning();
    }
  }

  void logChunkSizeWarning() {
    long now = System.currentTimeMillis();
    if ((now - lastChunkSizeWarning.get()) < MAX_CHUNK_SIZE_WARNING_FREQUENCY_MS) {
      return;
    }
    logger.warning(
        "This query does not have a chunk size set in FetchOptions and has returned over " +
            CHUNK_SIZE_WARNING_RESULT_SET_SIZE_THRESHOLD + " results.  If result sets of this "
            + "size are common for this query, consider setting a chunk size to improve "
            + "performance.\n  To disable this warning set the following system property in "
            + "appengine-web.xml (the value of the property doesn't matter): '"
            + DISABLE_CHUNK_SIZE_WARNING_SYS_PROP + "'");
    lastChunkSizeWarning.set(now);
  }
}

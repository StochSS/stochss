// Copyright 2011 Google Inc. All Rights Reserved.

package com.google.appengine.tools.remoteapi;

import com.google.appengine.api.datastore.DatastoreAttributes.DatastoreType;
import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.apphosting.api.ApiBasePb;
import com.google.apphosting.api.ApiProxy;
import com.google.apphosting.api.DatastorePb;
import com.google.storage.onestore.v3.OnestoreEntity;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * Contains handlers for calling the datastore via the remote API.
 *
 */
class RemoteDatastore {
  static final String DATASTORE_SERVICE = "datastore_v3";
  private static final String REMOTE_API_SERVICE = "remote_datastore";

  private final static Logger logger = Logger.getLogger(RemoteDatastore.class.getName());

  private final RemoteRpc remoteRpc;
  private final RemoteApiOptions options;
  private final String remoteAppId;

  private Boolean hrDatastoreKnown = false;
  private boolean hrDatastore;

  /**
   * Contains an entry for every query we've ever run.
   */
  private final Map<Long, QueryState> idToCursor = new ConcurrentHashMap<Long, QueryState>();

  /**
   * A counter used to allocate local cursor ids.
   */
  private final AtomicLong nextCursorId = new AtomicLong(1);

  /**
   * Contains an entry for each in-progress transaction.
   */
  private final Map<Long, TransactionBuilder> idToTransaction =
      new ConcurrentHashMap<Long, TransactionBuilder>();

  /**
   * A counter used to allocate transaction ids.
   */
  private final AtomicLong nextTransactionId = new AtomicLong(1);

  RemoteDatastore(RemoteRpc remoteRpc, RemoteApiOptions options) {
    this.remoteRpc = remoteRpc;
    this.options = options;
    this.remoteAppId = remoteRpc.getClient().getAppId();
  }

  byte[] handleDatastoreCall(String methodName, byte[] request) {
    if (methodName.equals("RunQuery")) {
      return handleRunQuery(request);
    } else if (methodName.equals("Next")) {
      return handleNext(request);
    } else if (methodName.equals("BeginTransaction")) {
      return handleBeginTransaction(request);
    } else if (methodName.equals("Commit")) {
      return handleCommit(request);
    } else if (methodName.equals("Rollback")) {
      return handleRollback(request);
    } else if (methodName.equals("Get")) {
      return handleGet(request);
    } else if (methodName.equals("Put")) {
      return handlePut(request);
    } else if (methodName.equals("Delete")) {
      return handleDelete(request);
    } else {
      return remoteRpc.call(DATASTORE_SERVICE, methodName, "", request);
    }
  }

  private byte[] handleRunQuery(byte[] request) {
    return runQuery(request, nextCursorId.getAndIncrement());
  }

  /**
   * Runs the query and remembers the current position using the given cursor id.
   */
  private byte[] runQuery(byte[] request, long localCursorId) {

    DatastorePb.Query query = new DatastorePb.Query();
    query.mergeFrom(request);

    if (rewriteQueryAppIds(query, remoteAppId)) {
      request = query.toByteArray();
    }
    query.setCompile(true);

    if (!query.hasCount()) {
      query.setCount(options.getDatastoreQueryFetchSize());
    }

    TransactionBuilder tx = null;
    if (query.hasTransaction()) {
      tx = getTransactionBuilder("RunQuery", query.getTransaction());
      query.clearTransaction();
    }

    DatastorePb.QueryResult result;
    if (tx != null && isHrDatastore()) {
      byte[] resultBytes = remoteRpc.call(REMOTE_API_SERVICE, "TransactionQuery", "",
                                          query.toByteArray());
      result = tx.handleQueryResult(resultBytes);
    } else {
      byte[] resultBytes = remoteRpc.call(DATASTORE_SERVICE, "RunQuery", "", query.toByteArray());

      result = new DatastorePb.QueryResult();
      result.mergeFrom(resultBytes);

      if (tx != null) {

        for (OnestoreEntity.EntityProto entity : result.results()) {
          tx.addEntityToCache(entity);
        }
      }
    }

    if (result.isMoreResults() && result.hasCompiledCursor()) {
      idToCursor.put(localCursorId, new QueryState(request, result.getCompiledCursor()));
    } else {
      idToCursor.put(localCursorId, QueryState.NO_MORE_RESULTS);
    }
    result.getMutableCursor().setCursor(localCursorId);

    return result.toByteArray();
  }

  private boolean isHrDatastore() {
    synchronized (hrDatastoreKnown) {
      if (!hrDatastoreKnown) {
        ApiProxy.setEnvironmentForCurrentThread(new ToolEnvironment(remoteAppId, "none"));
        DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
        DatastoreType type = datastore.getDatastoreAttributes().getDatastoreType();
        hrDatastore = type == DatastoreType.HIGH_REPLICATION;
        hrDatastoreKnown = true;
      }
      return hrDatastore;
    }
  }

  /**
   * Rewrite app ids in the Query pb.
   * @return if any app ids were rewritten
   */
  static boolean rewriteQueryAppIds(DatastorePb.Query query, String remoteAppId) {
    boolean reserialize = false;
    if (!query.getApp().equals(remoteAppId)) {
      reserialize = true;
      query.setApp(remoteAppId);
    }
    for (DatastorePb.Query.Filter filter : query.filters()) {
      for (OnestoreEntity.Property prop : filter.propertys()) {
        OnestoreEntity.PropertyValue propValue = prop.getMutableValue();
        if (propValue.hasReferenceValue()) {
          OnestoreEntity.PropertyValue.ReferenceValue ref = propValue.getMutableReferenceValue();
          if (!ref.getApp().equals(remoteAppId)) {
            reserialize = true;
            ref.setApp(remoteAppId);
          }
        }
      }
    }
    return reserialize;
  }

  private byte[] handleNext(byte[] request) {
    DatastorePb.NextRequest nextRequest = new DatastorePb.NextRequest();
    nextRequest.mergeFrom(request);

    long cursorId = nextRequest.getCursor().getCursor();
    QueryState queryState = idToCursor.get(cursorId);
    if (queryState == null) {
      throw new RemoteApiException("local cursor not found", DATASTORE_SERVICE, "Next", null);
    }

    if (!queryState.hasMoreResults()) {
      DatastorePb.QueryResult result = new DatastorePb.QueryResult();
      result.setMoreResults(false);
      return result.toByteArray();
    } else {
      return runQuery(queryState.makeNextQuery(nextRequest).toByteArray(), cursorId);
    }
  }

  private byte[] handleBeginTransaction(byte[] request) {

    DatastorePb.BeginTransactionRequest beginTxnRequest = new DatastorePb.BeginTransactionRequest();
    beginTxnRequest.parseFrom(request);

    long txId = nextTransactionId.getAndIncrement();
    idToTransaction.put(txId, new TransactionBuilder(beginTxnRequest.isAllowMultipleEg()));

    DatastorePb.Transaction tx = new DatastorePb.Transaction();
    tx.setHandle(txId);
    tx.setApp(remoteAppId);
    return tx.toByteArray();
  }

  private byte[] handleCommit(byte[] requestBytes) {
    DatastorePb.Transaction request = new DatastorePb.Transaction();
    request.mergeFrom(requestBytes);
    request.setApp(remoteAppId);
    TransactionBuilder tx = removeTransactionBuilder("Commit", request);

    remoteRpc.call(REMOTE_API_SERVICE, "Transaction", "", tx.makeCommitRequest().toByteArray());

    return new DatastorePb.CommitResponse().toByteArray();
  }

  private byte[] handleRollback(byte[] requestBytes) {
    DatastorePb.Transaction request = new DatastorePb.Transaction();
    request.mergeFrom(requestBytes);
    request.setApp(remoteAppId);
    removeTransactionBuilder("Rollback", request);

    return new ApiBasePb.VoidProto().toByteArray();
  }

  private byte[] handleGet(byte[] requestBytes) {
    DatastorePb.GetRequest request = new DatastorePb.GetRequest();
    request.mergeFrom(requestBytes);
    if (rewriteReferenceAppIds(request.mutableKeys(), remoteAppId)) {
      requestBytes = request.toByteArray();
    }

    if (request.hasTransaction()) {
      return handleGetForTransaction(request);
    } else {
      return remoteRpc.call(DATASTORE_SERVICE, "Get", "", requestBytes);
    }
  }

  private byte[] handlePut(byte[] requestBytes) {
    DatastorePb.PutRequest request = new DatastorePb.PutRequest();
    request.mergeFrom(requestBytes);
    boolean reserialize = rewritePutAppIds(request, remoteAppId);
    if (request.hasTransaction()) {
      return handlePutForTransaction(request);
    } else {
      if (reserialize) {
        requestBytes = request.toByteArray();
      }
      String suffix = "";
      if (logger.isLoggable(Level.FINE)) {
        suffix = describePutRequestForLog(request);
      }
      return remoteRpc.call(DATASTORE_SERVICE, "Put", suffix, requestBytes);
    }
  }

  static boolean rewritePutAppIds(DatastorePb.PutRequest request, String remoteAppId) {
    boolean reserialize = false;
    for (OnestoreEntity.EntityProto entity : request.mutableEntitys()) {
      if (!entity.getMutableKey().getApp().equals(remoteAppId)) {
        reserialize = true;
        entity.getMutableKey().setApp(remoteAppId);
      }
      for (OnestoreEntity.Property prop : entity.mutablePropertys()) {
        if (prop.hasValue() && prop.getMutableValue().hasReferenceValue()) {
          OnestoreEntity.PropertyValue.ReferenceValue ref =
              prop.getMutableValue().getReferenceValue();
          if (ref.hasApp() && !ref.getApp().equals(remoteAppId)) {
            reserialize = true;
            ref.setApp(remoteAppId);
          }
        }
      }
    }
    return reserialize;
  }

  private byte[] handleDelete(byte[] requestBytes) {
    DatastorePb.DeleteRequest request = new DatastorePb.DeleteRequest();
    request.mergeFrom(requestBytes);

    if (rewriteReferenceAppIds(request.mutableKeys(), remoteAppId)) {
      requestBytes = request.toByteArray();
    }
    if (request.hasTransaction()) {
      return handleDeleteForTransaction(request);
    } else {
      return remoteRpc.call(DATASTORE_SERVICE, "Delete", "", requestBytes);
    }
  }

  /**
   * Replace app ids in the list of references.
   */
  static boolean rewriteReferenceAppIds(
      List<OnestoreEntity.Reference> references, String remoteAppId) {
    boolean reserialize = false;
    for (OnestoreEntity.Reference ref : references) {
      if (!ref.getApp().equals(remoteAppId)) {
        reserialize = true;
        ref.setApp(remoteAppId);
      }
    }
    return reserialize;
  }

  byte[] handleGetForTransaction(DatastorePb.GetRequest request) {
    TransactionBuilder tx = getTransactionBuilder("Get", request.getTransaction());

    DatastorePb.GetRequest subRequest = new DatastorePb.GetRequest();
    for (OnestoreEntity.Reference key : request.keys()) {
      if (!tx.isCachedEntity(key)) {
        subRequest.addKey(key);
      }
    }

    if (subRequest.keySize() > 0) {
      byte[] subResponseBytes =
          remoteRpc.call(RemoteDatastore.DATASTORE_SERVICE, "Get", "", subRequest.toByteArray());

      DatastorePb.GetResponse subResponse = new DatastorePb.GetResponse();
      subResponse.mergeFrom(subResponseBytes);

      Iterator<OnestoreEntity.Reference> keys = request.keys().iterator();
      for (DatastorePb.GetResponse.Entity entityPb : subResponse.entitys()) {
        OnestoreEntity.Reference key = keys.next();
        if (entityPb.hasEntity()) {
          tx.addEntityToCache(entityPb.getEntity());
        } else {
          tx.addEntityAbsenceToCache(key);
        }
      }
    }

    DatastorePb.GetResponse mergedResponse = new DatastorePb.GetResponse();
    for (OnestoreEntity.Reference key : request.keys()) {
      OnestoreEntity.EntityProto entity = tx.getCachedEntity(key);

      if (entity == null) {
        mergedResponse.addEntity();
      } else {
        mergedResponse.addEntity().setEntity(entity);
      }
    }

    return mergedResponse.toByteArray();
  }

  byte[] handlePutForTransaction(DatastorePb.PutRequest request) {
    TransactionBuilder tx = getTransactionBuilder("Put", request.getTransaction());

    List<OnestoreEntity.EntityProto> entitiesWithoutIds =
        new ArrayList<OnestoreEntity.EntityProto>();
    for (OnestoreEntity.EntityProto entity : request.entitys()) {
      if (requiresId(entity)) {
        entitiesWithoutIds.add(entity);
      }
    }

    if (entitiesWithoutIds.size() > 0) {

      DatastorePb.PutRequest subRequest = new DatastorePb.PutRequest();
      for (OnestoreEntity.EntityProto entity : entitiesWithoutIds) {
        OnestoreEntity.EntityProto subEntity = subRequest.addEntity();
        subEntity.getKey().mergeFrom(entity.getKey());
        subEntity.getEntityGroup();
      }

      String getIdsRpc = tx.isXG() ? "GetIDsXG" : "GetIDs";
      byte[] subResponseBytes =
          remoteRpc.call(REMOTE_API_SERVICE, getIdsRpc, "", subRequest.toByteArray());
      DatastorePb.PutResponse subResponse = new DatastorePb.PutResponse();
      subResponse.mergeFrom(subResponseBytes);

      Iterator<OnestoreEntity.EntityProto> it = entitiesWithoutIds.iterator();
      for (OnestoreEntity.Reference newKey : subResponse.keys()) {
        OnestoreEntity.EntityProto entity = it.next();
        entity.getKey().copyFrom(newKey);
        entity.getEntityGroup().addElement().copyFrom(newKey.getPath().getElement(0));
      }
    }

    DatastorePb.PutResponse response = new DatastorePb.PutResponse();
    for (OnestoreEntity.EntityProto entityProto : request.entitys()) {
      tx.putEntityOnCommit(entityProto);
      response.addKey().copyFrom(entityProto.getKey());
    }
    return response.toByteArray();
  }

  byte[] handleDeleteForTransaction(DatastorePb.DeleteRequest request) {
    TransactionBuilder tx = getTransactionBuilder("Delete", request.getTransaction());

    for (OnestoreEntity.Reference key : request.keys()) {
      tx.deleteEntityOnCommit(key);
    }

    DatastorePb.DeleteResponse response = new DatastorePb.DeleteResponse();
    return response.toByteArray();
  }

  TransactionBuilder getTransactionBuilder(String methodName, DatastorePb.Transaction tx) {
    TransactionBuilder result = idToTransaction.get(tx.getHandle());
    if (result == null) {
      throw new RemoteApiException("transaction not found", DATASTORE_SERVICE, methodName, null);
    }
    return result;
  }

  TransactionBuilder removeTransactionBuilder(String methodName,
      DatastorePb.Transaction tx) {
    TransactionBuilder result = idToTransaction.remove(tx.getHandle());
    if (result == null) {
      throw new RemoteApiException("transaction not found", DATASTORE_SERVICE, methodName, null);
    }
    return result;
  }

  /**
   * Returns true if we need to auto-allocate an id for this entity.
   */
  private boolean requiresId(OnestoreEntity.EntityProto entity) {
    OnestoreEntity.Path path = entity.getKey().getPath();
    OnestoreEntity.Path.Element lastElement = path.elements().get(path.elementSize() - 1);
    return lastElement.getId() == 0 && !lastElement.hasName();
  }

  private static String describePutRequestForLog(DatastorePb.PutRequest putRequest) {
    int count = putRequest.entitySize();
    if (count <= 0) {
      return "()";
    }
    OnestoreEntity.Reference keyProto = putRequest.getEntity(0).getKey();
    if (count == 1) {
      return "(" + describeKeyForLog(keyProto) + ")";
    } else {
      return "(" + describeKeyForLog(keyProto) + ", ...)";
    }
  }

  private static String describeKeyForLog(OnestoreEntity.Reference keyProto) {
    StringBuilder pathString = new StringBuilder();
    OnestoreEntity.Path path = keyProto.getPath();
    for (OnestoreEntity.Path.Element element : path.elements()) {
      if (pathString.length() > 0) {
        pathString.append(",");
      }
      pathString.append(element.getType() + "/");
      if (element.hasId()) {
        pathString.append(element.getId());
      } else {
        pathString.append(element.getName());
      }
    }
    return "[" + pathString + "]";
  }

  /**
   * The current state of a remote query, allowing us to continue from previous
   * location. (We need to keep this locally because each round trip can be
   * executed on a different instance.)
   */
  private static class QueryState {
    private static final QueryState NO_MORE_RESULTS = new QueryState(null, null);

    private final byte[] query;
    private final DatastorePb.CompiledCursor cursor;

    /**
     * Creates a QueryState that can continue fetching results from a given cursor.
     * @param query  the query that was previously executed
     * @param cursor  the cursor that was returned after the previous remote call
     */
    QueryState(byte[] query, DatastorePb.CompiledCursor cursor) {
      this.query = query;
      this.cursor = cursor;
    }

    boolean hasMoreResults() {
      return query != null;
    }

    private DatastorePb.Query makeNextQuery(DatastorePb.NextRequest nextRequest) {
      DatastorePb.Query result = new DatastorePb.Query();
      result.mergeFrom(query);
      result.setOffset(0);
      result.setCompiledCursor(cursor);
      result.setCompile(true);

      if (nextRequest.hasCount()) {
        result.setCount(nextRequest.getCount());
      } else {
        result.clearCount();
      }
      return result;
    }
  }
}

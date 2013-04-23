// Copyright 2010 Google Inc. All Rights Reserved.

package com.google.appengine.tools.appstats;

import com.google.appengine.tools.appstats.StatsProtos.DatastoreCallDetailsProto;
import com.google.appengine.tools.appstats.StatsProtos.IndividualRpcStatsProto;
import com.google.apphosting.api.ApiStats;
import com.google.apphosting.api.DatastorePb;
import com.google.protobuf.bridge.ProtoConverter;
import com.google.storage.onestore.v3.OnestoreEntity;
import com.google.storage.onestore.v3.proto2api.OnestoreEntity.Reference;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.HashMap;
import java.util.Map;

/**
 * An intermediary class that holds recording-related fields that need to
 * be remembered until the protocol buffer can be completely populated.
 *
 */
class RecordingData {

  private static final Map<String, RpcCostCalculator> COST_CALCULATOR_MAP;

  static {
    RpcOperationCostManager costMgr = new StaticRpcOperationCostManager();
    COST_CALCULATOR_MAP = new HashMap<String, RpcCostCalculator>();
    DatastoreRpcCostCalculator.register(COST_CALCULATOR_MAP, costMgr);
    MailRpcCostCalculator.register(COST_CALCULATOR_MAP, costMgr);
    ChannelRpcCostCalculator.register(COST_CALCULATOR_MAP, costMgr);
    XMPPRpcCostCalculator.register(COST_CALCULATOR_MAP, costMgr);
  }

  private IndividualRpcStatsProto.Builder stats;
  private String packageName;
  private String methodName;
  private boolean calculateRpcCosts;
  private boolean datastoreDetails;
  private boolean wasSuccessful;
  private long durationMilliseconds;
  private Long apiMcyclesOrNull;
  private byte[] response;
  private Throwable exceptionOrError;
  private long overhead;
  private ApiStats apiStats;
  private boolean isProcessed;

  RecordingData(String packageName, String methodName, boolean calculateRpcCosts,
      boolean datastoreDetails) {
    setPackageName(packageName);
    setMethodName(methodName);
    setCalculateRpcCosts(calculateRpcCosts);
    setDatastoreDetails(datastoreDetails);
  }

  void setDatastoreDetails(boolean datastoreDetails) {
    this.datastoreDetails = datastoreDetails;
  }

  ApiStats getApiStats() {
    return apiStats;
  }
  void setApiStats(ApiStats apiStats) {
    this.apiStats = apiStats;
  }
  IndividualRpcStatsProto.Builder getStats() {
    return stats;
  }
  void setStats(IndividualRpcStatsProto.Builder stats) {
    this.stats = stats;
  }
  String getPackageName() {
    return packageName;
  }
  void setPackageName(String packageName) {
    this.packageName = packageName;
  }
  String getMethodName() {
    return methodName;
  }
  void setMethodName(String methodName) {
    this.methodName = methodName;
  }
  void setCalculateRpcCosts(boolean calculateRpcCosts) {
    this.calculateRpcCosts = calculateRpcCosts;
  }
  boolean isWasSuccessful() {
    return wasSuccessful;
  }
  void setWasSuccessful(boolean wasSuccessful) {
    this.wasSuccessful = wasSuccessful;
  }
  long getDurationMilliseconds() {
    return durationMilliseconds;
  }
  void setDurationMilliseconds(long durationMilliseconds) {
    this.durationMilliseconds = durationMilliseconds;
  }
  Long getApiMcyclesOrNull() {
    return apiMcyclesOrNull;
  }
  void setApiMcyclesOrNull(Long apiMcyclesOrNull) {
    this.apiMcyclesOrNull = apiMcyclesOrNull;
  }
  byte[] getResponse() {
    return response;
  }
  void setResponse(byte[] response) {
    this.response = response;
  }
  Throwable getExceptionOrError() {
    return exceptionOrError;
  }
  void setExceptionOrError(Throwable exceptionOrError) {
    this.exceptionOrError = exceptionOrError;
  }
  long getOverhead() {
    return overhead;
  }
  void addOverhead(long overhead) {
    this.overhead += overhead;
  }
  boolean isProcessed() {
    return isProcessed;
  }
  void setProcessed() {
    isProcessed = true;
  }

  /**
   * Using the data stored in the intermediary, populate the fields of the
   * stats protobuf that refer to successful (or unsuccessful) rpc execution.
   * @param payloadRenderer
   * @param request
   */
  void storeResultData(PayloadRenderer payloadRenderer, byte[] request) {
    stats.setWasSuccessful(wasSuccessful);
    stats.setDurationMilliseconds(durationMilliseconds);
    if (apiMcyclesOrNull != null) {
      stats.setApiMcycles(apiMcyclesOrNull);
    }
    if (response != null) {
      stats.setResponseDataSummary(
          payloadRenderer.renderPayload(packageName, methodName, response, false));
      RpcCostCalculator rcc = COST_CALCULATOR_MAP.get(packageName);
      if (rcc != null && calculateRpcCosts) {
        RpcCostCalculator.RpcCost rpcCost = rcc.determineCost(methodName, request, response);
        stats.setCallCostMicrodollars(rpcCost.getCostMicropennies());
        for (StatsProtos.BilledOpProto billedOpProto : rpcCost.getBilledOps()) {
          stats.addBilledOps(billedOpProto);
        }
      }
      if (datastoreDetails && (packageName.equals("datastore_v3"))) {
        recordDatastoreDetails(request);
      }
    }
    if (exceptionOrError != null) {
      StringWriter stackTrace = new StringWriter();
      exceptionOrError.printStackTrace(new PrintWriter(stackTrace));
      stats.setResponseDataSummary(stackTrace.toString());
    }
  }

  /**
   * Records entity information relating to datastore related RPCs.
   *
   * Parses requests and responses of datastore related RPCs, and records the primary keys of
   * entities that are put into the datastore or fetched from the datastore. Non-datastore RPCs are
   * ignored. Keys are recorded in the form of Reference protos. Currently the information is logged
   * for the following calls: Get, Put, RunQuery and Next. The code may be extended in the future to
   * cover more RPC calls. In addition to the entity keys, useful information specific to each call
   * is recorded. E.g., for queries, the entity kind and cursor information is recorded; For gets, a
   * flag indicating if the requested entity key is present or not is recorded. Args: request: The
   * request protocol message corresponding to the call.
   */
  void recordDatastoreDetails(byte[] request) {
    if (methodName.equals("Put")) {
      recordPutDetails();
    } else if (methodName.equals("RunQuery") || methodName.equals("Next")) {
      recordQueryDetails(request);
    } else if (methodName.equals("Get")) {
      recordGetDetails(request);
    }
  }

  /**
   * Records keys of entities written by datastore put calls.
   */
  void recordPutDetails() {
    DatastoreCallDetailsProto.Builder details = stats.getDatastoreDetailsBuilder();
    DatastorePb.PutResponse resultResponse = new DatastorePb.PutResponse();
    resultResponse.mergeFrom(response);
    ProtoConverter<OnestoreEntity.Reference, Reference> bridge = protoConverter();

    for (OnestoreEntity.Reference key : resultResponse.keys()) {
      details.addKeysWritten(bridge.doForward(key));
    }
  }

  /**
   * Records keys of entities requested by datastore gets. Also records if each requested key was
   * sucessfully fetched.
   *
   * @param request: The request protocol message of the Get RPC call.
   */
  void recordGetDetails(byte[] request) {

    DatastoreCallDetailsProto.Builder details = stats.getDatastoreDetailsBuilder();
    DatastorePb.GetRequest getRequest = new DatastorePb.GetRequest();
    getRequest.mergeFrom(request);
    DatastorePb.GetResponse resultResponse = new DatastorePb.GetResponse();
    resultResponse.mergeFrom(response);
    ProtoConverter<OnestoreEntity.Reference, Reference> bridge = protoConverter();

    for (OnestoreEntity.Reference key : getRequest.keys()) {
      details.addKeysRead(bridge.doForward(key));
    }

    for (DatastorePb.GetResponse.Entity entity : resultResponse.entitys()) {
      details.addGetSuccessfulFetch(entity.hasEntity());
    }
  }

  /**
   * Records keys of entities fetched by a Datastore query.
   *
   * Information is recorded for both the RunQuery and Next calls. For RunQuery calls, we record the
   * entity kind and ancestor (if applicable) and cursor information (which can help correlate the
   * RunQuery with a subsequent Next call). For Next calls, we record cursor information of the
   * Request (which helps associate this call with the previous RunQuery/Next call), and the
   * Response (which helps associate this call with the subsequent Next call). For key only queries,
   * entity keys are not recorded since entities are not actually fetched. In the future, we might
   * want to record the entities but also record a flag indicating whether this is a key only
   * query.
   *
   * @param request: The request protocol message of the RPC call.
   */
  void recordQueryDetails(byte[] request) {

    DatastoreCallDetailsProto.Builder details = stats.getDatastoreDetailsBuilder();
    DatastorePb.QueryResult queryResponse = new DatastorePb.QueryResult();
    queryResponse.mergeFrom(response);
    ProtoConverter<OnestoreEntity.Reference, Reference> bridge = protoConverter();

    if (!queryResponse.isKeysOnly()) {
      for (OnestoreEntity.EntityProto entity : queryResponse.results()) {
        details.addKeysRead(bridge.doForward(entity.getKey()));
      }
    }
    if (methodName.equals("RunQuery")) {
      DatastorePb.Query queryRequest = new DatastorePb.Query();
      queryRequest.mergeFrom(request);
      if (queryRequest.hasKind()) {
        details.setQueryKind(queryRequest.getKind());
      }
      if (queryRequest.hasAncestor()) {
        details.setQueryAncestor(bridge.doForward(queryRequest.getAncestor()));
      }
      if (queryResponse.hasCursor()) {
        details.setQueryNextcursor(queryResponse.getCursor().getCursor());
      }
    } else if (methodName.equals("Next")) {
      DatastorePb.NextRequest nextRequest = new DatastorePb.NextRequest();
      nextRequest.mergeFrom(request);
      details.setQueryThiscursor(nextRequest.getCursor().getCursor());
      if (queryResponse.hasCursor()) {
        details.setQueryNextcursor(queryResponse.getCursor().getCursor());
      }
    }
  }

  /**
   * @return a proto converter utility from proto1 to proto2 for Reference pb.
   */
  private ProtoConverter<OnestoreEntity.Reference, Reference> protoConverter() {
    return ProtoConverter.forProtos(
        OnestoreEntity.Reference.getDefaultInstance(), Reference.getDefaultInstance());

  }
}

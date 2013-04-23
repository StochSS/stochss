// Copyright 2012 Google Inc. All Rights Reserved.
package com.google.appengine.tools.appstats;

import com.google.appengine.tools.appstats.StatsProtos.BilledOpProto;
import com.google.appengine.tools.appstats.StatsProtos.BilledOpProto.BilledOp;
import static com.google.appengine.tools.appstats.StatsProtos.BilledOpProto.BilledOp.DATASTORE_READ;
import static com.google.appengine.tools.appstats.StatsProtos.BilledOpProto.BilledOp.DATASTORE_SMALL;
import static com.google.appengine.tools.appstats.StatsProtos.BilledOpProto.BilledOp.DATASTORE_WRITE;

import com.google.apphosting.api.DatastorePb;
import com.google.common.collect.ImmutableMap;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * {@link RpcCostCalculator} implementation for the Datastore API.
 *
 */
class DatastoreRpcCostCalculator implements RpcCostCalculator {

  private static final String PKG = "datastore_v3";

  private final Map<String, RpcCostCalculator> methodMap = new HashMap<String, RpcCostCalculator>();

  private final long readCostMicropennies;
  private final long writeCostMicropennies;
  private final long smallOpCostMicropennies;

  DatastoreRpcCostCalculator(long readCostMicropennies, long writeCostMicropennies,
      long smallOpCostMicropennies) {
    this.readCostMicropennies = readCostMicropennies;
    this.writeCostMicropennies = writeCostMicropennies;
    this.smallOpCostMicropennies = smallOpCostMicropennies;
    methodMap.put("Get", new GetCostCalculator());
    methodMap.put("Put", new PutCostCalculator());
    methodMap.put("Delete", new DeleteCostCalculator());
    methodMap.put("Commit", new CommitCostCalculator());
    methodMap.put("RunQuery", new RunQueryCostCalculator());
    methodMap.put("Next", new NextCostCalculator());
    methodMap.put("AllocateIds", new AllocateIdsCostCalculator());
  }

  @Override
  public RpcCost determineCost(String methodName, byte[] request, byte[] response) {
    RpcCostCalculator calculator = methodMap.get(methodName);
    if (calculator == null) {
      return FREE;
    }
    return calculator.determineCost(methodName, request, response);
  }

  static void register(
      Map<String, RpcCostCalculator> costCalculatorMap, RpcOperationCostManager opCostMgr) {
    costCalculatorMap.put(PKG, new DatastoreRpcCostCalculator(
        opCostMgr.costOf(DATASTORE_READ),
        opCostMgr.costOf(DATASTORE_WRITE),
        opCostMgr.costOf(DATASTORE_SMALL)));
  }

  static RpcCost newRpcCost(long costMicropennies, int numOps, BilledOp billedOp) {
    return newRpcCost(costMicropennies, ImmutableMap.of(billedOp, numOps));
  }

  static RpcCost newRpcCost(long costMicropennies, Map<BilledOp, Integer> billedOpMap) {
    List<BilledOpProto> billedOpProtos = new ArrayList<BilledOpProto>();
    for (Map.Entry<BilledOp, Integer> entry : billedOpMap.entrySet()) {
      if (entry.getValue() > 0) {
        billedOpProtos.add(
            BilledOpProto.newBuilder().setNumOps(entry.getValue()).setOp(entry.getKey()).build());
      }
    }
    return new RpcCost(costMicropennies, billedOpProtos);
  }

  RpcCost billForReadOps(int reads) {
    return newRpcCost(readCostMicropennies * reads, reads, DATASTORE_READ);
  }

  RpcCost billForSmallOps(int smallOps) {
    return newRpcCost(smallOpCostMicropennies * smallOps, smallOps, DATASTORE_SMALL);
  }

  RpcCost billForWriteOps(int writeOps) {
    return newRpcCost(writeCostMicropennies * writeOps, writeOps, DATASTORE_WRITE);
  }

  /**
   * {@link RpcCostCalculator} for the Get RPC in the Datastore API.
   */
  private class GetCostCalculator implements RpcCostCalculator {

    @Override
    public RpcCost determineCost(String methodName, byte[] request, byte[] response) {
      DatastorePb.GetRequest proto = new DatastorePb.GetRequest();
      proto.parseFrom(request);
      return billForReadOps(proto.keySize());
    }
  }

  /**
   * {@link RpcCostCalculator} for the Put RPC in the Datastore API.
   */
  private class PutCostCalculator implements RpcCostCalculator {

    @Override
    public RpcCost determineCost(String methodName, byte[] request, byte[] response) {
      DatastorePb.PutResponse proto = new DatastorePb.PutResponse();
      proto.parseFrom(response);
      int writes = proto.getCost().getEntityWrites() + proto.getCost().getIndexWrites();
      return billForWriteOps(writes);
    }
  }

  /**
   * {@link RpcCostCalculator} for the Delete RPC in the Datastore API.
   */
  private class DeleteCostCalculator implements RpcCostCalculator {

    @Override
    public RpcCost determineCost(String methodName, byte[] request, byte[] response) {
      DatastorePb.DeleteResponse proto = new DatastorePb.DeleteResponse();
      proto.parseFrom(response);
      int writes = proto.getCost().getEntityWrites() + proto.getCost().getIndexWrites();
      return billForWriteOps(writes);
    }
  }

  /**
   * {@link RpcCostCalculator} for the Commit RPC in the Datastore API.
   */
  private class CommitCostCalculator implements RpcCostCalculator {

    @Override
    public RpcCost determineCost(String methodName, byte[] request, byte[] response) {
      DatastorePb.CommitResponse proto = new DatastorePb.CommitResponse();
      proto.parseFrom(response);
      DatastorePb.Cost costProto = proto.getCost();
      int writes = costProto.getCommitCost().getRequestedEntityPuts() +
                   costProto.getCommitCost().getRequestedEntityDeletes() +
                   costProto.getIndexWrites();
      return billForWriteOps(writes);
    }
  }

  /**
   * {@link RpcCostCalculator} for query-related rpcs in the Datastore API.
   */
  private abstract class QueryCostCalculator implements RpcCostCalculator {

    @Override
    public RpcCost determineCost(String methodName, byte[] request, byte[] response) {
      DatastorePb.QueryResult proto = new DatastorePb.QueryResult();
      proto.parseFrom(response);
      int numResults = proto.resultSize() + proto.getSkippedResults();
      int baselineReads = getBaselineReads();
      long costMicropennies = readCostMicropennies * baselineReads;
      if (proto.isKeysOnly()) {
        costMicropennies += smallOpCostMicropennies * numResults;
        return newRpcCost(costMicropennies,
            ImmutableMap.of(DATASTORE_READ, baselineReads, DATASTORE_SMALL, numResults));
      } else {
        costMicropennies += readCostMicropennies * numResults;
        return newRpcCost(costMicropennies, numResults + baselineReads, DATASTORE_READ);
      }
    }

    abstract int getBaselineReads();
  }

  /**
   * {@link RpcCostCalculator} for the RunQuery RPC in the Datastore API.
   */
  private class RunQueryCostCalculator extends QueryCostCalculator {

    @Override
    int getBaselineReads() {
      return 1;
    }
  }

  /**
   * {@link RpcCostCalculator} for the Next RPC in the Datastore API.
   */
  private class NextCostCalculator extends QueryCostCalculator {

    @Override
    int getBaselineReads() {
      return 0;
    }
  }

  /**
   * {@link RpcCostCalculator} for the AllocateIds RPC in the Datastore API.
   */
  private class AllocateIdsCostCalculator implements RpcCostCalculator {

    private final RpcCost cost;

    AllocateIdsCostCalculator() {
      this.cost = billForSmallOps(1);
    }

    @Override
    public RpcCost determineCost(String methodName, byte[] request, byte[] response) {
      return cost;
    }
  }
}

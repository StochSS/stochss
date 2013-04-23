// Copyright 2012 Google Inc. All Rights Reserved.
package com.google.appengine.tools.appstats;

import com.google.appengine.tools.appstats.StatsProtos.BilledOpProto;
import com.google.common.base.Preconditions;
import com.google.common.collect.Lists;

import java.util.Collections;
import java.util.List;

/**
 * Describes an object that can calculate the cost of an rpc.
 *
 */
interface RpcCostCalculator {
 RpcCost determineCost(String methodName, byte[] request, byte[] response);

  /**
   * Data object that describes the cost of a single RPC. We maintain two pieces
   * of information. First, the cost of the RPC in micropennies, second a list
   * of {@link BilledOpProto BilledOpProtos} that describe the billed
   * operations we executed.
   */
  final class RpcCost {
    private final long costMicroPennies;
    private final List<BilledOpProto> billedOps;

    public RpcCost(long costMicroPennies, List<BilledOpProto> billedOps) {
      this.costMicroPennies = costMicroPennies;
      this.billedOps = Collections.unmodifiableList(
          Preconditions.checkNotNull(billedOps, "billedOps cannot be null"));
    }

    public long getCostMicropennies() {
      return costMicroPennies;
    }

    public List<StatsProtos.BilledOpProto> getBilledOps() {
      return billedOps;
    }

    @Override
    public boolean equals(Object o) {
      if (this == o) {
        return true;
      }
      if (o == null || getClass() != o.getClass()) {
        return false;
      }

      RpcCost rpcCost = (RpcCost) o;

      if (costMicroPennies != rpcCost.costMicroPennies) {
        return false;
      }
      if (!billedOps.equals(rpcCost.billedOps)) {
        return false;
      }

      return true;
    }

    @Override
    public int hashCode() {
      int result = (int) (costMicroPennies ^ (costMicroPennies >>> 32));
      result = 31 * result + (billedOps != null ? billedOps.hashCode() : 0);
      return result;
    }

    @Override
    public String toString() {
      return "RpcCost{" +
          "costMicropennies=" + costMicroPennies +
          ", billedOps=" + billedOps +
          '}';
    }
  }

  RpcCost FREE = new RpcCost(0, Lists.<BilledOpProto>newArrayList());
}

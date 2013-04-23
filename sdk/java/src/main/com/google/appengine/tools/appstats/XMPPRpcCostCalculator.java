// Copyright 2012 Google Inc. All Rights Reserved.
package com.google.appengine.tools.appstats;

import static com.google.appengine.tools.appstats.StatsProtos.BilledOpProto.BilledOp.XMPP_STANZA;

import com.google.appengine.api.xmpp.XMPPServicePb;

import java.util.Arrays;
import java.util.Map;

/**
 * {@link RpcCostCalculator} implementation for the XMPP API.
 *
 */
class XMPPRpcCostCalculator implements RpcCostCalculator {

  private static final String PKG = "xmpp";

  private final long costPerStanzaMicropennies;
  private final StatsProtos.BilledOpProto singleCostOpProto =
      StatsProtos.BilledOpProto.newBuilder().setNumOps(1).setOp(XMPP_STANZA).build();

  XMPPRpcCostCalculator(long costPerStanzaMicropennies) {
    this.costPerStanzaMicropennies = costPerStanzaMicropennies;
  }

  @Override
  public RpcCost determineCost(String methodName, byte[] request, byte[] response) {
    if (methodName.equals("SendMessage")) {
      XMPPServicePb.XmppMessageRequest proto = new XMPPServicePb.XmppMessageRequest();
      proto.parseFrom(request);
      StatsProtos.BilledOpProto billedOpProto = StatsProtos.BilledOpProto.newBuilder()
          .setNumOps(proto.jidSize()).setOp(XMPP_STANZA).build();
      return new RpcCost(costPerStanzaMicropennies * proto.jidSize(), Arrays.asList(billedOpProto));
    } else if (methodName.equals("GetPresence") || methodName.equals("SendPresence") ||
               methodName.equals("SendInvite")) {
      return new RpcCost(costPerStanzaMicropennies, Arrays.asList(singleCostOpProto));
    }
    return FREE;
  }

  static void register(
      Map<String, RpcCostCalculator> costCalculatorMap, RpcOperationCostManager opCostMgr) {
    costCalculatorMap.put(PKG, new XMPPRpcCostCalculator(opCostMgr.costOf(XMPP_STANZA)));
  }
}

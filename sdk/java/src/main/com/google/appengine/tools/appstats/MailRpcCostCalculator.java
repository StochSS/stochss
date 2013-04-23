// Copyright 2012 Google Inc. All Rights Reserved.
package com.google.appengine.tools.appstats;

import com.google.appengine.api.mail.MailServicePb;

import static com.google.appengine.tools.appstats.StatsProtos.BilledOpProto.BilledOp.MAIL_RECIPIENT;

import java.util.Arrays;
import java.util.Map;

/**
 * {@link RpcCostCalculator} implementation for the Mail API.
 *
 */
class MailRpcCostCalculator implements RpcCostCalculator {

  private static final String PKG = "mail";

  private final long recipientCostMicropennies;

  MailRpcCostCalculator(long recipientCostMicropennies) {
    this.recipientCostMicropennies = recipientCostMicropennies;
  }

  @Override
  public RpcCost determineCost(String methodName, byte[] request, byte[] response) {
    if (methodName.equals("Send") || methodName.equals("SendToAdmin")) {
      MailServicePb.MailMessage proto = new MailServicePb.MailMessage();
      proto.parseFrom(request);
      int numRecipients = proto.toSize() + proto.ccSize() + proto.bccSize();
      StatsProtos.BilledOpProto billedOpProto = StatsProtos.BilledOpProto.newBuilder()
          .setNumOps(numRecipients).setOp(MAIL_RECIPIENT).build();
      return new RpcCost(recipientCostMicropennies * numRecipients, Arrays.asList(billedOpProto));
    }
    return FREE;
  }

  static void register(
      Map<String, RpcCostCalculator> costCalculatorMap, RpcOperationCostManager opCostMgr) {
    costCalculatorMap.put(PKG, new MailRpcCostCalculator(opCostMgr.costOf(MAIL_RECIPIENT)));
  }
}

// Copyright 2012 Google Inc. All Rights Reserved.
package com.google.appengine.tools.appstats;

import static com.google.appengine.tools.appstats.StatsProtos.BilledOpProto.BilledOp.CHANNEL_OPEN;
import static com.google.appengine.tools.appstats.StatsProtos.BilledOpProto.BilledOp.CHANNEL_PRESENCE;
import static com.google.appengine.tools.appstats.StatsProtos.BilledOpProto.BilledOp.DATASTORE_READ;
import static com.google.appengine.tools.appstats.StatsProtos.BilledOpProto.BilledOp.DATASTORE_SMALL;
import static com.google.appengine.tools.appstats.StatsProtos.BilledOpProto.BilledOp.DATASTORE_WRITE;
import static com.google.appengine.tools.appstats.StatsProtos.BilledOpProto.BilledOp.MAIL_RECIPIENT;
import static com.google.appengine.tools.appstats.StatsProtos.BilledOpProto.BilledOp.XMPP_STANZA;

import com.google.appengine.tools.appstats.StatsProtos.BilledOpProto.BilledOp;
import com.google.common.collect.Maps;

import java.util.Map;

/**
 * {@link RpcOperationCostManager} implementation with all the costs hard-coded.
 *
 */
class StaticRpcOperationCostManager implements RpcOperationCostManager {

  private static final long MILLION = 1000000;
  private static final long PER_HUNDRED_THOUSAND = MILLION / 100000;
  private static final long PER_THOUSAND = MILLION / 1000;
  private static final long PER_HUNDRED = MILLION / 100;

  static final Map<BilledOp, Long> COST_MAP;

  static {
    COST_MAP = Maps.newHashMap();

    COST_MAP.put(DATASTORE_READ, perHundredThousand(7));

    COST_MAP.put(DATASTORE_WRITE, perHundredThousand(10));

    COST_MAP.put(DATASTORE_SMALL, perHundredThousand(1));

    COST_MAP.put(MAIL_RECIPIENT, perThousand(1));

    COST_MAP.put(CHANNEL_OPEN, perHundred(1));

    COST_MAP.put(CHANNEL_PRESENCE, perHundredThousand(10));

    COST_MAP.put(XMPP_STANZA, perHundredThousand(10));
  }

  private static long perHundredThousand(long centsPerHundredThousand) {
    return centsPerHundredThousand * PER_HUNDRED_THOUSAND;

  }

  private static long perThousand(long centsPerThousand) {
    return centsPerThousand * PER_THOUSAND;

  }

  private static long perHundred(long centsPerHundred) {
    return centsPerHundred * PER_HUNDRED;

  }

  @Override
  public long costOf(BilledOp op) {
    return COST_MAP.get(op);
  }
}

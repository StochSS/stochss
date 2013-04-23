// Copyright 2009 Google Inc. All Rights Reserved.

package com.google.appengine.tools.appstats;

import com.google.appengine.api.memcache.Expiration;
import com.google.appengine.api.memcache.MemcacheService;
import com.google.appengine.api.memcache.MemcacheServiceException;
import com.google.appengine.tools.appstats.Recorder.Clock;
import com.google.appengine.tools.appstats.StatsProtos.AggregateRpcStatsProto;
import com.google.appengine.tools.appstats.StatsProtos.BilledOpProto;
import com.google.appengine.tools.appstats.StatsProtos.BilledOpProto.BilledOp;
import com.google.appengine.tools.appstats.StatsProtos.IndividualRpcStatsProto;
import com.google.appengine.tools.appstats.StatsProtos.RequestStatProto;
import com.google.appengine.tools.appstats.StatsProtos.RequestStatProto.Builder;
import com.google.apphosting.api.ApiProxy.Delegate;
import com.google.apphosting.api.ApiProxy.Environment;
import com.google.common.collect.Maps;
import com.google.protobuf.InvalidProtocolBufferException;
import com.google.protobuf.Descriptors.FieldDescriptor;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.servlet.http.HttpServletRequest;

/**
 * Persists stats information in memcache. Can also be used to access that data
 * again. This class is thread-safe, assuming that the underlying MemcacheService
 * is.
 *
 */
class MemcacheWriter implements Recorder.RecordWriter {

  private static final int FIRST_FIELD_NUMBER_FOR_DETAILS = 100;

  private static final String KEY_PREFIX = "__appstats__";

  private static final String KEY_TEMPLATE = ":%06d";

  private static final String PART_SUFFIX = ":part";

  private static final String FULL_SUFFIX = ":full";

  private static final int KEY_DISTANCE = 100;

  private static final int KEY_MODULUS = 1000;

  static final int MAX_SIZE = 1000000;

  private static final int EXPIRATION_SECONDS = 36 * 3600;

  public static final String STATS_NAMESPACE = "__appstats__";

  private static String makeKeyPrefix(long timestamp) {
    return String.format(
        KEY_PREFIX + KEY_TEMPLATE,
        ((timestamp / KEY_DISTANCE) % KEY_MODULUS) * KEY_DISTANCE);
  }

  protected final Logger log = Logger.getLogger(getClass().getName());
  private final Recorder.Clock clock;

  String keyInCache;

  private final MemcacheService statsMemcache;

  public MemcacheWriter(Clock clock, MemcacheService service) {
    this.clock = clock;
    this.keyInCache = getClass().getName() + ".CACHED_STATS";
    this.statsMemcache = service;
    if (service == null) {
      throw new NullPointerException("Memcache service not found");
    }
  }

  @Override
  public final Long begin(
      Delegate<?> wrappedDelegate, Environment environment, HttpServletRequest request) {
    long beganAt = clock.currentTimeMillis();

    RequestStatProto.Builder builder = RequestStatProto.newBuilder();
    builder.setStartTimestampMilliseconds(beganAt);
    builder.setHttpMethod(request.getMethod());
    builder.setHttpPath(request.getRequestURI());
    String queryUnescaped = request.getQueryString();
    if (queryUnescaped != null && queryUnescaped.length() > 0) {
      builder.setHttpQuery("?" + queryUnescaped);
    }

    builder.setIsAdmin(environment.isAdmin());
    if (environment.getEmail() != null) {
      builder.setUserEmail(environment.getEmail());
    }

    builder.setOverheadWalltimeMilliseconds(clock.currentTimeMillis() - beganAt);
    environment.getAttributes().put(keyInCache, builder);
    return beganAt;
  }

  @Override
  public final boolean commit(
      Delegate<?> wrappedDelegate, Environment environment, Integer responseCode) {

    RequestStatProto.Builder builder =
      (RequestStatProto.Builder) environment.getAttributes().get(keyInCache);
    if (builder == null) {
      return false;
    }

    builder.setDurationMilliseconds(
        clock.currentTimeMillis() - builder.getStartTimestampMilliseconds());

    if (responseCode != null) {
      builder.setHttpStatus(responseCode);
    } else {
      builder.clearHttpStatus();
    }

    Map<String, AggregateRpcStatsProto.Builder> aggregates =
        new HashMap<String, AggregateRpcStatsProto.Builder>();
    for (IndividualRpcStatsProto stat : builder.getIndividualStatsList()) {
      String key = stat.getServiceCallName();
      if (!aggregates.containsKey(key)) {
        AggregateRpcStatsProto.Builder aggregate = AggregateRpcStatsProto.newBuilder()
            .setServiceCallName(stat.getServiceCallName())
            .setTotalAmountOfCalls(0L);
        if (stat.hasCallCostMicrodollars()) {
          aggregate.setTotalCostOfCallsMicrodollars(0L);
        }
        aggregates.put(key, aggregate);
      }
      Map<BilledOp, BilledOpProto.Builder> billedOpMap = Maps.newHashMap();
      AggregateRpcStatsProto.Builder aggregate = aggregates.get(key);
      aggregate.setTotalAmountOfCalls(aggregate.getTotalAmountOfCalls() + 1);
      aggregate.setTotalCostOfCallsMicrodollars(
          aggregate.getTotalCostOfCallsMicrodollars() + stat.getCallCostMicrodollars());
      for (BilledOpProto billedOp : stat.getBilledOpsList()) {
        BilledOpProto.Builder totalBilledOp = billedOpMap.get(billedOp.getOp());
        if (totalBilledOp == null) {
          totalBilledOp = BilledOpProto.newBuilder().setOp(billedOp.getOp());
          billedOpMap.put(billedOp.getOp(), totalBilledOp);
        }
        totalBilledOp.setNumOps(totalBilledOp.getNumOps() + billedOp.getNumOps());
      }
      for (BilledOpProto.Builder totalBilledOp : billedOpMap.values()) {
        aggregate.addTotalBilledOps(totalBilledOp);
      }
    }
    for (AggregateRpcStatsProto.Builder aggregate : aggregates.values()) {
      builder.addRpcStats(aggregate);
    }

    environment.getAttributes().remove(keyInCache);

    try {
      persist(builder.build());
      return true;
    } catch (MemcacheServiceException e) {
      log.log(Level.WARNING, "Error persisting request stats", e);
      return false;
    }
  }

  @Override
  public final void write(
      Delegate<?> wrappedDelegate,
      Environment environment,
      IndividualRpcStatsProto.Builder record,
      long overheadWalltimeMillis,
      boolean correctStartOffset) {
    if (record == null) {
      throw new NullPointerException("Record must not be null");
    }
    if (environment == null) {
      throw new NullPointerException("Environment must not be null");
    }
    RequestStatProto.Builder builder =
      (RequestStatProto.Builder) environment.getAttributes().get(keyInCache);
    if (builder != null) {
      if (correctStartOffset) {
        record.setStartOffsetMilliseconds(Math.max(0, record.getStartOffsetMilliseconds()
            - builder.getStartTimestampMilliseconds()));
      }
      builder.addIndividualStats(record);
      builder.setOverheadWalltimeMilliseconds(
          builder.getOverheadWalltimeMilliseconds() + overheadWalltimeMillis);
    }
 }

  public List<RequestStatProto> getSummaries() {
    List<Object> keys = new ArrayList<Object>(KEY_MODULUS);
    for (int i = 0; i < KEY_MODULUS; i++) {
      keys.add(makeKeyPrefix(i * KEY_DISTANCE) + PART_SUFFIX);
    }
    List<RequestStatProto> result = new ArrayList<RequestStatProto>();
    for (Map.Entry<?, ?> entry : statsMemcache.getAll(keys).entrySet()) {
      try {
        result.add(RequestStatProto.newBuilder().mergeFrom(
            (byte[]) entry.getValue()).build());
      } catch (InvalidProtocolBufferException e) {
        log.warning(
            "Memcache store for request stats is partially corrupted for key "
            + entry.getKey());
        statsMemcache.delete(entry.getKey());
      }
    }
    return result;
  }

  public RequestStatProto getFull(long timestamp) {
    String key = makeKeyPrefix(timestamp) + FULL_SUFFIX;
    try {
      byte[] rawData = (byte[]) statsMemcache.get(key);
      return (rawData == null) ? null :
          RequestStatProto.newBuilder().mergeFrom(rawData).build();
    } catch (InvalidProtocolBufferException e) {
      log.warning(
          "Memcache store for request stats is partially corrupted for key " + key);
      statsMemcache.delete(key);
      return null;
    }
  }

  private void persist(RequestStatProto stats) {
    RequestStatProto.Builder summary = RequestStatProto.newBuilder().mergeFrom(stats);
    for (FieldDescriptor field : RequestStatProto.getDescriptor().getFields()) {
      if (field.getNumber() > FIRST_FIELD_NUMBER_FOR_DETAILS) {
        summary.clearField(field);
      }
    }
    Map<Object, Object> values = new HashMap<Object, Object>();
    String prefix = makeKeyPrefix(stats.getStartTimestampMilliseconds());
    values.put(prefix + PART_SUFFIX, serialize(summary.build()));
    values.put(prefix + FULL_SUFFIX, serialize(stats));
    statsMemcache.putAll(values, Expiration.byDeltaSeconds(EXPIRATION_SECONDS));
  }

  byte[] serialize(RequestStatProto proto) {
    byte[] result = serializeIfSmallEnough(proto);
    if (result == null) {
      proto = removeStackTraces(proto);
      result = serializeIfSmallEnough(proto);
      logMaybe(result, "all stack traces were removed");
    }
    if (result == null) {
      proto = trimStatsEntries(100, proto);
      result = serializeIfSmallEnough(proto);
      logMaybe(result,
          "trimmed the amount of individual stats down to 100 entries");
    }
    if (result == null) {
      proto = trimStatsEntries(0, proto);
      result = serializeIfSmallEnough(proto);
      logMaybe(result,
          "cleared out all individual stats");
    }
    if (result == null) {
      throw new MemcacheServiceException("Appstats data too big");
    }
    return result;
  }

  private byte[] serializeIfSmallEnough(RequestStatProto proto) {
    byte[] result = proto.toByteArray();
    return (result.length > MAX_SIZE) ? null : result;
  }

  private void logMaybe(byte[] result, String action) {
    if (result != null) {
      log.warning("Stats data was too big, " + action + ".");
    }
  }

  private RequestStatProto removeStackTraces(RequestStatProto proto) {
    Builder builder = proto.toBuilder().clearIndividualStats();
    for (IndividualRpcStatsProto stat : proto.getIndividualStatsList()) {
      builder.addIndividualStats(stat.toBuilder().clearCallStack());
    }
    return builder.build();
  }

  private RequestStatProto trimStatsEntries(int max, RequestStatProto proto) {
    Builder builder = proto.toBuilder().clearIndividualStats();
    for (int i = 0; i < Math.min(max, proto.getIndividualStatsCount()); i++) {
      builder.addIndividualStats(proto.getIndividualStats(i));
    }
    return builder.build();
  }
}

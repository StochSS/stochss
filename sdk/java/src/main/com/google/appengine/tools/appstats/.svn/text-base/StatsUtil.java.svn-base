// Copyright 2009 Google Inc. All Rights Reserved.

package com.google.appengine.tools.appstats;

import com.google.appengine.tools.appstats.StatsProtos.AggregateRpcStatsProto;
import com.google.appengine.tools.appstats.StatsProtos.BilledOpProto;
import com.google.appengine.tools.appstats.StatsProtos.BilledOpProto.BilledOp;
import com.google.appengine.tools.appstats.StatsProtos.IndividualRpcStatsProto;
import com.google.appengine.tools.appstats.StatsProtos.RequestStatProto;
import com.google.common.base.Function;
import com.google.common.base.Joiner;
import com.google.common.collect.Iterables;
import com.google.common.collect.Maps;
import com.google.protobuf.Descriptors.FieldDescriptor;
import com.google.protobuf.Message;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.TreeMap;

/**
 * Utility methods used by this package.
 *
 */
class StatsUtil {

  private StatsUtil(){}

  private static final double MCYCLES_PER_SECOND = 1200.0;
  private static final BigDecimal ONE_HUNDRED = new BigDecimal(100);

  private static final Comparator<List<Object>> BY_FIRST_ELEMENT = makeComparator(0, 1, 2);
  private static final Comparator<List<Object>> BY_SECOND_ELEMENT = makeComparator(1, 0, 2);
  private static final Comparator<Entry<String, ? extends BaseStats>> BY_NUM_RPCS =
      new Comparator<Map.Entry<String, ? extends BaseStats>>(){
        @Override
        public int compare(Entry<String, ? extends BaseStats> o1,
            Entry<String, ? extends BaseStats> o2) {
          int c = -o1.getValue().numRpcs.compareTo(o2.getValue().numRpcs);
          if (c == 0) {
            c = o1.getKey().compareTo(o2.getKey());
          }
          return c;
        }};

  private static String extractKey(RequestStatProto summary) {
    String result = summary.getHttpPath();
    if (!summary.getHttpMethod().equals("GET")) {
      result = summary.getHttpMethod() + " " + result;
    }
    return result;
  }

  static long megaCyclesToMilliseconds(long megaCycles) {
    return (long) (1000 * megaCycles / MCYCLES_PER_SECOND);
  }

  /**
   * Transforms a proto into a Map where the key is the name of the proto field
   * and the value is the value of the proto field. In addition, if the proto
   * field is a {@link List}, two additional fields are added. The first has the
   * key with the name of the proto field with "_list" appended and the value
   * equal to the List property. The second has the key with the name of the
   * proto field with "_size" appended and the value equal to the size of the
   * List property.
   */
  private static Map<String, Object> toMap(Message proto) {
    Map<String, Object> result = new HashMap<String, Object>();
    for (FieldDescriptor field : proto.getDescriptorForType().getFields()) {
      Object value = proto.getField(field);
      if (value != null) {
        result.put(field.getName(), value);
        if (value instanceof List) {
          result.put(field.getName() + "_list", value);
          result.put(field.getName() + "_size", ((List<?>) value).size());
        }
      }
    }
    return result;
  }

  /**
   * Transforms a {@link RequestStatProto} proto into a Map as described in
   * the docs for {@link #toMap}, but also adds additional entries that are
   * dervied from the proto fields.
   */
  private static Map<String, Object> augmentProto(RequestStatProto proto) {
    List<IndividualRpcStatsProto> individualRpcs = proto.getIndividualStatsList();
    Map<String, Object> result = toMap(proto);
    result.put("api_milliseconds",
        megaCyclesToMilliseconds(proto.getApiMcycles()));
    result.put("processor_milliseconds",
        megaCyclesToMilliseconds(proto.getProcessorMcycles()));
    result.put("start_time_formatted", new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS")
        .format(new Date(proto.getStartTimestampMilliseconds())));
    List<Object> sublist = new ArrayList<Object>();
    Map<BilledOp, Integer> cumulativeBilledOpMap = new BilledOpMap();
    for (IndividualRpcStatsProto stat : individualRpcs) {
      Map<String, Object> subMap = toMap(stat);
      subMap.put("api_milliseconds",
          megaCyclesToMilliseconds(stat.getApiMcycles()));
      BilledOpMap bopMap = new BilledOpMap();
      updateBilledOps(bopMap, stat.getBilledOpsList());
      subMap.put("billed_ops_str", bopMap.toString());
      sublist.add(subMap);
    }
    result.put("individual_stats", sublist);
    result.put("individual_stats_list", sublist);
    long count = 0;
    long costInMicropennies = 0;
    List<Map<String, Object>> aggregateStatsList = new ArrayList<Map<String, Object>>();
    for (AggregateRpcStatsProto stat : proto.getRpcStatsList()) {
      Map<String, Object> aggregateStatMap = toMap(stat);
      aggregateStatsList.add(aggregateStatMap);
      count += stat.getTotalAmountOfCalls();
      costInMicropennies += stat.getTotalCostOfCallsMicrodollars();
      BilledOpMap bopMap = new BilledOpMap();
      updateBilledOps(bopMap, stat.getTotalBilledOpsList());
      updateBilledOps(cumulativeBilledOpMap, stat.getTotalBilledOpsList());
      aggregateStatMap.put("total_billed_ops_str", bopMap.toString());
    }
    result.put("rpc_stats_list", aggregateStatsList);
    result.put("combined_rpc_count", count);
    result.put("combined_rpc_cost_micropennies", costInMicropennies);
    result.put("combined_rpc_billed_ops", cumulativeBilledOpMap);
    return result;
  }

  private static List<List<Object>> asTupleOrderedByNumRpcs(
      Map<String, ? extends BaseStats> elements, BigDecimal totalRpcCostsMicropennies) {
    List<Map.Entry<String, ? extends BaseStats>> sorted =
        new ArrayList<Map.Entry<String, ? extends BaseStats>>(elements.entrySet());
    Collections.sort(sorted, BY_NUM_RPCS);
    List<List<Object>> result = new ArrayList<List<Object>>(sorted.size());
    for (Map.Entry<String, ? extends BaseStats> entry : sorted) {
      BaseStats baseStats = entry.getValue();
      result.add(Arrays.<Object>asList(entry.getKey(), baseStats.numRpcs,
          baseStats.rpcCostMicropennies, baseStats.billedOps,
          asPercentageOf(baseStats.rpcCostMicropennies, totalRpcCostsMicropennies)));
    }
    return result;
  }

  /**
   * Returns the given cost as a percentage of the total cost, rounded to the nearest tenth of a
   * percent.
   */
  static double asPercentageOf(long costMicropennies, BigDecimal totalCostMicropennies) {
    return totalCostMicropennies.longValue() == 0 ? 0 :
        new BigDecimal(costMicropennies).divide(totalCostMicropennies, 3, RoundingMode.HALF_UP)
            .multiply(ONE_HUNDRED).setScale(2, RoundingMode.HALF_UP).doubleValue();
  }

  private static Comparator<List<Object>> makeComparator(final int... fieldOrder) {
    return new Comparator<List<Object>>() {
      @SuppressWarnings("unchecked")
      @Override
      public int compare(List<Object> o1, List<Object> o2) {
        int result = 0;
        for (int i : fieldOrder) {
          Comparable c1 = (Comparable) o1.get(i);
          Comparable c2 = (Comparable) o2.get(i);
          result = (c1 instanceof Number) ? -c1.compareTo(c2) : c1.compareTo(c2);
          if (result != 0) {
            return result;
          }
        }
        return result;
      }
    };
  }

  static Map<String, Object> createSummaryStats(List<RequestStatProto> records) {
    records = new ArrayList<RequestStatProto>(records);
    Collections.sort(records, new Comparator<RequestStatProto>() {
      @Override
      public int compare(RequestStatProto o1, RequestStatProto o2) {
        Long l1 = o1.getStartTimestampMilliseconds();
        Long l2 = o2.getStartTimestampMilliseconds();
        return -l1.compareTo(l2);
      }});

    List<Map<String, Object>> augmented = new ArrayList<Map<String, Object>>(records.size());
    for (RequestStatProto proto : records) {
      augmented.add(augmentProto(proto));
    }

    Map<String, PathStats> statsByPath = new HashMap<String, PathStats>();

    Map<String, RpcStats> statsByRpc = new HashMap<String, RpcStats>();

    BigDecimal totalCostMicropennies = new BigDecimal(0);
    for (int i = 0; i < records.size(); i++) {
      RequestStatProto requestStat = records.get(i);
      String pathKey = extractKey(requestStat);
      PathStats pathStats = statsByPath.get(pathKey);
      if (pathStats == null) {
        pathStats = new PathStats(pathKey);
        statsByPath.put(pathKey, pathStats);
      }
      if (pathStats.requestIds.size() >= 10) {
        if (pathStats.requestIds.get(pathStats.requestIds.size() - 1) != 0) {
          pathStats.requestIds.add(0);
        }
      } else {
        pathStats.requestIds.add(i + 1);
      }

      for (AggregateRpcStatsProto aggregateStat : requestStat.getRpcStatsList()) {
        String rpcKey = aggregateStat.getServiceCallName();
        long totalCalls = aggregateStat.getTotalAmountOfCalls();
        long costMicropennies = aggregateStat.getTotalCostOfCallsMicrodollars();
        totalCostMicropennies = totalCostMicropennies.add(new BigDecimal(costMicropennies));
        RpcStats rpcStats = statsByRpc.get(rpcKey);
        if (rpcStats == null) {
          rpcStats = new RpcStats(rpcKey);
          statsByRpc.put(rpcKey, rpcStats);
        }
        pathStats.numRpcs += totalCalls;
        pathStats.rpcCostMicropennies += costMicropennies;

        rpcStats.numRpcs += totalCalls;
        rpcStats.rpcCostMicropennies += costMicropennies;

        RpcStats rpcStatsForPath = pathStats.rpcStats.get(rpcKey);
        if (rpcStatsForPath == null) {
          rpcStatsForPath = new RpcStats(rpcKey);
          pathStats.rpcStats.put(rpcKey, rpcStatsForPath);
        }
        rpcStatsForPath.numRpcs += totalCalls;
        rpcStatsForPath.rpcCostMicropennies += costMicropennies;

        PathStats pathStatsForRpc = rpcStats.pathStats.get(pathKey);
        if (pathStatsForRpc == null) {
          pathStatsForRpc = new PathStats(pathKey);
          rpcStats.pathStats.put(pathKey, pathStatsForRpc);
        }
        pathStatsForRpc.numRpcs += totalCalls;
        pathStatsForRpc.rpcCostMicropennies += costMicropennies;

        updateBilledOps(pathStats.billedOps, aggregateStat.getTotalBilledOpsList());
        updateBilledOps(rpcStats.billedOps, aggregateStat.getTotalBilledOpsList());
        updateBilledOps(rpcStatsForPath.billedOps, aggregateStat.getTotalBilledOpsList());
        updateBilledOps(pathStatsForRpc.billedOps, aggregateStat.getTotalBilledOpsList());
      }
    }

    List<List<Object>> rpcStatsTuples = new ArrayList<List<Object>>();
    for (RpcStats rpcStats : statsByRpc.values()) {
      List<List<Object>> pathStatsTupleOrderedByRpc =
          asTupleOrderedByNumRpcs(rpcStats.pathStats, totalCostMicropennies);
      List<Object> rpcStatTuple = new ArrayList<Object>();
      rpcStatTuple.add(rpcStats.rpcName);
      rpcStatTuple.add(rpcStats.numRpcs);
      rpcStatTuple.add(rpcStats.rpcCostMicropennies);
      rpcStatTuple.add(rpcStats.billedOps);
      rpcStatTuple.add(asPercentageOf(rpcStats.rpcCostMicropennies, totalCostMicropennies));
      rpcStatTuple.add(pathStatsTupleOrderedByRpc);
      rpcStatsTuples.add(rpcStatTuple);
    }
    Collections.sort(rpcStatsTuples, BY_FIRST_ELEMENT);
    List<List<Object>> rpcStatsTuplesOrderedByRpcCount =
        new ArrayList<List<Object>>(rpcStatsTuples);
    Collections.sort(rpcStatsTuplesOrderedByRpcCount, BY_SECOND_ELEMENT);

    List<List<Object>> pathStatsTuples = new ArrayList<List<Object>>();
    for (PathStats pathStats : statsByPath.values()) {
      List<List<Object>> rpcStatsTupleOrderedByPath =
          asTupleOrderedByNumRpcs(pathStats.rpcStats, totalCostMicropennies);
      long rpcCount = 0;
      long rpcCostMicropennies = 0;
      for (List<Object> rpcStatsTuple : rpcStatsTupleOrderedByPath) {
        rpcCount += (Long) rpcStatsTuple.get(1);
        rpcCostMicropennies += (Long) rpcStatsTuple.get(2);
      }
      List<Object> pathStatTuple = new ArrayList<Object>();
      pathStatTuple.add(pathStats.path);
      pathStatTuple.add(rpcCount);
      pathStatTuple.add(rpcCostMicropennies);
      pathStatTuple.add(pathStats.billedOps);
      pathStatTuple.add(asPercentageOf(rpcCostMicropennies, totalCostMicropennies));
      pathStatTuple.add(pathStats.requestIds.size());
      pathStatTuple.add(pathStats.requestIds);
      pathStatTuple.add(rpcStatsTupleOrderedByPath);
      pathStatsTuples.add(pathStatTuple);
    }
    Collections.sort(pathStatsTuples, BY_FIRST_ELEMENT);
    List<List<Object>> pathStatsTuplesOrderedByRpcCount =
        new ArrayList<List<Object>>(pathStatsTuples);
    Collections.sort(pathStatsTuplesOrderedByRpcCount, BY_SECOND_ELEMENT);

    Map<String, Object> values = new HashMap<String, Object>();
    values.put("requests", augmented);
    values.put("allstats_by_count", rpcStatsTuplesOrderedByRpcCount);
    values.put("pathstats_by_count", pathStatsTuplesOrderedByRpcCount);
    values.put("has_cost_data", Boolean.TRUE);
    return values;
  }

  static Map<String, Object> createDetailedStats(RequestStatProto data) {
    Map<String, Object> parameters = new HashMap<String, Object>();
    parameters.put("record", augmentProto(data));
    parameters.put("file_url", false);

    Map<String, DetailedRpcStats> statsByRpc = new HashMap<String, DetailedRpcStats>();
    for (IndividualRpcStatsProto rpcStat : data.getIndividualStatsList()) {
      String rpcName = rpcStat.getServiceCallName();
      DetailedRpcStats statsForRpc = statsByRpc.get(rpcName);
      if (statsForRpc == null) {
        statsForRpc = new DetailedRpcStats(rpcName);
        statsByRpc.put(rpcName, statsForRpc);

      }
      statsForRpc.numRpcs++;
      statsForRpc.durationMillis += rpcStat.getDurationMilliseconds();
      statsForRpc.apiMcycles += rpcStat.getApiMcycles();
      statsForRpc.rpcCostMicropennies += rpcStat.getCallCostMicrodollars();
      updateBilledOps(statsForRpc.billedOps, rpcStat.getBilledOpsList());
    }
    List<List<Object>> rpcStatsSortedByCount = new ArrayList<List<Object>>();
    for (Map.Entry<String, DetailedRpcStats> entry : statsByRpc.entrySet()) {
      List<Object> tuple = new ArrayList<Object>();
      tuple.add(entry.getKey());
      DetailedRpcStats detailedStats = entry.getValue();
      tuple.add(detailedStats.numRpcs);
      tuple.add(detailedStats.durationMillis);
      tuple.add(megaCyclesToMilliseconds(detailedStats.apiMcycles));
      tuple.add(detailedStats.rpcCostMicropennies);
      tuple.add(detailedStats.billedOps);
      rpcStatsSortedByCount.add(tuple);
    }
    Collections.sort(rpcStatsSortedByCount, BY_SECOND_ELEMENT);
    parameters.put("rpcstats_by_count", rpcStatsSortedByCount);

    long realTotal = 0;
    long apiTotalMcycles = 0;
    for (IndividualRpcStatsProto stat : data.getIndividualStatsList()) {
      realTotal += stat.getDurationMilliseconds();
      apiTotalMcycles += stat.getApiMcycles();
    }
    long apiTotal = megaCyclesToMilliseconds(apiTotalMcycles);
    long chargedTotal = megaCyclesToMilliseconds(
        data.getProcessorMcycles() + apiTotalMcycles);
    parameters.put("real_total", realTotal);
    parameters.put("api_total", apiTotal);
    parameters.put("charged_total", chargedTotal);
    parameters.put("has_cost_data", Boolean.TRUE);
    return parameters;
  }

  private static Map<BilledOp, Integer> updateBilledOps(Map<BilledOp, Integer> billedOps,
      List<BilledOpProto> billedOpsList) {
    for (BilledOpProto proto : billedOpsList) {
      if (billedOps.get(proto.getOp()) == null) {
        billedOps.put(proto.getOp(), 0);
      }
      billedOps.put(proto.getOp(), billedOps.get(proto.getOp()) + proto.getNumOps());
    }
    return billedOps;
  }

  /**
   * Base class for all stats objects.
   */
  private static class BaseStats {
    Long numRpcs = 0L;
    long rpcCostMicropennies;
    final Map<BilledOp, Integer> billedOps = new BilledOpMap();
  }

  /**
   * Stats that are associated with a specific url path.
   */
  private static class PathStats extends BaseStats {
    private final String path;
    private final List<Integer> requestIds = new ArrayList<Integer>();
    private final Map<String, RpcStats> rpcStats = Maps.newHashMap();

    private PathStats(String path) {
      this.path = path;
    }
  }

  /**
   * Stats that are associated with a specific Rpc.
   */
  private static class RpcStats extends BaseStats {
    private final String rpcName;
    private final Map<String, PathStats> pathStats = Maps.newHashMap();

    private RpcStats(String rpcName) {
      this.rpcName = rpcName;
    }
  }

  /**
   * RpcStats that have more detailed information available.
   */
  private static class DetailedRpcStats extends RpcStats {
    long durationMillis;
    long apiMcycles;

    private DetailedRpcStats(String rpcName) {
      super(rpcName);
    }
  }

  /**
   * A {@link TreeMap} extension that formats {@link #toString()} in a certain
   * way.
   */
  private static final class BilledOpMap extends TreeMap<BilledOp, Integer> {
    @Override
    public String toString() {
      return Joiner.on(", ").join(Iterables.transform(entrySet(),
          new Function<Entry<BilledOp, Integer>, String>() {
            @Override
            public String apply(Map.Entry<BilledOp, Integer> entry) {
              return String.format("%s:%d", entry.getKey(), entry.getValue());
            }
          }));
    }
  }
}

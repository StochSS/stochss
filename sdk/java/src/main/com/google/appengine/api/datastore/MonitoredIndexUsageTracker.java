// Copyright 2012 Google Inc. All Rights Reserved.

package com.google.appengine.api.datastore;

import static com.google.appengine.api.datastore.FetchOptions.Builder.withLimit;

import com.google.appengine.api.utils.SystemProperty;
import com.google.apphosting.api.ApiProxy.OverQuotaException;
import com.google.apphosting.api.DeadlineExceededException;
import com.google.common.base.Pair;
import com.google.common.base.Preconditions;
import com.google.common.base.Ticker;
import com.google.common.collect.Lists;
import com.google.common.collect.PrefixTrie;
import com.google.common.collect.Sets;

import java.util.Collection;
import java.util.Date;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.TimeUnit;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * This class is used to log usages of indexes that have been selected for usage monitoring
 * by the application administrator.
 *
 */
class MonitoredIndexUsageTracker {

  private static final int DEFAULT_USAGE_REFRESH_PERIOD_SECS = 60;
  private static final double DEFAULT_REFRESH_QUERY_DEADLINE_SECS = 0.2;
  private static final double DEFAULT_PUT_DEADLINE_SECS = 0.2;
  private static final String[] DEFAULT_API_PACKAGE_PREFIXES =
    {"com.google.appengine", "com.google.apphosting", "org.datanucleus"};
  static final String REFRESH_PERIOD_SECS_SYS_PROP =
      "appengine.datastore.indexMonitoring.persistedUsageRefreshPeriodSecs";
  private static final String REFRESH_QUERY_DEADLINE_SECS_SYS_PROP =
      "appengine.datastore.indexMonitoring.refreshUsageInfoQueryDeadlineSecs";
  private static final String PUT_DEADLINE_SECS_SYS_PROP =
      "appengine.datastore.indexMonitoring.newUsagePutDeadlineSecs";
  private static final String PACKAGE_PREFIXES_TO_SKIP_SYS_PROP =
      "appengine.datastore.apiPackagePrefixes";
  private static final String NEW_USAGE_LOGGING_THRESHOLD_SECS_SYS_PROP =
      "appengine.datastore.indexMonitoring.newUsageLoggingThresholdSecs";

  static final int REFRESH_QUERY_FAILURE_LOGGING_THRESHOLD = 10;
  private static final int MAX_MONITORED_INDEXES = 100;
  private static final int MAX_TRACKED_USAGES_PER_INDEX = 30;
  private static final int MAX_STACK_FRAMES_SAVED = 200;

  private static final String USAGE_ENTITY_KIND_PREFIX = "_ah_datastore_monitored_index_";
  private static final String USAGE_ENTITY_QUERY_PROPERTY = "query";
  private static final String USAGE_ENTITY_CAPTURE_TIME_PROPERTY =
      "diagnosticCaptureDurationNanos";
  private static final String USAGE_ENTITY_OCCURRENCE_TIME_PROPERTY = "occurrenceTime";
  private static final String USAGE_ENTITY_STACK_TRACE_PROPERTY = "stackTrace";
  private static final String USAGE_ENTITY_APP_VERSION_PROPERTY = "appVersion";

  static Logger logger = Logger.getLogger(MonitoredIndexUsageTracker.class.getName());
  private final int maxUsagesTrackedPerIndex;
  private final UsageIdCache perIndexUsageIds;
  private final Ticker ticker;
  private final long usageRefreshPeriodNanos;
  private final double refreshQueryDeadlineSecs;
  private final double putDeadlineSecs;
  private final long newUsageLoggingThresholdNanos;
  private final PrefixTrie<Boolean> apiPackagePrefixTrie;

  MonitoredIndexUsageTracker() {
    this(MAX_MONITORED_INDEXES, MAX_TRACKED_USAGES_PER_INDEX, Ticker.systemTicker());
  }

  MonitoredIndexUsageTracker(int maxIndexesTracked, int maxUsagesPerIndex, Ticker ticker) {
    this.maxUsagesTrackedPerIndex = maxUsagesPerIndex;
    this.ticker = ticker;
    usageRefreshPeriodNanos = getUsageRefreshPeriodNanos();
    refreshQueryDeadlineSecs = getRefreshQueryDeadlineSecs();
    putDeadlineSecs = getPutDeadlineSecs();
    newUsageLoggingThresholdNanos = getNewUsageLoggingThresholdNanos();
    perIndexUsageIds = new UsageIdCache(maxIndexesTracked);
    apiPackagePrefixTrie = getApiPackagePrefixesTrie();
  }

  /**
   * Log that the specified {@code monitoredIndexes} were used to execute the {@code query}.
   */
  public void addNewUsage(Collection<Index> monitoredIndexes, Query query) {
    Preconditions.checkNotNull(monitoredIndexes);
    Preconditions.checkNotNull(query);

    long methodInvocationTimeNanos = ticker.read();
    Date occurenceDate = newDate();
    LazyApiInvokerStackTrace lazyStackTrace = new LazyApiInvokerStackTrace();

    List<ExpiringPersistedUsageIds> usageIdsPerIndex =
        Lists.newArrayListWithExpectedSize(monitoredIndexes.size());
    for (Index index : monitoredIndexes) {
      usageIdsPerIndex.add(perIndexUsageIds.get(index.getId()));
    }

    List<Entity> newUsagesToPersist = Lists.newArrayList();
    Iterator<ExpiringPersistedUsageIds> usageIdsPerIndexIter = usageIdsPerIndex.iterator();
    for (Index index : monitoredIndexes) {
      PersistedUsageIds persistedUsageIds = usageIdsPerIndexIter.next().get();
      if (persistedUsageIds.addNewUsage(getUsageEntityKeyName(query))) {
        newUsagesToPersist.add(newUsageEntity(index, query, occurenceDate, lazyStackTrace));
      }
    }

    if (newUsagesToPersist.size() > 0) {
      persistNewUsages(newUsagesToPersist);
    }

    long methodElapsedTimeNanos = ticker.read() - methodInvocationTimeNanos;
    if (methodElapsedTimeNanos > newUsageLoggingThresholdNanos) {
      long  elapsedTimeSecs = methodElapsedTimeNanos / (1000 * 1000 * 1000);
      long  elapsedTimeRemNanos = methodElapsedTimeNanos % (1000 * 1000 * 1000);
      logger.severe(String.format(
          "WARNING: tracking usage of monitored indexes took %d.%09d secs",
          elapsedTimeSecs, elapsedTimeRemNanos));
    }
  }

  void persistNewUsages(List<Entity> newUsagesToPersist) {
    AsyncDatastoreService asyncDatastore = newAsyncDatastoreService(putDeadlineSecs);
    try {
      asyncDatastore.put((Transaction) null, newUsagesToPersist);
    } catch (RuntimeException e) {
      logger.log(Level.SEVERE,
          String.format("Failed to record monitored index usage: %s",
              newUsagesToPersist.get(0).toString()),
          e);
    }
  }

  Pair<Query, FetchOptions> getPersistedUsageRefreshQuery(Long indexId) {
    Query refreshQuery = new Query(getUsageEntityKind(indexId));
    refreshQuery.setKeysOnly();
    return new Pair<Query, FetchOptions>(refreshQuery, withLimit(maxUsagesTrackedPerIndex));
  }

  private static String getUsageEntityKind(long compositeIndexId) {
    return USAGE_ENTITY_KIND_PREFIX + compositeIndexId;
  }

  private static String getUsageEntityKeyName(Query query) {
    return Integer.toString(query.hashCodeNoFilterValues());
  }

  Entity newUsageEntity(Index index, Query query, Date occurenceTime,
      LazyApiInvokerStackTrace lazyStackTrace) {
    String kind = getUsageEntityKind(index.getId());
    Key key = KeyFactory.createKey(kind, getUsageEntityKeyName(query));
    Pair<String, Long> stackTraceInfo = lazyStackTrace.get();

    Entity entity = new Entity(key);
    entity.setProperty(USAGE_ENTITY_QUERY_PROPERTY, new Text(query.toString()));
    entity.setProperty(USAGE_ENTITY_CAPTURE_TIME_PROPERTY, stackTraceInfo.getSecond());
    entity.setProperty(USAGE_ENTITY_OCCURRENCE_TIME_PROPERTY, occurenceTime);
    entity.setProperty(USAGE_ENTITY_STACK_TRACE_PROPERTY, new Text(stackTraceInfo.getFirst()));
    entity.setProperty(USAGE_ENTITY_APP_VERSION_PROPERTY, SystemProperty.applicationVersion.get());
    return entity;
  }

  AsyncDatastoreService newAsyncDatastoreService(double deadlineSecs) {
    return DatastoreServiceFactory.getAsyncDatastoreService(
        DatastoreServiceConfig.Builder
        .withDatastoreCallbacks(DatastoreCallbacks.NoOpDatastoreCallbacks.INSTANCE)
        .deadline(deadlineSecs));
  }

  Date newDate() {
    return new Date();
  }

  /**
   * This class caches usage ids on a per index basis.
   *
   * Note that initially {@code CacheBuilder} was used to implement this cache, but unfortunately
   * the datastore api library can not currently depend on {@code com.google.common.cache}.
   */
  private class UsageIdCache {
    final UsageIdCacheMap usageIdMap;

    private UsageIdCache(final int capacity) {
      usageIdMap = new UsageIdCacheMap(capacity);
    }

    private synchronized ExpiringPersistedUsageIds get(Long indexId) {
      ExpiringPersistedUsageIds usageIds = usageIdMap.get(indexId);
      if ((usageIds == null) || (usageIds.isExpired())) {
        usageIds = new ExpiringPersistedUsageIds(indexId, usageIds);
        usageIdMap.put(indexId, usageIds);
      }
      return usageIds;
    }
  }

  /**
   * This class contains the core datastructure for the {@code UsageIdCache}.
   * It extends from LinkedHashMap which provides a bounded HashMap. It sorts the contents by
   * LRU access order (get() and put() count as accesses). Entries that are infrequently
   * accessed are the first to be evicted when the size bound for the map is exceeded.
   *
   * This class had to be named (vs. being an anonymous class) because {@code SerializationTest}
   * requires every serializable object (anonymous or otherwise) to have a golden file.
   * Note that this class is never actually serialized. Therefore it's okay to break
   * serialization compatibility in the future if needed.
   */
  static class UsageIdCacheMap extends LinkedHashMap<Long, ExpiringPersistedUsageIds> {
    static final long serialVersionUID = -5010587885037930115L;
    private static final int DEFAULT_INITIAL_CAPACITY = 16;
    private static final float DEFAULT_LOAD_FACTOR = 0.75f;
    private static final boolean SORT_ELEMENTS_BY_ACCESS_ORDER = true;

    private final int capacity;

    UsageIdCacheMap(int capacity) {
      super(DEFAULT_INITIAL_CAPACITY, DEFAULT_LOAD_FACTOR, SORT_ELEMENTS_BY_ACCESS_ORDER);
      this.capacity = capacity;
    }

    @Override
    protected boolean removeEldestEntry(Map.Entry<Long, ExpiringPersistedUsageIds> eldest) {
      return size() > capacity;
    }
  }

  /**
   * This class gets an up to date snapshot of the persisted usage ids for a monitored
   * index.
   */
  private class ExpiringPersistedUsageIds {
    private final Long creationTimeNanos;
    private final Thread usageLoaderThread;

    private volatile int numContiguousRefreshQueryFailures;

    private volatile PersistedUsageIds usageIds;

    private Iterable<Entity> refreshQueryEntities;

    /**
     * Constructs a new expiring persisted usage id set. The contents of the set are filled in
     * by the thread invoking the constructor. In the constructor an asynchronous query is issued
     * to fetch the set of usages that are currently persisted. The results for the query
     * are reaped when the thread invoking the constructor calls {@link #get}.
     *
     * @param indexId the id of the index for which to load usage information.
     * @param prevExpiringUsageIds the prior usage id set associated with {@code indexId}.
     * If NULL this is the first time usage information is being loaded by this clone for the
     * specified index.
     */
    private ExpiringPersistedUsageIds(Long indexId, ExpiringPersistedUsageIds prevExpiringUsageIds) {
      this.creationTimeNanos = ticker.read();
      this.usageLoaderThread = Thread.currentThread();

      if (prevExpiringUsageIds != null) {
        this.usageIds = prevExpiringUsageIds.usageIds;
        numContiguousRefreshQueryFailures = prevExpiringUsageIds.numContiguousRefreshQueryFailures;
      } else {
        usageIds = PersistedUsageIds.TOMBSTONE_INSTANCE;
        numContiguousRefreshQueryFailures = 0;
      }

      Pair<Query, FetchOptions> refreshQuery = getPersistedUsageRefreshQuery(indexId);
      AsyncDatastoreService asyncDatastore = newAsyncDatastoreService(refreshQueryDeadlineSecs);
      PreparedQuery refreshPQ =  asyncDatastore.prepare(refreshQuery.getFirst());

      refreshQueryEntities = null;
      try {
        refreshQueryEntities = refreshPQ.asIterable(refreshQuery.getSecond());
      } catch (RuntimeException e) {
        numContiguousRefreshQueryFailures++;
        logger.log(Level.SEVERE,
            String.format("Failed to query existing monitored index usages: %s",
                refreshPQ.toString()),
            e);
      }
    }

    private PersistedUsageIds get() {
      if ((usageLoaderThread != Thread.currentThread())
          || (null == refreshQueryEntities)) {
        return usageIds;
      }

      boolean logException = false;
      Throwable throwable = null;
      try {
        PersistedUsageIds existingKeys = new PersistedUsageIds(maxUsagesTrackedPerIndex);
        for (Entity persistedEntity : refreshQueryEntities) {
          existingKeys.addNewUsage(persistedEntity.getKey().getName());
        }
        usageIds = existingKeys;
        numContiguousRefreshQueryFailures = 0;
      } catch (OverQuotaException e) {
        throwable = e;
      } catch (DeadlineExceededException e) {
        throwable = e;
      } catch (DatastoreTimeoutException e) {
        throwable = e;
      } catch (DatastoreFailureException e) {
        throwable = e;
      } catch (RuntimeException e) {
        logException = true;
        throwable = e;
      }

      if (throwable != null) {
        numContiguousRefreshQueryFailures++;

        if ((numContiguousRefreshQueryFailures % REFRESH_QUERY_FAILURE_LOGGING_THRESHOLD) == 0) {
          logException = true;
        }

        if (logException) {
          logger.log(Level.SEVERE, "Failed to query existing monitored index usage information",
              throwable);
        }
      }

      refreshQueryEntities = null;

      return usageIds;
    }

    private boolean isExpired() {
      return (ticker.read() - creationTimeNanos) > usageRefreshPeriodNanos;
    }
  }

  /**
   * This class holds the set of persisted usage ids for a monitored index. Call
   * {@link #addNewUsage} to conditionally add an element to the persisted usage set. Only
   * items that are added to the set should be persisted by the caller.
   */
  private static class PersistedUsageIds {
    /**
     * The tombstone instance always returns FALSE from {@link #addNewUsage}. It is used
     * to prevent the persistence of new usages for an index.
     */
    private static final PersistedUsageIds TOMBSTONE_INSTANCE = new PersistedUsageIds(0);

    private final Set<String> persistedIds;
    private final int maxIdsPersisted;

    PersistedUsageIds(int maxIdsPersisted) {
      persistedIds = Sets.newHashSetWithExpectedSize(maxIdsPersisted);
      this.maxIdsPersisted = maxIdsPersisted;
    }

    /**
     * @return {@code true} if the {@code usageId} was added to the set and should be persisted
     * by the caller.
     */
    synchronized boolean addNewUsage(String usageId) {
      if (persistedIds.size() >= maxIdsPersisted) {
        return false;
      }
      return persistedIds.add(usageId);
    }
  }

  private static long getUsageRefreshPeriodNanos() {
    String usageRefreshPeriodSecsStr = System.getProperty(REFRESH_PERIOD_SECS_SYS_PROP);
    if (usageRefreshPeriodSecsStr != null) {
      double usageRefreshPeriodSecs = Double.parseDouble(usageRefreshPeriodSecsStr);
      return (long) (usageRefreshPeriodSecs * 1000 * 1000 * 1000);
    } else {
      return TimeUnit.SECONDS.toNanos(DEFAULT_USAGE_REFRESH_PERIOD_SECS);
    }
  }

  private static double getRefreshQueryDeadlineSecs() {
    String refreshDeadlineSecsStr = System.getProperty(REFRESH_QUERY_DEADLINE_SECS_SYS_PROP);
    if (refreshDeadlineSecsStr != null) {
      return Double.parseDouble(refreshDeadlineSecsStr);
    } else {
      return DEFAULT_REFRESH_QUERY_DEADLINE_SECS;
    }
  }

  private static double getPutDeadlineSecs() {
    String putDeadlineSecsStr = System.getProperty(PUT_DEADLINE_SECS_SYS_PROP);
    if (putDeadlineSecsStr != null) {
      return Double.parseDouble(putDeadlineSecsStr);
    } else {
      return DEFAULT_PUT_DEADLINE_SECS;
    }
  }

  private static long getNewUsageLoggingThresholdNanos() {
    String newUsageLoggingThreshSecsStr =
        System.getProperty(NEW_USAGE_LOGGING_THRESHOLD_SECS_SYS_PROP);
    if (newUsageLoggingThreshSecsStr != null) {
      double newUsageLoggingThreshSecs = Double.parseDouble(newUsageLoggingThreshSecsStr);
      return (long) (newUsageLoggingThreshSecs * 1000 * 1000 * 1000);
    } else {
      return Long.MAX_VALUE;
    }

  }

  /**
   * This class lazily captures the stack trace on the first call to {@link #get} and
   * returns the same stack trace on future calls to {@code get}. The purpose of this class is to
   * avoid any repeated overhead due to capturing the stack trace multiple times in the
   * same api invocation.
   */
  class LazyApiInvokerStackTrace {
    private Pair<String, Long> stackTraceInfo;

    /**
    * @return a {@code Pair} containing the stack trace string and the time it took to capture the
    * stack trace in nanoseconds.
    */
    private Pair<String, Long> get() {
      if (stackTraceInfo == null) {
        long startNs = ticker.read();
        String stackTrace = getApiInvokerStackTrace(apiPackagePrefixTrie);
        long captureTimeNanos = ticker.read() - startNs;
        stackTraceInfo = new Pair<String, Long>(stackTrace, captureTimeNanos);
      }
      return stackTraceInfo;
    }
  }

  private static PrefixTrie<Boolean> getApiPackagePrefixesTrie() {
    PrefixTrie<Boolean> prefixTrie = new PrefixTrie<Boolean>();

    for (String apiPrefix : DEFAULT_API_PACKAGE_PREFIXES) {
      prefixTrie.put(apiPrefix, Boolean.TRUE);
    }

    String sysPropApiPrefixesString = System.getProperty(PACKAGE_PREFIXES_TO_SKIP_SYS_PROP);
    if (sysPropApiPrefixesString != null) {
      String[] sysPropApiPrefixes = sysPropApiPrefixesString.split("\\,");
      for (String apiPrefix : sysPropApiPrefixes) {
        prefixTrie.put(apiPrefix, Boolean.TRUE);
      }
    }

    return prefixTrie;
  }

  /**
   * Return the stack trace of the invoker excluding stack frames from the top of the stack (most
   * recently invoked) that have a package prefix that matches a prefix in
   * {@code apiPackagePrefixes}. At max {@code MAX_STACK_FRAMES_SAVED} stack frames are
   * returned.
   */
  private static String getApiInvokerStackTrace(
      PrefixTrie<Boolean> apiPackagePrefixes) {
    StackTraceElement[] stack = Thread.currentThread().getStackTrace();
    int frameIdx;
    for (frameIdx = 1; frameIdx < stack.length; frameIdx++) {
      String className = stack[frameIdx].getClassName();
      if (apiPackagePrefixes.get(className) == null) {
        break;
      }
    }

    if (frameIdx >= stack.length) {
      return "";
    }

    int numFrames = stack.length - frameIdx;
    numFrames = Math.min(numFrames, MAX_STACK_FRAMES_SAVED);
    StringBuilder sb = new StringBuilder();
    for (; frameIdx < stack.length; frameIdx++) {
      sb.append(stack[frameIdx].toString());
      sb.append("\n");
    }
    if (sb.length() > 0) {
      sb.deleteCharAt(sb.length() - 1);
    }
    return sb.toString();
  }
}

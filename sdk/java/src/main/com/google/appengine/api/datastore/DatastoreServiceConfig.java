// Copyright 2010 Google Inc. All Rights Reserved.
package com.google.appengine.api.datastore;

import static com.google.common.base.Preconditions.checkNotNull;

import com.google.appengine.api.datastore.ReadPolicy.Consistency;
import com.google.common.base.Preconditions;

import java.io.ByteArrayInputStream;
import java.io.InputStream;

/**
 * User-configurable properties of the datastore.
 *
 * Notes on usage:<br>
 * The recommended way to instantiate a {@code DatastoreServiceConfig} object
 * is to statically import {@link Builder}.* and invoke a static creation
 * method followed by an instance mutator (if needed):
 *
 * <pre>
 * import static com.google.appengine.api.datastore.DatastoreServiceConfig.Builder.*;
 * import com.google.appengine.api.datastore.ReadPolicy.Consistency;
 *
 * ...
 *
 * // eventually consistent reads
 * DatastoreServiceConfig config = withReadPolicy(new ReadPolicy(Consistency.EVENTUAL));
 *
 * // eventually consistent reads with a 5 second deadline
 * DatastoreServiceConfig config =
 *   withReadPolicy(new ReadPolicy(Consistency.EVENTUAL)).deadline(5.0);
 * </pre>
 *
 */
public final class DatastoreServiceConfig {
  /**
   * The default maximum size a request RPC can be.
   */
  static final int DEFAULT_RPC_SIZE_LIMIT_BYTES = 1024 * 1024;

  /**
   * The default maximum number of keys allowed in a Get request.
   */
  static final int DEFAULT_MAX_BATCH_GET_KEYS = 1000;

  /**
   * The default maximum number of entities allowed in a Put or Delete request.
   */
  static final int DEFAULT_MAX_BATCH_WRITE_ENTITIES = 500;

  /**
   * Name of a system property that users can specify to control the default
   * max entity groups per rpc.
   */
  static final String DEFAULT_MAX_ENTITY_GROUPS_PER_RPC_SYS_PROP =
      "appengine.datastore.defaultMaxEntityGroupsPerRpc";

  /**
   * The default number of max entity groups per rpc.
   */
  static final int DEFAULT_MAX_ENTITY_GROUPS_PER_RPC = getDefaultMaxEntityGroupsPerRpc();

  static final String CALLBACKS_CONFIG_SYS_PROP = "appengine.datastore.callbacksConfig";

  static volatile DatastoreCallbacks CALLBACKS = null;

  /**
   * Keep in sync with
   * com.google.appengine.tools.compilation.DatastoreCallbacksProcessor.CALLBACKS_CONFIG_FILE
   */
  private static final String CALLBACKS_CONFIG_FILE = "/META-INF/datastorecallbacks.xml";

  static int getDefaultMaxEntityGroupsPerRpc() {
    return getDefaultMaxEntityGroupsPerRpc(DEFAULT_MAX_ENTITY_GROUPS_PER_RPC_SYS_PROP, 10);
  }

  /**
   * Returns the value of the given system property as an int, or return the
   * default value if there is no property with that name set.
   */
  static int getDefaultMaxEntityGroupsPerRpc(String sysPropName, int defaultVal) {
    String sysPropVal = System.getProperty(sysPropName);
    return sysPropVal == null ? defaultVal : Integer.parseInt(sysPropVal);
  }

  private static InputStream getCallbacksConfigInputStream() {
    InputStream is;
    String callbacksConfig = System.getProperty(CALLBACKS_CONFIG_SYS_PROP);
    if (callbacksConfig != null) {
      is = new ByteArrayInputStream(callbacksConfig.getBytes());
    } else {
      is = DatastoreServiceConfig.class.getResourceAsStream(CALLBACKS_CONFIG_FILE);
    }
    return is;
  }

  private final DatastoreCallbacks instanceDatastoreCallbacks;

  private ImplicitTransactionManagementPolicy implicitTransactionManagementPolicy =
      ImplicitTransactionManagementPolicy.NONE;

  private ReadPolicy readPolicy = new ReadPolicy(Consistency.STRONG);

  private Double deadline;

  private AppIdNamespace appIdNamespace;

  private int maxRpcSizeBytes = DEFAULT_RPC_SIZE_LIMIT_BYTES;
  private int maxBatchWriteEntities = DEFAULT_MAX_BATCH_WRITE_ENTITIES;
  private int maxBatchReadEntities = DEFAULT_MAX_BATCH_GET_KEYS;
  private int maxEntityGroupsPerRpc = DEFAULT_MAX_ENTITY_GROUPS_PER_RPC;

  private EntityCacheConfig entityCacheConfig = null;

  /**
   * Cannot be directly instantiated, use {@link Builder} instead.
   *
   * @param datastoreCallbacks the callback methods to invoke on specific datastore operations.
   * If null the datastore callbacks are derived from {@link #getCallbacksConfigInputStream}.
   */
  private DatastoreServiceConfig( DatastoreCallbacks datastoreCallbacks) {
    instanceDatastoreCallbacks = datastoreCallbacks;
  }

  /**
   * Copy constructor
   */
  DatastoreServiceConfig(DatastoreServiceConfig config) {
    implicitTransactionManagementPolicy = config.implicitTransactionManagementPolicy;
    readPolicy = config.readPolicy;
    deadline = config.deadline;
    maxRpcSizeBytes = config.maxRpcSizeBytes;
    maxBatchWriteEntities = config.maxBatchWriteEntities;
    maxBatchReadEntities = config.maxBatchReadEntities;
    maxEntityGroupsPerRpc = config.maxEntityGroupsPerRpc;
    instanceDatastoreCallbacks = config.instanceDatastoreCallbacks;
    appIdNamespace = config.appIdNamespace;
  }

  /**
   * Sets the implicit transaction management policy.
   * @param p the implicit transaction management policy to set.
   * @return {@code this} (for chaining)
   */
  public DatastoreServiceConfig implicitTransactionManagementPolicy(
      ImplicitTransactionManagementPolicy p) {
    if (p == null) {
      throw new NullPointerException("implicit transaction management policy must not be null");
    }
    implicitTransactionManagementPolicy = p;
    return this;
  }

  /**
   * Sets the read policy.
   * @param readPolicy the read policy to set.
   * @return {@code this} (for chaining)
   */
  public DatastoreServiceConfig readPolicy(ReadPolicy readPolicy) {
    if (readPolicy == null) {
      throw new NullPointerException("read policy must not be null");
    }
    this.readPolicy = readPolicy;
    return this;
  }

  /**
   * Sets the deadline, in seconds, for all rpcs initiated by the
   * {@link DatastoreService} with which this config is associated.
   * @param deadline the deadline to set.
   * @throws IllegalArgumentException if deadline is not positive
   * @return {@code this} (for chaining)
   */
  public DatastoreServiceConfig deadline(double deadline) {
    if (deadline <= 0.0) {
      throw new IllegalArgumentException("deadline must be > 0, got " + deadline);
    }
    this.deadline = deadline;
    return this;
  }

  DatastoreServiceConfig appIdNamespace(AppIdNamespace appIdNamespace) {
    this.appIdNamespace = appIdNamespace;
    return this;
  }

  /**
   * Sets the maximum number of entities that can be modified in a single RPC.
   * @param maxBatchWriteEntities the limit to set
   * @throws IllegalArgumentException if maxBatchWriteEntities is not greater
   * than zero
   * @return {@code this} (for chaining)
   */
  DatastoreServiceConfig maxBatchWriteEntities(int maxBatchWriteEntities) {
    if (maxBatchWriteEntities <= 0) {
      throw new IllegalArgumentException("maxBatchWriteEntities must be > 0, got "
          + maxBatchWriteEntities);
    }
    this.maxBatchWriteEntities = maxBatchWriteEntities;
    return this;
  }

  /**
   * Sets the maximum number of entities that can be read in a single RPC.
   * @param maxBatchReadEntities the limit to set
   * @throws IllegalArgumentException if maxBatchReadEntities is not greater
   * than zero
   * @return {@code this} (for chaining)
   */
  DatastoreServiceConfig maxBatchReadEntities(int maxBatchReadEntities) {
    if (maxBatchReadEntities <= 0) {
      throw new IllegalArgumentException("maxBatchReadEntities must be > 0, got "
          + maxBatchReadEntities);
    }
    this.maxBatchReadEntities = maxBatchReadEntities;
    return this;
  }

  /**
   * Sets the maximum size in bytes an RPC can be.
   *
   * The size of the request can be exceeded if the RPC cannot be split enough
   * to respect this limit. However there may be a hard limit on the RPC which,
   * if exceeded, will cause an exception to be thrown.
   *
   * @param maxRpcSizeBytes the limit to set
   * @throws IllegalArgumentException if maxRpcSizeBytes is not positive
   * @return {@code this} (for chaining)
   */
  DatastoreServiceConfig maxRpcSizeBytes(int maxRpcSizeBytes) {
    if (maxRpcSizeBytes < 0) {
      throw new IllegalArgumentException("maxRpcSizeBytes must be >= 0, got "
          + maxRpcSizeBytes);
    }
    this.maxRpcSizeBytes = maxRpcSizeBytes;
    return this;
  }

  /**
   * Sets the maximum number of entity groups that can be represented in a
   * single rpc.
   *
   * For a non-transactional operation that involves more entity groups than the
   * maximum, the operation will be performed by executing multiple, asynchronous
   * rpcs to the datastore, each of which has no more entity groups represented
   * than the maximum.  So, if a put() operation has 8 entity groups and the
   * maximum is 3, we will send 3 rpcs, 2 with 3 entity groups and 1 with 2
   * entity groups.  This is a performance optimization - in many cases
   * multiple, small, asynchronous rpcs will finish faster than a single large
   * asynchronous rpc.  The optimal value for this property will be
   * application-specific, so experimentation is encouraged.
   *
   * @param maxEntityGroupsPerRpc the maximum number of entity groups per rpc
   * @throws IllegalArgumentException if maxEntityGroupsPerRpc is not greater
   * than zero
   * @return {@code this} (for chaining)
   */
  public DatastoreServiceConfig maxEntityGroupsPerRpc(int maxEntityGroupsPerRpc) {
    if (maxEntityGroupsPerRpc <= 0) {
      throw new IllegalArgumentException("maxEntityGroupsPerRpc must be > 0, got "
          + maxEntityGroupsPerRpc);
    }
    this.maxEntityGroupsPerRpc = maxEntityGroupsPerRpc;
    return this;
  }

  /**
   * Sets the entity cache configuration to use for entity caching.
   *
   * To successfully use entity caching it is important that all application code that updates
   * or reads the same set of entities uses a {@code DatastoreServiceConfig} with the same entity
   * cache configuration.
   *
   * By default the datastore service does not do any entity caching.
   *
   * @param entityCacheConfig the entity cache configuration to use for entity caching.
   * @return {@code this} (for chaining)
   */
  DatastoreServiceConfig entityCacheConfig(EntityCacheConfig entityCacheConfig) {
    checkNotNull(entityCacheConfig, "The entityCacheConfig argument can not be null");
    this.entityCacheConfig = entityCacheConfig;
    return this;
  }

  /**
   * @return The {@code ImplicitTransactionManagementPolicy} to use.
   */
  public ImplicitTransactionManagementPolicy getImplicitTransactionManagementPolicy() {
    return implicitTransactionManagementPolicy;
  }

  /**
   * @return The {@code ReadPolicy} to use.
   */
  public ReadPolicy getReadPolicy() {
    return readPolicy;
  }

  /**
   * @return The maximum number of entity groups per rpc.
   */
  public Integer getMaxEntityGroupsPerRpc() {
    return getMaxEntityGroupsPerRpcInternal();
  }

  int getMaxEntityGroupsPerRpcInternal() {
    return maxEntityGroupsPerRpc;
  }

  /**
   * @return The deadline to use.  Can be {@code null}.
   */
  public Double getDeadline() {
    return deadline;
  }

  AppIdNamespace getAppIdNamespace() {
    return appIdNamespace == null ? DatastoreApiHelper.getCurrentAppIdNamespace() : appIdNamespace;
  }

  boolean exceedsWriteLimits(int count, int size) {
    return (count > maxBatchWriteEntities ||
        (count > 1 && size > maxRpcSizeBytes));
  }

  boolean exceedsReadLimits(int count, int size) {
    return (count > maxBatchReadEntities ||
        (count > 1 && size > maxRpcSizeBytes));
  }

  DatastoreCallbacks getDatastoreCallbacks() {
    if (instanceDatastoreCallbacks != null) {
      return instanceDatastoreCallbacks;
    }

    if (CALLBACKS == null) {
      InputStream is = getCallbacksConfigInputStream();
      if (is == null) {
        CALLBACKS = DatastoreCallbacks.NoOpDatastoreCallbacks.INSTANCE;
      } else {
        CALLBACKS = new DatastoreCallbacksImpl(is, false);
      }
    }
    return CALLBACKS;
  }

  /**
   * @return the {@link EntityCacheConfig} to use or {@code null} if no entity cache configuration
   *     was specified.
   */
  EntityCacheConfig getEntityCacheConfig() {
    return entityCacheConfig;
  }

  /**
   * Contains static creation methods for {@link DatastoreServiceConfig}.
   */
  public static final class Builder {

    /**
     * Create a {@link DatastoreServiceConfig} with the given implicit
     * transaction management policy.
     * @param p the implicit transaction management policy to set.
     * @return The newly created DatastoreServiceConfig instance.
     */
    public static DatastoreServiceConfig withImplicitTransactionManagementPolicy(
        ImplicitTransactionManagementPolicy p) {
      return withDefaults().implicitTransactionManagementPolicy(p);
    }

    /**
     * Create a {@link DatastoreServiceConfig} with the given read
     * policy.
     * @param readPolicy the read policy to set.
     * @return The newly created DatastoreServiceConfig instance.
     */
    public static DatastoreServiceConfig withReadPolicy(ReadPolicy readPolicy) {
      return withDefaults().readPolicy(readPolicy);
    }

    /**
     * Create a {@link DatastoreServiceConfig} with the given deadline, in
     * seconds.
     * @param deadline the deadline to set.
     * @throws IllegalArgumentException if deadline is not positive
     * @return The newly created DatastoreServiceConfig instance.
     */
    public static DatastoreServiceConfig withDeadline(double deadline) {
      return withDefaults().deadline(deadline);
    }

    /**
     * Create a {@link DatastoreServiceConfig} with the given maximum entity
     * groups per rpc.
     * @param maxEntityGroupsPerRpc the maximum entity groups per rpc to set.
     * @return The newly created DatastoreServiceConfig instance.
     *
     * @see DatastoreServiceConfig#maxEntityGroupsPerRpc(int)
     */
    public static DatastoreServiceConfig withMaxEntityGroupsPerRpc(int maxEntityGroupsPerRpc) {
      return withDefaults().maxEntityGroupsPerRpc(maxEntityGroupsPerRpc);
    }

    /**
     * Create a {@link DatastoreServiceConfig} with the given entity cache configuration.
     *
     * @param entityCacheConfig the entity cache configuration to use for entity caching.
     *
     * @see DatastoreServiceConfig#entityCacheConfig
     */
    static DatastoreServiceConfig withEntityCacheConfig(
        EntityCacheConfig entityCacheConfig) {
      return withDefaults().entityCacheConfig(entityCacheConfig);
    }

    /**
     * Helper method for creating a {@link DatastoreServiceConfig} instance with the
     * specified {@code datastoreCallbacks}. The callbacks defined for the application are
     * bypassed and the specified callbacks are used instead.
     *
     * @return The newly created DatastoreServiceConfig instance.
     */
    static DatastoreServiceConfig withDatastoreCallbacks(DatastoreCallbacks datastoreCallbacks) {
      Preconditions.checkNotNull(datastoreCallbacks);
      return new DatastoreServiceConfig(datastoreCallbacks);
    }

    /**
     * Helper method for creating a {@link DatastoreServiceConfig}
     * instance with default values: Implicit transactions are disabled, reads
     * execute with {@link Consistency#STRONG}, and no deadline is
     * provided.  When no deadline is provided, datastore rpcs execute with the
     * system-defined deadline.
     *
     * @return The newly created DatastoreServiceConfig instance.
     */
    public static DatastoreServiceConfig withDefaults() {
      return new DatastoreServiceConfig((DatastoreCallbacks) null);
    }

    private Builder() {}
  }
}

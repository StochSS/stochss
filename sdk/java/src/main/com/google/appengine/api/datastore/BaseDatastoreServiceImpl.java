// Copyright 2010 Google Inc. All Rights Reserved.

package com.google.appengine.api.datastore;

import static com.google.common.base.Preconditions.checkArgument;

import com.google.appengine.api.datastore.EntityCachingStrategy.NoOpEntityCachingStrategy;
import com.google.apphosting.api.ApiProxy;
import com.google.apphosting.api.DatastorePb;

import java.util.concurrent.Future;
import java.util.logging.Logger;

/**
 * State and behavior that is common to both synchronous and asynchronous
 * Datastore API implementations.
 *
 */
abstract class BaseDatastoreServiceImpl {
  /**
   * It doesn't actually matter what this value is, the back end will set its
   * own deadline.  All that matters is that we set a value.
   */
  static final long ARBITRARY_FAILOVER_READ_MS = -1;

  /**
   * User-provided config options.
   */
  private final DatastoreServiceConfig datastoreServiceConfig;

  /**
   * Config that we'll pass to all api calls.
   */
  final ApiProxy.ApiConfig apiConfig;

  /**
   * Knows which transaction to use when the user does not explicitly provide
   * one.
   */
  final TransactionStack defaultTxnProvider;

  EntityCachingStrategy entityCachingStrategy;

  final Logger logger = Logger.getLogger(getClass().getName());

  BaseDatastoreServiceImpl(DatastoreServiceConfig datastoreServiceConfig,
      TransactionStack defaultTxnProvider) {
    this.datastoreServiceConfig = datastoreServiceConfig;
    this.apiConfig = createApiConfig(datastoreServiceConfig);
    this.defaultTxnProvider = defaultTxnProvider;
    if (datastoreServiceConfig.getEntityCacheConfig() == null) {
      entityCachingStrategy = NoOpEntityCachingStrategy.INSTANCE;
    } else {
      entityCachingStrategy = EntityCachingStrategy.createStrategy(datastoreServiceConfig);
    }
  }

  protected DatastoreServiceConfig getDatastoreServiceConfig() {
    return datastoreServiceConfig;
  }

  protected EntityCachingStrategy getEntityCachingStrategy() {
    return entityCachingStrategy;
  }

  private ApiProxy.ApiConfig createApiConfig(DatastoreServiceConfig config) {
    ApiProxy.ApiConfig apiConfig = new ApiProxy.ApiConfig();
    apiConfig.setDeadlineInSeconds(config.getDeadline());
    return apiConfig;
  }

  /**
   * Helper class used to encapsulate the result of a call to
   * {@link #getOrCreateTransaction()}.
   */
  static final class GetOrCreateTransactionResult {

    private final boolean isNew;
    private final Transaction txn;

    GetOrCreateTransactionResult(boolean isNew,Transaction txn) {
      this.isNew = isNew;
      this.txn = txn;
    }

    /**
     * @return {@code true} if the Transaction was created and should therefore
     * be closed before the end of the operation, {@code false} otherwise.
     */
    public boolean isNew() {
      return isNew;
    }

    /**
     * @return The Transaction to use.  Can be {@code null}.
     */
    public Transaction getTransaction() {
      return txn;
    }
  }

  static void validateQuery(Query query) {
    checkArgument(query.getFilterPredicates().isEmpty() || query.getFilter() == null,
        "A query cannot have both a filter and filter predicates set.");
    checkArgument(query.getProjections().isEmpty() || !query.isKeysOnly(),
        "A query cannot have both projections and keys-only set.");
  }

  /**
   * Return the current transaction if one already exists, otherwise create
   * a new transaction or throw an exception according to the
   * {@link ImplicitTransactionManagementPolicy}.
   */
  GetOrCreateTransactionResult getOrCreateTransaction() {
    Transaction currentTxn = getCurrentTransaction(null);
    if (currentTxn != null) {
      return new GetOrCreateTransactionResult(false, currentTxn);
    }

    switch(datastoreServiceConfig.getImplicitTransactionManagementPolicy()) {
      case NONE:
        return new GetOrCreateTransactionResult(false, null);
      case AUTO:
        return new GetOrCreateTransactionResult(true, beginTransactionInternal(
            TransactionOptions.Builder.withDefaults()));
      default:
        final String msg = "Unexpected Transaction Creation Policy: " +
            datastoreServiceConfig.getImplicitTransactionManagementPolicy();
        logger.severe(msg);
        throw new IllegalArgumentException(msg);
    }
  }

  static DatastorePb.Transaction localTxnToRemoteTxn(Transaction local) {
    DatastorePb.Transaction remote = new DatastorePb.Transaction();
    remote.setApp(local.getApp());
    remote.setHandle(Long.parseLong(local.getId()));
    return remote;
  }

  Transaction beginTransactionInternal(TransactionOptions options) {
    DatastorePb.Transaction remoteTxn = new DatastorePb.Transaction();
    DatastorePb.BeginTransactionRequest request = new DatastorePb.BeginTransactionRequest();
    request.setApp(DatastoreApiHelper.getCurrentAppId());
    request.setAllowMultipleEg(options.isXG());

    Future<DatastorePb.Transaction> future =
        DatastoreApiHelper.makeAsyncCall(apiConfig, "BeginTransaction", request, remoteTxn);

    Transaction localTxn = new TransactionImpl(apiConfig, request.getApp(), future,
        defaultTxnProvider, datastoreServiceConfig.getDatastoreCallbacks(), entityCachingStrategy);

    defaultTxnProvider.push(localTxn);
    return localTxn;
  }

  public Transaction getCurrentTransaction() {
    return defaultTxnProvider.peek();
  }

  public Transaction getCurrentTransaction(Transaction returnedIfNoTxn) {
    return defaultTxnProvider.peek(returnedIfNoTxn);
  }
}

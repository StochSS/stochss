// Copyright 2008 Google Inc. All rights reserved.

package com.google.appengine.api.datastore;

import static com.google.appengine.api.datastore.DatastoreServiceConfig.Builder.withDefaults;
import static com.google.appengine.api.datastore.DatastoreServiceConfig.Builder.withImplicitTransactionManagementPolicy;

import com.google.appengine.spi.ServiceFactoryFactory;

/**
 * Creates DatastoreService implementations.
 *
 */
public final class DatastoreServiceFactory {

  /**
   * Creates a {@code DatastoreService} using the provided config.
   */
  public static DatastoreService getDatastoreService(DatastoreServiceConfig config) {
    return getFactory().getDatastoreService(config);
  }

  /**
   * Creates an {@code AsyncDatastoreService} using the provided config. The async datastore service
   * does not support implicit transaction management policy
   * {@link ImplicitTransactionManagementPolicy#AUTO}.
   *
   * @throws IllegalArgumentException If the provided {@link DatastoreServiceConfig} has an implicit
   *         transaction management policy of {@link ImplicitTransactionManagementPolicy#AUTO}.
   */
  public static AsyncDatastoreService getAsyncDatastoreService(DatastoreServiceConfig config) {
    return getFactory().getAsyncDatastoreService(config);
  }

  /**
   * Creates a {@code DatastoreService} using the default config (
   * {@link DatastoreServiceConfig.Builder#withDefaults()}).
   */
  public static DatastoreService getDatastoreService() {
    return getDatastoreService(withDefaults());
  }

  /**
   * Creates an {@code AsyncDatastoreService} using the default config (
   * {@link DatastoreServiceConfig.Builder#withDefaults()}).
   */
  public static AsyncDatastoreService getAsyncDatastoreService() {
    return getAsyncDatastoreService(withDefaults());
  }

  /**
   * Creates a {@code DatastoreService} using the provided config.
   *
   * @deprecated Use {@link #getDatastoreService(DatastoreServiceConfig)} instead.
   */
  @Deprecated
  public static DatastoreService getDatastoreService(DatastoreConfig oldConfig) {
    ImplicitTransactionManagementPolicy policy = oldConfig.getImplicitTransactionManagementPolicy();
    DatastoreServiceConfig newConfig = withImplicitTransactionManagementPolicy(policy);
    return getDatastoreService(newConfig);
  }

  /**
   * @deprecated Use {@link DatastoreServiceConfig.Builder#withDefaults()} instead.
   */
  @Deprecated
  public static DatastoreConfig getDefaultDatastoreConfig() {
    return DatastoreConfig.DEFAULT;
  }

  /**
   * @deprecated Exposed by accident, do not instantiate.
   */
  @Deprecated
  public DatastoreServiceFactory() {}

  private static IDatastoreServiceFactory getFactory() {
    return ServiceFactoryFactory.getFactory(IDatastoreServiceFactory.class);
  }

}

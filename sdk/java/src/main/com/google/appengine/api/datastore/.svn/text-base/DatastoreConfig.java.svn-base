// Copyright 2008 Google Inc. All Rights Reserved.
package com.google.appengine.api.datastore;

/**
 * User-configurable properties of the datastore.
 *
 * @deprecated Use {@link DatastoreServiceConfig} instead.
 *
 */
@Deprecated
public interface DatastoreConfig {

  /**
   * @return The {@code ImplicitTransactionManagementPolicy} to use.
   * @deprecated Use {@link DatastoreServiceConfig#getImplicitTransactionManagementPolicy}
   */
  @Deprecated
  ImplicitTransactionManagementPolicy getImplicitTransactionManagementPolicy();

  /**
   * The default configuration for the datastore.  This is the configuration
   * that is used if no configuration is explicitly provided.
   *
   * @deprecated Use {@link DatastoreServiceConfig} instead.
   */
  @Deprecated
  DatastoreConfig DEFAULT = new DatastoreConfig() {
    @Override
    public ImplicitTransactionManagementPolicy getImplicitTransactionManagementPolicy() {
      return ImplicitTransactionManagementPolicy.NONE;
    }
  };
}

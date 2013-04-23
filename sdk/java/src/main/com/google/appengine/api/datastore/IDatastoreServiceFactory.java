// Copyright 2012 Google Inc. All rights reserved.

package com.google.appengine.api.datastore;

/**
 * This interface should be implemented by providers of the {@link DatastoreService} and registered
 * with {@link com.google.appengine.spi.ServiceFactoryFactory}.
 *
 */
public interface IDatastoreServiceFactory {
  /**
   * Creates a {@code DatastoreService} using the provided config.
   */
  DatastoreService getDatastoreService(DatastoreServiceConfig config);

  /**
   * Creates an {@code AsyncDatastoreService} using the provided config. The async datastore service
   * does not support implicit transaction management policy
   * {@link ImplicitTransactionManagementPolicy#AUTO}.
   *
   * @throws IllegalArgumentException If the provided {@link DatastoreServiceConfig} has an implicit
   *         transaction management policy of {@link ImplicitTransactionManagementPolicy#AUTO}.
   */
  AsyncDatastoreService getAsyncDatastoreService(DatastoreServiceConfig config);

}

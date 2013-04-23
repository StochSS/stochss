// Copyright 2012 Google Inc. All rights reserved.

package com.google.appengine.api.datastore;

/**
 * Creates DatastoreService instances.
 *
 */
final class DatastoreServiceFactoryImpl implements IDatastoreServiceFactory {

  @Override
  public DatastoreService getDatastoreService(DatastoreServiceConfig config) {
    return new DatastoreServiceImpl(config, new TransactionStackImpl());
  }

  @Override
  public AsyncDatastoreService getAsyncDatastoreService(DatastoreServiceConfig config) {
    return new AsyncDatastoreServiceImpl(config, new TransactionStackImpl());
  }

}

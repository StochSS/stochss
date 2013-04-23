// Copyright 2011 Google Inc. All Rights Reserved.
package com.google.appengine.api.datastore;

/**
 * Internal interface describing the callback operations we support.
 *
 */
interface DatastoreCallbacks {

  /**
   * Runs all PrePut callbacks for the given context.
   *
   * @param context The callback context
   */
  void executePrePutCallbacks(PutContext context);

  /**
   * Runs all PostPut callbacks for the given context.
   *
   * @param context The callback context
   */
  void executePostPutCallbacks(PutContext context);

  /**
   * Runs all PreDelete callbacks for the given context.
   *
   * @param context The callback context
   */
  void executePreDeleteCallbacks(DeleteContext context);

  /**
   * Runs all PostDelete callbacks for the given context.
   *
   * @param context The callback context
   */
  void executePostDeleteCallbacks(DeleteContext context);

  /**
   * Runs all PreGet callbacks for the given context.
   *
   * @param context The callback context
   */
  void executePreGetCallbacks(PreGetContext context);

  /**
   * Runs all PostLoad callbacks for the given context.
   *
   * @param context The callback context
   */
  void executePostLoadCallbacks(PostLoadContext context);

  /**
   * Runs all PreQuery callbacks for the given context.
   *
   * @param context The callback context
   */
  void executePreQueryCallbacks(PreQueryContext context);

  /**
   * Class that provides a no-op implementation of the {@code DatastoreCallbacks} interface.
   */
  static class NoOpDatastoreCallbacks implements DatastoreCallbacks {
    static final DatastoreCallbacks INSTANCE = new NoOpDatastoreCallbacks();

    @Override
    public void executePrePutCallbacks(PutContext context) { }

    @Override
    public void executePostPutCallbacks(PutContext context) { }

    @Override
    public void executePreDeleteCallbacks(DeleteContext context) { }

    @Override
    public void executePostDeleteCallbacks(DeleteContext context) { }

    @Override
    public void executePreGetCallbacks(PreGetContext context) { }

    @Override
    public void executePostLoadCallbacks(PostLoadContext context) { }

    @Override
    public void executePreQueryCallbacks(PreQueryContext context) { }
  }
}

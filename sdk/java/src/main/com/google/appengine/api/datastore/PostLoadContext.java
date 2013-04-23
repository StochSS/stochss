// Copyright 2012 Google. All Rights Reserved.
package com.google.appengine.api.datastore;

import java.util.Arrays;
import java.util.List;

/**
 * Concrete {@link CallbackContext} implementation that is specific to
 * intercepted operations that load {@link Entity Entities}, currently get
 * and "query".  It is important to note that when a PostLoadContext is
 * provided to a callback following a get operation, {@link #getElements()}
 * returns all retrieved Entities.  However, when a PostLoadContext is provided
 * to a callback following a query, a separate PostLoadContext will be
 * constructed for each Entity in the result set so {@link #getElements()} will
 * only return a {@link List} containing a single Entity. This is due to the
 * streaming nature of query responses.
 *
 */
public final class PostLoadContext extends BaseCallbackContext<Entity> {

  PostLoadContext(CurrentTransactionProvider currentTransactionProvider,
      List<Entity> results) {
    super(currentTransactionProvider, results);
  }

  PostLoadContext(CurrentTransactionProvider currentTransactionProvider, Entity result) {
    this(currentTransactionProvider, Arrays.asList(result));
  }

  @Override
  String getKind(Entity entity) {
    return entity.getKind();
  }
}

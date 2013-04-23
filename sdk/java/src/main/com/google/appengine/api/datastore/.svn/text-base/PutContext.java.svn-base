// Copyright 2011 Google. All Rights Reserved.
package com.google.appengine.api.datastore;

import java.util.List;

/**
 * Concrete {@link CallbackContext} implementation that is specific to
 * put() callbacks.
 *
 */
public final class PutContext extends BaseCallbackContext<Entity> {

  PutContext(CurrentTransactionProvider currentTxnProvider, List<Entity> entities) {
    super(currentTxnProvider, entities);
  }

  @Override
  String getKind(Entity entity) {
    return entity.getKind();
  }
}

// Copyright 2011 Google. All Rights Reserved.
package com.google.appengine.api.datastore;

import java.util.List;

/**
 * Concrete {@link CallbackContext} implementation that is specific to
 * delete() callbacks.
 *
 */
public final class DeleteContext extends BaseCallbackContext<Key> {

  DeleteContext(CurrentTransactionProvider currentTxnProvider, List<Key> keys) {
    super(currentTxnProvider, keys);
  }

  @Override
  String getKind(Key key) {
    return key.getKind();
  }
}

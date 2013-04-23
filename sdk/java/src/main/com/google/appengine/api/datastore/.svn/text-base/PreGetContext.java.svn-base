// Copyright 2012 Google. All Rights Reserved.
package com.google.appengine.api.datastore;

import java.util.List;
import java.util.Map;

/**
 * Concrete {@link CallbackContext} implementation that is specific to
 * intercepted get() operations. Methods annotated with {@PreGet} that receive
 * instances of this class may modify the result of the get() operation by
 * calling {@link #setResultForCurrentElement(Entity)}. Keys that receive
 * results via this method will not be fetched from the datastore. This is an
 * effective way to inject cached results.
 *
 */
public final class PreGetContext extends BaseCallbackContext<Key> {

  /**
   * The Map that wil ultimately be populated with the result of the get() RPC.
   */
  private final Map<Key, Entity> resultMap;

  PreGetContext(CurrentTransactionProvider currentTransactionProvider, List<Key> keys,
      Map<Key, Entity> resultMap) {
    super(currentTransactionProvider, keys);
    this.resultMap = resultMap;
  }

  @Override
  String getKind(Key key) {
    return key.getKind();
  }

  /**
   * Set the {@link Entity} that will be associated with the {@link Key}
   * returned by {@link #getCurrentElement()} in the result of the get()
   * operation. This will prevent the get() operation from fetching the
   * Entity from the datastore. This is an effective way to inject cached
   * results.
   *
   * @param entity The entity to provide as the result for the current element.
   *
   * @throws IllegalArgumentException If the key of the provided entity is not
   *     equal to the key returned by {@link #getCurrentElement()}.
   */
  public void setResultForCurrentElement(Entity entity) {
    if (entity == null) {
      throw new NullPointerException("entity cannot be null");
    }
    Key curKey = getCurrentElement();
    if (!curKey.equals(entity.getKey())) {
      throw new IllegalArgumentException("key of provided entity must be equal to current element");
    }
    resultMap.put(getCurrentElement(), entity);
  }
}

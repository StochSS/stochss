// Copyright 2012 Google. All Rights Reserved.
package com.google.appengine.api.datastore;

import java.util.Arrays;

/**
 * Concrete {@link CallbackContext} implementation that is specific to
 * intercepted queries. Methods annotated with {@PreQuery} that receive
 * instances of this class may modify the {@link Query} returned by calling
 * {@link #getCurrentElement()}. This is an effective way to modify queries
 * prior to execution.
 *
 */
public final class PreQueryContext extends BaseCallbackContext<Query> {

  PreQueryContext(CurrentTransactionProvider currentTransactionProvider, Query query) {
    super(currentTransactionProvider, Arrays.asList(new Query(query)));
  }

  @Override
  String getKind(Query query) {
    return query.getKind();
  }
}

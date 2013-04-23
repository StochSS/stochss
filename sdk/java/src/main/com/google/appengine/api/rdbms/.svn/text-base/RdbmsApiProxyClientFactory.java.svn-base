// Copyright 2010 Google Inc. All Rights Reserved.

package com.google.appengine.api.rdbms;

import com.google.cloud.sql.jdbc.internal.SqlClient;
import com.google.cloud.sql.jdbc.internal.SqlClientFactory;
import com.google.cloud.sql.jdbc.internal.Url;

/**
 * {@link SqlClientFactory} implementation that instantiates a
 * {@link RdbmsApiProxyClient}.
 *
 */
class RdbmsApiProxyClientFactory implements SqlClientFactory {
  @Override
  public SqlClient create(Url url) {
    return new RdbmsApiProxyClient(url.getInstance());
  }
}

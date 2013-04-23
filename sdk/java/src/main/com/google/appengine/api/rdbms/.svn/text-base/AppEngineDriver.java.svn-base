// Copyright 2010 Google Inc. All Rights Reserved.

package com.google.appengine.api.rdbms;

import com.google.cloud.sql.jdbc.Driver;

import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * AppEngine RDBMS JDBC Driver.
 *
 */
public class AppEngineDriver extends Driver {
  private static final Logger LOG = Logger.getLogger(AppEngineDriver.class.getName());

  static {
    registerDriver();
  }

  private static void registerDriver() {
    try {
      DriverManager.registerDriver(new AppEngineDriver());
    } catch (SQLException e) {
      LOG.log(Level.SEVERE, "Unable to register AppEngineDriver automatically.", e);
    }
  }

  public AppEngineDriver() {
    super(new RdbmsApiProxyClientFactory());
  }
}

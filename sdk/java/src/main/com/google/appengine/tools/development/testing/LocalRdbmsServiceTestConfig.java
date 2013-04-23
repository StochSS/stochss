// Copyright 2010 Google Inc. All Rights Reserved.

package com.google.appengine.tools.development.testing;

import com.google.appengine.api.rdbms.dev.LocalRdbmsProperties;
import com.google.appengine.api.rdbms.dev.LocalRdbmsService;
import com.google.appengine.tools.development.ApiProxyLocal;
import com.google.cloud.sql.jdbc.internal.SqlClientFactory;
import com.google.common.base.Joiner;

import org.hsqldb.jdbcDriver;

import java.util.Map;

/**
 * Config for accessing the local RDBMS service in tests.
 * Default behavior is to configure the local service to use an in-memory
 * database.  {@link #tearDown()} does not wipe out data or tables.
 *
 */
public class LocalRdbmsServiceTestConfig implements LocalServiceTestConfig {

  private String driverClass = jdbcDriver.class.getName();
  private String driverUrl = "jdbc:hsqldb:mem:%s";
  private LocalRdbmsService.ServerType serverType = LocalRdbmsService.ServerType.LOCAL;
  private String extraDriverProperties;
  private Class<? extends SqlClientFactory> remoteClientFactory;
  private String database;
  private String user;
  private String password;

  @Override
  public void setUp() {
    ApiProxyLocal proxy = LocalServiceTestHelper.getApiProxyLocal();
    proxy.setProperty(LocalRdbmsProperties.DRIVER_PROPERTY, driverClass);
    proxy.setProperty(LocalRdbmsProperties.JDBC_CONNECTION_URL_STRING_PROPERTY, driverUrl);
    proxy.setProperty(LocalRdbmsService.SERVER_TYPE, serverType.flagValue());
    proxy.setProperty(LocalRdbmsProperties.EXTRA_DRIVER_PROPERTIES_PROPERTY, extraDriverProperties);
    if (remoteClientFactory != null) {
      proxy.setProperty(LocalRdbmsProperties.HOSTED_CLIENT_FACTORY_PROPERTY,
          remoteClientFactory.getName());
    }
    if (database != null) {
      proxy.setProperty(LocalRdbmsProperties.JDBC_CONNECTION_DATABASE_PROPERTY, database);
    }
    if (user != null) {
      proxy.setProperty(LocalRdbmsProperties.JDBC_CONNECTION_USER_PROPERTY, user);
    }
    if (password != null) {
      proxy.setProperty(LocalRdbmsProperties.JDBC_CONNECTION_PASSWORD_PROPERTY, password);
    }
  }

  @Override
  public void tearDown() {
  }

  public static LocalRdbmsService getLocalRdbmsService() {
    return (LocalRdbmsService) LocalServiceTestHelper.getLocalService(LocalRdbmsService.PACKAGE);
  }

  /**
   * @return The driver class.
   */
  public String getDriverClass() {
    return driverClass;
  }

  /**
   * Sets the class of the driver used by the
   * {@link com.google.appengine.api.rdbms.dev.LocalRdbmsServiceLocalDriver} and
   * attempts to load {@code driverClass} in the current {@link ClassLoader}.
   *
   * @param driverClass The driver class.  Must be the fully-qualified name
   * of a class that implements {@link java.sql.Driver}.
   * @return {@code this} (for chaining)
   * @throws RuntimeException wrapping any exceptions loading driverClass.
   */
  public LocalRdbmsServiceTestConfig setDriverClass(String driverClass) {
    this.driverClass = driverClass;
    try {
      Class.forName(driverClass);
    } catch (Throwable t) {
      if (t instanceof RuntimeException) {
        throw (RuntimeException) t;
      }
      throw new RuntimeException(t);
    }
    return this;
  }

  /**
   * @return The JDBC connection string format
   */
  public String getJdbcConnectionStringFormat() {
    return driverUrl;
  }

  /**
   * Sets the format of the connection string that the jdbc driver will use.
   *
   * @param jdbcConnectionStringFormat the connection string format
   * @return {@code this} (for chaining)
   */
  public LocalRdbmsServiceTestConfig setJdbcConnectionStringFormat(
          String jdbcConnectionStringFormat) {
    this.driverUrl = jdbcConnectionStringFormat;
    return this;
  }

  public LocalRdbmsServiceTestConfig setServerType(LocalRdbmsService.ServerType serverType) {
    if (serverType == null) {
      throw new NullPointerException("serverType can not be null");
    }
    this.serverType = serverType;
    return this;
  }

  /**
   * Sets Extra properties to be passed to the underlying {@code local} JDBC
   * driver.
   *
   * @param map the extra driver properties.
   * @return {@code this} (for chaining)
   */
  public LocalRdbmsServiceTestConfig setExtraDriverProperties(Map<String, String> map) {
    this.extraDriverProperties = Joiner.on(',').withKeyValueSeparator("=").join(map);
    return this;
  }

  /**
   * Sets the database to be passed to the underlying {@code local} JDBC
   * driver.
   */
  public LocalRdbmsServiceTestConfig setDatabase(String database) {
    this.database = database;
    return this;
  }

  /**
   * Sets the user to be passed to the underlying {@code local} JDBC
   * driver.
   */
  public LocalRdbmsServiceTestConfig setUser(String user) {
    this.user = user;
    return this;
  }

  /**
   * Sets the password to be passed to the underlying {@code local} JDBC
   * driver.
   */
  public LocalRdbmsServiceTestConfig setPassword(String password) {
    this.password = password;
    return this;
  }

  /**
   * Sets the remote client factory class.
   *
   * @param remoteClientFactory the SqlClientFactory implementation.
   * @return {@code this} (for chaining)
   */
  public LocalRdbmsServiceTestConfig setRemoteClientFactory(
      Class<? extends SqlClientFactory> remoteClientFactory) {
    this.remoteClientFactory = remoteClientFactory;
    return this;
  }

}

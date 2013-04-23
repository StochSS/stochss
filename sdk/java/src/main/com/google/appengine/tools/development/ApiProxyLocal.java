// Copyright 2009 Google Inc. All Rights Reserved.

package com.google.appengine.tools.development;

import com.google.apphosting.api.ApiProxy.Delegate;
import com.google.apphosting.api.ApiProxy.Environment;

import java.util.Map;

/**
 * A local service object, suitable for testing of service-client code as
 * well as for local runtime use in {@code dev_appserver}.
 *
 */
public interface ApiProxyLocal extends Delegate<Environment> {
  /**
   * Sets an individual service property.
   * @param property name of the property to set
   * @param value new value of the property
   */
  void setProperty(String property, String value);

  /**
   * Resets the service properties to {@code properties}.
   *
   * @param properties a maybe {@code null} set of properties for
   * local services.
   */
  void setProperties(Map<String,String> properties);

  /**
   * Appends the given service properties to {@code properties}.
   *
   * @param properties a set of properties to append for local services.
   */
  void appendProperties(Map<String,String> properties);

  /**
   * Stops all services started by this ApiProxy and releases
   * all of its resources.
   */
  void stop();

  /**
   * Get the {@code LocalRpcService} identified by the given package.
   * This method should really only be used by tests.
   *
   * @param pkg The package identifying the service we want.
   * @return The requested service, or {@code null} if no service
   * identified by the given package is available.
   */
  LocalRpcService getService(String pkg);

  /**
   * @return The clock with which all local services are initialized.  Local
   * services use the clock to determine the current time.
   */
  Clock getClock();

  /**
   * Sets the clock with which all local services are initialized.
   * Local services use the clock to determine the current time.
   * Note that calling this method after a local service has already
   * initialized will have no effect.
   *
   * @param clock
   */
  void setClock(Clock clock);
}

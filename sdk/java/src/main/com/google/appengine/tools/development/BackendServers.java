// Copyright 2011 Google Inc. All Rights Reserved.

package com.google.appengine.tools.development;

import com.google.common.annotations.VisibleForTesting;

/**
 * Controls backend servers configured in appengine-web.xml. Each server is
 * started on a separate port. All servers run the same code as the main app.
 *
 *
 */
public class BackendServers extends AbstractBackendServers {

  private static BackendServers instance = new BackendServers();

  public static BackendServers getInstance() {
    return instance;
  }

  @VisibleForTesting
  BackendServers() {
  }
}

// Copyright 2011 Google Inc. All Rights Reserved.
package com.google.appengine.tools.development.testing;

import com.google.appengine.api.prospectivesearch.dev.LocalSearchService;

/**
 * Config for accessing the local prospective search service in tests.
 * Setup and tear down do nothing as persistent state is managed by
 * the LocalDatastoreServiceTestConfig.  Use
 * LocalDatastoreServiceTestConfig tearDown to clear this state
 * between tests.
 *
 */
public class LocalProspectiveSearchServiceTestConfig implements LocalServiceTestConfig {

  /**
   * Does nothing.
   */
  @Override
  public void setUp() {
  }

  /**
   * Does nothing.
   */
  @Override
  public void tearDown() {
  }

  public static LocalSearchService getLocalProspectiveSearchService() {
    return (LocalSearchService) LocalServiceTestHelper.getLocalService(LocalSearchService.PACKAGE);
  }
}

// Copyright 2011 Google Inc. All Rights Reserved.
package com.google.appengine.api.prospectivesearch;

/**
 * Constructs an instance of the Prospective Search service.
 *
 */
public class ProspectiveSearchServiceFactory {
  public static ProspectiveSearchService getProspectiveSearchService() {
    return new ProspectiveSearchServiceImpl();
  }
}

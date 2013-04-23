// Copyright 2012 Google Inc. All rights reserved.

package com.google.appengine.api.urlfetch;

/**
 * Factory for {@link URLFetchService}
 *
 */
public interface IURLFetchServiceFactory {
  /**
   * Obtain a URLFetchService instance.
   */
  URLFetchService getURLFetchService();
}

// Copyright 2012 Google Inc. All rights reserved.

package com.google.appengine.api.search;

/**
 * An factory that creates default implementation of {@link SearchService}.
 *
 */
public interface ISearchServiceFactory {

  /**
   * Returns an instance of the {@link SearchService}.  The instance
   * will exist in the user provided namespace. The namespace must be
   * valid, as per {@link NamespaceManager#validateNamespace(String)}
   * method.
   *
   * @param namespace a namespace to be assigned to the returned
   * search service.
   * @return the default implementation of {@link SearchService}.
   * @throws IllegalArgumentException if the namespace is invalid
   */
  SearchService getSearchService(String namespace);

}

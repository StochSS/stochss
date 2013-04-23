// Copyright 2011 Google Inc. All Rights Reserved.

package com.google.appengine.api.search;

import com.google.appengine.api.NamespaceManager;
import com.google.appengine.spi.ServiceFactoryFactory;

/**
 * An factory that creates default implementation of {@link SearchService}.
 *
 * <pre>
 *   SearchService search = SearchServiceFactory.getSearchService();
 * </pre>
 *
 * Optionally, you may pass the namespace to restrict resources
 * associated with usage of the SearchService:
 *
 * <pre>
 *   SearchService acmeSearchService = SearchServiceFactory.getSearchService("acme");
 * </pre>
 *
 * The first form is equivalent to:
 *
 * <pre>
 *   SearchServiceFactory.getSearchServiceFactory(NamespaceManager.get())
 * </pre>
 *
 */
public final class SearchServiceFactory {

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
  public static SearchService getSearchService(String namespace) {
    return getFactory().getSearchService(namespace);
  }

  /**
   * Equivalent to
   * {@link SearchServiceFactory#getSearchService(String) getSearchService(NamespaceManager.get())}.
   */
  public static SearchService getSearchService() {
    return getSearchService(NamespaceManager.get());
  }

  /**
   * No instances of this class may be created.
   */
  private SearchServiceFactory() {}

  private static ISearchServiceFactory getFactory() {
    return ServiceFactoryFactory.getFactory(ISearchServiceFactory.class);
  }
}

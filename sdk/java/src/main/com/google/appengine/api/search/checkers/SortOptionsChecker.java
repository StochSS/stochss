// Copyright 2011 Google Inc. All Rights Reserved.

package com.google.appengine.api.search.checkers;

import com.google.appengine.api.search.SearchServicePb.ScorerSpec;
import com.google.apphosting.api.AppEngineInternal;

/**
 * Checks the values of a {@link SortOptions}.
 *
 */
@AppEngineInternal
public class SortOptionsChecker {

  /**
   * Checks whether the limit on number of documents to score is between 0 and
   * the maximum.
   *
   * @param limit the maximum number of documents to score in the search
   * @return the checked limit
   * @throws IllegalArgumentException if the limit is out of range
   */
  public static int checkLimit(int limit) {
    Preconditions.checkArgument(limit >= 0 && limit <= SearchApiLimits.SEARCH_MAXIMUM_SORTED_LIMIT,
        "The limit %d must be between 0 and %d", limit,
        SearchApiLimits.SEARCH_MAXIMUM_SORTED_LIMIT);
    return limit;
  }

  /**
   * Checks the {@link ScorerSpec} is valid, specifically checking the limit
   * on number of documents to score is not too large.
   *
   * @param spec the {@link ScorerSpec} to check
   * @return the checked spec
   * @throws IllegalArgumentException if the spec is invalid
   */
  public static ScorerSpec checkValid(ScorerSpec spec) {
    checkLimit(spec.getLimit());
    return spec;
  }
}

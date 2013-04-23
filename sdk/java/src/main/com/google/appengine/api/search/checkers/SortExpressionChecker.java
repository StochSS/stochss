// Copyright 2011 Google Inc. All Rights Reserved.

package com.google.appengine.api.search.checkers;

import com.google.appengine.api.search.SearchServicePb.SortSpec;

/**
 * Checks the values of a {@link SortExpression}.
 *
 */
public class SortExpressionChecker {

  /**
   * Checks the {@link ScorerSpec} is valid, specifically checking the limit
   * on number of documents to score is not too large.
   *
   * @param spec the {@link ScorerSpec} to check
   * @return the checked spec
   * @throws IllegalArgumentException if the spec is invalid
   */
  public static SortSpec checkValid(SortSpec spec) {
    Preconditions.checkArgument(
        (!spec.hasDefaultValueText() || !spec.hasDefaultValueNumeric()),
        "at most one of default string or numeric value can be specified");
    if (spec.hasDefaultValueText()) {
      FieldChecker.checkText(spec.getDefaultValueText());
    }
    return spec;
  }
}

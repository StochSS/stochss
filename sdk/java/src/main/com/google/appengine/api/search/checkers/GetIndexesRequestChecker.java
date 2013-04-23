// Copyright 2011 Google Inc. All Rights Reserved.

package com.google.appengine.api.search.checkers;

import com.google.appengine.api.NamespaceManager;
import com.google.appengine.api.search.SearchServicePb.ListIndexesParams;
import com.google.apphosting.api.AppEngineInternal;
import com.google.common.base.Strings;

/**
 * Checks values of {@link com.google.appengine.api.search.GetIndexesRequest}.
 *
 */
@AppEngineInternal
public class GetIndexesRequestChecker {

  /**
   * Checks whether the number of indexes to return is between 1 and the
   * maximum.
   *
   * @param limit the maximum number of indexes to return in list results
   * @return the checked number of indexes to return
   * @throws IllegalArgumentException if the number of indexes to return
   * is out of range
   */
  public static int checkLimit(int limit) {
    Preconditions.checkArgument(limit >= 1 && limit <= SearchApiLimits.GET_INDEXES_MAXIMUM_LIMIT,
        String.format("The limit %d must be between 1 and %d",
            limit, SearchApiLimits.GET_INDEXES_MAXIMUM_LIMIT));
    return limit;
  }

  /**
   * Checks whether the offset of the first indexes to return is between 0 and the
   * maximum.
   *
   * @param offset the offset of the first index to return in list results
   * @return the checked offset of the first index to return
   * @throws IllegalArgumentException if the offset of the first index to return
   * is out of range
   */
  public static int checkOffset(int offset) {
    Preconditions.checkArgument(offset >= 0 && offset <= SearchApiLimits.GET_INDEXES_MAXIMUM_OFFSET,
        String.format("The limit %d must be between 1 and %d",
            offset, SearchApiLimits.GET_INDEXES_MAXIMUM_OFFSET));
    return offset;
  }

  /**
   * Checks whether the given index name prefix is legal. This method uses the same
   * checks as {@link IndexChecker#checkName(String)}.
   *
   * @param indexNamePrefix the index name prefix to be checked
   * @return the checked index name prefix
   * @throws IllegalArgumentException if the index name prefix is illegal.
   */
  public static String checkIndexNamePrefix(String indexNamePrefix) {
    if (Strings.isNullOrEmpty(indexNamePrefix)) {
      return indexNamePrefix;
    }
    return IndexChecker.checkName(indexNamePrefix);
  }

  /**
   * Checks whether the given start index name is legal. This method uses the same
   * checks as {@link IndexChecker#checkName(String)}.
   *
   * @param startIndexName the name of the first index to be returned
   * @return the checked start index name
   * @throws IllegalArgumentException if the start index name is illegal.
   */
  public static String checkStartIndexName(String startIndexName) {
    if (Strings.isNullOrEmpty(startIndexName)) {
      return startIndexName;
    }
    return IndexChecker.checkName(startIndexName);
  }

  /**
   * Ensures the given protocol buffer parameters are valid. If any of the parameters
   * fail to pass the checks, this method throws {@link IllegalArgumentException}. If
   * everything is valid the original parameters are returned.
   *
   * @param params the parameters to be checked for validity
   * @return the checked parameters for listing indexes
   * @throws IllegalArgumentException if any of the values are incorrect
   */
  public static ListIndexesParams checkListIndexesParams(ListIndexesParams params) {
    if (params.hasLimit()) {
      checkLimit(params.getLimit());
    }
    if (params.hasNamespace()) {
      NamespaceManager.validateNamespace(params.getNamespace());
    }
    if (params.hasStartIndexName()) {
      checkStartIndexName(params.getStartIndexName());
    }
    if (params.hasIndexNamePrefix()) {
      checkIndexNamePrefix(params.getIndexNamePrefix());
    }
    if (params.hasOffset()) {
      checkOffset(params.getOffset());
    }
    return params;
  }
}

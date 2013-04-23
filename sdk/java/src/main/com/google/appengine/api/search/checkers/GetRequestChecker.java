// Copyright 2011 Google Inc. All Rights Reserved.

package com.google.appengine.api.search.checkers;

import com.google.appengine.api.search.SearchServicePb.ListDocumentsParams;
import com.google.common.base.Strings;

/**
 * Checks values of {@link com.google.appengine.api.search.GetRequest}.
 *
 */
public class GetRequestChecker {

  /**
   * Checks whether the number of documents to return is between 0 and the
   * maximum.
   *
   * @param limit the maximum number of documents to return in results list
   * @return the checked number of documents to return
   * @throws IllegalArgumentException if the number of documents to return
   * is out of range
   */
  public static int checkLimit(int limit) {
    Preconditions.checkArgument(limit >= 0 && limit <= SearchApiLimits.GET_RANGE_MAXIMUM_LIMIT,
        String.format("The limit %d must be between 0 and %d",
            limit, SearchApiLimits.GET_RANGE_MAXIMUM_LIMIT));
    return limit;
  }

  /**
   * Checks whether the given start document Is legal.
   *
   * @param startDocId the start ocument Id to be checked.
   * @return the checked start document Id.
   * @throws IllegalArgumentException if the start document Id is illegal.
   */
  public static String checkStartDocId(String startDocId) {
    if (Strings.isNullOrEmpty(startDocId)) {
      return startDocId;
    }
    return DocumentChecker.checkDocumentId(startDocId);
  }

  /**
   * Checks the values of the {@link ListDocumentsParams} params.
   *
   * @param params The {@link ListDocumentsParams} to check
   * @return the checked params
   * @throws IllegalArgumentException if some of the values of params are
   * invalid
   */
  public static ListDocumentsParams checkListDocumentsParams(ListDocumentsParams params) {
    IndexChecker.checkName(params.getIndexSpec().getName());
    if (params.hasLimit()) {
      checkLimit(params.getLimit());
    }
    if (params.hasStartDocId()) {
      DocumentChecker.checkDocumentId(params.getStartDocId());
    }
    return params;
  }
}

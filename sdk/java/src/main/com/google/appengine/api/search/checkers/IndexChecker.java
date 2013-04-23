// Copyright 2011 Google Inc. All Rights Reserved.

package com.google.appengine.api.search.checkers;

import com.google.apphosting.api.AppEngineInternal;
import com.google.common.base.Strings;

/**
 * Checks values of {@link com.google.appengine.api.search.Index Indexes}.
 *
 */
@AppEngineInternal
public class IndexChecker {

  /**
   * Checks whether an index name is valid. It must be a ASCII visible
   * printable string of length between 1 and {@literal
   * #MAXIMUM_INDEX_NAME_LENGTH}, not start with '!', and not be of
   * the format __.*__, which are reserved sequences for internal
   * index names.
   *
   * @param indexName the index name to check
   * @return the checked index name
   * @throws IllegalArgumentException if the index name is not valid.
   */
  public static String checkName(String indexName) {
    Preconditions.checkArgument(!Strings.isNullOrEmpty(indexName), "Index name null or empty");
    Preconditions.checkArgument(indexName.length() <= SearchApiLimits.MAXIMUM_INDEX_NAME_LENGTH,
        "Index name longer than %d characters: %s",
        SearchApiLimits.MAXIMUM_INDEX_NAME_LENGTH, indexName);
    Preconditions.checkArgument(isAsciiVisiblePrintable(indexName),
        "Index name must be ASCII visible printable: %s", indexName);
    Preconditions.checkArgument(!isReserved(indexName),
        "Index name must not start with !: %s", indexName);
    return indexName;
  }

  /**
   * @return true if all characters are visible ascii printable: that is,
   * between 33 ('!') and 126 ('~'), inclusive
   */
  static boolean isAsciiVisiblePrintable(String str) {
    for (int i = 0; i < str.length(); ++i) {
      if (str.charAt(i) < 33 || str.charAt(i) > 126) {
        return false;
      }
    }
    return true;
  }

  /**
   * @return true if str represents a reserved index name
   */
  static boolean isReserved(String str) {
    return str.startsWith("!")
      || (str.length() > 3 && str.startsWith("__") && str.endsWith("__"));
  }
}

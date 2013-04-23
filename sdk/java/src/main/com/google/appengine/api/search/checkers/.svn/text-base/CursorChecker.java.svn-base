// Copyright 2012 Google Inc. All Rights Reserved.

package com.google.appengine.api.search.checkers;

import com.google.apphosting.api.AppEngineInternal;

/**
 * Checks values of {@link com.google.appengine.api.search.Cursor}.
 *
 */
@AppEngineInternal
public final class CursorChecker {

  /**
   * Checks the cursor string if provided is not empty nor too long.
   *
   * @param cursor the search cursor to check
   * @return the checked cursor
   * @throws IllegalArgumentException if the cursor is empty or is too long
   */
  public static String checkCursor(String cursor) {
    if (cursor != null) {
      Preconditions.checkArgument(!cursor.isEmpty(),
          "cursor cannot be empty");
      Preconditions.checkArgument(cursor.length() <= SearchApiLimits.MAXIMUM_CURSOR_LENGTH,
          String.format("cursor cannot be longer than %d characters",
                        SearchApiLimits.MAXIMUM_CURSOR_LENGTH));
    }
    return cursor;
  }
}

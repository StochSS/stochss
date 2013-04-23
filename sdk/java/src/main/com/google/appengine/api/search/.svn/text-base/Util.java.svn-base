// Copyright 2010 Google Inc. All Rights Reserved.

package com.google.appengine.api.search;

import com.google.apphosting.api.AppEngineInternal;

import java.util.Iterator;
import java.util.LinkedList;

/**
 * A utility class that does various checks on search and indexing parameters.
 *
 */
@AppEngineInternal
public final class Util {

  private static final long MILLISECONDS_IN_DAY = 1000L * 60 * 60 * 24;

  private Util() {
  }

  /**
   * A helper method for testing two objects are equal.
   *
   * @return whether the two objects a and b are equal
   */
  public static boolean equalObjects(Object a, Object b) {
    return a == b || (a != null && a.equals(b));
  }

  /**
   * A helper method for overriding null values with a default value.
   *
   * @param value the value of some field
   * @param defaultValue the default value for the field
   * @return value if it is not null, otherwise the defaultValue
   */
  public static <T> T defaultIfNull(T value, T defaultValue) {
    return value == null ? defaultValue : value;
  }

  /**
   * Returns a string representation of the iterable objects. This is
   * used in debugging. The limit parameter is used to control how many
   * elements of the iterable are used to build the final string. Use
   * 0 or negative values, to include all.
   *
   * @param objects an iterable of objects to be turned into a string
   * @param limit the maximum number of objects from iterable to be used
   * to build a string
   */
  public static <T> String iterableToString(Iterable<T> objects, int limit) {
    StringBuilder builder = new StringBuilder()
        .append("[");
    String sep = "";
    int head = (limit <= 0) ? Integer.MAX_VALUE : (limit + 1) / 2;
    int tail = (limit <= 0) ? 0 : limit - head;
    Iterator<T> iter = objects.iterator();
    while (iter.hasNext() && --head >= 0) {
      builder.append(sep).append(iter.next().toString());
      sep = ", ";
    }
    LinkedList<T> tailMembers = new LinkedList<T>();
    int seen = 0;
    while (iter.hasNext()) {
      tailMembers.add(iter.next());
      if (++seen > tail) {
        tailMembers.removeFirst();
      }
    }
    if (seen > tail) {
      builder.append(", ...");
    }
    for (T o : tailMembers) {
      builder.append(sep).append(o.toString());
      sep = ", ";
    }
    return builder.append("]").toString();
  }

  /**
   * Returns a string which can be used to append an iterable field to a debug
   * string.
   */
  public static <T> String iterableFieldToString(String fieldName, Iterable<T> objects) {
    if (!objects.iterator().hasNext()) {
      return "";
    }
    return String.format(", %s=%s", fieldName, Util.iterableToString(objects, 0));
  }

  /**
   * Returns a string that allows a field value pair to be added to a debug
   * string.
   */
  public static String fieldToString(String name, Object value) {
    return fieldToString(name, value, false);
  }

  /**
   * Returns a string that allows a field value pair to be added to a debug
   * string.
   */
  public static String fieldToString(String name, Object value, boolean firstParameter) {
    if (value == null) {
      return "";
    }
    if (firstParameter) {
      return String.format("%s=%s",  name, value);
    }
    return String.format(", %s=%s",  name, value);
  }
}

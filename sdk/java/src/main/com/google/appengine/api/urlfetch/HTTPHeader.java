// Copyright 2007 Google Inc. All rights reserved.

package com.google.appengine.api.urlfetch;

import java.io.Serializable;

/**
 * {@code HTTPHeader} can represent either an HTTP request header, or
 * an HTTP response header.
 *
 */
public class HTTPHeader implements Serializable {
  private final String name;
  private final String value;

  /**
   * Creates a new header with the specified name and value.
   *
   * @param name a not {@code null} name
   * @param value may be a single value or a comma-separated list of values
   * for multivalued headers such as {@code Accept} or {@code Set-Cookie}.
   */
  public HTTPHeader(String name, String value) {
    this.name = name;
    this.value = value;
  }

  public String getName() {
    return name;
  }

  public String getValue() {
    return value;
  }
}

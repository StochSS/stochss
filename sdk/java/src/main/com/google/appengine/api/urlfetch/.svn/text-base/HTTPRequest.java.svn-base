// Copyright 2007 Google Inc. All rights reserved.

package com.google.appengine.api.urlfetch;

import java.io.Serializable;
import java.net.URL;
import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;

/**
 * {@code HTTPRequest} encapsulates a single HTTP request that is made
 * via the {@code URLFetchService}.
 *
 */
public class HTTPRequest implements Serializable {
  private final HTTPMethod method;
  private final URL url;
  private final LinkedHashMap<String, HTTPHeader> headers;
  private final FetchOptions fetchOptions;

  /**
   * The payload of this request, or null if there is no payload
   * present.
   */
  private byte[] payload = null;

  /**
   * Creates a {@code HTTPRequest} that represents a GET request to
   * the specified URL.
   */
  public HTTPRequest(URL url) {
    this(url, HTTPMethod.GET);
  }

  /**
   * Creates a {@code HTTPRequest} that represents an HTTP request to
   * the specified URL with the specified HTTP method (GET, POST, etc).
   */
  public HTTPRequest(URL url, HTTPMethod method) {
    this(url, method, FetchOptions.Builder.withDefaults());
  }

  /**
   * Creates a {@code HTTPRequest} that represents an HTTP request to
   * the specified URL with the specified HTTP method (GET, POST, etc)
   * and the specified {@link FetchOptions}.
   */
  public HTTPRequest(URL url, HTTPMethod method, FetchOptions fetchOptions) {
    this.url = url;
    this.method = method;
    this.fetchOptions = fetchOptions;
    this.headers = new LinkedHashMap<String, HTTPHeader>();
  }

  /**
   * Gets the HTTP method for this request (GET, POST, etc).
   */
  public HTTPMethod getMethod() {
    return method;
  }

  /**
   * Gets the URL for this request.
   */
  public URL getURL() {
    return url;
  }

  /**
   * Gets the payload (such as POST body) for this request.  Certain HTTP
   * methods (e.g. GET) will not have any payload, and this method
   * will return null.
   */
  public byte[] getPayload() {
    return payload;
  }

  /**
   * Sets the payload for this request.  This method should not be
   * called for certain HTTP methods (e.g. GET).
   */
  public void setPayload(byte[] payload) {
    this.payload = payload;
  }

  /**
   * Adds {@code header} to this request. If an {@code HTTPHeader} with
   * the same {@code name} already exists for this request, it's values
   * are merged with {@code header}.
   *
   * @param header a not {@code null} {@code HTTPHeader}
   */
  public void addHeader(HTTPHeader header) {
    String name = header.getName();
    HTTPHeader newHeader = headers.get(name);
    if (newHeader == null) {
      headers.put(name, new HTTPHeader(name, header.getValue()));
    } else {
      headers.put(name, new HTTPHeader(name, newHeader.getValue() + ", " + header.getValue()));
    }
  }

  /**
   * Sets an {@code HTTPHeader} for this request. If an
   * {@link HTTPHeader} with the same {@code name}
   * already exists, its value is replaced.
   */
  public void setHeader(HTTPHeader header) {
    headers.put(header.getName(), header);
  }

  /**
   * Returns an immutable {@code List} of {@code HTTPHeader} objects
   * that have been added to this request.
   */
  public List<HTTPHeader> getHeaders() {
    return Collections.unmodifiableList(new ArrayList<HTTPHeader>(headers.values()));
  }

  /**
   * Get the fetch options for this request.
   */
  public FetchOptions getFetchOptions() {
    return fetchOptions;
  }
}

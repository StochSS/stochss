// Copyright 2007 Google Inc. All rights reserved.

package com.google.appengine.api.urlfetch;

import java.io.IOException;
import java.net.URL;
import java.net.MalformedURLException;
import java.util.concurrent.Future;

/**
 * The {@code URLFetchService} provides a way for user code to execute
 * HTTP requests to external URLs.
 *
 * <p>Chunked and hanging requests are not supported, and all content
 * will be returned in a single block.
 *
 */
public interface URLFetchService {
  /**
   * Convenience method for retrieving a specific URL via a HTTP GET
   * request with no custom headers and default values for all
   * {@link FetchOptions} attributes.  For more complex requests, use
   * {@link #fetch(HTTPRequest)}.
   *
   * @param url The url to fetch.
   *
   * @return The result of the fetch.
   *
   * @throws MalformedURLException If the provided URL is malformed.
   * @throws IOException If the remote service could not be contacted or the
   * URL could not be fetched.
   * @throws SocketTimeoutException If the request takes too long to respond.
   * @throws ResponseTooLargeException If the response is too large.
   * @throws javax.net.ssl.SSLHandshakeException If the server's SSL
   * certificate could not be validated and validation was requested.
   */
  HTTPResponse fetch(URL url) throws IOException;

  /**
   * Execute the specified request and return its response.
   *
   * @param request The http request.
   *
   * @return The result of the fetch.
   *
   * @throws IllegalArgumentException If {@code request.getMethod} is not
   * supported by the {@code URLFetchService}.
   * @throws MalformedURLException If the provided URL is malformed.
   * @throws IOException If the remote service could not be contacted or the
   * URL could not be fetched.
   * @throws SocketTimeoutException If the request takes too long to respond.
   * @throws ResponseTooLargeException If response truncation has been disabled
   * via the {@link FetchOptions} object on {@code request} and the response is
   * too large.  Some responses are too large to even retrieve from the remote
   * server, and in these cases the exception is thrown even if response
   * truncation is enabled.
   * @throws javax.net.ssl.SSLHandshakeException If the server's SSL
   * certificate could not be validated and validation was requested.
   */
  HTTPResponse fetch(HTTPRequest request) throws IOException;

  /**
   * Convenience method for asynchronously retrieving a specific URL
   * via a HTTP GET request with no custom headers and default values
   * for all {@link FetchOptions} attributes.  For more complex
   * requests, use {@link #fetchAsync(HTTPRequest)}.
   *
   * @param url The url to fetch.
   *
   * @return A future containing the result of the fetch, or one of
   * the exceptions documented for {@link #fetch(URL)}.
   */
  Future<HTTPResponse> fetchAsync(URL url);

  /**
   * Asynchronously execute the specified request and return its response.
   *
   * @param request The http request.
   *
   * @return A future containing the result of the fetch, or one of
   * the exceptions documented for {@link #fetch(HTTPRequest)}.
   */
  Future<HTTPResponse> fetchAsync(HTTPRequest request);
}

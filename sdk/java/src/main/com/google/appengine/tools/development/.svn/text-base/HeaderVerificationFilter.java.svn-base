// Copyright 2011 Google Inc. All Rights Reserved.

package com.google.appengine.tools.development;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * A Filter that verifies that the incoming request's headers are valid.
 *
 */
public class HeaderVerificationFilter implements Filter {
  private static final String CONTENT_LENGTH = "Content-Length";

  @Override
  public void init(FilterConfig filterConfig) {}

  @Override
  public void destroy() {}

  @Override
  public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
      throws IOException, ServletException {
    if (doFilterInternal(request, response)) {
      chain.doFilter(request, response);
    }
  }

  /**
   * Helper method for doFilter() that contains the filtering logic but does
   * not invoke the remaining filters in the chain.
   *
   * @return true if the request should be passed to the remaining filters in the chain.
   */
  private boolean doFilterInternal(ServletRequest request, ServletResponse response)
      throws IOException {
    if (!(request instanceof HttpServletRequest)) {
      return true;
    }
    if (!(response instanceof HttpServletResponse)) {
      return true;
    }
    HttpServletRequest httpRequest = (HttpServletRequest) request;
    HttpServletResponse httpResponse = (HttpServletResponse) response;

    if (httpRequest.getMethod().equals("POST") &&
        httpRequest.getHeader(CONTENT_LENGTH) == null) {
      httpResponse.sendError(HttpServletResponse.SC_LENGTH_REQUIRED, "Length required");
      return false;
    }

    return true;
  }
}

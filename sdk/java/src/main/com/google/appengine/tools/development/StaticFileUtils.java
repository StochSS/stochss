// Copyright 2009 Google Inc. All rights reserved.

package com.google.appengine.tools.development;

import com.google.apphosting.utils.config.AppEngineWebXml;
import com.google.common.annotations.VisibleForTesting;

import org.mortbay.io.WriterOutputStream;
import org.mortbay.jetty.HttpHeaders;
import org.mortbay.jetty.HttpMethods;
import org.mortbay.resource.Resource;
import org.mortbay.util.URIUtil;

import java.io.IOException;
import java.io.OutputStream;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.servlet.ServletException;
import javax.servlet.RequestDispatcher;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * {@code StaticFileUtils} is a collection of utilities shared by
 * {@link LocalResourceFileServlet} and {@link StaticFileFilter}.
 *
 */
public class StaticFileUtils {
  private static final String DEFAULT_CACHE_CONTROL_VALUE = "public, max-age=600";

  private final ServletContext servletContext;

  public StaticFileUtils(ServletContext servletContext) {
    this.servletContext = servletContext;
  }

  public boolean serveWelcomeFileAsRedirect(String path,
                                            boolean included,
                                            HttpServletRequest request,
                                            HttpServletResponse response)
      throws IOException {
    if (included) {
      return false;
    }

    response.setContentLength(0);
    String q = request.getQueryString();
    if (q != null && q.length() != 0) {
      response.sendRedirect(path + "?" + q);
    } else {
      response.sendRedirect(path);
    }
    return true;
  }

  public boolean serveWelcomeFileAsForward(RequestDispatcher dispatcher,
                                           boolean included,
                                           HttpServletRequest request,
                                           HttpServletResponse response)
      throws IOException, ServletException {
    if (!included && !request.getRequestURI().endsWith(URIUtil.SLASH)) {
      redirectToAddSlash(request, response);
      return true;
    }

    request.setAttribute("com.google.appengine.tools.development.isWelcomeFile", true);
    if (dispatcher != null) {
      if (included) {
        dispatcher.include(request, response);
      } else {
        dispatcher.forward(request, response);
      }
      return true;
    }
    return false;
  }

  public void redirectToAddSlash(HttpServletRequest request, HttpServletResponse response)
      throws IOException {
    StringBuffer buf = request.getRequestURL();
    int param = buf.lastIndexOf(";");
    if (param < 0) {
      buf.append('/');
    } else {
      buf.insert(param, '/');
    }
    String q = request.getQueryString();
    if (q != null && q.length() != 0) {
      buf.append('?');
      buf.append(q);
    }
    response.setContentLength(0);
    response.sendRedirect(response.encodeRedirectURL(buf.toString()));
  }

  /**
   * Check the headers to see if content needs to be sent.
   * @return true if the content should be sent, false otherwise.
   */
  public boolean passConditionalHeaders(HttpServletRequest request,
                                         HttpServletResponse response,
                                         Resource resource) throws IOException {
    if (!request.getMethod().equals(HttpMethods.HEAD)) {
      String ifms = request.getHeader(HttpHeaders.IF_MODIFIED_SINCE);
      if (ifms != null) {
        long ifmsl = -1;
        try {
          ifmsl = request.getDateHeader(HttpHeaders.IF_MODIFIED_SINCE);
        } catch (IllegalArgumentException e) {
        }
        if (ifmsl != -1) {
          if (resource.lastModified() <= ifmsl) {
            response.reset();
            response.setStatus(HttpServletResponse.SC_NOT_MODIFIED);
            response.flushBuffer();
            return false;
          }
        }
      }

      long date = -1;
      try {
        date = request.getDateHeader(HttpHeaders.IF_UNMODIFIED_SINCE);
      } catch (IllegalArgumentException e) {
      }
      if (date != -1) {
        if (resource.lastModified() > date) {
          response.sendError(HttpServletResponse.SC_PRECONDITION_FAILED);
          return false;
        }
      }
    }
    return true;
  }

  /**
   * Write or include the specified resource.
   */
  public void sendData(HttpServletRequest request,
                        HttpServletResponse response,
                        boolean include,
                        Resource resource) throws IOException {
    long contentLength = resource.length();
    if (!include) {
      writeHeaders(response, request.getRequestURI(), resource, contentLength);
    }

    OutputStream out = null;
    try {
      out = response.getOutputStream();}
    catch (IllegalStateException e) {
      out = new WriterOutputStream(response.getWriter());
    }
    resource.writeTo(out, 0, contentLength);
  }

  /**
   * Write the headers that should accompany the specified resource.
   */
  public void writeHeaders(HttpServletResponse response, String requestPath, Resource resource,
                           long count) {
    if (count != -1) {
      if (count < Integer.MAX_VALUE) {
        response.setContentLength((int) count);
      } else {
        response.setHeader(HttpHeaders.CONTENT_LENGTH, String.valueOf(count));
      }
    }

    Set<String> headersApplied = addUserStaticHeaders(requestPath, response);

    if (!headersApplied.contains("content-type")) {
      String contentType = servletContext.getMimeType(resource.getName());
      if (contentType != null) {
        response.setContentType(contentType);
      }
    }

    if (!headersApplied.contains("last-modified")) {
      response.setDateHeader(HttpHeaders.LAST_MODIFIED, resource.lastModified());
    }

    if (!headersApplied.contains(HttpHeaders.CACHE_CONTROL.toLowerCase())) {
      response.setHeader(HttpHeaders.CACHE_CONTROL, DEFAULT_CACHE_CONTROL_VALUE);
    }
  }

  /**
   * Adds HTTP Response headers that are specified in appengine-web.xml. The user may specify
   * headers explicitly using the {@code http-header} element. Also the user may specify cache
   * expiration headers implicitly using the {@code expiration} attribute. There is no check for
   * consistency between different specified headers.
   *
   * @param localFilePath The path to the static file being served.
   * @param response The HttpResponse object to which headers will be added
   * @return The Set of the names of all headers that were added, canonicalized to lower case.
   */
  @VisibleForTesting
  Set<String> addUserStaticHeaders(String localFilePath,
                                     HttpServletResponse response) {
    AppEngineWebXml appEngineWebXml = (AppEngineWebXml) servletContext.getAttribute(
        "com.google.appengine.tools.development.appEngineWebXml");

    Set<String> headersApplied = new HashSet<String>();
    for (AppEngineWebXml.StaticFileInclude include : appEngineWebXml.getStaticFileIncludes()) {
      Pattern pattern = include.getRegularExpression();
      if (pattern.matcher(localFilePath).matches()) {
        for (Map.Entry<String, String> entry : include.getHttpHeaders().entrySet()) {
          response.addHeader(entry.getKey(), entry.getValue());
          headersApplied.add(entry.getKey().toLowerCase());
        }
        String expirationString = include.getExpiration();
        if (expirationString != null) {
          addCacheControlHeaders(headersApplied, expirationString, response);
        }
        break;
      }
    }
    return headersApplied;
  }

  /**
   * Adds HTTP headers to the response to describe cache expiration behavior, based on the
   * {@code expires} attribute of the {@code includes} element of the {@code static-files} element
   * of appengine-web.xml.
   * <p>
   * We follow the same logic that is used in production App Engine. This includes:
   * <ul>
   * <li>There is no coordination between these headers (implied by the 'expires' attribute) and
   * explicitly specified headers (expressed with the 'http-header' sub-element). If the user
   * specifies contradictory headers then we will include contradictory headers.
   * <li>If the expiration time is zero then we specify that the response should not be cached using
   * three different headers: {@code Pragma: no-cache}, {@code Expires: 0} and
   * {@code Cache-Control: no-cache, must-revalidate}.
   * <li>If the expiration time is positive then we specify that the response should be cached for
   * that many seconds using two different headers: {@code Expires: num-seconds} and
   * {@code Cache-Control: public, max-age=num-seconds}.
   * <li>If the expiration time is not specified then we use a default value of 10 minutes
   * </ul>
   *
   * Note that there is one aspect of the production App Engine logic that is not replicated here.
   * In production App Engine if the url to a static file is protected by a security constraint in
   * web.xml then {@code Cache-Control: private} is used instead of {@code Cache-Control: public}.
   * In the development App Server {@code Cache-Control: public} is always used.
   * <p>
   * Also if the expiration time is specified but cannot be parsed as a non-negative number of
   * seconds then a RuntimeException is thrown.
   *
   * @param headersApplied Set of headers that have been applied, canonicalized to lower-case. Any
   *        new headers applied in this method will be added to the set.
   * @param expiration The expiration String specified in appengine-web.xml
   * @param response The HttpServletResponse into which we will write the HTTP headers.
   */
  private static void addCacheControlHeaders(
      Set<String> headersApplied, String expiration, HttpServletResponse response) {

    int expirationSeconds = parseExpirationSpecifier(expiration);
    if (expirationSeconds == 0) {
      response.addHeader("Pragma", "no-cache");
      response.addHeader(HttpHeaders.CACHE_CONTROL, "no-cache, must-revalidate");
      response.addDateHeader(HttpHeaders.EXPIRES, 0);
      headersApplied.add(HttpHeaders.CACHE_CONTROL.toLowerCase());
      headersApplied.add(HttpHeaders.EXPIRES.toLowerCase());
      headersApplied.add("pragma");
      return;
    }
    if (expirationSeconds > 0) {
      response.addHeader(HttpHeaders.CACHE_CONTROL, "public, max-age=" + expirationSeconds);
      response.addDateHeader(
          HttpHeaders.EXPIRES, System.currentTimeMillis() + expirationSeconds * 1000L);
      headersApplied.add(HttpHeaders.CACHE_CONTROL.toLowerCase());
      headersApplied.add(HttpHeaders.EXPIRES.toLowerCase());
      return;
    }
    throw new RuntimeException("expirationSeconds is negative: " + expirationSeconds);
  }

  /**
   * Parses an expiration specifier String and returns the number of seconds it represents. A valid
   * expiration specifier is a white-space-delimited list of components, each of which is a sequence
   * of digits, optionally followed by a single letter from the set {D, d, H, h, M, m, S, s}. For
   * example {@code 21D 4H 30m} represents the number of seconds in 21 days, 4.5 hours.
   *
   * @param expirationSpecifier The non-null, non-empty expiration specifier String to parse
   * @return The non-negative number of seconds represented by this String.
   */
  @VisibleForTesting
  static int parseExpirationSpecifier(String expirationSpecifier) {
    expirationSpecifier = expirationSpecifier.trim();
    if (expirationSpecifier.isEmpty()) {
      throwExpirationParseException("", expirationSpecifier);
    }
    String[] components = expirationSpecifier.split("(\\s)+");
    int expirationSeconds = 0;
    for (String componentSpecifier : components) {
      expirationSeconds +=
          parseExpirationSpeciferComponent(componentSpecifier, expirationSpecifier);
    }
    return expirationSeconds;
  }

  private static final Pattern EXPIRATION_COMPONENT_PATTERN = Pattern.compile("^(\\d+)([dhms]?)$");

  /**
   * Parses a single component of an expiration specifier, and returns the number of seconds that
   * the component represents. A valid component specifier is a sequence of digits, optionally
   * followed by a single letter from the set {D, d, H, h, M, m, S, s}, indicating days, hours,
   * minutes and seconds. A lack of a trailing letter is interpreted as seconds.
   *
   * @param componentSpecifier The component specifier to parse
   * @param fullSpecifier The full specifier of which {@code componentSpecifier} is a component.
   *        This will be included in an error message if necessary.
   * @return The number of seconds represented by {@code componentSpecifier}
   */
  private static int parseExpirationSpeciferComponent(
      String componentSpecifier, String fullSpecifier) {
    Matcher matcher = EXPIRATION_COMPONENT_PATTERN.matcher(componentSpecifier.toLowerCase());
    if (!matcher.matches()) {
      throwExpirationParseException(componentSpecifier, fullSpecifier);
    }
    String numericString = matcher.group(1);
    int numSeconds = parseExpirationInteger(numericString, componentSpecifier, fullSpecifier);
    String unitString = matcher.group(2);
    if (unitString.length() > 0) {
      switch (unitString.charAt(0)) {
        case 'd':
          numSeconds *= 24 * 60 * 60;
          break;
        case 'h':
          numSeconds *= 60 * 60;
          break;
        case 'm':
          numSeconds *= 60;
          break;
      }
    }
    return numSeconds;
  }

  /**
   * Parses a String from an expiration specifier as a non-negative integer. If successful returns
   * the integer. Otherwise throws an {@link IllegalArgumentException} indicating that the specifier
   * could not be parsed.
   *
   * @param intString String to parse
   * @param componentSpecifier The component of the specifier being parsed
   * @param fullSpecifier The full specifier
   * @return The parsed integer
   */
  private static int parseExpirationInteger(
      String intString, String componentSpecifier, String fullSpecifier) {
    int seconds = 0;
    try {
      seconds = Integer.parseInt(intString);
    } catch (NumberFormatException e) {
      throwExpirationParseException(componentSpecifier, fullSpecifier);
    }
    if (seconds < 0) {
      throwExpirationParseException(componentSpecifier, fullSpecifier);
    }
    return seconds;
  }

  /**
   * Throws an {@link IllegalArgumentException} indicating that an expiration specifier String was
   * not able to be parsed.
   *
   * @param componentSpecifier The component that could not be parsed
   * @param fullSpecifier The full String
   */
  private static void throwExpirationParseException(
      String componentSpecifier, String fullSpecifier) {
    throw new IllegalArgumentException("Unable to parse cache expiration specifier '"
        + fullSpecifier + "' at component '" + componentSpecifier + "'");
  }

}

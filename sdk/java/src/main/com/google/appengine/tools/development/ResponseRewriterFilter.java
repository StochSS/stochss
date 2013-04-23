// Copyright 2012 Google Inc. All Rights Reserved.

package com.google.appengine.tools.development;

import com.google.appengine.api.log.dev.LocalLogService;
import com.google.common.base.Preconditions;
import com.google.common.net.HttpHeaders;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.io.UnsupportedEncodingException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Enumeration;
import java.util.Locale;
import java.util.NoSuchElementException;
import java.util.TimeZone;
import java.util.Vector;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletRequestWrapper;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpServletResponseWrapper;

/**
 * A filter that rewrites the response headers and body from the user's
 * application.
 *
 * <p>This sanitises the headers to ensure that they are sensible and the user
 * is not setting sensitive headers, such as Content-Length, incorrectly. It
 * also deletes the body if the response status code indicates a non-body
 * status.
 *
 * <p>This also strips out some request headers before passing the request to
 * the application.
 *
 */
public class ResponseRewriterFilter implements Filter {
  /**
   * A mock timestamp to use as the response completion time, for testing.
   *
   * <p>Long.MIN_VALUE indicates that this should not be used, and instead, the
   * current time should be taken.
   */
  private final long emulatedResponseTime;
  LocalLogService logService;

  private static final String BLOB_KEY_HEADER = "X-AppEngine-BlobKey";

  /** The value of the "Server" header output by the development server. */
  private static final String DEVELOPMENT_SERVER = "Development/1.0";

  /** These statuses must not include a response body (RFC 2616). */
  private static final int[] NO_BODY_RESPONSE_STATUSES = {
      HttpServletResponse.SC_CONTINUE,
      HttpServletResponse.SC_SWITCHING_PROTOCOLS,
      HttpServletResponse.SC_NO_CONTENT,
      HttpServletResponse.SC_NOT_MODIFIED,
  };

  public ResponseRewriterFilter() {
    super();
    emulatedResponseTime = Long.MIN_VALUE;
  }

  /**
   * Creates a ResponseRewriterFilter for testing purposes, which mocks the
   * current time.
   *
   * @param mockTimestamp Indicates that the current time will be emulated with
   *        this timestamp.
   */
  public ResponseRewriterFilter(long mockTimestamp) {
    super();
    emulatedResponseTime = mockTimestamp;
  }

  @Override
  public void init(FilterConfig filterConfig) {
    ApiProxyLocal apiProxyLocal = (ApiProxyLocal) filterConfig.getServletContext().getAttribute(
        "com.google.appengine.devappserver.ApiProxyLocal");
    logService = (LocalLogService) apiProxyLocal.getService(LocalLogService.PACKAGE);
  }

  /**
   * @see javax.servlet.Filter#doFilter(javax.servlet.ServletRequest,
   *                                    javax.servlet.ServletResponse,
   *                                    javax.servlet.FilterChain)
   */
  @Override
  public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
      throws IOException, ServletException {
    HttpServletRequest httprequest;
    HttpServletResponse httpresponse;
    try {
      httprequest = (HttpServletRequest) request;
      httpresponse = (HttpServletResponse) response;
    } catch (ClassCastException e) {
      throw new ServletException(e);
    }

    RequestWrapper wrappedRequest = new RequestWrapper(httprequest);
    ResponseWrapper wrappedResponse = new ResponseWrapper(httpresponse);

    chain.doFilter(wrappedRequest, wrappedResponse);

    Preconditions.checkState(!response.isCommitted(), "Response has already been committed");

    long responseTime;
    if (emulatedResponseTime == Long.MIN_VALUE) {
      responseTime = System.currentTimeMillis();
    } else {
      responseTime = emulatedResponseTime;
    }

    ignoreHeadersRewriter(wrappedRequest, wrappedResponse, responseTime);
    serverDateRewriter(wrappedRequest, wrappedResponse, responseTime);
    cacheRewriter(wrappedRequest, wrappedResponse, responseTime);
    blobServeRewriter(wrappedRequest, wrappedResponse, responseTime);
    contentLengthRewriter(wrappedRequest, wrappedResponse, responseTime);

    wrappedResponse.reallyCommit();
  }

  private static final String[] IGNORE_REQUEST_HEADERS = {
      HttpHeaders.ACCEPT_ENCODING,
      HttpHeaders.CONNECTION,
      "Keep-Alive",
      HttpHeaders.PROXY_AUTHORIZATION,
      HttpHeaders.TE,
      HttpHeaders.TRAILER,
      HttpHeaders.TRANSFER_ENCODING,
  };

  private static final String[] IGNORE_RESPONSE_HEADERS = {
      HttpHeaders.CONNECTION,
      HttpHeaders.CONTENT_ENCODING,
      HttpHeaders.DATE,
      "Keep-Alive",
      HttpHeaders.PROXY_AUTHENTICATE,
      HttpHeaders.SERVER,
      HttpHeaders.TRAILER,
      HttpHeaders.TRANSFER_ENCODING,
      HttpHeaders.UPGRADE,
  };

  /**
   * Removes specific response headers.
   *
   * <p>Certain response headers cannot be modified by an Application. This
   * rewriter simply removes those headers.
   *
   * @param request A request object, which is not modified.
   * @param response A response object, which may be modified.
   * @param responseTime The timestamp indicating when the response completed.
   */
  private void ignoreHeadersRewriter(HttpServletRequest request, ResponseWrapper response,
                                     long responseTime) {
    for (String h : IGNORE_RESPONSE_HEADERS) {
      if (response.containsHeader(h)) {
        response.reallySetHeader(h, null);
      }
    }
  }

  /**
   * Sets the Server and Date response headers to their correct value.
   *
   * @param request A request object, which is not modified.
   * @param response A response object, which may be modified.
   * @param responseTime The timestamp indicating when the response completed.
   */
  private void serverDateRewriter(HttpServletRequest request, ResponseWrapper response,
                                  long responseTime) {
    response.reallySetHeader(HttpHeaders.SERVER, DEVELOPMENT_SERVER);
    response.reallySetDateHeader(HttpHeaders.DATE, responseTime);
  }

  /**
   * Determines whether the response may have a body, based on the status code.
   *
   * @param status The response status code.
   * @return true if the response may have a body.
   */
  private static boolean responseMayHaveBody(int status) {
    for (int s : NO_BODY_RESPONSE_STATUSES) {
      if (status == s) {
        return false;
      }
    }
    return true;
  }

  /**
   * Sets the default Cache-Control and Expires headers.
   *
   * These are only set if the response status allows a body, and only if the
   * headers have not been explicitly set by the application.
   *
   * @param request A request object, which is not modified.
   * @param response A response object, which may be modified.
   * @param responseTime The timestamp indicating when the response completed.
   */
  private void cacheRewriter(HttpServletRequest request, ResponseWrapper response,
                             long responseTime) {
    if (!responseMayHaveBody(response.getStatus())) {
      return;
    }

    if (!response.containsHeader(HttpHeaders.CACHE_CONTROL)) {
      response.reallySetHeader(HttpHeaders.CACHE_CONTROL, "no-cache");
      if (!response.containsHeader(HttpHeaders.EXPIRES)) {
        response.reallySetHeader(HttpHeaders.EXPIRES, "Fri, 01 Jan 1990 00:00:00 GMT");
      }
    }

    if (response.containsHeader(HttpHeaders.SET_COOKIE)) {
      long expires = response.getExpires();
      if (expires == Long.MIN_VALUE || expires >= responseTime) {
        response.reallySetDateHeader(HttpHeaders.EXPIRES, responseTime);
      }

      Vector<String> cacheDirectives = new Vector<String>(response.getCacheControl());
      while (cacheDirectives.remove("public")) {
      }
      if (!cacheDirectives.contains("private") && !cacheDirectives.contains("no-cache") &&
          !cacheDirectives.contains("no-store")) {
        cacheDirectives.add("private");
      }
      StringBuilder newCacheControl = new StringBuilder();
      for (String directive : cacheDirectives) {
        if (newCacheControl.length() > 0) {
          newCacheControl.append(", ");
        }
        newCacheControl.append(directive);
      }
      response.reallySetHeader(HttpHeaders.CACHE_CONTROL, newCacheControl.toString());
    }
  }

  /**
   * Deletes the response body, if X-AppEngine-BlobKey is present.
   *
   * Otherwise, it would be an error if we were to send text to the client and
   * then attempt to rewrite the body to serve the blob.
   *
   * @param request A request object, which is not modified.
   * @param response A response object, which may be modified.
   * @param responseTime The timestamp indicating when the response completed.
   */
  private void blobServeRewriter(HttpServletRequest request, ResponseWrapper response,
                                 long responseTime) {
    if (response.containsHeader(BLOB_KEY_HEADER)) {
      response.reallyResetBuffer();
    }
  }

  /**
   * Rewrites the Content-Length header.
   *
   * <p>Even though Content-Length is not a user modifiable header, App Engine
   * sends a correct Content-Length to the user based on the actual response.
   *
   * <p>If the request method is HEAD or the response status indicates that the
   * response should not have a body, the body is deleted instead. The existing
   * Content-Length header is preserved for HEAD requests.
   *
   * @param request A request object, which is not modified.
   * @param response A response object, which may be modified.
   * @param responseTime The timestamp indicating when the response completed.
   */
  private void contentLengthRewriter(HttpServletRequest request, ResponseWrapper response,
                                     long responseTime) {
    response.flushPrintWriter();
    if (request.getMethod().equals("HEAD")) {
      response.reallyResetBuffer();
      logService.clearResponseSize();
    } else if (!responseMayHaveBody(response.getStatus())) {
      response.reallySetHeader(HttpHeaders.CONTENT_LENGTH, null);
      response.reallyResetBuffer();
      logService.clearResponseSize();
    } else {
      response.reallySetHeader(HttpHeaders.CONTENT_LENGTH, Long.toString(response.getBodyLength()));
      logService.registerResponseSize(response.getBodyLength());
    }
  }

  @Override
  public void destroy() {
  }

  /**
   * Wraps a request to strip out some of the headers.
   */
  private static class RequestWrapper extends HttpServletRequestWrapper {
    /**
     * An Enumeration that filters out ignored header names.
     */
    private static class HeaderFilterEnumeration implements Enumeration<Object> {
      private final Enumeration<?> allNames;
      private String nextName;

      HeaderFilterEnumeration(Enumeration<?> allNames) {
        this.allNames = allNames;
        getNextValidName();
      }

      /** Get the next non-ignored name from allNames and store it in nextName.
       */
      private void getNextValidName() {
        while (allNames.hasMoreElements()) {
          String name = (String) allNames.nextElement();
          if (validHeader(name)) {
            nextName = name;
            return;
          }
        }
        nextName = null;
      }

      @Override
      public boolean hasMoreElements() {
        return nextName != null;
      }

      @Override
      public Object nextElement() {
        if (nextName == null) {
          throw new NoSuchElementException();
        }
        String result = nextName;
        getNextValidName();
        return result;
      }
    }

    public RequestWrapper(HttpServletRequest request) {
      super(request);
    }

    private static boolean validHeader(String name) {
      for (String h : IGNORE_REQUEST_HEADERS) {
        if (h.equalsIgnoreCase(name)) {
          return false;
        }
      }
      return true;
    }

    @Override
    public long getDateHeader(String name) {
      return validHeader(name) ? super.getIntHeader(name) : -1;
    }

    @Override
    public String getHeader(String name) {
      return validHeader(name) ? super.getHeader(name) : null;
    }

    @Override
    public Enumeration<?> getHeaders(String name) {
      if (validHeader(name)) {
        return super.getHeaders(name);
      } else {
        return new Enumeration<Object>() {
          @Override
          public boolean hasMoreElements() {
            return false;
          }
          @Override
          public Object nextElement() {
            throw new NoSuchElementException();
          }
        };
      }
    }

    @Override
    public Enumeration<?> getHeaderNames() {
      return new HeaderFilterEnumeration(super.getHeaderNames());
    }

    @Override
    public int getIntHeader(String name) {
      return validHeader(name) ? super.getIntHeader(name) : -1;
    }
  }

  /**
   * Wraps a response to buffer the entire body, and allow reading of the
   * status, body and headers.
   *
   * <p>This buffers the entire body locally, so that the body is not streamed
   * in chunks to the client, but instead all at the end.
   *
   * <p>This is necessary to calculate the correct Content-Length at the end,
   * and also to modify headers after the application returns, but also matches
   * production behaviour.
   *
   * <p>For the sake of compatibility, the class <em>pretends</em> not to buffer
   * any data. (It behaves as if it has a buffer size of 0.) Therefore, as with
   * a normal {@link HttpServletResponseWrapper}, you may not modify the status
   * or headers after modifying the body. Note that the {@link PrintWriter}
   * returned by {@link #getWriter()} does its own limited buffering.
   *
   * <p>This class also provides the ability to read the value of the status and
   * some of the headers (which is not available before Servlet 3.0), and the
   * body.
   */
  private static class ResponseWrapper extends HttpServletResponseWrapper {
    private int status = SC_OK;

    /**
     * The value of the Expires header, parsed as a Java timestamp.
     *
     * <p>Long.MIN_VALUE indicates that the Expires header is missing or invalid.
     */
    private long expires = Long.MIN_VALUE;
    /** The value of the Cache-Control headers, parsed into separate directives. */
    private final Vector<String> cacheControl = new Vector<String>();

    /** A buffer to hold the body without sending it to the client. */
    private final ByteArrayOutputStream body = new ByteArrayOutputStream();
    private ServletOutputStream bodyServletStream = null;
    private PrintWriter bodyPrintWriter = null;
    /** Indicates that flushBuffer() has been called. */
    private boolean committed = false;

    private static final String DATE_FORMAT_STRING =
        "E, dd MMM yyyy HH:mm:ss 'GMT'";

    ResponseWrapper(HttpServletResponse response) {
      super(response);
    }

    @Override
    public ServletOutputStream getOutputStream() {
      if (bodyServletStream != null) {
        return bodyServletStream;
      } else {
        Preconditions.checkState(bodyPrintWriter == null, "getWriter has already been called");
        bodyServletStream = new ServletOutputStreamWrapper(body);
        return bodyServletStream;
      }
    }

    @Override
    public PrintWriter getWriter() throws UnsupportedEncodingException {
      if (bodyPrintWriter != null) {
        return bodyPrintWriter;
      } else {
        Preconditions.checkState(bodyServletStream == null,
                                 "getOutputStream has already been called");
        bodyPrintWriter = new PrintWriter(new OutputStreamWriter(body, getCharacterEncoding()));
        return bodyPrintWriter;
      }
    }

    @Override
    public void setCharacterEncoding(String charset) {
      if (bodyPrintWriter != null || isCommitted()) {
        return;
      }
      super.setCharacterEncoding(charset);
    }

    @Override
    public void setContentLength(int len) {
      if (isCommitted()) {
        return;
      }
      super.setContentLength(len);
    }

    @Override
    public void setContentType(String type) {
      if (isCommitted()) {
        return;
      }
      if (type != null && nonAscii(type)) {
        return;
      }
      if (bodyPrintWriter != null) {
        type = stripCharsetFromMediaType(type);
      }
      super.setContentType(type);
    }

    @Override
    public void setLocale(Locale loc) {
      if (isCommitted()) {
        return;
      }
      String oldCharacterEncoding = getCharacterEncoding();
      String oldContentType = getContentType();
      super.setLocale(loc);
      if (oldContentType != null || bodyPrintWriter != null) {
        super.setCharacterEncoding(oldCharacterEncoding);
      }
      if (oldContentType != null) {
        super.setContentType(oldContentType);
      }
    }

    @Override
    public void setBufferSize(int size) {
      checkNotCommitted();
      super.setBufferSize(size);
    }

    @Override
    public int getBufferSize() {
      return 0;
    }

    @Override
    public void flushBuffer() {
      committed = true;
    }

    @Override
    public void reset() {
      checkNotCommitted();
      super.reset();
    }

    @Override
    public void resetBuffer() {
      checkNotCommitted();
    }

    @Override
    public boolean isCommitted() {
      return committed || body.size() > 0;
    }

    /**
     * Checks whether {@link #isCommitted()} is true, and if so, raises
     * {@link IllegalStateException}.
     */
    void checkNotCommitted() {
      Preconditions.checkState(!isCommitted(), "Response has already been committed");
    }

    @Override
    public void addCookie(Cookie cookie) {
      if (isCommitted()) {
        return;
      }
      super.addCookie(cookie);
    }

    @Override
    public void addDateHeader(String name, long date) {
      if (isCommitted()) {
        return;
      }
      if (nonAscii(name)) {
        return;
      }
      super.addDateHeader(name, date);
      if (name.equalsIgnoreCase(HttpHeaders.EXPIRES)) {
        expires = date;
      }
    }

    @Override
    public void addHeader(String name, String value) {
      if (isCommitted()) {
        return;
      }
      if (value == null) {
        return;
      }
      if (nonAscii(name) || nonAscii(value)) {
        return;
      }
      if (name.equalsIgnoreCase(HttpHeaders.EXPIRES)) {
        try {
          parseExpires(value);
        } catch (ParseException e) {
        }
      } else if (name.equalsIgnoreCase(HttpHeaders.CACHE_CONTROL)) {
        parseCacheControl(value);
      } else if (name.equalsIgnoreCase(HttpHeaders.CONTENT_TYPE)) {
        if (bodyPrintWriter != null) {
          value = stripCharsetFromMediaType(value);
        }
      }
      super.addHeader(name, value);
    }

    @Override
    public void addIntHeader(String name, int value) {
      if (isCommitted()) {
        return;
      }
      if (nonAscii(name)) {
        return;
      }
      super.addIntHeader(name, value);
    }

    @Override
    public void sendError(int sc) throws IOException {
      checkNotCommitted();
      setStatus(sc);
      setErrorBody(Integer.toString(sc));
    }

    @Override
    public void sendError(int sc, String msg) throws IOException {
      checkNotCommitted();
      setStatus(sc, msg);
      setErrorBody(sc + " " + msg);
    }

    /** Sets the response body to an HTML page with an error message.
     *
     * This also sets the Content-Type header.
     *
     * @param errorText A message to display in the title and page contents.
     *        Should contain an HTTP status code and optional message.
     */
    private void setErrorBody(String errorText) throws IOException {
      setHeader(HttpHeaders.CONTENT_TYPE, "text/html; charset=iso-8859-1");
      String bodyText = "<html><head><title>Error " + errorText + "</title></head>\n"
          + "<body><h2>Error " + errorText + "</h2></body>\n"
          + "</html>";
      body.write(bodyText.getBytes("iso-8859-1"));
    }

    @Override
    public void sendRedirect(String location) {
      checkNotCommitted();
      setStatus(SC_FOUND);
      resetBuffer();
      setHeader(HttpHeaders.LOCATION, encodeRedirectURL(location));
      status = SC_FOUND;
    }

    @Override
    public void setDateHeader(String name, long date) {
      if (isCommitted()) {
        return;
      }
      if (nonAscii(name)) {
        return;
      }
      reallySetDateHeader(name, date);
    }

    @Override
    public void setHeader(String name, String value) {
      if (isCommitted()) {
        return;
      }
      if (nonAscii(name) || (value != null && nonAscii(value))) {
        return;
      }
      if (name.equalsIgnoreCase(HttpHeaders.CONTENT_TYPE)) {
        if (bodyPrintWriter != null) {
          value = stripCharsetFromMediaType(value);
        }
      }
      reallySetHeader(name, value);
    }

    @Override
    public void setIntHeader(String name, int value) {
      if (isCommitted()) {
        return;
      }
      if (nonAscii(name)) {
        return;
      }
      if (name.equalsIgnoreCase(HttpHeaders.EXPIRES)) {
        expires = Long.MIN_VALUE;
      }
      super.setIntHeader(name, value);
    }

    @Override
    public void setStatus(int sc) {
      if (isCommitted()) {
        return;
      }
      super.setStatus(sc);
      status = sc;
    }

    @Override
    public void setStatus(int sc, String sm) {
      if (isCommitted()) {
        return;
      }
      super.setStatus(sc, sm);
      status = sc;
    }

    /**
     * Gets the status code of the response.
     */
    int getStatus() {
      return status;
    }

    /**
     * Gets the value of the Expires header, as a Java timestamp.
     *
     * <p>Long.MIN_VALUE indicates that the Expires header is missing or invalid.
     */
    public long getExpires() {
      return expires;
    }

    /**
     * Gets the value of the Cache-Control headers, parsed into separate directives.
     */
    public Vector<String> getCacheControl() {
      return cacheControl;
    }

    /**
     * Gets the total number of bytes that have been written to the body without
     * committing.
     */
    int getBodyLength() {
      return body.size();
    }

    /**
     * Writes the body to the wrapped response's output stream.
     *
     * <p>If the body is not empty, this causes the status and headers to be
     * rewritten. This should not be called until all of the header and body
     * rewriting is complete.
     *
     * <p>If the body is empty, this has no effect, so the response can be
     * considered not committed.
     */
    void reallyCommit() throws IOException {
      flushPrintWriter();
      if (!isCommitted()) {
        return;
      }
      OutputStream stream = super.getOutputStream();
      stream.write(body.toByteArray());
      body.reset();
    }

    /**
     * Reset the output buffer.
     *
     * This works even though {@link #isCommitted()} may return true.
     */
    void reallyResetBuffer() {
      body.reset();
      bodyServletStream = null;
      bodyPrintWriter = null;
    }

    /**
     * Sets a header in the response.
     *
     * This works even though {@link #isCommitted()} may return true.
     */
    void reallySetHeader(String name, String value) {
      super.setHeader(name, value);
      if (name.equalsIgnoreCase(HttpHeaders.EXPIRES)) {
        if (value == null) {
          expires = Long.MIN_VALUE;
        } else {
          try {
            parseExpires(value);
          } catch (ParseException e) {
            expires = Long.MIN_VALUE;
          }
        }
      } else if (name.equalsIgnoreCase(HttpHeaders.CACHE_CONTROL)) {
        cacheControl.clear();
        if (value != null) {
          parseCacheControl(value);
        }
      }
    }

    /**
     * Sets a date header in the response.
     *
     * This works even though {@link #isCommitted()} may return true.
     */
    void reallySetDateHeader(String name, long date) {
      super.setDateHeader(name, date);
      if (name.equalsIgnoreCase(HttpHeaders.EXPIRES)) {
        expires = date;
      }
    }

    /**
     * Flushes the {@link PrintWriter} returned by {@link #getWriter()}, if it
     * exists.
     */
    void flushPrintWriter() {
      if (bodyPrintWriter != null) {
        bodyPrintWriter.flush();
      }
    }

    /**
     * Parse a date string and store the result in expires.
     */
    private void parseExpires(String date) throws ParseException {
      SimpleDateFormat dateFormat = new SimpleDateFormat(DATE_FORMAT_STRING);
      dateFormat.setTimeZone(TimeZone.getTimeZone("UTC"));
      Date parsedDate = dateFormat.parse(date);
      expires = parsedDate.getTime();
    }

    /**
     * Parse a comma-separated list, and add the items to cacheControl.
     */
    private void parseCacheControl(String directives) {
      String[] elements = directives.split(",");
      for (String element : elements) {
        cacheControl.add(element.trim());
      }
    }

    /**
     * Removes the charset parameter from a media type string.
     *
     * @param mediaType A media type string, such as a Content-Type value.
     * @return The media type with the charset parameter removed, if any
     *         existed. If not, returns the media type unchanged.
     */
    private static String stripCharsetFromMediaType(String mediaType) {
      String newMediaType = null;
      for (String part : mediaType.split(";")) {
        part = part.trim();
        if (!(part.length() >= 8 &&
              part.substring(0, 8).equalsIgnoreCase("charset="))) {
          newMediaType = newMediaType == null ? "" : newMediaType + "; ";
          newMediaType += part;
        }
      }
      return newMediaType;
    }

    /**
     * Tests whether a string contains any non-ASCII characters.
     */
    private static boolean nonAscii(String string) {
      for (char c : string.toCharArray()) {
        if (c >= 0x80) {
          return true;
        }
      }
      return false;
    }

    /**
     * A ServletOutputStream that wraps some other OutputStream.
     */
    private static class ServletOutputStreamWrapper extends ServletOutputStream {
      private final OutputStream stream;

      ServletOutputStreamWrapper(OutputStream stream) {
        this.stream = stream;
      }

      @Override
      public void close() throws IOException {
        stream.close();
      }

      @Override
      public void flush() throws IOException {
        stream.flush();
      }

      @Override
      public void write(byte[] b) throws IOException {
        stream.write(b);
      }

      @Override
      public void write(byte[] b, int off, int len) throws IOException {
        stream.write(b, off, len);
      }

      @Override
      public void write(int b) throws IOException {
        stream.write(b);
      }
    }
  }
}

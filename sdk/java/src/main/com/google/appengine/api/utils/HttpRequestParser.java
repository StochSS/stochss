// Copyright 2011 Google Inc. All Rights Reserved.

package com.google.appengine.api.utils;

import com.google.common.io.ByteStreams;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;

import javax.activation.DataSource;
import javax.servlet.ServletInputStream;
import javax.servlet.http.HttpServletRequest;
import javax.mail.internet.MimeMultipart;
import javax.mail.BodyPart;
import javax.mail.MessagingException;
import javax.mail.internet.ContentDisposition;
import javax.mail.internet.ContentType;

/**
 * {@code HttpRequestParser} encapsulates helper methods used to parse incoming {@code
 * multipart/form-data} HTTP requests. Subclasses should use these methods to parse specific
 * requests into useful data structures.
 *
 */
public class HttpRequestParser {
  /**
   * Parse input stream of the given request into a MimeMultipart object.
   *
   * @params req The HttpServletRequest whose POST data should be parsed.
   *
   * @return A MimeMultipart object representing the POST data.
   *
   * @throws IOException if the input stream cannot be read.
   * @throws MessagingException if the input stream cannot be parsed.
   * @throws IllegalStateException if the request's input stream has already been
   *     read (eg. by calling getReader() or getInputStream()).
   */
  protected static MimeMultipart parseMultipartRequest(HttpServletRequest req)
      throws IOException, MessagingException {
    ByteArrayOutputStream baos = new ByteArrayOutputStream();
    ServletInputStream inputStream = req.getInputStream();
    ByteStreams.copy(inputStream, baos);
    if (baos.size() == 0) {
      throw new IllegalStateException("Input stream already read, or empty.");
    }

    return new MimeMultipart(new StaticDataSource(req.getContentType(), baos.toByteArray()));
  }

  protected static String getFieldName(BodyPart part) throws MessagingException {
    String[] values = part.getHeader("Content-Disposition");
    String name = null;
    if (values != null && values.length > 0) {
      name = new ContentDisposition(values[0]).getParameter("name");
    }
    return (name != null) ? name : "unknown";
  }

  protected static String getTextContent(BodyPart part) throws MessagingException, IOException {
    ContentType contentType = new ContentType(part.getContentType());
    String charset = contentType.getParameter("charset");
    if (charset == null) {
      charset = "ISO-8859-1";
    }

    ByteArrayOutputStream baos = new ByteArrayOutputStream();
    ByteStreams.copy(part.getInputStream(), baos);
    try {
      return new String(baos.toByteArray(), charset);
    } catch (UnsupportedEncodingException ex) {
      return new String(baos.toByteArray());
    }
  }

  /**
   * A read-only {@link DataSource} backed by a content type and a
   * fixed byte array.
   */
  protected static class StaticDataSource implements DataSource {
    private final String contentType;
    private final byte[] bytes;

    public StaticDataSource(String contentType, byte[] bytes) {
      this.contentType = contentType;
      this.bytes = bytes;
    }

    public String getContentType() {
      return contentType;
    }

    public InputStream getInputStream() {
      return new ByteArrayInputStream(bytes);
    }

    public OutputStream getOutputStream() {
      throw new UnsupportedOperationException();
    }

    public String getName() {
      return "request";
    }
  }
}

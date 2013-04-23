// Copyright 2002 Google, Inc.

package com.google.appengine.tools.util;

import java.util.Date;
import java.util.Locale;
import java.text.SimpleDateFormat;
import java.text.ParseException;

/**
 * A collection of routines for parsing HTTP headers.
 *
 */
public class HttpHeaderParser {

  private char chars_[];
  private int start_;
  private String header_;

  /** Expiration date format for Netscape V0 cookies. */
  private static final SimpleDateFormat COOKIE_DATE_FORMAT =
    new SimpleDateFormat("EEE, dd-MMM-yyyy HH:mm:ss zzz", Locale.US);

  /**
   * Create a parser.
   * @param header header string, never null.
   */
  public HttpHeaderParser(String header) {
    chars_ = header.toCharArray();
    start_ = 0;
    header_ = header;
  }

  /**
   * Are we at the end of the header?
   * @return true if the header ended, false if one or more characters remain.
   */
  public boolean isEnd() {
    return (start_ >= chars_.length);
  }

  /**
   * Get next character without removing it.
   * @return next character, or -1 if end of input.
   */
  public int peek() {
    if (start_ >= chars_.length) {
      return -1;
    } else {
      return chars_[start_];
    }
  }

  /**
   * Eat a given character.
   * @param ch character to expect.
   * @exception HttpHeaderParseException if input does not start with ch.
   */
  public void eatChar(char ch)
    throws HttpHeaderParseException {
    if (start_ >= chars_.length || chars_[start_] != ch) {
      throw new HttpHeaderParseException("invalid http header: '"
	+ ch + "' expected: " + header_ + "[" + start_ + "]");
    }
    start_++;
  }

  /**
   * Eat linear white space (zero or more characters).
   */
  public void eatLWS() {
    while (start_ < chars_.length &&
           " \t\r\n".indexOf(chars_[start_]) >= 0) {
      start_++;
    }
  }

  /**
   * Eat a token.
   * @return token text, at least one character.
   * @exception HttpHeaderParseException if input does not start with a token.
   */
  public String eatToken()
    throws HttpHeaderParseException {

    final int mark = start_;
    while (start_ < chars_.length &&
           chars_[start_] > 31 && chars_[start_] != 127 &&
	   !isSeparator(chars_[start_])) {
      start_++;
    }

    if (mark >= start_) {
      throw new HttpHeaderParseException("invalid http header: " +
	"token expected: " + header_ + "[" + start_ + "]");
    }
    return new String(chars_, mark, start_ - mark);
  }

  /**
   * Eat a quoted string.
   * @return value read, can be empty.
   * @exception HttpHeaderParseException if input does not start with a qstring.
   */
  public String eatQuotedString()
    throws HttpHeaderParseException {

    eatChar('"');

    final int mark = start_;
    int write = start_;
    boolean escaped = false;
    while (start_ < chars_.length) {
      if (escaped) {
	if (chars_[start_] > 127) {
	  break;
	}
	chars_[write++] = chars_[start_];
	escaped = false;
      } else if (chars_[start_] == '"') {
	break;
      } else if (chars_[start_] == '\\') {
	escaped = true;
      } else if (chars_[start_] <= 31 || chars_[start_] == 127) {
	break;
      } else {
	chars_[write++] = chars_[start_];
      }
      start_++;
    }

    eatChar('"');

    return new String(chars_, mark, write - mark);
  }

  /**
   * Eat a token or a quoted string.
   * @return value read, can be empty.
   * @exception HttpHeaderParseException if input does not start with either.
   */
  public String eatTokenOrQuotedString()
    throws HttpHeaderParseException {
    if (start_ >= chars_.length) {
      throw new HttpHeaderParseException("invalid http header: " +
	"token or quoted string expected: " + header_ + "[" + start_ + "]");
    } else if (chars_[start_] == '"') {
      return eatQuotedString();
    } else {
      return eatToken();
    }
  }

  /**
   * Eat a Netscape V0 cookie token.
   * @return a token, of length at least one.
   * @exception HttpHeaderParseException if input does not start with a V0 tok.
   */
  public String eatV0CookieToken()
    throws HttpHeaderParseException {
    final int mark = start_;
    while (start_ < chars_.length &&
           ";, \t\r\n=".indexOf(chars_[start_]) < 0) {
      start_++;
    }
    if (mark >= start_) {
      throw new HttpHeaderParseException("invalid v0 cookie http header: " +
	"token expected: " + header_ + "[" + start_ + "]");
    }
    return new String(chars_, mark, start_ - mark);
  }

  /**
   * Eat a Netscape V0 cookie value.
   * @return a value, can be empty.
   */
  public String eatV0CookieValue() {
    final int mark = start_;
    while (start_ < chars_.length &&
	   ";, \t\r\n".indexOf(chars_[start_]) < 0) {
      start_++;
    }
    return new String(chars_, mark, start_ - mark);
  }

  /**
   * Eat a Netscape V0 cookie date.
   * @return date, never null.
   * @exception HttpHeaderParseException if input does not start with a date.
   */
  public Date eatV0CookieDate()
    throws HttpHeaderParseException {
    final int mark = start_;
    while (start_ < chars_.length && chars_[start_] != ';') {
      start_++;
    }
    final String value = (new String(chars_, mark, start_ - mark)).trim();
    try {
      final Date result = COOKIE_DATE_FORMAT.parse(value);
      if (result == null) {
	throw new ParseException(value, 0);
      }
      return result;
    } catch (ParseException e) {
      throw new HttpHeaderParseException("invalid v0 cookie http header: " +
	"date expected: " + header_ + "[" + mark + "]");
    }
  }

  /**
   * HTTP-encode an attribute=value pair.
   * @param attribute the attribute, must be an HTTP token.
   * @param value attribute value, must not contain CR or LF.
   * @return properly encoded attribute=value pair.
   * @exception IllegalArgumentException if either argument is illegal.
   */
  public static StringBuffer makeAttributeValuePair(String attribute,
                                                    String value) {
    if (!isToken(attribute)) {
      throw new IllegalArgumentException("not an http token: " + attribute);
    }
    final StringBuffer result = new StringBuffer(attribute);
    result.append('=');
    if (isToken(value)) {
      result.append(value);
    } else {
      result.append('"');
      final int n = value.length();
      for (int i = 0; i < n; i++) {
	final char ch = value.charAt(i);
	if (ch == '"' || ch == '\\' || ch == 127 ||
	    (ch <= 31 && ch != ' ' && ch != '\t')) {
	  if (ch == '\r' || ch == '\n') {
	    throw new IllegalArgumentException("CR, LF not allowed");
	  }
	  result.append('\\');
	  result.append(ch);
	} else {
	  result.append(ch);
	}
      }
      result.append('"');
    }
    return result;
  }

  /**
   * Get a charset from content type.
   * @param contentType Content-Type header value.
   * @return charset, or null if not present.
   * @exception HttpHeaderParseException if contentType is misformatted.
   */
  public static String getContentCharset(String contentType)
    throws HttpHeaderParseException {
    final HttpHeaderParser parser = new HttpHeaderParser(contentType);
    parser.eatLWS();
    parser.eatToken();
    parser.eatChar('/');
    parser.eatToken();
    parser.eatLWS();
    while (!parser.isEnd()) {
      parser.eatChar(';');
      parser.eatLWS();
      final String name = parser.eatToken();
      parser.eatChar('=');
      final String value = parser.eatTokenOrQuotedString();
      parser.eatLWS();
      if (name.equalsIgnoreCase("charset")) {
	return value;
      }
    }
    return null;
  }

  /**
   * Is a character an HTTP separator?
   * @param ch character to test.
   * @return true if ch is a separator, false if not.
   */
  private static boolean isSeparator(char ch) {
    return "()<>@,;:\\\"/[]?={} \t".indexOf(ch) >= 0;
  }

  /**
   * Is a string a token?
   * @param str string to test.
   * @return true if a string is a token, false otherwise.
   */
  private static boolean isToken(String str) {
    final int n = str.length();
    if (n <= 0) {
      return false;
    }
    for (int i = 0; i < n; i++) {
      final char ch = str.charAt(i);
      if (ch <= 31 || ch >= 127 || isSeparator(ch)) {
	return false;
      }
    }
    return true;
  }

}

// Copyright 2011 Google Inc. All Rights Reserved.

package com.google.appengine.api.search.query;

import java.util.NoSuchElementException;

/**
 * A helper class that holds various, state-less utility
 * functions used by the query parser.
 *
 */
public class ParserUtils {

  /**
   * Keeps the number of days per month for {@link #isDate(String)} method.
   */
  private static int[] MONTH_LENGTH = {
    31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31
  };

  /**
   * An iterator over characters of a quote delimited phrase. If the
   * phrase contains escaped sequences, such as "\\\"", "\\\'", "\\t", etc.
   * this iterator converts them to regular characters.
   */
  private static class PhraseCharIterator {

    private final String text;
    private int i;
    private int n;
    private char leftOver;

    public PhraseCharIterator(String text) {
      this.text = text;
      i = 1;
      n = text.length() - 2;
      while (i < n && Character.isWhitespace(text.charAt(i))) {
        ++i;
      }
      while (n > i && Character.isWhitespace(text.charAt(n))) {
        --n;
      }
      leftOver = 0;
    }

    private static boolean isOctal(char c) {
      return '0' < c && c < '8';
    }

    public boolean hasNext() {
      return leftOver != 0 || i <= n;
    }

    public char next() {
      if (!hasNext()) {
        throw new NoSuchElementException();
      }
      char c;
      if (leftOver != 0) {
        c = leftOver;
        leftOver = 0;
      } else {
        c = text.charAt(i++);
        if (c == '\\') {
          if (i <= n) {
            c = text.charAt(i++);
            switch (c) {
              case '\'':
                c = '\'';
                break;
              case '\"':
                c = '\"';
                break;
              case 'u':
                if (i + 3 <= n) {
                  try {
                    c = toChar(Integer.parseInt(text.substring(i, i + 4), 16));
                    i += 4;
                  } catch (NumberFormatException e) {
                    c = '\\';
                    leftOver = 'u';
                  }
                } else {
                  c = '\\';
                  leftOver = 'u';
                }
                break;
              default:
                if (!isOctal(c)) {
                  leftOver = c;
                  c = '\\';
                } else {
                  int codeSoFar = (c - '0');
                  int countSoFar = 1;
                  while (i <= n && countSoFar < 3) {
                    char nextChar = text.charAt(i++);
                    if (!isOctal(nextChar)) {
                      leftOver = nextChar;
                      break;
                    }
                    codeSoFar = codeSoFar * 8 + (nextChar - '0');
                    ++countSoFar;
                  }
                  c = toChar(codeSoFar);
                }
                break;
            }
          } else {
            c = '\\';
          }
        }
      }
      return c;
    }

    private static char toChar(int code) {
      char[] decoded = Character.toChars(code);
      if (decoded.length > 1) {
        throw new RuntimeException(
            "Decoded " + code + " does not return a single character");
      }
      return decoded[0];
    }
  }

  /** No instances of parser utils. */
  private ParserUtils() {}

  /** Removes the last character from the given text */
  public static String trimLast(String text) {
    return text.substring(0, text.length() - 1);
  }

  /**
   * Normalizes the phrase text. It strips external quote characters. Replaces
   * white space with a single space character. Converts escape sequences to
   * Java characters.
   *
   * @param phrase the phrase to be normalized
   * @return the phrase with characters and white space normalized
   */
  public static String normalizePhrase(String phrase) {
    PhraseCharIterator iter = new PhraseCharIterator(phrase);
    StringBuilder builder = new StringBuilder(phrase.length());
    while (iter.hasNext()) {
      while (iter.hasNext()) {
        char c = iter.next();
        if (Character.isWhitespace(c)) {
          break;
        }
        builder.append(c);
      }
      while (iter.hasNext()) {
        char c = iter.next();
        if (!Character.isWhitespace(c)) {
          builder.append(' ').append(c);
          break;
        }
      }
    }
    return builder.toString();
  }

  /**
   * Returns whether or not the given text looks like a number.
   * The number is defined as
   * '-'? digit* ('.' digit* ('E' ('+' | '-')? digit+)?)?
   *
   * @param text the text tested if it looks like a number
   * @return whether or not the text represents a floating point number
   */
  public static boolean isNumber(String text) {
    if (text == null || text.isEmpty()) {
      return false;
    }
    int i = 0;
    if (text.charAt(0) == '-') {
      if (text.length() == 1) {
        return false;
      }
      ++i;
    }
    i = consumeDigits(i, text);
    if (i >= text.length()) {
      return true;
    }
    if (text.charAt(i) == '.') {
      i = consumeDigits(i + 1, text);
    }
    if (i >= text.length()) {
      return true;
    }
    if (text.charAt(i) != 'E' && text.charAt(i) != 'e') {
      return false;
    }
    if (++i >= text.length()) {
      return false;
    }
    if (text.charAt(i) == '+' || text.charAt(i) == '-') {
      if (++i >= text.length()) {
        return false;
      }
    }
    return consumeDigits(i, text) >= text.length();
  }

  private static int consumeDigits(int i, String text) {
    while (i < text.length() && Character.isDigit(text.charAt(i))) {
      ++i;
    }
    return i;
  }

  /**
   * Returns if the given string looks like a date to us. We only accept
   * ISO 8601 dates, which have the dddd-dd-dd format.
   *
   * @param text text checked if it looks like a date
   * @return whether this could be an ISO 8601 date
   */
  public static boolean isDate(String text) {
    if (text == null || text.isEmpty()) {
      return false;
    }
    int year = 0;
    int i = 0;
    char c = '\0';
    if (text.charAt(i) == '-') {
      i++;
    }
    while (i < text.length()) {
      c = text.charAt(i++);
      if (!Character.isDigit(c)) {
        break;
      }
      year = year * 10 + (c - '0');
    }
    if (i >= text.length()) {
      return Character.isDigit(c);
    }
    if (c != '-') {
      return false;
    }
    int month = 0;
    while (i < text.length()) {
      c = text.charAt(i++);
      if (!Character.isDigit(c)) {
        break;
      }
      month = month * 10 + (c - '0');
      if (month > 12) {
        return false;
      }
    }
    if (month <= 0) {
      return false;
    }
    if (i >= text.length()) {
      return Character.isDigit(c);
    }
    if (c != '-') {
      return false;
    }
    int day = 0;
    while (i < text.length()) {
      c = text.charAt(i++);
      if (!Character.isDigit(c)) {
        return false;
      }
      day = day * 10 + (c - '0');
    }
    if (day <= 0) {
      return false;
    }
    if (month == 2) {
      if ((year % 400 == 0) || (year % 100 != 0 && year % 4 == 0)) {
        return day <= 29;
      }
    }
    return day <= MONTH_LENGTH[month - 1];
  }
}

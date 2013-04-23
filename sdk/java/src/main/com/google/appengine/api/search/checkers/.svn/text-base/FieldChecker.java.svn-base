// Copyright 2010 Google Inc. All Rights Reserved.

package com.google.appengine.api.search.checkers;

import com.google.appengine.api.search.DateUtil;
import com.google.appengine.api.search.ExpressionTreeBuilder;
import com.google.apphosting.api.AppEngineInternal;
import com.google.apphosting.api.search.DocumentPb;
import com.google.common.base.Strings;

import org.antlr.runtime.RecognitionException;

import java.nio.charset.Charset;
import java.util.Date;
import java.util.Locale;

/**
 * Provides checks for Field names, language code, and values: text, HTML, atom
 * or date.
 *
 */
@AppEngineInternal
public final class FieldChecker {

  /**
   * Checks whether a field name is valid. The field name length must be
   * between 1 and {@link #MAXIMUM_NAME_LENGTH} and it should match
   * {@link #FIELD_NAME_PATTERN}.
   *
   * @param name the field name to check
   * @return the checked field name
   * @throws IllegalArgumentException if the field name is null or empty
   * or is longer than {@literal Field.MAXIMUM_NAME_LENGTH} or it doesn't
   * match {@literal #FIELD_NAME_PATTERN}.
   */
  public static String checkFieldName(String name) {
    return checkFieldName(name, "field name");
  }

  /**
   * Checks whether a field name is valid. The field name length must be
   * between 1 and {@link #MAXIMUM_NAME_LENGTH} and it should match
   * {@link #FIELD_NAME_PATTERN}.
   *
   * @param name the field name to check
   * @param fieldName the name of the Java field name of the class where
   * name is checked
   * @return the checked field name
   * @throws IllegalArgumentException if the field name is null or empty
   * or is longer than {@literal Field.MAXIMUM_NAME_LENGTH} or it doesn't
   * match {@literal #FIELD_NAME_PATTERN}.
   */
  public static String checkFieldName(String name, String fieldName) {
    Preconditions.checkArgument(name != null, "%s cannot be null", fieldName);
    Preconditions.checkArgument(!Strings.isNullOrEmpty(name), "%s cannot be null or empty",
        fieldName);
    Preconditions.checkArgument(bytesInString(name) <= SearchApiLimits.MAXIMUM_NAME_LENGTH,
        "%s longer than %d : %s", fieldName, SearchApiLimits.MAXIMUM_NAME_LENGTH, name);
    Preconditions.checkArgument(name.matches(SearchApiLimits.FIELD_NAME_PATTERN),
        "%s should match pattern %s: %s", fieldName, SearchApiLimits.FIELD_NAME_PATTERN, name);
    return name;
  }

  /**
   * @return The number of bytes in the given string when UTF-8 encoded
   */
  static int bytesInString(String str) {
    return str.getBytes(Charset.forName("UTF-8")).length;
  }

  /**
   * @return true if name matches {@link #FIELD_NAME_PATTERN}.
   */
  static boolean nameMatchesPattern(String name) {
    return name.matches(SearchApiLimits.FIELD_NAME_PATTERN);
  }

  /**
   * Checks whether a text is valid. A text can be null, or a string between
   * 0 and {@literal Field.MAXIMUM_TEXT_LENGTH} in length.
   *
   * @param text the text to check
   * @return the checked text
   * @throws IllegalArgumentException if text is too long
   */
  public static String checkText(String text) {
    if (text != null) {
      Preconditions.checkArgument(bytesInString(text) <= SearchApiLimits.MAXIMUM_TEXT_LENGTH,
          "Field text longer than maximum length %d", SearchApiLimits.MAXIMUM_TEXT_LENGTH);
    }
    return text;
  }

  /**
   * Checks whether a html is valid. A html can be null or a string between
   * 0 and {@literal Field.MAXIMUM_TEXT_LENGTH} in length.
   *
   * @param html the html to check
   * @return the checked html
   * @throws IllegalArgumentException if html is too long
   */
  public static String checkHTML(String html) {
    if (html != null) {
      Preconditions.checkArgument(bytesInString(html) <= SearchApiLimits.MAXIMUM_TEXT_LENGTH,
          "html longer than maximum length %d", SearchApiLimits.MAXIMUM_TEXT_LENGTH);
    }
    return html;
  }

  /**
   * Checks whether an atom is valid. An atom can be null or a string between
   * 1 and {@literal Field.MAXIMUM_ATOM_LENGTH} in length.
   *
   * @param atom the atom to check
   * @return the checked atom
   * @throws IllegalArgumentException if atom is too long
   */
  public static String checkAtom(String atom) {
    if (atom != null) {
      Preconditions.checkArgument(bytesInString(atom) <= SearchApiLimits.MAXIMUM_ATOM_LENGTH,
          "Field atom longer than maximum length %d", SearchApiLimits.MAXIMUM_ATOM_LENGTH);
    }
    return atom;
  }

  /**
   * Checks whether a number is valid. A number can be null or a value between
   * {@link #MIN_NUMBER_VALUE} and {@link #MAX_NUMBER_VALUE}.
   *
   * @param value the value to check
   * @return the checked number
   * @throws IllegalArgumentException if number is too long
   */
  public static Double checkNumber(Double value) {
    if (value != null) {
      Preconditions.checkArgument(SearchApiLimits.MINIMUM_NUMBER_VALUE <= value,
          String.format("number value, %f, must be greater than or equal to %f",
              value, SearchApiLimits.MINIMUM_NUMBER_VALUE));
      Preconditions.checkArgument(value <= SearchApiLimits.MAXIMUM_NUMBER_VALUE,
          String.format("number value, %f, must be less than or equal to %f",
              value, SearchApiLimits.MAXIMUM_NUMBER_VALUE));
    }
    return value;
  }

  /**
   * Checks whether a date is within range. Date is nullable.
   *
   * @param date the date to check
   * @return the checked date
   * @throws IllegalArgumentException if date is out of range
   */
  public static Date checkDate(Date date) throws IllegalArgumentException {
    if (date != null) {
        Preconditions.checkArgument(
            SearchApiLimits.MINIMUM_DATE_VALUE.compareTo(date) <= 0,
            String.format("date %s must be after %s",
                DateUtil.formatDateTime(date),
                DateUtil.formatDateTime(SearchApiLimits.MINIMUM_DATE_VALUE)));
        Preconditions.checkArgument(
            date.compareTo(SearchApiLimits.MAXIMUM_DATE_VALUE) <= 0,
            String.format("date %s must be before %s",
                DateUtil.formatDateTime(date),
                DateUtil.formatDateTime(SearchApiLimits.MAXIMUM_DATE_VALUE)));
    }
    return date;
  }

  /**
   * Checks whether expression is not null and is parsable.
   *
   * @param expression the expression to check
   * @return the checked expression
   * @throws IllegalArgumentException if the expression is null, or
   * cannot be parsed
   */
  public static String checkExpression(String expression) {
    Preconditions.checkNotNull(expression, "expression cannot be null");
    try {
      new ExpressionTreeBuilder().parse(expression);
    } catch (RecognitionException e) {
      throw new IllegalArgumentException("Unable to parse expression: " + expression);
    }
    return expression;
  }

  public static DocumentPb.Field checkValid(DocumentPb.Field field) {
    checkFieldName(field.getName());
    DocumentPb.FieldValue value = field.getValue();
    switch (value.getType()) {
      case TEXT:
        checkText(value.getStringValue());
        break;
      case HTML:
        checkHTML(value.getStringValue());
        break;
      case DATE:
        checkDate(DateUtil.deserializeDate(value.getStringValue()));
        break;
      case ATOM:
        checkAtom(value.getStringValue());
        break;
      case NUMBER:
        checkNumber(Double.parseDouble(value.getStringValue()));
        break;
      case GEO:
        GeoPointChecker.checkValid(value.getGeo());
        break;
      default:
        throw new IllegalArgumentException("Unsupported field type " + value.getType());
    }
    return field;
  }

  /**
   * Returns a {@link Locale} parsed from the given locale string.
   *
   * @param locale a string representation of a {@link Locale}
   * @return a {@link Locale} parsed from the given locale string
   * @throws IllegalArgumentException if the locale cannot be parsed
   */
  public static Locale parseLocale(String locale) {
    if (locale == null) {
      return null;
    }
    String[] parts = locale.split("_", 3);
    if (parts.length == 1) {
      return new Locale(parts[0]);
    }
    if (parts.length == 2) {
      return new Locale(parts[0], parts[1]);
    }
    if (parts.length == 3) {
      return new Locale(parts[0], parts[1], parts[2]);
    }
    throw new IllegalArgumentException("Cannot parse locale " + locale);
  }
}

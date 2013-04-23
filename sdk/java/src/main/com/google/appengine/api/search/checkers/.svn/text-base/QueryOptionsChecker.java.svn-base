// Copyright 2010 Google Inc. All Rights Reserved.

package com.google.appengine.api.search.checkers;

import com.google.appengine.api.search.SearchServicePb.FieldSpec.Expression;
import com.google.appengine.api.search.SearchServicePb.SearchParams;
import com.google.appengine.api.search.SearchServicePb.SortSpec;
import com.google.apphosting.api.AppEngineInternal;

import java.util.List;

/**
 * Checks values of {@link com.google.appengine.api.search.QueryOptions}.
 *
 */
@AppEngineInternal
public final class QueryOptionsChecker {

  /**
   * Checks whether the number of documents to return is between 1 and the
   * maximum.
   *
   * @param limit the maximum number of documents to return in search
   * results
   * @return the checked number of documents to return
   * @throws IllegalArgumentException if the number of documents to return
   * is out of range
   */
  public static int checkLimit(int limit) {
    Preconditions.checkArgument(limit >= 1 && limit <= SearchApiLimits.SEARCH_MAXIMUM_LIMIT,
        "The limit %d must be between 1 and %d",
        limit, SearchApiLimits.SEARCH_MAXIMUM_LIMIT);
    return limit;
  }

  /**
   * Checks whether the offset is between 0 and the maximum. Can be null.
   *
   * @param offset the offset of the first result to return
   * results
   * @return the checked offset of the first result to return
   * @throws IllegalArgumentException if the offset is out of range
   */
  public static Integer checkOffset(Integer offset) {
    if (offset != null) {
      Preconditions.checkArgument(offset >= 0 && offset <= SearchApiLimits.SEARCH_MAXIMUM_OFFSET,
          "The offset %d must be between 0 and %d", offset, SearchApiLimits.SEARCH_MAXIMUM_OFFSET);
    }
    return offset;
  }

  /**
   * Checks whether the minimum number of documents found accuracy is between
   * 1 and the maximum.
   *
   * @param numberFoundAccuracy the minimum number of documents found
   * accuracy
   * @return the checked accuracy
   * @throws IllegalArgumentException if the minimum is out of range
   */
  public static int checkNumberFoundAccuracy(int numberFoundAccuracy) {
    Preconditions.checkArgument(numberFoundAccuracy >= 1 &&
        numberFoundAccuracy <= SearchApiLimits.SEARCH_MAXIMUM_NUMBER_FOUND_ACCURACY,
        "The number found accuracy %d must be between 1 and %d",
        numberFoundAccuracy, SearchApiLimits.SEARCH_MAXIMUM_NUMBER_FOUND_ACCURACY);
    return numberFoundAccuracy;
  }

  /**
   * Checks that there are at most
   * {@literal #MAXIMUM_NUMBER_OF_FIELDS_TO_RETURN} field names and
   * that each field name is valid.
   *
   * @param fieldNames the list of field names to check
   * @return the checked list of field names
   * @throws IllegalArgumentException if the field names list size exceeds the
   * maximum, or some name is invalid
   */
  public static List<String> checkFieldNames(List<String> fieldNames) {
    checkNumberOfFields(fieldNames.size());
    for (String fieldName : fieldNames) {
      FieldChecker.checkFieldName(fieldName);
    }
    return fieldNames;
  }

  /**
   * Checks that there are at most
   * {@literal #MAXIMUM_NUMBER_OF_FIELDS_TO_RETURN} expressions and
   * that each expression is valid.
   *
   * @param expressions the list of expressions to check
   * @return the checked list of expressions
   * @throws IllegalArgumentException if the expression list size exceeds the
   * maximum, or some expression is invalid
   */
  private static List<Expression> checkExpressions(List<Expression> expressions) {
    checkNumberOfFields(expressions.size());
    for (Expression expression : expressions) {
      FieldChecker.checkFieldName(expression.getName());
      FieldChecker.checkExpression(expression.getExpression());
    }
    return expressions;
  }

  /**
   * Checks the number of fields is not greater than the maximum.
   */
  private static void checkNumberOfFields(int numberOfFields) {
    Preconditions.checkArgument(
        numberOfFields <= SearchApiLimits.SEARCH_MAXIMUM_NUMBER_OF_FIELDS_TO_RETURN,
        "number of fields to return %d greater than %d",
        numberOfFields, SearchApiLimits.SEARCH_MAXIMUM_NUMBER_OF_FIELDS_TO_RETURN);
  }

  /**
   * Checks the search options are valid, specifically, has a non-null
   * number of documents to return specification, a valid cursor if present,
   * valid sort specification list, a valid collection of field names for
   * sorting, and a valid scorer specification.
   *
   * @param params the SearchParams to check
   * @return this checked SearchParams
   * @throws IllegalArgumentException if some part of the specification is
   * invalid
   */
  public static SearchParams checkValid(SearchParams params) {
    if (params.hasCursor()) {
      CursorChecker.checkCursor(params.getCursor());
    }
    checkOffset(params.getOffset());
    checkLimit(params.getLimit());
    if (params.hasMatchedCountAccuracy()) {
      checkNumberFoundAccuracy(params.getMatchedCountAccuracy());
    }
    for (SortSpec sortSpec : params.getSortSpecList()) {
      SortExpressionChecker.checkValid(sortSpec);
    }
    if (params.hasScorerSpec()) {
      SortOptionsChecker.checkValid(params.getScorerSpec());
    }
    if (params.hasKeysOnly()) {
      Preconditions.checkArgument(params.getFieldSpec().getExpressionCount() == 0,
          "if IDs only is requested expression to return must be empty");
      Preconditions.checkArgument(params.getFieldSpec().getNameCount() == 0,
          "if IDs only is requested expression to return must be empty");
    }
    checkFieldNames(params.getFieldSpec().getNameList());
    checkExpressions(params.getFieldSpec().getExpressionList());
    return params;
  }
}

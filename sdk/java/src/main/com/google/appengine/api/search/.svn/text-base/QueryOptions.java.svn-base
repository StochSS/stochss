// Copyright 2010 Google Inc. All Rights Reserved.

package com.google.appengine.api.search;

import com.google.appengine.api.search.SearchServicePb.SearchParams;
import com.google.appengine.api.search.checkers.Preconditions;
import com.google.appengine.api.search.checkers.QueryOptionsChecker;
import com.google.appengine.api.search.checkers.SearchApiLimits;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * Represents options which control where and what in the search results to
 * return, from restricting the document fields returned to those given, and
 * scoring and sorting the results, whilst supporting pagination.
 * <p>
 * For example, the following options will return documents from search
 * results for some given query, returning up to 20 results including the
 * fields 'author' and 'date-sent' as well as snippeted fields 'subject' and
 * 'body'. The results are sorted by 'author' in descending order, getting
 * the next 20 results from the responseCursor in the previously returned
 * results, giving back a single cursor in the {@link Results} to
 * get the next batch of results after this.
 * <p>
 * <pre>
 * QueryOptions request = QueryOptions.newBuilder()
 *      .setLimit(20)
 *      .setFieldsToReturn("author", "date-sent")
 *      .setFieldsToSnippet("subject", "body")
 *      .setSortOptions(SortOptions.newBuilder().
 *          .addSortExpression(SortExpression.newBuilder()
 *              .setExpression("author")
 *              .setDirection(Scorer.SortDirection.DESCENDING)
 *              .setDefaultValue("")))

 *      .setCursor(Cursor.newBuilder().build())
 *      .build();
 * </pre>
 *
 */
public final class QueryOptions {

  /**
   * A builder which constructs QueryOptions objects.
   */
  public static final class Builder {
    private Integer limit;

    private List<String> fieldsToReturn = new ArrayList<String>();
    private List<String> fieldsToSnippet = new ArrayList<String>();
    private List<FieldExpression> expressionsToReturn = new ArrayList<FieldExpression>();
 private SortOptions sortOptions; private Cursor cursor; private Integer numberFoundAccuracy; private Integer offset; private Boolean idsOnly;

    private Builder() {
    }

    /**
     * Constructs a {@link QueryOptions} builder with the given request.
     *
     * @param request the search request to populate the builder
     */
    private Builder(QueryOptions request) {
      limit = request.getLimit();
      cursor = request.getCursor();
      numberFoundAccuracy = request.getNumberFoundAccuracy();
      sortOptions = request.getSortOptions();
      fieldsToReturn = new ArrayList<String>(request.getFieldsToReturn());
      expressionsToReturn = new ArrayList<FieldExpression>(request.getExpressionsToReturn());
    }

    /**
     * Sets the limit on the number of documents to return in {@link Results}.
     *
     * @param limit the number of documents to return
     * @return this Builder
     * @throws IllegalArgumentException if numDocumentsToReturn is
     * not within acceptable range
     */
    public Builder setLimit(int limit) {
      this.limit = QueryOptionsChecker.checkLimit(limit);
      return this;
    }

    /**
     * Sets the cursor. The cursor is obtained from either a
     * {@link Results} or one of the individual
     * {@link ScoredDocument ScoredDocuments}.
     *
     * This is illustrated from the following code fragment:
     * <p>
     * <pre>
     * Cursor cursor = Cursor.newBuilder().build();
     *
     * SearchResults results = index.search(
     *     Query.newBuilder()
     *         .setOptions(QueryOptions.newBuilder()
     *             .setLimit(20)
     *             .setCursor(cursor)
     *             .build())
     *         .build("some query"));
     *
     * // If the Cursor is built without setPerResult(true), then
     * // by default a single {@link Cursor} is returned with the
     * // {@link Results}.
     * cursor = results.getCursor();
     *
     * for (ScoredDocument result : results) {
     *     // If you set Cursor.newBuilder().setPerResult(true)
     *     // then a cursor is returned with each result.
     *     result.getCursor();
     * </pre>
     *
     * @param cursor use a cursor returned from a
     * previous set of search results as a starting point to retrieve
     * the next set of results. This can get you better performance, and
     * also improves the consistency of pagination through index updates
     * @return this Builder
     */
    public Builder setCursor(Cursor cursor) {
      Preconditions.checkArgument(offset == null || cursor == null,
          "offset and cursor cannot be set in the same request");
      this.cursor = cursor;
      return this;
    }

    /**
     * Sets a cursor built from the builder.
     *
     * @see {@link #setCursor(Cursor)}
     * @param cursorBuilder a {@link Cursor.Builder} that is used to build
     * a {@link} Cursor
     * @return this Builder
     */
    public Builder setCursor(Cursor.Builder cursorBuilder) {
      return setCursor(cursorBuilder.build());
    }

    /**
     * Sets the offset of the first result to return.
     *
     * @param offset the offset into all search results to return the limit
     * amount of results
     * @return this Builder
     * @throws IllegalArgumentException if the offset is negative or is larger
     * than {@link SearchApiLimits#SEARCH_MAXIMUM_OFFSET}
     */
    public Builder setOffset(int offset) {
      Preconditions.checkArgument(cursor == null,
          "offset and cursor cannot be set in the same request");
      this.offset = QueryOptionsChecker.checkOffset(offset);
      return this;
    }

    /**
     * Sets the accuracy requirement for
     * {@link Results#getNumberFound()}. If set,
     * {@code getNumberFound()} will be accurate up to at least that number.
     * For example, when set to 100, any {@code getNumberFound()} <= 100 is
     * accurate. This option may add considerable latency / expense, especially
     * when used with {@link Builder#setFieldsToReturn(String...)}.
     *
     * @param numberFoundAccuracy the minimum accuracy requirement
     * @return this Builder
     * @throws IllegalArgumentException if the accuracy is not within
     * acceptable range
     */
    public Builder setNumberFoundAccuracy(int numberFoundAccuracy) {
      this.numberFoundAccuracy =
          QueryOptionsChecker.checkNumberFoundAccuracy(numberFoundAccuracy);
      return this;
    }

    /**
     * Specifies one or more fields to return in results.
     *
     * @param fields the names of fields to return in results
     * @return this Builder
     * @throws IllegalArgumentException if any of the field names is invalid
     */
    public Builder setFieldsToReturn(String... fields) {
      Preconditions.checkNotNull(fields, "field names cannot be null");
      Preconditions.checkArgument(idsOnly == null,
          "You may not set fields to return if search returns keys only");
      List<String> returningFields = new ArrayList<String>(fields.length);
      for (String field : fields) {
        returningFields.add(field);
      }
      fieldsToReturn = QueryOptionsChecker.checkFieldNames(returningFields);
      return this;
    }

    /**
     * Specifies one or more fields to snippet in results. Snippets will be
     * returned as fields with the same names in
     * {@link ScoredDocument#getExpressions()}.
     *
     * @param fieldsToSnippet the names of fields to snippet in results
     * @return this Builder
     * @throws IllegalArgumentException if any of the field names is invalid
     */
    public Builder setFieldsToSnippet(String... fieldsToSnippet) {
      Preconditions.checkNotNull(fieldsToReturn, "field names cannot be null");
      List<String> snippetingFields = new ArrayList<String>(fieldsToSnippet.length);
      for (String field : fieldsToSnippet) {
        snippetingFields.add(field);
      }
      this.fieldsToSnippet = QueryOptionsChecker.checkFieldNames(snippetingFields);
      return this;
    }

    /**
     * Adds a {@link FieldExpression} build from the given
     * {@code expressionBuilder} to return in search results. Snippets will be
     * returned as fields with the same names in
     * {@link ScoredDocument#getExpressions()}.
     *
     * @param expressionBuilder a builder of named expressions to
     * evaluate and return in results
     * @return this Builder
     */
    public Builder addExpressionToReturn(FieldExpression.Builder expressionBuilder) {
      Preconditions.checkArgument(idsOnly == null,
          "You may not add expressions to return if search returns keys only");
      return addExpressionToReturn(expressionBuilder.build());
    }

    /**
     * Sets whether or not the search should return documents or document IDs only.
     * This setting is incompatible with
     * {@link #addExpressionToReturn(FieldExpression)} and with
     * {@link #setFieldsToReturn(String...)} methods.
     *
     * @param idsOnly whether or not only IDs of documents are returned by search request
     * @return this Builder
     */
    public Builder setReturningIdsOnly(boolean idsOnly) {
      Preconditions.checkArgument(expressionsToReturn.isEmpty(),
          "You cannot request IDs only if expressions to return are set");
      Preconditions.checkArgument(fieldsToReturn.isEmpty(),
          "You cannot request IDs only if fields to return are already set");
      this.idsOnly = idsOnly;
      return this;
    }

    /**
     * Adds a {@link FieldExpression} to return in search results.
     *
     * @param expression a named expression to compute and return in results
     * @return this Builder
     */
    public Builder addExpressionToReturn(FieldExpression expression) {
      this.expressionsToReturn.add(expression);
      return this;
    }

    /**
     * Sets a {@link SortOptions} to sort documents with.
     *
     * @param sortOptions specifies how to sort the documents in {@link Results}
     * @return this Builder
     */
    public Builder setSortOptions(SortOptions sortOptions) {
      this.sortOptions = sortOptions;
      return this;
    }

    /**
     * Sets a {@link SortOptions} using a builder.
     *
     * @param builder a builder of a {@link SortOptions}
     * @return this Builder
     */
    public Builder setSortOptions(SortOptions.Builder builder) {
      this.sortOptions = builder.build();
      return this;
    }

    /**
     * Construct the final message.
     *
     * @return the QueryOptions built from the parameters entered on this
     * Builder
     * @throws IllegalArgumentException if the search request is invalid
     */
    public QueryOptions build() {
      return new QueryOptions(this);
    }
  }

  private final int limit;

  private final int numberFoundAccuracy;

  private final List<String> fieldsToReturn;
  private final List<String> fieldsToSnippet;
  private final List<FieldExpression> expressionsToReturn;
 private final SortOptions sortOptions; private final Cursor cursor; private final Integer offset; private final Boolean idsOnly;

  /**
   * Creates a search request from the builder.
   *
   * @param builder the search request builder to populate with
   */
  private QueryOptions(Builder builder) {
    limit = QueryOptionsChecker.checkLimit(
        Util.defaultIfNull(builder.limit, SearchApiLimits.SEARCH_DEFAULT_LIMIT));
    numberFoundAccuracy = Util.defaultIfNull(builder.numberFoundAccuracy,
        SearchApiLimits.SEARCH_DEFAULT_NUMBER_FOUND_ACCURACY);
    sortOptions = builder.sortOptions;
    cursor = builder.cursor;
    offset = QueryOptionsChecker.checkOffset(builder.offset);

    fieldsToReturn = new ArrayList<String>(builder.fieldsToReturn);
    fieldsToSnippet = new ArrayList<String>(builder.fieldsToSnippet);
    expressionsToReturn = new ArrayList<FieldExpression>(builder.expressionsToReturn);
    idsOnly = builder.idsOnly;
    checkValid();
  }

  /**
   * @return the limit on the number of documents to return in search
   * results
   */
  public int getLimit() {
    return limit;
  }

  /**
   * @return a cursor returned from a previous set of
   * search results to use as a starting point to retrieve the next
   * set of results. Can be null
   */
  public Cursor getCursor() {
    return cursor;
  }

  /**
   * @return the offset of the first result to return; returns 0 if
   * was not set
   */
  public int getOffset() {
    return (offset == null) ? 0 : offset.intValue();
  }

  /**
   * Any {@link Results#getNumberFound()} less than or equal to this
   * setting will be accurate.
   *
   * @return the found count accuracy
   */
  public int getNumberFoundAccuracy() {
    return numberFoundAccuracy;
  }

  /**
   * @return a {@link SortOptions} specifying how to sort Documents in
   * {@link Results}
   */
  public SortOptions getSortOptions() {
    return sortOptions;
  }

  /**
   * @return if this search request returns results document IDs only
   */
  public boolean isReturningIdsOnly() {
    return idsOnly == null ? false : idsOnly.booleanValue();
  }

  /**
   * @return an unmodifiable list of names of fields to return in search
   * results
   */
  public List<String> getFieldsToReturn() {
    return Collections.unmodifiableList(fieldsToReturn);
  }

  /**
   * @return an unmodifiable list of names of fields to snippet in search
   * results
   */
  public List<String> getFieldsToSnippet() {
    return Collections.unmodifiableList(fieldsToSnippet);
  }

  /**
   * @return an unmodifiable list of expressions which will be evaluated
   * and returned in results
   */
  public List<FieldExpression> getExpressionsToReturn() {
    return Collections.unmodifiableList(expressionsToReturn);
  }

  /**
   * Creates and returns a {@link QueryOptions} builder. Set the search request
   * parameters and use the {@link Builder#build()} method to create a concrete
   * instance of QueryOptions.
   *
   * @return a {@link Builder} which can construct a search request
   */
  public static Builder newBuilder() {
    return new Builder();
  }

  /**
   * Creates a builder from the given request.
   *
   * @param request the search request for the builder to use
   * to build another request
   * @return a new builder with values set from the given request
   */
  public static Builder newBuilder(QueryOptions request) {
    return new Builder(request);
  }

  /**
   * Checks the search specification is valid, specifically, has
   * a non-null number of documents to return specification, a valid
   * cursor if present, valid sort specification list, a valid
   * collection of field names for sorting.
   *
   * @return this checked QueryOptions
   * @throws IllegalArgumentException if some part of the specification is
   * invalid
   */
  private QueryOptions checkValid() {
    Preconditions.checkNotNull(limit, "number of documents to return cannot be null");
    QueryOptionsChecker.checkFieldNames(fieldsToReturn);
    return this;
  }

  /**
   * Wraps quotes around an escaped argument string.
   *
   * @param argument the string to escape quotes and wrap with quotes
   * @return the wrapped and escaped argument string
   */
  private static String quoteString(String argument) {
    return "\"" + argument.replace("\"", "\\\"") + "\"";
  }

  /**
   * Copies the contents of this {@link QueryOptions} object into a
   * {@link SearchParams} protocol buffer builder.
   *
   * @return a search params protocol buffer builder initialized with
   * the values from this request
   * @throws IllegalArgumentException if the cursor type is
   * unknown
   */
  SearchParams.Builder copyToProtocolBuffer(SearchParams.Builder builder, String query) {
    builder.setLimit(getLimit());
    if (cursor != null) {
      cursor.copyToProtocolBuffer(builder);
    } else {
      builder.setCursorType(SearchParams.CursorType.NONE);
    }
    if (offset != null) {
      builder.setOffset(offset);
    }
    if (idsOnly != null) {
      builder.setKeysOnly(idsOnly);
    }

    builder.setMatchedCountAccuracy(numberFoundAccuracy);
    if (sortOptions != null) {
      sortOptions.copyToProtocolBuffer(builder);
    }
    if (!fieldsToReturn.isEmpty() || !fieldsToSnippet.isEmpty() || !expressionsToReturn.isEmpty()) {
      SearchServicePb.FieldSpec.Builder fieldSpec = SearchServicePb.FieldSpec.newBuilder();
      fieldSpec.addAllName(fieldsToReturn);
      for (String field : fieldsToSnippet) {
        FieldExpression.Builder expressionBuilder = FieldExpression.newBuilder().setName(field);
        expressionBuilder.setExpression("snippet(" + quoteString(query) + ", " + field + ")");
        fieldSpec.addExpression(expressionBuilder.build().copyToProtocolBuffer());
      }
      for (FieldExpression expression : expressionsToReturn) {
        fieldSpec.addExpression(expression.copyToProtocolBuffer());
      }
      builder.setFieldSpec(fieldSpec);
    }
    return builder;
  }

  @Override
  public String toString() {
    return String.format(
        "QueryOptions(limit=%d%s%s%s%s%s, numberFoundAccuracy=%d%s%s)",
        limit,
        Util.fieldToString("IDsOnly", idsOnly),
        Util.fieldToString("sortOptions", sortOptions),
        Util.iterableFieldToString("fieldsToReturn", fieldsToReturn),
        Util.iterableFieldToString("fieldsToSnippet", fieldsToSnippet),
        Util.iterableFieldToString("expressionsToReturn", expressionsToReturn),
        numberFoundAccuracy,
        Util.fieldToString("cursor", cursor),
        Util.fieldToString("offset", offset));
  }
}

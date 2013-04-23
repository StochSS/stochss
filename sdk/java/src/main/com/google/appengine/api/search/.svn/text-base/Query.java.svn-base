// Copyright 2010 Google Inc. All Rights Reserved.

package com.google.appengine.api.search;

import com.google.appengine.api.search.SearchServicePb.SearchParams;
import com.google.appengine.api.search.checkers.Preconditions;
import com.google.appengine.api.search.checkers.QueryChecker;

/**
 * A query to search an index for documents which match,
 * restricting the document fields returned to those given, and
 * scoring and sorting the results, whilst supporting pagination.
 * <p>
 * For example, the following query will search for documents where
 * the tokens 'good' and 'story' occur in some fields,
 * returns up to 20 results including the fields 'author' and 'date-sent'
 * as well as snippeted fields 'subject' and 'body'. The results
 * are sorted by 'author' in descending order, getting the next 20 results
 * from the responseCursor in the previously returned results, giving
 * back a single cursor in the {@link Results} to get the next
 * batch of results after this.
 * <p>
 * <pre>
 * QueryOptions options = QueryOptions.newBuilder()
 *     .setLimit(20)
 *     .setFieldsToSnippet("subject", "body")
 *     .setScorer(CustomScorer.newBuilder()
 *         .addSortExpression(SortExpression.newBuilder()
 *             .setExpression("author")
 *             .setDirection(SortDirection.DESCENDING)
 *             .setDefaultValue("")))
 *     .setCursor(responseCursor)
 *     .build();
 * Query query = Query.newBuilder()
 *     .setOptions(options)
 *     .build("good story");
 * </pre>
 *
 */
public class Query {

  /**
   * A builder which constructs Query objects.
   */
  public static class Builder {
    private String queryString;
 private QueryOptions options;

    protected Builder() {
    }

    /**
     * Constructs a {@link Query} builder with the given query.
     *
     * @param query the query to populate the builder
     */
    private Builder(Query query) {
      this.queryString = query.getQueryString();
      this.options = query.getOptions();
    }

    /**
     * Sets the query options.
     *
     * @param options the {@link QueryOptions} to apply to the search results
     * @return this builder
     */
    public Builder setOptions(QueryOptions options) {
      this.options = options;
      return this;
    }

    /**
     * Sets the query options from a builder.
     *
     * @param optionsBuilder the {@link QueryOptions.Builder} build a
     * {@link QueryOptions{ to apply to the search results
     * @return this builder
     */
    public Builder setOptions(QueryOptions.Builder optionsBuilder) {
      return setOptions(optionsBuilder.build());
    }

    /**
     * Sets the query string used to construct the query.
     *
     * @param query a query string used to construct the query
     * @return this Builder
     * @throws SearchQueryException if the query string does not parse
     */
    protected Builder setQueryString(String query) {
      this.queryString = QueryChecker.checkQuery(query);
      return this;
    }

    /**
     * Build a {@link Query} from  the query string and the parameters set on
     * the {@link Builder}. A query string can be as simple as a single term
     * ("foo"), or as complex as a boolean expression, including field names
     * ("title:hello OR body:important -october").
     *
     * @param queryString the query string to parse and apply to an index
     * @return the Query built from the parameters entered on this
     * Builder including the queryString
     * @throws SearchQueryException if the query string is invalid
     */
    public Query build(String queryString) {
      setQueryString(queryString);
      return new Query(this);
    }

    /**
     * Construct the message.
     *
     * @return the Query built from the parameters entered on this
     * Builder
     * @throws IllegalArgumentException if the query string is invalid
     */
    public Query build() {
      return new Query(this);
    }
  }

  private final String query;
 private final QueryOptions options;

  /**
   * Creates a query from the builder.
   *
   * @param builder the query builder to populate with
   */
  protected Query(Builder builder) {
    query = builder.queryString;
    options = builder.options;
    checkValid();
  }

  /**
   * The query can be as simple as a single term ("foo"), or as complex
   * as a boolean expression, including field names ("title:hello OR
   * body:important -october").
   *
   * @return the query
   */
  public String getQueryString() {
    return query;
  }

  /**
   * @return the {@link QueryOptions} for controlling the what is returned
   * in the result set matching the query
   */
  public QueryOptions getOptions() {
    return options;
  }

  /**
   * Creates and returns a {@link Query} builder. Set the query
   * parameters and use the {@link Builder#build()} method to create a concrete
   * instance of Query.
   *
   * @return a {@link Builder} which can construct a query
   */
  public static Builder newBuilder() {
    return new Builder();
  }

  /**
   * Creates a builder from the given query.
   *
   * @param query the query for the builder to use to build another query
   * @return a new builder with values based on the given request
   */
  public static Builder newBuilder(Query query) {
    return new Builder(query);
  }

  /**
   * Checks the query is valid, specifically, has a non-null
   * query string.
   *
   * @return this checked Query
   * @throws NullPointerException if query is null
   */
  private Query checkValid() {
    Preconditions.checkNotNull(query, "query cannot be null");
    return this;
  }

  /**
   * Copies the contents of this {@link Query} object into a
   * {@link SearchParams} protocol buffer builder.
   *
   * @return a search params protocol buffer builder initialized with
   * the values from this query
   * @throws IllegalArgumentException if the cursor type is
   * unknown
   */
  SearchParams.Builder copyToProtocolBuffer() {
    SearchParams.Builder builder = SearchParams.newBuilder().setQuery(query);
    if (options == null) {
      QueryOptions.newBuilder().build().copyToProtocolBuffer(builder, query);
    } else {
      options.copyToProtocolBuffer(builder, query);
    }
    return builder;
  }

  @Override
  public String toString() {
    return String.format(
        "Query(queryString=%s%s)",
        query,
        Util.fieldToString("options", options));
  }
}

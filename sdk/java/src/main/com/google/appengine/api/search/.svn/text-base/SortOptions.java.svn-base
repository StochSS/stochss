// Copyright 2012 Google Inc. All Rights Reserved.

package com.google.appengine.api.search;

import com.google.appengine.api.search.SearchServicePb.SearchParams;
import com.google.appengine.api.search.checkers.Preconditions;
import com.google.appengine.api.search.checkers.SortOptionsChecker;
import com.google.appengine.api.search.checkers.SearchApiLimits;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * Definition of how to sort documents. You may specify zero or more sort
 * expressions and set a match scorer. If you have a large index, it is
 * advisable to set a limit.
 *
 */
public final class SortOptions {

  /**
   * A builder that constructs {@link SortOptions SortOptionss}.
   * A SortOptions will evaluate each of the
   * {@link SortExpression SortExpressions} on each search result and apply a
   * sort order with priority given to the sort expressions from left to right.
   * The following code illustrates creating a SortOptions specification
   * to sort documents based on decreasing product rating and then within
   * rating showing cheapest products based on price plus tax,
   * sorting at most 2000 documents.
   * <p>
   * <pre>
   *   SortOptions sortOptions = SortOptions.newBuilder()
   *       .addSortExpression(SortExpression.newBuilder()
   *           .setExpression("rating")
   *           .setDirection(SortExpression.SortDirection.DESCENDING)
   *           .setDefaultValueNumeric(0))
   *       .addSortExpression(SortExpression.newBuilder()
   *           .setExpression("price + tax")
   *           .setDirection(SortExpression.SortDirection.ASCENDING)
   *           .setDefaultValueNumeric(99999999.00))
   *       .setLimit(1000)
   *       .build();
   * </pre>
   *
   * The following code fragment shows how the score from a {@link MatchScorer}
   * can be used in an expression that combines the score with one thousandth of
   * an "importance" field. At most 1000 documents are scored and sorted.
   * <pre>
   *   SortOptions sortOptions = SortOptions.newBuilder()
   *       .setMatchScorer(MatchScorer.newBuilder())
   *       .addSortExpression(SortExpression.newBuilder()
   *           .setExpression(String.format(
   *               "%s + (importance * .001)", SortExpression.SCORE_FIELD_NAME))
   *           .setDirection(SortExpression.SortDirection.DESCENDING)
   *           .setDefaultValueNumeric(0))
   *       .setLimit(1000)
   *       .build();
   * </pre>
   */
  public static final class Builder { private MatchScorer matchScorer; private Integer limit;

    private final List<SortExpression> sortExpressions = new ArrayList<SortExpression>();

    private Builder() {
    }

    /**
     * Sets the limit on the number of documents to score or sort.
     *
     * @param limit the maximum number of documents to score or sort
     * @return this builder
     * @throws IllegalArgumentException if the limit is out of range
     */
    public Builder setLimit(int limit) {
      this.limit = SortOptionsChecker.checkLimit(limit);
      return this;
    }

    /**
     * Sets a {@link MatchScorer} or {@link RescoringMatchScorer} to base some
     * {@link SortExpression SortExpressions} on. The value of the matchScorer can
     * be accessed by using the field name "_score".
     *
     * @param matchScorer the rescoring/match matchScorer to use in an expression built
     * on "_score"
     * @return this builder
     */
    public Builder setMatchScorer(MatchScorer matchScorer) {
      this.matchScorer = matchScorer;
      return this;
    }

    /**
     * Sets the matchScorer to the {@link MatchScorer} built from the builder.
     *
     * @see {@link #setMatchScorer(MatchScorer)}
     * @param builder a builder of a MatchScorer
     * @return this builder
     */
    public Builder setMatchScorer(MatchScorer.Builder builder) {
      this.matchScorer = builder.build();
      return this;
    }

    /**
     * Sets the matchScorer to the {@link RescoringMatchScorer} built from the
     * builder.
     *
     * @see {@link #setMatchScorer(MatchScorer)}
     * @param builder a builder of a RescoringMatchScorer
     * @return this builder
     */
    public Builder setMatchScorer(RescoringMatchScorer.Builder builder) {
      this.matchScorer = builder.build();
      return this;
    }

    /**
     * Adds a {@link SortExpression} to the list of sort expressions.
     *
     * @param sortExpression an expression to sort documents by
     * @return this Builder
     */
    public Builder addSortExpression(SortExpression sortExpression) {
      this.sortExpressions.add(Preconditions.checkNotNull(sortExpression,
          "sort expression cannot be null"));
      return this;
    }

    /**
     * Adds a {@link SortExpression} built from the builder to the list of sort
     * expressions.
     *
     * @param builder a builder of SortExpression to sort documents by
     * @return this Builder
     */
    public Builder addSortExpression(SortExpression.Builder builder) {
      Preconditions.checkNotNull(builder, "sort expression builder cannot be null");
      this.sortExpressions.add(builder.build());
      return this;
    }

    /**
     * Builds a {@link SortOptions} from the set values.
     *
     * @return a {@link SortOptions} built from the set values
     */
    public SortOptions build() {
      return new SortOptions(this);
    }
  }

  private final List<SortExpression> sortExpressions;
 private final MatchScorer matchScorer; private final int limit;

  /**
   * Constructs a text sort specification using the values from the
   * {@link Builder}.
   */
  private SortOptions(Builder builder) {
    matchScorer = builder.matchScorer;
    limit = Util.defaultIfNull(builder.limit, SearchApiLimits.SEARCH_DEFAULT_SORTED_LIMIT);
    sortExpressions = new ArrayList<SortExpression>(builder.sortExpressions);
  }

  /**
   * @return a list of sort expressions representing a multi-dimensional sort
   */
  public List<SortExpression> getSortExpressions() {
    return Collections.unmodifiableList(sortExpressions);
  }

  /**
   * @return a {@link MatchScorer} used to score the documents
   */
  public MatchScorer getMatchScorer() {
    return matchScorer;
  }

  /**
   * @return the limit on the number of documents to score or sort
   */
  public int getLimit() {
    return limit;
  }

  /**
   * Creates and returns a SortOptions Builder.
   *
   * @return a new {@link SortOptions.Builder}. Set the parameters for
   * SortOptions on the Builder, and use the {@link Builder#build()} method
   * to create a concrete instance of SortOptions
   */
  public static Builder newBuilder() {
    return new Builder();
  }

  public SearchParams.Builder copyToProtocolBuffer(SearchParams.Builder builder) {
    SearchServicePb.ScorerSpec.Builder scorerSpecBuilder = null;
    if (matchScorer != null) {
      scorerSpecBuilder = matchScorer.copyToScorerSpecProtocolBuffer();
    } else {
      scorerSpecBuilder = SearchServicePb.ScorerSpec.newBuilder();
    }
    scorerSpecBuilder.setLimit(limit);
    builder.setScorerSpec(scorerSpecBuilder);
    for (SortExpression expression : sortExpressions) {
      builder.addSortSpec(expression.copyToProtocolBuffer());
    }
    return builder;
  }

  @Override
  public String toString() {
    return String.format("SortOptions(limit=%d, matchScorer=%s, sortExpressions=%s)",
        limit,
        matchScorer,
        sortExpressions);
  }
}

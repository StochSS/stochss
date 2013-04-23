// Copyright 2012 Google Inc. All Rights Reserved.

package com.google.appengine.api.search;

/**
 * Assigns a document score based on term frequency.
 *
 * If you add a MatchScorer to a SortOptions as in the following code:
 * <pre>
 *  SortOptions sortOptions = SortOptions.newBuilder()
 *      .setMatchScorer(MatchScorer.newBuilder())
 *      .build();
 * </pre>
 * then this will sort the documents in descending score order. The scores
 * will be positive. If you want to sort in ascending order, then use the
 * following code:
 * <pre>
 *   SortOptions sortOptions = SortOptions.newBuilder()
 *       .setMatchScorer(MatchScorer.newBuilder())
 *       .addSortExpression(
 *           SortExpression.newBuilder()
 *               .setExpression(SortExpression.SCORE_FIELD_NAME)
 *               .setDirection(SortExpression.SortDirection.ASCENDING)
 *               .setDefaultValueNumeric(0.0))
 *       .build();
 * </pre>
 * The scores in this case will be negative.
 *
 */
public class MatchScorer {

  /**
   * A builder that constructs {@link MatchScorer MatchScorers}.
   * A MatchScorer will invoke a scorer on each search result. The
   * following code illustrates building a match scorer to score documents:
   * <p>
   * <pre>
   *   MatchScorer scorer = MatchScorer.newBuilder().build();
   * </pre>
   */
  public static class Builder {

    Builder() {
    }

    /**
     * Builds a {@link MatchScorer} from the set values.
     *
     * @return a {@link MatchScorer} built from the set values
     */
    public MatchScorer build() {
      return new MatchScorer(this);
    }
  }

  /**
   * Constructs a text sort specification using the values from the
   * {@link Builder}.
   */
  MatchScorer(Builder builder) {
  }

  /**
   * Copies the contents of the MatchScorer into a scorer
   * spec protocol buffer.
   *
   * @return the protocol buffer builder with the contents of the MatchScorer
   * scoring information
   */
  SearchServicePb.ScorerSpec.Builder copyToScorerSpecProtocolBuffer() {
    SearchServicePb.ScorerSpec.Builder builder = SearchServicePb.ScorerSpec.newBuilder();
    builder.setScorer(SearchServicePb.ScorerSpec.Scorer.MATCH_SCORER);
    return builder;
  }

  /**
   * Creates and returns a MatchScorer Builder.
   *
   * @return a new {@link MatchScorer.Builder}. Set the parameters for scorer
   * on the Builder, and use the {@link Builder#build()} method
   * to create a concrete instance of MatchScorer
   */
  public static Builder newBuilder() {
    return new Builder();
  }

  @Override
  public String toString() {
    return "MatchScorer()";
  }
}

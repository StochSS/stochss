// Copyright 2011 Google Inc. All Rights Reserved.

package com.google.appengine.api.search;

import com.google.appengine.api.search.checkers.FieldChecker;

/**
 * Represents an expression bound to a returned Field with the given
 * name. FieldExpressions are added to a {@link QueryOptions}, to request an
 * expression computed and returned as the named Field value. For example,
 * <pre>
 *   FieldExpression.newBuilder()
 *       .setName("snippet")
 *       .setExpression("snippet(\"good story\", content)")
 *       .build()
 * </pre>
 * binds a snippet expression to a Field named "snippet", which will
 * be returned in each search result. In this case the returned "snippet"
 * Field will contain a HTML value containing text snippets of the
 * "content" field matching the query "good story".
 *
 */
public class FieldExpression {

  /**
   * A field expression builder. A name and expression must be
   * supplied.
   */
  public static final class Builder {
    private String name;
    private String expression;

    /**
     * Sets the name of the expression. The name must be a valid
     * field name.
     *
     * @param name the name of the expression
     * @return this Builder
     * @throws IllegalArgumentException if name is not a valid field name
     */
    public Builder setName(String name) {
      this.name = FieldChecker.checkFieldName(name);
      return this;
    }

    /**
     * Sets the expression to evaluate to return in {@link ScoredDocument}.
     *
     * @param expression an expression to evaluate and return
     * in a {@link ScoredDocument} field
     * @return this Builder
     * @throws IllegalArgumentException if the expression is not valid
     */
    public Builder setExpression(String expression) {
      this.expression = FieldChecker.checkExpression(expression);
      return this;
    }

    /**
     * Builds the FieldExpression. An expression and name for the expression
     * must be given.
     *
     * @return the built FieldExpression
     * @throws IllegalArgumentException if the name is not a valid field name
     */
    public FieldExpression build() {
      return new FieldExpression(this);
    }
  }

  private final String name;
  private final String expression;

  /**
   * Constructs a FieldExpression from a Builder.
   *
   * @param builder the builder to set field expression attributes from
   * @throws IllegalArgumentException if the name is not a valid field name
   */
  private FieldExpression(Builder builder) {
    name = FieldChecker.checkFieldName(builder.name);
    expression = builder.expression;
  }

  /**
   * @return the name of the expression
   */
  public String getName() {
    return name;
  }

  /**
   * @return the expression string used to create a field
   */
  public String getExpression() {
    return expression;
  }

  /**
   * @return returns a new FieldExpression builder.
   */
  public static Builder newBuilder() {
    return new Builder();
  }

  /**
   * Copies the attributes of this FieldExpression into a protocol buffer
   * FieldSpec.Expression builder.
   *
   * @return the field expression protocol buffer builder initialized from
   * this field expression
   */
  SearchServicePb.FieldSpec.Expression.Builder copyToProtocolBuffer() {
    SearchServicePb.FieldSpec.Expression.Builder builder =
      SearchServicePb.FieldSpec.Expression.newBuilder();
    builder.setName(getName());
    builder.setExpression(getExpression());
    return builder;
  }

  @Override
  public String toString() {
    return String.format("FieldExpression(name=%s, expression=%s)", name, expression);
  }
}

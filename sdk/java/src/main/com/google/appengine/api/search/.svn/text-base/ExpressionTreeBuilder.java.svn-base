// Copyright 2011 Google Inc. All Rights Reserved.

package com.google.appengine.api.search;

import com.google.apphosting.api.AppEngineInternal;

import org.antlr.runtime.ANTLRStringStream;
import org.antlr.runtime.RecognitionException;
import org.antlr.runtime.TokenRewriteStream;
import org.antlr.runtime.tree.CommonTree;
import org.antlr.runtime.tree.CommonTreeAdaptor;

/**
 * A generator of AST representation of an expression. This class can use an
 * optionally supplied CommonTreeAdaptor to process the tree further.
 * If successful it returns the root of an AST representing the parsed query.
 *
 */
@AppEngineInternal
public class ExpressionTreeBuilder {
  private final CommonTreeAdaptor adaptor;

  public ExpressionTreeBuilder() {
    this(new CommonTreeAdaptor());
  }

  public ExpressionTreeBuilder(CommonTreeAdaptor adaptor) {
    this.adaptor = adaptor;
  }

  /**
   * Parses the user expression and returns a {@link CommonTree}.
   *
   * @param expression the expression to parse
   * @return a CommonTree constructed from the expression
   * @throws RecognitionException if the user expression is invalid
   */
  public CommonTree parse(String expression) throws RecognitionException {
    ANTLRStringStream stream = new ANTLRStringStream(expression);
    ExpressionLexer lexer = new ExpressionLexer(stream);
    TokenRewriteStream tokens = new TokenRewriteStream(lexer);
    ExpressionParser parser = new ExpressionParser(tokens);
    parser.setTreeAdaptor(adaptor);
    return (CommonTree) parser.expression().getTree();
  }
}

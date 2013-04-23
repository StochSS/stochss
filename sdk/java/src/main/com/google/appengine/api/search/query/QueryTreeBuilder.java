// Copyright 2011 Google Inc. All Rights Reserved.

package com.google.appengine.api.search.query;

import org.antlr.runtime.ANTLRStringStream;
import org.antlr.runtime.RecognitionException;
import org.antlr.runtime.TokenRewriteStream;
import org.antlr.runtime.tree.CommonTree;
import org.antlr.runtime.tree.CommonTreeAdaptor;

/**
 * A generator of AST representation of a query. This class uses the given factory
 * to produce a query parser which parses user specified query. If successful it
 * returns the root of an AST representing the parsed query.
 *
 */
public class QueryTreeBuilder {

  private static final ThreadLocal<QueryLexer> LEXER_POOL = new ThreadLocal<QueryLexer>() {
    @Override
    protected QueryLexer initialValue() {
      return new QueryLexer();
    }
  };

  private final QueryParserFactory parserFactory;
  private final CommonTreeAdaptor adaptor = new CommonTreeAdaptor();

  public QueryTreeBuilder() {
    this.parserFactory = new QueryParserFactory();
  }

  public QueryTreeBuilder(QueryParserFactory parserFactory) {
    this.parserFactory = parserFactory;
  }

  /**
   * Parses the user query and returns a CommonTree.
   *
   * @param query the user query to be parsed
   * @return a CommonTree constructed from the query
   * @throws RecognitionException if the user query is invalid
   * @throws NullPointerException if query is null
   */
  public CommonTree parse(String query) throws RecognitionException {
    if (query == null) {
      throw new NullPointerException("query must not be null");
    }
    String trimmed = query.trim();
    if (trimmed.isEmpty()) {
      return (CommonTree) adaptor.nil();
    }
    ANTLRStringStream stream = new ANTLRStringStream(query);
    QueryLexer lexer = LEXER_POOL.get();
    lexer.setCharStream(stream);
    TokenRewriteStream tokens = new TokenRewriteStream(lexer);
    QueryParser parser = parserFactory.newParser(tokens);
    return (CommonTree) parser.query().getTree();
  }
}

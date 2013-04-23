// Copyright 2011 Google Inc. All Rights Reserved.

package com.google.appengine.api.search.query;

import org.antlr.runtime.BitSet;
import org.antlr.runtime.IntStream;
import org.antlr.runtime.MismatchedTokenException;
import org.antlr.runtime.RecognitionException;
import org.antlr.runtime.TokenRewriteStream;

/**
 * A factory which produces {@link QueryParser QueryParsers} for a given
 * token rewrite stream.
 *
 */
public class QueryParserFactory {

  private static class NonRecoveringParser extends QueryParser {

    public NonRecoveringParser() {
      super(null);
    }

    @Override
    public Object recoverFromMismatchedSet(IntStream input,
        RecognitionException e, BitSet follow) throws RecognitionException {
      throw e;
    }

    @Override
    protected Object recoverFromMismatchedToken(IntStream input, int ttype, BitSet follow)
        throws RecognitionException {
      throw new MismatchedTokenException(ttype, input);
    }
  }

  private static final ThreadLocal<NonRecoveringParser> PARSER_POOL =
      new ThreadLocal<NonRecoveringParser>() {
        @Override
        protected NonRecoveringParser initialValue() {
          return new NonRecoveringParser();
        }
      };

  public QueryParser newParser(TokenRewriteStream tokens) {
    NonRecoveringParser parser = PARSER_POOL.get();
    parser.setTokenStream(tokens);
    return parser;
  }
}

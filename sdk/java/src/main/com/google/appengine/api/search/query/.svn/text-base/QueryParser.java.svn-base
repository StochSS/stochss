

  package com.google.appengine.api.search.query;

import org.antlr.runtime.*;

import org.antlr.runtime.tree.*;

public class QueryParser extends Parser {
    public static final String[] tokenNames = new String[] {
        "<invalid>", "<EOR>", "<DOWN>", "<UP>", "ARGS", "CONJUNCTION", "DISJUNCTION", "FUNCTION", "FUZZY", "GLOBAL", "LITERAL", "NEGATION", "STRING", "SEQUENCE", "VALUE", "WS", "LE", "LT", "GE", "GT", "NE", "EQ", "HAS", "LPAREN", "RPAREN", "AND", "OR", "NOT", "DISTANCE_FN", "GEO_POINT_FN", "FIX", "REWRITE", "TEXT", "QUOTE", "ESC", "UNICODE_ESC", "OCTAL_ESC", "CHAR_SEQ", "DIGIT", "MID_CHAR", "ESCAPED_CHAR", "START_CHAR", "HEX_DIGIT", "'-'", "','", "'\\\\'"
    };
    public static final int FUNCTION=7;
    public static final int LT=17;
    public static final int GEO_POINT_FN=29;
    public static final int FIX=30;
    public static final int ESC=34;
    public static final int FUZZY=8;
    public static final int OCTAL_ESC=36;
    public static final int NOT=27;
    public static final int AND=25;
    public static final int DISTANCE_FN=28;
    public static final int EOF=-1;
    public static final int ESCAPED_CHAR=40;
    public static final int LPAREN=23;
    public static final int HAS=22;
    public static final int RPAREN=24;
    public static final int QUOTE=33;
    public static final int CHAR_SEQ=37;
    public static final int START_CHAR=41;
    public static final int ARGS=4;
    public static final int DIGIT=38;
    public static final int EQ=21;
    public static final int NE=20;
    public static final int T__43=43;
    public static final int GE=18;
    public static final int T__44=44;
    public static final int T__45=45;
    public static final int CONJUNCTION=5;
    public static final int UNICODE_ESC=35;
    public static final int HEX_DIGIT=42;
    public static final int LITERAL=10;
    public static final int VALUE=14;
    public static final int TEXT=32;
    public static final int REWRITE=31;
    public static final int SEQUENCE=13;
    public static final int DISJUNCTION=6;
    public static final int WS=15;
    public static final int NEGATION=11;
    public static final int OR=26;
    public static final int GT=19;
    public static final int GLOBAL=9;
    public static final int LE=16;
    public static final int MID_CHAR=39;
    public static final int STRING=12;

        public QueryParser(TokenStream input) {
            this(input, new RecognizerSharedState());
        }
        public QueryParser(TokenStream input, RecognizerSharedState state) {
            super(input, state);

        }

    protected TreeAdaptor adaptor = new CommonTreeAdaptor();

    public void setTreeAdaptor(TreeAdaptor adaptor) {
        this.adaptor = adaptor;
    }
    public TreeAdaptor getTreeAdaptor() {
        return adaptor;
    }

    public String[] getTokenNames() { return QueryParser.tokenNames; }
    public String getGrammarFileName() { return ""; }

    public static class query_return extends ParserRuleReturnScope {
        CommonTree tree;
        public Object getTree() { return tree; }
    };

    public final QueryParser.query_return query() throws RecognitionException {
        QueryParser.query_return retval = new QueryParser.query_return();
        retval.start = input.LT(1);

        CommonTree root_0 = null;

        Token WS1=null;
        Token WS3=null;
        Token EOF4=null;
        QueryParser.expression_return expression2 = null;

        CommonTree WS1_tree=null;
        CommonTree WS3_tree=null;
        CommonTree EOF4_tree=null;
        RewriteRuleTokenStream stream_WS=new RewriteRuleTokenStream(adaptor,"token WS");
        RewriteRuleTokenStream stream_EOF=new RewriteRuleTokenStream(adaptor,"token EOF");
        RewriteRuleSubtreeStream stream_expression=new RewriteRuleSubtreeStream(adaptor,"rule expression");
        try {
            {
            loop1:
            do {
                int alt1=2;
                int LA1_0 = input.LA(1);

                if ( (LA1_0==WS) ) {
                    alt1=1;
                }

                switch (alt1) {
            	case 1 :
            	    {
            	    WS1=(Token)match(input,WS,FOLLOW_WS_in_query128);
            	    stream_WS.add(WS1);

            	    }
            	    break;

            	default :
            	    break loop1;
                }
            } while (true);

            pushFollow(FOLLOW_expression_in_query131);
            expression2=expression();

            state._fsp--;

            stream_expression.add(expression2.getTree());
            loop2:
            do {
                int alt2=2;
                int LA2_0 = input.LA(1);

                if ( (LA2_0==WS) ) {
                    alt2=1;
                }

                switch (alt2) {
            	case 1 :
            	    {
            	    WS3=(Token)match(input,WS,FOLLOW_WS_in_query133);
            	    stream_WS.add(WS3);

            	    }
            	    break;

            	default :
            	    break loop2;
                }
            } while (true);

            EOF4=(Token)match(input,EOF,FOLLOW_EOF_in_query136);
            stream_EOF.add(EOF4);

            retval.tree = root_0;
            RewriteRuleSubtreeStream stream_retval=new RewriteRuleSubtreeStream(adaptor,"rule retval",retval!=null?retval.tree:null);

            root_0 = (CommonTree)adaptor.nil();
            {
                adaptor.addChild(root_0, stream_expression.nextTree());

            }

            retval.tree = root_0;
            }

            retval.stop = input.LT(-1);

            retval.tree = (CommonTree)adaptor.rulePostProcessing(root_0);
            adaptor.setTokenBoundaries(retval.tree, retval.start, retval.stop);

        }

          catch (RecognitionException e) {
            reportError(e);
            throw e;
          }
        finally {
        }
        return retval;
    }

    public static class expression_return extends ParserRuleReturnScope {
        CommonTree tree;
        public Object getTree() { return tree; }
    };

    public final QueryParser.expression_return expression() throws RecognitionException {
        QueryParser.expression_return retval = new QueryParser.expression_return();
        retval.start = input.LT(1);

        CommonTree root_0 = null;

        QueryParser.sequence_return sequence5 = null;

        QueryParser.andOp_return andOp6 = null;

        QueryParser.sequence_return sequence7 = null;

        RewriteRuleSubtreeStream stream_sequence=new RewriteRuleSubtreeStream(adaptor,"rule sequence");
        RewriteRuleSubtreeStream stream_andOp=new RewriteRuleSubtreeStream(adaptor,"rule andOp");
        try {
            {
            pushFollow(FOLLOW_sequence_in_expression155);
            sequence5=sequence();

            state._fsp--;

            stream_sequence.add(sequence5.getTree());
            loop3:
            do {
                int alt3=2;
                alt3 = dfa3.predict(input);
                switch (alt3) {
            	case 1 :
            	    {
            	    pushFollow(FOLLOW_andOp_in_expression158);
            	    andOp6=andOp();

            	    state._fsp--;

            	    stream_andOp.add(andOp6.getTree());
            	    pushFollow(FOLLOW_sequence_in_expression160);
            	    sequence7=sequence();

            	    state._fsp--;

            	    stream_sequence.add(sequence7.getTree());

            	    }
            	    break;

            	default :
            	    break loop3;
                }
            } while (true);

            retval.tree = root_0;
            RewriteRuleSubtreeStream stream_retval=new RewriteRuleSubtreeStream(adaptor,"rule retval",retval!=null?retval.tree:null);

            root_0 = (CommonTree)adaptor.nil();
            {
                {
                CommonTree root_1 = (CommonTree)adaptor.nil();
                root_1 = (CommonTree)adaptor.becomeRoot((CommonTree)adaptor.create(CONJUNCTION, "CONJUNCTION"), root_1);

                if ( !(stream_sequence.hasNext()) ) {
                    throw new RewriteEarlyExitException();
                }
                while ( stream_sequence.hasNext() ) {
                    adaptor.addChild(root_1, stream_sequence.nextTree());

                }
                stream_sequence.reset();

                adaptor.addChild(root_0, root_1);
                }

            }

            retval.tree = root_0;
            }

            retval.stop = input.LT(-1);

            retval.tree = (CommonTree)adaptor.rulePostProcessing(root_0);
            adaptor.setTokenBoundaries(retval.tree, retval.start, retval.stop);

        }

          catch (RecognitionException e) {
            reportError(e);
            throw e;
          }
        finally {
        }
        return retval;
    }

    public static class sequence_return extends ParserRuleReturnScope {
        CommonTree tree;
        public Object getTree() { return tree; }
    };

    public final QueryParser.sequence_return sequence() throws RecognitionException {
        QueryParser.sequence_return retval = new QueryParser.sequence_return();
        retval.start = input.LT(1);

        CommonTree root_0 = null;

        Token WS9=null;
        QueryParser.factor_return factor8 = null;

        QueryParser.factor_return factor10 = null;

        CommonTree WS9_tree=null;
        RewriteRuleTokenStream stream_WS=new RewriteRuleTokenStream(adaptor,"token WS");
        RewriteRuleSubtreeStream stream_factor=new RewriteRuleSubtreeStream(adaptor,"rule factor");
        try {
            {
            pushFollow(FOLLOW_factor_in_sequence186);
            factor8=factor();

            state._fsp--;

            stream_factor.add(factor8.getTree());
            loop5:
            do {
                int alt5=2;
                alt5 = dfa5.predict(input);
                switch (alt5) {
            	case 1 :
            	    {
            	    int cnt4=0;
            	    loop4:
            	    do {
            	        int alt4=2;
            	        int LA4_0 = input.LA(1);

            	        if ( (LA4_0==WS) ) {
            	            alt4=1;
            	        }

            	        switch (alt4) {
            	    	case 1 :
            	    	    {
            	    	    WS9=(Token)match(input,WS,FOLLOW_WS_in_sequence189);
            	    	    stream_WS.add(WS9);

            	    	    }
            	    	    break;

            	    	default :
            	    	    if ( cnt4 >= 1 ) break loop4;
            	                EarlyExitException eee =
            	                    new EarlyExitException(4, input);
            	                throw eee;
            	        }
            	        cnt4++;
            	    } while (true);

            	    pushFollow(FOLLOW_factor_in_sequence192);
            	    factor10=factor();

            	    state._fsp--;

            	    stream_factor.add(factor10.getTree());

            	    }
            	    break;

            	default :
            	    break loop5;
                }
            } while (true);

            retval.tree = root_0;
            RewriteRuleSubtreeStream stream_retval=new RewriteRuleSubtreeStream(adaptor,"rule retval",retval!=null?retval.tree:null);

            root_0 = (CommonTree)adaptor.nil();
            {
                {
                CommonTree root_1 = (CommonTree)adaptor.nil();
                root_1 = (CommonTree)adaptor.becomeRoot((CommonTree)adaptor.create(SEQUENCE, "SEQUENCE"), root_1);

                if ( !(stream_factor.hasNext()) ) {
                    throw new RewriteEarlyExitException();
                }
                while ( stream_factor.hasNext() ) {
                    adaptor.addChild(root_1, stream_factor.nextTree());

                }
                stream_factor.reset();

                adaptor.addChild(root_0, root_1);
                }

            }

            retval.tree = root_0;
            }

            retval.stop = input.LT(-1);

            retval.tree = (CommonTree)adaptor.rulePostProcessing(root_0);
            adaptor.setTokenBoundaries(retval.tree, retval.start, retval.stop);

        }

          catch (RecognitionException e) {
            reportError(e);
            throw e;
          }
        finally {
        }
        return retval;
    }

    public static class factor_return extends ParserRuleReturnScope {
        CommonTree tree;
        public Object getTree() { return tree; }
    };

    public final QueryParser.factor_return factor() throws RecognitionException {
        QueryParser.factor_return retval = new QueryParser.factor_return();
        retval.start = input.LT(1);

        CommonTree root_0 = null;

        QueryParser.term_return term11 = null;

        QueryParser.orOp_return orOp12 = null;

        QueryParser.term_return term13 = null;

        RewriteRuleSubtreeStream stream_orOp=new RewriteRuleSubtreeStream(adaptor,"rule orOp");
        RewriteRuleSubtreeStream stream_term=new RewriteRuleSubtreeStream(adaptor,"rule term");
        try {
            {
            pushFollow(FOLLOW_term_in_factor218);
            term11=term();

            state._fsp--;

            stream_term.add(term11.getTree());
            loop6:
            do {
                int alt6=2;
                alt6 = dfa6.predict(input);
                switch (alt6) {
            	case 1 :
            	    {
            	    pushFollow(FOLLOW_orOp_in_factor221);
            	    orOp12=orOp();

            	    state._fsp--;

            	    stream_orOp.add(orOp12.getTree());
            	    pushFollow(FOLLOW_term_in_factor223);
            	    term13=term();

            	    state._fsp--;

            	    stream_term.add(term13.getTree());

            	    }
            	    break;

            	default :
            	    break loop6;
                }
            } while (true);

            retval.tree = root_0;
            RewriteRuleSubtreeStream stream_retval=new RewriteRuleSubtreeStream(adaptor,"rule retval",retval!=null?retval.tree:null);

            root_0 = (CommonTree)adaptor.nil();
            {
                {
                CommonTree root_1 = (CommonTree)adaptor.nil();
                root_1 = (CommonTree)adaptor.becomeRoot((CommonTree)adaptor.create(DISJUNCTION, "DISJUNCTION"), root_1);

                if ( !(stream_term.hasNext()) ) {
                    throw new RewriteEarlyExitException();
                }
                while ( stream_term.hasNext() ) {
                    adaptor.addChild(root_1, stream_term.nextTree());

                }
                stream_term.reset();

                adaptor.addChild(root_0, root_1);
                }

            }

            retval.tree = root_0;
            }

            retval.stop = input.LT(-1);

            retval.tree = (CommonTree)adaptor.rulePostProcessing(root_0);
            adaptor.setTokenBoundaries(retval.tree, retval.start, retval.stop);

        }

          catch (RecognitionException e) {
            reportError(e);
            throw e;
          }
        finally {
        }
        return retval;
    }

    public static class term_return extends ParserRuleReturnScope {
        CommonTree tree;
        public Object getTree() { return tree; }
    };

    public final QueryParser.term_return term() throws RecognitionException {
        QueryParser.term_return retval = new QueryParser.term_return();
        retval.start = input.LT(1);

        CommonTree root_0 = null;

        QueryParser.notOp_return notOp14 = null;

        QueryParser.primitive_return primitive15 = null;

        QueryParser.primitive_return primitive16 = null;

        RewriteRuleSubtreeStream stream_notOp=new RewriteRuleSubtreeStream(adaptor,"rule notOp");
        RewriteRuleSubtreeStream stream_primitive=new RewriteRuleSubtreeStream(adaptor,"rule primitive");
        try {
            int alt7=2;
            int LA7_0 = input.LA(1);

            if ( (LA7_0==NOT||LA7_0==43) ) {
                alt7=1;
            }
            else if ( (LA7_0==LPAREN||(LA7_0>=DISTANCE_FN && LA7_0<=QUOTE)) ) {
                alt7=2;
            }
            else {
                NoViableAltException nvae =
                    new NoViableAltException("", 7, 0, input);

                throw nvae;
            }
            switch (alt7) {
                case 1 :
                    {
                    pushFollow(FOLLOW_notOp_in_term247);
                    notOp14=notOp();

                    state._fsp--;

                    stream_notOp.add(notOp14.getTree());
                    pushFollow(FOLLOW_primitive_in_term249);
                    primitive15=primitive();

                    state._fsp--;

                    stream_primitive.add(primitive15.getTree());

                    retval.tree = root_0;
                    RewriteRuleSubtreeStream stream_retval=new RewriteRuleSubtreeStream(adaptor,"rule retval",retval!=null?retval.tree:null);

                    root_0 = (CommonTree)adaptor.nil();
                    {
                        {
                        CommonTree root_1 = (CommonTree)adaptor.nil();
                        root_1 = (CommonTree)adaptor.becomeRoot((CommonTree)adaptor.create(NEGATION, "NEGATION"), root_1);

                        adaptor.addChild(root_1, stream_primitive.nextTree());

                        adaptor.addChild(root_0, root_1);
                        }

                    }

                    retval.tree = root_0;
                    }
                    break;
                case 2 :
                    {
                    root_0 = (CommonTree)adaptor.nil();

                    pushFollow(FOLLOW_primitive_in_term263);
                    primitive16=primitive();

                    state._fsp--;

                    adaptor.addChild(root_0, primitive16.getTree());

                    }
                    break;

            }
            retval.stop = input.LT(-1);

            retval.tree = (CommonTree)adaptor.rulePostProcessing(root_0);
            adaptor.setTokenBoundaries(retval.tree, retval.start, retval.stop);

        }

          catch (RecognitionException e) {
            reportError(e);
            throw e;
          }
        finally {
        }
        return retval;
    }

    public static class primitive_return extends ParserRuleReturnScope {
        CommonTree tree;
        public Object getTree() { return tree; }
    };

    public final QueryParser.primitive_return primitive() throws RecognitionException {
        QueryParser.primitive_return retval = new QueryParser.primitive_return();
        retval.start = input.LT(1);

        CommonTree root_0 = null;

        QueryParser.restrict_return restrict17 = null;

        QueryParser.composite_return composite18 = null;

        QueryParser.item_return item19 = null;

        RewriteRuleSubtreeStream stream_item=new RewriteRuleSubtreeStream(adaptor,"rule item");
        try {
            int alt8=3;
            alt8 = dfa8.predict(input);
            switch (alt8) {
                case 1 :
                    {
                    root_0 = (CommonTree)adaptor.nil();

                    pushFollow(FOLLOW_restrict_in_primitive279);
                    restrict17=restrict();

                    state._fsp--;

                    adaptor.addChild(root_0, restrict17.getTree());

                    }
                    break;
                case 2 :
                    {
                    root_0 = (CommonTree)adaptor.nil();

                    pushFollow(FOLLOW_composite_in_primitive285);
                    composite18=composite();

                    state._fsp--;

                    adaptor.addChild(root_0, composite18.getTree());

                    }
                    break;
                case 3 :
                    {
                    pushFollow(FOLLOW_item_in_primitive291);
                    item19=item();

                    state._fsp--;

                    stream_item.add(item19.getTree());

                    retval.tree = root_0;
                    RewriteRuleSubtreeStream stream_retval=new RewriteRuleSubtreeStream(adaptor,"rule retval",retval!=null?retval.tree:null);

                    root_0 = (CommonTree)adaptor.nil();
                    {
                        {
                        CommonTree root_1 = (CommonTree)adaptor.nil();
                        root_1 = (CommonTree)adaptor.becomeRoot((CommonTree)adaptor.create(HAS, "HAS"), root_1);

                        adaptor.addChild(root_1, (CommonTree)adaptor.create(GLOBAL, "GLOBAL"));
                        adaptor.addChild(root_1, stream_item.nextTree());

                        adaptor.addChild(root_0, root_1);
                        }

                    }

                    retval.tree = root_0;
                    }
                    break;

            }
            retval.stop = input.LT(-1);

            retval.tree = (CommonTree)adaptor.rulePostProcessing(root_0);
            adaptor.setTokenBoundaries(retval.tree, retval.start, retval.stop);

        }

          catch (RecognitionException e) {
            reportError(e);
            throw e;
          }
        finally {
        }
        return retval;
    }

    public static class restrict_return extends ParserRuleReturnScope {
        CommonTree tree;
        public Object getTree() { return tree; }
    };

    public final QueryParser.restrict_return restrict() throws RecognitionException {
        QueryParser.restrict_return retval = new QueryParser.restrict_return();
        retval.start = input.LT(1);

        CommonTree root_0 = null;

        QueryParser.comparable_return comparable20 = null;

        QueryParser.comparator_return comparator21 = null;

        QueryParser.arg_return arg22 = null;

        RewriteRuleSubtreeStream stream_arg=new RewriteRuleSubtreeStream(adaptor,"rule arg");
        RewriteRuleSubtreeStream stream_comparable=new RewriteRuleSubtreeStream(adaptor,"rule comparable");
        RewriteRuleSubtreeStream stream_comparator=new RewriteRuleSubtreeStream(adaptor,"rule comparator");
        try {
            {
            pushFollow(FOLLOW_comparable_in_restrict317);
            comparable20=comparable();

            state._fsp--;

            stream_comparable.add(comparable20.getTree());
            pushFollow(FOLLOW_comparator_in_restrict319);
            comparator21=comparator();

            state._fsp--;

            stream_comparator.add(comparator21.getTree());
            pushFollow(FOLLOW_arg_in_restrict321);
            arg22=arg();

            state._fsp--;

            stream_arg.add(arg22.getTree());

            retval.tree = root_0;
            RewriteRuleSubtreeStream stream_retval=new RewriteRuleSubtreeStream(adaptor,"rule retval",retval!=null?retval.tree:null);

            root_0 = (CommonTree)adaptor.nil();
            {
                {
                CommonTree root_1 = (CommonTree)adaptor.nil();
                root_1 = (CommonTree)adaptor.becomeRoot(stream_comparator.nextNode(), root_1);

                adaptor.addChild(root_1, stream_comparable.nextTree());
                adaptor.addChild(root_1, stream_arg.nextTree());

                adaptor.addChild(root_0, root_1);
                }

            }

            retval.tree = root_0;
            }

            retval.stop = input.LT(-1);

            retval.tree = (CommonTree)adaptor.rulePostProcessing(root_0);
            adaptor.setTokenBoundaries(retval.tree, retval.start, retval.stop);

        }

          catch (RecognitionException e) {
            reportError(e);
            throw e;
          }
        finally {
        }
        return retval;
    }

    public static class comparator_return extends ParserRuleReturnScope {
        CommonTree tree;
        public Object getTree() { return tree; }
    };

    public final QueryParser.comparator_return comparator() throws RecognitionException {
        QueryParser.comparator_return retval = new QueryParser.comparator_return();
        retval.start = input.LT(1);

        CommonTree root_0 = null;

        Token x=null;
        Token WS23=null;
        Token WS24=null;

        CommonTree x_tree=null;
        CommonTree WS23_tree=null;
        CommonTree WS24_tree=null;
        RewriteRuleTokenStream stream_HAS=new RewriteRuleTokenStream(adaptor,"token HAS");
        RewriteRuleTokenStream stream_GE=new RewriteRuleTokenStream(adaptor,"token GE");
        RewriteRuleTokenStream stream_GT=new RewriteRuleTokenStream(adaptor,"token GT");
        RewriteRuleTokenStream stream_LT=new RewriteRuleTokenStream(adaptor,"token LT");
        RewriteRuleTokenStream stream_WS=new RewriteRuleTokenStream(adaptor,"token WS");
        RewriteRuleTokenStream stream_EQ=new RewriteRuleTokenStream(adaptor,"token EQ");
        RewriteRuleTokenStream stream_LE=new RewriteRuleTokenStream(adaptor,"token LE");
        RewriteRuleTokenStream stream_NE=new RewriteRuleTokenStream(adaptor,"token NE");

        try {
            {
            loop9:
            do {
                int alt9=2;
                int LA9_0 = input.LA(1);

                if ( (LA9_0==WS) ) {
                    alt9=1;
                }

                switch (alt9) {
            	case 1 :
            	    {
            	    WS23=(Token)match(input,WS,FOLLOW_WS_in_comparator345);
            	    stream_WS.add(WS23);

            	    }
            	    break;

            	default :
            	    break loop9;
                }
            } while (true);

            int alt10=7;
            switch ( input.LA(1) ) {
            case LE:
                {
                alt10=1;
                }
                break;
            case LT:
                {
                alt10=2;
                }
                break;
            case GE:
                {
                alt10=3;
                }
                break;
            case GT:
                {
                alt10=4;
                }
                break;
            case NE:
                {
                alt10=5;
                }
                break;
            case EQ:
                {
                alt10=6;
                }
                break;
            case HAS:
                {
                alt10=7;
                }
                break;
            default:
                NoViableAltException nvae =
                    new NoViableAltException("", 10, 0, input);

                throw nvae;
            }

            switch (alt10) {
                case 1 :
                    {
                    x=(Token)match(input,LE,FOLLOW_LE_in_comparator351);
                    stream_LE.add(x);

                    }
                    break;
                case 2 :
                    {
                    x=(Token)match(input,LT,FOLLOW_LT_in_comparator357);
                    stream_LT.add(x);

                    }
                    break;
                case 3 :
                    {
                    x=(Token)match(input,GE,FOLLOW_GE_in_comparator363);
                    stream_GE.add(x);

                    }
                    break;
                case 4 :
                    {
                    x=(Token)match(input,GT,FOLLOW_GT_in_comparator369);
                    stream_GT.add(x);

                    }
                    break;
                case 5 :
                    {
                    x=(Token)match(input,NE,FOLLOW_NE_in_comparator375);
                    stream_NE.add(x);

                    }
                    break;
                case 6 :
                    {
                    x=(Token)match(input,EQ,FOLLOW_EQ_in_comparator381);
                    stream_EQ.add(x);

                    }
                    break;
                case 7 :
                    {
                    x=(Token)match(input,HAS,FOLLOW_HAS_in_comparator387);
                    stream_HAS.add(x);

                    }
                    break;

            }

            loop11:
            do {
                int alt11=2;
                int LA11_0 = input.LA(1);

                if ( (LA11_0==WS) ) {
                    alt11=1;
                }

                switch (alt11) {
            	case 1 :
            	    {
            	    WS24=(Token)match(input,WS,FOLLOW_WS_in_comparator390);
            	    stream_WS.add(WS24);

            	    }
            	    break;

            	default :
            	    break loop11;
                }
            } while (true);

            retval.tree = root_0;
            RewriteRuleTokenStream stream_x=new RewriteRuleTokenStream(adaptor,"token x",x);
            RewriteRuleSubtreeStream stream_retval=new RewriteRuleSubtreeStream(adaptor,"rule retval",retval!=null?retval.tree:null);

            root_0 = (CommonTree)adaptor.nil();
            {
                adaptor.addChild(root_0, stream_x.nextNode());

            }

            retval.tree = root_0;
            }

            retval.stop = input.LT(-1);

            retval.tree = (CommonTree)adaptor.rulePostProcessing(root_0);
            adaptor.setTokenBoundaries(retval.tree, retval.start, retval.stop);

        }

          catch (RecognitionException e) {
            reportError(e);
            throw e;
          }
        finally {
        }
        return retval;
    }

    public static class comparable_return extends ParserRuleReturnScope {
        CommonTree tree;
        public Object getTree() { return tree; }
    };

    public final QueryParser.comparable_return comparable() throws RecognitionException {
        QueryParser.comparable_return retval = new QueryParser.comparable_return();
        retval.start = input.LT(1);

        CommonTree root_0 = null;

        QueryParser.item_return item25 = null;

        QueryParser.function_return function26 = null;

        try {
            int alt12=2;
            int LA12_0 = input.LA(1);

            if ( ((LA12_0>=FIX && LA12_0<=QUOTE)) ) {
                alt12=1;
            }
            else if ( ((LA12_0>=DISTANCE_FN && LA12_0<=GEO_POINT_FN)) ) {
                int LA12_2 = input.LA(2);

                if ( ((LA12_2>=WS && LA12_2<=HAS)) ) {
                    alt12=1;
                }
                else if ( (LA12_2==LPAREN) ) {
                    alt12=2;
                }
                else {
                    NoViableAltException nvae =
                        new NoViableAltException("", 12, 2, input);

                    throw nvae;
                }
            }
            else {
                NoViableAltException nvae =
                    new NoViableAltException("", 12, 0, input);

                throw nvae;
            }
            switch (alt12) {
                case 1 :
                    {
                    root_0 = (CommonTree)adaptor.nil();

                    pushFollow(FOLLOW_item_in_comparable412);
                    item25=item();

                    state._fsp--;

                    adaptor.addChild(root_0, item25.getTree());

                    }
                    break;
                case 2 :
                    {
                    root_0 = (CommonTree)adaptor.nil();

                    pushFollow(FOLLOW_function_in_comparable418);
                    function26=function();

                    state._fsp--;

                    adaptor.addChild(root_0, function26.getTree());

                    }
                    break;

            }
            retval.stop = input.LT(-1);

            retval.tree = (CommonTree)adaptor.rulePostProcessing(root_0);
            adaptor.setTokenBoundaries(retval.tree, retval.start, retval.stop);

        }

          catch (RecognitionException e) {
            reportError(e);
            throw e;
          }
        finally {
        }
        return retval;
    }

    public static class function_return extends ParserRuleReturnScope {
        CommonTree tree;
        public Object getTree() { return tree; }
    };

    public final QueryParser.function_return function() throws RecognitionException {
        QueryParser.function_return retval = new QueryParser.function_return();
        retval.start = input.LT(1);

        CommonTree root_0 = null;

        Token LPAREN28=null;
        Token RPAREN30=null;
        QueryParser.fnname_return fnname27 = null;

        QueryParser.arglist_return arglist29 = null;

        CommonTree LPAREN28_tree=null;
        CommonTree RPAREN30_tree=null;
        RewriteRuleTokenStream stream_RPAREN=new RewriteRuleTokenStream(adaptor,"token RPAREN");
        RewriteRuleTokenStream stream_LPAREN=new RewriteRuleTokenStream(adaptor,"token LPAREN");
        RewriteRuleSubtreeStream stream_arglist=new RewriteRuleSubtreeStream(adaptor,"rule arglist");
        RewriteRuleSubtreeStream stream_fnname=new RewriteRuleSubtreeStream(adaptor,"rule fnname");
        try {
            {
            pushFollow(FOLLOW_fnname_in_function433);
            fnname27=fnname();

            state._fsp--;

            stream_fnname.add(fnname27.getTree());
            LPAREN28=(Token)match(input,LPAREN,FOLLOW_LPAREN_in_function435);
            stream_LPAREN.add(LPAREN28);

            pushFollow(FOLLOW_arglist_in_function437);
            arglist29=arglist();

            state._fsp--;

            stream_arglist.add(arglist29.getTree());
            RPAREN30=(Token)match(input,RPAREN,FOLLOW_RPAREN_in_function439);
            stream_RPAREN.add(RPAREN30);

            retval.tree = root_0;
            RewriteRuleSubtreeStream stream_retval=new RewriteRuleSubtreeStream(adaptor,"rule retval",retval!=null?retval.tree:null);

            root_0 = (CommonTree)adaptor.nil();
            {
                {
                CommonTree root_1 = (CommonTree)adaptor.nil();
                root_1 = (CommonTree)adaptor.becomeRoot((CommonTree)adaptor.create(FUNCTION, "FUNCTION"), root_1);

                adaptor.addChild(root_1, stream_fnname.nextTree());
                {
                CommonTree root_2 = (CommonTree)adaptor.nil();
                root_2 = (CommonTree)adaptor.becomeRoot((CommonTree)adaptor.create(ARGS, "ARGS"), root_2);

                adaptor.addChild(root_2, stream_arglist.nextTree());

                adaptor.addChild(root_1, root_2);
                }

                adaptor.addChild(root_0, root_1);
                }

            }

            retval.tree = root_0;
            }

            retval.stop = input.LT(-1);

            retval.tree = (CommonTree)adaptor.rulePostProcessing(root_0);
            adaptor.setTokenBoundaries(retval.tree, retval.start, retval.stop);

        }

          catch (RecognitionException e) {
            reportError(e);
            throw e;
          }
        finally {
        }
        return retval;
    }

    public static class arglist_return extends ParserRuleReturnScope {
        CommonTree tree;
        public Object getTree() { return tree; }
    };

    public final QueryParser.arglist_return arglist() throws RecognitionException {
        QueryParser.arglist_return retval = new QueryParser.arglist_return();
        retval.start = input.LT(1);

        CommonTree root_0 = null;

        QueryParser.arg_return arg31 = null;

        QueryParser.sep_return sep32 = null;

        QueryParser.arg_return arg33 = null;

        RewriteRuleSubtreeStream stream_arg=new RewriteRuleSubtreeStream(adaptor,"rule arg");
        RewriteRuleSubtreeStream stream_sep=new RewriteRuleSubtreeStream(adaptor,"rule sep");
        try {
            int alt14=2;
            int LA14_0 = input.LA(1);

            if ( (LA14_0==LPAREN||(LA14_0>=DISTANCE_FN && LA14_0<=QUOTE)) ) {
                alt14=1;
            }
            else if ( (LA14_0==RPAREN) ) {
                alt14=2;
            }
            else {
                NoViableAltException nvae =
                    new NoViableAltException("", 14, 0, input);

                throw nvae;
            }
            switch (alt14) {
                case 1 :
                    {
                    pushFollow(FOLLOW_arg_in_arglist468);
                    arg31=arg();

                    state._fsp--;

                    stream_arg.add(arg31.getTree());
                    loop13:
                    do {
                        int alt13=2;
                        int LA13_0 = input.LA(1);

                        if ( (LA13_0==WS||LA13_0==44) ) {
                            alt13=1;
                        }

                        switch (alt13) {
                    	case 1 :
                    	    {
                    	    pushFollow(FOLLOW_sep_in_arglist471);
                    	    sep32=sep();

                    	    state._fsp--;

                    	    stream_sep.add(sep32.getTree());
                    	    pushFollow(FOLLOW_arg_in_arglist473);
                    	    arg33=arg();

                    	    state._fsp--;

                    	    stream_arg.add(arg33.getTree());

                    	    }
                    	    break;

                    	default :
                    	    break loop13;
                        }
                    } while (true);

                    retval.tree = root_0;
                    RewriteRuleSubtreeStream stream_retval=new RewriteRuleSubtreeStream(adaptor,"rule retval",retval!=null?retval.tree:null);

                    root_0 = (CommonTree)adaptor.nil();
                    {
                        while ( stream_arg.hasNext() ) {
                            adaptor.addChild(root_0, stream_arg.nextTree());

                        }
                        stream_arg.reset();

                    }

                    retval.tree = root_0;
                    }
                    break;
                case 2 :
                    {
                    root_0 = (CommonTree)adaptor.nil();

                    }
                    break;

            }
            retval.stop = input.LT(-1);

            retval.tree = (CommonTree)adaptor.rulePostProcessing(root_0);
            adaptor.setTokenBoundaries(retval.tree, retval.start, retval.stop);

        }

          catch (RecognitionException e) {
            reportError(e);
            throw e;
          }
        finally {
        }
        return retval;
    }

    public static class arg_return extends ParserRuleReturnScope {
        CommonTree tree;
        public Object getTree() { return tree; }
    };

    public final QueryParser.arg_return arg() throws RecognitionException {
        QueryParser.arg_return retval = new QueryParser.arg_return();
        retval.start = input.LT(1);

        CommonTree root_0 = null;

        QueryParser.item_return item34 = null;

        QueryParser.composite_return composite35 = null;

        QueryParser.function_return function36 = null;

        try {
            int alt15=3;
            switch ( input.LA(1) ) {
            case FIX:
            case REWRITE:
            case TEXT:
            case QUOTE:
                {
                alt15=1;
                }
                break;
            case DISTANCE_FN:
            case GEO_POINT_FN:
                {
                int LA15_2 = input.LA(2);

                if ( (LA15_2==EOF||LA15_2==WS||LA15_2==RPAREN||LA15_2==44) ) {
                    alt15=1;
                }
                else if ( (LA15_2==LPAREN) ) {
                    alt15=3;
                }
                else {
                    NoViableAltException nvae =
                        new NoViableAltException("", 15, 2, input);

                    throw nvae;
                }
                }
                break;
            case LPAREN:
                {
                alt15=2;
                }
                break;
            default:
                NoViableAltException nvae =
                    new NoViableAltException("", 15, 0, input);

                throw nvae;
            }

            switch (alt15) {
                case 1 :
                    {
                    root_0 = (CommonTree)adaptor.nil();

                    pushFollow(FOLLOW_item_in_arg498);
                    item34=item();

                    state._fsp--;

                    adaptor.addChild(root_0, item34.getTree());

                    }
                    break;
                case 2 :
                    {
                    root_0 = (CommonTree)adaptor.nil();

                    pushFollow(FOLLOW_composite_in_arg504);
                    composite35=composite();

                    state._fsp--;

                    adaptor.addChild(root_0, composite35.getTree());

                    }
                    break;
                case 3 :
                    {
                    root_0 = (CommonTree)adaptor.nil();

                    pushFollow(FOLLOW_function_in_arg510);
                    function36=function();

                    state._fsp--;

                    adaptor.addChild(root_0, function36.getTree());

                    }
                    break;

            }
            retval.stop = input.LT(-1);

            retval.tree = (CommonTree)adaptor.rulePostProcessing(root_0);
            adaptor.setTokenBoundaries(retval.tree, retval.start, retval.stop);

        }

          catch (RecognitionException e) {
            reportError(e);
            throw e;
          }
        finally {
        }
        return retval;
    }

    public static class andOp_return extends ParserRuleReturnScope {
        CommonTree tree;
        public Object getTree() { return tree; }
    };

    public final QueryParser.andOp_return andOp() throws RecognitionException {
        QueryParser.andOp_return retval = new QueryParser.andOp_return();
        retval.start = input.LT(1);

        CommonTree root_0 = null;

        Token WS37=null;
        Token AND38=null;
        Token WS39=null;

        CommonTree WS37_tree=null;
        CommonTree AND38_tree=null;
        CommonTree WS39_tree=null;

        try {
            {
            root_0 = (CommonTree)adaptor.nil();

            int cnt16=0;
            loop16:
            do {
                int alt16=2;
                int LA16_0 = input.LA(1);

                if ( (LA16_0==WS) ) {
                    alt16=1;
                }

                switch (alt16) {
            	case 1 :
            	    {
            	    WS37=(Token)match(input,WS,FOLLOW_WS_in_andOp524);
            	    WS37_tree = (CommonTree)adaptor.create(WS37);
            	    adaptor.addChild(root_0, WS37_tree);

            	    }
            	    break;

            	default :
            	    if ( cnt16 >= 1 ) break loop16;
                        EarlyExitException eee =
                            new EarlyExitException(16, input);
                        throw eee;
                }
                cnt16++;
            } while (true);

            AND38=(Token)match(input,AND,FOLLOW_AND_in_andOp527);
            AND38_tree = (CommonTree)adaptor.create(AND38);
            adaptor.addChild(root_0, AND38_tree);

            int cnt17=0;
            loop17:
            do {
                int alt17=2;
                int LA17_0 = input.LA(1);

                if ( (LA17_0==WS) ) {
                    alt17=1;
                }

                switch (alt17) {
            	case 1 :
            	    {
            	    WS39=(Token)match(input,WS,FOLLOW_WS_in_andOp529);
            	    WS39_tree = (CommonTree)adaptor.create(WS39);
            	    adaptor.addChild(root_0, WS39_tree);

            	    }
            	    break;

            	default :
            	    if ( cnt17 >= 1 ) break loop17;
                        EarlyExitException eee =
                            new EarlyExitException(17, input);
                        throw eee;
                }
                cnt17++;
            } while (true);

            }

            retval.stop = input.LT(-1);

            retval.tree = (CommonTree)adaptor.rulePostProcessing(root_0);
            adaptor.setTokenBoundaries(retval.tree, retval.start, retval.stop);

        }

          catch (RecognitionException e) {
            reportError(e);
            throw e;
          }
        finally {
        }
        return retval;
    }

    public static class orOp_return extends ParserRuleReturnScope {
        CommonTree tree;
        public Object getTree() { return tree; }
    };

    public final QueryParser.orOp_return orOp() throws RecognitionException {
        QueryParser.orOp_return retval = new QueryParser.orOp_return();
        retval.start = input.LT(1);

        CommonTree root_0 = null;

        Token WS40=null;
        Token OR41=null;
        Token WS42=null;

        CommonTree WS40_tree=null;
        CommonTree OR41_tree=null;
        CommonTree WS42_tree=null;

        try {
            {
            root_0 = (CommonTree)adaptor.nil();

            int cnt18=0;
            loop18:
            do {
                int alt18=2;
                int LA18_0 = input.LA(1);

                if ( (LA18_0==WS) ) {
                    alt18=1;
                }

                switch (alt18) {
            	case 1 :
            	    {
            	    WS40=(Token)match(input,WS,FOLLOW_WS_in_orOp544);
            	    WS40_tree = (CommonTree)adaptor.create(WS40);
            	    adaptor.addChild(root_0, WS40_tree);

            	    }
            	    break;

            	default :
            	    if ( cnt18 >= 1 ) break loop18;
                        EarlyExitException eee =
                            new EarlyExitException(18, input);
                        throw eee;
                }
                cnt18++;
            } while (true);

            OR41=(Token)match(input,OR,FOLLOW_OR_in_orOp547);
            OR41_tree = (CommonTree)adaptor.create(OR41);
            adaptor.addChild(root_0, OR41_tree);

            int cnt19=0;
            loop19:
            do {
                int alt19=2;
                int LA19_0 = input.LA(1);

                if ( (LA19_0==WS) ) {
                    alt19=1;
                }

                switch (alt19) {
            	case 1 :
            	    {
            	    WS42=(Token)match(input,WS,FOLLOW_WS_in_orOp549);
            	    WS42_tree = (CommonTree)adaptor.create(WS42);
            	    adaptor.addChild(root_0, WS42_tree);

            	    }
            	    break;

            	default :
            	    if ( cnt19 >= 1 ) break loop19;
                        EarlyExitException eee =
                            new EarlyExitException(19, input);
                        throw eee;
                }
                cnt19++;
            } while (true);

            }

            retval.stop = input.LT(-1);

            retval.tree = (CommonTree)adaptor.rulePostProcessing(root_0);
            adaptor.setTokenBoundaries(retval.tree, retval.start, retval.stop);

        }

          catch (RecognitionException e) {
            reportError(e);
            throw e;
          }
        finally {
        }
        return retval;
    }

    public static class notOp_return extends ParserRuleReturnScope {
        CommonTree tree;
        public Object getTree() { return tree; }
    };

    public final QueryParser.notOp_return notOp() throws RecognitionException {
        QueryParser.notOp_return retval = new QueryParser.notOp_return();
        retval.start = input.LT(1);

        CommonTree root_0 = null;

        Token char_literal43=null;
        Token NOT44=null;
        Token WS45=null;

        CommonTree char_literal43_tree=null;
        CommonTree NOT44_tree=null;
        CommonTree WS45_tree=null;

        try {
            int alt21=2;
            int LA21_0 = input.LA(1);

            if ( (LA21_0==43) ) {
                alt21=1;
            }
            else if ( (LA21_0==NOT) ) {
                alt21=2;
            }
            else {
                NoViableAltException nvae =
                    new NoViableAltException("", 21, 0, input);

                throw nvae;
            }
            switch (alt21) {
                case 1 :
                    {
                    root_0 = (CommonTree)adaptor.nil();

                    char_literal43=(Token)match(input,43,FOLLOW_43_in_notOp564);
                    char_literal43_tree = (CommonTree)adaptor.create(char_literal43);
                    adaptor.addChild(root_0, char_literal43_tree);

                    }
                    break;
                case 2 :
                    {
                    root_0 = (CommonTree)adaptor.nil();

                    NOT44=(Token)match(input,NOT,FOLLOW_NOT_in_notOp570);
                    NOT44_tree = (CommonTree)adaptor.create(NOT44);
                    adaptor.addChild(root_0, NOT44_tree);

                    int cnt20=0;
                    loop20:
                    do {
                        int alt20=2;
                        int LA20_0 = input.LA(1);

                        if ( (LA20_0==WS) ) {
                            alt20=1;
                        }

                        switch (alt20) {
                    	case 1 :
                    	    {
                    	    WS45=(Token)match(input,WS,FOLLOW_WS_in_notOp572);
                    	    WS45_tree = (CommonTree)adaptor.create(WS45);
                    	    adaptor.addChild(root_0, WS45_tree);

                    	    }
                    	    break;

                    	default :
                    	    if ( cnt20 >= 1 ) break loop20;
                                EarlyExitException eee =
                                    new EarlyExitException(20, input);
                                throw eee;
                        }
                        cnt20++;
                    } while (true);

                    }
                    break;

            }
            retval.stop = input.LT(-1);

            retval.tree = (CommonTree)adaptor.rulePostProcessing(root_0);
            adaptor.setTokenBoundaries(retval.tree, retval.start, retval.stop);

        }

          catch (RecognitionException e) {
            reportError(e);
            throw e;
          }
        finally {
        }
        return retval;
    }

    public static class sep_return extends ParserRuleReturnScope {
        CommonTree tree;
        public Object getTree() { return tree; }
    };

    public final QueryParser.sep_return sep() throws RecognitionException {
        QueryParser.sep_return retval = new QueryParser.sep_return();
        retval.start = input.LT(1);

        CommonTree root_0 = null;

        Token WS46=null;
        Token char_literal47=null;
        Token WS48=null;

        CommonTree WS46_tree=null;
        CommonTree char_literal47_tree=null;
        CommonTree WS48_tree=null;

        try {
            {
            root_0 = (CommonTree)adaptor.nil();

            loop22:
            do {
                int alt22=2;
                int LA22_0 = input.LA(1);

                if ( (LA22_0==WS) ) {
                    alt22=1;
                }

                switch (alt22) {
            	case 1 :
            	    {
            	    WS46=(Token)match(input,WS,FOLLOW_WS_in_sep587);
            	    WS46_tree = (CommonTree)adaptor.create(WS46);
            	    adaptor.addChild(root_0, WS46_tree);

            	    }
            	    break;

            	default :
            	    break loop22;
                }
            } while (true);

            char_literal47=(Token)match(input,44,FOLLOW_44_in_sep590);
            char_literal47_tree = (CommonTree)adaptor.create(char_literal47);
            adaptor.addChild(root_0, char_literal47_tree);

            loop23:
            do {
                int alt23=2;
                int LA23_0 = input.LA(1);

                if ( (LA23_0==WS) ) {
                    alt23=1;
                }

                switch (alt23) {
            	case 1 :
            	    {
            	    WS48=(Token)match(input,WS,FOLLOW_WS_in_sep592);
            	    WS48_tree = (CommonTree)adaptor.create(WS48);
            	    adaptor.addChild(root_0, WS48_tree);

            	    }
            	    break;

            	default :
            	    break loop23;
                }
            } while (true);

            }

            retval.stop = input.LT(-1);

            retval.tree = (CommonTree)adaptor.rulePostProcessing(root_0);
            adaptor.setTokenBoundaries(retval.tree, retval.start, retval.stop);

        }

          catch (RecognitionException e) {
            reportError(e);
            throw e;
          }
        finally {
        }
        return retval;
    }

    public static class fnname_return extends ParserRuleReturnScope {
        CommonTree tree;
        public Object getTree() { return tree; }
    };

    public final QueryParser.fnname_return fnname() throws RecognitionException {
        QueryParser.fnname_return retval = new QueryParser.fnname_return();
        retval.start = input.LT(1);

        CommonTree root_0 = null;

        Token set49=null;

        CommonTree set49_tree=null;

        try {
            {
            root_0 = (CommonTree)adaptor.nil();

            set49=(Token)input.LT(1);
            if ( (input.LA(1)>=DISTANCE_FN && input.LA(1)<=GEO_POINT_FN) ) {
                input.consume();
                adaptor.addChild(root_0, (CommonTree)adaptor.create(set49));
                state.errorRecovery=false;
            }
            else {
                MismatchedSetException mse = new MismatchedSetException(null,input);
                throw mse;
            }

            }

            retval.stop = input.LT(-1);

            retval.tree = (CommonTree)adaptor.rulePostProcessing(root_0);
            adaptor.setTokenBoundaries(retval.tree, retval.start, retval.stop);

        }

          catch (RecognitionException e) {
            reportError(e);
            throw e;
          }
        finally {
        }
        return retval;
    }

    public static class composite_return extends ParserRuleReturnScope {
        CommonTree tree;
        public Object getTree() { return tree; }
    };

    public final QueryParser.composite_return composite() throws RecognitionException {
        QueryParser.composite_return retval = new QueryParser.composite_return();
        retval.start = input.LT(1);

        CommonTree root_0 = null;

        Token LPAREN50=null;
        Token WS51=null;
        Token WS53=null;
        Token RPAREN54=null;
        QueryParser.expression_return expression52 = null;

        CommonTree LPAREN50_tree=null;
        CommonTree WS51_tree=null;
        CommonTree WS53_tree=null;
        CommonTree RPAREN54_tree=null;
        RewriteRuleTokenStream stream_RPAREN=new RewriteRuleTokenStream(adaptor,"token RPAREN");
        RewriteRuleTokenStream stream_WS=new RewriteRuleTokenStream(adaptor,"token WS");
        RewriteRuleTokenStream stream_LPAREN=new RewriteRuleTokenStream(adaptor,"token LPAREN");
        RewriteRuleSubtreeStream stream_expression=new RewriteRuleSubtreeStream(adaptor,"rule expression");
        try {
            {
            LPAREN50=(Token)match(input,LPAREN,FOLLOW_LPAREN_in_composite628);
            stream_LPAREN.add(LPAREN50);

            loop24:
            do {
                int alt24=2;
                int LA24_0 = input.LA(1);

                if ( (LA24_0==WS) ) {
                    alt24=1;
                }

                switch (alt24) {
            	case 1 :
            	    {
            	    WS51=(Token)match(input,WS,FOLLOW_WS_in_composite630);
            	    stream_WS.add(WS51);

            	    }
            	    break;

            	default :
            	    break loop24;
                }
            } while (true);

            pushFollow(FOLLOW_expression_in_composite633);
            expression52=expression();

            state._fsp--;

            stream_expression.add(expression52.getTree());
            loop25:
            do {
                int alt25=2;
                int LA25_0 = input.LA(1);

                if ( (LA25_0==WS) ) {
                    alt25=1;
                }

                switch (alt25) {
            	case 1 :
            	    {
            	    WS53=(Token)match(input,WS,FOLLOW_WS_in_composite635);
            	    stream_WS.add(WS53);

            	    }
            	    break;

            	default :
            	    break loop25;
                }
            } while (true);

            RPAREN54=(Token)match(input,RPAREN,FOLLOW_RPAREN_in_composite638);
            stream_RPAREN.add(RPAREN54);

            retval.tree = root_0;
            RewriteRuleSubtreeStream stream_retval=new RewriteRuleSubtreeStream(adaptor,"rule retval",retval!=null?retval.tree:null);

            root_0 = (CommonTree)adaptor.nil();
            {
                adaptor.addChild(root_0, stream_expression.nextTree());

            }

            retval.tree = root_0;
            }

            retval.stop = input.LT(-1);

            retval.tree = (CommonTree)adaptor.rulePostProcessing(root_0);
            adaptor.setTokenBoundaries(retval.tree, retval.start, retval.stop);

        }

          catch (RecognitionException e) {
            reportError(e);
            throw e;
          }
        finally {
        }
        return retval;
    }

    public static class item_return extends ParserRuleReturnScope {
        CommonTree tree;
        public Object getTree() { return tree; }
    };

    public final QueryParser.item_return item() throws RecognitionException {
        QueryParser.item_return retval = new QueryParser.item_return();
        retval.start = input.LT(1);

        CommonTree root_0 = null;

        Token FIX55=null;
        Token REWRITE57=null;
        QueryParser.value_return value56 = null;

        QueryParser.value_return value58 = null;

        QueryParser.value_return value59 = null;

        CommonTree FIX55_tree=null;
        CommonTree REWRITE57_tree=null;
        RewriteRuleTokenStream stream_FIX=new RewriteRuleTokenStream(adaptor,"token FIX");
        RewriteRuleTokenStream stream_REWRITE=new RewriteRuleTokenStream(adaptor,"token REWRITE");
        RewriteRuleSubtreeStream stream_value=new RewriteRuleSubtreeStream(adaptor,"rule value");
        try {
            int alt26=3;
            switch ( input.LA(1) ) {
            case FIX:
                {
                alt26=1;
                }
                break;
            case REWRITE:
                {
                alt26=2;
                }
                break;
            case DISTANCE_FN:
            case GEO_POINT_FN:
            case TEXT:
            case QUOTE:
                {
                alt26=3;
                }
                break;
            default:
                NoViableAltException nvae =
                    new NoViableAltException("", 26, 0, input);

                throw nvae;
            }

            switch (alt26) {
                case 1 :
                    {
                    FIX55=(Token)match(input,FIX,FOLLOW_FIX_in_item658);
                    stream_FIX.add(FIX55);

                    pushFollow(FOLLOW_value_in_item660);
                    value56=value();

                    state._fsp--;

                    stream_value.add(value56.getTree());

                    retval.tree = root_0;
                    RewriteRuleSubtreeStream stream_retval=new RewriteRuleSubtreeStream(adaptor,"rule retval",retval!=null?retval.tree:null);

                    root_0 = (CommonTree)adaptor.nil();
                    {
                        {
                        CommonTree root_1 = (CommonTree)adaptor.nil();
                        root_1 = (CommonTree)adaptor.becomeRoot((CommonTree)adaptor.create(LITERAL, "LITERAL"), root_1);

                        adaptor.addChild(root_1, stream_value.nextTree());

                        adaptor.addChild(root_0, root_1);
                        }

                    }

                    retval.tree = root_0;
                    }
                    break;
                case 2 :
                    {
                    REWRITE57=(Token)match(input,REWRITE,FOLLOW_REWRITE_in_item674);
                    stream_REWRITE.add(REWRITE57);

                    pushFollow(FOLLOW_value_in_item676);
                    value58=value();

                    state._fsp--;

                    stream_value.add(value58.getTree());

                    retval.tree = root_0;
                    RewriteRuleSubtreeStream stream_retval=new RewriteRuleSubtreeStream(adaptor,"rule retval",retval!=null?retval.tree:null);

                    root_0 = (CommonTree)adaptor.nil();
                    {
                        {
                        CommonTree root_1 = (CommonTree)adaptor.nil();
                        root_1 = (CommonTree)adaptor.becomeRoot((CommonTree)adaptor.create(FUZZY, "FUZZY"), root_1);

                        adaptor.addChild(root_1, stream_value.nextTree());

                        adaptor.addChild(root_0, root_1);
                        }

                    }

                    retval.tree = root_0;
                    }
                    break;
                case 3 :
                    {
                    pushFollow(FOLLOW_value_in_item690);
                    value59=value();

                    state._fsp--;

                    stream_value.add(value59.getTree());

                    retval.tree = root_0;
                    RewriteRuleSubtreeStream stream_retval=new RewriteRuleSubtreeStream(adaptor,"rule retval",retval!=null?retval.tree:null);

                    root_0 = (CommonTree)adaptor.nil();
                    {
                        adaptor.addChild(root_0, stream_value.nextTree());

                    }

                    retval.tree = root_0;
                    }
                    break;

            }
            retval.stop = input.LT(-1);

            retval.tree = (CommonTree)adaptor.rulePostProcessing(root_0);
            adaptor.setTokenBoundaries(retval.tree, retval.start, retval.stop);

        }

          catch (RecognitionException e) {
            reportError(e);
            throw e;
          }
        finally {
        }
        return retval;
    }

    public static class value_return extends ParserRuleReturnScope {
        CommonTree tree;
        public Object getTree() { return tree; }
    };

    public final QueryParser.value_return value() throws RecognitionException {
        QueryParser.value_return retval = new QueryParser.value_return();
        retval.start = input.LT(1);

        CommonTree root_0 = null;

        QueryParser.text_return text60 = null;

        QueryParser.phrase_return phrase61 = null;

        RewriteRuleSubtreeStream stream_text=new RewriteRuleSubtreeStream(adaptor,"rule text");
        RewriteRuleSubtreeStream stream_phrase=new RewriteRuleSubtreeStream(adaptor,"rule phrase");
        try {
            int alt27=2;
            int LA27_0 = input.LA(1);

            if ( ((LA27_0>=DISTANCE_FN && LA27_0<=GEO_POINT_FN)||LA27_0==TEXT) ) {
                alt27=1;
            }
            else if ( (LA27_0==QUOTE) ) {
                alt27=2;
            }
            else {
                NoViableAltException nvae =
                    new NoViableAltException("", 27, 0, input);

                throw nvae;
            }
            switch (alt27) {
                case 1 :
                    {
                    pushFollow(FOLLOW_text_in_value708);
                    text60=text();

                    state._fsp--;

                    stream_text.add(text60.getTree());

                    retval.tree = root_0;
                    RewriteRuleSubtreeStream stream_retval=new RewriteRuleSubtreeStream(adaptor,"rule retval",retval!=null?retval.tree:null);

                    root_0 = (CommonTree)adaptor.nil();
                    {
                        {
                        CommonTree root_1 = (CommonTree)adaptor.nil();
                        root_1 = (CommonTree)adaptor.becomeRoot((CommonTree)adaptor.create(VALUE, "VALUE"), root_1);

                        adaptor.addChild(root_1, (CommonTree)adaptor.create(TEXT, "TEXT"));
                        adaptor.addChild(root_1, stream_text.nextTree());

                        adaptor.addChild(root_0, root_1);
                        }

                    }

                    retval.tree = root_0;
                    }
                    break;
                case 2 :
                    {
                    pushFollow(FOLLOW_phrase_in_value724);
                    phrase61=phrase();

                    state._fsp--;

                    stream_phrase.add(phrase61.getTree());

                    retval.tree = root_0;
                    RewriteRuleSubtreeStream stream_retval=new RewriteRuleSubtreeStream(adaptor,"rule retval",retval!=null?retval.tree:null);

                    root_0 = (CommonTree)adaptor.nil();
                    {
                        {
                        CommonTree root_1 = (CommonTree)adaptor.nil();
                        root_1 = (CommonTree)adaptor.becomeRoot((CommonTree)adaptor.create(VALUE, "VALUE"), root_1);

                        adaptor.addChild(root_1, (CommonTree)adaptor.create(STRING, "STRING"));
                        adaptor.addChild(root_1, stream_phrase.nextTree());

                        adaptor.addChild(root_0, root_1);
                        }

                    }

                    retval.tree = root_0;
                    }
                    break;

            }
            retval.stop = input.LT(-1);

            retval.tree = (CommonTree)adaptor.rulePostProcessing(root_0);
            adaptor.setTokenBoundaries(retval.tree, retval.start, retval.stop);

        }

          catch (RecognitionException e) {
            reportError(e);
            throw e;
          }
        finally {
        }
        return retval;
    }

    public static class text_return extends ParserRuleReturnScope {
        CommonTree tree;
        public Object getTree() { return tree; }
    };

    public final QueryParser.text_return text() throws RecognitionException {
        QueryParser.text_return retval = new QueryParser.text_return();
        retval.start = input.LT(1);

        CommonTree root_0 = null;

        Token set62=null;

        CommonTree set62_tree=null;

        try {
            {
            root_0 = (CommonTree)adaptor.nil();

            set62=(Token)input.LT(1);
            if ( (input.LA(1)>=DISTANCE_FN && input.LA(1)<=GEO_POINT_FN)||input.LA(1)==TEXT ) {
                input.consume();
                adaptor.addChild(root_0, (CommonTree)adaptor.create(set62));
                state.errorRecovery=false;
            }
            else {
                MismatchedSetException mse = new MismatchedSetException(null,input);
                throw mse;
            }

            }

            retval.stop = input.LT(-1);

            retval.tree = (CommonTree)adaptor.rulePostProcessing(root_0);
            adaptor.setTokenBoundaries(retval.tree, retval.start, retval.stop);

        }

          catch (RecognitionException e) {
            reportError(e);
            throw e;
          }
        finally {
        }
        return retval;
    }

    public static class phrase_return extends ParserRuleReturnScope {
        CommonTree tree;
        public Object getTree() { return tree; }
    };

    public final QueryParser.phrase_return phrase() throws RecognitionException {
        QueryParser.phrase_return retval = new QueryParser.phrase_return();
        retval.start = input.LT(1);

        CommonTree root_0 = null;

        Token QUOTE63=null;
        Token set64=null;
        Token QUOTE65=null;

        CommonTree QUOTE63_tree=null;
        CommonTree set64_tree=null;
        CommonTree QUOTE65_tree=null;

        try {
            {
            root_0 = (CommonTree)adaptor.nil();

            QUOTE63=(Token)match(input,QUOTE,FOLLOW_QUOTE_in_phrase774);
            QUOTE63_tree = (CommonTree)adaptor.create(QUOTE63);
            adaptor.addChild(root_0, QUOTE63_tree);

            loop28:
            do {
                int alt28=2;
                int LA28_0 = input.LA(1);

                if ( ((LA28_0>=ARGS && LA28_0<=TEXT)||(LA28_0>=ESC && LA28_0<=44)) ) {
                    alt28=1;
                }

                switch (alt28) {
            	case 1 :
            	    {
            	    set64=(Token)input.LT(1);
            	    if ( (input.LA(1)>=ARGS && input.LA(1)<=TEXT)||(input.LA(1)>=ESC && input.LA(1)<=44) ) {
            	        input.consume();
            	        adaptor.addChild(root_0, (CommonTree)adaptor.create(set64));
            	        state.errorRecovery=false;
            	    }
            	    else {
            	        MismatchedSetException mse = new MismatchedSetException(null,input);
            	        throw mse;
            	    }

            	    }
            	    break;

            	default :
            	    break loop28;
                }
            } while (true);

            QUOTE65=(Token)match(input,QUOTE,FOLLOW_QUOTE_in_phrase792);
            QUOTE65_tree = (CommonTree)adaptor.create(QUOTE65);
            adaptor.addChild(root_0, QUOTE65_tree);

            }

            retval.stop = input.LT(-1);

            retval.tree = (CommonTree)adaptor.rulePostProcessing(root_0);
            adaptor.setTokenBoundaries(retval.tree, retval.start, retval.stop);

        }

          catch (RecognitionException e) {
            reportError(e);
            throw e;
          }
        finally {
        }
        return retval;
    }

    protected DFA3 dfa3 = new DFA3(this);
    protected DFA5 dfa5 = new DFA5(this);
    protected DFA6 dfa6 = new DFA6(this);
    protected DFA8 dfa8 = new DFA8(this);
    static final String DFA3_eotS =
        "\4\uffff";
    static final String DFA3_eofS =
        "\2\2\2\uffff";
    static final String DFA3_minS =
        "\2\17\2\uffff";
    static final String DFA3_maxS =
        "\1\30\1\31\2\uffff";
    static final String DFA3_acceptS =
        "\2\uffff\1\2\1\1";
    static final String DFA3_specialS =
        "\4\uffff}>";
    static final String[] DFA3_transitionS = {
            "\1\1\10\uffff\1\2",
            "\1\1\10\uffff\1\2\1\3",
            "",
            ""
    };

    static final short[] DFA3_eot = DFA.unpackEncodedString(DFA3_eotS);
    static final short[] DFA3_eof = DFA.unpackEncodedString(DFA3_eofS);
    static final char[] DFA3_min = DFA.unpackEncodedStringToUnsignedChars(DFA3_minS);
    static final char[] DFA3_max = DFA.unpackEncodedStringToUnsignedChars(DFA3_maxS);
    static final short[] DFA3_accept = DFA.unpackEncodedString(DFA3_acceptS);
    static final short[] DFA3_special = DFA.unpackEncodedString(DFA3_specialS);
    static final short[][] DFA3_transition;

    static {
        int numStates = DFA3_transitionS.length;
        DFA3_transition = new short[numStates][];
        for (int i=0; i<numStates; i++) {
            DFA3_transition[i] = DFA.unpackEncodedString(DFA3_transitionS[i]);
        }
    }

    class DFA3 extends DFA {

        public DFA3(BaseRecognizer recognizer) {
            this.recognizer = recognizer;
            this.decisionNumber = 3;
            this.eot = DFA3_eot;
            this.eof = DFA3_eof;
            this.min = DFA3_min;
            this.max = DFA3_max;
            this.accept = DFA3_accept;
            this.special = DFA3_special;
            this.transition = DFA3_transition;
        }
        public String getDescription() {
            return "()* loopback of 56:14: ( andOp sequence )*";
        }
    }
    static final String DFA5_eotS =
        "\4\uffff";
    static final String DFA5_eofS =
        "\2\2\2\uffff";
    static final String DFA5_minS =
        "\2\17\2\uffff";
    static final String DFA5_maxS =
        "\1\30\1\53\2\uffff";
    static final String DFA5_acceptS =
        "\2\uffff\1\2\1\1";
    static final String DFA5_specialS =
        "\4\uffff}>";
    static final String[] DFA5_transitionS = {
            "\1\1\10\uffff\1\2",
            "\1\1\7\uffff\1\3\2\2\1\uffff\7\3\11\uffff\1\3",
            "",
            ""
    };

    static final short[] DFA5_eot = DFA.unpackEncodedString(DFA5_eotS);
    static final short[] DFA5_eof = DFA.unpackEncodedString(DFA5_eofS);
    static final char[] DFA5_min = DFA.unpackEncodedStringToUnsignedChars(DFA5_minS);
    static final char[] DFA5_max = DFA.unpackEncodedStringToUnsignedChars(DFA5_maxS);
    static final short[] DFA5_accept = DFA.unpackEncodedString(DFA5_acceptS);
    static final short[] DFA5_special = DFA.unpackEncodedString(DFA5_specialS);
    static final short[][] DFA5_transition;

    static {
        int numStates = DFA5_transitionS.length;
        DFA5_transition = new short[numStates][];
        for (int i=0; i<numStates; i++) {
            DFA5_transition[i] = DFA.unpackEncodedString(DFA5_transitionS[i]);
        }
    }

    class DFA5 extends DFA {

        public DFA5(BaseRecognizer recognizer) {
            this.recognizer = recognizer;
            this.decisionNumber = 5;
            this.eot = DFA5_eot;
            this.eof = DFA5_eof;
            this.min = DFA5_min;
            this.max = DFA5_max;
            this.accept = DFA5_accept;
            this.special = DFA5_special;
            this.transition = DFA5_transition;
        }
        public String getDescription() {
            return "()* loopback of 62:12: ( ( WS )+ factor )*";
        }
    }
    static final String DFA6_eotS =
        "\4\uffff";
    static final String DFA6_eofS =
        "\2\2\2\uffff";
    static final String DFA6_minS =
        "\2\17\2\uffff";
    static final String DFA6_maxS =
        "\1\30\1\53\2\uffff";
    static final String DFA6_acceptS =
        "\2\uffff\1\2\1\1";
    static final String DFA6_specialS =
        "\4\uffff}>";
    static final String[] DFA6_transitionS = {
            "\1\1\10\uffff\1\2",
            "\1\1\7\uffff\3\2\1\3\7\2\11\uffff\1\2",
            "",
            ""
    };

    static final short[] DFA6_eot = DFA.unpackEncodedString(DFA6_eotS);
    static final short[] DFA6_eof = DFA.unpackEncodedString(DFA6_eofS);
    static final char[] DFA6_min = DFA.unpackEncodedStringToUnsignedChars(DFA6_minS);
    static final char[] DFA6_max = DFA.unpackEncodedStringToUnsignedChars(DFA6_maxS);
    static final short[] DFA6_accept = DFA.unpackEncodedString(DFA6_acceptS);
    static final short[] DFA6_special = DFA.unpackEncodedString(DFA6_specialS);
    static final short[][] DFA6_transition;

    static {
        int numStates = DFA6_transitionS.length;
        DFA6_transition = new short[numStates][];
        for (int i=0; i<numStates; i++) {
            DFA6_transition[i] = DFA.unpackEncodedString(DFA6_transitionS[i]);
        }
    }

    class DFA6 extends DFA {

        public DFA6(BaseRecognizer recognizer) {
            this.recognizer = recognizer;
            this.decisionNumber = 6;
            this.eot = DFA6_eot;
            this.eof = DFA6_eof;
            this.min = DFA6_min;
            this.max = DFA6_max;
            this.accept = DFA6_accept;
            this.special = DFA6_special;
            this.transition = DFA6_transition;
        }
        public String getDescription() {
            return "()* loopback of 68:10: ( orOp term )*";
        }
    }
    static final String DFA8_eotS =
        "\24\uffff";
    static final String DFA8_eofS =
        "\3\uffff\1\15\1\uffff\1\15\1\uffff\1\15\1\uffff\1\15\1\uffff\1\15"+
        "\3\uffff\1\15\1\uffff\1\15\1\uffff\1\15";
    static final String DFA8_minS =
        "\1\27\2\34\1\17\1\4\1\17\1\uffff\1\17\1\4\1\17\1\4\1\17\2\uffff"+
        "\1\4\1\17\1\4\1\17\1\4\1\17";
    static final String DFA8_maxS =
        "\3\41\1\30\1\54\1\30\1\uffff\1\30\1\54\1\30\1\54\1\53\2\uffff\1"+
        "\54\1\30\1\54\1\30\1\54\1\30";
    static final String DFA8_acceptS =
        "\6\uffff\1\2\5\uffff\1\1\1\3\6\uffff";
    static final String DFA8_specialS =
        "\24\uffff}>";
    static final String[] DFA8_transitionS = {
            "\1\6\4\uffff\2\3\1\1\1\2\1\5\1\4",
            "\2\7\2\uffff\1\7\1\10",
            "\2\11\2\uffff\1\11\1\12",
            "\1\13\10\14\1\15",
            "\35\16\1\17\13\16",
            "\1\13\7\14\1\uffff\1\15",
            "",
            "\1\13\7\14\1\uffff\1\15",
            "\35\20\1\21\13\20",
            "\1\13\7\14\1\uffff\1\15",
            "\35\22\1\23\13\22",
            "\1\13\7\14\13\15\11\uffff\1\15",
            "",
            "",
            "\35\16\1\17\13\16",
            "\1\13\7\14\1\uffff\1\15",
            "\35\20\1\21\13\20",
            "\1\13\7\14\1\uffff\1\15",
            "\35\22\1\23\13\22",
            "\1\13\7\14\1\uffff\1\15"
    };

    static final short[] DFA8_eot = DFA.unpackEncodedString(DFA8_eotS);
    static final short[] DFA8_eof = DFA.unpackEncodedString(DFA8_eofS);
    static final char[] DFA8_min = DFA.unpackEncodedStringToUnsignedChars(DFA8_minS);
    static final char[] DFA8_max = DFA.unpackEncodedStringToUnsignedChars(DFA8_maxS);
    static final short[] DFA8_accept = DFA.unpackEncodedString(DFA8_acceptS);
    static final short[] DFA8_special = DFA.unpackEncodedString(DFA8_specialS);
    static final short[][] DFA8_transition;

    static {
        int numStates = DFA8_transitionS.length;
        DFA8_transition = new short[numStates][];
        for (int i=0; i<numStates; i++) {
            DFA8_transition[i] = DFA.unpackEncodedString(DFA8_transitionS[i]);
        }
    }

    class DFA8 extends DFA {

        public DFA8(BaseRecognizer recognizer) {
            this.recognizer = recognizer;
            this.decisionNumber = 8;
            this.eot = DFA8_eot;
            this.eof = DFA8_eof;
            this.min = DFA8_min;
            this.max = DFA8_max;
            this.accept = DFA8_accept;
            this.special = DFA8_special;
            this.transition = DFA8_transition;
        }
        public String getDescription() {
            return "79:1: primitive : ( restrict | composite | item -> ^( HAS GLOBAL item ) );";
        }
    }

    public static final BitSet FOLLOW_WS_in_query128 = new BitSet(new long[]{0x00000803F8808000L});
    public static final BitSet FOLLOW_expression_in_query131 = new BitSet(new long[]{0x0000000000008000L});
    public static final BitSet FOLLOW_WS_in_query133 = new BitSet(new long[]{0x0000000000008000L});
    public static final BitSet FOLLOW_EOF_in_query136 = new BitSet(new long[]{0x0000000000000002L});
    public static final BitSet FOLLOW_sequence_in_expression155 = new BitSet(new long[]{0x0000000000008002L});
    public static final BitSet FOLLOW_andOp_in_expression158 = new BitSet(new long[]{0x00000803F8800000L});
    public static final BitSet FOLLOW_sequence_in_expression160 = new BitSet(new long[]{0x0000000000008002L});
    public static final BitSet FOLLOW_factor_in_sequence186 = new BitSet(new long[]{0x0000000000008002L});
    public static final BitSet FOLLOW_WS_in_sequence189 = new BitSet(new long[]{0x00000803F8808000L});
    public static final BitSet FOLLOW_factor_in_sequence192 = new BitSet(new long[]{0x0000000000008002L});
    public static final BitSet FOLLOW_term_in_factor218 = new BitSet(new long[]{0x0000000000008002L});
    public static final BitSet FOLLOW_orOp_in_factor221 = new BitSet(new long[]{0x00000803F8800000L});
    public static final BitSet FOLLOW_term_in_factor223 = new BitSet(new long[]{0x0000000000008002L});
    public static final BitSet FOLLOW_notOp_in_term247 = new BitSet(new long[]{0x00000803F8800000L});
    public static final BitSet FOLLOW_primitive_in_term249 = new BitSet(new long[]{0x0000000000000002L});
    public static final BitSet FOLLOW_primitive_in_term263 = new BitSet(new long[]{0x0000000000000002L});
    public static final BitSet FOLLOW_restrict_in_primitive279 = new BitSet(new long[]{0x0000000000000002L});
    public static final BitSet FOLLOW_composite_in_primitive285 = new BitSet(new long[]{0x0000000000000002L});
    public static final BitSet FOLLOW_item_in_primitive291 = new BitSet(new long[]{0x0000000000000002L});
    public static final BitSet FOLLOW_comparable_in_restrict317 = new BitSet(new long[]{0x00000000007F8000L});
    public static final BitSet FOLLOW_comparator_in_restrict319 = new BitSet(new long[]{0x00000003F0800000L});
    public static final BitSet FOLLOW_arg_in_restrict321 = new BitSet(new long[]{0x0000000000000002L});
    public static final BitSet FOLLOW_WS_in_comparator345 = new BitSet(new long[]{0x00000000007F8000L});
    public static final BitSet FOLLOW_LE_in_comparator351 = new BitSet(new long[]{0x0000000000008002L});
    public static final BitSet FOLLOW_LT_in_comparator357 = new BitSet(new long[]{0x0000000000008002L});
    public static final BitSet FOLLOW_GE_in_comparator363 = new BitSet(new long[]{0x0000000000008002L});
    public static final BitSet FOLLOW_GT_in_comparator369 = new BitSet(new long[]{0x0000000000008002L});
    public static final BitSet FOLLOW_NE_in_comparator375 = new BitSet(new long[]{0x0000000000008002L});
    public static final BitSet FOLLOW_EQ_in_comparator381 = new BitSet(new long[]{0x0000000000008002L});
    public static final BitSet FOLLOW_HAS_in_comparator387 = new BitSet(new long[]{0x0000000000008002L});
    public static final BitSet FOLLOW_WS_in_comparator390 = new BitSet(new long[]{0x0000000000008002L});
    public static final BitSet FOLLOW_item_in_comparable412 = new BitSet(new long[]{0x0000000000000002L});
    public static final BitSet FOLLOW_function_in_comparable418 = new BitSet(new long[]{0x0000000000000002L});
    public static final BitSet FOLLOW_fnname_in_function433 = new BitSet(new long[]{0x0000000000800000L});
    public static final BitSet FOLLOW_LPAREN_in_function435 = new BitSet(new long[]{0x00000003F1800000L});
    public static final BitSet FOLLOW_arglist_in_function437 = new BitSet(new long[]{0x0000000001000000L});
    public static final BitSet FOLLOW_RPAREN_in_function439 = new BitSet(new long[]{0x0000000000000002L});
    public static final BitSet FOLLOW_arg_in_arglist468 = new BitSet(new long[]{0x0000100000008002L});
    public static final BitSet FOLLOW_sep_in_arglist471 = new BitSet(new long[]{0x00000003F0800000L});
    public static final BitSet FOLLOW_arg_in_arglist473 = new BitSet(new long[]{0x0000100000008002L});
    public static final BitSet FOLLOW_item_in_arg498 = new BitSet(new long[]{0x0000000000000002L});
    public static final BitSet FOLLOW_composite_in_arg504 = new BitSet(new long[]{0x0000000000000002L});
    public static final BitSet FOLLOW_function_in_arg510 = new BitSet(new long[]{0x0000000000000002L});
    public static final BitSet FOLLOW_WS_in_andOp524 = new BitSet(new long[]{0x0000000002008000L});
    public static final BitSet FOLLOW_AND_in_andOp527 = new BitSet(new long[]{0x0000000000008000L});
    public static final BitSet FOLLOW_WS_in_andOp529 = new BitSet(new long[]{0x0000000000008002L});
    public static final BitSet FOLLOW_WS_in_orOp544 = new BitSet(new long[]{0x0000000004008000L});
    public static final BitSet FOLLOW_OR_in_orOp547 = new BitSet(new long[]{0x0000000000008000L});
    public static final BitSet FOLLOW_WS_in_orOp549 = new BitSet(new long[]{0x0000000000008002L});
    public static final BitSet FOLLOW_43_in_notOp564 = new BitSet(new long[]{0x0000000000000002L});
    public static final BitSet FOLLOW_NOT_in_notOp570 = new BitSet(new long[]{0x0000000000008000L});
    public static final BitSet FOLLOW_WS_in_notOp572 = new BitSet(new long[]{0x0000000000008002L});
    public static final BitSet FOLLOW_WS_in_sep587 = new BitSet(new long[]{0x0000100000008000L});
    public static final BitSet FOLLOW_44_in_sep590 = new BitSet(new long[]{0x0000000000008002L});
    public static final BitSet FOLLOW_WS_in_sep592 = new BitSet(new long[]{0x0000000000008002L});
    public static final BitSet FOLLOW_set_in_fnname0 = new BitSet(new long[]{0x0000000000000002L});
    public static final BitSet FOLLOW_LPAREN_in_composite628 = new BitSet(new long[]{0x00000803F8808000L});
    public static final BitSet FOLLOW_WS_in_composite630 = new BitSet(new long[]{0x00000803F8808000L});
    public static final BitSet FOLLOW_expression_in_composite633 = new BitSet(new long[]{0x0000000001008000L});
    public static final BitSet FOLLOW_WS_in_composite635 = new BitSet(new long[]{0x0000000001008000L});
    public static final BitSet FOLLOW_RPAREN_in_composite638 = new BitSet(new long[]{0x0000000000000002L});
    public static final BitSet FOLLOW_FIX_in_item658 = new BitSet(new long[]{0x00000003F0000000L});
    public static final BitSet FOLLOW_value_in_item660 = new BitSet(new long[]{0x0000000000000002L});
    public static final BitSet FOLLOW_REWRITE_in_item674 = new BitSet(new long[]{0x00000003F0000000L});
    public static final BitSet FOLLOW_value_in_item676 = new BitSet(new long[]{0x0000000000000002L});
    public static final BitSet FOLLOW_value_in_item690 = new BitSet(new long[]{0x0000000000000002L});
    public static final BitSet FOLLOW_text_in_value708 = new BitSet(new long[]{0x0000000000000002L});
    public static final BitSet FOLLOW_phrase_in_value724 = new BitSet(new long[]{0x0000000000000002L});
    public static final BitSet FOLLOW_set_in_text0 = new BitSet(new long[]{0x0000000000000002L});
    public static final BitSet FOLLOW_QUOTE_in_phrase774 = new BitSet(new long[]{0x00001FFFFFFFFFF0L});
    public static final BitSet FOLLOW_set_in_phrase776 = new BitSet(new long[]{0x00001FFFFFFFFFF0L});
    public static final BitSet FOLLOW_QUOTE_in_phrase792 = new BitSet(new long[]{0x0000000000000002L});

}

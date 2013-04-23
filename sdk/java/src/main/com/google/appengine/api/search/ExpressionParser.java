

  package com.google.appengine.api.search;

import org.antlr.runtime.*;

import org.antlr.runtime.tree.*;

public class ExpressionParser extends Parser {
    public static final String[] tokenNames = new String[] {
        "<invalid>", "<EOR>", "<DOWN>", "<UP>", "NEG", "INDEX", "COND", "AND", "OR", "XOR", "NOT", "LT", "LE", "GT", "GE", "EQ", "NE", "PLUS", "MINUS", "TIMES", "DIV", "LPAREN", "RPAREN", "LSQUARE", "INT", "RSQUARE", "NAME", "FLOAT", "PHRASE", "COMMA", "ABS", "COUNT", "DISTANCE", "GEOPOINT", "LEN", "LOG", "MAX", "MIN", "POW", "SNIPPET", "SWITCH", "DIGIT", "QUOTE", "ESC_SEQ", "EXPONENT", "NAME_START", "WS", "ASCII_LETTER", "UNDERSCORE", "DOLLAR", "HEX_DIGIT", "UNICODE_ESC", "OCTAL_ESC", "'.'"
    };
    public static final int DOLLAR=49;
    public static final int EXPONENT=44;
    public static final int LT=11;
    public static final int LSQUARE=23;
    public static final int ASCII_LETTER=47;
    public static final int LOG=35;
    public static final int SNIPPET=39;
    public static final int OCTAL_ESC=52;
    public static final int MAX=36;
    public static final int FLOAT=27;
    public static final int COUNT=31;
    public static final int NAME_START=45;
    public static final int NOT=10;
    public static final int AND=7;
    public static final int EOF=-1;
    public static final int LPAREN=21;
    public static final int INDEX=5;
    public static final int RPAREN=22;
    public static final int DISTANCE=32;
    public static final int QUOTE=42;
    public static final int NAME=26;
    public static final int ESC_SEQ=43;
    public static final int POW=38;
    public static final int T__53=53;
    public static final int COMMA=29;
    public static final int PLUS=17;
    public static final int DIGIT=41;
    public static final int EQ=15;
    public static final int NE=16;
    public static final int GE=14;
    public static final int XOR=9;
    public static final int SWITCH=40;
    public static final int UNICODE_ESC=51;
    public static final int HEX_DIGIT=50;
    public static final int UNDERSCORE=48;
    public static final int INT=24;
    public static final int MIN=37;
    public static final int MINUS=18;
    public static final int RSQUARE=25;
    public static final int GEOPOINT=33;
    public static final int PHRASE=28;
    public static final int ABS=30;
    public static final int WS=46;
    public static final int OR=8;
    public static final int NEG=4;
    public static final int GT=13;
    public static final int LEN=34;
    public static final int DIV=20;
    public static final int TIMES=19;
    public static final int COND=6;
    public static final int LE=12;

        public ExpressionParser(TokenStream input) {
            this(input, new RecognizerSharedState());
        }
        public ExpressionParser(TokenStream input, RecognizerSharedState state) {
            super(input, state);

        }

    protected TreeAdaptor adaptor = new CommonTreeAdaptor();

    public void setTreeAdaptor(TreeAdaptor adaptor) {
        this.adaptor = adaptor;
    }
    public TreeAdaptor getTreeAdaptor() {
        return adaptor;
    }

    public String[] getTokenNames() { return ExpressionParser.tokenNames; }
    public String getGrammarFileName() { return ""; }

      @Override
      public Object recoverFromMismatchedSet(IntStream input,
          RecognitionException e, BitSet follow) throws RecognitionException {
        throw e;
      }

      @Override
      protected Object recoverFromMismatchedToken(
          IntStream input, int ttype, BitSet follow) throws RecognitionException {
        throw new MismatchedTokenException(ttype, input);
      }

    public static class expression_return extends ParserRuleReturnScope {
        CommonTree tree;
        public Object getTree() { return tree; }
    };

    public final ExpressionParser.expression_return expression() throws RecognitionException {
        ExpressionParser.expression_return retval = new ExpressionParser.expression_return();
        retval.start = input.LT(1);

        CommonTree root_0 = null;

        Token EOF2=null;
        ExpressionParser.conjunction_return conjunction1 = null;

        CommonTree EOF2_tree=null;

        try {
            {
            root_0 = (CommonTree)adaptor.nil();

            pushFollow(FOLLOW_conjunction_in_expression88);
            conjunction1=conjunction();

            state._fsp--;

            adaptor.addChild(root_0, conjunction1.getTree());
            EOF2=(Token)match(input,EOF,FOLLOW_EOF_in_expression90);
            EOF2_tree = (CommonTree)adaptor.create(EOF2);
            adaptor.addChild(root_0, EOF2_tree);

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

    public static class condExpr_return extends ParserRuleReturnScope {
        CommonTree tree;
        public Object getTree() { return tree; }
    };

    public final ExpressionParser.condExpr_return condExpr() throws RecognitionException {
        ExpressionParser.condExpr_return retval = new ExpressionParser.condExpr_return();
        retval.start = input.LT(1);

        CommonTree root_0 = null;

        Token COND4=null;
        ExpressionParser.conjunction_return conjunction3 = null;

        ExpressionParser.addExpr_return addExpr5 = null;

        CommonTree COND4_tree=null;

        try {
            {
            root_0 = (CommonTree)adaptor.nil();

            pushFollow(FOLLOW_conjunction_in_condExpr103);
            conjunction3=conjunction();

            state._fsp--;

            adaptor.addChild(root_0, conjunction3.getTree());
            int alt1=2;
            int LA1_0 = input.LA(1);

            if ( (LA1_0==COND) ) {
                alt1=1;
            }
            switch (alt1) {
                case 1 :
                    {
                    COND4=(Token)match(input,COND,FOLLOW_COND_in_condExpr106);
                    COND4_tree = (CommonTree)adaptor.create(COND4);
                    root_0 = (CommonTree)adaptor.becomeRoot(COND4_tree, root_0);

                    pushFollow(FOLLOW_addExpr_in_condExpr109);
                    addExpr5=addExpr();

                    state._fsp--;

                    adaptor.addChild(root_0, addExpr5.getTree());

                    }
                    break;

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

    public static class conjunction_return extends ParserRuleReturnScope {
        CommonTree tree;
        public Object getTree() { return tree; }
    };

    public final ExpressionParser.conjunction_return conjunction() throws RecognitionException {
        ExpressionParser.conjunction_return retval = new ExpressionParser.conjunction_return();
        retval.start = input.LT(1);

        CommonTree root_0 = null;

        Token AND7=null;
        ExpressionParser.disjunction_return disjunction6 = null;

        ExpressionParser.disjunction_return disjunction8 = null;

        CommonTree AND7_tree=null;

        try {
            {
            root_0 = (CommonTree)adaptor.nil();

            pushFollow(FOLLOW_disjunction_in_conjunction124);
            disjunction6=disjunction();

            state._fsp--;

            adaptor.addChild(root_0, disjunction6.getTree());
            loop2:
            do {
                int alt2=2;
                int LA2_0 = input.LA(1);

                if ( (LA2_0==AND) ) {
                    alt2=1;
                }

                switch (alt2) {
            	case 1 :
            	    {
            	    AND7=(Token)match(input,AND,FOLLOW_AND_in_conjunction127);
            	    AND7_tree = (CommonTree)adaptor.create(AND7);
            	    root_0 = (CommonTree)adaptor.becomeRoot(AND7_tree, root_0);

            	    pushFollow(FOLLOW_disjunction_in_conjunction130);
            	    disjunction8=disjunction();

            	    state._fsp--;

            	    adaptor.addChild(root_0, disjunction8.getTree());

            	    }
            	    break;

            	default :
            	    break loop2;
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

    public static class disjunction_return extends ParserRuleReturnScope {
        CommonTree tree;
        public Object getTree() { return tree; }
    };

    public final ExpressionParser.disjunction_return disjunction() throws RecognitionException {
        ExpressionParser.disjunction_return retval = new ExpressionParser.disjunction_return();
        retval.start = input.LT(1);

        CommonTree root_0 = null;

        Token set10=null;
        ExpressionParser.negation_return negation9 = null;

        ExpressionParser.negation_return negation11 = null;

        CommonTree set10_tree=null;

        try {
            {
            root_0 = (CommonTree)adaptor.nil();

            pushFollow(FOLLOW_negation_in_disjunction145);
            negation9=negation();

            state._fsp--;

            adaptor.addChild(root_0, negation9.getTree());
            loop3:
            do {
                int alt3=2;
                int LA3_0 = input.LA(1);

                if ( ((LA3_0>=OR && LA3_0<=XOR)) ) {
                    alt3=1;
                }

                switch (alt3) {
            	case 1 :
            	    {
            	    set10=(Token)input.LT(1);
            	    set10=(Token)input.LT(1);
            	    if ( (input.LA(1)>=OR && input.LA(1)<=XOR) ) {
            	        input.consume();
            	        root_0 = (CommonTree)adaptor.becomeRoot((CommonTree)adaptor.create(set10), root_0);
            	        state.errorRecovery=false;
            	    }
            	    else {
            	        MismatchedSetException mse = new MismatchedSetException(null,input);
            	        throw mse;
            	    }

            	    pushFollow(FOLLOW_negation_in_disjunction157);
            	    negation11=negation();

            	    state._fsp--;

            	    adaptor.addChild(root_0, negation11.getTree());

            	    }
            	    break;

            	default :
            	    break loop3;
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

    public static class negation_return extends ParserRuleReturnScope {
        CommonTree tree;
        public Object getTree() { return tree; }
    };

    public final ExpressionParser.negation_return negation() throws RecognitionException {
        ExpressionParser.negation_return retval = new ExpressionParser.negation_return();
        retval.start = input.LT(1);

        CommonTree root_0 = null;

        Token NOT13=null;
        ExpressionParser.cmpExpr_return cmpExpr12 = null;

        ExpressionParser.cmpExpr_return cmpExpr14 = null;

        CommonTree NOT13_tree=null;

        try {
            int alt4=2;
            int LA4_0 = input.LA(1);

            if ( (LA4_0==MINUS||LA4_0==LPAREN||LA4_0==INT||(LA4_0>=NAME && LA4_0<=PHRASE)||(LA4_0>=ABS && LA4_0<=SWITCH)) ) {
                alt4=1;
            }
            else if ( (LA4_0==NOT) ) {
                alt4=2;
            }
            else {
                NoViableAltException nvae =
                    new NoViableAltException("", 4, 0, input);

                throw nvae;
            }
            switch (alt4) {
                case 1 :
                    {
                    root_0 = (CommonTree)adaptor.nil();

                    pushFollow(FOLLOW_cmpExpr_in_negation172);
                    cmpExpr12=cmpExpr();

                    state._fsp--;

                    adaptor.addChild(root_0, cmpExpr12.getTree());

                    }
                    break;
                case 2 :
                    {
                    root_0 = (CommonTree)adaptor.nil();

                    NOT13=(Token)match(input,NOT,FOLLOW_NOT_in_negation178);
                    NOT13_tree = (CommonTree)adaptor.create(NOT13);
                    root_0 = (CommonTree)adaptor.becomeRoot(NOT13_tree, root_0);

                    pushFollow(FOLLOW_cmpExpr_in_negation181);
                    cmpExpr14=cmpExpr();

                    state._fsp--;

                    adaptor.addChild(root_0, cmpExpr14.getTree());

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

    public static class cmpExpr_return extends ParserRuleReturnScope {
        CommonTree tree;
        public Object getTree() { return tree; }
    };

    public final ExpressionParser.cmpExpr_return cmpExpr() throws RecognitionException {
        ExpressionParser.cmpExpr_return retval = new ExpressionParser.cmpExpr_return();
        retval.start = input.LT(1);

        CommonTree root_0 = null;

        ExpressionParser.addExpr_return addExpr15 = null;

        ExpressionParser.cmpOp_return cmpOp16 = null;

        ExpressionParser.addExpr_return addExpr17 = null;

        try {
            {
            root_0 = (CommonTree)adaptor.nil();

            pushFollow(FOLLOW_addExpr_in_cmpExpr194);
            addExpr15=addExpr();

            state._fsp--;

            adaptor.addChild(root_0, addExpr15.getTree());
            int alt5=2;
            int LA5_0 = input.LA(1);

            if ( ((LA5_0>=LT && LA5_0<=NE)) ) {
                alt5=1;
            }
            switch (alt5) {
                case 1 :
                    {
                    pushFollow(FOLLOW_cmpOp_in_cmpExpr197);
                    cmpOp16=cmpOp();

                    state._fsp--;

                    root_0 = (CommonTree)adaptor.becomeRoot(cmpOp16.getTree(), root_0);
                    pushFollow(FOLLOW_addExpr_in_cmpExpr200);
                    addExpr17=addExpr();

                    state._fsp--;

                    adaptor.addChild(root_0, addExpr17.getTree());

                    }
                    break;

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

    public static class cmpOp_return extends ParserRuleReturnScope {
        CommonTree tree;
        public Object getTree() { return tree; }
    };

    public final ExpressionParser.cmpOp_return cmpOp() throws RecognitionException {
        ExpressionParser.cmpOp_return retval = new ExpressionParser.cmpOp_return();
        retval.start = input.LT(1);

        CommonTree root_0 = null;

        Token set18=null;

        CommonTree set18_tree=null;

        try {
            {
            root_0 = (CommonTree)adaptor.nil();

            set18=(Token)input.LT(1);
            if ( (input.LA(1)>=LT && input.LA(1)<=NE) ) {
                input.consume();
                adaptor.addChild(root_0, (CommonTree)adaptor.create(set18));
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

    public static class addExpr_return extends ParserRuleReturnScope {
        CommonTree tree;
        public Object getTree() { return tree; }
    };

    public final ExpressionParser.addExpr_return addExpr() throws RecognitionException {
        ExpressionParser.addExpr_return retval = new ExpressionParser.addExpr_return();
        retval.start = input.LT(1);

        CommonTree root_0 = null;

        ExpressionParser.multExpr_return multExpr19 = null;

        ExpressionParser.addOp_return addOp20 = null;

        ExpressionParser.multExpr_return multExpr21 = null;

        try {
            {
            root_0 = (CommonTree)adaptor.nil();

            pushFollow(FOLLOW_multExpr_in_addExpr258);
            multExpr19=multExpr();

            state._fsp--;

            adaptor.addChild(root_0, multExpr19.getTree());
            loop6:
            do {
                int alt6=2;
                int LA6_0 = input.LA(1);

                if ( ((LA6_0>=PLUS && LA6_0<=MINUS)) ) {
                    alt6=1;
                }

                switch (alt6) {
            	case 1 :
            	    {
            	    pushFollow(FOLLOW_addOp_in_addExpr261);
            	    addOp20=addOp();

            	    state._fsp--;

            	    root_0 = (CommonTree)adaptor.becomeRoot(addOp20.getTree(), root_0);
            	    pushFollow(FOLLOW_multExpr_in_addExpr264);
            	    multExpr21=multExpr();

            	    state._fsp--;

            	    adaptor.addChild(root_0, multExpr21.getTree());

            	    }
            	    break;

            	default :
            	    break loop6;
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

    public static class addOp_return extends ParserRuleReturnScope {
        CommonTree tree;
        public Object getTree() { return tree; }
    };

    public final ExpressionParser.addOp_return addOp() throws RecognitionException {
        ExpressionParser.addOp_return retval = new ExpressionParser.addOp_return();
        retval.start = input.LT(1);

        CommonTree root_0 = null;

        Token set22=null;

        CommonTree set22_tree=null;

        try {
            {
            root_0 = (CommonTree)adaptor.nil();

            set22=(Token)input.LT(1);
            if ( (input.LA(1)>=PLUS && input.LA(1)<=MINUS) ) {
                input.consume();
                adaptor.addChild(root_0, (CommonTree)adaptor.create(set22));
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

    public static class multExpr_return extends ParserRuleReturnScope {
        CommonTree tree;
        public Object getTree() { return tree; }
    };

    public final ExpressionParser.multExpr_return multExpr() throws RecognitionException {
        ExpressionParser.multExpr_return retval = new ExpressionParser.multExpr_return();
        retval.start = input.LT(1);

        CommonTree root_0 = null;

        ExpressionParser.unary_return unary23 = null;

        ExpressionParser.multOp_return multOp24 = null;

        ExpressionParser.unary_return unary25 = null;

        try {
            {
            root_0 = (CommonTree)adaptor.nil();

            pushFollow(FOLLOW_unary_in_multExpr298);
            unary23=unary();

            state._fsp--;

            adaptor.addChild(root_0, unary23.getTree());
            loop7:
            do {
                int alt7=2;
                int LA7_0 = input.LA(1);

                if ( ((LA7_0>=TIMES && LA7_0<=DIV)) ) {
                    alt7=1;
                }

                switch (alt7) {
            	case 1 :
            	    {
            	    pushFollow(FOLLOW_multOp_in_multExpr301);
            	    multOp24=multOp();

            	    state._fsp--;

            	    root_0 = (CommonTree)adaptor.becomeRoot(multOp24.getTree(), root_0);
            	    pushFollow(FOLLOW_unary_in_multExpr304);
            	    unary25=unary();

            	    state._fsp--;

            	    adaptor.addChild(root_0, unary25.getTree());

            	    }
            	    break;

            	default :
            	    break loop7;
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

    public static class multOp_return extends ParserRuleReturnScope {
        CommonTree tree;
        public Object getTree() { return tree; }
    };

    public final ExpressionParser.multOp_return multOp() throws RecognitionException {
        ExpressionParser.multOp_return retval = new ExpressionParser.multOp_return();
        retval.start = input.LT(1);

        CommonTree root_0 = null;

        Token set26=null;

        CommonTree set26_tree=null;

        try {
            {
            root_0 = (CommonTree)adaptor.nil();

            set26=(Token)input.LT(1);
            if ( (input.LA(1)>=TIMES && input.LA(1)<=DIV) ) {
                input.consume();
                adaptor.addChild(root_0, (CommonTree)adaptor.create(set26));
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

    public static class unary_return extends ParserRuleReturnScope {
        CommonTree tree;
        public Object getTree() { return tree; }
    };

    public final ExpressionParser.unary_return unary() throws RecognitionException {
        ExpressionParser.unary_return retval = new ExpressionParser.unary_return();
        retval.start = input.LT(1);

        CommonTree root_0 = null;

        Token MINUS27=null;
        ExpressionParser.atom_return atom28 = null;

        ExpressionParser.atom_return atom29 = null;

        CommonTree MINUS27_tree=null;
        RewriteRuleTokenStream stream_MINUS=new RewriteRuleTokenStream(adaptor,"token MINUS");
        RewriteRuleSubtreeStream stream_atom=new RewriteRuleSubtreeStream(adaptor,"rule atom");
        try {
            int alt8=2;
            int LA8_0 = input.LA(1);

            if ( (LA8_0==MINUS) ) {
                alt8=1;
            }
            else if ( (LA8_0==LPAREN||LA8_0==INT||(LA8_0>=NAME && LA8_0<=PHRASE)||(LA8_0>=ABS && LA8_0<=SWITCH)) ) {
                alt8=2;
            }
            else {
                NoViableAltException nvae =
                    new NoViableAltException("", 8, 0, input);

                throw nvae;
            }
            switch (alt8) {
                case 1 :
                    {
                    MINUS27=(Token)match(input,MINUS,FOLLOW_MINUS_in_unary338);
                    stream_MINUS.add(MINUS27);

                    pushFollow(FOLLOW_atom_in_unary340);
                    atom28=atom();

                    state._fsp--;

                    stream_atom.add(atom28.getTree());

                    retval.tree = root_0;
                    RewriteRuleSubtreeStream stream_retval=new RewriteRuleSubtreeStream(adaptor,"rule retval",retval!=null?retval.tree:null);

                    root_0 = (CommonTree)adaptor.nil();
                    {
                        {
                        CommonTree root_1 = (CommonTree)adaptor.nil();
                        root_1 = (CommonTree)adaptor.becomeRoot((CommonTree)adaptor.create(NEG, "-"), root_1);

                        adaptor.addChild(root_1, stream_atom.nextTree());

                        adaptor.addChild(root_0, root_1);
                        }

                    }

                    retval.tree = root_0;
                    }
                    break;
                case 2 :
                    {
                    root_0 = (CommonTree)adaptor.nil();

                    pushFollow(FOLLOW_atom_in_unary355);
                    atom29=atom();

                    state._fsp--;

                    adaptor.addChild(root_0, atom29.getTree());

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

    public static class atom_return extends ParserRuleReturnScope {
        CommonTree tree;
        public Object getTree() { return tree; }
    };

    public final ExpressionParser.atom_return atom() throws RecognitionException {
        ExpressionParser.atom_return retval = new ExpressionParser.atom_return();
        retval.start = input.LT(1);

        CommonTree root_0 = null;

        Token LPAREN34=null;
        Token RPAREN36=null;
        ExpressionParser.var_return var30 = null;

        ExpressionParser.num_return num31 = null;

        ExpressionParser.str_return str32 = null;

        ExpressionParser.fn_return fn33 = null;

        ExpressionParser.conjunction_return conjunction35 = null;

        CommonTree LPAREN34_tree=null;
        CommonTree RPAREN36_tree=null;
        RewriteRuleTokenStream stream_RPAREN=new RewriteRuleTokenStream(adaptor,"token RPAREN");
        RewriteRuleTokenStream stream_LPAREN=new RewriteRuleTokenStream(adaptor,"token LPAREN");
        RewriteRuleSubtreeStream stream_conjunction=new RewriteRuleSubtreeStream(adaptor,"rule conjunction");
        try {
            int alt9=5;
            switch ( input.LA(1) ) {
            case NAME:
                {
                alt9=1;
                }
                break;
            case INT:
            case FLOAT:
                {
                alt9=2;
                }
                break;
            case PHRASE:
                {
                alt9=3;
                }
                break;
            case ABS:
            case COUNT:
            case DISTANCE:
            case GEOPOINT:
            case LEN:
            case LOG:
            case MAX:
            case MIN:
            case POW:
            case SNIPPET:
            case SWITCH:
                {
                alt9=4;
                }
                break;
            case LPAREN:
                {
                alt9=5;
                }
                break;
            default:
                NoViableAltException nvae =
                    new NoViableAltException("", 9, 0, input);

                throw nvae;
            }

            switch (alt9) {
                case 1 :
                    {
                    root_0 = (CommonTree)adaptor.nil();

                    pushFollow(FOLLOW_var_in_atom368);
                    var30=var();

                    state._fsp--;

                    adaptor.addChild(root_0, var30.getTree());

                    }
                    break;
                case 2 :
                    {
                    root_0 = (CommonTree)adaptor.nil();

                    pushFollow(FOLLOW_num_in_atom374);
                    num31=num();

                    state._fsp--;

                    adaptor.addChild(root_0, num31.getTree());

                    }
                    break;
                case 3 :
                    {
                    root_0 = (CommonTree)adaptor.nil();

                    pushFollow(FOLLOW_str_in_atom380);
                    str32=str();

                    state._fsp--;

                    adaptor.addChild(root_0, str32.getTree());

                    }
                    break;
                case 4 :
                    {
                    root_0 = (CommonTree)adaptor.nil();

                    pushFollow(FOLLOW_fn_in_atom386);
                    fn33=fn();

                    state._fsp--;

                    adaptor.addChild(root_0, fn33.getTree());

                    }
                    break;
                case 5 :
                    {
                    LPAREN34=(Token)match(input,LPAREN,FOLLOW_LPAREN_in_atom392);
                    stream_LPAREN.add(LPAREN34);

                    pushFollow(FOLLOW_conjunction_in_atom394);
                    conjunction35=conjunction();

                    state._fsp--;

                    stream_conjunction.add(conjunction35.getTree());
                    RPAREN36=(Token)match(input,RPAREN,FOLLOW_RPAREN_in_atom396);
                    stream_RPAREN.add(RPAREN36);

                    retval.tree = root_0;
                    RewriteRuleSubtreeStream stream_retval=new RewriteRuleSubtreeStream(adaptor,"rule retval",retval!=null?retval.tree:null);

                    root_0 = (CommonTree)adaptor.nil();
                    {
                        adaptor.addChild(root_0, stream_conjunction.nextTree());

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

    public static class var_return extends ParserRuleReturnScope {
        CommonTree tree;
        public Object getTree() { return tree; }
    };

    public final ExpressionParser.var_return var() throws RecognitionException {
        ExpressionParser.var_return retval = new ExpressionParser.var_return();
        retval.start = input.LT(1);

        CommonTree root_0 = null;

        ExpressionParser.name_return name37 = null;

        ExpressionParser.name_return name38 = null;

        ExpressionParser.index_return index39 = null;

        RewriteRuleSubtreeStream stream_index=new RewriteRuleSubtreeStream(adaptor,"rule index");
        RewriteRuleSubtreeStream stream_name=new RewriteRuleSubtreeStream(adaptor,"rule name");
        try {
            int alt10=2;
            alt10 = dfa10.predict(input);
            switch (alt10) {
                case 1 :
                    {
                    root_0 = (CommonTree)adaptor.nil();

                    pushFollow(FOLLOW_name_in_var413);
                    name37=name();

                    state._fsp--;

                    adaptor.addChild(root_0, name37.getTree());

                    }
                    break;
                case 2 :
                    {
                    pushFollow(FOLLOW_name_in_var419);
                    name38=name();

                    state._fsp--;

                    stream_name.add(name38.getTree());
                    pushFollow(FOLLOW_index_in_var421);
                    index39=index();

                    state._fsp--;

                    stream_index.add(index39.getTree());

                    retval.tree = root_0;
                    RewriteRuleSubtreeStream stream_retval=new RewriteRuleSubtreeStream(adaptor,"rule retval",retval!=null?retval.tree:null);

                    root_0 = (CommonTree)adaptor.nil();
                    {
                        {
                        CommonTree root_1 = (CommonTree)adaptor.nil();
                        root_1 = (CommonTree)adaptor.becomeRoot((CommonTree)adaptor.create(INDEX, (index39!=null?input.toString(index39.start,index39.stop):null)), root_1);

                        adaptor.addChild(root_1, stream_name.nextTree());

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

    public static class index_return extends ParserRuleReturnScope {
        CommonTree tree;
        public Object getTree() { return tree; }
    };

    public final ExpressionParser.index_return index() throws RecognitionException {
        ExpressionParser.index_return retval = new ExpressionParser.index_return();
        retval.start = input.LT(1);

        CommonTree root_0 = null;

        Token x=null;
        Token LSQUARE40=null;
        Token RSQUARE41=null;

        CommonTree x_tree=null;
        CommonTree LSQUARE40_tree=null;
        CommonTree RSQUARE41_tree=null;
        RewriteRuleTokenStream stream_INT=new RewriteRuleTokenStream(adaptor,"token INT");
        RewriteRuleTokenStream stream_LSQUARE=new RewriteRuleTokenStream(adaptor,"token LSQUARE");
        RewriteRuleTokenStream stream_RSQUARE=new RewriteRuleTokenStream(adaptor,"token RSQUARE");

        try {
            {
            LSQUARE40=(Token)match(input,LSQUARE,FOLLOW_LSQUARE_in_index443);
            stream_LSQUARE.add(LSQUARE40);

            x=(Token)match(input,INT,FOLLOW_INT_in_index447);
            stream_INT.add(x);

            RSQUARE41=(Token)match(input,RSQUARE,FOLLOW_RSQUARE_in_index449);
            stream_RSQUARE.add(RSQUARE41);

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

    public static class name_return extends ParserRuleReturnScope {
        CommonTree tree;
        public Object getTree() { return tree; }
    };

    public final ExpressionParser.name_return name() throws RecognitionException {
        ExpressionParser.name_return retval = new ExpressionParser.name_return();
        retval.start = input.LT(1);

        CommonTree root_0 = null;

        Token NAME42=null;
        Token char_literal43=null;
        Token NAME44=null;

        CommonTree NAME42_tree=null;
        CommonTree char_literal43_tree=null;
        CommonTree NAME44_tree=null;

        try {
            {
            root_0 = (CommonTree)adaptor.nil();

            NAME42=(Token)match(input,NAME,FOLLOW_NAME_in_name467);
            NAME42_tree = (CommonTree)adaptor.create(NAME42);
            adaptor.addChild(root_0, NAME42_tree);

            loop11:
            do {
                int alt11=2;
                int LA11_0 = input.LA(1);

                if ( (LA11_0==53) ) {
                    alt11=1;
                }

                switch (alt11) {
            	case 1 :
            	    {
            	    char_literal43=(Token)match(input,53,FOLLOW_53_in_name470);
            	    char_literal43_tree = (CommonTree)adaptor.create(char_literal43);
            	    root_0 = (CommonTree)adaptor.becomeRoot(char_literal43_tree, root_0);

            	    NAME44=(Token)match(input,NAME,FOLLOW_NAME_in_name473);
            	    NAME44_tree = (CommonTree)adaptor.create(NAME44);
            	    adaptor.addChild(root_0, NAME44_tree);

            	    }
            	    break;

            	default :
            	    break loop11;
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

    public static class num_return extends ParserRuleReturnScope {
        CommonTree tree;
        public Object getTree() { return tree; }
    };

    public final ExpressionParser.num_return num() throws RecognitionException {
        ExpressionParser.num_return retval = new ExpressionParser.num_return();
        retval.start = input.LT(1);

        CommonTree root_0 = null;

        Token set45=null;

        CommonTree set45_tree=null;

        try {
            {
            root_0 = (CommonTree)adaptor.nil();

            set45=(Token)input.LT(1);
            if ( input.LA(1)==INT||input.LA(1)==FLOAT ) {
                input.consume();
                adaptor.addChild(root_0, (CommonTree)adaptor.create(set45));
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

    public static class str_return extends ParserRuleReturnScope {
        CommonTree tree;
        public Object getTree() { return tree; }
    };

    public final ExpressionParser.str_return str() throws RecognitionException {
        ExpressionParser.str_return retval = new ExpressionParser.str_return();
        retval.start = input.LT(1);

        CommonTree root_0 = null;

        Token PHRASE46=null;

        CommonTree PHRASE46_tree=null;

        try {
            {
            root_0 = (CommonTree)adaptor.nil();

            PHRASE46=(Token)match(input,PHRASE,FOLLOW_PHRASE_in_str507);
            PHRASE46_tree = (CommonTree)adaptor.create(PHRASE46);
            adaptor.addChild(root_0, PHRASE46_tree);

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

    public static class fn_return extends ParserRuleReturnScope {
        CommonTree tree;
        public Object getTree() { return tree; }
    };

    public final ExpressionParser.fn_return fn() throws RecognitionException {
        ExpressionParser.fn_return retval = new ExpressionParser.fn_return();
        retval.start = input.LT(1);

        CommonTree root_0 = null;

        Token LPAREN48=null;
        Token COMMA50=null;
        Token RPAREN52=null;
        ExpressionParser.fnName_return fnName47 = null;

        ExpressionParser.condExpr_return condExpr49 = null;

        ExpressionParser.condExpr_return condExpr51 = null;

        CommonTree LPAREN48_tree=null;
        CommonTree COMMA50_tree=null;
        CommonTree RPAREN52_tree=null;
        RewriteRuleTokenStream stream_RPAREN=new RewriteRuleTokenStream(adaptor,"token RPAREN");
        RewriteRuleTokenStream stream_COMMA=new RewriteRuleTokenStream(adaptor,"token COMMA");
        RewriteRuleTokenStream stream_LPAREN=new RewriteRuleTokenStream(adaptor,"token LPAREN");
        RewriteRuleSubtreeStream stream_fnName=new RewriteRuleSubtreeStream(adaptor,"rule fnName");
        RewriteRuleSubtreeStream stream_condExpr=new RewriteRuleSubtreeStream(adaptor,"rule condExpr");
        try {
            {
            pushFollow(FOLLOW_fnName_in_fn520);
            fnName47=fnName();

            state._fsp--;

            stream_fnName.add(fnName47.getTree());
            LPAREN48=(Token)match(input,LPAREN,FOLLOW_LPAREN_in_fn522);
            stream_LPAREN.add(LPAREN48);

            pushFollow(FOLLOW_condExpr_in_fn524);
            condExpr49=condExpr();

            state._fsp--;

            stream_condExpr.add(condExpr49.getTree());
            loop12:
            do {
                int alt12=2;
                int LA12_0 = input.LA(1);

                if ( (LA12_0==COMMA) ) {
                    alt12=1;
                }

                switch (alt12) {
            	case 1 :
            	    {
            	    COMMA50=(Token)match(input,COMMA,FOLLOW_COMMA_in_fn527);
            	    stream_COMMA.add(COMMA50);

            	    pushFollow(FOLLOW_condExpr_in_fn529);
            	    condExpr51=condExpr();

            	    state._fsp--;

            	    stream_condExpr.add(condExpr51.getTree());

            	    }
            	    break;

            	default :
            	    break loop12;
                }
            } while (true);

            RPAREN52=(Token)match(input,RPAREN,FOLLOW_RPAREN_in_fn533);
            stream_RPAREN.add(RPAREN52);

            retval.tree = root_0;
            RewriteRuleSubtreeStream stream_retval=new RewriteRuleSubtreeStream(adaptor,"rule retval",retval!=null?retval.tree:null);

            root_0 = (CommonTree)adaptor.nil();
            {
                {
                CommonTree root_1 = (CommonTree)adaptor.nil();
                root_1 = (CommonTree)adaptor.becomeRoot(stream_fnName.nextNode(), root_1);

                if ( !(stream_condExpr.hasNext()) ) {
                    throw new RewriteEarlyExitException();
                }
                while ( stream_condExpr.hasNext() ) {
                    adaptor.addChild(root_1, stream_condExpr.nextTree());

                }
                stream_condExpr.reset();

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

    public static class fnName_return extends ParserRuleReturnScope {
        CommonTree tree;
        public Object getTree() { return tree; }
    };

    public final ExpressionParser.fnName_return fnName() throws RecognitionException {
        ExpressionParser.fnName_return retval = new ExpressionParser.fnName_return();
        retval.start = input.LT(1);

        CommonTree root_0 = null;

        Token set53=null;

        CommonTree set53_tree=null;

        try {
            {
            root_0 = (CommonTree)adaptor.nil();

            set53=(Token)input.LT(1);
            if ( (input.LA(1)>=ABS && input.LA(1)<=SWITCH) ) {
                input.consume();
                adaptor.addChild(root_0, (CommonTree)adaptor.create(set53));
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

    protected DFA10 dfa10 = new DFA10(this);
    static final String DFA10_eotS =
        "\6\uffff";
    static final String DFA10_eofS =
        "\1\uffff\1\3\3\uffff\1\3";
    static final String DFA10_minS =
        "\1\32\1\6\1\32\2\uffff\1\6";
    static final String DFA10_maxS =
        "\1\32\1\65\1\32\2\uffff\1\65";
    static final String DFA10_acceptS =
        "\3\uffff\1\1\1\2\1\uffff";
    static final String DFA10_specialS =
        "\6\uffff}>";
    static final String[] DFA10_transitionS = {
            "\1\1",
            "\4\3\1\uffff\12\3\1\uffff\1\3\1\4\5\uffff\1\3\27\uffff\1\2",
            "\1\5",
            "",
            "",
            "\4\3\1\uffff\12\3\1\uffff\1\3\1\4\5\uffff\1\3\27\uffff\1\2"
    };

    static final short[] DFA10_eot = DFA.unpackEncodedString(DFA10_eotS);
    static final short[] DFA10_eof = DFA.unpackEncodedString(DFA10_eofS);
    static final char[] DFA10_min = DFA.unpackEncodedStringToUnsignedChars(DFA10_minS);
    static final char[] DFA10_max = DFA.unpackEncodedStringToUnsignedChars(DFA10_maxS);
    static final short[] DFA10_accept = DFA.unpackEncodedString(DFA10_acceptS);
    static final short[] DFA10_special = DFA.unpackEncodedString(DFA10_specialS);
    static final short[][] DFA10_transition;

    static {
        int numStates = DFA10_transitionS.length;
        DFA10_transition = new short[numStates][];
        for (int i=0; i<numStates; i++) {
            DFA10_transition[i] = DFA.unpackEncodedString(DFA10_transitionS[i]);
        }
    }

    class DFA10 extends DFA {

        public DFA10(BaseRecognizer recognizer) {
            this.recognizer = recognizer;
            this.decisionNumber = 10;
            this.eot = DFA10_eot;
            this.eof = DFA10_eof;
            this.min = DFA10_min;
            this.max = DFA10_max;
            this.accept = DFA10_accept;
            this.special = DFA10_special;
            this.transition = DFA10_transition;
        }
        public String getDescription() {
            return "120:1: var : ( name | name index -> ^( INDEX[$index.text] name ) );";
        }
    }

    public static final BitSet FOLLOW_conjunction_in_expression88 = new BitSet(new long[]{0x0000000000000000L});
    public static final BitSet FOLLOW_EOF_in_expression90 = new BitSet(new long[]{0x0000000000000002L});
    public static final BitSet FOLLOW_conjunction_in_condExpr103 = new BitSet(new long[]{0x0000000000000042L});
    public static final BitSet FOLLOW_COND_in_condExpr106 = new BitSet(new long[]{0x000001FFDD240000L});
    public static final BitSet FOLLOW_addExpr_in_condExpr109 = new BitSet(new long[]{0x0000000000000002L});
    public static final BitSet FOLLOW_disjunction_in_conjunction124 = new BitSet(new long[]{0x0000000000000082L});
    public static final BitSet FOLLOW_AND_in_conjunction127 = new BitSet(new long[]{0x000001FFDD240400L});
    public static final BitSet FOLLOW_disjunction_in_conjunction130 = new BitSet(new long[]{0x0000000000000082L});
    public static final BitSet FOLLOW_negation_in_disjunction145 = new BitSet(new long[]{0x0000000000000302L});
    public static final BitSet FOLLOW_set_in_disjunction148 = new BitSet(new long[]{0x000001FFDD240400L});
    public static final BitSet FOLLOW_negation_in_disjunction157 = new BitSet(new long[]{0x0000000000000302L});
    public static final BitSet FOLLOW_cmpExpr_in_negation172 = new BitSet(new long[]{0x0000000000000002L});
    public static final BitSet FOLLOW_NOT_in_negation178 = new BitSet(new long[]{0x000001FFDD240000L});
    public static final BitSet FOLLOW_cmpExpr_in_negation181 = new BitSet(new long[]{0x0000000000000002L});
    public static final BitSet FOLLOW_addExpr_in_cmpExpr194 = new BitSet(new long[]{0x000000000001F802L});
    public static final BitSet FOLLOW_cmpOp_in_cmpExpr197 = new BitSet(new long[]{0x000001FFDD240000L});
    public static final BitSet FOLLOW_addExpr_in_cmpExpr200 = new BitSet(new long[]{0x0000000000000002L});
    public static final BitSet FOLLOW_set_in_cmpOp0 = new BitSet(new long[]{0x0000000000000002L});
    public static final BitSet FOLLOW_multExpr_in_addExpr258 = new BitSet(new long[]{0x0000000000060002L});
    public static final BitSet FOLLOW_addOp_in_addExpr261 = new BitSet(new long[]{0x000001FFDD240000L});
    public static final BitSet FOLLOW_multExpr_in_addExpr264 = new BitSet(new long[]{0x0000000000060002L});
    public static final BitSet FOLLOW_set_in_addOp0 = new BitSet(new long[]{0x0000000000000002L});
    public static final BitSet FOLLOW_unary_in_multExpr298 = new BitSet(new long[]{0x0000000000180002L});
    public static final BitSet FOLLOW_multOp_in_multExpr301 = new BitSet(new long[]{0x000001FFDD240000L});
    public static final BitSet FOLLOW_unary_in_multExpr304 = new BitSet(new long[]{0x0000000000180002L});
    public static final BitSet FOLLOW_set_in_multOp0 = new BitSet(new long[]{0x0000000000000002L});
    public static final BitSet FOLLOW_MINUS_in_unary338 = new BitSet(new long[]{0x000001FFDD240000L});
    public static final BitSet FOLLOW_atom_in_unary340 = new BitSet(new long[]{0x0000000000000002L});
    public static final BitSet FOLLOW_atom_in_unary355 = new BitSet(new long[]{0x0000000000000002L});
    public static final BitSet FOLLOW_var_in_atom368 = new BitSet(new long[]{0x0000000000000002L});
    public static final BitSet FOLLOW_num_in_atom374 = new BitSet(new long[]{0x0000000000000002L});
    public static final BitSet FOLLOW_str_in_atom380 = new BitSet(new long[]{0x0000000000000002L});
    public static final BitSet FOLLOW_fn_in_atom386 = new BitSet(new long[]{0x0000000000000002L});
    public static final BitSet FOLLOW_LPAREN_in_atom392 = new BitSet(new long[]{0x000001FFDD240400L});
    public static final BitSet FOLLOW_conjunction_in_atom394 = new BitSet(new long[]{0x0000000000400000L});
    public static final BitSet FOLLOW_RPAREN_in_atom396 = new BitSet(new long[]{0x0000000000000002L});
    public static final BitSet FOLLOW_name_in_var413 = new BitSet(new long[]{0x0000000000000002L});
    public static final BitSet FOLLOW_name_in_var419 = new BitSet(new long[]{0x0000000000800000L});
    public static final BitSet FOLLOW_index_in_var421 = new BitSet(new long[]{0x0000000000000002L});
    public static final BitSet FOLLOW_LSQUARE_in_index443 = new BitSet(new long[]{0x0000000001000000L});
    public static final BitSet FOLLOW_INT_in_index447 = new BitSet(new long[]{0x0000000002000000L});
    public static final BitSet FOLLOW_RSQUARE_in_index449 = new BitSet(new long[]{0x0000000000000002L});
    public static final BitSet FOLLOW_NAME_in_name467 = new BitSet(new long[]{0x0020000000000002L});
    public static final BitSet FOLLOW_53_in_name470 = new BitSet(new long[]{0x0000000004000000L});
    public static final BitSet FOLLOW_NAME_in_name473 = new BitSet(new long[]{0x0020000000000002L});
    public static final BitSet FOLLOW_set_in_num0 = new BitSet(new long[]{0x0000000000000002L});
    public static final BitSet FOLLOW_PHRASE_in_str507 = new BitSet(new long[]{0x0000000000000002L});
    public static final BitSet FOLLOW_fnName_in_fn520 = new BitSet(new long[]{0x0000000000200000L});
    public static final BitSet FOLLOW_LPAREN_in_fn522 = new BitSet(new long[]{0x000001FFDD240400L});
    public static final BitSet FOLLOW_condExpr_in_fn524 = new BitSet(new long[]{0x0000000020400000L});
    public static final BitSet FOLLOW_COMMA_in_fn527 = new BitSet(new long[]{0x000001FFDD240400L});
    public static final BitSet FOLLOW_condExpr_in_fn529 = new BitSet(new long[]{0x0000000020400000L});
    public static final BitSet FOLLOW_RPAREN_in_fn533 = new BitSet(new long[]{0x0000000000000002L});
    public static final BitSet FOLLOW_set_in_fnName0 = new BitSet(new long[]{0x0000000000000002L});

}

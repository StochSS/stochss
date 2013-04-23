

  package com.google.appengine.api.search.query;

import org.antlr.runtime.*;

public class QueryLexer extends Lexer {
    public static final int FUNCTION=7;
    public static final int LT=17;
    public static final int GEO_POINT_FN=29;
    public static final int FIX=30;
    public static final int ESC=34;
    public static final int OCTAL_ESC=36;
    public static final int FUZZY=8;
    public static final int NOT=27;
    public static final int DISTANCE_FN=28;
    public static final int AND=25;
    public static final int ESCAPED_CHAR=40;
    public static final int EOF=-1;
    public static final int LPAREN=23;
    public static final int HAS=22;
    public static final int CHAR_SEQ=37;
    public static final int QUOTE=33;
    public static final int RPAREN=24;
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

    public QueryLexer() {;}
    public QueryLexer(CharStream input) {
        this(input, new RecognizerSharedState());
    }
    public QueryLexer(CharStream input, RecognizerSharedState state) {
        super(input,state);

    }
    public String getGrammarFileName() { return ""; }

    public final void mT__43() throws RecognitionException {
        try {
            int _type = T__43;
            int _channel = DEFAULT_TOKEN_CHANNEL;
            {
            match('-');

            }

            state.type = _type;
            state.channel = _channel;
        }
        finally {
        }
    }

    public final void mT__44() throws RecognitionException {
        try {
            int _type = T__44;
            int _channel = DEFAULT_TOKEN_CHANNEL;
            {
            match(',');

            }

            state.type = _type;
            state.channel = _channel;
        }
        finally {
        }
    }

    public final void mT__45() throws RecognitionException {
        try {
            int _type = T__45;
            int _channel = DEFAULT_TOKEN_CHANNEL;
            {
            match('\\');

            }

            state.type = _type;
            state.channel = _channel;
        }
        finally {
        }
    }

    public final void mHAS() throws RecognitionException {
        try {
            int _type = HAS;
            int _channel = DEFAULT_TOKEN_CHANNEL;
            {
            match(':');

            }

            state.type = _type;
            state.channel = _channel;
        }
        finally {
        }
    }

    public final void mOR() throws RecognitionException {
        try {
            int _type = OR;
            int _channel = DEFAULT_TOKEN_CHANNEL;
            {
            match("OR");

            }

            state.type = _type;
            state.channel = _channel;
        }
        finally {
        }
    }

    public final void mAND() throws RecognitionException {
        try {
            int _type = AND;
            int _channel = DEFAULT_TOKEN_CHANNEL;
            {
            match("AND");

            }

            state.type = _type;
            state.channel = _channel;
        }
        finally {
        }
    }

    public final void mNOT() throws RecognitionException {
        try {
            int _type = NOT;
            int _channel = DEFAULT_TOKEN_CHANNEL;
            {
            match("NOT");

            }

            state.type = _type;
            state.channel = _channel;
        }
        finally {
        }
    }

    public final void mREWRITE() throws RecognitionException {
        try {
            int _type = REWRITE;
            int _channel = DEFAULT_TOKEN_CHANNEL;
            {
            match('~');

            }

            state.type = _type;
            state.channel = _channel;
        }
        finally {
        }
    }

    public final void mFIX() throws RecognitionException {
        try {
            int _type = FIX;
            int _channel = DEFAULT_TOKEN_CHANNEL;
            {
            match('+');

            }

            state.type = _type;
            state.channel = _channel;
        }
        finally {
        }
    }

    public final void mDISTANCE_FN() throws RecognitionException {
        try {
            int _type = DISTANCE_FN;
            int _channel = DEFAULT_TOKEN_CHANNEL;
            {
            match("distance");

            }

            state.type = _type;
            state.channel = _channel;
        }
        finally {
        }
    }

    public final void mGEO_POINT_FN() throws RecognitionException {
        try {
            int _type = GEO_POINT_FN;
            int _channel = DEFAULT_TOKEN_CHANNEL;
            {
            match("geopoint");

            }

            state.type = _type;
            state.channel = _channel;
        }
        finally {
        }
    }

    public final void mESC() throws RecognitionException {
        try {
            int _type = ESC;
            int _channel = DEFAULT_TOKEN_CHANNEL;
            int alt1=3;
            int LA1_0 = input.LA(1);

            if ( (LA1_0=='\\') ) {
                switch ( input.LA(2) ) {
                case '\"':
                case '\\':
                    {
                    alt1=1;
                    }
                    break;
                case 'u':
                    {
                    alt1=2;
                    }
                    break;
                case '0':
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                    {
                    alt1=3;
                    }
                    break;
                default:
                    NoViableAltException nvae =
                        new NoViableAltException("", 1, 1, input);

                    throw nvae;
                }

            }
            else {
                NoViableAltException nvae =
                    new NoViableAltException("", 1, 0, input);

                throw nvae;
            }
            switch (alt1) {
                case 1 :
                    {
                    match('\\');
                    if ( input.LA(1)=='\"'||input.LA(1)=='\\' ) {
                        input.consume();

                    }
                    else {
                        MismatchedSetException mse = new MismatchedSetException(null,input);
                        recover(mse);
                        throw mse;}

                    }
                    break;
                case 2 :
                    {
                    mUNICODE_ESC();

                    }
                    break;
                case 3 :
                    {
                    mOCTAL_ESC();

                    }
                    break;

            }
            state.type = _type;
            state.channel = _channel;
        }
        finally {
        }
    }

    public final void mWS() throws RecognitionException {
        try {
            int _type = WS;
            int _channel = DEFAULT_TOKEN_CHANNEL;
            {
            if ( (input.LA(1)>='\t' && input.LA(1)<='\n')||(input.LA(1)>='\f' && input.LA(1)<='\r')||input.LA(1)==' ' ) {
                input.consume();

            }
            else {
                MismatchedSetException mse = new MismatchedSetException(null,input);
                recover(mse);
                throw mse;}

            }

            state.type = _type;
            state.channel = _channel;
        }
        finally {
        }
    }

    public final void mLPAREN() throws RecognitionException {
        try {
            int _type = LPAREN;
            int _channel = DEFAULT_TOKEN_CHANNEL;
            {
            match('(');

            }

            state.type = _type;
            state.channel = _channel;
        }
        finally {
        }
    }

    public final void mRPAREN() throws RecognitionException {
        try {
            int _type = RPAREN;
            int _channel = DEFAULT_TOKEN_CHANNEL;
            {
            match(')');

            }

            state.type = _type;
            state.channel = _channel;
        }
        finally {
        }
    }

    public final void mLT() throws RecognitionException {
        try {
            int _type = LT;
            int _channel = DEFAULT_TOKEN_CHANNEL;
            {
            match('<');

            }

            state.type = _type;
            state.channel = _channel;
        }
        finally {
        }
    }

    public final void mGT() throws RecognitionException {
        try {
            int _type = GT;
            int _channel = DEFAULT_TOKEN_CHANNEL;
            {
            match('>');

            }

            state.type = _type;
            state.channel = _channel;
        }
        finally {
        }
    }

    public final void mGE() throws RecognitionException {
        try {
            int _type = GE;
            int _channel = DEFAULT_TOKEN_CHANNEL;
            {
            match(">=");

            }

            state.type = _type;
            state.channel = _channel;
        }
        finally {
        }
    }

    public final void mLE() throws RecognitionException {
        try {
            int _type = LE;
            int _channel = DEFAULT_TOKEN_CHANNEL;
            {
            match("<=");

            }

            state.type = _type;
            state.channel = _channel;
        }
        finally {
        }
    }

    public final void mNE() throws RecognitionException {
        try {
            int _type = NE;
            int _channel = DEFAULT_TOKEN_CHANNEL;
            {
            match("!=");

            }

            state.type = _type;
            state.channel = _channel;
        }
        finally {
        }
    }

    public final void mEQ() throws RecognitionException {
        try {
            int _type = EQ;
            int _channel = DEFAULT_TOKEN_CHANNEL;
            {
            match('=');

            }

            state.type = _type;
            state.channel = _channel;
        }
        finally {
        }
    }

    public final void mQUOTE() throws RecognitionException {
        try {
            int _type = QUOTE;
            int _channel = DEFAULT_TOKEN_CHANNEL;
            {
            match('\"');

            }

            state.type = _type;
            state.channel = _channel;
        }
        finally {
        }
    }

    public final void mTEXT() throws RecognitionException {
        try {
            int _type = TEXT;
            int _channel = DEFAULT_TOKEN_CHANNEL;
            int alt4=2;
            int LA4_0 = input.LA(1);

            if ( (LA4_0=='!'||(LA4_0>='#' && LA4_0<='\'')||LA4_0=='*'||(LA4_0>='.' && LA4_0<='/')||LA4_0==';'||(LA4_0>='?' && LA4_0<='}')||(LA4_0>='\u00A1' && LA4_0<='\uFFEE')) ) {
                alt4=1;
            }
            else if ( (LA4_0=='-'||(LA4_0>='0' && LA4_0<='9')) ) {
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
                    mCHAR_SEQ();

                    }
                    break;
                case 2 :
                    {
                    int alt2=2;
                    int LA2_0 = input.LA(1);

                    if ( (LA2_0=='-') ) {
                        alt2=1;
                    }
                    switch (alt2) {
                        case 1 :
                            {
                            match('-');

                            }
                            break;

                    }

                    mDIGIT();
                    loop3:
                    do {
                        int alt3=5;
                        int LA3_0 = input.LA(1);

                        if ( (LA3_0=='!'||(LA3_0>='#' && LA3_0<='\'')||(LA3_0>='*' && LA3_0<='+')||(LA3_0>='-' && LA3_0<='9')||LA3_0==';'||(LA3_0>='?' && LA3_0<='[')||(LA3_0>=']' && LA3_0<='}')||(LA3_0>='\u00A1' && LA3_0<='\uFFEE')) ) {
                            alt3=1;
                        }
                        else if ( (LA3_0=='\\') ) {
                            switch ( input.LA(2) ) {
                            case '\"':
                            case '+':
                            case ',':
                            case ':':
                            case '<':
                            case '=':
                            case '>':
                            case '\\':
                            case '~':
                                {
                                alt3=2;
                                }
                                break;
                            case 'u':
                                {
                                alt3=3;
                                }
                                break;
                            case '0':
                            case '1':
                            case '2':
                            case '3':
                            case '4':
                            case '5':
                            case '6':
                            case '7':
                                {
                                alt3=4;
                                }
                                break;

                            }

                        }

                        switch (alt3) {
                    	case 1 :
                    	    {
                    	    mMID_CHAR();

                    	    }
                    	    break;
                    	case 2 :
                    	    {
                    	    mESCAPED_CHAR();

                    	    }
                    	    break;
                    	case 3 :
                    	    {
                    	    mUNICODE_ESC();

                    	    }
                    	    break;
                    	case 4 :
                    	    {
                    	    mOCTAL_ESC();

                    	    }
                    	    break;

                    	default :
                    	    break loop3;
                        }
                    } while (true);

                    }
                    break;

            }
            state.type = _type;
            state.channel = _channel;
        }
        finally {
        }
    }

    public final void mCHAR_SEQ() throws RecognitionException {
        try {
            {
            int alt5=4;
            int LA5_0 = input.LA(1);

            if ( (LA5_0=='!'||(LA5_0>='#' && LA5_0<='\'')||LA5_0=='*'||(LA5_0>='.' && LA5_0<='/')||LA5_0==';'||(LA5_0>='?' && LA5_0<='[')||(LA5_0>=']' && LA5_0<='}')||(LA5_0>='\u00A1' && LA5_0<='\uFFEE')) ) {
                alt5=1;
            }
            else if ( (LA5_0=='\\') ) {
                switch ( input.LA(2) ) {
                case '\"':
                case '+':
                case ',':
                case ':':
                case '<':
                case '=':
                case '>':
                case '\\':
                case '~':
                    {
                    alt5=2;
                    }
                    break;
                case 'u':
                    {
                    alt5=3;
                    }
                    break;
                case '0':
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                    {
                    alt5=4;
                    }
                    break;
                default:
                    NoViableAltException nvae =
                        new NoViableAltException("", 5, 2, input);

                    throw nvae;
                }

            }
            else {
                NoViableAltException nvae =
                    new NoViableAltException("", 5, 0, input);

                throw nvae;
            }
            switch (alt5) {
                case 1 :
                    {
                    mSTART_CHAR();

                    }
                    break;
                case 2 :
                    {
                    mESCAPED_CHAR();

                    }
                    break;
                case 3 :
                    {
                    mUNICODE_ESC();

                    }
                    break;
                case 4 :
                    {
                    mOCTAL_ESC();

                    }
                    break;

            }

            loop6:
            do {
                int alt6=5;
                int LA6_0 = input.LA(1);

                if ( (LA6_0=='!'||(LA6_0>='#' && LA6_0<='\'')||(LA6_0>='*' && LA6_0<='+')||(LA6_0>='-' && LA6_0<='9')||LA6_0==';'||(LA6_0>='?' && LA6_0<='[')||(LA6_0>=']' && LA6_0<='}')||(LA6_0>='\u00A1' && LA6_0<='\uFFEE')) ) {
                    alt6=1;
                }
                else if ( (LA6_0=='\\') ) {
                    switch ( input.LA(2) ) {
                    case '\"':
                    case '+':
                    case ',':
                    case ':':
                    case '<':
                    case '=':
                    case '>':
                    case '\\':
                    case '~':
                        {
                        alt6=2;
                        }
                        break;
                    case 'u':
                        {
                        alt6=3;
                        }
                        break;
                    case '0':
                    case '1':
                    case '2':
                    case '3':
                    case '4':
                    case '5':
                    case '6':
                    case '7':
                        {
                        alt6=4;
                        }
                        break;

                    }

                }

                switch (alt6) {
            	case 1 :
            	    {
            	    mMID_CHAR();

            	    }
            	    break;
            	case 2 :
            	    {
            	    mESCAPED_CHAR();

            	    }
            	    break;
            	case 3 :
            	    {
            	    mUNICODE_ESC();

            	    }
            	    break;
            	case 4 :
            	    {
            	    mOCTAL_ESC();

            	    }
            	    break;

            	default :
            	    break loop6;
                }
            } while (true);

            }

        }
        finally {
        }
    }

    public final void mUNICODE_ESC() throws RecognitionException {
        try {
            {
            match('\\');
            match('u');
            mHEX_DIGIT();
            mHEX_DIGIT();
            mHEX_DIGIT();
            mHEX_DIGIT();

            }

        }
        finally {
        }
    }

    public final void mOCTAL_ESC() throws RecognitionException {
        try {
            int alt7=3;
            int LA7_0 = input.LA(1);

            if ( (LA7_0=='\\') ) {
                int LA7_1 = input.LA(2);

                if ( ((LA7_1>='0' && LA7_1<='3')) ) {
                    int LA7_2 = input.LA(3);

                    if ( ((LA7_2>='0' && LA7_2<='7')) ) {
                        int LA7_4 = input.LA(4);

                        if ( ((LA7_4>='0' && LA7_4<='7')) ) {
                            alt7=1;
                        }
                        else {
                            alt7=2;}
                    }
                    else {
                        alt7=3;}
                }
                else if ( ((LA7_1>='4' && LA7_1<='7')) ) {
                    int LA7_3 = input.LA(3);

                    if ( ((LA7_3>='0' && LA7_3<='7')) ) {
                        alt7=2;
                    }
                    else {
                        alt7=3;}
                }
                else {
                    NoViableAltException nvae =
                        new NoViableAltException("", 7, 1, input);

                    throw nvae;
                }
            }
            else {
                NoViableAltException nvae =
                    new NoViableAltException("", 7, 0, input);

                throw nvae;
            }
            switch (alt7) {
                case 1 :
                    {
                    match('\\');
                    {
                    matchRange('0','3');

                    }

                    {
                    matchRange('0','7');

                    }

                    {
                    matchRange('0','7');

                    }

                    }
                    break;
                case 2 :
                    {
                    match('\\');
                    {
                    matchRange('0','7');

                    }

                    {
                    matchRange('0','7');

                    }

                    }
                    break;
                case 3 :
                    {
                    match('\\');
                    {
                    matchRange('0','7');

                    }

                    }
                    break;

            }
        }
        finally {
        }
    }

    public final void mDIGIT() throws RecognitionException {
        try {
            {
            matchRange('0','9');

            }

        }
        finally {
        }
    }

    public final void mHEX_DIGIT() throws RecognitionException {
        try {
            {
            if ( (input.LA(1)>='0' && input.LA(1)<='9')||(input.LA(1)>='A' && input.LA(1)<='F')||(input.LA(1)>='a' && input.LA(1)<='f') ) {
                input.consume();

            }
            else {
                MismatchedSetException mse = new MismatchedSetException(null,input);
                recover(mse);
                throw mse;}

            }

        }
        finally {
        }
    }

    public final void mSTART_CHAR() throws RecognitionException {
        try {
            {
            if ( input.LA(1)=='!'||(input.LA(1)>='#' && input.LA(1)<='\'')||input.LA(1)=='*'||(input.LA(1)>='.' && input.LA(1)<='/')||input.LA(1)==';'||(input.LA(1)>='?' && input.LA(1)<='[')||(input.LA(1)>=']' && input.LA(1)<='}')||(input.LA(1)>='\u00A1' && input.LA(1)<='\uFFEE') ) {
                input.consume();

            }
            else {
                MismatchedSetException mse = new MismatchedSetException(null,input);
                recover(mse);
                throw mse;}

            }

        }
        finally {
        }
    }

    public final void mMID_CHAR() throws RecognitionException {
        try {
            {
            if ( input.LA(1)=='!'||(input.LA(1)>='#' && input.LA(1)<='\'')||(input.LA(1)>='*' && input.LA(1)<='+')||(input.LA(1)>='-' && input.LA(1)<='9')||input.LA(1)==';'||(input.LA(1)>='?' && input.LA(1)<='[')||(input.LA(1)>=']' && input.LA(1)<='}')||(input.LA(1)>='\u00A1' && input.LA(1)<='\uFFEE') ) {
                input.consume();

            }
            else {
                MismatchedSetException mse = new MismatchedSetException(null,input);
                recover(mse);
                throw mse;}

            }

        }
        finally {
        }
    }

    public final void mESCAPED_CHAR() throws RecognitionException {
        try {
            int alt8=9;
            alt8 = dfa8.predict(input);
            switch (alt8) {
                case 1 :
                    {
                    match("\\,");

                    }
                    break;
                case 2 :
                    {
                    match("\\:");

                    }
                    break;
                case 3 :
                    {
                    match("\\=");

                    }
                    break;
                case 4 :
                    {
                    match("\\<");

                    }
                    break;
                case 5 :
                    {
                    match("\\>");

                    }
                    break;
                case 6 :
                    {
                    match("\\+");

                    }
                    break;
                case 7 :
                    {
                    match("\\~");

                    }
                    break;
                case 8 :
                    {
                    match("\\\"");

                    }
                    break;
                case 9 :
                    {
                    match("\\\\");

                    }
                    break;

            }
        }
        finally {
        }
    }

    public void mTokens() throws RecognitionException {
        int alt9=23;
        alt9 = dfa9.predict(input);
        switch (alt9) {
            case 1 :
                {
                mT__43();

                }
                break;
            case 2 :
                {
                mT__44();

                }
                break;
            case 3 :
                {
                mT__45();

                }
                break;
            case 4 :
                {
                mHAS();

                }
                break;
            case 5 :
                {
                mOR();

                }
                break;
            case 6 :
                {
                mAND();

                }
                break;
            case 7 :
                {
                mNOT();

                }
                break;
            case 8 :
                {
                mREWRITE();

                }
                break;
            case 9 :
                {
                mFIX();

                }
                break;
            case 10 :
                {
                mDISTANCE_FN();

                }
                break;
            case 11 :
                {
                mGEO_POINT_FN();

                }
                break;
            case 12 :
                {
                mESC();

                }
                break;
            case 13 :
                {
                mWS();

                }
                break;
            case 14 :
                {
                mLPAREN();

                }
                break;
            case 15 :
                {
                mRPAREN();

                }
                break;
            case 16 :
                {
                mLT();

                }
                break;
            case 17 :
                {
                mGT();

                }
                break;
            case 18 :
                {
                mGE();

                }
                break;
            case 19 :
                {
                mLE();

                }
                break;
            case 20 :
                {
                mNE();

                }
                break;
            case 21 :
                {
                mEQ();

                }
                break;
            case 22 :
                {
                mQUOTE();

                }
                break;
            case 23 :
                {
                mTEXT();

                }
                break;

        }

    }

    protected DFA8 dfa8 = new DFA8(this);
    protected DFA9 dfa9 = new DFA9(this);
    static final String DFA8_eotS =
        "\13\uffff";
    static final String DFA8_eofS =
        "\13\uffff";
    static final String DFA8_minS =
        "\1\134\1\42\11\uffff";
    static final String DFA8_maxS =
        "\1\134\1\176\11\uffff";
    static final String DFA8_acceptS =
        "\2\uffff\1\1\1\2\1\3\1\4\1\5\1\6\1\7\1\10\1\11";
    static final String DFA8_specialS =
        "\13\uffff}>";
    static final String[] DFA8_transitionS = {
            "\1\1",
            "\1\11\10\uffff\1\7\1\2\15\uffff\1\3\1\uffff\1\5\1\4\1\6\35"+
            "\uffff\1\12\41\uffff\1\10",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            ""
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
            return "328:10: fragment ESCAPED_CHAR : ( '\\\\,' | '\\\\:' | '\\\\=' | '\\\\<' | '\\\\>' | '\\\\+' | '\\\\~' | '\\\\\\\"' | '\\\\\\\\' );";
        }
    }
    static final String DFA9_eotS =
        "\1\uffff\1\25\1\uffff\1\31\1\uffff\3\24\2\uffff\2\24\3\uffff\1\42"+
        "\1\44\1\24\4\uffff\1\46\1\uffff\1\46\1\uffff\2\46\1\52\4\24\7\uffff"+
        "\2\46\1\uffff\1\61\1\62\2\24\1\uffff\1\46\2\uffff\2\24\1\uffff\2"+
        "\24\1\46\4\24\1\77\1\100\2\uffff";
    static final String DFA9_eofS =
        "\101\uffff";
    static final String DFA9_minS =
        "\1\11\1\60\1\uffff\1\42\1\uffff\1\122\1\116\1\117\2\uffff\1\151"+
        "\1\145\3\uffff\3\75\4\uffff\1\41\1\60\1\41\1\uffff\3\41\1\104\1"+
        "\124\1\163\1\157\6\uffff\1\60\2\41\1\uffff\2\41\1\164\1\160\1\60"+
        "\1\41\2\uffff\1\141\1\157\1\60\1\156\1\151\1\41\1\143\1\156\1\145"+
        "\1\164\2\41\2\uffff";
    static final String DFA9_maxS =
        "\1\uffee\1\71\1\uffff\1\176\1\uffff\1\122\1\116\1\117\2\uffff\1"+
        "\151\1\145\3\uffff\3\75\4\uffff\1\uffee\1\146\1\uffee\1\uffff\3"+
        "\uffee\1\104\1\124\1\163\1\157\6\uffff\1\146\2\uffee\1\uffff\2\uffee"+
        "\1\164\1\160\1\146\1\uffee\2\uffff\1\141\1\157\1\146\1\156\1\151"+
        "\1\uffee\1\143\1\156\1\145\1\164\2\uffee\2\uffff";
    static final String DFA9_acceptS =
        "\2\uffff\1\2\1\uffff\1\4\3\uffff\1\10\1\11\2\uffff\1\15\1\16\1\17"+
        "\3\uffff\1\25\1\26\1\27\1\1\3\uffff\1\3\7\uffff\1\23\1\20\1\22\1"+
        "\21\1\24\1\14\3\uffff\1\5\6\uffff\1\6\1\7\14\uffff\1\12\1\13";
    static final String DFA9_specialS =
        "\101\uffff}>";
    static final String[] DFA9_transitionS = {
            "\2\14\1\uffff\2\14\22\uffff\1\14\1\21\1\23\5\24\1\15\1\16\1"+
            "\24\1\11\1\2\1\1\14\24\1\4\1\24\1\17\1\22\1\20\2\24\1\6\14\24"+
            "\1\7\1\5\14\24\1\3\7\24\1\12\2\24\1\13\26\24\1\10\42\uffff\uff4e"+
            "\24",
            "\12\24",
            "",
            "\1\26\10\uffff\2\24\3\uffff\4\32\4\33\2\uffff\1\24\1\uffff"+
            "\3\24\35\uffff\1\30\30\uffff\1\27\10\uffff\1\24",
            "",
            "\1\34",
            "\1\35",
            "\1\36",
            "",
            "",
            "\1\37",
            "\1\40",
            "",
            "",
            "",
            "\1\41",
            "\1\43",
            "\1\45",
            "",
            "",
            "",
            "",
            "\1\24\1\uffff\5\24\2\uffff\2\24\1\uffff\15\24\1\uffff\1\24"+
            "\3\uffff\77\24\43\uffff\uff4e\24",
            "\12\47\7\uffff\6\47\32\uffff\6\47",
            "\1\24\1\uffff\5\24\2\uffff\2\24\1\uffff\15\24\1\uffff\1\24"+
            "\3\uffff\77\24\43\uffff\uff4e\24",
            "",
            "\1\24\1\uffff\5\24\2\uffff\2\24\1\uffff\3\24\10\50\2\24\1\uffff"+
            "\1\24\3\uffff\77\24\43\uffff\uff4e\24",
            "\1\24\1\uffff\5\24\2\uffff\2\24\1\uffff\3\24\10\51\2\24\1\uffff"+
            "\1\24\3\uffff\77\24\43\uffff\uff4e\24",
            "\1\24\1\uffff\5\24\2\uffff\2\24\1\uffff\15\24\1\uffff\1\24"+
            "\3\uffff\77\24\43\uffff\uff4e\24",
            "\1\53",
            "\1\54",
            "\1\55",
            "\1\56",
            "",
            "",
            "",
            "",
            "",
            "",
            "\12\57\7\uffff\6\57\32\uffff\6\57",
            "\1\24\1\uffff\5\24\2\uffff\2\24\1\uffff\3\24\10\60\2\24\1\uffff"+
            "\1\24\3\uffff\77\24\43\uffff\uff4e\24",
            "\1\24\1\uffff\5\24\2\uffff\2\24\1\uffff\15\24\1\uffff\1\24"+
            "\3\uffff\77\24\43\uffff\uff4e\24",
            "",
            "\1\24\1\uffff\5\24\2\uffff\2\24\1\uffff\15\24\1\uffff\1\24"+
            "\3\uffff\77\24\43\uffff\uff4e\24",
            "\1\24\1\uffff\5\24\2\uffff\2\24\1\uffff\15\24\1\uffff\1\24"+
            "\3\uffff\77\24\43\uffff\uff4e\24",
            "\1\63",
            "\1\64",
            "\12\65\7\uffff\6\65\32\uffff\6\65",
            "\1\24\1\uffff\5\24\2\uffff\2\24\1\uffff\15\24\1\uffff\1\24"+
            "\3\uffff\77\24\43\uffff\uff4e\24",
            "",
            "",
            "\1\66",
            "\1\67",
            "\12\70\7\uffff\6\70\32\uffff\6\70",
            "\1\71",
            "\1\72",
            "\1\24\1\uffff\5\24\2\uffff\2\24\1\uffff\15\24\1\uffff\1\24"+
            "\3\uffff\77\24\43\uffff\uff4e\24",
            "\1\73",
            "\1\74",
            "\1\75",
            "\1\76",
            "\1\24\1\uffff\5\24\2\uffff\2\24\1\uffff\15\24\1\uffff\1\24"+
            "\3\uffff\77\24\43\uffff\uff4e\24",
            "\1\24\1\uffff\5\24\2\uffff\2\24\1\uffff\15\24\1\uffff\1\24"+
            "\3\uffff\77\24\43\uffff\uff4e\24",
            "",
            ""
    };

    static final short[] DFA9_eot = DFA.unpackEncodedString(DFA9_eotS);
    static final short[] DFA9_eof = DFA.unpackEncodedString(DFA9_eofS);
    static final char[] DFA9_min = DFA.unpackEncodedStringToUnsignedChars(DFA9_minS);
    static final char[] DFA9_max = DFA.unpackEncodedStringToUnsignedChars(DFA9_maxS);
    static final short[] DFA9_accept = DFA.unpackEncodedString(DFA9_acceptS);
    static final short[] DFA9_special = DFA.unpackEncodedString(DFA9_specialS);
    static final short[][] DFA9_transition;

    static {
        int numStates = DFA9_transitionS.length;
        DFA9_transition = new short[numStates][];
        for (int i=0; i<numStates; i++) {
            DFA9_transition[i] = DFA.unpackEncodedString(DFA9_transitionS[i]);
        }
    }

    class DFA9 extends DFA {

        public DFA9(BaseRecognizer recognizer) {
            this.recognizer = recognizer;
            this.decisionNumber = 9;
            this.eot = DFA9_eot;
            this.eof = DFA9_eof;
            this.min = DFA9_min;
            this.max = DFA9_max;
            this.accept = DFA9_accept;
            this.special = DFA9_special;
            this.transition = DFA9_transition;
        }
        public String getDescription() {
            return "1:1: Tokens : ( T__43 | T__44 | T__45 | HAS | OR | AND | NOT | REWRITE | FIX | DISTANCE_FN | GEO_POINT_FN | ESC | WS | LPAREN | RPAREN | LT | GT | GE | LE | NE | EQ | QUOTE | TEXT );";
        }
    }

}

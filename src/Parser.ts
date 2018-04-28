import { Token } from "./Token";
import { Scanner } from "./Scanner";
import { Constant, Expression, Binary } from "./Expression";

export class Parser {
    lex: Scanner;
    tok: Token;

    constructor(input: string) {
        this.lex = new Scanner(input);
        this.tok = Token.EMPTY;
    }

    match(matchToken: Token) {
        if(this.tok == matchToken) this.tok = this.lex.nextToken();
        else this.expected(matchToken.toString());
    }
    expected(s: string) {
        throw new Error('Expected: '+s+', Found: ' + this.tok.toString());
    }

    parse(): Expression | undefined {
        this.tok = this.lex.nextToken();
        let e: Expression | undefined = this.expr();
        this.match(Token.EOF);
        return e;
    }

    expr(): Expression | undefined {
        let e: Expression | undefined = this.term();
        let t: Token = this.tok;
        while(t == Token.PLUS || t == Token.MINUS) {
            this.match(t);
            /** 2 lines below is typescript things.. */
            let term: Expression | undefined = this.term();
            if(term == undefined || e == undefined)  return; 
            e = new Binary(e, t, term);
            t = this.tok;
        }
        return e;
    }

    term(): Expression | undefined {
        let e: Expression | undefined = this.factor();
        let t: Token = this.tok;

        while(t == Token.STAR || t == Token.SLASH) {
            this.match(t);
            /** 2 lines below is typescript things.. */
            let factor: Expression | undefined = this.factor();
            if(factor == undefined || e == undefined)  return; 
            e = new Binary(e, t, factor);
            t = this.tok;
        }
        return e;
    }

    factor(): Expression | undefined {
        if(this.tok == Token.NUMBER) {
            let c: Expression = new Constant(this.lex.nval);
            this.match(Token.NUMBER);
            return c;
        }
        if(this.tok == Token.LEFT) {
            this.match(Token.LEFT);
            let e: Expression | undefined = this.expr();
            this.match(Token.RIGHT);
            return e;
        }
        this.expected("Factor");
    }
}


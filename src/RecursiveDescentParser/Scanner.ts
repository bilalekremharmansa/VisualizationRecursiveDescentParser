import { Token, TokenParser } from "./Token";
import { Constant } from "./Expression";

export class Scanner {
    source: string;
    prev: number;
    next: number;
    tok: Token;
    nval: number;
    sval: string;

    constructor(input: string) {
        this.source = input;

        this.prev = 0;
        this.next = 0;
        this.tok = Token.EMPTY;

        this.nval = 0;
        this.sval = '';
    }

    getNumber() {
        while (this.next < this.source.length) {
            let c:string = this.source.charAt(this.next);
            if (c=='.' || Scanner.isDigit(c)) this.next++;
            else break;
        }
        this.tok = Token.NUMBER; 
        let s: string = this.source.substring(this.prev, this.next);
        this.nval = parseFloat(s);
    }
    static isDigit(character: string): boolean{
        return character.length === 1 && /^\d+$/.test(character);
    }

    getIdent() {
        while (this.next < this.source.length) {
            let c: string = this.source.charAt(this.next);
            if (Scanner.isLetter(c) || Scanner.isDigit(c)) this.next++;
            else break;
        }
        this.sval = this.source.substring(this.prev, this.next);
        this.tok = Token.IDENT;
    }
    static isLetter(character: string): boolean {
        return character.length === 1 && /[a-z]/i.test(character);
    }

    /** Returns next token after reading a sufficient number of chars */   
    nextToken(): Token{
        this.nval = 0;
        this.sval = '';
        let c: string;
        do {
        if (this.next >= this.source.length) return (this.tok = Token.EOF);
            c = this.source.charAt(this.next++);  //read next char
        } while (Scanner.isWhiteSpace(c));
        this.prev = this.next-1;
        if (Scanner.isLetter(c)) this.getIdent();
        else if (Scanner.isDigit(c)) this.getNumber();
        else this.tok = TokenParser.valueOf(c);  //tok = c;
        return this.tok;
    }
    static isWhiteSpace(character: string): boolean {
        return character.length === 1 && /\s/.test(character);
    }

    /** String representation of the current token */   
    toString(): string { 
        let s: string = this.tok.toString(); 
        if (this.tok == Token.NUMBER) return Constant.numToStr(this.nval);
        if (this.tok == Token.IDENT)  return this.sval;
        return s;
    }
    
}
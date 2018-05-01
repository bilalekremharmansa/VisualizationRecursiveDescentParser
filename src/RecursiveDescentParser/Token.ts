export enum Token {
    EMPTY = '',
    LEFT = "(", 
    RIGHT = ")",
    EQUAL = "=",
    PERIOD = ".",
    SEMCOL = ";", 
    PLUS = "+",
    MINUS = "-",
    STAR = "*",
    SLASH = "/",
    COMMA = ",",
    IDENT = "ident",
    NUMBER = "number",
    EOF = "eof"

    
}

export class TokenParser {
    public static valueOf(character: string): Token {
        if(character == '(') return Token.LEFT;
        if(character == ')') return Token.RIGHT;
        if(character == '=') return Token.EQUAL;
        if(character == '.') return Token.PERIOD;
        if(character == ';') return Token.SEMCOL;
        if(character == '+') return Token.PLUS;
        if(character == '-') return Token.MINUS;
        if(character == '*') return Token.STAR;
        if(character == '/') return Token.SLASH;
        if(character == ',') return Token.COMMA;
        if(character == 'ident') return Token.IDENT;
        if(character == 'number') return Token.NUMBER;
        return Token.EOF;
    }
}
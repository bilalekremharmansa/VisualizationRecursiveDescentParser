import { Token } from "./Token";
import { Scanner } from "./Scanner";
import { Constant, Expression, Binary } from "./Expression";
import { RDPModel } from "../RDPModel";
import { State, StateStatus } from "../State";
import { Shape, RecursiveFunc, Point } from "../Draw";
import { RDPView } from "../RDPView";


/** Parser could be RecursiveDescentParser module, this is more clear. */
export class Parser {
    lex: Scanner;
    tok: Token;
    model: RDPModel | undefined;
    
    constructor(input: string) {
        this.lex = new Scanner(input);
        this.tok = Token.EMPTY;
    }

    match(matchToken: Token) {
        if(this.tok == matchToken) {
            this.tok = this.lex.nextToken();
        }
        else this.expected(matchToken.toString());
    }
    expected(s: string) {
        throw new Error('Expected: '+s+', Found: ' + this.tok.toString());
    }

    takePoint(): Point{
        if(this.model != undefined) {
            let point = this.model.takePoint();
            if(point != undefined) return point;
        }
        return new Point(0,0);
    }
    checkPoint(point: Point, status: StateStatus, name: string, region: string,
                                        props?: { [field: string]: string; }) {
        let shape: Shape = new RecursiveFunc(point, name, props);
        let tokenIndex: number;
        switch (this.tok) {
            case Token.NUMBER:
                tokenIndex = Math.floor((this.lex.prev + this.lex.next) / 2);
                break;
            case Token.EOF:
                tokenIndex = this.lex.next;
                break;
            default:
                tokenIndex = this.lex.prev;
                break;
        }

        let state:State = new State(status, this.tok, tokenIndex, region, shape);
        if(this.model != undefined) this.model.addState(state);
    }

    /** lazy referencing */
    attachModel(model: RDPModel) {
        this.model = model;
    }

    parse(): Expression | undefined {
        this.tok = this.lex.nextToken();
        
        //#state 
        let region = '';
        let point = this.takePoint();
        this.checkPoint(point, StateStatus.DRAW, 'Expression', region);

        let e: Expression | undefined = this.expr();

        //#state 
        if(e != undefined) this.checkPoint(point, StateStatus.DRAW, 'Expression', region, e.map);

        this.match(Token.EOF);
        return e;
    }

    expr(): Expression | undefined {
        let region = 'expression';
        let point = this.takePoint();
        this.checkPoint(point, StateStatus.DRAW, 'exp()', region);      

        let e: Expression | undefined = this.term();
        
        //#region
        if(e != undefined) this.checkPoint(point, StateStatus.DRAW, e.name, region, e.map);

        let t: Token = this.tok;
        while(t == Token.PLUS || t == Token.MINUS) {
            this.match(t);

            //#region 
            if(e != undefined){
                let map: { [field: string]: string; } = {};
                map['left'] = ''+e.toString();
                map['operator'] = t; 
                map['right'] = '';
                region = 'PLUSMINUS'
                this.checkPoint(point, StateStatus.DRAW, 'Binary', region, map);
            } 
        
            let term: Expression | undefined = this.term();
            if(term == undefined || e == undefined)  return; 
            e = new Binary(e, t, term);
            
            //#region
            if(e != undefined) this.checkPoint(point, StateStatus.DRAW, e.name, region, e.map);
            
            t = this.tok;
        }
        
        //#region 
        region= 'EXPRETURN';
        if(e != undefined) this.checkPoint(point, StateStatus.ERASE, e.name, region);

        return e;
    }

    term(): Expression | undefined {
        let region = 'TERM';
        let point = this.takePoint();
        this.checkPoint(point, StateStatus.DRAW, 'term()', region);   

        let e: Expression | undefined = this.factor();
       
        //#state 
        if(e != undefined) this.checkPoint(point, StateStatus.DRAW, e.name, region, e.map);

        let t: Token = this.tok;
        while(t == Token.STAR || t == Token.SLASH) {
            this.match(t);
            /** 2 lines below is typescript things.. */
            
             //#region 
            if(e != undefined){
                let map: { [field: string]: string; } = {};
                map['left'] = ''+e.toString();
                map['operator'] = t; 
                map['right'] = ''; 
                region = 'STARSLASH';
                this.checkPoint(point, StateStatus.DRAW, 'Binary', region, map);
            } 

            let factor: Expression | undefined = this.factor();
            if(factor == undefined || e == undefined)  return; 
            e = new Binary(e, t, factor);
            
            //#region 
            if(e != undefined) this.checkPoint(point, StateStatus.DRAW, e.name, region, e.map);

            t = this.tok;
        }
        
        //#region 
        region = 'TERMRETURN';
        if(e != undefined) this.checkPoint(point, StateStatus.ERASE, e.name, region);
        
        return e;
    }

    factor(): Expression | undefined {
        let region = 'FACTOR';
        let point = this.takePoint();
        this.checkPoint(point, StateStatus.DRAW, 'factor()', region); 
        region='CONSTANT';
        if(this.tok == Token.NUMBER) {
            let c: Expression = new Constant(this.lex.nval);
            
            //#state 
            this.checkPoint(point, StateStatus.DRAW, c.name, region, c.map);
            
            region='CONSTANTMATCH';
            this.checkPoint(point, StateStatus.DRAW, c.name, region, c.map);
            this.match(Token.NUMBER);
            
            region='CONSTANTRETURN';
            this.checkPoint(point, StateStatus.ERASE, c.name, region);
            return c;
        }
        region='LEFT';
        this.checkPoint(point, StateStatus.DRAW, 'factor()', region);
        if(this.tok == Token.LEFT) {
            region='LEFTMATCH';
            this.checkPoint(point, StateStatus.DRAW, 'factor()', region);
            this.match(Token.LEFT);

            region='FACTOREXP';
            this.checkPoint(point, StateStatus.DRAW, 'factor()', region);
            let e: Expression | undefined = this.expr();
            
            //#state 
            if(e != undefined) {
                this.checkPoint(point, StateStatus.DRAW, e.name, region, e.map);

                region='RIGHTMATCH';
                this.checkPoint(point, StateStatus.DRAW, e.name, region);
                this.match(Token.RIGHT);

                region='LEFTRETURN';
                this.checkPoint(point, StateStatus.ERASE, e.name, region);
            }

            return e;
        }

        this.expected("Factor");
    }
}


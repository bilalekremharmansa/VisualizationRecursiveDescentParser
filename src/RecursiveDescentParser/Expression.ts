import { Visualizable } from "../Visualizable";
import { Token } from "./Token";

export interface Expression extends Visualizable {
    /** Returns float value of this Expression */    
    fValue(): number;
    /** String representation of this Expression */   
    toString(): string;
    /** Converts this Expression to postfix (RPN) */   
    toPostfix(): string;
    /** some methods-fields from visualizable */
 }
 
 export class Constant implements Expression {
     num: number;
     name: string;
     map: { [field: string]: string; };
 
     constructor(value: number) {
         this.num = value;
 
         this.name = 'Constant';
         this.map = { };
 
         this.map['value'] = ''+this.num;
     }
 
     /** Returns float value of this Expression */
     fValue(): number {
         return this.num;
     }
     /** String representation of this Expression */
     toString(): string {
         return Constant.numToStr(this.num);
     }
     /** Converts this Expression to postfix (RPN) */
     toPostfix(): string {
         return ' ' + Constant.numToStr(this.num);
     }
 
     static numToStr(value: number): string {
         let s:string = '' + value;
         if(s.lastIndexOf('.0') != -1) {
             s = s.substring(0, s.length - 2);
         }
         return s;
     }
 }
 
 export class Binary implements Expression {
     left: Expression;
     operator: Token;
     right: Expression;
 
     name: string;
     map: { [field: string]: string; };
 
     constructor(l: Expression, tok: Token, r: Expression) {
         this.left = l;
         this.operator = tok;
         this.right = r;
 
         this.name = 'Binary';
         this.map = {};
         this.map['left'] = this.left.toString();
         this.map['operator'] = this.operator.toString();
         this.map['right'] = this.right.toString();
     }
 
     /** Returns float value of this Expression */
     fValue(): number {
         if (this.operator == Token.PLUS)  return this.left.fValue() + this.right.fValue();
         if (this.operator == Token.MINUS) return this.left.fValue() - this.right.fValue();
         if (this.operator == Token.STAR)  return this.left.fValue() * this.right.fValue();
         if (this.operator == Token.SLASH) return this.left.fValue() / this.right.fValue();
         return NaN;
     }
     /** String representation of this Expression */
     toString(): string {
         return this.toString2(this.left, false) + this.operator + this.toString2(this.right, true);
     }
     toString2(exp: Expression, atRight: boolean): string {
         let s: string = exp.toString();
         if (!(exp instanceof Binary)) return s;
         let prec: number = this.precedence();
         let p: number =  (<Binary> exp).precedence();
         if (prec<p ||(prec==p && !atRight)) return s;
         return Token.LEFT +s+ Token.RIGHT;
      }
     /** Converts this Expression to postfix (RPN) */
     toPostfix(): string {
         return this.left.toPostfix() + this.right.toPostfix() + ' ' + this.operator; 
     }
 
     precedence(): number {
         if (this.operator == Token.PLUS || this.operator == Token.MINUS) return 10;
         if (this.operator == Token.STAR || this.operator == Token.SLASH) return 20;
         throw new Error("operation "+this.operator);
      }
     
 }
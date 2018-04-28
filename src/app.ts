import {Parser} from "./Parser";
import { Expression } from "./Expression";

let parser: Parser = new Parser("(3+5)*10/5");


let expression: Expression | undefined = parser.parse();
if(expression != undefined) {
    console.log(expression.toString());
    console.log(expression.fValue());
}
console.log('end');




import { RDPController } from "./RDPController";
import { Queue } from "./Collection";
import { Point, Shape } from "./Draw";
import { Highlighter } from "./Highlighter";
import { Token } from "./RecursiveDescentParser/Token";

const shapeWidth: number = 150;
const shapeHeight: number = 150;


export class RDPView {
    canvas: HTMLCanvasElement | undefined;
    points: Queue<Point>;
    lastGivenPoint: Point;

    highlighter: Highlighter;

    WIDTH_CANVAS: number = 0;
    HEIGHT_CANVAS: number = 0;

    constructor() {
        const canvasDiv =<HTMLDivElement> document.getElementById('canvas-area');
        this.canvas = document.createElement('canvas');
        /** takePoint() needs to know canvas div's width to give points when
         * modal needs it.
         */
        this.canvas.width = canvasDiv!.clientWidth;

        this.points = new Queue();  
        this.lastGivenPoint = new Point(0,0);
        this.points.push(this.lastGivenPoint);

        this.highlighter = new Highlighter(_code);
        this.highlighter.adjustCode();
        this.updateCode(this.highlighter.code);
    }

    resize() {
        const canvasDiv =<HTMLDivElement> document.getElementById('canvas-area');

        let points = this.points.arr;
        let canvasDimensions: Point = new Point(0, 0);
        for (let index = 0; index < points.length; index++) {
            const element = points[index];
            
            //if(element.x > canvasDimensions.x) canvasDimensions.x = element.x;

            if(element.y > canvasDimensions.y) canvasDimensions.y = element.y;
        }

        this.canvas = document.createElement('canvas');
        //this.canvas.width=canvasDimensions.x + shapeWidth;
        this.canvas.width = canvasDiv!.clientWidth;
        this.canvas.height=canvasDimensions.y + shapeHeight;

        while(canvasDiv.hasChildNodes) {
            let child = canvasDiv.lastChild;
            if(child == null) break;
            canvasDiv.removeChild(child);
        }

        canvasDiv.appendChild(this.canvas);
    }

    reinit() {
        this.points = new Queue();
        this.lastGivenPoint = new Point(0,0);
        this.points.push(this.lastGivenPoint);
        
        this.highlighter = new Highlighter(_code);
        this.highlighter.adjustCode();
        this.updateCode(this.highlighter.code);

        this.updateToken(Token.EMPTY, 0);
    }

    highlight(area: string) {
        //<span style='color:blue'> </span>
        this.unhighlight();

        if(area == '') return;
        
        let span = document.getElementById(area.toLowerCase());
        if(span != undefined) {
            span!.style!.color='red';
            const fontSize = window.getComputedStyle(span, null).getPropertyValue('font-size');
            span!.style!.fontSize = parseInt(fontSize)*1.2 +'px';
            this.highlighter.stack.push(area);
        }
    }

    unhighlight() {
        let region = this.highlighter.stack.peek();
        if(region != undefined) {
            let prevSpan = document.getElementById(region.toLowerCase());
            prevSpan!.removeAttribute("style");
        }
    }

    getContext(): CanvasRenderingContext2D | null {
        return this.canvas!.getContext('2d');
    }

    takePoint(): Point {
        let point =  this.points.pop();
        if(point == undefined) {
            let x = this.lastGivenPoint.x + shapeWidth;
            let y = this.lastGivenPoint.y;
            if(x + shapeWidth  > this.canvas!.width) {
                x = 0;
                y = y + shapeHeight;
            }
            point = new Point(x,y);
        }
        this.lastGivenPoint = point;
        return point;
    }

    releasePoint(point: Point): void {
        this.points.pushPriority(point);
    }

    drawShape(shape: Shape) {
        let counter: number = 0;
        let largestMeasureKey: number = 0;
        let largestMeasureValue: number = 0;
        if(shape.props != undefined) {
            for (const key in shape.props) {
                if(key.length > largestMeasureKey) {
                    largestMeasureKey = key.length;
                }
    
                let value: string = shape.props[key];
                if(value.length > largestMeasureValue) {
                    largestMeasureValue = value.length;
                }
                counter++;
            }
            /** While using font as 15px Arial, each characters size is almost 7
             * pixel. Thats why multiplying 7 and text.length 
             */
            largestMeasureKey *= 7; 
            largestMeasureValue *= 7;
    
            const width: number = largestMeasureValue + 25;
            const height: number = 90; 
            
            /** all drawings should be placed below in these lines */
            let rectX:number = shape.x + largestMeasureKey + 10;
            let rectY:number = shape.y + 25;
            let rectW:number = width;
            let rectH:number = height;
    
            let ctx: CanvasRenderingContext2D | null = this.getContext();
            this.eraseShape(shape);
    
            ctx!.beginPath();
            ctx!.font = "15px Arial";
            ctx!.textBaseline = 'top';
            ctx!.strokeText(shape.name, rectX, shape.y);
            ctx!.strokeRect(rectX, rectY, rectW, rectH);
    
            let ara = height / counter; // 30
            let row = rectY + ara / 2;
            let seperatorX = rectX;
            let seperatorY = rectY + 1;
            ctx!.textBaseline = 'middle';
            for (const key in shape.props) {
                let value: string = shape.props[key];
                ctx!.moveTo(seperatorX, seperatorY);
                ctx!.lineTo(seperatorX + rectW, seperatorY);
                ctx!.stroke();
                
                ctx!.strokeText(key, shape.x, row);
                ctx!.fillText(value, rectX + 10, row);
                
                seperatorY += ara;
                row += ara;
            }
            ctx!.closePath();
        }else {
            let ctx: CanvasRenderingContext2D | null = this.getContext();
            this.eraseShape(shape);
    
            ctx!.font = "15px Arial";
            ctx!.textBaseline = 'top';
            ctx!.strokeText(shape.name, shape.x, shape.y);
            ctx!.strokeRect(shape.x, shape.y + 25, 100, 100);
        }
    }

    eraseShape(shape: Shape) {
        const ctx: CanvasRenderingContext2D | null = this.getContext();
        ctx!.clearRect(shape.x - 5, shape.y - 5, 
                        this.canvas!.width - shape.x + 5, this.canvas!.height - shape.y + 5);
    }

    updateExpression(expression: string) {
        let expr = document.getElementById('tok-expression');
        expr!.innerHTML = expression;
    }

    updateToken(tok: Token, tokIndex: number) {
        let pointer = document.getElementById('pointer');
        let blank = '';
        for (let index = 0; index < tokIndex; index++) {
            blank += ' ';   
        }
        blank += `^ TOKEN = ${ tok.toString() }`;
        pointer!.innerHTML = blank;
    }

    updateCode(code: string) {
        let codeArea = document.getElementById('code');
        codeArea!.innerHTML = code;
    }
}

const _code = `<h3>Code</h3>
<pre>
Expression expr() {
#EXPRESSION#
&emsp;&emsp;Expression e = term();
#ENDEXPRESSION#
&emsp;&emsp;Token t = tok;
#PLUSMINUS#
&emsp;&emsp;while (t == Token.PLUS || t == Token.MINUS)  {
&emsp;&emsp;&emsp;&emsp;match(t);
&emsp;&emsp;&emsp;&emsp;e = new Binary(e, t, term());
&emsp;&emsp;&emsp;&emsp;t = tok;
&emsp;&emsp;}
#ENDPLUSMINUS#
#EXPRETURN#
&emsp;&emsp;return e;
#ENDEXPRETURN#
}
Expression term() {
#TERM#
&emsp;&emsp;Expression e = factor();
#ENDTERM#
&emsp;&emsp;Token t = tok;
#STARSLASH#
&emsp;&emsp;while (t == Token.STAR || t == Token.SLASH)  {
&emsp;&emsp;&emsp;&emsp;match(t);
&emsp;&emsp;&emsp;&emsp;e = new Binary(e, t, factor());
&emsp;&emsp;&emsp;&emsp;t = tok;
&emsp;&emsp;}
#ENDSTARSLASH#
#TERMRETURN#
&emsp;&emsp;return e;
#ENDTERMRETURN#
}
Expression factor() {
#FACTOR#
&emsp;&emsp;if (tok == Token.NUMBER)  {
#CONSTANT#
&emsp;&emsp;&emsp;&emsp;Expression c = new Constant(lex.nval);
#ENDCONSTANT#
#CONSTANTMATCH#
&emsp;&emsp;&emsp;&emsp;match(Token.NUMBER);
#ENDCONSTANTMATCH#
#CONSTANTRETURN#
&emsp;&emsp;&emsp;&emsp;return c;
#ENDCONSTANTRETURN#
&emsp;&emsp;}
&emsp;&emsp;if (tok == Token.LEFT)  {
#LEFT#
#LEFTMATCH#
&emsp;&emsp;&emsp;&emsp;match(Token.LEFT);
#ENDLEFTMATCH#
#FACTOREXP#
&emsp;&emsp;&emsp;&emsp;Expression e = expr();
#ENDFACTOREXP#
#RIGHTMATCH#
&emsp;&emsp;&emsp;&emsp;match(Token.RIGHT);
#ENDRIGHTMATCH#
#ENDLEFT#
#LEFTRETURN#
&emsp;&emsp;&emsp;&emsp;return e;
#ENDLEFTRETURN#
&emsp;&emsp;}
#ENDFACTOR#
&emsp;&emsp;expected("Factor");
&emsp;&emsp;return null;
}
</pre>`;
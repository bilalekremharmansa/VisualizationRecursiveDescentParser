import { RDPController } from "./RDPController";
import { Queue } from "./Collection";
import { Point, Shape } from "./Draw";
import { Highlighter } from "./Highlighter";
import { Token } from "./RecursiveDescentParser/Token";

const shapeWidth: number = 300;
const shapeHeight: number = 150;


export class RDPView {

    canvas: HTMLCanvasElement;
    points: Queue<Point>;
    lastGivenPoint: Point;

    highlighter: Highlighter;

    WIDTH_CANVAS: number = 0;
    HEIGHT_CANVAS: number = 0;

    constructor() {
        const canvasDiv =<HTMLDivElement> document.getElementById('mycanvas');
        this.WIDTH_CANVAS = window.innerWidth;
        this.HEIGHT_CANVAS = window.innerHeight;

        this.canvas = document.createElement('canvas');
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        canvasDiv!.appendChild(this.canvas);
        
        this.points = new Queue();
        this.lastGivenPoint = new Point(0,0);
        this.points.push(this.lastGivenPoint);

        this.highlighter = new Highlighter(_code);
        this.highlighter.adjustCode();
        this.updateCode(this.highlighter.code);
    }

    resize() {
        this.canvas.width=window.innerWidth;
        this.canvas.height=window.innerHeight;
    }

    reinit() {
        const canvasDiv =<HTMLDivElement> document.getElementById('mycanvas');
        while(canvasDiv.hasChildNodes) {
            let child = canvasDiv.lastChild;
            if(child == null) break;
            canvasDiv.removeChild(child);
        }
        this.WIDTH_CANVAS = window.innerWidth;
        this.HEIGHT_CANVAS = window.innerHeight;

        this.canvas = document.createElement('canvas');
        this.canvas.width = this.WIDTH_CANVAS;
        this.canvas.height = this.HEIGHT_CANVAS;
        canvasDiv!.appendChild(this.canvas);

        this.points = new Queue();
        this.lastGivenPoint = new Point(0,0);
        this.points.push(this.lastGivenPoint);
        
        this.highlighter = new Highlighter(_code);
        this.highlighter.adjustCode();
        this.updateCode(this.highlighter.code);

        this.updateToken(Token.EMPTY);
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
        return this.canvas.getContext('2d');
    }

    takePoint(): Point {
        let point =  this.points.pop();
        if(point == undefined) {
            let x = this.lastGivenPoint.x + shapeWidth;
            let y = this.lastGivenPoint.y;
            if(x  > this.canvas.height) {
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
        ctx!.clearRect(shape.x - 5, shape.y - 5, shapeWidth + 5, shapeHeight + 5);
    }

    updateToken(tok: Token) {
        let docParser = document.getElementById('parser');
        docParser!.innerHTML = `TOKEN = ${ tok.toString() }`;
    }

    updateCode(code: string) {
        let codeArea = document.getElementById('code');
        codeArea!.innerHTML = code;
    }
}

const _code = `<h3>Code</h3>
<pre><code>
Expression expr() {
    #EXPRESSION#
    Expression e = term();
    #ENDEXPRESSION#
    Token t = tok;
    #PLUSMINUS#
    while (t == Token.PLUS || t == Token.MINUS)  {
        match(t);
        e = new Binary(e, t, term());
        t = tok;
    }
    #ENDPLUSMINUS#
    #EXPRETURN#
    return e;
    #ENDEXPRETURN#
}
Expression term() {
    #TERM#
    Expression e = factor();
    #ENDTERM#
    Token t = tok;
    #STARSLASH#
    while (t == Token.STAR || t == Token.SLASH)  {
        match(t);
        e = new Binary(e, t, factor());
        t = tok;
    }
    #ENDSTARSLASH#
    #TERMRETURN#
    return e;
    #ENDTERMRETURN#
}
Expression factor() {
    #FACTOR#

    if (tok == Token.NUMBER)  {
        #CONSTANT#
        Expression c = new Constant(lex.nval);
        match(Token.NUMBER);
        #ENDCONSTANT#
        #CONSTANTRETURN#
        return c;
        #ENDCONSTANTRETURN#
    }
    if (tok == Token.LEFT)  {
        #LEFT#
        match(Token.LEFT);
        Expression e = expr();
        match(Token.RIGHT);
        #ENDLEFT#
        #LEFTRETURN#
        return e;
        #ENDLEFTRETURN#
    }

    #ENDFACTOR#
    expected("Factor");
    return null;
}
</code></pre>`;
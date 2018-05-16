import { Stack } from "./Collection";

export class Highlighter {
    private _code: string;//original one
    code: string;
    regions: StringDictionary<string>;
    stack: Stack<string>;

    constructor(code: string) {
        this._code = code;
        this.code = code;
        this.regions = {};
        this.stack = new Stack();

        let beginning= -1;
        let finale= -1;
        let region: string;
        for (let index = 0; index < code.length; index++) {
            const element = code[index];
            
            if(element == '#') {
                if(beginning == -1) {
                    if(code.substring(index+1,index+4) == 'END') {
                        while(code[++index] != '#') { }
                        index++;
                        continue;
                    }  
                    beginning = index;
                }else {
                    finale = index;
                    region = code.substring(beginning+1, finale);

                    this.regions[region] = region;

                    beginning = -1;
                    finale = -1;
                }
            }
        }
    }

    realCode(): string {
        return this.code;
    }

    
    adjustCode(): void {
        //let regexp = /#.*#/gi;
        //this.code = this._code.replace(regexp, '');
        this.code = this._code;
        for (const key in this.regions) {
            let span  = `<span id='${key.toLowerCase()}'>`;
            let spann = `</span>`;

            this.code = this.code.replace('#'+key+'#\n', span);
            this.code = this.code.replace('#END'+key+'#\n', spann);
        }
    }
}

class Region {
    tag: string;
    beginning: number;
    finale: number;

    constructor(tag: string, beginning: number, finale: number) {
        this.tag = tag;
        this.beginning = beginning;
        this.finale = finale;
    }
}

interface StringDictionary<V> {
    [key: string]: V;
}
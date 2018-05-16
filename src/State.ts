import { Shape, Point } from "./Draw";
import { Queue } from "./Collection";
import { Token } from "./RecursiveDescentParser/Token";

export class State {
    status: StateStatus;
    shape: Shape | undefined;
    token: Token;
    tokenMoved: number;
    region: string;

    constructor(status: StateStatus, tok: Token, tokenMoved: number, region: string, shape?: Shape) {
        this.status = status;
        this.token = tok;
        this.tokenMoved = tokenMoved;
        this.shape = shape;
        this.region = region;
    }

    toString(): string {
        let str: string='';
        if(this.shape != undefined) str = this.shape.name + '-'
        return  str + ' Status: ' + this.status + " Token: " + this.token;
    }
}

export enum StateStatus {
    DRAW,
    ERASE,
    TOKEN
}
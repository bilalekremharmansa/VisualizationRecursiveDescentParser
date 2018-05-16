import { RDPController } from "./RDPController";
import { StateStatus, State } from "./State";
import { RDPView } from "./RDPView";
import { Parser } from "./RecursiveDescentParser/Parser";
import { Point } from "./Draw";


export class RDPModel {

    expression: string;
    parser: Parser | undefined;
    states: State[];

    controller: RDPController | undefined;

    constructor() {
        this.states = [];
        this.expression = '';
    }

    parse(input: string): void {
        this.states = [];
        this.expression = input;
        this.parser = new Parser(input);
        this.parser.attachModel(this);
        this.parser.parse();
    }

    attach(controller: RDPController) {
        this.controller = controller;
    }

    addState(state: State) {
        this.states.push(state);

        if(state.status == StateStatus.ERASE && state.shape != undefined
                                            && this.controller != undefined) {
            this.controller.releasePoint(state.shape.getPoint());
        }
    }

    takePoint(): Point | undefined {
        if(this.controller != undefined) return this.controller.takePoint();
    }
    
}
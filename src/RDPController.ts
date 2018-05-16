import { Point } from "./Draw";
import { RDPModel } from "./RDPModel";
import { RDPView } from "./RDPView";
import { State, StateStatus } from "./State";

export class RDPController {
    model: RDPModel;
    view: RDPView;

    stateIndexer = -1;

    constructor(model: RDPModel, view: RDPView) {
        this.model = model;
        this.view = view;

        this.model.attach(this);
    }

    reinit(parserInput: string) {
        this.view.reinit();
        this.model.parse(parserInput);
        this.view.resize();

        this.view.updateExpression(parserInput);

        this.stateIndexer = -1;
    }

    takePoint(): Point {
        return this.view.takePoint();
    }

    releasePoint(point: Point): void {
        this.view.releasePoint(point);
    }

    next(): State | any{
        if(this.stateIndexer < this.model.states.length-1) {
            this.stateIndexer++;
            const state = this.model.states[this.stateIndexer];

            switch(state.status) {
                case StateStatus.DRAW:
                    if(state.shape != undefined) {
                        this.view.drawShape(state.shape);
                    }
                    break;
                case StateStatus.ERASE:
                    if(state.shape != undefined) {
                        this.view.eraseShape(state.shape);
                    }
                    break;
            }
            this.view.highlight(state.region);
            this.view.updateToken(state.token, state.tokenMoved);
        }
    }

    prev(): State | any {
        /** TODO */
    }
}
import { Visualizable } from "./Visualizable";

export class Point {
    x: number;
    y: number;

    constructor (x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

export interface Shape {
    name: string;
    props: { [field: string]: string; } | undefined;
    x: number;
    y: number;
    getPoint(): Point;
}

export class RecursiveFunc implements Shape {
    name: string;
    props: { [field: string]: string; } | undefined;

    x: number;
    y: number;

    constructor(point: Point, name: string, props?: { [field: string]: string; }) {
        this.name = name;
        this.props = props;

        // burası visualizer tarafından belirlencek
        this.x = point.x;
        this.y = point.y;
    }

    getPoint(): Point {
        return new Point(this.x, this.y);
    }
}
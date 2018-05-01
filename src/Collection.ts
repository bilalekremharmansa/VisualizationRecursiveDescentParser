/**
 * 
 * 
 */
export interface Collection<T> {
    arr: T[];
    push(value: T): void;
    pop():T | undefined;
    peek(): T | undefined;
    isEmpty(): boolean;
}
export class Stack<T> implements Collection<T> {
    arr: T[];

    constructor() {
        this.arr = [];
    }

    public push(value: T) {
        this.arr.push(value);
    }

    pop(): T | undefined {
        return this.arr.pop();
    }

    peek(): T | undefined{
        return this.arr[this.arr.length-1];
    }

    isEmpty():boolean {
        return this.arr.length == 0;
    }
}
export class Queue<T> {
    arr: T[];

    constructor() {
        this.arr = [];
    }

    push(value: T) {
        this.arr.push(value);
    }

    pushPriority(value: T) {
        this.arr.splice(0, 0, value);
    }

    /** pops and returns first element in array */
    pop(): T | undefined {
        let element = this.arr[0];
        this.arr.splice(0, 1);
        return element;
    }
    peek(): T | undefined {
        return this.arr[0];
    }

    isEmpty():boolean {
        return this.arr.length == 0;
    }
}
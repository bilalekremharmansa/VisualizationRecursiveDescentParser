/**
 * 
 * 
 */
export interface Collection<T> {
    arr: T[];
    length: number;
    push(value: T): void;
    pop():T | undefined;
    peek(): T | undefined;
    isEmpty(): boolean;
}
export class Stack<T> implements Collection<T> {
    arr: T[];
    length = 0;

    constructor() {
        this.arr = [];
    }

    push(value: T) {
        this.arr.push(value);
        this.length = this.arr.length;
    }

    pop(): T | undefined {
        this.length = this.arr.length;
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
    length = 0;

    constructor() {
        this.arr = [];
    }

    push(value: T) {
        this.arr.push(value);
        this.length = this.arr.length;
    }

    pushPriority(value: T) {
        this.arr.splice(0, 0, value);
        this.length = this.arr.length;
    }

    /** pops and returns first element in array */
    pop(): T | undefined {
        if(this.isEmpty()) return undefined;
        let element = this.arr[0];
        this.arr.splice(0, 1);
        this.length = this.arr.length;
        return element;
    }
    peek(): T | undefined {
        return this.arr[0];
    }

    isEmpty():boolean {
        return this.arr.length == 0;
    }
}
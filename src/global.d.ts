declare const GameGlobal: any;
declare const sharedCanvas: HTMLCanvasElement;
declare const __env: any;
declare const swan: any;
declare module "tiny-emitter" {
  export default class TinyEmitter {
    constructor();
    on(event: string, callback: Function, ctx?: any): this;
    once(event: string, callback: Function, ctx?: any): this;
    emit(event: string, ...args: any[]): this;
    off(event: string, callback?: Function): this;
  }
}
declare module "css-layout" {
  export default function computeLayout(tree: any): void;
}

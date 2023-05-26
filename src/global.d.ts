declare const GameGlobal: any;
declare const sharedCanvas: HTMLCanvasElement;
declare const __env: any;
declare const swan: any;

// Type definitions for Zynga Scroller 0.1
// Project: http://zynga.github.com/scroller/, https://github.com/popham/scroller
// Definitions by: Marcelo Haskell Camargo <https://github.com/haskellcamargo>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

declare module "tiny-emitter" {
  export default class TinyEmitter {
    constructor();
    on(event: string, callback: Function, ctx?: any): this;
    once(event: string, callback: Function, ctx?: any): this;
    emit(event: string, ...args: any[]): this;
    off(event: string, callback?: Function): this;
  }  
}

declare module "scroller" {
  namespace Scroller {
    interface Options {
      scrollingX?: boolean | undefined;
      scrollingY?: boolean | undefined;
      animating?: boolean | undefined;
      animationDuration?: number | undefined;
      bouncing?: boolean | undefined;
      locking?: boolean | undefined;
      paging?: boolean | undefined;
      snapping?: boolean | undefined;
      zooming?: number | undefined;
      minZoom?: number | undefined;
      maxZoom?: number | undefined;
    }
  }

  export class Scroller {
    constructor(callback: (left: number, top: number, zoom: number) => void, options?: Scroller.Options);
    __clientWidth: number;
    __clientHeight: number;
    __contentWidth: number;
    __contentHeight: number;
    options: Scroller.Options;
    setDimensions(clientWidth: number, clientHeight: number, contentWidth: number, contentHeight: number): void;
    setPosition(clientLeft: number, clientTop: number): void;
    setSnapSize(width: number, height: number): void;
    activatePullToRefresh(height: number, activate: () => void, deactivate: () => void, start: () => void): void;
    finishPullToRefresh(): void;
    getValues(): {
      left: number;
      top: number;
      zoom: number
    };
    getScrollMax(): { left: number; top: number; };
    zoomTo(level: number, animate?: boolean, originLeft?: number,
      originTop?: number, callback?: () => void): void;
    zoomBy(factor: number, animate?: boolean, originLeft?: number,
      originTop?: number, callback?: () => void): void;
    scrollTo(left: number, top: number, animate?: boolean, zoom?: number): void;
    scrollBy(leftOffset: number, topOffset: number, animate?: boolean): void;

    doMouseZoom(wheelData: number, timeStamp: number, pageX: number, pageY: number): void;
    doTouchStart(touches: Array<{
      pageX: number;
      pageY: number
    }>, timeStamp: number): void;
    doTouchMove(touches: Array<{
      pageX: number;
      pageY: number
    }>, timeStamp: number, scale?: number): void;
    doTouchEnd(timeStamp: number): void;
  }

  class EasyScroller {
    constructor(content: any, options: Scroller.Options);

    render(): void;
    reflow(): void;
    bindEvents(): void;
  }

}

declare module "css-layout" {
  export default function computeLayout(tree: any): void;
}

declare type Callback = (...args: any[]) => void;

interface GameTouch {
  timeStamp: number;
  identifier: number;
  pageX: number;
  pageY: number;
  clientX: number;
  clientY: number;
  force?: number;
}

interface GameTouchEvent {
  type: string;
  timeStamp: number;
  touches: GameTouch[];
  changedTouches: GameTouch[];
}

interface TouchMsg {
  touchstart?: MouseEvent | GameTouch;
  touchend?: MouseEvent | GameTouch;
}
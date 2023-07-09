/* istanbul ignore next */
export function none() { }
import { GameTouch, GameTouchEvent } from "../types";

interface TouchMsg {
  touchstart?: MouseEvent | GameTouch;
  touchend?: MouseEvent | GameTouch;
}

/**
 * 根据触摸时长和触摸位置变化来判断是否属于点击事件
 */
export function isClick(touchMsg: TouchMsg) {
  const start = touchMsg.touchstart;
  const end = touchMsg.touchend;

  if (!start
    || !end
    || !start.timeStamp
    || !end.timeStamp
    || start.pageX === undefined
    || start.pageY === undefined
    || end.pageX === undefined
    || end.pageY === undefined
  ) {
    return false;
  }

  const startPosX = start.pageX;
  const startPosY = start.pageY;

  const endPosX = end.pageX;
  const endPosY = end.pageY;

  const touchTimes = end.timeStamp - start.timeStamp;

  return !!(Math.abs(endPosY - startPosY) < 30
    && Math.abs(endPosX - startPosX) < 30
    && touchTimes < 300);
}

export function createCanvas() {
  /* istanbul ignore if*/
  if (typeof __env !== 'undefined') {
    return __env.createCanvas();
  }
  return document.createElement('canvas');
}

export function createImage() {
  /* istanbul ignore if*/
  if (typeof __env !== 'undefined') {
    return __env.createImage();
  }
  return document.createElement('img');
}

let _dpr: number;
// only Baidu platform need to recieve system info from main context
if (typeof swan !== 'undefined') {
  __env.onMessage((res: any) => {
    if (res && res.type === 'engine') {
      if (res.event === 'systemInfo') {
        _dpr = res.systemInfo.devicePixelRatio;
      }
    }
  });
}

export function getDpr() {
  // return 3;
  if (typeof _dpr !== 'undefined') {
    return _dpr;
  }
  if (typeof __env !== 'undefined' && __env.getSystemInfoSync) {
    _dpr = __env.getSystemInfoSync().devicePixelRatio;
  } else if (window.devicePixelRatio) {
    _dpr = window.devicePixelRatio;
  } else {
    console.warn('[Layout] failed to access device pixel ratio, fallback to 1');
    _dpr = 1;
  }
  return _dpr;
}

export enum STATE {
  UNINIT = 'UNINIT',
  INITED = 'INITED',
  RENDERED = 'RENDERED',
  CLEAR = 'CLEAR',
};

export function clearCanvas(ctx: CanvasRenderingContext2D) {
  ctx && ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

export function copyTouchArray(touches: GameTouch[]) {
  return touches.map(touch => ({
    identifier: touch.identifier,
    pageX: touch.pageX,
    pageY: touch.pageY,
    clientX: touch.clientX,
    clientY: touch.clientY,
  }));
}

export function isGameTouchEvent(e: MouseEvent | GameTouchEvent): e is GameTouchEvent {
  return 'touches' in e;
}

/**
 * 取最小值和最大值之间的区间限定值
 * @param {number} number 需要被处理的数字
 * @param {number} min 最小值
 * @param {number} max 最大值
 */
export function clamp(number: number, min: number, max: number): number {
  return Math.max(min, Math.min(number, max));
}
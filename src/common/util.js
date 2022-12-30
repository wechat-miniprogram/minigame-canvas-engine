export function throttle(fn, threshhold, scope) {
  threshhold || (threshhold = 250);
  let last;
  let deferTimer;
  return function () {
    const context = scope || this;

    const now = +new Date;
    const args = arguments;
    if (last && now < last + threshhold) {
      // hold on to it
      clearTimeout(deferTimer);
      deferTimer = setTimeout(() => {
        last = now;
        fn.apply(context, args);
      }, threshhold);
    } else {
      last = now;
      fn.apply(context, args);
    }
  };
}

/* istanbul ignore next */
export function none() {}

/**
 * 根据触摸时长和触摸位置变化来判断是否属于点击事件
 */
export function isClick(touchMsg) {
  const start     = touchMsg.touchstart;
  const end       = touchMsg.touchend;

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

  const endPosX   = end.pageX;
  const endPosY   = end.pageY;

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

let _dpr;
// only Baidu platform need to recieve system info from main context
if (typeof swan !== 'undefined') {
  __env.onMessage((res) => {
    if (res && res.type === 'engine') {
      if (res.event === 'systemInfo') {
        _dpr = res.systemInfo.devicePixelRatio;
      }
    }
  });
}

export function getDpr() {
  return 3;
  // if (typeof _dpr !== 'undefined') {
  //   return _dpr;
  // }
  // if (typeof __env !== 'undefined' && __env.getSystemInfoSync) {
  //   _dpr = __env.getSystemInfoSync().devicePixelRatio;
  // } else {
  //   console.warn('failed to access device pixel ratio, fallback to 1');
  //   _dpr = 1;
  // }
  // return _dpr;
}

export const STATE = {
  UNINIT: 'UNINIT',
  INITED: 'INITED',
  RENDERED: 'RENDERED',
  CLEAR: 'CLEAR',
};

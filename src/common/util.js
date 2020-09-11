export function throttle(fn, threshhold, scope) {
  threshhold || (threshhold = 250);
  var last,
    deferTimer;
  return function () {
    var context = scope || this;

    var now = +new Date,
      args = arguments;
    if (last && now < last + threshhold) {
      // hold on to it
      clearTimeout(deferTimer);
      deferTimer = setTimeout(function () {
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

  if (   !start
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

  return !!(   Math.abs(endPosY - startPosY) < 30
    && Math.abs(endPosX - startPosX) < 30
    && touchTimes < 300 );
}

export function createCanvas() {
  /* istanbul ignore if*/
  if ( typeof __env !== "undefined" ) {
    return __env.createCanvas();
  } else {
    return document.createElement('canvas');
  }
}

export function createImage() {
  /* istanbul ignore if*/
  if ( typeof __env !== "undefined" ) {
    return __env.createImage();
  } else {
    return document.createElement('img');
  }
}

export function getDpr() {
  // totally not consider dpr
  return 1;
  // if (typeof __env !== "undefined") {
  //   return __env.getSystemInfoSync().devicePixelRatio;
  // } else {
  //   return window.devicePixelRatio;
  // }
}

export const STATE = {
  "UNINIT"  : "UNINIT",
  "INITED"  : "INITED",
  "RENDERED": "RENDERED",
  "CLEAR"   : "CLEAR",
}

export const repaintChildren = (children) => {
  children.forEach(child => {
    child.repaint();

    repaintChildren(child.children);
  })
}

export const repaintTree = (tree) => {
  tree.repaint();

  tree.children.forEach(child => {
    child.repaint();

    repaintTree(child);
  })
}

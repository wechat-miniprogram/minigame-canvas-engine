import env from '../../common/env';
const { wx } = env;

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
export function none() { }

/**
 * 根据触摸时长和触摸位置变化来判断是否属于点击事件
 */
export function isClick(touchMsg) {
  const start = touchMsg.touchstart;
  const end = touchMsg.touchend;

  if (!start
		|| !end
		|| !start.timeStamp
		|| !end.timeStamp
		|| start.clientX === undefined
		|| start.clientY === undefined
		|| end.clientX === undefined
		|| end.clientY === undefined
  ) {
    return false;
  }

  const startPosX = start.clientX;
  const startPosY = start.clientY;

  const endPosX = end.clientX;
  const endPosY = end.clientY;

  const touchTimes = end.timeStamp - start.timeStamp;

  return !!(Math.abs(endPosY - startPosY) < 30
		&& Math.abs(endPosX - startPosX) < 30
		&& touchTimes < 300);
}

export function createCanvas() {
	/* istanbul ignore if*/
	if (env.isMiniGame) { // 小程序环境
		return wx.createCanvas();
	} else if (typeof document !== 'undefined') { // web环境
		return document.createElement('canvas');
	}
	else { // jscore环境
		// return new NativeGlobal.OffscreenCanvas();
	}
}

export const STATE = {
  UNINIT: 0,
  INITED: 1,
  RENDERED: 2,
  CLEAR: 3,
  DEACTIVE: 4,
};
export const DEFAULT_FONT_FAMILY = 'sans-serif';

let context = null;
export const getContext = () => {
  if (context) {
    return context;
  }
  const canvas = createCanvas(); // eslint-disable-line
  if (canvas) {
    canvas.width = 1;
    canvas.height = 1;
    context = canvas.getContext('2d', { alpha: true });
  }
  return context;
};

export let charWidthMap = {}; // 搞一个字符长度map表，用来存下不同字段的长度

export function setCharMap(map) {
  charWidthMap = Object.assign(charWidthMap, map);
}

export function dash2camel(input) {
  return input.toLowerCase().replace(/-(.)/g, (match, group1) => group1.toUpperCase());
}

export function camel2dash(input) {
  return input.replace(/[A-Z]/g, m => `-${m.toLowerCase()}`);
}

export function nextTick(cb) {
  return Promise.resolve().then(cb);
}

export function checkIntersect(RectA, RectB) {
  return !(
    RectB.right <= RectA.left
		|| RectB.left >= RectA.right
		|| RectB.bottom <= RectA.top
		|| RectB.top >= RectA.bottom
  );
}

export function pointInRect([x, y], [rX, rY, w, h]) {
  return rX <= x && x <= rX + w && rY <= y && y <= rY + h;
}

export function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  } : null;
}

export function getRgba(hex, opacity) {
  const rgbObj = hexToRgb(hex);
  let o = opacity;

  if (opacity === undefined) {
    o = 1;
  }

  return `rgba(${rgbObj.r}, ${rgbObj.g}, ${rgbObj.b}, ${o})`;
}

export function getElementStyle(isDarkMode, needInnerStyle = true) {
  const style = isDarkMode ?
      Object.assign({}, this.styleInit, this.styleDarkInit, this.styleProp) :
      Object.assign({}, this.styleInit, this.styleProp);

  if (needInnerStyle) {
    Object.assign(style, this._innerStyle);
  }

  return style;
}

export function log() {
  /*console.log.apply(null, arguments)*/
}

export function createImage() {
  /* istanbul ignore if*/
  if (env.isMiniGame) {
    return wx.createImage();
  } else {
    return document.createElement('img');
  }
}

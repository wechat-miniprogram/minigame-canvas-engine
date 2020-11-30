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

// export function createCanvas() {
// 	/* istanbul ignore if*/
// 	if (typeof wx !== "undefined") { // 小程序环境
// 		return wx.createCanvas();
// 	} else if (typeof document !== 'undefined') { // web环境
// 		return document.createElement('canvas');
// 	}
// 	else { // jscore环境
// 		// return new NativeGlobal.OffscreenCanvas();
// 	}
// }

// let dpr = null;
// export function getDpr() {
//   if (dpr != null) {
//     /* istanbul ignore if*/
//     if ( typeof wx !== "undefined" ) { // 小程序环境
//         dpr = wx.getSystemInfoSync().devicePixelRatio;
//     } else if (typeof window !== 'undefined') { // web环境
//         dpr = window.devicePixelRatio;
//     } else { // jscore环境
//         // return canvas.density;
//         dpr = NativeGlobal.getSystemInfo().pixelRatio;
//     }
//   }
//   return dpr;
// }

// export function getDpr() {
// return WeixinCore.getSystemInfo().pixelRatio;
// return 1;
// }

export const STATE = {
  UNINIT: 0,
  INITED: 1,
  RENDERED: 2,
  CLEAR: 3,
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

// export function measureText({ fontStyle, fontWeight, fontSize, fontFamily }, fontSizeRate = 1) {
// 	return (str) => {
// 		let width = 0;
// 		const key = `${fontWeight || 'normal'}_${(fontSize || 12) * fontSizeRate}_${fontFamily 
//      || DEFAULT_FONT_FAMILY}_${str}`;
// 		if (charWidthMap[key]) {
// 			width = charWidthMap[key];
// 		} else {
// 			console.log('new text', key);
// 			// console.log(charWidthMap);
// 			width = WeixinCore.getFontManager().measureText(str,
// 				fontWeight || 'normal',
// 				fontStyle || 'normal',
// 				(fontSize || 12) * fontSizeRate,
// 				fontFamily || DEFAULT_FONT_FAMILY) || 0;

// 			charWidthMap[key] = width;
// 		}
// 		return {
// 			width: width
// 		}
// 	}
// }

export function setCharMap(map) {
  charWidthMap = Object.assign(charWidthMap, map);
}

// export function getTextWidth(style, value, fontSizeRate) {
// 	return measureText({
// 		fontWeight: style.fontWeight,
// 		fontSize: style.fontSize,
// 		fontFamily: style.fontFamily
// 	}, fontSizeRate)(value).width;
// }

// export function getTextWidthWithoutSetFont(value) {
// 	console.log('getTextWidthWithoutSetFont:' + getContext().measureText(value).width);
// 	return getContext().measureText(value).width || 0;
// }

// export function parseText(style, value) {
// 	value = String(value);

// 	let maxWidth = style.width;
// 	let wordWidth = getTextWidth(style, value);

// 	// 对文字溢出的处理，默认用...
// 	let textOverflow = style.textOverflow || 'ellipsis';

// 	// 文字最大长度不超限制
// 	if (wordWidth <= maxWidth) {
// 		return value;
// 	}

// 	// 对于用点点点处理的情况，先将最大宽度减去...的宽度
// 	if (textOverflow === 'ellipsis') {
// 		maxWidth -= getTextWidthWithoutSetFont('...');
// 	}

// 	let length = value.length - 1;
// 	let str = value.substring(0, length);

// 	while (getTextWidthWithoutSetFont(str) > maxWidth && length > 0) {
// 		length--;
// 		str = value.substring(0, length);
// 	}

// 	return (length && textOverflow === 'ellipsis'
// 		? str + '...'
// 		: str);
// }

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

import { Callback } from "./types";

if (typeof GameGlobal !== 'undefined') {
  GameGlobal.__env = GameGlobal.wx || GameGlobal.tt || GameGlobal.swan;
}

const domEventMap: Record<string, string> = {
  touchstart: 'mousedown',
  touchmove: 'mousemove',
  touchend: 'mouseup',
  touchcancel: 'mouseleave',
}

enum eventType {
  on = 'on',
  off = 'off',
}

function genDomTouchEvent(event: string, type: eventType) {
  if (typeof document !== 'undefined') {
    return function (listener: Callback) {
      type === eventType.on ?
        document.addEventListener(event, listener, false)
        : document.removeEventListener(event, listener, false)
    }
  }
}

function getOnTouchHandler(event: string, type: eventType) {
  if (typeof GameGlobal !== 'undefined') {
    return GameGlobal.__env[`${type}${event}`]
  } else {
    return genDomTouchEvent(domEventMap[event.toLowerCase()], type);
  }
}

/**
 * Layout 可能用在不用的平台，而Layout会依赖平台下面的一些方法来实现具体的功能，比如创建图片
 * 为了更好做平台适配，统一封装 env 模块，不同平台要做适配，替换 env 的具体方法即可
 */
export default {
  // 监听触摸相关事件
  onTouchStart: getOnTouchHandler('TouchStart', eventType.on),
  onTouchMove: getOnTouchHandler('TouchMove', eventType.on),
  onTouchEnd: getOnTouchHandler('TouchEnd', eventType.on),
  onTouchCancel: getOnTouchHandler('TouchCancel', eventType.on),
  // 取消监听触摸相关事件
  offTouchStart: getOnTouchHandler('TouchStart', eventType.off),
  offTouchMove: getOnTouchHandler('TouchMove', eventType.off),
  offTouchEnd: getOnTouchHandler('TouchEnd', eventType.off),
  offTouchCancel: getOnTouchHandler('TouchCancel', eventType.off),

  // Layout 支持百分比样式，如果根节点样式设置为 100%，直接取 Canvas 的尺寸，不同平台的取法不一样，因此单独提供函数
  getRootCanvasSize() {
    if (typeof __env !== 'undefined' && __env.getSharedCanvas) {
      const cvs = __env.getSharedCanvas();
      return {
        width: cvs.width,
        height: cvs.height,
      }
    } else {
      return {
        width: 300,
        height: 150,
      }
    }
  },

  // 取当前设备的 devicePixelRatio，不同平台的取法不一样
  getDevicePixelRatio() {
    if (typeof __env !== 'undefined' && __env.getSystemInfoSync) {
      return __env.getSystemInfoSync().devicePixelRatio;
    } else if (window.devicePixelRatio) {
      return window.devicePixelRatio;
    } else {
      return 1;
    }
  },

  // 创建Canvas
  createCanvas() {
    if (typeof __env !== 'undefined') {
      return __env.createCanvas();
    }

    return document.createElement('canvas');
  },

  // 创建图片
  createImage() {
    if (typeof __env !== 'undefined') {
      return __env.createImage();
    }
    return document.createElement('img');
  }
}

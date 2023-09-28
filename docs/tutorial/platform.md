# 平台适配

Layout 最开始设计出来是为了提升微信小游戏开放数据域开发效率，但现在 Layout 已经被用到各种各样的小游戏平台，作为轻量级 Canvas 应用的解决方案。

对于渲染引擎，一定会依赖平台的能力，比如创建图片、监听事件等，一般引擎的解决方案是主动适配主要运行平台，比如适配浏览器和微信小游戏。Layout 同样如此，目前已经适配了 浏览器、微信小游戏、字节小游戏和百度小游戏平台，但如果一个全新的平台想要使用 Layout，无需更改 Layout 源码，同样可以进行适配，下面进行简单的介绍。

## 原理
Layout 对于平台环境的依赖并不多，主要是事件监听、图片创建等，所有平台相关的依赖都被封装到 env 模块，它非常精简，代码如下：
``` ts
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
```

## 示例
因此想要实现平台适配，只需要在 Layout 初始化之前魔改 env 模块的实现即可，下面是一个例子：
``` js
import { env, Layout } from 'minigame-canvas-engine';

env.createImage = () => {
  return new ImageClassInCurrentPlatform();
}

env.onTouchStart = currentPlatform.onTouchStart;

// 下面正常执行 Layout的使用
```
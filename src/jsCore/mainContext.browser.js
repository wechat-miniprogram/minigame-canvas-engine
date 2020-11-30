import Emitter from 'tiny-emitter';
import { WX_BJ_REPORT } from '../common/errorReport';
export { performanceReport } from '../common/performanceReport.js'
const EE  = new Emitter();

WX_BJ_REPORT.BadJs.init(0, 'mainContext', 'wxTimeline', (res) => {

});

window.onerror = (event) => {
  console.log('error', event);
  WX_BJ_REPORT.BadJs.onError(new Error(event));
};

const WeixinCore = {
  on(event, callback) {
    EE.on(event, callback)
  },

  emit(event) {
    EE.emit.apply(EE, Array.from(arguments));
  },

  getSystemInfo() {
    return {
      pixelRatio: 1
    }
  },

  // getFontManager() {
  //   return {
  //     measureText(str, fontStyle, fontWeight, fontSize, fontFamily) {
  //       const canvas = measureCanvas;
  //       const ctx = canvas.getContext('2d');
  //       ctx.font = `${fontStyle || 'normal'} ${fontWeight || 'normal'} ${fontSize || 12}px ${fontFamily}`;
  //       return (ctx.measureText(str)).width;
  //     }
  //   };
  // },

  /**
   * 调用jsapi
   * @param {String} api [jsapi名称]
   * @param {Object} args [jsapi调用参数]
   * @param {Function} callback [jsapi回调函数]
   */
  invoke(api, args, callback) {
    console.log("invoke", api, args)
  },

  /**
   * 通用上报cgi
   * @param {String} businessId [业务ID]
   * @param {Object} request [请求数据]
   * @param {Function} callback [回调函数]
   */
  reportCgi(args, callback) {
    console.log('reportCgi', args)
  },

  /**
   * 上报idkey
   * @param {*} id
   * @param {*} key
   * @param {*} value
   */
  idkey(id, key, value) {
  },

  idkeyList(list) {
  },
  kv(id, data) {
  },
  adRequest(params, subType, callback) {
  },
  userAgent() {
    return window.navigator.userAgent;
  },
  requestAnimationFrame: window.requestAnimationFrame.bind(window),
  cancelAnimationFrame: window.cancelAnimationFrame.bind(window),
  createCanvas() {
    return document.createElement('canvas');
  },
  localStorage: {
    getItem(key) {
      const data = window.localStorage.getItem(key);
      try {
        return JSON.parse(data);
      } catch (e) {
        return data
      }
    },
    setItem(key, value) {
      if (typeof value !== 'string') {
        value = JSON.stringify(value);
      }
      window.localStorage.setItem(key, value);
    }
  },
  getCacheDir() {
    return '';
  },
  getPlatform() { // 获取平台信息
    return 'android';
  },
  native: {
    _events: Object.create(null),
    addEventListener(name, cb) {
      WeixinCore.native._events[name] = WeixinCore.native._events[name] || [];
      WeixinCore.native._events[name].push(cb);
    },
    removeEventListener(name, cb) {
      if (cb) {
        const index = WeixinCore.native._events[name].indexOf(cb);
        if (index > -1) {
          WeixinCore.native._events[name].splice(index, 1);
        }
      } else {
        delete WeixinCore.native._events[name];
      }
    },
    postMessage(data, target) {
      const cbs = WeixinCore.native._events.message;
      if (cbs && cbs.length) {
        cbs.forEach(cb => cb({data, target}));
      }
    }
  }
};

export class VideoDecoder extends Emitter {
  constructor() {
    super();
    this._createPromise = null;
    this.video = document.createElement('video');
    this.video.onended = () => {
      this.emit('ended')
    }
    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
  }
  get width () {
    return this.video.videoWidth
  }
  get height() {
    return this.video.videoHeight
  }
  start(opts) {
    this._createPromise = new Promise((resolve, reject)=> {
      this.video.onloadeddata = () => {
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.video.play();
        resolve(this.video);
      }
      this.video.onerror = reject
      this.video.src = opts.source;
      this.video.crossOrigin = 'anonymous';
      this.video.muted = true;
    })
    return this._createPromise
  }
  stop() {
    return Promise.resolve().then(() => {
      this.video.pause();
    })
  }
  remove() {
    this.video = null;
  }
  getFrameData() {
    const canvas = this.canvas;
    const ctx = this.ctx;
    ctx.drawImage(this.video, 0, 0);
    return {
      width: canvas.width,
      height: canvas.height,
      pkPts: Math.round(this.video.currentTime * 1000),
      data: ctx.getImageData(0, 0, canvas.width, canvas.height).data.buffer
    }
  }
  updateVolume(volumn) {
    return Promise.resolve()
  }
  addAudioSource() {
    return Promise.resolve()
  }
  removeAudioSource() {
    return Promise.resolve()
  }
}

export const {
  on,
  emit,
  getSystemInfo,
  getFontManager,
  invoke,
  reportCgi,
  idkey,
  idkeyList,
  kv,
  adRequest,
  userAgent,
  requestAnimationFrame,
  cancelAnimationFrame,
  localStorage,
  createCanvas,
  getCacheDir,
  getPlatform,
  native,
} = WeixinCore;

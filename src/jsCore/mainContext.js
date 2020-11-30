import { WX_BJ_REPORT } from '../common/errorReport';
// import { CallbackManager } from '../common/callbackManager';
export { default as VideoDecoder } from './videoDecoder.android';
//不需要区分canvasId，cell和popup都需要
export { performanceReport } from '../common/performanceReport.js'

const wx = Object.assign({}, wxJsEngine);

// const _callbackManager = new CallbackManager({
//   addEventListener: addEventListener
// });

// const fontManager = {
//   measureText() {
//     try {
//       const defaultArgs = ['', 'normal', 'normal', 12, 'sans-serif']; // str fontWeight fontStyle fontSize fontFamily
//       let args = Array.from(arguments);
//       args = args.concat(defaultArgs.slice(args.length));
//       args[1] = '' + args[1];
//       args[3] = Math.round(args[3]);
//       const width = wx.measureText.apply(wx.measureText, args);
//       // console.log('NativeGlobal.getFontManager.measureText', width);
//       return width;
//     } catch (err) {
//       console.log('measureText error!');
//       console.log(err);
//     }
//   }
// }

const sysInfo = {
  pixelRatio: 1,
}

const WeixinCore = {
  on(event, callback) {
    addEventListener(event, callback);
  },

  getSystemInfo() {
    return sysInfo;
  },

  // getFontManager() {
  //   return fontManager;
  // },

  /**
   * 调用jsapi
   * @param {String} api [jsapi名称]
   * @param {Object} args [jsapi调用参数]
   * @param {Function} callback [jsapi回调函数]
   */
  invoke(canvasId, api, args, callback) {
    // console.log("invoke", wx.invoke, ...Array.from(arguments))
    console.log("invoke call");

    // const callbackId = _callbackManager.addCallback('logic_core_invoke', callback);

    wx.invoke(canvasId, api, JSON.stringify({
      func: api,
      params: args,
      __msg_type: 'call',
      // __callback_id: `jscore_invoke_${new Date().getTime()}`
      // __callback_id: callbackId
    }), callbackWrapper((res) => {
      if (typeof callback === 'function') {
        try {
          callback(res);
        } catch(e) {
          console.error('wx.invoke error ', e);
        }
      }
    }));
  },

  /**
   * 通用上报cgi
   * @param {String} businessId [业务ID] 
   * @param {Object} request [请求数据]
   * @param {Function} callback [回调函数]
   */
  reportCgi(args, callback) {
    const businessId = args.businessId;
    const request = JSON.stringify(args.request);
    console.log('reportCgi', request);
    // const callbackId = _callbackManager.addCallback('logic_core_reportCgi', callback);
    wx.reportCgi(businessId, request, callbackWrapper((res) => {
      if (typeof callback === 'function') {
        try {
          callback(res);
        } catch(e) {
          console.error('wx.reportCgi error ', e);
        }
      }
    }));
  },

  /**
   * 上报idkey
   * @param {*} id 
   * @param {*} key 
   * @param {*} value 
   */
  idkey(id, key, value) {
    wx.idkey(id, key, value);
  },

  idkeyList(list) {
    wx.idkeyList(JSON.stringify(list));
  },
  kv(id, data) {
    wx.kv(id, data);
  },
  // adRequest(params, subType, callback) {
  //   let p = params;
  //   // console.log('ppppppppppp', params);
  //   if (typeof params === 'object') {
  //     p = JSON.stringify(p);
  //   }
  //   const callbackId = `logic_core_adRequest_${callbackCount++}`;
  //   addEventListener(`callback:${callbackId}`, (res) => {
  //     if (typeof callback === 'function') {
  //       try {
  //         callback(res);
  //       } catch (err) {
  //         console.error('Error WeixinCore.adRequest callback:', err);
  //       }
  //     }
  //   });
  //   wx.adRequest(p, subType, callback);
  // },
  userAgent() {
    return wx.userAgent();
  },
  dump(tag, data) {
    return wx.dump(tag, data);
  },
  getCacheDir() {
    return wx.getCacheDir ? wx.getCacheDir() : '';
  },
  getPlatform() { // 获取平台信息
    return wx.getPlatform ? wx.getPlatform() : 'android';
  },
  native : {
    addEventListener,
    removeEventListener,
    addCanvasEventListener(canvasId, name, cb) {
      //事件分发封装，Android是全局事件，通过target区分
      cb.__event_wrapper = (event) => {
        if (!event.target || event.target == '*' || event.target == canvasId) {
          cb(event);
        }
      };
      addEventListener(name, cb.__event_wrapper);
    },
    removeCanvasEventListener(name, cb) {
      if (cb.__event_wrapper) {
        removeEventListener(name, cb.__event_wrapper);
      }
    },
    postMessage,
    callbackWrapper
  },
  // callbackManager: _callbackManager
};

WX_BJ_REPORT.BadJs.init('0', 'wxTimeline:mainContext', 'wxTimeline', (res) => {
  console.log('error res', JSON.stringify(res));
  WeixinCore.reportCgi({
    businessId: 2,
    request: {
      url: res.url,
      type: 'post',
      data: res.data
    }
  });
});

addEventListener('error', (event) => {
  try {
    console.log('error in logic ctx', JSON.stringify(event));
    // WX_BJ_REPORT.BadJs.onError(new Error(event));
    WX_BJ_REPORT.BadJs.onError({
      name: event.name || '',
      message: event.message || '',
      stack: event.stackTrace || ''
    });
  } catch(e) {
    console.error('event listener error');
    console.error(e);
  }
});

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
  // adRequest,
  userAgent,
  dump,
  getCacheDir,
  getPlatform,
  native,
  // callbackManager
} = WeixinCore;

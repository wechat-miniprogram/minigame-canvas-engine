import { WX_BJ_REPORT } from '../common/errorReport';
// import { CallbackManager } from '../common/callbackManager';

console.log('CanvasCore', [  addEventListener,
  removeEventListener,
  postMessage])

const wx = Object.assign({}, wxJsEngine);
// const callbackManager = new CallbackManager({
//   addEventListener: addEventListener
// });

const native = {
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
  postMessage: function(message, targetOrigin) {
    postMessage(JSON.stringify(message), targetOrigin);
  }
}

  /**
   * 通用上报cgi
   * @param {String} businessId [业务ID]
   * @param {Object} request [请求数据]
   * @param {Function} callback [回调函数]
   */
const reportCgi = function(args, callback) {
  const businessId = args.businessId;
  const request = JSON.stringify(args.request);
  console.log('request', request);
  // const callbackId = callbackManager.addCallback('render_core_reportCgi', callback);
  wx.reportCgi(businessId, request, callbackWrapper((res) => {
    if (typeof callback === 'function') {
      try {
        callback(res);
      } catch(e) {
        console.error('wx.reportCgi error', e);
      }
    }
  }));
};

/**
 * 暴露给业务的错误上报
 * @param {Object} error
 */
const errReport = function(error = {}) {
  WX_BJ_REPORT.BadJs.onError({
    name: error.name || '',
    message: error.message || '',
    stack: error.stack || '',
  });
}

WX_BJ_REPORT.BadJs.init('0', 'wxTimeline:CanvasCore_mainContext', 'wxTimeline', (res) => {
  console.log('error res', JSON.stringify(res));
  reportCgi({
    businessId: 2,
    request: {
      url: res.url,
      type: 'post',
      data: res.data
    }
  });
});

// console.log('addEventListener test', addEventListener);
addEventListener('error', (event) => {
  try {
    console.log('error in render ctx', JSON.stringify(event));
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

export {
  native,
  reportCgi,
  errReport,
}

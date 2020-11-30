import Emitter from 'tiny-emitter'

// throw new Error();
function createCanvasContext(canvasId) {
  const canvas = {id: canvasId}
  const ctx = {
    canvas,
    postMessage(data) {
      WeixinCore.native.postMessage(JSON.stringify(data), `render://client/${canvasId}`);
    },
    addEventListener(name, cb) {
      WeixinCore.native.addCanvasEventListener(canvasId, name, cb);
    },
    removeEventListener(name, cb) {
      WeixinCore.native.removeCanvasEventListener(name, cb);
    }
  }
  return ctx;
}

function adaptJSCore(raw) {
  const canvasId = raw.getId();
  const rawPopup = raw.popup;
  return Object.assign(raw, {
    on(event, callback) {
      WeixinCore.native.addCanvasEventListener(canvasId, event, callback);
    },

    popup(id, width, height, left, top, mode, color, onClosed) {
      console.log('popup call', rawPopup)
      rawPopup(
        id,
        width, 
        height, 
        left, 
        top,
        mode,
        color,
        WeixinCore.native.callbackWrapper(() => {
          console.log('popup closed');
          onClosed && onClosed();
        }),
        WeixinCore.native.callbackWrapper(() => {
          console.log('popup outer click');
        })
      );
      console.log(`popup in ${id}`)
    },
  });
}

const wx = adaptJSCore(Object.assign({}, wxJsEngineClient, wxCanvas, wxPopup, wxBizCanvas));
const canvasId = wx.getId();
console.log('init', canvasId);
const canvasContext = createCanvasContext(canvasId);
// const popupCanvasContext = createCanvasContext(`__popup_from_${canvasId}`);
const data = wx.getData('adData');
const getData = wx.getData.bind(wx);
const getInfo = wx.getInfo.bind(wx);
const onCardClick = wx.onItemClick && wx.onItemClick.bind(wx);
const getLayout = CanvasLayout.newInstance.bind(CanvasLayout);

const localStorage = {
  getItem: function (key) {
    const data = wx.getLocalData(key);
    try {
      return JSON.parse(data);
    } catch (e) {
      return data;
    }
  },
  setItem: function (key, data) {
    if (typeof data !== 'string') {
      data = JSON.stringify(data);
    }
    wx.setLocalData(key, data);
  }
}
const invoke = function (name, params, callback) {
  return wx.invoke(name, JSON.stringify(params), WeixinCore.native.callbackWrapper(callback)); // 增加__canvas_id给客户端
}
const idkey = WeixinCore.idkey.bind(WeixinCore);
const reportCgi = WeixinCore.reportCgi.bind(WeixinCore);
// cgi(...args) {
//   wx.cgi(...args);
// },
function cgi(cmdId, cgiUrl, base64Buffer, callback) {
  // const callbackId = _callbackManager.addCallback('logic_core_cgi', callback);
  wx.cgi(cmdId, cgiUrl, base64Buffer, WeixinCore.native.callbackWrapper((res) => {
    if (typeof callback === 'function') {
      try {
        callback(res);
      } catch(e) {
        console.error('wx.cgi error ', e);
      }
    }
  }));
}
const kv = WeixinCore.kv.bind(WeixinCore);
const idkeyList = WeixinCore.idkeyList.bind(WeixinCore);
const userAgent = WeixinCore.userAgent.bind(WeixinCore);
const getCacheDir = WeixinCore.getCacheDir.bind(WeixinCore);
const getPlatform = WeixinCore.getPlatform.bind(WeixinCore);

const adRequest = function (params, subType, callback) {
  console.log('adRequest call');
  let p = params;
  if (typeof params === 'object') {
    p = JSON.stringify(p);
  }
  if (wx.adRequest) {
    // const callbackId = WeixinCore.callbackManager.addCallback('client_context_adRequest', callback);
    wx.adRequest(p, subType, WeixinCore.native.callbackWrapper((res) => {
      if (typeof callback === 'function') {
        try {
          callback(res);
        } catch(e) {
          console.error('wx.adRequest error ', e);
        }
      }
    }));
  }
}
const getWidth = wx.getWidth.bind(wx);
const getHeight = wx.getHeight.bind(wx);
const getOffsetTop = wx.getOffsetTop.bind(wx);
const getOffsetHeight = wx.getOffsetHeight.bind(wx);
const getFps = (typeof wx.getFps === 'function' ? wx.getFps.bind(wx) : () => 0);
const commRequest = function ({ businessId, request }, callback) {
  // const calllbackId = WeixinCore.callbackManager.addCallback('client_context_commRequest', callback);
  wx.canvasRequest(businessId, JSON.stringify(request), WeixinCore.native.callbackWrapper((res) => {
    if (typeof callback === 'function') {
      try {
        callback(res);
      } catch(e) {
        console.error('wx.canvasRequest error', e);
      }
    }
  }));
}
const getBasePkgVersion = wx.getBasePkgVersion.bind(wx);
// console.log(JSON.stringify(wx));
const getVersion = wx.getBizPkgVersion.bind(wx);

// 拿到当前context对应的canvasId
const deleteCard = (id = canvasId) => wx.deleteCanvasCard && wx.deleteCanvasCard(id);

// 处理字体
const fontManager = {
  measureText() {
    try {
      const defaultArgs = ['', 'normal', 'normal', 12, 'sans-serif']; // str fontWeight fontStyle fontSize fontFamily
      let args = Array.from(arguments);
      args = args.concat(defaultArgs.slice(args.length));
      args[1] = String(args[1]);
      args[3] = Math.round(args[3]);
      const width = wx.measureText.apply(wx.measureText, args);
      // console.log('NativeGlobal.getFontManager.measureText', width);
      return width;
    } catch (err) {
      console.log('measureText error!');
      console.log(err);
    }
  }
}

/**
 * 一个context里面的主canvas只会有一个layout，create之后就会存在，旋转屏幕/字体变化/darkmode都只会处理同一个layout
 */
let layout = null;
let screenWidth = wx.getWidth(); // 启jscore的时候的宽度
let fontSize = wx.getFontSize(); // 启jscore的时候的字体
let isDarkMode = wx.isDarkMode(); // 启动jscore的时候是否暗黑模式

console.log(`screenWidth: ${screenWidth}`);
console.log(`fontSize: ${fontSize}`);

//公共事件
//attach 客户端的view出现在屏幕内
//detach 客户端的view消失在屏幕外
//foreground 微信返回前台
//background 微信退出到后台
//scroll 屏幕滚动

const EE = new Emitter();
const publicEvents = ['attach', 'detach', 'update', 'pause', 'resume', 'scroll', 'onScreenShot', 'foreground', 'background'];
function on(event, callback) {
  if (publicEvents.indexOf(event) > -1) {
    WeixinCore.native.addCanvasEventListener(canvasId, event, callback);
    if (event !== 'scroll') {
      console.info(`${event} call`);
    }
  } else {
    EE.on(event, callback);
  }
}

function off(event, callback) {
  if (publicEvents.indexOf(event) > -1) {
    WeixinCore.native.removeCanvasEventListener(event, callback);
  } else {
    EE.off(event, callback);
  }
}

function saveLayout(_layout, canvasid) {
  if (!_layout || !_layout.renderContext) {
    return
  }
  setTimeout(() => {
    const saveData = {
      width: _layout.renderContext.width,
      height: _layout.renderContext.height,
      glRects: _layout.renderContext.glRects
    }

    const serialized = JSON.stringify(saveData);

    // console.log('wx.save: ' + typeof wx.save);
    // console.log('saveData: ' + serialized);
  
    wx.save && wx.save(canvasid, 0, 0, 0, saveData.height, serialized);
  }, 0);
}

function onCreate(canvasContext, layoutData) {
  // console.log('layoutData', layoutData);
  console.log('onCreate call');
  if (!layout) { // 第一次初始化的时候
    layout = getLayout({
      isDarkMode: wx.isDarkMode.bind(wx),
      getFontSize: wx.getFontSize.bind(wx),
      getWidth: wx.getWidth.bind(wx),
      getFps: getFps,
      canvasId,
      canvasContext,
      fontManager
    });
    if (layoutData && typeof layoutData === 'object') {
      layout.setLayoutData(layoutData);
    }
    EE.emit('create', layout, wx.getWidth()); // 用户初始化完layout
  }
  reflow(layoutData);

  let isVideoCard = false
  layout._videos && layout._videos.forEach(video => {
    isVideoCard = true
  })
  canvasContext.postMessage({ // 设置卡片类型
    type: 'setCardType',
    data: isVideoCard ? 1 : 0
  })

  repaint(layout);

  WeixinCore.performanceReport.send();

  saveLayout(layout, canvasId);

  EE.emit('mount', layout, wx.getWidth());
}
/**
 * jscore起来后，跑完所有所有的js代码，会抛一个create事件
 * 这个时候如果是冷启动，要看看有没有之前layout的缓存数据
 */ 
wx.on('create', (event) => {
  console.info('create event');
  console.log('create', JSON.stringify(event));

  // function createProfiler () {
  //   if (!NativeGlobal.CpuProfiler) {
  //     return null;
  //   }
  //   return new NativeGlobal.CpuProfiler();
  // }
  // function dump(tag, data) {
  //   return wx.dump(tag, data);
  // }

  // const profiler = createProfiler();
  // if (profiler) {
  //   profiler.startProfiling();
  //   setTimeout(()=> {
  //     const d = JSON.stringify(profiler.stopProfiling());
  //     dump('renderCore', d);
  //   }, 10000);
  // }

  onCreate(canvasContext);
});

wx.on('reflow', function(e) {
  console.info('reflow event');
  if (!layout || !layout.canvasContext) {
    return
  }
  render(e);
});
function render(event) {
  console.info('render call');
  // console.log('render', JSON.stringify(event));
  // render的时候看看屏幕宽度/字体大小/暗黑模式和create的时候是否一样，不一样的话需要重新reflow
  const needReflow = screenWidth !== wx.getWidth()
    || fontSize !== wx.getFontSize()
    || isDarkMode !== wx.isDarkMode();
    // || firstRender;
  if (needReflow) {
    reflow();
  }
  repaint(layout);
  if (needReflow) {
    saveLayout(layout, canvasId);
  }
  screenWidth = wx.getWidth();
  fontSize = wx.getFontSize();
  isDarkMode = wx.isDarkMode();
}

on('background', () => {
  WeixinCore.performanceReport.send(); // 退到后台就上报一次
})

const MODE_NO_MASK        = 0;
const MODE_MASK           = 1 << 0;
const MODE_MASK_PERSIST   = 1 << 1;

// let popupLayoutData = null;
const popupContext = {};

function popup({id, left, top, width, height, mode = MODE_MASK, color = "#00000033"}, cb) {
  if (!id) {
    throw new Error('popup id is required!');
  }
  const popupId = `__popup_${id}_from_${canvasId}`
  console.info('popup call');
  wx.popup(
    popupId,
    width, 
    height, 
    left, 
    top,
    mode,
    color,
    () => {
      console.log('popup close callback');
      if (popupLayout) {
        popupLayout && popupLayout.unbindEvents();
        popupLayout.clearAll();
        popupLayout.releaseSource();
        popupLayout = null;
      }
    }
  );

  let popupLayout = getLayout({
    isDarkMode: wx.isDarkMode.bind(wx),
    getFontSize: wx.getFontSize.bind(wx),
    canvasId: popupId,
    getWidth: () => {
      return width;
    },
    fontManager,
  });
  // if (popupLayoutData) {
  //   popupLayout.setLayoutData(popupLayoutData);
  // }

  popupLayout.setCanvasContext(popupContext[popupId] || (popupContext[popupId] = createCanvasContext(popupId)));
  // popupLayout.canvasId = canvasId;
  // popupLayout.popupId = canvasId;
  popupLayout.renderContext.noRepaint = true; // popup不支持快速重绘

  cb(popupLayout, {
    close: () => {
      wx.close(popupId);
      console.log('popupClose call clear');
      if (popupLayout) {
        // popupLayoutData = popupLayout.getLayoutData(); // 缓存popup的布局数据
        popupLayout.unbindEvents();
        popupLayout.clearAll();
        popupLayout.releaseSource();
        popupLayout = null;
      }
    }
  });

  console.log('popup end', popupId, canvasId);
  repaint(popupLayout);
  // setTimeout(() => { // popup支持第一帧重绘
  //   popupLayout.renderContext.noRepaint = true;
  // }, 0);
}

function reflow(hasLayoutData = false) {
  console.info('reflow call');
  if (!hasLayoutData) {
    console.log('reflow compute!')
    layout.computeLayout();
  }
  layout.textManager.hasUpdate = false;
  console.log(`reflow canvas: ${JSON.stringify(layout.viewport)}`)

  console.log(`wx.setHeight: ${typeof wx.setHeight}`);
  wx.setHeight && wx.setHeight(layout.viewport.height);
  // console.log('reflow save')
  // console.log('reflow repaint')
  // repaint(layout, canvas);
}

// 把计算出的布局画出来
function repaint(layout) {
  console.info('repaint call');
  layout.drawLayout();
  // console.log('repaint end');
}

export {
  // canvas,
  // getLayout,
  invoke,
  idkey,
  idkeyList,
  kv,
  cgi,
  reportCgi,
  popup,
  data,
  getData,
  getInfo,
  on,
  off,
  deleteCard,
  userAgent,
  getWidth,
  getHeight,
  getOffsetTop,
  getOffsetHeight,
  adRequest,
  onCardClick,
  commRequest,
  getBasePkgVersion,
  getVersion,
  getCacheDir,
  localStorage,
  getPlatform,
}

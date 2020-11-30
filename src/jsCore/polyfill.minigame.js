import Emitter from 'tiny-emitter';
import drawSkeleton from './skeleton';

window.drawSkeleton = drawSkeleton;
let layout = null;
const data = null;
const getData = () => null;
const getInfo = () => {};
// const devicePixelRatio = window.devicePixelRatio;
const requestAnimationFrame = window.requestAnimationFrame;
const getLayout = CanvasLayout.newInstance.bind(CanvasLayout);
/*const localStorage = WeixinCore.localStorage;*/

const info = wx.getSystemInfoSync();
const invoke = (func, args, callback) => {};
const idkey = (id, key, value) => {};
const reportCgi = (args, callback) => {};
const kv = (id, data) => {};
const idkeyList = (list) => {};
const userAgent = () => {
  return window.navigator.userAgent;
}
const adRequest = () => {};

const devicePixelRatio = info.devicePixelRatio;

const measureCanvas = wx.createCanvas();

measureCanvas.width = 1;
measureCanvas.height = 1;
const canvas = createCanvasDom();
const canvasEmitter = new Emitter();

const fontManager = {
  measureText(str, fontStyle, fontWeight, fontSize, fontFamily) {
    const canvas = measureCanvas;
    const ctx = canvas.getContext('2d');
    ctx.font = `${fontStyle || 'normal'} ${fontWeight || 'normal'} ${fontSize || 12}px ${fontFamily}`;
    return (ctx.measureText(str)).width;
  }
};

function deleteCard() {
}

function getWidth() {
  return info.screenWidth;
}

function getHeight() {
  return info.screenHeight;
}

function getOffsetTop() {
  return 0;
}

function getOffsetHeight() {
  return info.screenHeight;
}

function onCardClick() {
  console.log('card clicked!')
}

function getPlatform() {
  return info.platform;
}

function on(event, callback) {
  canvasEmitter.on(event, callback)
}

function off(event, callback) {
  canvasEmitter.off(event, callback)
}

function commRequest () {

}

function createImage() {
  /* istanbul ignore if*/
  if ( typeof wx !== "undefined" ) {
    return wx.createImage();
  } else {
    return document.createElement('img');
  }
}

let isDarkMode = false

const mainCanvas = wx.createCanvas();
const offScreenCanvas = new Map()

const canvasContext = {
  canvas: mainCanvas,
  requestAnimationFrame: requestAnimationFrame,
  cancelAnimationFrame: cancelAnimationFrame,
  devicePixelRatio,
  addEventListener: mainCanvas.addEventListener.bind(mainCanvas),
  removeEventListener: mainCanvas.removeEventListener.bind(mainCanvas),
  createImage,
  getOffscreenCanvas: (key) => {
    if (!offScreenCanvas.has(key)) {
      offScreenCanvas.set(key, document.createElement('canvas'))
    }
    return offScreenCanvas.get(key)
  },
  release: () => void 0,
  postMessage: (data) => {
    /*WeixinCore.native.postMessage(data, mainCanvas);*/
  }
}

function domLayout(darkMode = isDarkMode) {
  const width = document.body.clientWidth;
  // isDarkMode = darkMode
  if (!layout) {
    layout = getLayout({
      isDarkMode: () => isDarkMode,
      getWidth: () => document.body.clientWidth,
      canvasContext,
      fontManager: fontManager,
    });
  }
  if (layout.state === 1) { // 初始化过了，需要清空，重新
    layout.clear();
  }
  canvas.createImage = createImage;
  canvasEmitter.emit('create', layout, width);
  // canvas.style.width = `${width}px`;
  // canvas.style.height = `${layout.viewport.height}px`;
  // canvas.width = width * devicePixelRatio;
  // canvas.height = layout.viewport.height * devicePixelRatio;
  repaint(layout, canvas);
  /*WeixinCore.performanceReport.send();*/
  canvasEmitter.emit('mount', layout, width);
  window.addEventListener('resize', () => {
    if (layout.state === 1) { // 初始化过了，需要清空，重新
      layout.clear();
    }
    const canvas = document.getElementsByTagName('canvas')[0];
    const width = document.body.clientWidth;
    // canvasContext.devicePixelRatio = window.devicePixelRatio;
    canvasContext.devicePixelRatio = 1;
    canvas.style.width = `${width}px`;
    canvas.width = width * canvasContext.devicePixelRatio;
    canvas.style.height = `${layout.viewport.height}px`;
    canvas.height = layout.viewport.height * canvasContext.devicePixelRatio;
    layout.textManager.hasUpdate = false;
    layout.computeLayout();
    repaint(layout, canvas);
  });
}

let popupLayoutData = null;
let popupCanvas = document.createElement('canvas');
popupCanvas.id = 'popup';
const popupOffScreenCanvas = new Map()

function createCanvasDom() {
  const canvas = wx.createCanvas();

  return canvas;
}

function repaint(layout, canvas) {
  console.log('repaint');
  layout.drawLayout(canvas);
}

/*WeixinCore.on('renderUpdate', (event) => {
  repaint(event.layout, (event.target === 'main' ? canvas : popupCanvas));
});*/

window.onload = () => {
  domLayout()
  canvasEmitter.emit('attach')
};

window.switchDarkMode = () => {
  isDarkMode = !isDarkMode;
}

export {
  canvas,
  getLayout,
  requestAnimationFrame,
  invoke,
  idkey,
  idkeyList,
  kv,
  reportCgi,
  /*popup,*/
  data,
  getData,
  getInfo,
  devicePixelRatio,
  on,
  off,
  domLayout,
  deleteCard,
  userAgent,
  getWidth,
  getHeight,
  getOffsetTop,
  getOffsetHeight,
  adRequest,
  onCardClick,
  commRequest,
  /*localStorage,*/
  getPlatform
}

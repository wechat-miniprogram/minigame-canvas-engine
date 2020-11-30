import Emitter from 'tiny-emitter';
import drawSkeleton from './skeleton';

window.drawSkeleton = drawSkeleton;
let layout = null;
const data = null;
const getData = () => null;
const getInfo = () => {};
// const devicePixelRatio = window.devicePixelRatio;
const devicePixelRatio = 1;
const requestAnimationFrame = window.requestAnimationFrame;
const getLayout = CanvasLayout.newInstance.bind(CanvasLayout);
const localStorage = WeixinCore.localStorage;

const invoke = (func, args, callback) => {};
const idkey = (id, key, value) => {};
const reportCgi = (args, callback) => {};
const kv = (id, data) => {};
const idkeyList = (list) => {};
const userAgent = () => {
  return window.navigator.userAgent;
}
const adRequest = () => {};

const measureCanvas = document.createElement('canvas');
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
  const canvas = document.getElementsByTagName('canvas')[0];
  if (canvas) {
    canvas.parentNode && canvas.parentNode.removeChild(canvas);
  }
}

function getWidth() {
  return document.documentElement.clientWidth;
}

function getHeight() {
  return document.documentElement.clientHeight;
}

function getOffsetTop() {
  return 0;
}

function getOffsetHeight() {
  return document.documentElement.clientHeight;
}

function onCardClick() {
  console.log('card clicked!')
}

function getPlatform() {
  return 'ios';
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
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.setSrc = (src) => img.src = src;
  return img;
}

let isDarkMode = false

const mainCanvas = document.getElementsByTagName('canvas')[0]
const offScreenCanvas = new Map()
const canvasContext = {
  canvas: mainCanvas,
  requestAnimationFrame: window.requestAnimationFrame.bind(window),
  cancelAnimationFrame: window.cancelAnimationFrame.bind(window),
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
    WeixinCore.native.postMessage(data, mainCanvas);
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
  WeixinCore.performanceReport.send();
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

function popup({left, top, width, height}, cb) {
  popupCanvas = document.createElement('canvas');

  const popupLayout = getLayout({
    isDarkMode: () => isDarkMode,
    getWidth: () => {
      return width;
    },
    canvasContext: {
      canvas: popupCanvas,
      requestAnimationFrame: window.requestAnimationFrame.bind(window),
      cancelAnimationFrame: window.cancelAnimationFrame.bind(window),
      addEventListener: popupCanvas.addEventListener.bind(popupCanvas),
      removeEventListener: popupCanvas.removeEventListener.bind(popupCanvas),
      createImage,
      devicePixelRatio,
      getOffscreenCanvas: (key) => {
        if (!popupOffScreenCanvas.has(key)) {
          popupOffScreenCanvas.set(key, document.createElement('canvas'))
        }
        return popupOffScreenCanvas.get(key)
      },
      release: () => void 0,
      postMessage: (data) => {
        WeixinCore.native.postMessage(data, popupCanvas);
      }
    },
    fontManager: fontManager
  });
  if (popupLayoutData) {
    popupLayout.setLayoutData(popupLayoutData);
  }
  let mask = document.getElementById('mask');
  if (!mask) {
    mask = document.createElement('div');
    mask.id = 'mask';
    mask.style.position = 'fixed';
    mask.style.top = 0;
    mask.style.left = 0;
    mask.style.width = '100%';
    mask.style.height = '100%';
    mask.style.display = 'none';
    mask.style.backgroundColor = 'rgba(0,0,0,.2)';
    document.body.appendChild(mask);
  }
  mask.style.display = ''
  popupCanvas.style.position = 'absolute';
  popupCanvas.style.left = `${left}px`;
  popupCanvas.style.top = `${top}px`;
  popupCanvas.style.width = `${width}px`;
  popupCanvas.style.height = `${height}px`;
  popupCanvas.width = width * window.devicePixelRatio;
  popupCanvas.height = height * window.devicePixelRatio;
  popupCanvas.style.zIndex = 999;
  popupCanvas.createImage = createImage;
  canvas.parentNode.appendChild(popupCanvas);
  popupCanvas.close = function () {
    popupCanvas.parentNode && popupCanvas.parentNode.removeChild(popupCanvas);
    mask.style.display = 'none';
    popupLayoutData = popupLayout.getLayoutData();
    popupLayout.clear();
  }
  mask.ontouchstart = () => mask.touchstarted = true;
  mask.ontouchend = function () {
    if (mask.touchstarted = true) {
      popupCanvas.close();
      mask.touchstarted = false;
    }
  }
  cb(popupLayout, {
    close: popupCanvas.close
  });
  repaint(popupLayout, popupCanvas);
}

function createCanvasDom() {
  const canvas = document.getElementsByTagName('canvas')[0];
  const width = document.body.clientWidth;
  canvas.style.width = `${width}px`;
  // canvas.width = width * devicePixelRatio;
  return canvas;
}

function repaint(layout, canvas) {
  console.log('repaint');
  layout.drawLayout(canvas);
}

WeixinCore.on('renderUpdate', (event) => {
  repaint(event.layout, (event.target === 'main' ? canvas : popupCanvas));
});

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
  popup,
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
  localStorage,
  getPlatform
}

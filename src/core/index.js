import Element from './components/elements.js';
import Pool from './common/pool.js';
import Emitter from 'tiny-emitter';
import { isClick, STATE, setCharMap, nextTick, log } from './common/util.js';
import parser from './libs/fast-xml-parser/parser.js';
// import { adaptor, updateLayout, initYoga } from './common/adaptor';
import PseudoClassManager from './common/pseudoClassManager.js';
import TextManager from './common/textManager.js';
import { charWidthMap, pointInRect, DEFAULT_FONT_FAMILY, getElementStyle, createImage } from './common/util.js';
import RenderContextManager from './renderer/renderContextManager';
import { create, layoutChildren, restoreLayoutTree, _getElementById, _getElementsByClassName, _getChildsByPos, updateRealLayout } from './common/vd';

import {adaptor} from './common/cssLayoutAdapter';
import computeLayout from 'css-layout';

let imgPool = {};

const {wx} = pluginEnv.customEnv;
// 默认的字体管理器getFontManager
function getFontManager() {
  const measureCanvas = wx.createCanvas();

  measureCanvas.width = 1;
  measureCanvas.height = 1;

  const fontManager = {
    measureText(str, fontStyle, fontWeight, fontSize, fontFamily) {
      const canvas = measureCanvas;
      const ctx = canvas.getContext('2d');
      ctx.font = `${fontStyle || 'normal'} ${fontWeight || 'normal'} ${fontSize || 12}px ${fontFamily}`;
      return (ctx.measureText(str)).width;
    }
  };

  return fontManager;
}

export class Layout extends Element {
  constructor({ style, name, isDarkMode, getWidth, getSize, getFontSize, getFps, canvasId, canvasContext, fontManager, scale = 1 } = {}) {
    super({
      style,
      id: 0,
      name
    });
    this._methods = {};
    this.canvasId = canvasId;
    this.hasEventHandler = false;
    this.elementTree = null;
    this.renderContext = null;
    this.scale = scale;
    if (canvasContext) {
      this.setCanvasContext(canvasContext, scale);
    }
    this.fontManager = fontManager || getFontManager();

    this.debugInfo = {};
    this.renderport = {}; // 包含像素比例的宽高

    this.touchStart = this.eventHandler('touchstart').bind(this);
    this.touchMove = this.eventHandler('touchmove').bind(this);
    this.touchEnd = this.eventHandler('touchend').bind(this);
    this.touchCancel = this.eventHandler('touchcancel').bind(this);

    this.version = '0.0.1';

    this.touchMsg = {};

    this.hasViewPortSet = false;
    this.realLayoutBox = {
      realX: 0,
      realY: 0,
    }

    this.pseudoClassManager = new PseudoClassManager(this);
    this.textManager = new TextManager(this);
    this.isDarkMode = isDarkMode || (() => false); // 是否darkmode
    this.getWidth = getWidth || (() => 0);
    this.getSize = getSize || (() => { return {width: 0, height: 0}});
    this.getFontSize = getFontSize || (() => 1);
    this.getFps = getFps || (() => 0);
    this.state = STATE.UNINIT;
    this._emitter = new Emitter();
    this._EE = new Emitter();

    this.viewport = getSize();

    this._videos = [];
    this._firstComputeLayout = true; // 是否首次计算布局
    this._useLayoutData = false; // 是否使用了序列化的布局数据
  }

  methods(config) {
    this._methods = config;
  }

  setCanvasContext(ctx, scale) {
    this.canvasContext = ctx;
    this.renderContext = new RenderContextManager(ctx, scale, imgPool);
    this.renderContext.layout = this;
  }

  initRepaint() { }

  deactive() {
    /*console.log('deactive call')*/
    this._oldState = this.state;
    this.state = STATE.DEACTIVE;

    this._deactiveTree(this)
  }

  active() {
    /*console.log('active call')*/
    this.state = this._oldState || STATE.RENDERED;

    this._activeTree(this);
  }

  init(template, style, styleDark = {}, attrValueProcessor) {
    /*console.log('init call');*/
    return new Promise((resolve, reject) => {
      const start = new Date();

      if (typeof styleDark  === "function" && arguments.length === 3) {
        attrValueProcessor = styleDark;
        styleDark = {}
      }

      this.cssRules = {}; // 保存下css规则
      this.cssDarkRules = {}; // 保存下css darkmode的规则

      // 处理所有class里面的尺寸
      for (const k in style) {
        this.cssRules[k] = {};
        for (const key in style[k]) {
          this.cssRules[k][key] = style[k][key];
        }
      }
      for (const k in styleDark) {
        this.cssDarkRules[k] = {};
        for (const key in styleDark[k]) {
          this.cssDarkRules[k][key] = styleDark[k][key];
        }
      }

      const parseConfig = {
        attributeNamePrefix: "",
        attrNodeName: "attr", //default is 'false'
        textNodeName: "#text",
        ignoreAttributes: false,
        ignoreNameSpace: true,
        allowBooleanAttributes: true,
        parseNodeValue: false,
        parseAttributeValue: false,
        trimValues: true,
        parseTrueNumberOnly: false,
      }

      if (attrValueProcessor) {
        parseConfig.attrValueProcessor =  attrValueProcessor;
      }

      /*if( parser.validate(template) === true) { //optional (it'll return an object in case it's not valid)*/
      const jsonObj = parser.parse(template, parseConfig, true);
      /*}*/

      const xmlTree = jsonObj.children[0];

      this.debugInfo.xmlTree = new Date() - start;
      log(`init getXmlTree time ${new Date() - start}`);
      // XML树生成渲染树
      this.layoutTree = create.call(
        this,
        xmlTree,
        style,
        styleDark,
        this.isDarkMode(),
        this.getFontSize()
      );
      log(`create time ${new Date() - start}`);
      this.debugInfo.layoutTree = new Date() - start;
      this.add(this.layoutTree);

      /*console.log(this.layoutTree);*/

      this.debugInfo.renderTree = new Date() - start;

      this.state = STATE.INITED;

      this.reflowRequest = 0;
      this.repaintRequest = 0;

      // 收到reflow事件后，知道下一个loop没有reflow才执行computeLayout
      this.on('reflow', () => {
        this.reflowRequest++;
        Promise.resolve(this.reflowRequest).then((val) => {
          if (this.reflowRequest === val) {
            log('layout reflow');
            this.reflowRequest = 0;
            this.textManager.hasUpdate = false;

            this.computeLayout();

            // @hardcode
            this.scrollview && this.scrollview.traverseToChangeGlRect(this.scrollview, this.scrollview.scrollLeft, this.scrollview.scrollTop);

            this.drawLayout();
          }
        });
      });

      log(`init time ${new Date() - start}`);
      this.computeLayout();

      resolve();
    });
  }

  forceUpdate() {
    // log('forceUpdate--------');
    if (this.flushing) {
      return
    }
    this.flushing = true
    return nextTick(() => {
      // log('nextTick forceUpdate--------');

      this.repaint();
      this.flushing = false;

      this.scrollview.scrollActive = true;
    })
  }

  beforeReflow(children) {
    children = children || this.children;
    for (let i = 0, len = children.length; i < len; i++) {
      if (children[i].beforeReflow) {
        children[i].beforeReflow();
      }
      this.beforeReflow(children[i].children)
    }
  }

  // 把数据丢给渲染线程
  repaint(needInit = true) {
    // log('repaint call');
    const renderer = this.renderContext;
    // log(renderer.glRects.length);
    renderer.draw(needInit);
  }

  getLayoutData() { // 缓存layout相关的数据，方便冷启动时恢复
    const data = {
      charWidthMap: charWidthMap, // 存下之前计算过的文本的宽度，避免重复计算
      layoutBoxTree: {
        layoutBox: this.layoutBox,
        children: getNodeData(this.children),
      },
    };
    // log(data);
    return data;
  }

  setLayoutData(data) {
    log('set layoutData', data.charWidthMap);
    this.layoutData = data;
    if (data.charWidthMap) {
      setCharMap(data.charWidthMap);
    }
  }

  // 计算布局树
  computeLayout() {
    // log('start computeLayout');
    const start = new Date();
    this.renderport.height = 0;

    this.viewport = this.getSize();

    const isDarkMode = this.isDarkMode();
    const fontSize = this.getFontSize();

    // 第一层根节点，宽度如果是设置了百分比，把宽度改成屏幕的宽度
    for (let i = 0; i < this.children.length; i++) {
      const child = this.children[i];

      const style = getElementStyle.call(child, isDarkMode);
      const computedStyle = getElementStyle.call(child, isDarkMode);

      if (style.width && style.width.indexOf && style.width.indexOf('%') > -1) {
        const w = (Number.parseInt(style.width) / 100) * this.viewport.width;
        child.computedStyle.width = w;
        this.renderport.width = w;
      } else if (style.width && typeof style.width === 'number') {
        this.renderport.width = computedStyle.width;
      }
    }

    if (
      this.layoutData
      && this.layoutData.layoutBoxTree
      && this.layoutData.layoutBoxTree.children
      && this.layoutData.layoutBoxTree.children.length
    ) { // 有layout数据，不用再用yoga跑一遍
      const layoutBoxTree = this.layoutData.layoutBoxTree;
      this.layoutBox = layoutBoxTree.layoutBox;
      if (restoreLayoutTree(this.children, layoutBoxTree.children)) {
        log('restoreLayoutTree success');
        this.layoutData = null;
        this.textManager.hasUpdate = true;
        this._useLayoutData = true;
      } else {
        log('restoreLayoutTree fail');
        this.layoutData = null;
        adaptor(this);
      }
    } else {
      log('without layoutData');
      adaptor(this);
      this._useLayoutData = false;
    }

    let computedStart = Date.now();
    computeLayout(this);
    /*console.log('computeLayout cost', Date.now() - computedStart);*/

    this.debugInfo.yogaLayout = new Date() - start;

    // 这里更新下文本节点的宽高
    if (!this.textManager.hasUpdate) {
      this.textManager.hasUpdate = true;
      this.textManager.updateTextNodeLayoutBox();
      log('updateTextNodeLayoutBox');
      // calculateDirtyNode(this);
      // updateLayout(this);
    }

    log('before renderContext clear');
    this.renderContext.clear();
    layoutChildren.call(
      this,
      this.children,
      isDarkMode,
      fontSize,
    );

    for (let i = 0; i < this.children.length; i++) {
      this.renderport.height += this.children[i].layoutBox.height;
    }
    this.viewport.height = this.renderport.height
    /*console.log('viewport.height', this.viewport.height);*/

    this.renderContext.width = this.viewport.width * this.scale;
    this.renderContext.height = this.viewport.height * this.scale;

    this.debugInfo.layoutChildren = new Date() - start;

    log(`computeLayout time ${this.debugInfo.computeLayout}`);

    if (this._firstComputeLayout && !this._useLayoutData) { // 这里统计首次计算布局并且没有序列化数据的耗时
      this._firstComputeLayout = false;
    } else if (!this._useLayoutData) {
    } else if (this._useLayoutData) {
    }
  }

  /**
   * 更新被绘制canvas的窗口信息，本渲染引擎并不关心是否会和其他游戏引擎共同使用
   * 而本身又需要支持事件处理，因此，如果被渲染内容是绘制到离屏canvas，需要将最终绘制在屏幕上
   * 的绝对尺寸和位置信息更新到本渲染引擎。
   * 其中，width为物理像素宽度，height为物理像素高度，x为距离屏幕左上角的物理像素x坐标，y为距离屏幕左上角的物理像素
   * y坐标
   */
  updateViewPort(box) {
    this.viewport.width  = box.width  || 0;
    this.viewport.height = box.height || 0;
    this.viewport.x      = box.x      || 0;
    this.viewport.y      = box.y      || 0;

    this.realLayoutBox = {
      realX: this.viewport.x,
      realY: this.viewport.y,
    }

    this.hasViewPortSet = true;

    // 计算真实的物理像素位置，用于事件处理
    updateRealLayout.call(
      this,
      this.children,
      this.viewport.width / (this.renderContext.width / this.scale)
    );
  }

  restore(elementTree, layoutBox) {
    this.elementTree = elementTree;
    this.updateViewPort(layoutBox);
  }

  // 渲染布局树
  drawLayout() {
    if (!this.canvasContext) {
      return;
    }

    this.bindEvents();

    this.state = STATE.RENDERED;
    return this.forceUpdate();
  }

  // 根据x和y找到相应的子节点
  getChildByPos(tree, x, y) {
    const list = _getChildsByPos(tree, x, y, []);
    const length = list.length;

    return list[length - 1];
  }

  eventHandler(eventName) {
    return function touchEventHandler(e) {
      if (this.state === STATE.DEACTIVE) {
        return;
      }
      const touch = (e.touches && e.touches[0]) || (e.changedTouches && e.changedTouches[0]) || e;
      if (!touch.timeStamp) {
        touch.timeStamp = e.timeStamp || Date.now();
      }

      let offsetTop = 0;
      let offsetLeft = 0;

      if (e.target && typeof e.target.getBoundingClientRect === 'function') {
        const { top, left } = e.target.getBoundingClientRect();
        offsetTop = top;
        offsetLeft = left;
      }

      const event = {};
      for (const k in e) {
        event[k] = e[k];
      }

      const item = touch && this.getChildByPos(this, touch.clientX - offsetLeft, touch.clientY - offsetTop);
      // log(eventName, 'item', item.className);
      event.item = item;
      event.target = item;

      item && item.emit(eventName, event);

      if (eventName === 'touchstart' || eventName === 'touchend') {
        this.touchMsg[eventName] = touch;
      }

      if (eventName === 'touchend' && isClick(this.touchMsg)) {
        // log('emit click event!')
        item && item.emit('click', event);
      }

      if (eventName === 'touchstart') {
        this.startPos = [touch.clientX - offsetLeft, touch.clientY - offsetTop];
        this.pseudoClassManager.addActiveState(item);
      }

      if (eventName === 'touchmove') {
        if (!pointInRect(
          [touch.clientX - offsetLeft, touch.clientY - offsetTop],
          [...item.pos, ...item.size]
        )) {
          return
        }
        const offsetX = touch.clientX - this.startPos[0] - offsetLeft;
        const offsetY = touch.clientY - this.startPos[1] - offsetTop;
        const offsetLength = Math.hypot(offsetX, offsetY)
        if (offsetLength > 5) {
        }
      }
    }
  }

  bindEvents() {
    // log('bindEvents call');
    if (this.hasEventHandler) {
      return;
    }
    // log('bindEvents call');

    this.hasEventHandler = true;

    this._touchStartHandler = (e) => {
      // log('touch start');
      this.touchStart(e);
    }
    this._touchMoveHandler = (e) => {
      this.touchMove(e);
    }
    this._touchEndHandler = (e) => {
      // log('touch end');
      this.touchEnd(e);
      // log('before pseudoClassManager clearActiveState');
      this.pseudoClassManager.clearActiveState(); // 清除所有:active的状态
    }
    this._touchCancelHandler = (e) => {
      this.touchCancel(e);
      this.pseudoClassManager.clearActiveState(); // 清除所有:active的状态
    }

    // this.canvasContext.addEventListener('mousedown', this._touchStartHandler);
    // this.canvasContext.addEventListener('mouseup', this._touchEndHandler);

    if ( typeof wx !== 'undefined' ) {
      wx.onTouchStart(this.touchStart);
      wx.onTouchMove(this.touchMove);
      wx.onTouchEnd(this.touchEnd);
      wx.onTouchCancel(this.touchCancel);
    } else {
      this.canvasContext.addEventListener('touchstart', this._touchStartHandler);
      this.canvasContext.addEventListener('touchmove', this._touchMoveHandler);
      this.canvasContext.addEventListener('touchend', this._touchEndHandler);
      this.canvasContext.addEventListener('touchcancel', this._touchCancelHandler);
    }
  }

  unbindEvents() {
    if (this.hasEventHandler) {
      if ( typeof wx !== 'undefined' ) {
        wx.offTouchStart(this.touchStart);
        wx.offTouchMove(this.touchMove);
        wx.offTouchEnd(this.touchEnd);
        wx.offTouchCancel(this.touchCancel);
      } else {
        this.canvasContext.removeEventListener('touchstart', this._touchStartHandler);
        this.canvasContext.removeEventListener('touchmove', this._touchMoveHandler);
        this.canvasContext.removeEventListener('touchend', this._touchEndHandler);
        this.canvasContext.removeEventListener('touchcancel', this._touchCancelHandler);
      }
      this.hasEventHandler = false;
    }
  }

  emit(event, data) {
    if (data) {
      data.currentTarget = this;
    }
    this._emitter.emit(event, data);
  }

  on(event, callback) {
    this._emitter.on(event, callback)
  }

  once(event, callback) {
    this._emitter.once(event, callback)
  }

  off(event, callback) {
    this._emitter.off(event, callback)
  }

  getElementsByClassName(className) {
    return _getElementsByClassName(this, [], className);
  }

  getElementById(id) {
    return _getElementById(this, id);
  }

  destroyAll(tree) {
    if (!tree) {
      tree = this;
    }

    for (let i = 0; i < tree.children.length; i++) {
      const child = tree.children[i];
      child.destroy();
      this.destroyAll(child);
      child.destroySelf && child.destroySelf();
    }
  }

  clear() {
    this.unbindEvents();
    this.destroyAll();
    this.textManager.clear();
    this._methods = null;
    this._videos = [];
    this.elementTree = null;
    this.children = [];
    this.layoutTree = {};
    this.state = STATE.CLEAR;
    this.cssRules = null;
    this.cssDarkRules = null;

    ['touchstart', 'touchmove', 'touchcancel', 'touchend', 'click', 'repaint'].forEach(eventName => {
      this.off(eventName);
    });

    this.off('reflow');
    this.scrollview = null;

    delete this.layout;
    delete this.lastLayout;
  }

  clearPool() {
    console.log('clearPool');
    imgPool = {};
  }

  clearAll() {
    this.clear();
    this.clearPool();
    this.renderContext && this.renderContext.release();
  }

  static loadImgs(arr) {
    let promises = [];
    arr.forEach(src => {
      if (!imgPool[src]) {
        let p = new Promise((resolve, reject) => {
          const img = createImage();

          imgPool[src] = { image: img, loaded: false, onloads: [] };

          img.onload = () => {
            imgPool[src].loaded = true;
            const func = imgPool[src].onloads.pop()
            func && func(img);
            imgPool[src].onloads = [];

            resolve(src);
          }

          img.onerror = () => {
            delete imgPool[src];
            reject();
          }

          if (img.setSrc) {
            img.setSrc(src);
          } else {
            img.src = src;
          }
        });

        promises.push(p);
      }
    });

    return Promise.all(promises);
  }

  /**
   * 用于jscore里面的context和canvas解绑的时候释放资源
   * 包括canvas/context/image/video等和客户端相关的资源
   */
  releaseSource() {
    this.unbindEvents();
    this._videos.forEach(v => {
      if (v.decoder) {
        v.releaseDecoder()
      }
    });
    // this.canvasContext && this.canvasContext.release();
    this.canvasContext = null;
    this.renderContext = null;
    imgPool = {};
  }

  /**
   * 设置和layout相关的上下文，包括canvas，事件绑定，视频离屏canvas，图片
   */
  setLayoutContext(ctx) {
    this.layoutCtx = ctx;
  }

  _parseText(style, value, width, fontSizeRate) {
    value = String(value);
    let maxWidth = width;
    const wordWidth = this._getTextWidth(style, value, fontSizeRate);

    // 对文字溢出的处理，默认用...
    const textOverflow = style.textOverflow || 'ellipsis';

    // 文字最大长度不超限制
    if (wordWidth <= maxWidth) {
      return value;
    }

    // 对于用点点点处理的情况，先将最大宽度减去...的宽度
    if (textOverflow === 'ellipsis') {
      maxWidth -= this._getTextWidthWithoutSetFont('...', fontSizeRate);
    }

    let length = value.length - 1;
    let str = value.substring(0, length);

    while (this._getTextWidthWithoutSetFont(str, fontSizeRate) > maxWidth && length > 0) {
      length--;
      str = value.substring(0, length);
    }

    return (length && textOverflow === 'ellipsis'
      ? `${str}...`
      : str);
  }

  _getTextWidthWithoutSetFont(value, fontSizeRate) {
    return this._measureText({}, fontSizeRate)(value).width;
  }

  _getTextWidth(style, value, fontSizeRate) {
    return this._measureText({
      fontWeight: style.fontWeight,
      fontSize: style.fontSize,
      fontFamily: style.fontFamily
    }, fontSizeRate)(value).width;
  }
  _measureText({ fontStyle, fontWeight, fontSize, fontFamily }, fontSizeRate = 1) {
    return (str) => {
      let width = 0;
      const key = `${fontWeight || 'normal'}_${(fontSize || 12) * fontSizeRate}_${fontFamily || DEFAULT_FONT_FAMILY}_${str}`;
      if (charWidthMap[key]) {
        width = charWidthMap[key];
      } else {
        // log('new text', key);
        width = this.fontManager.measureText(str,
          fontWeight || 'normal',
          fontStyle || 'normal',
          (fontSize || 12) * fontSizeRate,
          fontFamily || DEFAULT_FONT_FAMILY) || 0;

        charWidthMap[key] = width;
      }
      return {
        width: width
      }
    }
  }
}

export function getLayout (opt) {
  return new Layout({
    style: {
      width: '100%',
      height: '100%',
    },
    name: 'layout',
    isDarkMode: opt.isDarkMode || (() => false),
    getWidth: opt.getWidth || (() => 0),
    getFontSize: opt.getFontSize || (() => 1),
    getFps: opt.getFps || (() => 0),
    canvasId: opt.canvasId,
    canvasContext: opt.canvasContext,
    fontManager: opt.fontManager,
    getSize: opt.getSize,
    scale: opt.scale,
  });
}


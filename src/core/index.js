import Element from './components/elements.js';
import Pool from './common/pool.js';
import Emitter from 'tiny-emitter';
import { isClick, STATE, setCharMap, nextTick } from './common/util.js';
import parser from './libs/fast-xml-parser/parser.js';
import { adaptor, updateLayout, calculateDirtyNode, initYoga } from './common/adaptor';
import PseudoClassManager from './common/pseudoClassManager.js';
import TextManager from './common/textManager.js';
import { charWidthMap, pointInRect, DEFAULT_FONT_FAMILY, getElementStyle } from './common/util.js';
import { dash2camel } from './common/util.js';
import RenderContextManager from './renderer/renderContextManager';

// components
import {
  View, Text, Image
} from './components/index.js'

const constructorMap = {
  view: View,
  text: Text,
  image: Image,
  // video: Video
}

/**
 * 节点初始化
 * @param {*} node 节点
 * @param {*} style 节点lightmode样式
 * @param {*} styleDark 节点darkmode样式
 * @param {*} isDarkMode 是否darkmode
 * @param {*} fontSize 字体大小
 */
const create = function (node, style, styleDark = {}, isDarkMode, fontSize) {
  const _constructor = constructorMap[node.name];

  const children = node.children || [];

  const attr = node.attr || {};
  const id = attr.id || '';

  const args = Object.keys(attr)
    .reduce((obj, key) => {
      const value = attr[key];
      const attribute = key;

      if (key === 'id') { // 有id的话，记录下这个id对应的style和:active伪类的style
        obj.styleInit = Object.assign(obj.styleInit || {}, style[id] || {});
        if (style[`${id}:active`]) { // 支持下active伪类
          obj.styleActive = Object.assign(obj.styleActive || {}, style[`${id}:active`] || {});
        }
        if (styleDark[id]) { // 支持下darkmode
          obj.styleDarkInit = Object.assign(obj.styleDarkInit || {}, styleDark[id] || {});
        }
        if (styleDark[`${id}:active`]) { // 支持下darkmode的active伪类
          obj.styleDarkActive = Object.assign(obj.styleDarkActive || {}, styleDark[`${id}:active`] || {});
        }
        return obj;
      }

      if (key === 'class') { // 有class的话，记录下这个class对应的style和:active伪类的style
        value.split(/\s+/).forEach((oneClass) => {
          obj.styleInit = Object.assign((obj.styleInit || {}), style[oneClass]);
          if (style[`${oneClass}:active`]) {
            obj.styleActive = Object.assign((obj.styleActive || {}), style[`${oneClass}:active`]);
          }
          if (styleDark[oneClass]) {
            obj.styleDarkInit = Object.assign((obj.styleDarkInit || {}), styleDark[oneClass]);
          }
          if (styleDark[`${oneClass}:active`]) {
            obj.styleDarkActive = Object.assign((obj.styleDarkActive || {}), styleDark[`${oneClass}:active`]);
          }
        });
        return obj;
      }

      if (key === 'style') {
        return obj;
      }

      if (/^data-/.test(key)) {
        const datakey = dash2camel(key.substring(5))
        !obj.dataset ? obj.dataset = { [datakey]: value } : obj.dataset[datakey] = value
      }

      if (value === 'true') {
        obj[attribute] = true
      } else if (value === 'false') {
        obj[attribute] = false
      } else {
        obj[attribute] = value
      }

      return obj;
    }, {});

  // 用于后续元素查询
  args.idName = id;
  args.className = attr.class || '';

  const element = new _constructor(args);
  ['onclick', 'ontouchstart', 'ontouchmove', 'ontouchend', 'ontouchcancel'].forEach((evtName) => {
    if (attr[evtName]) {
      const invokeMatches = args[evtName].match(/([a-zA-Z0-9]+)\((.+)\)/);
      const funcName = invokeMatches ? invokeMatches[1] : args[evtName];
      let funcParams = invokeMatches ? invokeMatches[2].split(',') : [];
      if (typeof this._methods[funcName] === 'function') {
        const func = this._methods[funcName];
        element.on(evtName.substring(2), (e) => {
          funcParams = funcParams.map(p => {
            if (p === '$event') {
              return e
            }
            return eval(p)
          })
          func.apply(this, !funcParams.length ? [e] : funcParams)
        })
      } else {
        console.warn(`${args[evtName]} is not a function`)
      }
    }
  })
  element.root = this;

  const s = isDarkMode
    ? Object.assign({}, element.styleInit, element.styleDarkInit, element.styleProp)
    : Object.assign({}, element.styleInit, element.styleProp);

  if (element.type === 'Text') {
    if (typeof s.height === 'undefined') {
      element.computedStyle.height = s.lineHeight || s.fontSize;
      element.noWrapHeight = s.lineHeight || s.fontSize;
    } else {
      element.computedStyle.height = s.height;
      element.noWrapHeight = s.height;
    }
    if (typeof s.width === 'undefined') {
      element.computedStyle.width = this._getTextWidth(s, element.valueInit, fontSize);
    }
    const computedStyle = isDarkMode
      ? Object.assign({}, element.styleInit, element.styleDarkInit, element.styleProp, element._innerStyle)
      : Object.assign({}, element.styleInit, element.styleProp, element._innerStyle);
    element.noWrapWidth = computedStyle.width;
  }

  children.forEach(childNode => {
    const childElement = create.call(this, childNode, style, styleDark, isDarkMode, fontSize);
    element.add(childElement);
  });

  // 创建新节点的时候，搜集下文本节点
  if (element.type === 'Text') {
    this.textManager.addTextNode(element);
  }

  // if (element.type === 'Video') {
  //   this._videos.push(element);
  //   if (attr.poster) {
  //     const poster = create.call(this, {
  //       name: 'image',
  //       attr: {
  //         src: attr.poster,
  //         styleInit: element.styleInit
  //       }
  //     }, {}, {}, isDarkMode, fontSize);
  //     element.add(poster);
  //     element._poster_ = poster;
  //   }
  //   const play = create.call(this, {
  //     name: 'view',
  //     attr: {
  //       styleInit: {
  //         position: 'absolute',
  //         top: 0,
  //         left: 0,
  //         right: 0,
  //         bottom: 0,
  //         display: 'flex',
  //         justifyContent: 'center',
  //         alignItems: 'center',
  //         backgroundColor: 'rgba(0,0,0,0)'
  //       }
  //     }
  //   })
  //   const icon = create.call(this, {
  //     name: 'image',
  //     attr: {
  //       src: 'common/assets/play.png',
  //       styleInit: {
  //         width: 38,
  //         height: 38,
  //       },
  //       styleActive: {
  //         width: 38,
  //         height: 38,
  //       }
  //     }
  //   })

  //   icon.on('touchstart', () => { });
  //   icon.on('click', () => { });
  //   icon.on('touchend', function (e) {
  //     element.play();
  //     e.stopPropagation();
  //   });
  //   play.add(icon);
  //   element.add(play);
  //   element._play_ = play;
  // }

  const keys = [];
  const keysDark = [];
  for (const key in args.styleActive) {
    keys.push(key);
  }
  for (const key in args.styleDarkActive) {
    keysDark.push(key);
  }
  if (keys.length > 0 || keysDark.length > 0) {
    if (keys.length > 0) {
      element.hasActiveStyle = true; // 节点是否有active的style
    }
    if (keysDark.length > 0) {
      element.hasDarkActiveStyle = true; // 节点是否有darkmode下active的style
    }
    element.isActive = false; // 节点是否active了
    this.pseudoClassManager.addActiveNode(element);
  }

  return element;
}

/**
 * 格式化渲染相关的数据
 * @param {Array} children 子节点
 * @param {Boolean} isDarkMode 是否暗黑模式
 * @param {Number} fontSize 字体大小
 * @param {Array} webGLRenderData
 */
function layoutChildren(children, isDarkMode, fontSize, webGLRenderData) {
  for (let i = 0; i < children.length; i++) {
    const child = children[i];

    const style = getElementStyle.call(child, isDarkMode);
    const computedStyle = getElementStyle.call(child, isDarkMode);
   
    child.realLayoutBox = child.realLayoutBox || {};

    ['left', 'top', 'width', 'height'].forEach((prop) => {
      child.realLayoutBox[prop] = child.layoutBox[prop];
    });

    if (child.parent) {
      child.layoutBox.absoluteX = (child.parent.layoutBox.absoluteX || 0) + child.layoutBox.left;
      child.layoutBox.absoluteY = (child.parent.layoutBox.absoluteY || 0) + child.layoutBox.top;
      child.realLayoutBox.realX = (child.parent.realLayoutBox.realX || 0) + child.realLayoutBox.left;
      child.realLayoutBox.realY = (child.parent.realLayoutBox.realY || 0) + child.realLayoutBox.top;
    } else {
      child.layoutBox.absoluteX = child.layoutBox.left;
      child.layoutBox.absoluteY = child.layoutBox.top;
      child.realLayoutBox.realX = child.realLayoutBox.left;
      child.realLayoutBox.realY = child.realLayoutBox.top;
    }

    // child.layoutBox.borderRadius = style.borderRadius || 0; // layoutBox要保存下圆角的信息，用于其子节点的绘制
    child.layoutBox.originalAbsoluteY = child.layoutBox.absoluteY;

    if (child.type === 'ScrollView') { // 滚动列表的画板尺寸和主画板保持一致
      child.updateRenderPort(this.renderport);
    } else if (child.type === 'Text') { // 文本节点处理下ellipsis
      const width = child.layoutBox.width > child.parent.layoutBox.width
        ? child.parent.layoutBox.width
        : child.layoutBox.width;

      const textWidth = this._getTextWidth(style, child.valueInit);
      if (
        style.textOverflow === 'ellipsis'
        && style.whiteSpace === 'nowrap'
        && width + 0.5 < textWidth // todo hardcode处理，由于yoga会取整，这里我再加0.5的宽度
      ) {
        child.valueShow = this._parseText(style, child.valueInit, width, fontSize);
      } else if (
        style.textOverflow === 'ellipsis'
        && style.whiteSpace === 'nowrap'
        && width + 0.5 >= textWidth
        && child.valueShow !== child.valueInit
      ) {
        child.valueShow = child.valueInit;
      }
    }

    if (child.glRect) {
      child.glRect = null;
    }
    if (computedStyle.display === 'none') {
      continue;
    }
    // 子节点的updateRenderData会收集渲染相关的数据
    child.updateRenderData && child.updateRenderData(computedStyle);
    layoutChildren.call(this, child.childNodes, isDarkMode, fontSize, webGLRenderData);
  }
}

/**
 * 获取节点需要缓存的数据
 * @param {Array} childNodes
 */
function getNodeData(childNodes) {
  const layoutData = [];
  for (let i = 0; i < childNodes.length; i++) {
    const child = childNodes[i];
    layoutData[i] = {
      layoutBox: child.layoutBox, // 布局信息
      type: child.type, // 节点信息
      id: child.id, // 每个节点都有个id
      styleInit: child.styleInit,
      styleProp: child.styleProp,
      styleDarkInit: child.styleDarkInit,
      computedStyle: JSON.parse(JSON.stringify(child.computedStyle))
    }
    if (child.type === 'Text') { // 文本节点还要存下文本内容信息
      layoutData[i]['value'] = child.value;
      layoutData[i]['valueBreak'] = child.valueBreak;
    }
    if (child.childNodes && child.childNodes.length) {
      layoutData[i].childNodes = getNodeData(child.childNodes);
    } else {
      layoutData[i].childNodes = [];
    }
  }
  return layoutData;
}

// 恢复布局数据，需要保证节点树、节点样式完全一致
function restoreLayoutTree(childNodes, layoutNodes) {
  let ret = true;
  for (let i = 0; i < childNodes.length; i++) {
    const child = childNodes[i];
    const node = layoutNodes[i];
    if (
      child.type === node.type
      && JSON.stringify(child.styleInit) === JSON.stringify(node.styleInit)
      && JSON.stringify(child.styleProp) === JSON.stringify(node.styleProp)
      && JSON.stringify(child.styleDarkInit) === JSON.stringify(node.styleDarkInit)
    ) {
      child.layoutBox = node.layoutBox;
      if (child.type === 'text') {
        child.valueBreak = node.valueBreak;
      }
      if (child.childNodes.length !== node.childNodes.length) {
        ret = false;
      } else {
        ret = restoreLayoutTree(child.childNodes, node.childNodes);
      }
      if (!ret) break;
    } else {
      ret = false;
      break;
    }
  }
  return ret;
}

function _getElementById(tree, id) {
  let result = null;
  for (let i = 0; i < tree.childNodes.length; i++) {
    const child = tree.childNodes[i];
    if (child.idName === id) {
      result = child;
      break;
    } else if (child.childNodes.length) {
      result = _getElementById(child, id);
      if (result) break;
    }
  }
  return result;
}

function _getElementsByClassName(tree, list = [], className) {
  for (let i = 0; i < tree.childNodes.length; i++) {
    const child = tree.childNodes[i];
    if (child.className.split(/\s+/).indexOf(className) > -1) {
      list.push(child);
    }
    if (child.childNodes.length) {
      _getElementsByClassName(child, list, className);
    }
  }

  return list;
}

function _getChildsByPos(tree, x, y, list = []) {
  let ret = [];
  for (let i = 0; i < tree.childNodes.length; i++) {
    const child = tree.childNodes[i];
    const box = child.realLayoutBox;
    if ((box.realX <= x && x <= box.realX + box.width)
      && (box.realY <= y && y <= box.realY + box.height)
      && child.computedStyle.display !== 'none') {
      if (child.childNodes.length) {
        ret = _getChildsByPos(child, x, y, list);
      } else {
        list.push(child);
        ret.push(child);
      }
    }
  }

  if (ret.length === 0 && tree.computedStyle.display !== 'none') { // 子节点都没有，就是点击了tree
    list.push(tree);
    ret.push(tree);
  }
  return list;
}

class _Layout extends Element {
  constructor({ style, name, isDarkMode, getWidth, getFontSize, getFps, canvasId, canvasContext, fontManager } = {}) {
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
    if (canvasContext) {
      this.setCanvasContext(canvasContext);
    }
    this.fontManager = fontManager;

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
    this.getFontSize = getFontSize || (() => 1);
    this.getFps = getFps || (() => 0);

    this.state = STATE.UNINIT;
    this.imgPool = new Pool('imgPool');
    this._emitter = new Emitter();
    this._EE = new Emitter();

    this.viewport = {
      width: getWidth(),
    }; // 不包含像素的宽高

    this._videos = [];
    this._firstComputeLayout = true; // 是否首次计算布局
    this._useLayoutData = false; // 是否使用了序列化的布局数据
  }

  methods(config) {
    this._methods = config
  }

  setCanvasContext(ctx) {
    this.canvasContext = ctx;
    // this.renderContext = setupGl(ctx.canvas);
    this.renderContext = new RenderContextManager(ctx);
  }

  initRepaint() { }

  init(template, style, styleDark = {}) {
    return initYoga().then(() => {
      const start = new Date();

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

      /*if( parser.validate(template) === true) { //optional (it'll return an object in case it's not valid)*/
      const jsonObj = parser.parse(template, { // todo 需要一个预解析操作
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
      }, true);
      /*}*/

      const xmlTree = jsonObj.children[0];

      this.debugInfo.xmlTree = new Date() - start;
      console.log(`init getXmlTree time ${new Date() - start}`);
      // XML树生成渲染树
      this.layoutTree = create.call(
        this,
        xmlTree,
        style,
        styleDark,
        this.isDarkMode(),
        this.getFontSize()
      );
      console.log(`create time ${new Date() - start}`);
      this.debugInfo.layoutTree = new Date() - start;
      this.add(this.layoutTree);

      this.debugInfo.renderTree = new Date() - start;

      this.state = STATE.INITED;

      this.reflowRequest = 0;
      this.repaintRequest = 0;

      // 收到reflow事件后，知道下一个loop没有reflow才执行computeLayout
      this.on('reflow', () => {
        this.reflowRequest++;
        Promise.resolve(this.reflowRequest).then((val) => {
          if (this.reflowRequest === val) {
            console.log('layout reflow');
            this.reflowRequest = 0;
            this.textManager.hasUpdate = false;

            this.computeLayout();
            this.drawLayout();
          }
        });
      });

      console.log(`init time ${new Date() - start}`);
      this.computeLayout();
    })
  }

  forceUpdate() {
    console.log('forceUpdate--------');
    if (this.flushing) {
      return
    }
    this.flushing = true
    nextTick(() => {
      console.log('nextTick forceUpdate--------');
     
      this.repaint();
      this.flushing = false;
    })
  }

  beforeReflow(childNodes) {
    childNodes = childNodes || this.childNodes;
    for (let i = 0, len = childNodes.length; i < len; i++) {
      if (childNodes[i].beforeReflow) {
        childNodes[i].beforeReflow();
      }
      this.beforeReflow(childNodes[i].childNodes)
    }
  }

  // 把数据丢给渲染线程
  repaint() {
    console.log('repaint call');
    const renderer = this.renderContext;
    console.log(renderer.glRects.length);
    renderer.draw();
   
  }

  getLayoutData() { // 缓存layout相关的数据，方便冷启动时恢复
    const data = {
      charWidthMap: charWidthMap, // 存下之前计算过的文本的宽度，避免重复计算
      layoutBoxTree: {
        layoutBox: this.layoutBox,
        childNodes: getNodeData(this.childNodes),
      },
    };
    // console.log(data);
    return data;
  }

  setLayoutData(data) {
    console.log('set layoutData', data.charWidthMap);
    this.layoutData = data;
    if (data.charWidthMap) {
      setCharMap(data.charWidthMap);
    }
  }

  // 计算布局树
  computeLayout() {
    console.log('start computeLayout');
    const start = new Date();
    this.renderport.height = 0;
    this.viewport.width = this.getWidth();

    const isDarkMode = this.isDarkMode();
    const fontSize = this.getFontSize();

    // 第一层根节点，宽度如果是设置了百分比，把宽度改成屏幕的宽度
    for (let i = 0; i < this.childNodes.length; i++) {
      const child = this.childNodes[i];
     
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
      && this.layoutData.layoutBoxTree.childNodes
      && this.layoutData.layoutBoxTree.childNodes.length
    ) { // 有layout数据，不用再用yoga跑一遍
      const layoutBoxTree = this.layoutData.layoutBoxTree;
      this.layoutBox = layoutBoxTree.layoutBox;
      if (restoreLayoutTree(this.childNodes, layoutBoxTree.childNodes)) {
        console.log('restoreLayoutTree success');
        this.layoutData = null;
        this.textManager.hasUpdate = true;
        this._useLayoutData = true;
      } else {
        console.log('restoreLayoutTree fail');
        this.layoutData = null;
        adaptor(this);
      }
    } else {
      console.log('without layoutData');
      adaptor(this);
      this._useLayoutData = false;
    }

    this.debugInfo.yogaLayout = new Date() - start;
    console.log(`yoga-layout time ${this.debugInfo.yogaLayout}`);

    this.debugInfo.computeLayout = new Date() - start;

    // 这里更新下文本节点的宽高
    if (!this.textManager.hasUpdate) {
      this.textManager.hasUpdate = true;
      this.textManager.updateTextNodeLayoutBox();
      console.log('updateTextNodeLayoutBox');
      calculateDirtyNode(this);
      updateLayout(this);
    }

    const webGLRenderData = [];

    console.log('before renderContext clear');
    this.renderContext.clear();
    layoutChildren.call(
      this,
      this.childNodes,
      isDarkMode,
      fontSize,
      webGLRenderData
    );

    for (let i = 0; i < this.childNodes.length; i++) {
      this.renderport.height += this.childNodes[i].layoutBox.height;
    }
    this.viewport.height = this.renderport.height;
    console.log('viewport.height', this.viewport.height);

    this.renderContext.width = this.viewport.width;
    this.renderContext.height = this.viewport.height;

    this.debugInfo.layoutChildren = new Date() - start;

    console.log(`computeLayout time ${this.debugInfo.computeLayout}`);
   
    if (this._firstComputeLayout && !this._useLayoutData) { // 这里统计首次计算布局并且没有序列化数据的耗时
      this._firstComputeLayout = false;
    } else if (!this._useLayoutData) {
    } else if (this._useLayoutData) {
    }
  }

  restore(elementTree, layoutBox) {
    this.elementTree = elementTree;
    this.updateViewPort(layoutBox);
  }

  // 渲染布局树
  drawLayout() {
    const start = new Date();
    if (!this.canvasContext) {
      return;
    }
    console.log('drawLayout')
    this.debugInfo.renderChildren = new Date() - start;

    this.bindEvents();

    this.state = STATE.RENDERED;
    this.forceUpdate();
  }

  // 根据x和y找到相应的子节点
  getChildByPos(tree, x, y) {
    const list = _getChildsByPos(tree, x, y, []);
    const length = list.length;
    return list[length - 1];
  }

  eventHandler(eventName) {
    return function touchEventHandler(e) {
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
      console.log(eventName, 'item', item.className);
      event.item = item;
      event.target = item;

      item && item.emit(eventName, event);

      if (eventName === 'touchstart' || eventName === 'touchend') {
        this.touchMsg[eventName] = touch;
      }

      if (eventName === 'touchend' && isClick(this.touchMsg)) {
        console.log('emit click event!')
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
    // console.log('bindEvents call');
    if (this.hasEventHandler) {
      return;
    }
    console.log('bindEvents call');

    this.hasEventHandler = true;

    this._touchStartHandler = (e) => {
      console.log('touch start');
      this.touchStart(e);
    }
    this._touchMoveHandler = (e) => {
      this.touchMove(e);
    }
    this._touchEndHandler = (e) => {
      console.log('touch end');
      this.touchEnd(e);
      // console.log('before pseudoClassManager clearActiveState');
      this.pseudoClassManager.clearActiveState(); // 清除所有:active的状态
    }
    this._touchCancelHandler = (e) => {
      this.touchCancel(e);
      this.pseudoClassManager.clearActiveState(); // 清除所有:active的状态
    }

    // this.canvasContext.addEventListener('mousedown', this._touchStartHandler);
    console.log('canvasContext addEventListener ', this.canvasContext);
    this.canvasContext.addEventListener('touchstart', this._touchStartHandler);
    this.canvasContext.addEventListener('touchmove', this._touchMoveHandler);
    this.canvasContext.addEventListener('touchend', this._touchEndHandler);
    // this.canvasContext.addEventListener('mouseup', this._touchEndHandler);
    this.canvasContext.addEventListener('touchcancel', this._touchCancelHandler);
  }

  unbindEvents() {
    if (this.hasEventHandler) {
      console.log('removeEventListener when clear');
      this.canvasContext.removeEventListener('touchstart', this._touchStartHandler);
      this.canvasContext.removeEventListener('touchmove', this._touchMoveHandler);
      this.canvasContext.removeEventListener('touchend', this._touchEndHandler);
      this.canvasContext.removeEventListener('touchcancel', this._touchCancelHandler);
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

    for (let i = 0; i < tree.childNodes.length; i++) {
      const child = tree.childNodes[i];
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
    this.childNodes = [];
    this.children = {};
    this.layoutTree = {};
    this.state = STATE.CLEAR;

    ['touchstart', 'touchmove', 'touchcancel', 'touchend', 'click', 'repaint'].forEach(eventName => {
      this.off(eventName);
    });

    this.EE.off('image__render__done');
  }

  clearPool() {
    this.imgPool.clear();
    // this.canvasPool.clear();
  }

  clearAll() {
    this.clear();
    this.clearPool();
  }

  loadImgs(arr) {
    arr.forEach(src => {
      const img = this.canvasContext.createImage();

      this.imgPool.set(src, img);

      img.onload = () => {
        img.loadDone = true;
      }

      img.onloadcbks = [];
      img.setSrc(src);
    });
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
    this.imgPool.clear();
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
        // console.log('new text', key);
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

const newInstance = function (opt) {
  return new _Layout({
    style: {
      width: 'auto',
      height: 'auto',
    },
    name: 'layout',
    isDarkMode: opt.isDarkMode || (() => false),
    getWidth: opt.getWidth || (() => 0),
    getFontSize: opt.getFontSize || (() => 1),
    getFps: opt.getFps || (() => 0),
    canvasId: opt.canvasId,
    canvasContext: opt.canvasContext,
    fontManager: opt.fontManager
  });
}

export default { newInstance };

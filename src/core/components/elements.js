import { scalableStyles, reflowStyles } from './style.js';
import { nextTick } from '../common/util.js';
import { getRgba, getElementStyle } from '../common/util';

let uuid = 0;

const toEventName = (event, id) => {
  const elementEvent = ['click', 'touchstart', 'touchmove', 'touchend', 'touchcancel', 'scroll'];

  if (elementEvent.indexOf(event) !== -1) {
    return `element-${id}-${event}`;
  }

  return `element-${id}-${event}`;
};

/* eslint no-param-reassign: ["error", { "props": false }] */
/* eslint no-underscore-dangle: ["error", { "allowAfterThis": true }] */
export default class Element {
  constructor({
    styleInit = {},
    styleActive = {},
    styleDarkInit = {},
    styleDarkActive = {},
    props = {},
    dataset = {},
    idName = '',
    className = '',
    id = (uuid += 1),
  }) {
    this.children = [];
    this.parent = null;
    this.parentId = 0;
    this.id = id;
    this.props = props;
    this.idName = idName;
    this.className = className;
    this.styleInit = styleInit;
    this.styleActive = styleActive;
    this.styleDarkInit = styleDarkInit;
    this.styleDarkActive = styleDarkActive;
    this.dataset = dataset;
    this.root = null;
    this.isDestroyed = false;
    this.layoutBox = {};
    this.permanentListeners = {}; // 常驻监听
    this.onceListeners = {}; // 单次监听

    // 保存用户写在属性上的style，同时也保存用户通过xxxx.style.xxxx设置的style
    this.styleProp = {};
    // 为了让用户修改style的时候，可以触发reflow，这里需要监听style属性的变化，只给用户修改样式的时候使用
    this.styleOrigin = new Proxy({}, {
      set: (obj, key, value) => {
        if (value !== this.styleProp[key]) {
          this.styleProp[key] = value;

          if (reflowStyles.indexOf(key) > -1) {
            this.root.emit('reflow');
          } else {
            this.forceUpdate();
          }
        }
        return true;
      },
      get: (obj, key) => {
        let isDarkMode = false;
        if (this.root) {
          isDarkMode = this.root.isDarkMode();
        } else {
          isDarkMode = this.isDarkMode();
        }
        if (isDarkMode) {
          return this.styleProp[key] || this.styleDarkInit[key] || this.styleInit[key];
        }
        let res = this.styleProp[key] || this.styleInit[key];

        return res;
      },
    });

    this._innerStyle = {};
    this.computedStyle = new Proxy(this._innerStyle, {
      set: (obj, key, value) => {
        obj[key] = value;
        this._innerStyle[key] = value;
        return true;
      },
      get: (obj, key) => {
        let isDarkMode = false;
        if (this.root) {
          isDarkMode = this.root.isDarkMode();
        } else {
          isDarkMode = this.isDarkMode();
        }

        if (isDarkMode) {
          return obj[key] || this.styleProp[key] || this.styleDarkInit[key] || this.styleInit[key];
        }
        return obj[key] || this.styleProp[key] || this.styleInit[key];
      },
    });

    nextTick(() => {
      // 事件冒泡逻辑
      ['touchstart', 'touchmove', 'touchcancel', 'touchend', 'click', 'scroll'].forEach((eventName) => {
        this.EE.on(toEventName(eventName, this.id), (e, touchMsg) => {
          if (!this.permanentListeners[eventName]) { // 本身没有事件处理器，直接抛给父节点
            this.parent && this.parent.emit(eventName, e, touchMsg);
          } else { // 有事件处理器，看看有没有阻止冒泡
            let canBubble = true;
            const listeners = this.permanentListeners[eventName];
            e.currentTarget = this;
            e.stopPropagation = () => {
              canBubble = false;
            };
            Object.keys(listeners).forEach((key) => {
              listeners[key](e, touchMsg);
            });
            if (canBubble && this.parent) {
              this.parent.emit(eventName, e, touchMsg);
            }
          }
        });
      });

      this.initRepaint();
    });
  }

  get EE() {
    if (this.root) {
      return this.root._EE; // eslint-disable-line
    }
    return this._EE;
  }

  set EE(val) {
    // do not remove
  }

  get renderer() {
    if (this.root) {
      return this.root.renderContext;
    }
    return this.renderContext;
  }

  get hasBorderRadius() {
    const isDarkMode = this.root.isDarkMode();
    const style = getElementStyle.call(this, isDarkMode);

    return style.borderRadius ||
      style.borderLeftBottomRadius ||
      style.borderLeftTopRadius ||
      style.borderRightBottomRadius ||
      style.borderRightTopRadius;
  }

  get ctx() {
    if (this.root) {
      return this.root.canvasContext && this.root.canvasContext.ctx;
    }

    return this.canvasContext && this.canvasContext.ctx;
  }

  initRepaint() {
    this.on('repaint', (e) => {
      this.parent && this.parent.emit('repaint', e);
    });
  }

  get width() {
    return this.layoutBox.width || 0;
  }

  get height() {
    return this.layoutBox.height || 0;
  }

  get size() {
    return [this.width, this.height];
  }

  get x() {
    return this.layoutBox.absoluteX;
  }

  get y() {
    return this.layoutBox.absoluteY;
  }

  get pos() {
    return [this.x, this.y];
  }

  get opacity() {
    let opacity = 1;
    if (this.style.opacity !== undefined) {
      opacity = this.style.opacity;
    }
    let parent = this.parent;

    while (parent) {
      opacity *= (parent.style.opacity !== undefined ? parent.style.opacity : 1);

      parent = parent.parent;
    }

    return opacity;
  }

  forceUpdate(...args) {
    if (this.parent) {
      this.parent.forceUpdate(...args);
    }
  }

  repaint(...args) {
    if (this.parent) {
      this.parent.repaint(...args);
    }
  }

  _activeTree(node) {
    node._active();

    node.children.forEach(child => {
      this._activeTree(child);
    })
  }

  _deactiveTree(node) {
    node._deactive();

    node.children.forEach(child => {
      this._deactiveTree(child);
    })
  }

  // 子类填充实现
  _active() {

  }

  // 子类填充实现
  _deactive() {

  }

  // 子类填充实现
  insert() {}

  checkNeedRender() {
    return true;
  }

  // 子类填充实现
  destroy() {
    ['touchstart', 'touchmove', 'touchcancel', 'touchend', 'click', 'repaint', 'scroll'].forEach((eventName) => {
      this.off(eventName);
    });

    this.isDestroyed = true;
    this.EE = null;
    this.root = null;
    this.parent = null;
    this.realLayoutBox = null;
    this.layoutBox = null;
    this.props = null;
    this.style = null;

    if (this.renderBoxes) {
      this.renderBoxes = null;
    }
  }

  add(element) {
    element.parent = this;
    element.parentId = this.id;

    this.children.push(element);
  }

  remove(element) {
    if (!element) {
      return false;
    }

    element.parent = null;
    element.parentId = null;

    const index = this.children.indexOf(element);
    if (index === -1) {
      return false;
    }

    this.children.splice(index, 1);

    return true;
  }

  emit(event, ...theArgs) {
    this.EE && this.EE.emit(toEventName(event, this.id), ...theArgs);
  }

  on(event, callback) {
    if (!this.permanentListeners[event]) {
      this.permanentListeners[event] = {};
    }

    this.permanentListeners[event][toEventName(event, this.id)] = callback;
  }

  once(event, callback) {
    this.EE && this.EE.once(toEventName(event, this.id), callback);
  }

  off(event, callback) {
    this.EE && this.EE.off(toEventName(event, this.id), callback);
  }

  clip(dimension) {
    const [baseX, baseY, boxWidth, boxHeight] = dimension || this.getDimension(); // eslint-disable-line
    this.getRoundRectMask(boxWidth, boxHeight);
    this.root.maskCtx.globalCompositeOperation = 'source-out';
    return this.root.maskCtx;
  }

  getDimension() {
    const box = this.layoutBox;

    return [box.absoluteX, box.absoluteY, box.width, box.height];
  }

  getRoundRectMask(width, height) {
    const canvas = this.root.maskCanvas;
    const ctx = this.root.maskCtx;

    const isDarkMode = this.root.isDarkMode();
    const style = getElementStyle.call(this, isDarkMode);
    const { borderRadius } = style;
    let {
      borderLeftTopRadius,
      borderRightTopRadius,
      borderLeftBottomRadius,
      borderRightBottomRadius,
    } = style;

    if (width === 0 || height === 0) {
      return;
    }

    if (this.maskData && width === this.maskData.width && height === this.maskData.height) {
      if (canvas.width !== this.maskData.width) {
        canvas.width = this.maskData.width;
      }
      if (canvas.height !== this.maskData.height) {
        canvas.height = this.maskData.height;
      }
      ctx.putImageData(this.maskData, 0, 0);
      return;
    }

    if (canvas.width !== width) {
      canvas.width = width;
    }
    if (canvas.height !== height) {
      canvas.height = height;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    borderLeftTopRadius = borderLeftTopRadius || borderRadius || 0;
    borderRightTopRadius = borderRightTopRadius || borderRadius || 0;
    borderLeftBottomRadius = borderLeftBottomRadius || borderRadius || 0;
    borderRightBottomRadius = borderRightBottomRadius || borderRadius || 0;

    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.moveTo(0, borderLeftTopRadius);
    ctx.arcTo(0, 0, width - borderRightTopRadius, 0, borderLeftTopRadius);
    ctx.arcTo(width, 0, width, height - borderRightBottomRadius, borderRightTopRadius);
    ctx.arcTo(width, height, width - borderLeftBottomRadius, height, borderRightBottomRadius);
    ctx.arcTo(0, height, 0, borderLeftTopRadius, borderLeftBottomRadius);
    ctx.lineTo(0, height);
    ctx.lineTo(width, height);
    ctx.lineTo(width, 0);
    ctx.lineTo(0, 0);
    ctx.fill();

    console.log('compute round rect mask!');

    this.maskData = ctx.getImageData(0, 0, width, height);
  }

  getBoundingClientRect() { // 得到元素的box
    return {
      top: this.layoutBox.absoluteY,
      left: this.layoutBox.absoluteX,
      width: this.layoutBox.width,
      height: this.layoutBox.height,
    };
  }

  _refreshStyleAfterClassSet(className) {
    const { root } = this;

    this.className = className.join(' ');

      this.styleInit = {};
      this.styleActive = {};
      this.styleDarkInit = {};
      this.styleDarkActive = {};

      className.reduce((res, oneClass) => Object.assign(res, root.cssRules[oneClass]), this.styleInit || {});
      className.reduce((res, oneClass) => {
        if (root.cssRules[`${oneClass}:active`]) {
          return Object.assign(res, root.cssRules[`${oneClass}:active`]);
        }
        return res;
      }, this.styleActive || {});
      className.reduce((res, oneClass) => Object.assign(res, root.cssDarkRules[oneClass]), this.styleDarkInit || {});
      className.reduce((res, oneClass) => {
        if (root.cssDarkRules[`${oneClass}:active`]) {
          return Object.assign(res, root.cssDarkRules[`${oneClass}:active`]);
        }
        return res;
      }, this.styleDarkActive || {});

      Object.keys(this.styleProp).forEach((prop) => {
        this.styleInit[prop] = this.styleProp[prop];
        this.styleDarkInit[prop] = this.styleProp[prop];
      });

      this.root.beforeReflow();
      this.root.emit('reflow');
  }

  removeClass(name) { // 去除节点的一个class，会导致整个布局重绘
    // console.log('removeClass', this);
    const className = this.className.split(' ');
    const classNameIdx = className.indexOf(name);
    if (classNameIdx > -1) {
      const { root } = this;
      className.splice(classNameIdx, 1);

      this._refreshStyleAfterClassSet(className)
    }
  }

  addClass(name) { // 给节点加一个class，会导致整个布局重绘
    const className = this.className.split(' ');
    if (className.indexOf(name) === -1) { // 是一个新的class
      const { root } = this;
      className.push(name);
      this.className = className.join(' '); // 更新下className

      this._refreshStyleAfterClassSet(className);
    }
  }

  getAttribute(attr) {
    return this[attr] || null;
  }
}

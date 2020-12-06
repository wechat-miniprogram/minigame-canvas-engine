import {
  scalableStyles,
  reflowStyles
} from './style.js';
import {
  nextTick
} from '../common/util.js';

let uuid = 0;

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  } : null;
}

function getRgba(hex, opacity) {
  const rgbObj = hexToRgb(hex);
  let o = opacity;

  if (opacity === undefined) {
    o = 1;
  }

  return `rgba(${rgbObj.r}, ${rgbObj.g}, ${rgbObj.b}, ${o})`;
}

const toEventName = (event, id) => {
  const elementEvent = ['click', 'touchstart', 'touchmove', 'touchend', 'touchcancel'];

  if (elementEvent.indexOf(event) !== -1) {
    return `element-${id}-${event}`;
  }

  return `element-${id}-${event}`;
};

/**
 * 格式化样式
 * @param {Object} style
 */
const formatStyle = (style) => {
  if (style.opacity !== undefined &&
    style.color &&
    style.color.indexOf('#') > -1
  ) {
    style.color = getRgba(style.color, style.opacity);
  }

  if (style.opacity !== undefined &&
    style.backgroundColor &&
    style.backgroundColor.indexOf('#') > -1
  ) {
    style.backgroundColor = getRgba(style.backgroundColor, style.opacity);
  }

  Object.keys(style).forEach((key) => {
    if (scalableStyles.indexOf(key) > -1 && typeof style[key] === 'number') {
      style[key] *= 1;
    }
  });

  return style;
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
    this.childNodes = [];
    this.parent = null;
    this.parentId = 0;
    this.id = id;
    this.props = props;
    this.idName = idName;
    this.className = className;
    this.styleInit = formatStyle(styleInit);
    this.styleActive = formatStyle(styleActive);
    this.styleDarkInit = formatStyle(styleDarkInit);
    this.styleDarkActive = formatStyle(styleDarkActive);
    this.dataset = dataset;
    this.root = null;
    this.isDestroyed = false;
    this.layoutBox = {};
    this.permanentListeners = {}; // 常驻监听
    this.onceListeners = {}; // 单次监听

    // 保存用户写在属性上的style，同时也保存用户通过xxxx.style.xxxx设置的style
    this.styleProp = {};
    // 为了让用户修改style的时候，可以触发reflow，这里需要监听style属性的变化，只给用户修改样式的时候使用
    this.style = new Proxy({}, {
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
        return this.styleProp[key] || this.styleInit[key];
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
      ['touchstart', 'touchmove', 'touchcancel', 'touchend', 'click'].forEach((eventName) => {
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
    const style = isDarkMode ?
      Object.assign({}, this.styleInit, this.styleDarkInit, this.styleProp, this._innerStyle) :
      Object.assign({}, this.styleInit, this.styleProp, this._innerStyle);

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

  // 子类填充实现
  insert() {}

  checkNeedRender() {
    return true;
  }

  // 子类填充实现
  destroy() {
    ['touchstart', 'touchmove', 'touchcancel', 'touchend', 'click', 'repaint'].forEach((eventName) => {
      this.off(eventName);
    });
    this.EE.off('image__render__done');

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

    this.childNodes.push(element);
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

  renderBorder(ctx, layoutBox) {
    const isDarkMode = this.root.isDarkMode();
    const style = isDarkMode ?
      Object.assign({}, this.styleInit, this.styleDarkInit, this.styleProp, this._innerStyle) :
      Object.assign({}, this.styleInit, this.styleProp, this._innerStyle);

    if (
      this.hasBorderRadius
    ) {
    }

    const box = layoutBox || this.layoutBox;
    const borderWidth = style.borderWidth || 0;
    
    const borderLeftWidth = style.borderLeftWidth || borderWidth;
    const borderRightWidth = style.borderRightWidth || borderWidth;
    const borderTopWidth = style.borderTopWidth || borderWidth;
    const borderBottomWidth = style.borderBottomWidth || borderWidth;

    const radius = style.borderRadius || 0;
    const {
      borderColor
    } = style;
    const drawX = box.absoluteX;
    const drawY = box.absoluteY;

    ctx.save();
    ctx.beginPath();

    if (borderTopWidth && (borderColor || style.borderTopColor)) {
      ctx.lineWidth = borderTopWidth;
      ctx.strokeStyle = style.borderTopColor || borderColor;

      if (radius && borderWidth && borderColor) {
        ctx.arc(
          drawX + radius,
          drawY + radius,
          radius,
          Math.PI,
          1.5 * Math.PI,
        );
      }

      ctx.moveTo(
        radius ? drawX + radius : drawX,
        drawY,
      );

      ctx.lineTo(
        radius ? drawX + box.width - radius : drawX + box.width,
        // drawY + borderTopWidth / 2
        drawY,
      );
    }

    if (borderRightWidth && (borderColor || style.borderRightColor)) {
      ctx.lineWidth = borderRightWidth;
      ctx.strokeStyle = style.borderRightColor || borderColor;

      if (radius && borderWidth && borderColor) {
        // console.log('右上角圆角')
        ctx.arc(
          drawX + box.width - radius,
          drawY + radius,
          radius,
          1.5 * Math.PI,
          0,
        );
      }

      ctx.moveTo(
        drawX + box.width,
        radius ? drawY + radius : drawY,
      );

      ctx.lineTo(
        drawX + box.width,
        radius ? drawY + box.height - radius : drawY + box.height,
      );
    }

    if (borderBottomWidth && (borderColor || style.borderBottomColor)) {
      ctx.lineWidth = borderBottomWidth;
      ctx.strokeStyle = style.borderBottomColor || borderColor;

      if (radius && borderWidth && borderColor) {
        // console.log('右下角圆角')
        ctx.arc(
          drawX + box.width - radius,
          drawY + box.height - radius,
          radius,
          0,
          0.5 * Math.PI,
        );
      }

      ctx.moveTo(
        radius ? drawX + radius : drawX,
        drawY + box.height,
      );

      ctx.lineTo(
        radius ? drawX + box.width - radius : drawX + box.width,
        drawY + box.height,
      );
    }

    if (borderLeftWidth && (borderColor || style.borderLeftColor)) {
      ctx.lineWidth = borderLeftWidth;
      ctx.strokeStyle = style.borderLeftColor || borderColor;

      if (radius && borderWidth && borderColor) {
        // console.log('左下角圆角')
        ctx.arc(
          drawX + radius,
          drawY + box.height - radius,
          radius,
          0.5 * Math.PI,
          Math.PI,
        );
      }

      ctx.moveTo(
        drawX,
        radius ? drawY + radius : drawY,
      );

      ctx.lineTo(
        drawX,
        radius ? drawY + box.height - radius : drawY + box.height,
      );
    }

    ctx.closePath();
    ctx.stroke();
    ctx.restore();
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

  getOffscreenCanvas(key) {
    return this.root.canvasContext.getOffscreenCanvas(key);
  }

  getRoundRectMask(width, height) {
    const canvas = this.root.maskCanvas;
    const ctx = this.root.maskCtx;

    const isDarkMode = this.root.isDarkMode();
    const style = isDarkMode ?
      Object.assign({}, this.styleInit, this.styleDarkInit, this.styleProp, this._innerStyle) :
      Object.assign({}, this.styleInit, this.styleProp, this._innerStyle);
    const {
      borderRadius
    } = style;
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

  addClass(name) { // 给节点加一个class，会导致整个布局重绘
    const className = this.className.split(' ');
    if (className.indexOf(name) === -1) { // 是一个新的class
      const {
        root
      } = this; // 拿到layout
      className.push(name);
      this.className = className.join(' '); // 更新下className

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
  }

  removeClass(name) { // 去除节点的一个class，会导致整个布局重绘
    // console.log('removeClass', this);
    const className = this.className.split(' ');
    const classNameIdx = className.indexOf(name);
    if (classNameIdx > -1) {
      const {
        root
      } = this;
      // const isDarkMode = root.isDarkMode();
      // const css = isDarkMode ? root.cssDarkRules : root.cssRules;
      className.splice(classNameIdx, 1);
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
  }

  getAttribute(attr) {
    return this[attr] || null;
  }
}

import { scalableStyles, layoutAffectedStyles } from './style.js';

const Emitter = require('tiny-emitter');

// 全局事件管道
const EE = new Emitter();

let uuid = 0;
const dpr = 1;

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
    }
    : null;
}

function getRgba(hex, opacity) {
  const rgbObj = hexToRgb(hex);

  if (opacity === undefined) {
    opacity = 1;
  }

  return `rgba(${rgbObj.r}, ${rgbObj.g}, ${rgbObj.b}, ${opacity})`;
}

const toEventName = (event, id) => {
  const elementEvent = [
    'click',
    'touchstart',
    'touchmove',
    'touchend',
    'touchcancel',
  ];

  if (elementEvent.indexOf(event) !== -1) {
    return `element-${id}-${event}`;
  }

  return `element-${id}-${event}`;
};

export default class Element {
  constructor({
    style = {},
    props = {},
    idName = '',
    className = '',
    id = uuid += 1,
    dataset = {},
  }) {
    this.children = [];
    this.parent = null;
    this.parentId = 0;
    this.id = id;
    this.props = props;
    this.idName = idName;
    this.className = className;
    this.style = style;
    this.EE = EE;
    this.root = null;
    this.isDestroyed = false;
    this.layoutBox = {};
    // element 在屏幕中的物理位置和尺寸信息，维护这个是因为需要做事件处理
    this.realLayoutBox = {};

    this.dataset = dataset;

    if (
      style.opacity !== undefined
      && style.color
      && style.color.indexOf('#') > -1
    ) {
      // eslint-disable-next-line no-param-reassign
      style.color = getRgba(style.color, style.opacity);
    }

    if (
      style.opacity !== undefined
      && style.backgroundColor
      && style.backgroundColor.indexOf('#') > -1
    ) {
      // eslint-disable-next-line no-param-reassign
      style.backgroundColor = getRgba(style.backgroundColor, style.opacity);
    }

    Object.keys(style).forEach((key) => {
      if (scalableStyles.indexOf(key) > -1) {
        this.style[key] *= dpr;
      }
    });

    const innerStyle = Object.assign({}, this.style);
    Object.keys(this.style).forEach((key) => {
      Object.defineProperty(this.style, key, {
        configurable: true,
        enumerable: true,
        get: () => innerStyle[key],
        set: (value) => {
          innerStyle[key] = value;
          if (layoutAffectedStyles.indexOf(key)) {
            this.isDirty = true;
            let { parent } = this;
            while (parent) {
              parent.isDirty = true;
              parent = parent.parent;
            }
          }
        },
      });
    });

    // 事件冒泡逻辑
    ['touchstart', 'touchmove', 'touchcancel', 'touchend', 'click'].forEach((eventName) => {
      this.on(eventName, (e, touchMsg) => {
        this.parent && this.parent.emit(eventName, e, touchMsg);
      });
    });

    this.initRepaint();
  }

  initRepaint() {
    this.on('repaint', (e) => {
      this.parent && this.parent.emit('repaint', e);
    });
  }

  // 子类填充实现
  repaint() { }

  // 子类填充实现
  insert() { }

  // 子类填充实现
  destroy() {
    [
      'touchstart',
      'touchmove',
      'touchcancel',
      'touchend',
      'click',
      'repaint',
    ].forEach((eventName) => {
      this.off(eventName);
    });
    this.EE.off('image__render__done');

    this.isDestroyed = true;
    this.EE = null;
    /* this.root          = null;*/
    this.parent = null;
    this.ctx = null;
    this.realLayoutBox = null;

    // element 在画布中的位置和尺寸信息
    this.layoutBox = null;
    this.props = null;
    this.style = null;

    if (this.renderBoxes) {
      this.renderBoxes = null;
    }
  }

  add(element) {
    // eslint-disable-next-line no-param-reassign
    element.parent = this;
    // eslint-disable-next-line no-param-reassign
    element.parentId = this.id;

    this.children.push(element);
  }

  emit(event, ...theArgs) {
    EE.emit(toEventName(event, this.id), ...theArgs);
  }

  on(event, callback) {
    EE.on(toEventName(event, this.id), callback);
  }

  once(event, callback) {
    EE.once(toEventName(event, this.id), callback);
  }

  off(event, callback) {
    EE.off(toEventName(event, this.id), callback);
  }

  renderBorder(ctx, layoutBox) {
    const style = this.style || {};
    const radius = style.borderRadius || 0;
    const { borderWidth = 0 } = style;
    const borderTopLeftRadius = style.borderTopLeftRadius || radius;
    const borderTopRightRadius = style.borderTopRightRadius || radius;
    const borderBottomLeftRadius = style.borderBottomLeftRadius || radius;
    const borderBottomRightRadius = style.borderBottomRightRadius || radius;
    const box = layoutBox || this.layoutBox;
    const { borderColor } = style;
    const x = box.absoluteX;
    const y = box.absoluteY;
    const { width, height } = box;


    const hasRadius = radius
      || borderTopLeftRadius || borderTopRightRadius || borderBottomLeftRadius || borderBottomRightRadius;

    // borderWidth 和 radius 都没有，不需要执行后续逻辑，提升性能
    if (!borderWidth && !hasRadius) {
      return { needClip: false, needStroke: false };
    }

    // 左上角的点
    ctx.beginPath();

    ctx.lineWidth = borderWidth;
    ctx.strokeStyle = borderColor;

    ctx.moveTo(x + borderTopLeftRadius, y);
    ctx.lineTo(x + width - borderTopRightRadius, y);

    // 右上角的圆角
    ctx.arcTo(x + width, y, x + width, y + borderTopRightRadius, borderTopRightRadius);

    // 右下角的点
    ctx.lineTo(x + width, y + height - borderBottomRightRadius);

    // 右下角的圆角
    ctx.arcTo(
      x + width,
      y + height,
      x + width - borderBottomRightRadius,
      y + height,
      borderBottomRightRadius,
    );

    // 左下角的点
    ctx.lineTo(x + borderBottomLeftRadius, y + height);

    // 左下角的圆角
    ctx.arcTo(x, y + height, x, y + height - borderBottomLeftRadius, borderBottomLeftRadius);

    // 左上角的点
    ctx.lineTo(x, y + borderTopLeftRadius);

    // 左上角的圆角
    ctx.arcTo(x, y, x + borderTopLeftRadius, y, borderTopLeftRadius);

    return { needClip: !!hasRadius, needStroke: !!borderWidth };
  }
}

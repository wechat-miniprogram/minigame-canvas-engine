/* eslint-disable no-param-reassign */
import { repaintAffectedStyles, reflowAffectedStyles, allStyles } from './style.js';
import Rect from '../common/rect';

const Emitter = require('tiny-emitter');

// 全局事件管道
const EE = new Emitter();

let uuid = 0;

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
    // this.style = style;
    this.EE = EE;
    this.root = null;
    this.isDestroyed = false;
    this.layoutBox = {};

    this.dataset = dataset;

    if (
      style.opacity !== undefined
      && style.color
      && style.color.indexOf('#') > -1
    ) {
      style.color = getRgba(style.color, style.opacity);
    }

    if (
      style.opacity !== undefined
      && style.backgroundColor
      && style.backgroundColor.indexOf('#') > -1
    ) {
      style.backgroundColor = getRgba(style.backgroundColor, style.opacity);
    }

    this.originStyle = style;
    this.style = style;
    this.rect = null;
  }


  /**
   * 监听属性的变化判断是否需要执行 reflow、repaint 操作
   * 经过测试，Object.defineProperty 是一个比较慢的方法， 特别是属性比较多的时候
   * 因此会先判断是否支持 Proxy，iMac (Retina 5K, 27-inch, 2017)测试结果
   * 总共 312 个节点，observeStyleAndEvent总耗时为：
   * Proxy: 3ms
   * Object.defineProperty: 20ms
   */
  observeStyleAndEvent() {
    if (typeof Proxy === 'function') {
      const ele = this;
      this.style = new Proxy(this.originStyle, {
        get(target, prop, receiver) {
          return Reflect.get(target, prop, receiver);
        },
        set(target, prop, val, receiver) {
          if (reflowAffectedStyles.indexOf(prop)) {
            ele.isDirty = true;
            let { parent } = ele;
            while (parent) {
              parent.isDirty = true;
              parent = parent.parent;
            }
          } else if (repaintAffectedStyles.indexOf(prop)) {
            ele.root.emit('repaint');
          }
          return Reflect.set(target, prop, val, receiver);
        },
      });
    } else {
      const innerStyle = Object.assign({}, this.style);
      allStyles.forEach((key) => {
        Object.defineProperty(this.style, key, {
          configurable: true,
          enumerable: true,
          get: () => innerStyle[key],
          set: (value) => {
            innerStyle[key] = value;
            if (reflowAffectedStyles.indexOf(key)) {
              this.isDirty = true;
              let { parent } = this;
              while (parent) {
                parent.isDirty = true;
                parent = parent.parent;
              }
            } else if (repaintAffectedStyles.indexOf(key)) {
              this.root.emit('repaint');
            }
          },
        });
      });
    }

    // 事件冒泡逻辑
    ['touchstart', 'touchmove', 'touchcancel', 'touchend', 'click'].forEach((eventName) => {
      this.on(eventName, (e, touchMsg) => {
        this.parent && this.parent.emit(eventName, e, touchMsg);
      });
    });
  }

  // 子类填充实现
  repaint() { }

  // 子类填充实现
  render() { }

  getBoundingClientRect() {
    if (!this.rect) {
      this.rect = new Rect(
        this.layoutBox.absoluteX,
        this.layoutBox.absoluteY,
        this.layoutBox.width,
        this.layoutBox.height,
      );
    }

    this.rect.set(
      this.layoutBox.absoluteX,
      this.layoutBox.absoluteY,
      this.layoutBox.width,
      this.layoutBox.height,
    );

    return this.rect;
  }

  insert(ctx, needRender) {
    this.ctx = ctx;

    if (needRender) {
      this.render();
    }
  }

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

    this.isDestroyed = true;
    this.EE = null;
    this.parent = null;
    this.ctx = null;

    // element 在画布中的位置和尺寸信息
    this.layoutBox = null;
    this.props = null;
    this.style = null;
  }

  add(element) {
    element.parent = this;
    element.parentId = this.id;

    this.children.push(element);
  }

  appendChild(element) {
    this.add(element);

    this.isDirty = true;
    let { parent } = this;
    while (parent) {
      parent.isDirty = true;
      parent = parent.parent;
    }
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

  renderBorder(ctx) {
    const style = this.style || {};
    const radius = style.borderRadius || 0;
    const { borderWidth = 0 } = style;
    const borderTopLeftRadius = style.borderTopLeftRadius || radius;
    const borderTopRightRadius = style.borderTopRightRadius || radius;
    const borderBottomLeftRadius = style.borderBottomLeftRadius || radius;
    const borderBottomRightRadius = style.borderBottomRightRadius || radius;
    const box = this.layoutBox;
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

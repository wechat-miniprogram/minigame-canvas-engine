/* eslint-disable no-param-reassign */
import { repaintAffectedStyles, reflowAffectedStyles, allStyles, IStyle } from './style';
import Rect from '../common/rect';
import imageManager from '../common/imageManager';

export function getElementsById(tree: Element, list: Element[] = [], id: string) {
  tree.children.forEach((child: Element) => {
    if (child.idName === id) {
      list.push(child);
    }

    if (child.children.length) {
      getElementsById(child, list, id);
    }
  });

  return list;
}

export function getElementById(tree: Element, id: string) {
  const list = getElementsById(tree, [], id);

  return list?.[0] || null;
}

export function getElementsByClassName(tree: Element, list: Element[] = [], className: string) {
  tree.children.forEach((child: Element) => {
    if ((child.classNameList || child.className.split(/\s+/)).indexOf(className) > -1) {
      list.push(child);
    }

    if (child.children.length) {
      getElementsByClassName(child, list, className);
    }
  });

  return list;
}

const Emitter = require('tiny-emitter');

// 全局事件管道
const EE = new Emitter();

let uuid = 0;

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
    }
    : null;
}

function getRgba(hex: string, opacity: number) {
  const rgbObj = hexToRgb(hex);

  if (opacity === undefined) {
    opacity = 1;
  }

  if (!rgbObj) {
    return null;
  }

  return `rgba(${rgbObj.r}, ${rgbObj.g}, ${rgbObj.b}, ${opacity})`;
}

const toEventName = (event: string, id: number) => {
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

export interface ILayoutBox {
  left: number;
  top: number;
  width: number;
  height: number;
  absoluteX: number;
  absoluteY: number;
  originalAbsoluteX: number;
  originalAbsoluteY: number;
}

export interface ILayout {
  width: number;
  height: number;
  top: number;
  left: number;
  right: number;
  bottom: number;
};

type Callback = (...args: any[]) => void;

const isValidUrlPropReg = /\s*url\((.*?)\)\s*/;

export default class Element {
  public children: Element[] = [];
  public parent: Element | null = null;
  public parentId = 0;
  public id: number;
  public idName: string;
  public className: string;
  public root: Element | null;
  public EE: any;
  public isDestroyed = false;
  public dataset: Record<string, string>;
  public style: IStyle;
  public rect: Rect | null;
  public classNameList: string[] | null;
  public layoutBox: ILayoutBox;
  public backgroundImage: any;
  public ctx: CanvasRenderingContext2D | null = null
  public isDirty = false;
  public shouldUpdate = false;
  public type?: string;
  public layout?: ILayout;
  public tagName?: string;

  private originStyle: IStyle;

  constructor({
    style = {},
    idName = '',
    className = '',
    id = uuid += 1,
    dataset = {},
  }: {
    style?: IStyle;
    idName?: string;
    className?: string;
    id?: number;
    dataset?: Record<string, string>;
  }) {
    this.id = id;
    this.idName = idName;
    this.className = className;
    // this.style = style;
    this.EE = EE;
    this.root = null;
    this.layoutBox = {
      left: 0,
      top: 0,
      width: 0,
      height: 0,
      absoluteX: 0,
      absoluteY: 0,
      originalAbsoluteX: 0,
      originalAbsoluteY: 0,
    };

    this.dataset = dataset;

    if (
      style.opacity !== undefined
      && style.color
      && style.color.indexOf('#') > -1
    ) {
      // 颜色解析失败，降级为 hex
      style.color = getRgba(style.color, style.opacity) || style.color;
    }

    if (
      style.opacity !== undefined
      && style.backgroundColor
      && style.backgroundColor.indexOf('#') > -1
    ) {
      // 颜色解析失败，降级为 hex
      style.backgroundColor = getRgba(style.backgroundColor, style.opacity) || style.backgroundColor;
    }

    if (typeof style.backgroundImage === 'string') {
      this.backgroundImageSetHandler(style.backgroundImage);
    }

    this.originStyle = style;
    this.style = style;
    this.rect = null;
    this.classNameList = null;
  }

  backgroundImageSetHandler(backgroundImage: string) {
    if (typeof backgroundImage === 'string') {
      const list = backgroundImage.match(isValidUrlPropReg);
      if (list) {
        const url = list[1].replace(/('|")/g, '');
        imageManager.loadImage(url, (img: HTMLImageElement) => {
          if (!this.isDestroyed) {
            this.backgroundImage = img;
            // 当图片加载完成，实例可能已经被销毁了
            this.root && this.root.emit('repaint');
          }
        });
      } else {
        console.error(`[Layout]: ${backgroundImage} is not a valid backgroundImage`);
      }
    }
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
          if (typeof prop === 'string') {
            if (reflowAffectedStyles.indexOf(prop) > -1) {
              ele.isDirty = true;
              let { parent } = ele;
              while (parent) {
                parent.isDirty = true;
                parent = parent.parent;
              }
            } else if (repaintAffectedStyles.indexOf(prop) > -1) {
              ele.root?.emit('repaint');
            } else if (prop === 'backgroundImage') {
              ele.backgroundImageSetHandler(val);
            }
          }

          return Reflect.set(target, prop, val, receiver);
        },
      });
    } else {
      const innerStyle = Object.assign({}, this.style) as IStyle;
      allStyles.forEach((key) => {
        Object.defineProperty(this.style, key, {
          configurable: true,
          enumerable: true,
          get: () => innerStyle[key as keyof IStyle],
          set: (value) => {
            innerStyle[key as keyof IStyle] = value;
            if (reflowAffectedStyles.indexOf(key) > -1) {
              this.isDirty = true;
              let { parent } = this;
              while (parent) {
                parent.isDirty = true;
                parent = parent.parent;
              }
            } else if (repaintAffectedStyles.indexOf(key) > -1) {
              this.root?.emit('repaint');
            } else if (key === 'backgroundImage') {
              this.backgroundImageSetHandler(value);
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

    this.classNameList = this.className.split(/\s+/);
  }

  // 子类填充实现
  repaint() { }

  // 子类填充实现
  render() { }

  /**
   * 参照 Web 规范：https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect
   */
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

  getElementById(id: string): Element | null {
    return getElementById(this, id);
  }

  getElementsById(id: string): (Element | null)[] {
    return getElementsById(this, [], id);
  }

  getElementsByClassName(className: string): (Element | null)[] {
    return getElementsByClassName(this, [], className);
  }

  insert(ctx: CanvasRenderingContext2D, needRender: boolean) {
    this.ctx = ctx;

    if (needRender) {
      this.render();
    }
  }

  unBindEvent() {
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
  }

  setDirty() {
    this.isDirty = true;
    let { parent } = this;
    while (parent) {
      parent.isDirty = true;
      parent = parent.parent;
    }
  }

  remove() {
    const { parent } = this;

    if (!parent) {
      return;
    }

    const index = parent.children.indexOf(this);

    if (index !== -1) {
      parent.children.splice(index, 1);
      this.unBindEvent();
      this.setDirty();
      this.parent = null;
      this.ctx = null;
    } else {
      console.warn('[Layout] this element has been removed');
    }
  }

  // 子类填充实现
  destroy() {
    this.unBindEvent();

    this.isDestroyed = true;
    this.EE = null;
    this.parent = null;
    this.ctx = null;

    // element 在画布中的位置和尺寸信息
    // this.layoutBox = null;
    // this.style = null;
    this.className = '';
    this.classNameList = null;
  }

  add(element: Element) {
    element.parent = this;
    element.parentId = this.id;

    this.children.push(element);
  }

  appendChild(element: Element) {
    this.add(element);

    this.setDirty();
  }

  removeChild(element: Element) {
    const index = this.children.indexOf(element);
    if (index !== -1) {
      element.remove();
      this.setDirty();
    } else {
      console.warn('[Layout] the element to be removed is not a child of this element');
    }
  }

  emit(event: string, ...theArgs: any[]) {
    EE.emit(toEventName(event, this.id), ...theArgs);
  }

  on(event: string, callback: Callback) {
    EE.on(toEventName(event, this.id), callback);
  }

  once(event: string, callback: Callback) {
    EE.once(toEventName(event, this.id), callback);
  }

  off(event: string, callback?: Callback) {
    EE.off(toEventName(event, this.id), callback);
  }

  renderBorder(ctx: CanvasRenderingContext2D) {
    const style = this.style || {};
    const radius = style.borderRadius || 0;
    const { borderWidth = 0 } = style;
    const borderTopLeftRadius = style.borderTopLeftRadius || radius;
    const borderTopRightRadius = style.borderTopRightRadius || radius;
    const borderBottomLeftRadius = style.borderBottomLeftRadius || radius;
    const borderBottomRightRadius = style.borderBottomRightRadius || radius;
    const box = this.layoutBox;
    const { borderColor = '' } = style;
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

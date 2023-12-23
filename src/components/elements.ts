/* eslint-disable no-param-reassign */
import { repaintAffectedStyles, reflowAffectedStyles, allStyles, IStyle } from './style';
import Rect from '../common/rect';
import imageManager from '../common/imageManager';
import TinyEmitter from 'tiny-emitter';
import { IDataset } from '../types/index'
import { IElementOptions } from './types';
import { Callback } from '../types/index';
import { backgroundImageParser, rotateParser } from './styleParser';

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

/**
 * 将当前节点置脏，Layout 的 ticker 会根据这个标记位执行 reflow
 */
function setDirty(ele: Element) {
  ele.isDirty = true;
  let { parent } = ele;
  while (parent) {
    parent.isDirty = true;
    parent = parent.parent;
  }
}

// 全局事件管道
const EE = new TinyEmitter();

let uuid = 0;


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

export interface IRenderForLayout {
  rotate?: number; // transform rotate解析之后得到的弧度制
}

export interface ILayout {
  width: number;
  height: number;
  top: number;
  left: number;
  right: number;
  bottom: number;
};

export default class Element {
  /**
   * 子节点列表
   */
  public children: Element[] = [];
  /**
   * 当前节点的父节点
   */
  public parent: Element | null = null;

  // 似乎没什么用，先注释
  // public parentId = 0;
  /**
   * 当前节点的id，一般是由 Layout 统一分配的自增 id
   */
  public id: number;

  /**
   * 在 xml 模板里面声明的 id 属性，一般用于节点查询
   */
  public idName: string;

  /**
   * 在 xml 模板里面声明的 class 属性，一般用于模板插件
   */
  public className: string;

  /**
   * 当前节点所在节点树的根节点，指向 Layout
   */
  public root: Element | null = null;
  // public EE: any;

  /**
   * 用于标识当前节点是否已经执行销毁逻辑，销毁之后原先的功能都会异常，一般业务侧不用关心这个
   */
  public isDestroyed = false;

  /**
   * 类似 Web 端实现，给节点挂一些能够读写的属性集合
   * 在 xml 可以这样声明属性：<view class="xxx" data-foo="bar">
   * 在 js 侧可以这么读写属性：
   * console.log(element.dataset.foo); // 控制台输出 "bar";
   * element.dataset.foo = "bar2";
   */
  public dataset: IDataset;

  /**
   * 节点的样式列表，在 Layout.init 会传入样式集合，会自动挑选出跟节点有关的样式统一 merge 到 style 对象上
   */
  public style: IStyle;

  /**
   * 执行 getBoundingClientRect 的结果缓存，如果业务高频调用，可以减少 GC
   */
  private rect: Rect | null;
  public classNameList: string[] | null;
  public layoutBox: ILayoutBox;
  public backgroundImage: any;
  public ctx: CanvasRenderingContext2D | null = null

  /**
   * 置脏标记位，目前当修改会影响布局属性的时候，会自动置脏
   */
  public isDirty = false;

  /**
   * css-layout 节点属性，业务侧无需关心
   */
  protected shouldUpdate = false;

  /**
   * 当前节点的名称，比如" Image
   */
  public type?: string;
  // public layout?: ILayout;

  /**
   * 当前节点在 xml 的标签名称，比如 image、view
   */
  public tagName?: string;

  private originStyle: IStyle;

  protected renderForLayout: IRenderForLayout = {};

  protected styleChangeHandler(prop: string, val: any) {

  }

  constructor({
    style = {},
    idName = '',
    className = '',
    id = uuid += 1,
    dataset = {},
  }: IElementOptions) {
    this.id = id;
    this.idName = idName;
    this.className = className;
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

    if (typeof style.backgroundImage === 'string') {
      this.backgroundImageSetHandler(style.backgroundImage);
    }

    if (typeof style.transform === 'string') {
      if (style.transform.indexOf('rotate') > -1) {
        const deg = rotateParser(style.transform);
        if (deg) {
          this.renderForLayout.rotate = deg;
        }
      }
    }

    this.originStyle = style;
    this.style = style;
    this.rect = null;
    this.classNameList = null;
  }

  backgroundImageSetHandler(backgroundImage: string) {
    const url = backgroundImageParser(backgroundImage);

    if (url) {
      imageManager.loadImage(url, (img: HTMLImageElement) => {
        if (!this.isDestroyed) {
          this.backgroundImage = img;
          // 当图片加载完成，实例可能已经被销毁了
          this.root && this.root.emit('repaint');
        }
      });
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
            ele.styleChangeHandler(prop, val);

            if (prop === 'transform') {
              if (val.indexOf('rotate') > -1) {
                const deg = rotateParser(val);
                if (deg) {
                  ele.renderForLayout.rotate = deg;

                  ele.root?.emit('repaint');
                }
              }
            }

            if (reflowAffectedStyles.indexOf(prop) > -1) {
              setDirty(ele);
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
            if (value !== innerStyle[key as keyof IStyle]) {
              innerStyle[key as keyof IStyle] = value;

              if (reflowAffectedStyles.indexOf(key) > -1) {
                setDirty(this);
              } else if (repaintAffectedStyles.indexOf(key) > -1) {
                this.root?.emit('repaint');
              } else if (key === 'backgroundImage') {
                this.backgroundImageSetHandler(value);
              }
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

  /**
   * 节点重绘接口，子类填充实现
   */
  repaint() { }

  /**
   * 节点渲染接口子类填充实现
   */
  render() { }

  /**
   * 参照 Web 规范：https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect
   */
  getBoundingClientRect(): Rect {
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

  /**
   * 查询当前节点树下，idName 为给定参数的的节点
   * 节点的 id 唯一性 Layout 并不保证，但这里只返回符合条件的第一个节点 
   */
  getElementById(id: string): Element | null {
    return getElementById(this, id);
  }

  /**
   * 查询当前节点树下，idName 为给定参数的的节点
   * 节点的 id 唯一性 Layout 并不保证，这里返回符合条件的节点集合
   */
  getElementsById(id: string): (Element | null)[] {
    return getElementsById(this, [], id);
  }

  /**
   * 查询当前节点树下，className 包含给定参数的的节点集合
   */
  getElementsByClassName(className: string): (Element | null)[] {
    return getElementsByClassName(this, [], className);
  }

  /**
   * 布局计算完成，准备执行渲染之前执行的操作，不同的子类有不同的行为
   * 比如 ScrollView 在渲染之前还需要初始化滚动相关的能力
   *  
   */
  insert(ctx: CanvasRenderingContext2D, needRender: boolean) {
    this.shouldUpdate = false;
    this.ctx = ctx;

    if (needRender) {
      this.render();
    }
  }

  /**
   * 节点解除事件绑定
   */
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

  /**
   * 将节点从当前节点树中删除
   */
  remove() {
    const { parent } = this;

    if (!parent) {
      return;
    }

    const index = parent.children.indexOf(this);
    if (index !== -1) {
      parent.children.splice(index, 1);
      this.unBindEvent();
      setDirty(this);
      this.parent = null;
      this.ctx = null;
    } else {
      console.warn('[Layout] this element has been removed');
    }
  }

  setDirty() {
    setDirty(this);
  }

  // 子类填充实现
  destroySelf() {

  }

  // 子类填充实现
  destroy() {
    this.unBindEvent();

    this.isDestroyed = true;
    // this.EE = null;
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
    // element.parentId = this.id;

    this.children.push(element);
  }

  /**
   * 将一个节点添加作为当前节点的子节点
   */
  appendChild(element: Element) {
    this.add(element);

    setDirty(this);
  }

  /**
   * 移除给定的子节点，只有一级节点能够移除 
   */
  removeChild(element: Element) {
    const index = this.children.indexOf(element);
    if (index !== -1) {
      element.remove();
      setDirty(this);
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

  /**
   * 渲染 border 相关能力抽象，子类可按需调用
   * 由于支持了rotate特性，所以所有的渲染都需要方向减去transform的中间点
   */
  renderBorder(ctx: CanvasRenderingContext2D, originX: number = 0, originY: number = 0) {
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

    ctx.moveTo(x + borderTopLeftRadius - originX, y - originY);
    ctx.lineTo(x + width - borderTopRightRadius - originX, y - originY);

    // 右上角的圆角
    ctx.arcTo(x + width - originX, y - originY, x + width - originX, y + borderTopRightRadius - originY, borderTopRightRadius);

    // 右下角的点
    ctx.lineTo(x + width - originX, y + height - borderBottomRightRadius - originY);

    // 右下角的圆角
    ctx.arcTo(
      x + width - originX,
      y + height - originY,
      x + width - borderBottomRightRadius - originX,
      y + height - originY,
      borderBottomRightRadius,
    );

    // 左下角的点
    ctx.lineTo(x + borderBottomLeftRadius - originX, y + height - originY);

    // 左下角的圆角
    ctx.arcTo(x - originX, y + height - originY, x - originX, y + height - borderBottomLeftRadius - originY, borderBottomLeftRadius);

    // 左上角的点
    ctx.lineTo(x - originX, y + borderTopLeftRadius - originY);

    // 左上角的圆角
    ctx.arcTo(x - originX, y - originY, x + borderTopLeftRadius - originX, y - originY, borderTopLeftRadius);

    ctx.closePath();

    return { needClip: !!hasRadius, needStroke: !!borderWidth };
  }

  /**
   * 每个子类都会有自己的渲染逻辑，但他们都有些通用的处理，比如透明度、旋转和border的处理，baseRender 用于处理通用的渲染逻辑
   */
  baseRender() {
    const ctx = this.ctx as CanvasRenderingContext2D;

    const style = this.style;
    const box = this.layoutBox;

    const { absoluteX: drawX, absoluteY: drawY, width, height } = box;

    if (style.opacity !== 1) {
      ctx.globalAlpha = style.opacity as number;
    }

    let originX = 0;
    let originY = 0;

    /**
     * 请注意，这里暂时仅支持没有子节点的元素发生旋转，如果父节点旋转了子节点并不会跟着旋转
     * 要实现父节点带动子节点旋转的能力，需要引入矩阵库，对代码改动也比较大，暂时不做改造。
     */
    if (this.renderForLayout.rotate) {
      originX = drawX + box.width / 2;
      originY = drawY + box.height / 2;

      ctx.translate(originX, originY);
      ctx.rotate(this.renderForLayout.rotate);
    }

    if (style.borderColor) {
      ctx.strokeStyle = style.borderColor;
    }

    ctx.lineWidth = style.borderWidth || 0;

    const { needClip, needStroke } = this.renderBorder(ctx, originX, originY);

    // if (needClip) {
    //   ctx.clip();
    // }

    if (needClip) {
      // 保存当前的 globalCompositeOperation
      const originalGCO = ctx.globalCompositeOperation;
      // 设置 globalCompositeOperation 为 "source-atop"，这样图片只会绘制在已有图形的上方
      ctx.globalCompositeOperation = 'source-atop';

      if (style.backgroundColor) {
        ctx.fillStyle = style.backgroundColor;
        // ctx.fillRect(drawX - originX, drawY - originY, box.width, box.height);
        ctx.fill();
      }

      if (style.backgroundImage && this.backgroundImage) {
        ctx.drawImage(this.backgroundImage, drawX - originX, drawY - originY, box.width, box.height);
      }

      ctx.globalCompositeOperation = originalGCO;
    } else {
      if (style.backgroundColor) {
        ctx.fillStyle = style.backgroundColor;
        ctx.fillRect(drawX - originX, drawY - originY, box.width, box.height);
      }

      if (style.backgroundImage && this.backgroundImage) {
        ctx.drawImage(this.backgroundImage, drawX - originX, drawY - originY, box.width, box.height);
      }
    }

    return { needStroke, originX, originY, drawX, drawY, width, height };
  }
}

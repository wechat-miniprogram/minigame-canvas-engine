/* eslint-disable no-param-reassign */
import { repaintAffectedStyles, reflowAffectedStyles, renderAffectStyles, IStyle } from './style';
import Rect from '../common/rect';
import imageManager from '../common/imageManager';
import TinyEmitter from 'tiny-emitter';
import { IDataset, Callback } from '../types/index'
import { IElementOptions } from './types';
import { backgroundImageParser, parseTransform, IRenderForLayout } from './styleParser';

export function getElementsById<T>(tree: Element, list: (Element | T)[] = [], id: string): T[] {
  tree.children.forEach((child: Element) => {
    if (child.idName === id) {
      list.push(child);
    }

    if (child.children.length) {
      getElementsById(child, list, id);
    }
  });

  return list as T[];
}

export function getElementById<T>(tree: Element, id: string): T {
  const list = getElementsById(tree, [], id);

  return list?.[0] || null;
}

export function getElementsByClassName<T>(tree: Element, list: (Element | T)[] = [], className: string): T[] {
  tree.children.forEach((child: Element) => {
    if ((child.classNameList || child.className.split(/\s+/)).indexOf(className) > -1) {
      list.push(child);
    }

    if (child.children.length) {
      getElementsByClassName(child, list, className);
    }
  });

  return list as T[];
}

/**
 * 将当前节点置脏，Layout 的 ticker 会根据这个标记位执行 reflow
 */
export function setDirty(ele: Element, reason?: string) {
  // for debug
  // console.log('[Layout] trigger reflow cause', ele, reason);
  ele.isDirty = true;
  let { parent } = ele;
  while (parent) {
    parent.isDirty = true;
    parent = parent.parent;
  }
}

// 全局事件管道
const EE = new TinyEmitter.TinyEmitter();

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

export interface ILayout {
  width: number;
  height: number;
  top: number;
  left: number;
  right: number;
  bottom: number;
};

export enum StyleOpType {
  Set,
  Delete,
}

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

  /**
   * 有些 style 属性并不能直接用来渲染，需要经过解析之后才能进行渲染，这些值不会存储在 style 上
   * 比如 style.transform，如果每次都解析性能太差了
   */
  protected renderForLayout: IRenderForLayout = {};

  protected styleChangeHandler(prop: string, styleOpType: StyleOpType, val?: any) {

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
    
    renderAffectStyles.forEach((prop: string) => {
      let val = style[prop as keyof IStyle];
      if (typeof val !== 'undefined') {
        this.calculateRenderForLayout(true, prop, StyleOpType.Set, val);
      }
    });

    this.originStyle = style;
    this.style = style;
    this.rect = null;
    this.classNameList = null;
  }

  private calculateRenderForLayout(init: boolean, prop: string, styleOpType: StyleOpType, val?: any) {
    if (!init) {
      this.styleChangeHandler(prop, styleOpType, val);
    }
  
    if (styleOpType === StyleOpType.Set) {
      switch (prop) {
        case 'backgroundImage':
          const url = backgroundImageParser(val);

          if (url) {
            imageManager.loadImage(url, (img: HTMLImageElement) => {
              if (!this.isDestroyed) {
                this.renderForLayout.backgroundImage = img;
                // 当图片加载完成，实例可能已经被销毁了
                this.root?.emit('repaint');
              }
            });
          }
          break;
        
        case 'transform':
          delete this.renderForLayout.scaleX;
          delete this.renderForLayout.scaleY;
          delete this.renderForLayout.rotate;
          Object.assign(this.renderForLayout, parseTransform(val));
          break; 
      }
    } else {
      switch (prop) {
        case 'backgroundImage':
          this.renderForLayout.backgroundImage = undefined;
          break;
        
        case 'transform':
          delete this.renderForLayout.scaleX;
          delete this.renderForLayout.scaleY;
          delete this.renderForLayout.rotate;
          break;
      }
    }

    // 初始化的逻辑不需要做这些判断
    if (!init) {
      if (reflowAffectedStyles.indexOf(prop) > -1) {
        // setDirty(this, `change prop ${prop} from ${oldVal} to ${val}`);
        setDirty(this);
      } else if (repaintAffectedStyles.indexOf(prop) > -1) {
        this.root?.emit('repaint');
      }  
    }
  }

  observeStyleAndEvent() {
    if (typeof Proxy === 'function') {
      const ele = this;
      
      this.style = new Proxy(this.originStyle, {
        get(target, prop, receiver) {
          return Reflect.get(target, prop, receiver);
        },
        set(target, prop, val, receiver) {
          let oldVal = Reflect.get(target, prop, receiver);
          if (typeof prop === 'string' && oldVal !== val) {
            ele.calculateRenderForLayout(false, prop, StyleOpType.Set, val);
          }

          return Reflect.set(target, prop, val, receiver);
        },
        deleteProperty(target, prop: string) {
          ele.calculateRenderForLayout(false, prop as string, StyleOpType.Delete);

          return Reflect.deleteProperty(target, prop); 
        },
      });
    }

    // 事件冒泡逻辑
    ['touchstart', 'touchmove', 'touchcancel', 'touchend', 'click'].forEach((eventName) => {
      this.on(eventName, (e, touchMsg) => {
        // 处理伪类逻辑
        if (eventName === 'touchstart') {
          this.activeHandler(e);
          if (this !== this.root) {
            // @ts-ignore
            this.root.activeElements.push(this);
          }
        } else if (eventName === 'touchend' || eventName === 'touchcancel') {
          this.deactiveHandler(e);

          // @ts-ignore
          let index = this.root.activeElements.indexOf(this);
          if (index > -1) {
            // @ts-ignore
            this.root.activeElements.splice(index, 1);
          }
        }
        this.parent && this.parent.emit(eventName, e, touchMsg);
      });
    });

    this.classNameList = this.className.split(/\s+/);
  }

  protected cacheStyle!: IStyle;

  activeHandler(e?: any) {
    const activeStyle = this.style[':active'];

    if (activeStyle) {
      // 将当前的style缓存起来，在 active 取消的时候重置回去
      this.cacheStyle = Object.assign({}, this.style);
      
      Object.assign(this.style, activeStyle);
    }
  }
  
  deactiveHandler(e?: any) {
    const activeStyle = this.style[':active'];

    if (activeStyle) {
      Object.keys(activeStyle).forEach((key) => {
        if (!this.cacheStyle) {
          return;
        }
        if (this.cacheStyle[key as keyof IStyle]) {
          // @ts-ignore
          this.style[key] = this.cacheStyle[key as keyof IStyle]
        } else {
          delete this.style[key as keyof IStyle];
        }
      });
    }
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
   * 节点构造函数初始化后调用的方法，子类填充实现
   */
  afterCreate() {}

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
  getElementById<T = Element>(id: string): T | null {
    return getElementById<T>(this, id);
  }

  /**
   * 查询当前节点树下，idName 为给定参数的的节点
   * 节点的 id 唯一性 Layout 并不保证，这里返回符合条件的节点集合
   */
  getElementsById<T = Element>(id: string): (T | null)[] {
    return getElementsById<T>(this, [], id);
  }

  /**
   * 查询当前节点树下，className 包含给定参数的的节点集合
   */
  getElementsByClassName<T = Element>(className: string): (T | null)[] {
    return getElementsByClassName<T>(this, [], className);
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
      setDirty(this, `remove`);
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

    this.children.push(element);
  }

  /**
   * 将一个节点添加作为当前节点的子节点
   */
  appendChild(element: Element) {
    this.add(element);

    setDirty(this, `appendChild ${element}`);
  }

  /**
   * 移除给定的子节点，只有一级节点能够移除
   */
  removeChild(element: Element) {
    const index = this.children.indexOf(element);
    if (index !== -1) {
      element.remove();
      setDirty(this, `removeChild ${element}`);
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
    const tlr = style.borderTopLeftRadius || radius;
    const trr = style.borderTopRightRadius || radius;
    const bbr = style.borderBottomLeftRadius || radius;
    const brr = style.borderBottomRightRadius || radius;
    const box = this.layoutBox;
    const { borderColor = '' } = style;
    const x = box.absoluteX;
    const y = box.absoluteY;
    const { width, height } = box;

    const hasRadius = radius || tlr || trr || bbr || brr;

    // borderWidth 和 radius 都没有，不需要执行后续逻辑，提升性能
    if (!borderWidth && !hasRadius) {
      return { needClip: false, needStroke: false };
    }

    ctx.lineWidth = borderWidth;
    ctx.strokeStyle = borderColor;

    // 左上角的点
    ctx.beginPath();
    ctx.moveTo(x + tlr - originX, y - originY);
    ctx.lineTo(x + width - trr - originX, y - originY);
    // 右上角的圆角
    ctx.arcTo(x + width - originX, y - originY, x + width - originX, y + trr - originY, trr);
    // 右下角的点
    ctx.lineTo(x + width - originX, y + height - brr - originY);
    // 右下角的圆角
    ctx.arcTo(x + width - originX, y + height - originY, x + width - brr - originX, y + height - originY, brr);
    // 左下角的点
    ctx.lineTo(x + bbr - originX, y + height - originY);
    // 左下角的圆角
    ctx.arcTo(x - originX, y + height - originY, x - originX, y + height - bbr - originY, bbr);
    // 左上角的点
    ctx.lineTo(x - originX, y + tlr - originY);
    // 左上角的圆角
    ctx.arcTo(x - originX, y - originY, x + tlr - originX, y - originY, tlr);
    ctx.closePath();

    return { needClip: !!hasRadius, needStroke: !!borderWidth };
  }

  /**
   * 每个子类都会有自己的渲染逻辑，但他们都有些通用的处理，比如透明度、旋转和border的处理，baseRender 用于处理通用的渲染逻辑
   */
  baseRender(type?: string) {
    const ctx = this.ctx as CanvasRenderingContext2D;

    const style = this.style;
    const box = this.layoutBox;

    const { absoluteX: drawX, absoluteY: drawY, width, height } = box;

    if (style.opacity !== undefined) {
      ctx.globalAlpha = style.opacity as number;
    }

    let originX = 0;
    let originY = 0;
    if (this.renderForLayout.rotate !== undefined || this.renderForLayout.scaleX !== undefined || this.renderForLayout.scaleY !== undefined) {
      originX = drawX + box.width / 2;
      originY = drawY + box.height / 2;

      ctx.translate(originX, originY);
    }
    /**
     * 请注意，这里暂时仅支持没有子节点的元素发生旋转，如果父节点旋转了子节点并不会跟着旋转
     * 要实现父节点带动子节点旋转的能力，需要引入矩阵库，对代码改动也比较大，暂时不做改造。
     */
    if (this.renderForLayout.rotate !== undefined) {
      ctx.rotate(this.renderForLayout.rotate);
    }

    if (this.renderForLayout.scaleX !== undefined || this.renderForLayout.scaleY !== undefined) {
      ctx.scale(this.renderForLayout.scaleX !== undefined ? this.renderForLayout.scaleX : 1 , this.renderForLayout.scaleY !== undefined ? this.renderForLayout.scaleY : 1);
    }

    if (style.borderColor) {
      ctx.strokeStyle = style.borderColor;
    }

    ctx.lineWidth = style.borderWidth || 0;

    // for clip
    const { needClip, needStroke } = this.renderBorder(ctx, originX, originY);

    if (needClip) {
      ctx.clip();
    }

    if (style.backgroundColor) {
      ctx.fillStyle = style.backgroundColor;
      ctx.fillRect(drawX - originX, drawY - originY, box.width, box.height);
    }

    if (this.renderForLayout.backgroundImage) {
      ctx.drawImage(this.renderForLayout.backgroundImage, drawX - originX, drawY - originY, box.width, box.height);
    }

    return { needStroke, needClip, originX, originY, drawX, drawY, width, height };
  }
}

import env from './env';
import Element from './components/elements';
import Pool from './common/pool';
import TinyEmitter from 'tiny-emitter';
import computeLayout from 'css-layout';
import { isClick, STATE, clearCanvas, isGameTouchEvent } from './common/util';
import parser from './libs/fast-xml-parser/parser.js';
import BitMapFont from './common/bitMapFont';
import DebugInfo from './common/debugInfo';
import Ticker from './common/ticker';
import { create, renderChildren, layoutChildren, repaintChildren, iterateTree, clone, registerComponent } from './common/vd';
import Rect from './common/rect';
import imageManager from './common/imageManager';
import { View, Text, Image, ScrollView, BitMapText, Canvas, Button } from './components';
import { IStyle } from './components/style';
import { GameTouch, GameTouchEvent, Callback, TreeNode } from './types/index';

// 全局事件管道
const EE = new TinyEmitter.TinyEmitter();
const imgPool = new Pool('imgPool');
const bitMapPool = new Pool('bitMapPool');
const debugInfo = new DebugInfo();

interface IViewPort {
  width: number;
  height: number;
}

interface IViewPortBox {
  width: number;
  height: number;
  x: number;
  y: number;
}

interface EventHandlerData {
  hasEventBind: boolean;
  touchMsg: {
    [key: string]: MouseEvent | GameTouch;
  };
  handlers: {
    touchStart: (e: MouseEvent | GameTouchEvent) => void;
    touchMove: (e: MouseEvent | GameTouchEvent) => void;
    touchEnd: (e: MouseEvent | GameTouchEvent) => void;
    touchCancel: (e: MouseEvent | GameTouchEvent) => void;
  };
}

interface IPlugin<T> {
  name: string;
  install: (app: T, ...options: any[]) => void;
  uninstall?: (app: T, ...options: any[]) => void;
}

/**
 * 默认暴露 Layout 的实例，但在某些场景下，可能需要多个 Layout 实例，因此 Layout 类也暴露出去
 * const myLayout = new Layout({
 *   style: {
 *      width: 0,
 *      height: 0,
 *   },
 *  name: 'myLayoutName',
 * });
 */
class Layout extends Element {
  /**
   * 当前 Layout 版本，一般跟小游戏插件版本对齐
   */
  public version = '1.0.15';

  env = env;

  /**
   * Layout 渲染的目标画布对应的 2d context
   */
  public renderContext: CanvasRenderingContext2D | null = null;
  public renderport: IViewPort = {
    width: 0,
    height: 0,
  };
  public viewport: IViewPortBox = {
    width: 0,
    height: 0,
    x: 0,
    y: 0,
  };

  /**
   * 画布尺寸和实际被渲染到屏幕的物理尺寸比
   */
  public viewportScale = 1;
  /**
   * 用于标识updateViewPort方法是否被调用过了，这在小游戏环境非常重要
   */
  public hasViewPortSet = false;

  /**
   * 最终渲染到屏幕的左上角物理坐标
   */
  public realLayoutBox: {
    realX: number;
    realY: number;
  } = {
      realX: 0,
      realY: 0,
    };

  public bitMapFonts: BitMapFont[] = [];
  public eleCount = 0;
  public state: STATE = STATE.UNINIT;

  /**
   * 用于在 ticker 的循环里面标识当前帧是否需要重绘
   * 重绘一般是图片加载完成、文字修改等场景
   */
  public isNeedRepaint = false;
  public ticker: Ticker = new Ticker();
  public tickerFunc = () => {
    if (this.isDirty) {
      // console.log('before_reflow')
      this.emit('before_reflow', '');
      this.reflow();
    } else if (this.isNeedRepaint) {
      this.repaint();
    }
  };

  public styleSheet: Record<string, IStyle> = {}

  private eventHandlerData: EventHandlerData;

  protected activeElements: Element[] = [];

  constructor({
    style,
  }: {
    style?: IStyle;
    name?: string;
  }) {
    super({
      style,
      id: 0,
    });

    this.eventHandlerData = {
      hasEventBind: false,
      touchMsg: {},
      handlers: {
        touchStart: this.eventHandler('touchstart').bind(this),
        touchMove: this.eventHandler('touchmove').bind(this),
        touchEnd: this.eventHandler('touchend').bind(this),
        touchCancel: this.eventHandler('touchcancel').bind(this),
      },
    };

    /**
     * 对于不会影响布局的改动，比如图片只是改个地址、加个背景色之类的改动，会触发 Layout 的 repaint 操作
     * 触发的方式是给 Layout 抛个 `repaint` 的事件，为了性能，每次接收到 repaint 请求不会执行真正的渲染
     * 而是执行一个置脏操作，ticker 每一次执行 update 会检查这个标记位，进而执行真正的重绘操作
     */
    this.on('repaint', () => {
      this.isNeedRepaint = true;
    });

    /**
     * 将 Tween 挂载到 Layout，对于 Tween 的使用完全遵循 Tween.js 的文档
     * https://github.com/tweenjs/tween.js/
     * 只不过当 Tween 改动了节点会触发 repaint、reflow 的属性时，Layout 会执行相应的操作
     * 业务侧不用感知到 repaint 和 reflow
     */
    // this.TWEEN = TWEEN;
    console.log(`[Layout] v${this.version}`);
  }

  // 与老版本兼容
  get debugInfo() {
    let info = debugInfo.log();

    info += `elementCount: ${this.eleCount}\n`;

    return info;
  }

  /**
   * 更新被绘制canvas的窗口信息，本渲染引擎并不关心是否会和其他游戏引擎共同使用
   * 而本身又需要支持事件处理，因此，如果被渲染内容是绘制到离屏canvas，需要将最终绘制在屏幕上
   * 的绝对尺寸和位置信息更新到本渲染引擎。
   * 其中，width为物理像素宽度，height为物理像素高度，x为距离屏幕左上角的物理像素x坐标，y为距离屏幕左上角的物理像素
   * y坐标
   */
  updateViewPort(box: IViewPortBox) {
    this.viewport.width = box.width || 0;
    this.viewport.height = box.height || 0;
    this.viewport.x = box.x || 0;
    this.viewport.y = box.y || 0;

    this.realLayoutBox = {
      realX: this.viewport.x,
      realY: this.viewport.y,
    };

    this.hasViewPortSet = true;
  }

  init(template: string, style: Record<string, IStyle>, attrValueProcessor?: Callback) {
    debugInfo.start('init');

    const elementArray = this.insertElementArray(template, style, attrValueProcessor, true);

    this.add(elementArray[0]);

    this.state = STATE.INITED;

    this.ticker.add(this.tickerFunc, true);
    this.ticker.start();

    debugInfo.end('init');
  }

  reflow(isFirst = false) {
    if (!isFirst) {
      debugInfo.reset();
    }

    debugInfo.start('layout_reflow');
    /**
     * 计算布局树
     * 经过 Layout 计算，节点树带上了 layout、lastLayout、shouldUpdate 布局信息
     * Layout本身并不作为布局计算，只是作为节点树的容器
     */
    debugInfo.start('computeLayout', true);
    computeLayout(this.children[0]);
    debugInfo.end('computeLayout');

    const rootEle = this.children[0];

    if (rootEle.style.width === undefined || rootEle.style.height === undefined) {
      console.error('[Layout] Please set width and height property for root element');
    } else {
      this.renderport.width = rootEle.style.width;
      this.renderport.height = rootEle.style.height;
    }

    // 将布局树的布局信息加工赋值到渲染树
    debugInfo.start('layoutChildren', true);
    layoutChildren(this);
    debugInfo.end('layoutChildren');

    this.viewportScale = this.viewport.width / this.renderport.width;

    clearCanvas(this.renderContext as CanvasRenderingContext2D);

    // 遍历节点树，依次调用节点的渲染接口实现渲染
    debugInfo.start('renderChildren', true);
    renderChildren(this.children, this.renderContext as CanvasRenderingContext2D, false);
    debugInfo.end('renderChildren');

    debugInfo.start('repaint', true);
    this.repaint();
    debugInfo.end('repaint');
    this.isDirty = false;

    // iterateTree(this.children[0], (ele) => {
    //   console.log(ele.props);
    // });

    debugInfo.end('layout_reflow');
  }

  /**
   * init阶段核心仅仅是根据xml和css创建了节点树
   * 要实现真正的渲染，需要调用 layout 函数，之所以将 layout 单独抽象为一个函数，是因为 layout 应当是可以重复调用的
   * 比如改变了一个元素的尺寸，实际上节点树是没变的，仅仅是需要重新计算布局，然后渲染
   * 一个完整的 layout 分成下面的几步：
   * 1. 执行画布清理，因为布局变化页面需要重绘，这里没有做很高级的剔除等操作，一律清除重画，实际上性能已经很好
   * 2. 节点树都含有 style 属性，css-layout 能够根据这些信息计算出最终布局，详情可见 https://www.npmjs.com/package/css-layout
   * 3. 经过 Layout 计算，节点树带上了 layout、lastLayout、shouldUpdate 布局信息，但这些信息并不是能够直接用的
   *    比如 layout.top 是指在一个父容器内的 top，最终要实现渲染，实际上要递归加上复容器的 top
   *    这样每次 repaint 的时候只需要直接使用计算好的值即可，不需要每次都递归计算
   *    这一步称为 layoutChildren，目的在于将 css-layout 进一步处理为可以渲染直接用的布局信息
   * 4. renderChildren：执行渲染
   * 5. bindEvents：执行事件绑定
   */
  // @ts-ignore
  layout(context: CanvasRenderingContext2D) {
    this.renderContext = context;

    if (!this.hasViewPortSet) {
      console.error('[Layout] Please invoke method `updateViewPort` before method `layout`');
    }

    debugInfo.start('layout');

    this.reflow(true);

    debugInfo.start('layout_other');
    this.bindEvents();

    debugInfo.start('layout_observeStyleAndEvent', true);
    iterateTree(this.children[0], element => element.observeStyleAndEvent());
    debugInfo.end('layout_observeStyleAndEvent');

    this.state = STATE.RENDERED;

    debugInfo.end('layout');
    debugInfo.end('layout_other');

    // console.log(this.debugInfo)
  }

  /**
   * 执行节点数的重绘制，一般业务侧无需调用该方法
   */
  repaint() {
    clearCanvas(this.renderContext as CanvasRenderingContext2D);

    this.isNeedRepaint = false;
    repaintChildren(this.children);
  }

  /**
   * 返回一个节点在屏幕中的位置和尺寸信息，前提是正确调用updateViewPort。
   */
  getElementViewportRect(element: Element) {
    const { realLayoutBox, viewportScale } = this;
    const {
      absoluteX,
      absoluteY,
      width,
      height,
    } = element.layoutBox;

    const realX = absoluteX * viewportScale + realLayoutBox.realX;
    const realY = absoluteY * viewportScale + realLayoutBox.realY;
    const realWidth = width * viewportScale;
    const realHeight = height * viewportScale;

    return new Rect(
      realX,
      realY,
      realWidth,
      realHeight,
    );
  }

  getChildByPos(tree: Layout | Element, x: number, y: number, itemList: (Layout | Element)[]) {
    tree.children.forEach((ele) => {
      const {
        absoluteX,
        absoluteY,
        width,
        height,
      } = ele.layoutBox;
      const realX = absoluteX * this.viewportScale + this.realLayoutBox.realX;
      const realY = absoluteY * this.viewportScale + this.realLayoutBox.realY;
      const realWidth = width * this.viewportScale;
      const realHeight = height * this.viewportScale;

      if ((realX <= x && x <= realX + realWidth) && (realY <= y && y <= realY + realHeight)) {
        /**
         * 相关issue：https://github.com/wechat-miniprogram/minigame-canvas-engine/issues/17
         * 这里只要满足条件的都要记录，否则可能出现 issue 里面提到的问题
         */
        itemList.push(ele);
        if (ele.children.length) {
          this.getChildByPos(ele, x, y, itemList);
        }
      }
    });
  }

  eventHandler = (eventName: string) => {
    return (e: MouseEvent | GameTouchEvent) => {
      let touch: MouseEvent | GameTouch;

      if (isGameTouchEvent(e)) {
        touch = (e.touches && e.touches[0]) || (e.changedTouches && e.changedTouches[0]);
      } else {
        touch = e;
      }
      // const touch = (e.touches && e.touches[0]) || (e.changedTouches && e.changedTouches[0]) || e;
      if (!touch || !touch.pageX || !touch.pageY) {
        return;
      }

      if (!touch.timeStamp) {
        // @ts-ignore
        touch.timeStamp = e.timeStamp;
      }

      const list: (Layout | Element)[] = [];
      if (touch) {
        this.getChildByPos(this, touch.pageX, touch.pageY, list);
      }

      if (!list.length) {
        list.push(this);
      }

      const item = list[list.length - 1];
      item && item.emit(eventName, e);

      if (eventName === 'touchstart' || eventName === 'touchend') {
        this.eventHandlerData.touchMsg[eventName] = touch;
      }

      if (eventName === 'touchend' && isClick(this.eventHandlerData.touchMsg)) {
        item && item.emit('click', e);
      }
    };
  };

  /**
   * 执行全局的事件绑定逻辑
   */
  bindEvents() {
    if (this.eventHandlerData.hasEventBind) {
      return;
    }

    this.eventHandlerData.hasEventBind = true;
    env.onTouchStart(this.eventHandlerData.handlers.touchStart);
    env.onTouchMove(this.eventHandlerData.handlers.touchMove);
    env.onTouchEnd(this.eventHandlerData.handlers.touchEnd);
    env.onTouchCancel(this.eventHandlerData.handlers.touchCancel);

    /**
     * 当触发 touchstart 事件的时候，如果手指移除元素外，不会触发 touchend，这就导致 deactiveHandler 不能触发
     * 要做到比较完善，事件系统要做较大改用，目前比较好的做法就是根节点在监听到 touchend 和 touchcancel 的时候兜底
     * 触发下 deactiveHandler
     */
    this.on('touchend', () => {
      this.activeElements.forEach((ele: Element) => {
        ele.deactiveHandler();
      });

      this.activeElements = [];
    });
    this.on('touchcancel', () => {
      this.activeElements.forEach((ele: Element) => {
        ele.deactiveHandler();
      });

      this.activeElements = [];
    });
  }

  /**
   * 全局事件解绑
   */
  unBindEvents() {
    env.offTouchStart(this.eventHandlerData.handlers.touchStart);
    env.offTouchMove(this.eventHandlerData.handlers.touchMove);
    env.offTouchEnd(this.eventHandlerData.handlers.touchEnd);
    env.offTouchCancel(this.eventHandlerData.handlers.touchCancel);

    this.eventHandlerData.hasEventBind = false;
  }

  emit(event: string, data: any) {
    EE.emit(event, data);
  }

  on(event: string, callback: Callback) {
    EE.on(event, callback);
  }

  once(event: string, callback: Callback) {
    EE.once(event, callback);
  }

  off(event: string, callback: Callback) {
    EE.off(event, callback);
  }

  destroyAll(tree: Layout | Element) {
    const {
      children,
    } = tree;

    children.forEach((child) => {
      child.destroy();
      this.destroyAll(child);
      child.destroySelf && child.destroySelf();
    });
  }

  /**
   * 清理画布，之前的计算出来的渲染树也会一并清理，此时可以再次执行init和layout方法渲染界面。
   */
  clear(options: { removeTicker?: boolean } = {}) {
    const { removeTicker = true } = options;

    debugInfo.reset();
    this.destroyAll(this);
    // this.elementTree = null;
    this.children = [];
    this.state = STATE.CLEAR;
    this.isDirty = false;
    clearCanvas(this.renderContext as CanvasRenderingContext2D);
    this.eleCount = 0;
    this.unBindEvents();

    if (removeTicker) {
      this.ticker.remove();
      this.ticker.stop();
    } else {
      // inner的应该默认都移除，否则前后两次初始化会导致前后状态有问题
      this.ticker.removeInner();
    }

    this.activeElements = [];
  }

  clearPool() {
    imgPool.clear();
  }

  /**
   * 比起 Layout.clear 更彻底的清理，会清空图片对象池，减少内存占用。
   */
  clearAll() {
    this.clear();

    this.clearPool();
  }

  /**
   * 对于图片资源，如果不提前加载，渲染过程中可能出现挨个出现图片效果，影响体验
   * 通过Layout.loadImgs可以预加载图片资源，在调用Layout.layout的时候渲染性能更好，体验更佳。
   */
  loadImgs(arr: string[] = []) {
    return Promise.all(arr.map(src => imageManager.loadImagePromise(src)));
  }

  /**
   * 注册 bitmaptext 可用的字体。
   */
  registBitMapFont(name: string, src: string, config: string) {
    if (!bitMapPool.get(name)) {
      const font = new BitMapFont(name, src, config);
      this.bitMapFonts.push(font);
      bitMapPool.set(name, font);
    }
  }

  /**
   * 创建节点，创建之后会返回Element列表，可以传入parent立刻插入节点，也可以稍后主动appendChild到需要的节点下
   */
  insertElement(template: string, style: Record<string, IStyle>, parent?: Element | null): Element[] {
    const elementArray = this.insertElementArray(template, style);
    elementArray.forEach(it => {
      iterateTree(it, element => element.observeStyleAndEvent());

      if (parent) {
        parent.appendChild(it);
      }
    })
    
    return elementArray;
  }

  /**
   * 克隆节点，克隆后的节点可以添加到 Layout 的某个节点中
   * 该方法可以在数据有变化的时候避免重新执行 Layout.init 流程。
   */
  cloneNode(element: Element, deep = true) {
    return clone<Layout>(this, element, deep);
  }

  /**
   * 将组件挂到Layout
   */
  Element = Element;
  View = View;
  Text = Text;
  Image = Image;
  ScrollView = ScrollView;
  BitMapText = BitMapText;
  Canvas = Canvas;
  Button = Button;

  registerComponent = registerComponent;

  private static installedPlugins: IPlugin<Layout>[] = [];
  /**
   * 安装给定的插件
   */
  use(plugin: IPlugin<Layout>, ...options: any[]) {
    if (Layout.installedPlugins.includes(plugin)) {
      console.warn('[Layout] 该插件已安装.');
      return;
    }

    plugin.install(this, ...options);
    Layout.installedPlugins.push(plugin);

    // console.log(`[Layout] 插件 ${plugin.name || ''} 已安装`)
  }

  /**
   * 卸载给定插件
   */
  unUse(plugin: IPlugin<Layout>, ...options: any[]) {
    const pluginIndex = Layout.installedPlugins.indexOf(plugin);

    if (pluginIndex === -1) {
      console.warn('[Layout] This plugin is not installed.');
      return;
    }

    if (plugin.uninstall) {
      plugin.uninstall(this, ...options);
    }

    // console.log(`[Layout] 插件 ${plugin.name || ''} 已卸载`)
    Layout.installedPlugins.splice(pluginIndex, 1);
  }

  /**
   * 创建节点，创建之后会返回Element列表
   */
  private insertElementArray(template: string, style: Record<string, IStyle>, attrValueProcessor?: Callback, onlyFirst?: boolean): Element[] {
    // 样式表存到全局
    this.styleSheet = Object.assign(this.styleSheet, style);

    const parseConfig = {
      attributeNamePrefix: '',
      attrNodeName: 'attr', // default is 'false'
      textNodeName: '#text',
      ignoreAttributes: false,
      ignoreNameSpace: true,
      allowBooleanAttributes: true,
      parseNodeValue: false,
      parseAttributeValue: false,
      trimValues: true,
      parseTrueNumberOnly: false,
      alwaysCreateTextNode: true,
    };

    if (attrValueProcessor && typeof attrValueProcessor === 'function') {
      // @ts-ignore
      parseConfig.attrValueProcessor = attrValueProcessor;
    }

    debugInfo.start('insert_xmlParse');
    // 将xml字符串解析成xml节点树
    const jsonObj = parser.parse(template, parseConfig, true);
    // console.log(jsonObj)
    debugInfo.end('insert_xmlParse');

    const getElements: Element[] = [];
    jsonObj.children.forEach((xmlTree: TreeNode, index: number) => {
      if (onlyFirst && index > 0) {
        return;
      }
      // XML树生成渲染树
      debugInfo.start('insert_xml2Layout');
      const layoutTree = create.call(this, xmlTree, this.styleSheet);
      debugInfo.end('insert_xml2Layout');
      getElements.push(layoutTree);
    });

    return getElements;
  }
}

const layout = new Layout({
  style: {
    width: 0,
    height: 0,
  },
  name: 'layout',
});

export {
  layout as default,
  Layout,
  env,
  EE,
  IStyle,
  Element,
  View,
  Text,
  Image,
  ScrollView,
  BitMapText,
  Canvas,
  Button
}

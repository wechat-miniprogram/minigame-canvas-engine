import './env.js';
import Element from './components/elements.js';
import Pool from './common/pool.js';
import Emitter from 'tiny-emitter';
import computeLayout from 'css-layout';
import {
  isClick,
  STATE,
  clearCanvas,
} from './common/util.js';
import parser from './libs/fast-xml-parser/parser.js';
import BitMapFont from './common/bitMapFont';
// import TWEEN from '@tweenjs/tween.js';
import DebugInfo from './common/debugInfo.js';
import Ticker from './common/ticker';
import {
  create,
  renderChildren,
  layoutChildren,
  repaintChildren,
  iterateTree,
  clone,
} from './common/vd';

import imageManager from './common/imageManager.js';

// 全局事件管道
export const EE = new Emitter();
const imgPool = new Pool('imgPool');
const debugInfo = new DebugInfo();

class Layout extends Element {
  constructor({
    style,
    name,
  } = {}) {
    super({
      style,
      id: 0,
      name,
    });

    this.hasEventHandler = false;
    this.elementTree = null;
    this.renderContext = null;

    this.renderport = {};
    this.viewport = {};
    this.viewportScale = 1;
    this.hasViewPortSet = false;
    this.realLayoutBox = {
      realX: 0,
      realY: 0,
    };

    this.touchMsg = {};
    this.touchStart = this.eventHandler('touchstart').bind(this);
    this.touchMove = this.eventHandler('touchmove').bind(this);
    this.touchEnd = this.eventHandler('touchend').bind(this);
    this.touchCancel = this.eventHandler('touchcancel').bind(this);

    this.version = '1.0.0';
    this.eleCount = 0;

    this.state = STATE.UNINIT;

    this.bitMapFonts = [];

    /**
     * 对于不会影响布局的改动，比如图片只是改个地址、加个背景色之类的改动，会触发 Layout 的 repaint 操作
     * 触发的方式是给 Layout 抛个 `repaint` 的事件，为了性能，每次接收到 repaint 请求不会执行真正的渲染
     * 而是执行一个置脏操作，ticker 每一次执行 update 会检查这个标记位，进而执行真正的重绘操作
     */
    this.isNeedRepaint = false;

    this.on('repaint', () => {
      this.isNeedRepaint = true;
    });

    this.ticker = new Ticker();

    /**
     * 将 Tween 挂载到 Layout，对于 Tween 的使用完全遵循 Tween.js 的文档
     * https://github.com/tweenjs/tween.js/
     * 只不过当 Tween 改动了节点会触发 repaint、reflow 的属性时，Layout 会执行相应的操作
     * 业务侧不用感知到 repaint 和 reflow
     */
    // this.TWEEN = TWEEN;

    this.tickerFunc = () => {
      // TWEEN.update();
      if (this.isDirty) {
        this.reflow();
      } else if (this.isNeedRepaint) {
        this.repaint();
      }
    };

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
  updateViewPort(box) {
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

  init(template, style, attrValueProcessor) {
    debugInfo.start('init');
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
      parseConfig.attrValueProcessor = attrValueProcessor;
    }

    debugInfo.start('init_xmlParse');
    // 将xml字符串解析成xml节点树
    const jsonObj = parser.parse(template, parseConfig, true);
    debugInfo.end('init_xmlParse');

    console.log(jsonObj)

    const xmlTree = jsonObj.children[0];

    // XML树生成渲染树
    debugInfo.start('init_xml2Layout');
    const layoutTree = create.call(this, xmlTree, style);
    debugInfo.end('init_xml2Layout');

    this.add(layoutTree);

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
    layoutChildren.call(this, this);
    debugInfo.end('layoutChildren');

    this.viewportScale = this.viewport.width / this.renderport.width;

    clearCanvas(this.renderContext);

    // 遍历节点树，依次调用节点的渲染接口实现渲染
    debugInfo.start('renderChildren', true);
    renderChildren(this.children, this.renderContext, false);
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
  layout(context) {
    this.renderContext = context;

    if (!this.hasViewPortSet) {
      console.error('Please invoke method `updateViewPort` before method `layout`');
    }

    debugInfo.start('layout');

    this.reflow(true);

    debugInfo.start('layout_other');
    this.bindEvents();

    debugInfo.start('observeStyleAndEvent', true);
    iterateTree(this.children[0], element => element.observeStyleAndEvent());
    debugInfo.end('layout_observeStyleAndEvent');

    this.state = STATE.RENDERED;

    debugInfo.end('layout');
    debugInfo.end('layout_other');
  }

  repaint() {
    clearCanvas(this.renderContext);

    this.isNeedRepaint = false;
    repaintChildren(this.children);
  }

  getChildByPos(tree, x, y, itemList) {
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

  eventHandler(eventName) {
    return function touchEventHandler(e) {
      const touch = (e.touches && e.touches[0]) || (e.changedTouches && e.changedTouches[0]) || e;
      if (!touch || !touch.pageX || !touch.pageY) {
        return;
      }

      if (!touch.timeStamp) {
        touch.timeStamp = e.timeStamp;
      }

      const list = [];
      if (touch) {
        this.getChildByPos(this, touch.pageX, touch.pageY, list);
      }

      if (!list.length) {
        list.push(this);
      }

      const item = list[list.length - 1];
      item && item.emit(eventName, e);

      if (eventName === 'touchstart' || eventName === 'touchend') {
        this.touchMsg[eventName] = touch;
      }

      if (eventName === 'touchend' && isClick(this.touchMsg)) {
        item && item.emit('click', e);
      }
    };
  }

  bindEvents() {
    if (this.hasEventHandler) {
      return;
    }

    this.hasEventHandler = true;

    if (typeof __env !== 'undefined') {
      __env.onTouchStart(this.touchStart);
      __env.onTouchMove(this.touchMove);
      __env.onTouchEnd(this.touchEnd);
      __env.onTouchCancel(this.touchCancel);
    } else {
      document.onmousedown = this.touchStart;
      document.onmousemove = this.touchMove;
      document.onmouseup = this.touchEnd;
      document.onmouseleave = this.touchEnd;
    }
  }

  unBindEvents() {
    if (typeof __env !== 'undefined') {
      __env.offTouchStart(this.touchStart);
      __env.offTouchMove(this.touchMove);
      __env.offTouchEnd(this.touchEnd);
      __env.offTouchCancel(this.touchCancel);
    } else {
      document.onmousedown = null;
      document.onmousemove = null;
      document.onmouseup = null;
      document.onmouseleave = null;
    }

    this.hasEventHandler = false;
  }

  emit(event, data) {
    EE.emit(event, data);
  }

  on(event, callback) {
    EE.on(event, callback);
  }

  once(event, callback) {
    EE.once(event, callback);
  }

  off(event, callback) {
    EE.off(event, callback);
  }

  destroyAll(tree) {
    const {
      children,
    } = tree;

    children.forEach((child) => {
      child.destroy();
      this.destroyAll(child);
      child.destroySelf && child.destroySelf();
    });
  }

  clear(options = {}) {
    const { removeTicker = true } = options;

    debugInfo.reset();
    this.destroyAll(this);
    this.elementTree = null;
    this.children = [];
    this.state = STATE.CLEAR;
    this.isDirty = false;
    clearCanvas(this.renderContext);
    this.eleCount = 0;
    this.unBindEvents();

    if (removeTicker) {
      this.ticker.remove();
      this.ticker.stop();
    }
  }

  clearPool() {
    imgPool.clear();
  }

  clearAll() {
    this.clear();

    this.clearPool();
  }

  loadImgs(arr = []) {
    return Promise.all(arr.map(src => imageManager.loadImagePromise(src)));
  }

  registBitMapFont(name, src, config) {
    const font = new BitMapFont(name, src, config);
    this.bitMapFonts.push(font);
  }

  cloneNode(element, deep = true) {
    return clone.call(this, element, deep);
  }
}

export default new Layout({
  style: {
    width: 0,
    height: 0,
  },
  name: 'layout',
});

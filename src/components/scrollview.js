/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
import View from './view.js';
import { getDpr, copyTouchArray } from '../common/util';
import { Scroller } from 'scroller';
import { iterateTree } from '../common/vd';

const dpr = getDpr();

export default class ScrollView extends View {
  constructor({
    style = {},
    idName = '',
    className = '',
    scrollX,
    scrollY,
    dataset,
  }) {
    super({
      style,
      idName,
      dataset,
      className,
    });

    this.type = 'ScrollView';

    // 当前列表滚动的值
    this.scrollTop = 0;
    this.scrollLeft = 0;
    this.hasEventBind = false;
    this.currentEvent = null;

    this.requestID = null;

    this.scrollYProp = scrollY;

    this.innerScrollerOption = {
      scrollingX: !!scrollX,
      scrollingY: !!scrollY,
    };
  }

  /**
   * 获取滚动列表内所有元素的高度和
   * 这里不能简单将所有子元素的高度累加，因为每个元素之间可能是有空隙的
   */
  get scrollHeight() {
    // scrollview为空的情况
    if (!this.children.length) {
      return 0;
    }

    const last = this.children[this.children.length - 1];

    return last.layoutBox.top + last.layoutBox.height;
  }

  get scrollWidth() {
    // scrollview为空的情况
    if (!this.children.length) {
      return 0;
    }

    const last = this.children[this.children.length - 1];

    return last.layoutBox.left + last.layoutBox.width;
  }

  get scrollX() {
    return this.innerScrollerOption.scrollingX;
  }

  set scrollX(value) {
    this.scrollerOption = {
      scrollingX: value,
    };
  }

  get scrollY() {
    return this.innerScrollerOption.scrollingY;
  }

  set scrollY(value) {
    this.scrollerOption = {
      scrollingY: value,
    };
  }

  get scrollerOption() {
    return this.innerScrollerOption;
  }

  set scrollerOption(value = {}) {
    Object.assign(this.innerScrollerOption, value);

    if (this.scrollerObj) {
      Object.assign(this.scrollerObj.options, this.scrollerOption);
    }
  }

  repaint() {
    this.scrollRender();
  }

  destroySelf() {
    this.touch = null;
    this.isDestroyed = true;

    this.ctx = null;
    this.children = null;
    this.root.off('touchend');
    this.root = null;
  }

  renderTreeWithTop(tree) {
    tree.render();

    tree.children.forEach((child) => {
      this.renderTreeWithTop(child);
    });
  }

  clear() {
    const box = this.layoutBox;
    this.ctx.clearRect(box.absoluteX, box.absoluteY, box.width, box.height);
  }

  scrollRender() {
    const box = this.layoutBox;

    const { absoluteX: startX, absoluteY: startY, width, height } = box;

    // 根据滚动值获取裁剪区域
    const endX = startX + width;
    const endY = startY + height;

    // ScrollView 作为容器本身的渲染
    this.render();

    /**
     * 开始裁剪，只有仔 ScrollView layoutBox 区域内的元素才是可见的
     * 这样 ScrollView 不用单独占用一个 canvas，内存合渲染都会得到优化
     */
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.rect(startX, startY, width, height);
    this.ctx.clip();

    this.children.forEach((child) => {
      const { width, height, absoluteX, absoluteY } = child.layoutBox;

      // 判断处于可视窗口内的子节点，递归渲染该子节点
      if (absoluteY + height >= startY && absoluteY <= endY
        && absoluteX + width >= startX && absoluteX <= endX) {
        this.renderTreeWithTop(child);
      }
    });

    this.ctx.restore();
  }

  scrollHandler(left, top) {
    // 可能被销毁了或者节点树还没准备好
    if (!this.isDestroyed && !this.isFirstScroll) {
      iterateTree(this, (ele) => {
        if (ele !== this) {
          ele.layoutBox.absoluteY = ele.layoutBox.originalAbsoluteY - top;
          ele.layoutBox.absoluteX = ele.layoutBox.originalAbsoluteX - left;
        }
      });

      // 这里要把滚动状态保存起来，因为在reflow的时候需要做重置，渲染并不依赖这两个信息
      this.scrollTop = top;
      this.scrollLeft = left;

      this.root.emit('repaint');

      if (this.currentEvent) {
        this.emit('scroll', this.currentEvent);
      }
    }
    if (this.isFirstScroll) {
      this.isFirstScroll = false;
    }
  }

  insert(context) {
    this.ctx = context;

    /**
     * 这里有个非常特殊的兼容逻辑，在低版本没有重构 ScrollView之前，并没有提供单独的 ScrollX 和 ScrollY 属性
     * 而是判断 scrollHeiht 大于容器高度的时候自动实现了纵向滚动（且没有横向滚动能力）
     * 因此这里做一个兼容逻辑，如果 scrollHeight > this.layoutBox.height 自动开启纵向滚动
     */
    if (this.scrollHeight > this.layoutBox.height && typeof this.scrollYProp === 'undefined') {
      this.scrollY = true;
    }

    if (this.hasEventBind) {
      // reflow 高度可能会变化，因此需要执行 setDimensions 刷新可滚动区域
      if (this.layoutBox.width !== this.scrollerObj.__clientWidth
        || this.layoutBox.height !== this.scrollerObj.__clientHeight
        || this.scrollWidth !== this.scrollerObj.__contentWidth
        || this.scrollHeight !== this.scrollerObj.__contentHeight) {
        this.scrollerObj.setDimensions(
          this.layoutBox.width,
          this.layoutBox.height,
          this.scrollWidth,
          this.scrollHeight,
        );
      }

      // reflow 之后，会从 csslayout 同步布局信息，原先的滚动信息会丢失，这里需要一个复位的操作
      iterateTree(this, (ele) => {
        if (ele !== this) {
          ele.layoutBox.absoluteY = ele.layoutBox.originalAbsoluteY - this.scrollTop;
          ele.layoutBox.absoluteX = ele.layoutBox.originalAbsoluteX - this.scrollLeft;
        }
      });

      return;
    }

    this.hasEventBind = true;
    this.isFirstScroll = true;

    this.scrollerObj = new Scroller(this.scrollHandler.bind(this), this.scrollerOption);

    this.scrollerObj.setDimensions(this.layoutBox.width, this.layoutBox.height, this.scrollWidth, this.scrollHeight);

    this.on('touchstart', (e) => {
      if (!e.touches) {
        e.touches = [e];
      }

      const touches = copyTouchArray(e.touches);

      touches.forEach((touch) => {
        if (dpr !== 1) {
          touch.pageX *= dpr;
          touch.pageY *= dpr;
        }
      });
      this.scrollerObj.doTouchStart(touches, e.timeStamp);
      this.currentEvent = e;
    });

    this.on('touchmove', (e) => {
      if (!e.touches) {
        e.touches = [e];
      }

      const touches = copyTouchArray(e.touches);

      touches.forEach((touch) => {
        if (dpr !== 1) {
          touch.pageX *= dpr;
          touch.pageY *= dpr;
        }
      });
      this.scrollerObj.doTouchMove(touches, e.timeStamp);
      this.currentEvent = e;
    });

    // 这里不应该是监听scrollview的touchend事件而是屏幕的touchend事件
    this.root.on('touchend', (e) => {
      this.scrollerObj.doTouchEnd(e.timeStamp);
      this.currentEvent = e;
    });
  }

  scrollTo(left = 0, top = 0, animate = true) {
    this.scrollerObj.scrollTo(left, top, animate);
  }
}

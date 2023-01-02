/* eslint-disable no-param-reassign */
import View from './view.js';
import { getDpr, copyTouchArray } from '../common/util.js';
import { Scroller } from 'scroller';
import { iterateTree  } from '../common/vd.js';

const dpr = getDpr();

export default class ScrollView extends View {
  constructor({
    style = {},
    props = {},
    idName = '',
    className = '',
    scrollX = false,
    scrollY = false,
    dataset,
  }) {
    super({
      props,
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

    this.innerScrollerOption = {
      scrollingX: scrollX,
      scrollingY: scrollY,
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
    this.clear();

    this.render(this.ctx);

    this.scrollRender(this.scrollLeft, this.scrollTop);
  }

  destroySelf() {
    this.touch = null;
    this.isDestroyed = true;

    this.ctx = null;
    this.children = null;
    this.root = null;
  }

  renderTreeWithTop(tree, top, left) {
    tree.render();

    tree.children.forEach((child) => {
      this.renderTreeWithTop(child, top, left);
    });
  }

  clear() {
    const box = this.layoutBox;
    this.ctx.clearRect(box.absoluteX, box.absoluteY, box.width, box.height);
  }

  scrollRender(left = 0, top = 0) {
    const box = this.layoutBox;
    this.scrollTop = top;
    this.scrollLeft = left;

    // scrollview在全局节点中的Y轴位置
    const abY = box.absoluteY;
    const abX = box.absoluteX;

    // 根据滚动值获取裁剪区域
    const startY = abY + this.scrollTop;
    const endY = abY + this.scrollTop + box.height;
    const startX = abX + this.scrollLeft;
    const endX = abX + this.scrollLeft + box.width;

    // 清理滚动画布和主屏画布
    this.clear();

    // ScrollView 作为容器本身的渲染
    this.render(this.ctx);

    /**
     * 开始裁剪，只有仔 ScrollView layoutBox 区域内的元素才是可见的
     * 这样 ScrollView 不用单独占用一个 canvas，内存合渲染都会得到优化
     */
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.rect(abX, abY, box.width, box.height);
    this.ctx.clip();

    this.children.forEach((child) => {
      const { layoutBox } = child;
      const { height } = layoutBox;
      const { width } = layoutBox;
      const originY = layoutBox.originalAbsoluteY;
      const originX = layoutBox.originalAbsoluteX;

      // 判断处于可视窗口内的子节点，递归渲染该子节点
      if (originY + height >= startY && originY <= endY
        && originX + width >= startX && originX <= endX) {
        this.renderTreeWithTop(child, this.scrollTop, this.scrollLeft);
      }
    });

    this.ctx.restore();
  }

  insert(context) {
    this.ctx = context;

    if (this.hasEventBind) {
      // reflow 高度可能会变化，因此需要执行 setDimensions 刷新可滚动区域
      this.scrollerObj.setDimensions(this.layoutBox.width, this.layoutBox.height, this.scrollWidth, this.scrollHeight);
      return;
    }

    this.hasEventBind = true;

    this.scrollerObj = new Scroller((left, top) => {
      // 可能被销毁了或者节点树还没准备好
      if (!this.isDestroyed) {
        iterateTree(this, (ele) => {
          if (ele !== this) {
            ele.layoutBox.absoluteY = ele.layoutBox.originalAbsoluteY - top;
            ele.layoutBox.absoluteX = ele.layoutBox.originalAbsoluteX - left;
          }
        });
        this.scrollRender(left, top);
        if (this.currentEvent) {
          this.emit('scroll', this.currentEvent);
        }
      }
    }, this.scrollerOption);

    requestAnimationFrame(() => {
      // this.scrollerObj.setDimensions 本身就会触发一次 Scroll，调用渲染
      this.scrollerObj.setDimensions(this.layoutBox.width, this.layoutBox.height, this.scrollWidth, this.scrollHeight);
    });

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

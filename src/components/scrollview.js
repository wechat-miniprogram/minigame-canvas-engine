import View from './view.js';
import { throttle, getDpr } from '../common/util.js';
import { Scroller } from 'scroller';

const dpr = getDpr();

function copyTouchArray(touches) {
  return touches.map(touch => ({
    identifier: touch.identifier,
    pageX: touch.pageX,
    pageY: touch.pageY,
    clientX: touch.clientX,
    clientY: touch.clientY,
  }));
}

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

    // 图片加载完成之后会触发scrollView的重绘函数，当图片过多的时候用节流提升性能
    this.throttleImageLoadDone = throttle(this.childImageLoadDoneCbk, 16, this);

    this.scrollCanvas = null;
    this.scrollCtx = null;

    this.requestID = null;

    this.innerScrollerOption = {
      scrollingX: scrollX,
      scrollingY: scrollY,
    };

    this.sharedTexture = false;
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

    this.render(this.ctx, this.layoutBox);

    this.scrollRender(this.scrollLeft, this.scrollTop);
  }

  destroySelf() {
    this.touch = null;
    this.isDestroyed = true;

    this.root.off('repaint__done');
    this.ctx = null;
    this.children = null;
    this.root = null;

    this.scrollCanvas = null;
    this.scrollCtx = null;

    this.requestID && cancelAnimationFrame(this.requestID);
  }

  renderTreeWithTop(tree, top, left) {
    const { layoutBox } = tree;
    // 计算实际渲染的Y轴位置
    layoutBox.absoluteY = layoutBox.originalAbsoluteY - top;
    layoutBox.absoluteX = layoutBox.originalAbsoluteX - left;

    // tree.render(this.scrollCtx, layoutBox);
    tree.render(this.ctx, layoutBox);

    tree.children.forEach((child) => {
      this.renderTreeWithTop(child, top, left);
    });
  }

  clear() {
    const box = this.layoutBox;
    this.ctx.clearRect(box.absoluteX, box.absoluteY, box.width, box.height);
  }

  scrollRenderHandler(left = 0, top = 0) {
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
    this.render(this.ctx, this.layoutBox);

    /**
     * 开始裁剪，只有仔 ScrollView layoutBox 区域内的元素才是可见的
     * 这样 ScrollView 不用单独占用一个 canvas，内存合渲染都会得到优化
     */
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.rect(this.layoutBox.absoluteX, this.layoutBox.absoluteY, this.layoutBox.width, this.layoutBox.height);
    this.ctx.clip();

    this.children.forEach((child) => {
      const { layoutBox } = child;
      const { height } = layoutBox;
      const { width } = layoutBox;
      const originY = layoutBox.originalAbsoluteY;
      const originX = layoutBox.originalAbsoluteX;

      // 判断处于可视窗口内的子节点，渲染该子节点
      if (originY + height >= startY && originY <= endY
        && originX + width >= startX && originX <= endX) {
        this.renderTreeWithTop(child, this.scrollTop, this.scrollLeft);
      }
    });

    this.ctx.restore();
  }

  scrollRender(left, top) {
    if (this.sharedTexture) {
      this.requestID = requestAnimationFrame(() => {
        this.scrollRenderHandler(left, top);
      });
    } else {
      this.scrollRenderHandler(left, top);
    }
  }

  childImageLoadDoneCbk() {
    this.scrollRender(this.scrollLeft, this.scrollTop);
  }

  insertScrollView(context) {
    // 绘制容器
    this.insert(context);

    if (this.hasEventBind) {
      // reflow 高度可能会变化，因此需要执行 setDimensions 刷新可滚动区域
      this.scrollerObj.setDimensions(this.layoutBox.width, this.layoutBox.height, this.scrollWidth, this.scrollHeight);
      return;
    }

    this.hasEventBind = true;

    this.scrollerObj = new Scroller((left, top) => {
      // 可能被销毁了或者节点树还没准备好
      if (!this.isDestroyed) {
        this.scrollRender(left, top);
        if (this.currentEvent) {
          this.emit('scroll', this.currentEvent);
        }
      }
    }, this.scrollerOption);

    // this.scrollerObj.setDimensions 本身就会触发一次 Scroll，调用渲染
    this.scrollerObj.setDimensions(this.layoutBox.width, this.layoutBox.height, this.scrollWidth, this.scrollHeight);

    /* this.scrollActive = true; */
    this.on('touchstart', (e) => {
      // this.scrollActive = true;
      if (!e.touches) {
        e.touches = [e];
      }

      const touches = copyTouchArray(e.touches);
      /* const touches = e.touches;*/

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
      /* const touches = e.touches;*/

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

/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
import View from './view';
import { getDpr, copyTouchArray } from '../common/util';
import Scroller from '../libs/scroller/index.js'
import { iterateTree } from '../common/vd';
import Element from './elements';
import { IElementOptions } from './types';
import ScrollBar, { ScrollBarDirection } from './scrollbar';
import { reflowAffectedStyles } from './style';
import { sharedTicker } from '../common/ticker';

const dpr = getDpr();

interface IScrollViewOptions extends IElementOptions {
  scrollX?: boolean | undefined;
  scrollY?: boolean | undefined;
}

interface IInnerScrollerOption {
  scrollingX?: boolean;
  scrollingY?: boolean;
};

export default class ScrollView extends View {
  public scrollTop = 0;
  public scrollLeft = 0;
  public hasEventBind = false;
  public currentEvent = null;
  public type = 'ScrollView';

  private scrollYProp: boolean | undefined;
  private innerScrollerOption: IInnerScrollerOption;

  private scrollerObj?: Scroller;
  private isFirstScroll?: boolean;

  private vertivalScrollbar: ScrollBar | null = null;
  private horizontalScrollbar: ScrollBar | null = null;

  constructor({
    style = {},
    idName = '',
    className = '',
    scrollX,
    scrollY,
    dataset,
  }: IScrollViewOptions) {
    super({
      style,
      idName,
      dataset,
      className,
    });

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

    let maxHeight = 0;
    this.children.forEach((item: Element) => {
      if (item.style.position !== 'absolute') {
        maxHeight = Math.max(maxHeight, item.layoutBox.top + item.layoutBox.height);
      }
    });
    // const last = this.children[this.children.length - 1];

    // return last.layoutBox.top + last.layoutBox.height;
    return maxHeight;
  }

  get scrollWidth() {
    // scrollview为空的情况
    if (!this.children.length) {
      return 0;
    }

    let maxWidth = 0;
    this.children.forEach((item: Element) => {
      if (item.style.position !== 'absolute') {
        maxWidth = Math.max(maxWidth, item.layoutBox.left + item.layoutBox.width);
      }
    });

    return maxWidth;
    // const last = this.children[this.children.length - 1];

    // return last.layoutBox.left + last.layoutBox.width;
  }

  get scrollX() {
    return this.innerScrollerOption.scrollingX;
  }

  set scrollX(value) {
    this.scrollerOption = {
      scrollingX: value,
    };

    this.updateScrollBar('scrollX', 'horizontalScrollbar');

  }

  get scrollY() {
    return this.innerScrollerOption.scrollingY;
  }

  set scrollY(value) {
    if (value !== this.scrollY) {
      this.scrollerOption = {
        scrollingY: value,
      };

      this.scrollerObj && this.updateScrollBar('scrollY', 'vertivalScrollbar');
    }
  }

  get scrollerOption() {
    return this.innerScrollerOption;
  }

  set scrollerOption(value: IInnerScrollerOption) {
    Object.assign(this.innerScrollerOption, value);

    if (this.scrollerObj) {
      Object.assign(this.scrollerObj.options, this.scrollerOption);
    }
  }

  repaint() {
    this.scrollRender();
  }

  destroySelf() {
    // this.touch = null;
    this.isDestroyed = true;

    this.ctx = null;
    this.children = [];
    this.root!.off('touchend');
    this.root = null;
  }

  renderTreeWithTop(tree: Element) {
    tree.render();

    tree.children.forEach((child: Element) => {
      this.renderTreeWithTop(child);
    });
  }

  clear() {
    const box = this.layoutBox;
    this.ctx!.clearRect(box.absoluteX, box.absoluteY, box.width, box.height);
  }

  scrollRender() {
    const box = this.layoutBox;

    const { absoluteX: startX, absoluteY: startY, width, height } = box;
    const ctx = this.ctx as CanvasRenderingContext2D;

    // 根据滚动值获取裁剪区域
    const endX = startX + width;
    const endY = startY + height;

    // ScrollView 作为容器本身的渲染
    this.render();

    /**
     * 开始裁剪，只有仔 ScrollView layoutBox 区域内的元素才是可见的
     * 这样 ScrollView 不用单独占用一个 canvas，内存合渲染都会得到优化
     */
    ctx.save();
    ctx.beginPath();
    ctx.rect(startX, startY, width, height);
    ctx.clip();

    this.children.forEach((child) => {
      const { width, height, absoluteX, absoluteY } = child.layoutBox;

      // 判断处于可视窗口内的子节点，递归渲染该子节点
      if (absoluteY + height >= startY && absoluteY <= endY
        && absoluteX + width >= startX && absoluteX <= endX) {
        this.renderTreeWithTop(child);
      }
    });

    ctx.restore();
  }

  scrollHandler(left: number, top: number) {
    // 可能被销毁了或者节点树还没准备好
    if (!this.isDestroyed && !this.isFirstScroll) {
      iterateTree(this, (ele) => {
        if (ele !== this && ele.style.position !== 'absolute') {
          ele.layoutBox.absoluteY = ele.layoutBox.originalAbsoluteY - top;
          ele.layoutBox.absoluteX = ele.layoutBox.originalAbsoluteX - left;
        }
      });

      // 这里要把滚动状态保存起来，因为在reflow的时候需要做重置，渲染并不依赖这两个信息
      this.scrollTop = top;
      this.scrollLeft = left;

      this.vertivalScrollbar?.onScroll(left, top);
      this.horizontalScrollbar?.onScroll(left, top);

      this.root!.emit('repaint');

      if (this.currentEvent) {
        this.emit('scroll', this.currentEvent);
      }
    }

    if (this.isFirstScroll) {
      this.isFirstScroll = false;
    }
  }

  // styleChangeHandler(prop: string, val: any) {
  //   // console.log(prop, val);
  //   if (reflowAffectedStyles.indexOf(prop) > -1) {

  //   }
  // }

  updateScrollBar(scrollProp: string, scrollBarName: string) {
    const dimensions = {
      width: this.layoutBox.width,
      height: this.layoutBox.height,
      contentWidth: this.scrollerObj!.__contentWidth,
      contentHeight: this.scrollerObj!.__contentHeight,
      maxScrollLeft: this.scrollerObj!.__maxScrollLeft,
      maxScrollTop: this.scrollerObj!.__maxScrollTop,
    }

    if (this[scrollProp as keyof ScrollView]) {
      if (this[scrollBarName as keyof ScrollView]) {
        this[scrollBarName as keyof ScrollView].setDimensions(dimensions);
      } else {
        const scrollBar = new ScrollBar({
          dimensions,
          direction: scrollProp === 'scrollY' ? ScrollBarDirection.Vertival : ScrollBarDirection.Horizontal,
        });

        // this.appendChild(scrollbar);
        scrollBar.root = this.root;
        // @ts-ignore
        scrollBar.insert(this.root.renderContext, true);
        scrollBar.observeStyleAndEvent();
        this.add(scrollBar);

        scrollBar.setDirty();

        // @ts-ignore
        this[scrollBarName] = scrollBar;

        sharedTicker.next(() => {
          // @ts-ignore
          this[scrollBarName]?.onScroll(this.scrollerObj!.__scrollLeft, this.scrollerObj!.__scheduledTop);
          this.root?.emit('repaint');
        });
      }
    } else {
      // 当不再需要纵向滚动的时候销毁纵向滚动条
      if (this[scrollBarName as keyof ScrollView]) {
        const scrollBar = this[scrollBarName as keyof ScrollView];
        scrollBar.remove();
        scrollBar.destroy();
        scrollBar.destroySelf();

        // @ts-ignore
        this[scrollBarName as keyof ScrollView] = null;
      }
    }
  }

  insert(context: CanvasRenderingContext2D) {
    this.shouldUpdate = false;
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
      if (this.layoutBox.width !== this.scrollerObj!.__clientWidth
        || this.layoutBox.height !== this.scrollerObj!.__clientHeight
        || this.scrollWidth !== this.scrollerObj!.__contentWidth
        || this.scrollHeight !== this.scrollerObj!.__contentHeight) {
        this.scrollerObj!.setDimensions(
          this.layoutBox.width,
          this.layoutBox.height,
          this.scrollWidth,
          this.scrollHeight,
        );

        sharedTicker.next(() => {
          this.updateScrollBar('scrollY', 'vertivalScrollbar');
          this.updateScrollBar('scrollX', 'horizontalScrollbar');
        });
      }

      // reflow 之后，会从 csslayout 同步布局信息，原先的滚动信息会丢失，这里需要一个复位的操作
      iterateTree(this, (ele) => {
        if (ele !== this && ele.style.position !== 'absolute') {
          ele.layoutBox.absoluteY = ele.layoutBox.originalAbsoluteY - this.scrollTop;
          ele.layoutBox.absoluteX = ele.layoutBox.originalAbsoluteX - this.scrollLeft;
        }
      });

      return;
    }

    this.hasEventBind = true;
    this.isFirstScroll = true;

    // @ts-ignore
    this.scrollerObj = new Scroller(this.scrollHandler.bind(this), this.scrollerOption);

    this.scrollerObj!.setDimensions(this.layoutBox.width, this.layoutBox.height, this.scrollWidth, this.scrollHeight);

    sharedTicker.next(() => {
      this.updateScrollBar('scrollY', 'vertivalScrollbar');
      this.updateScrollBar('scrollX', 'horizontalScrollbar');
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
      this.scrollerObj!.doTouchStart(touches, e.timeStamp);
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
      this.scrollerObj!.doTouchMove(touches, e.timeStamp, undefined);
      this.currentEvent = e;
    });

    // 这里不应该是监听scrollview的touchend事件而是屏幕的touchend事件
    this.root!.on('touchend', (e) => {
      this.scrollerObj!.doTouchEnd(e.timeStamp);
      this.currentEvent = e;
    });
  }

  scrollTo(left = 0, top = 0, animate = true) {
    this.scrollerObj!.scrollTo(left, top, animate, 1);
  }
}

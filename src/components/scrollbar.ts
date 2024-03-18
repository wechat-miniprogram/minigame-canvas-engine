
import View from './view';
import { clamp } from '../common/util';

export enum ScrollBarDirection {
  Vertival,
  Horizontal,
}

interface IDimensions {
  width: number;
  height: number;
  contentWidth: number;
  contentHeight: number;

  maxScrollLeft: number;
  maxScrollTop: number;

  scrollLeft: number;
  scrollTop: number;
}

interface IScrollBarOptions {
  direction: ScrollBarDirection;
  backgroundColor?: string;
  width?: number;
  dimensions: IDimensions;
}

/**
 * 根据滚动条的尺寸、ScrollView 视口和滚动窗口尺寸、滚动防线信息确认滚动条的样式信息
 */
function updateStyleFromDimensions(width: number, direction: ScrollBarDirection, dimensions: IDimensions) {
  const isVertical = direction === ScrollBarDirection.Vertival;
  const { width: scrollWidth, height: scrollHeight, contentWidth, contentHeight } = dimensions;

  return {
    width: isVertical ? width : scrollWidth * (scrollWidth / contentWidth),
    height: isVertical ? scrollHeight * (scrollHeight / contentHeight) : width,
    left: isVertical ? scrollWidth - width : 0,
    top: isVertical ? 0 : scrollHeight - width,
  };
}

function checkNeedHideScrollBar(direction: ScrollBarDirection, dimensions: IDimensions) {
  return !!(direction === ScrollBarDirection.Vertival && dimensions.maxScrollTop === 0
    || direction === ScrollBarDirection.Horizontal && dimensions.maxScrollLeft === 0);
}

/**
 * 滚动组件的滚动条组件，滚动条本身也是Layout的一个节点
 */
export default class ScrollBar extends View {
  // 当前滚动条是属于横向还是纵向
  public direction: ScrollBarDirection;

  public dimensions: IDimensions;

  // 滚动完毕后一段时间后自动隐藏
  public autoHide = true;

  // 滚动完毕后自动隐藏时间
  public autoHideTime = 2000;

  public autoHideDelayTime = 1500;

  private autoHideRemainingTime = 0;

  private innerWidth = 16;

  private isHide = false;

  private currLeft = 0;
  private currTop = 0;

  constructor({
    direction,
    dimensions,
    backgroundColor = 'rgba(162, 162, 162, 1)',
    width = 16,
  }: IScrollBarOptions) {
    const style = Object.assign({
      backgroundColor,
      position: 'absolute',
      borderRadius: width / 2,
      opacity: 0,
    }, updateStyleFromDimensions(width, direction, dimensions));

    super({
      style,
    });

    this.direction = direction;
    this.dimensions = dimensions;
    this.innerWidth = width;

    if (checkNeedHideScrollBar(direction, dimensions)) {
      this.hide();
    }
  }

  get width() {
    return this.innerWidth;
  }

  /**
   * 滚动条的粗细，因为要兼容横竖滚动，所以 style.width 在不同模式下代表的意思不一样
   * 因此通过单独的 width 属性来代表滚动条的粗细
   */
  set width(value: number) {
    if (value !== this.innerWidth) {
      this.innerWidth = value;
    }

    this.style.borderRadius = this.innerWidth / 2;
    this.setDimensions(this.dimensions);
  }

  init() {
    if (!this.root) {
      console.warn('[Layout]: please set root for scrollbar');
    } else {
      // @ts-ignore
      this.root.ticker.add(this.update, true);

      this.root.on('before_reflow', () => {
        // console.log('before_reflow')
        const { scrollLeft, scrollTop } = this.calculteScrollValue(this.currLeft, this.currTop);

        // console.log(this, scrollLeft, scrollTop)
        if (this.direction === ScrollBarDirection.Vertival) {
          this.style.top = scrollTop;
        } else {
          this.style.left = scrollLeft;
        }
      });
    }
  }

  hide() {
    this.isHide = true;
    this.style.opacity = 0;
  }

  show() {
    this.isHide = false;
    this.style.opacity = 1;
  }

  /**
   * 根据 ScrollView 容器宽高和实际内容宽高决定滚动条的位置和尺寸信息
   * 但核心需要考虑的情况是：
   * 1. 在不断地 reflow 过程中，ScrollBar 也会存在需要切换展示和隐藏的情况
   * 2. reflow 之后，ScrollBar 的位置不是简单的设置为 ScrollView 顶部和左边，还可能是滚动了一段距离后执行的 reflow
   */
  setDimensions(dimensions: IDimensions) {
    const style = updateStyleFromDimensions(this.width, this.direction, dimensions);

    Object.assign(this.style, style);

    if (checkNeedHideScrollBar(this.direction, dimensions)) {
      this.hide();
    } else if (this.isHide) {
      this.show();
    }

    this.dimensions = dimensions;

    // 已经滚动过一段距离的情况，重新计算新的滚动位置
    const { scrollLeft, scrollTop } = this.calculteScrollValue(dimensions.scrollLeft, dimensions.scrollTop);

    if (this.direction === ScrollBarDirection.Vertival) {
      this.style.top = scrollTop;
    } else {
      this.style.left = scrollLeft;
    }

    this.autoHideRemainingTime = this.autoHideTime + this.autoHideDelayTime;
  }

  calculteScrollValue(left: number, top: number) {
    let scrollLeft = 0;
    let scrollTop = 0;
    if (this.direction === ScrollBarDirection.Vertival) {
      const canScrollPercent = 1 - this.dimensions.height / this.dimensions.contentHeight;

      // 滚动条最大滚动高度
      const scrollBarMaxScrollTop = this.dimensions.height * canScrollPercent;

      const percent = top / this.dimensions.maxScrollTop;
      const percentTop = scrollBarMaxScrollTop * percent;

      scrollTop = clamp(percentTop, 0, scrollBarMaxScrollTop);
    } else {
      const canScrollPercent = 1 - this.dimensions.width / this.dimensions.contentWidth;
      const scrollBarMaxScrollLeft = this.dimensions.width * canScrollPercent;

      const percent = left / this.dimensions.maxScrollLeft;

      scrollLeft = clamp(scrollBarMaxScrollLeft * percent, 0, scrollBarMaxScrollLeft);
    }

    return { scrollLeft, scrollTop };
  }

  onScroll(left: number, top: number) {
    if (this.isHide) {
      return;
    }

    this.currLeft = left;
    this.currTop = top;
  
    const { scrollLeft, scrollTop } = this.calculteScrollValue(left, top);

    if (this.direction === ScrollBarDirection.Vertival) {
      this.layoutBox.absoluteY = this.parent!.layoutBox.originalAbsoluteY + scrollTop;
    } else {
      this.layoutBox.absoluteX = this.parent!.layoutBox.originalAbsoluteX + scrollLeft;
    }

    if (this.autoHide) {
      // this.autoHideRemainingTime = this.autoHideTime;
      this.autoHideRemainingTime = this.autoHideTime + this.autoHideDelayTime;
    }

    this.style.opacity = 1;
  }

  destroySelf() {
    // @ts-ignore
    this.root.ticker.remove(this.update, true);

    this.isDestroyed = true;
    this.root = null;
  }

  update = (dt: number) => {
    if (!this.autoHide || this.autoHideRemainingTime <= 0 || this.isHide) {
      return;
    }

    this.autoHideRemainingTime -= dt;

    if (this.autoHideRemainingTime <= this.autoHideTime) {
      this.autoHideRemainingTime = Math.max(0, this.autoHideRemainingTime);
      this.style.opacity = this.style.opacity as number * (this.autoHideRemainingTime / this.autoHideTime);
    }
  }
}

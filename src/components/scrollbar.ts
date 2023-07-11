
import View from './view';
import { clamp } from '../common/util';
import { sharedTicker } from '../common/ticker';

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
  public autoHideTime = 1000;

  private autoHideRemainingTime = 0;

  private innerWidth = 16;

  private isHide = false;

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

    sharedTicker.add(this.update, true);
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

  hide() {
    this.isHide = true;
    this.style.opacity = 0;
  }

  show() {
    this.isHide = false;
    this.style.opacity = 1;
  }

  setDimensions(dimensions: IDimensions) {
    const style = updateStyleFromDimensions(this.width, this.direction, dimensions);

    Object.assign(this.style, style);

    this.dimensions = dimensions;
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
  
    const { scrollLeft, scrollTop } = this.calculteScrollValue(left, top);

    if (this.direction === ScrollBarDirection.Vertival) {
      this.layoutBox.absoluteY = this.parent!.layoutBox.originalAbsoluteY + scrollTop;
    } else {
      this.layoutBox.absoluteX = this.parent!.layoutBox.originalAbsoluteX + scrollLeft;
    }

    if (this.autoHide) {
      this.autoHideRemainingTime = this.autoHideTime;
    }

    this.style.opacity = 1;
  }

  destroySelf() {
    sharedTicker.remove(this.update, true);
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

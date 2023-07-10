
import View from './view';
import { clamp } from '../common/util';
import { reflowAffectedStyles } from './style';

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

  private hideTimerId!: number;

  // 当前滚动条的透明度
  private opacity = 1;

  private innerWidth = 14;

  constructor({
    direction,
    dimensions,
    backgroundColor = '#a2a2a2',
    width = 14,
  }: IScrollBarOptions) {
    const isVertical = direction === ScrollBarDirection.Vertival;
    
    const { width: scrollWidth, height: scrollHeight, contentWidth, contentHeight } = dimensions;

    const style = {
      width: isVertical ? width : scrollWidth * (scrollWidth / contentWidth),
      height: isVertical ? scrollHeight * (scrollHeight / contentHeight) : width,
      backgroundColor,
      position: 'absolute',
      borderRadius: width / 2,
      left: isVertical ? scrollWidth - width : 0,
      top: isVertical ? 0 : scrollHeight - width,
    };

    super({
      style,
    });

    this.direction = direction;
    this.dimensions = dimensions;
    this.innerWidth = width;
  }

  get width() {
    return this.innerWidth;
  }

  set width(value: number) {
    if (value !== this.innerWidth) {
      this.innerWidth = value;
    }
  }

  styleChangeHandler(prop: string, val: any) {
    // console.log(prop, val);
    if (reflowAffectedStyles.indexOf(prop) > -1) {
      
    }

    const isVertical = this.direction === ScrollBarDirection.Vertival;

    if (prop === 'width' || prop === 'height') {
      
    }
  }

  hide() {
    if (this.hideTimerId) {
      return this.hideTimerId;
    }
  }

  setDimensions(dimensions: IDimensions) {
    const isVertical = this.direction === ScrollBarDirection.Vertival;
    const { width: scrollWidth, height: scrollHeight, contentWidth, contentHeight } = dimensions;

    this.style.width = isVertical ? this.width : scrollWidth * (scrollWidth / contentWidth);
    this.style.height = isVertical ? scrollHeight * (scrollHeight / contentHeight) : this.width;
    this.style.left = isVertical ? scrollWidth - this.width : 0;
    this.style.top = isVertical ? 0 : scrollHeight - this.width;

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

      scrollTop = clamp(scrollBarMaxScrollTop * percent, 0, scrollBarMaxScrollTop);
    } else {
      const canScrollPercent = 1 - this.dimensions.width / this.dimensions.contentWidth;
      const scrollBarMaxScrollLeft = this.dimensions.width * canScrollPercent;

      const percent = left / this.dimensions.maxScrollLeft;

      scrollLeft = clamp(scrollBarMaxScrollLeft * percent, 0, scrollBarMaxScrollLeft);
    }

    return { scrollLeft, scrollTop };
  }

  onScroll(left: number, top: number) {
    const { scrollLeft, scrollTop } = this.calculteScrollValue(left, top);

    if (this.direction === ScrollBarDirection.Vertival) {
      this.layoutBox.absoluteY = this.parent!.layoutBox.originalAbsoluteY + scrollTop;
    } else {
      this.layoutBox.absoluteX = this.parent!.layoutBox.originalAbsoluteX + scrollLeft;
    }
  }

  update() {
  }
}

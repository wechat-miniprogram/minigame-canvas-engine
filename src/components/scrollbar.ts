
import View from './view';
import { ILayoutBox } from './elements';

export enum ScrollBarDirection {
  Vertival,
  Horizontal,
}

interface IScrollBarOptions {
  scrollviewLayoutBox: ILayoutBox;
  direction: ScrollBarDirection;
  backgroundColor?: string;
  width?: number;
}


/**
 * 滚动组件的滚动条组件，滚动条本身也是Layout的一个节点
 */
export default class ScrollBar extends View {
  // 当前滚动条是属于横向还是纵向
  public direction: ScrollBarDirection;

  // 滚动完毕后一段时间后自动隐藏
  public autoHide = true;

  // 滚动完毕后自动隐藏时间
  public autoHideTime = 1000;

  private hideTimerId!: number;

  // 当前滚动条的透明度
  private opacity = 1;

  constructor({
    direction,
    scrollviewLayoutBox,
    backgroundColor = 'red',
    width = 14,
  }: IScrollBarOptions) {
    const style = {
      width: direction === ScrollBarDirection.Vertival ? width : scrollviewLayoutBox.width * 0.6,
      height: direction === ScrollBarDirection.Vertival ? scrollviewLayoutBox.height * 0.6 : width,
      borderRadius: width / 2,
      backgroundColor,

      position: 'absolute',
      left: direction === ScrollBarDirection.Vertival ? scrollviewLayoutBox.width - width : 0,
      top: direction === ScrollBarDirection.Vertival ? 0 : scrollviewLayoutBox.height - width,
    };

    console.log(style);
    super({
      style,
    });

    this.direction = direction;
  }

  hide() {
    if (this.hideTimerId) {
      return this.hideTimerId;
    }
  }
}


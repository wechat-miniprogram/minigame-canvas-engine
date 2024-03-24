import Text, { ITextProps } from './text';
import { lerp } from '../common/util'

export default class Button extends Text {
  // 缩放动画的时长
  public scaleDuration = 100;
  // 当前缩放动画是否播放完毕
  private scaleDone = true;
  // 缩放动画开始的时间
  private timeClick = 0;
  // 缩放动画的 scale 初始值，这并不是固定不变的，当点击结束，可能需要从大到小变换
  private fromScale = 1;
  // 缩放动画的 scale 目标值
  private toScale = 1;

  constructor({
    style = {},
    idName = '',
    className = '',
    value = '',
    dataset,
  }: ITextProps) {
    super({
      idName,
      className,
      style: {
        width: 300,
        height: 60,
        lineHeight: 60,
        fontSize: 30,
        borderRadius: 10,
        backgroundColor: '#34a123',
        color: '#ffffff',
        textAlign: 'center',
        ...style,
        ':active': {
          transform: 'scale(1.05, 1.05)',
          ...style[':active'],
        },
      },
      value,
      dataset,
    });
  }

  afterCreate() {
    // @ts-ignore
    this.root.ticker.add(this.update);
  }

  destroySelf() {
    // @ts-ignore
    this.root.ticker.remove(this.update);
    this.isDestroyed = true;
    this.root = null;
  }

  update = (dt: number) => {
    if (this.scaleDone) {
      return;
    }
    this.timeClick += dt;

    let ratio = 1;

    ratio = this.timeClick / this.scaleDuration;

    if (ratio > 1) {
      ratio = 1;
    }

    let scale = lerp(this.fromScale, this.toScale, ratio);
    let transform = `scale(${scale}, ${scale})`;
    this.style.transform = transform;

    if (ratio === 1) {
      this.scaleDone = true;
    }
  }
}

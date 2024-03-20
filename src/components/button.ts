import Text from './text';
import { IElementOptions } from './types';
import View from './view';
import { lerp } from '../common/util'
import { parseTransform } from './styleParser';
import { IStyle } from './style';
interface IButtonProps extends IElementOptions {
  value?: string;
}

export default class Button extends View {
  // 按钮的文本实例
  public label: Text;

  // 按钮当前是否可点击
  private interactableInner = true;

  // 按钮的交互操作为缩放
  private normalScaleInner = 1;
  private pressedScaleInner = 0.95;
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

  // 按钮的交互操作为图片切换
  private normalImageInner = '';
  private pressedImageInner = '';

  constructor({
    style = {},
    idName = '',
    className = '',
    value = '',
    dataset,
  }: IButtonProps) {
    super({
      idName,
      className,
      style: {
        width: 300,
        height: 60,
        borderRadius: 10,
        backgroundColor: '#34a123',
        justifyContent: 'center',
        alignItems: 'center',
        ...style,
        ':active': {
          transform: 'scale(1.05, 1.05)',
        },
      },
      dataset,
    });

    this.label = new Text({
      style: {
        color: style.color || '#ffffff',
        fontSize: style.fontSize || 30,
        // ':active': {
        //   transform: 'scale(1.05, 1.05)',
        // },
      },
      value: value || 'button',
    });

    this.appendChild(this.label);
  }

  // touchstartHandler = () => {
  //   if (!this.interactable || this.transition === Transition.NONE) {
  //     return;
  //   }

  //   if (this.transition === Transition.SCALE) {
  //     this.fromScale = this.normalScaleInner;
  //     this.toScale = this.pressedScaleInner;
  //     this.timeClick = 0;
  //     this.scaleDone = false;
  //   } else if (this.transition === Transition.COLOR) {
  //     this.style.backgroundColor = this.pressedColorInner;
  //   }
  // }

  // touchendHandler = () => {
  //   if (!this.interactable || this.transition === Transition.NONE) {
  //     return;
  //   }

  //   if (this.transition === Transition.SCALE) {
  //     this.fromScale = this.renderForLayout.scaleX || 1; // 当前的缩放值
  //     this.toScale = this.normalScaleInner;
  //     this.timeClick = 0;
  //     this.scaleDone = false;
  //   } else if (this.transition === Transition.COLOR) {
  //     this.style.backgroundColor = this.normalColorInner;
  //   }
  // }

  afterCreate() {
    this.label.root = this.root;
    // @ts-ignore
    this.root.ticker.add(this.update);
  }

  destroySelf() {
    // @ts-ignore
    this.root.ticker.remove(this.update);
    this.isDestroyed = true;
    this.children = [];
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
    this.label.style.transform = transform;

    if (ratio === 1) {
      this.scaleDone = true;
    }
  }

  /**
   * 当前按钮是否可交互，如果不可交互，点击没反应
   */
  get interactable() {
    return this.interactableInner;
  }

  set interactable(val: boolean) {
    this.interactable = val;
  }
}

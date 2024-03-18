import Text from './text';
import { IElementOptions } from './types';
import View from './view';
import { lerp } from '../common/util'
interface IButtonProps extends IElementOptions {
  value?: string;
}

/**
 * 按钮的过度类型枚举
 */
enum Transition {
  NONE,
  COLOR,
  SCALE,
  IMAGE,
}

export default class Button extends Text {
  constructor({
    style = {},
    idName = '',
    className = '',
    value = '',
    dataset,
  }: IButtonProps) {
    let defaultStyle = {
      width: 300,
      height: 60,
    }
    super({
      idName,
      className,
      style: {
        ...defaultStyle,
        borderRadius: 10,
        backgroundColor: '#34a123',
        justifyContent: 'center',
        alignItems: 'center',
        ...style,
      },
      dataset,
      value: value || 'button',
    });

    // this.label = new Text({
    //   style: {
    //     color: style.color || '#ffffff',
    //     fontSize: style.fontSize || 30,
    //     textAlign: style.textAlign || 'center',
    //     lineHeight: style.lineHeight || style.height || defaultStyle.height,
    //     verticalAlign: 'middle',
    //   },
    //   value: value || 'button',
    //   id: 100,
    // });

    // this.appendChild(this.label);

    this.on('touchstart', () => {
      this.fromScale = 1;
      this.toScale = this.scale;
      this.timeClick = 0;
      this.scaleDone = false;
    });
    this.on('touchend', () => {
      this.fromScale = this.renderForLayout.scaleX || 1;
      this.toScale = 1;
      this.timeClick = 0;
      this.scaleDone = false;
    });

    console.log(this)
  }

  public scale = 1.05;
  public scaleDuration = 100;
  private timeClick = 0;
  private scaleDone = true;
  private fromScale = 1;
  private toScale = 1;

  afterCreate() {
    // this.label.root = this.root;
    // @ts-ignore
    this.root.ticker.add(this.update);
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
    // this.label.style.transform = transform;

    if (ratio === 1) {
      this.scaleDone = true;
    }
  }

  private interactableInner = true;
  
  /**
   * 当前按钮是否可交互，如果不可交互，点击没反应
   */
  get interactable() {
    return this.interactableInner;
  }

  set interactable(val: boolean) {
    this.interactable = val;
  }

  private transitionInner = Transition.COLOR;
  get transition() {
    return this.transitionInner;
  }
  
  set transition(val: Transition) {
    this.transitionInner = val;
  }
}

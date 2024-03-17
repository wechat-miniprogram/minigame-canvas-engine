import Text from './text';
import { IElementOptions } from './types';
import View from './view';

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

export default class Button extends View {
  static Transition = Transition;

  public label: View;

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
        alignItems: 'center'
      },
      dataset,
    });

    this.label = new Text({
      style: {
        color: '#ffffff',
        fontSize: 30,
        textAlign: 'center',
      },
      value: value || 'button',
    });

    this.appendChild(this.label);

    this.on('touchstart', () => {
      this.style.transform = 'scale(1.05, 1.05)';
    });
    this.on('touchend', () => {
      this.style.transform = 'scale(1, 1)';
    });

    console.log(this);
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

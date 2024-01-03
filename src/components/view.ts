import Element from './elements';
import { IElementOptions } from './types';

export default class View extends Element {
  constructor({
    style = {},
    idName = '',
    className = '',
    dataset,
  }: IElementOptions) {
    super({
      idName,
      className,
      style,
      dataset,
    });

    this.type = 'View';
    this.ctx = null;
  }

  destroySelf() {
    this.isDestroyed = true;
    this.children = [];
    this.root = null;
  }

  render() {
    const ctx = this.ctx as CanvasRenderingContext2D;
    ctx.save();

    const { needStroke, needClip, originX, originY } = this.baseRender();

    if (needStroke) {
      ctx.stroke();
    }

    ctx.translate(-originX, -originY);

    ctx.restore();
  }

  repaint() {
    this.render();
  }
}

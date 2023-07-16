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
    const style = this.style || {};
    const box = this.layoutBox;

    const ctx = this.ctx as CanvasRenderingContext2D;

    ctx.save();

    if (style.opacity !== 1) {
      ctx.globalAlpha = style.opacity as number;
    }

    const borderWidth = style.borderWidth || 0;
    const drawX = box.absoluteX;
    const drawY = box.absoluteY;

    const borderLeftWidth = style.borderLeftWidth || borderWidth;
    const borderRightWidth = style.borderRightWidth || borderWidth;
    const borderTopWidth = style.borderTopWidth || borderWidth;
    const borderBottomWidth = style.borderBottomWidth || borderWidth;

    const { needClip, needStroke } = this.renderBorder(ctx);

    if (needClip) {
      ctx.clip();
    }

    if (style.backgroundColor) {
      ctx.fillStyle = style.backgroundColor;
      ctx.fillRect(
        drawX + borderLeftWidth,
        drawY + borderRightWidth,
        box.width - (borderLeftWidth + borderRightWidth),
        box.height - (borderTopWidth + borderBottomWidth),
      );
    }

    if (style.backgroundImage && this.backgroundImage) {
      ctx.drawImage(this.backgroundImage, drawX, drawY, box.width, box.height);
    }

    if (needStroke) {
      ctx.stroke();
    }

    ctx.restore();
  }

  repaint() {
    this.render();
  }
}

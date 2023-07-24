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
    const borderWidth = style.borderWidth || 0;
    const drawX = box.absoluteX;
    const drawY = box.absoluteY;

    ctx.save();

    if (style.opacity !== 1) {
      ctx.globalAlpha = style.opacity as number;
    }

    let originX = 0;
    let originY = 0;

    if (this.renderForLayout.rotate) {
      originX = drawX + box.width / 2;
      originY = drawY + box.height / 2;
      ctx.translate(originX, originY);
      ctx.rotate(this.renderForLayout.rotate);
    }

    const borderLeftWidth = style.borderLeftWidth || borderWidth;
    const borderRightWidth = style.borderRightWidth || borderWidth;
    const borderTopWidth = style.borderTopWidth || borderWidth;
    const borderBottomWidth = style.borderBottomWidth || borderWidth;

    const { needClip, needStroke } = this.renderBorder(ctx, originX, originY);

    if (needClip) {
      ctx.clip();
    }

    if (style.backgroundColor) {
      ctx.fillStyle = style.backgroundColor;
      ctx.fillRect(
        drawX + borderLeftWidth - originX,
        drawY + borderRightWidth - originY,
        box.width - (borderLeftWidth + borderRightWidth),
        box.height - (borderTopWidth + borderBottomWidth),
      );
    }

    if (style.backgroundImage && this.backgroundImage) {
      ctx.drawImage(this.backgroundImage, drawX - originX, drawY - originY, box.width, box.height);
    }

    if (needStroke) {
      ctx.stroke();
    }

    if (this.renderForLayout.rotate) {
      ctx.translate(-originX, -originY);
    }

    ctx.restore();
  }

  repaint() {
    this.render();
  }
}

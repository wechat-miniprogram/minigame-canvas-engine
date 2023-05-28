import { IDataset } from '../types';
import Element from './elements';
import { IStyle } from './style';

interface IViewOptions {
  style?: IStyle;
  idName?: string;
  className?: string;
  dataset?: IDataset;
}

export default class View extends Element {
  constructor({
    style = {},
    idName = '',
    className = '',
    dataset,
  }: IViewOptions) {
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

  // 有些节点仅仅作为容器，实际上不需要任何渲染逻辑，这里加个判断可以提高性能
  checkNeedRender() {
    const style = this.style || {};
    const { borderColor } = style;

    return !!(style.backgroundColor
      || (style.borderWidth && borderColor)
      || (style.borderTopWidth && (borderColor || style.borderTopColor))
      || (style.borderBottomWidth && (borderColor || style.borderBottomColor))
      || (style.borderLeftWidth && (borderColor || style.borderLeftColor))
      || (style.borderRightWidth && (borderColor || style.borderRightColor)));
  }

  render() {
    const style = this.style || {};
    const box = this.layoutBox;
    // const { ctx } = this;

    const ctx = this.ctx as CanvasRenderingContext2D;

    ctx.save();

    const borderWidth = style.borderWidth || 0;
    const drawX = box.absoluteX;
    const drawY = box.absoluteY;

    const borderLeftWidth = style.borderLeftWidth || borderWidth;
    const borderRightWidth = style.borderRightWidth || borderWidth;
    const borderTopWidth = style.borderTopWidth || borderWidth;
    const borderBottomWidth = style.borderBottomWidth || borderWidth;

    // this.renderBorder(ctx);
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

import Element from './elements.js';
import { createCanvas } from '../common/util';

export default class Canvas extends Element {
  constructor(opts) {
    const {
      style = {},
      props = {},
      idName = '',
      className = '',
      dataset,
      width = 100,
      height = 100,
    } = opts;

    super({
      props,
      idName,
      className,
      dataset,
      style,
    });

    this.canvas = createCanvas();
    this.canvas.width = Number(width);
    this.canvas.height = Number(height);

    console.log(this.canvas, width, height);

    this.canvasCtx = null;
  }

  getContext(contextType, contextAttributes) {
    if (!this.canvasCtx) {
      this.canvasCtx = this.canvas.getContext(contextType, contextAttributes);
    }

    this.root.emit('repaint');

    return this.canvasCtx;
  }

  repaint() {
    this.render();
  }

  // 子类填充实现
  destroySelf() {
    this.isDestroyed = true;
    this.root = null;
    this.canvas = null;
    this.canvasCtx = null;
  }

  render() {
    if (!this.canvasCtx) {
      return;
    }

    const style = this.style || {};
    const box = this.layoutBox;
    const { ctx } = this;

    ctx.save();

    if (style.borderColor) {
      ctx.strokeStyle = style.borderColor;
    }

    ctx.lineWidth = style.borderWidth || 0;

    const drawX = box.absoluteX;
    const drawY = box.absoluteY;

    const { needClip, needStroke } = this.renderBorder(ctx);

    if (needClip) {
      ctx.clip();
    }

    if (style.backgroundColor) {
      ctx.fillStyle = style.backgroundColor;
      ctx.fillRect(drawX, drawY, box.width, box.height);
    }

    if (style.backgroundImage && this.backgroundImage) {
      ctx.drawImage(this.backgroundImage, drawX, drawY, box.width, box.height);
    }

    ctx.drawImage(this.canvas, drawX, drawY, box.width, box.height);

    if (needStroke) {
      ctx.stroke();
    }

    ctx.restore();
  }
}

import Element from './elements';
import { createCanvas } from '../common/util';
import { IElementOptions } from './types';

interface ICanvasOptions extends IElementOptions {
  width?: number;
  height?: number;
  autoCreateCanvas?: boolean;
}

export default class Canvas extends Element {
  private canvasInstance: HTMLCanvasElement | null = null

  constructor(opts: ICanvasOptions) {
    const {
      style = {},
      idName = '',
      className = '',
      dataset,
      width = 100,
      height = 100,
      autoCreateCanvas = false,
    } = opts;

    super({
      idName,
      className,
      dataset,
      style,
    });

    /**
     * 微信小游戏场景下，sharedCanvas 实例不方便自动创建，提供 setter 手动设置
     */
    if (autoCreateCanvas) {
      this.canvasInstance = createCanvas() as HTMLCanvasElement;
      this.canvasInstance.width = Number(width);
      this.canvasInstance.height = Number(height);
    }
  }

  get canvas() {
    return this.canvasInstance;
  }

  set canvas(cvs: HTMLCanvasElement | null) {
    this.canvasInstance = cvs;
  }

  update() {
    this.root!.emit('repaint');
  }

  repaint() {
    this.render();
  }

  // 子类填充实现
  destroySelf() {
    this.isDestroyed = true;
    this.root = null;
    this.canvasInstance = null;
  }

  render() {
    if (!this.canvasInstance) {
      return;
    }

    const style = this.style || {};
    const box = this.layoutBox;
    const ctx = this.ctx as CanvasRenderingContext2D;

    ctx.save();

    if (style.opacity !== 1) {
      ctx.globalAlpha = style.opacity as number;
    }

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

    ctx.drawImage(this.canvasInstance, drawX, drawY, box.width, box.height);

    if (needStroke) {
      ctx.stroke();
    }

    ctx.restore();
  }
}

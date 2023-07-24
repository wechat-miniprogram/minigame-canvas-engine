import Element from './elements';
import imageManager from '../common/imageManager';
import { IElementOptions } from './types';

interface IImageOptions extends IElementOptions {
  src?: string;
}

export default class Image extends Element {
  private imgsrc: string;
  public type = 'Image';
  public img: HTMLImageElement | null;

  constructor(opts: IImageOptions) {
    const {
      style = {},
      idName = '',
      className = '',
      src = '',
      dataset,
    } = opts;

    super({
      idName,
      className,
      dataset,
      style,
    });

    this.imgsrc = src;

    this.img = imageManager.loadImage(this.src, (img, fromCache) => {
      if (fromCache) {
        this.img = img;
      } else {
        if (!this.isDestroyed) {
          this.img = img;
          // 当图片加载完成，实例可能已经被销毁了
          this.root?.emit('repaint');
        }
      }
    });
  }

  get src(): string {
    return this.imgsrc;
  }

  set src(newValue: string) {
    if (newValue !== this.imgsrc) {
      this.imgsrc = newValue;
      imageManager.loadImage(this.src, (img: HTMLImageElement) => {
        if (!this.isDestroyed) {
          this.img = img;
          // 当图片加载完成，实例可能已经被销毁了
          this.root?.emit('repaint');
        }
      });
    }
  }

  repaint() {
    this.render();
  }

  // 子类填充实现
  destroySelf() {
    this.isDestroyed = true;
    this.img = null;

    this.src = '';
    this.root = null;
  }

  render() {
    if (!this.img || !this.img?.complete) {
      return;
    }

    const style = this.style || {};
    const box = this.layoutBox;
    const ctx = this.ctx as CanvasRenderingContext2D;

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

    if (style.borderColor) {
      ctx.strokeStyle = style.borderColor;
    }

    ctx.lineWidth = style.borderWidth || 0;

    const { needClip, needStroke } = this.renderBorder(ctx, originX, originY);

    if (needClip) {
      ctx.clip();
    }

    if (style.backgroundColor) {
      ctx.fillStyle = style.backgroundColor;
      ctx.fillRect(drawX - originX, drawY - originY, box.width, box.height);
    }

    if (style.backgroundImage && this.backgroundImage) {
      ctx.drawImage(this.backgroundImage, drawX - originX, drawY - originY, box.width, box.height);
    }

    ctx.drawImage(this.img, drawX - originX, drawY - originY, box.width, box.height);

    if (needStroke) {
      ctx.stroke();
    }

    if (this.renderForLayout.rotate) {
      ctx.translate(-originX, -originY);
    }

    ctx.restore();
  }
}


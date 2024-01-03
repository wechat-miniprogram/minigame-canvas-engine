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

    const ctx = this.ctx as CanvasRenderingContext2D;
    ctx.save();

    const { needStroke, needClip, originX, originY, drawX, drawY, width, height } = this.baseRender();

    // 自定义渲染逻辑 开始
    ctx.drawImage(this.img, drawX - originX, drawY - originY, width, height);
    // 自定义渲染逻辑 结束

    if (needClip) {
      this.renderBorder(ctx, originX, originY);
    }

    if (needStroke) {
      ctx.stroke();
    }

    ctx.translate(-originX, -originY);

    ctx.restore();
  }
}


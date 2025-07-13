import Element from './elements';
import imageManager from '../common/imageManager';
import { IElementOptions } from './types';
import { ImageRenderer, ImageRenderMode } from '../common/imageRenderer';

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
    if (!this.img || !this.img.complete) {
      return;
    }

    const ctx = this.ctx as CanvasRenderingContext2D;
    ctx.save();

    const { needStroke, needClip, originX, originY, drawX, drawY, width, height } = this.baseRender();

    // 从 renderForLayout 中获取渲染参数（已在样式解析时校验）
    const mode = this.renderForLayout.imageType || 'simple';
    const imageInset = this.renderForLayout.imageInset;

    // 使用统一的图像渲染器
    ImageRenderer.render(ctx, {
      img: this.img,
      x: drawX - originX,
      y: drawY - originY,
      width,
      height,
      mode: mode as ImageRenderMode,
      inset: imageInset
    });

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
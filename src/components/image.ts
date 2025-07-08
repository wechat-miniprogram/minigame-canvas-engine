import Element from './elements';
import imageManager from '../common/imageManager';
import { IElementOptions } from './types';

/**
 * 图片类型
 */
export enum ImageType {
  /**
   * 普通类型
   */
  SIMPLE = 'simple',
  /**
   * 切片（九宫格）类型。
   */
  SLICED = 'sliced',
  /**
   * 平铺类型
   */
  TILED = 'tiled',
}

/**
 * 九宫格配置参数
 */
export interface IInsetParams {
  /** 左边界距离 */
  left: number;
  /** 上边界距离 */
  top: number;
  /** 右边界距离 */
  right: number;
  /** 下边界距离 */
  bottom: number;
}

interface IImageOptions extends IElementOptions {
  src?: string;
  type?: ImageType;
  /** 九宫格配置 */
  inset?: string;
}

export default class Image extends Element {
  private imgsrc: string;
  public type = 'Image';
  public img: HTMLImageElement | null;
  public imageType: ImageType = ImageType.SIMPLE;
  private insetParams?: IInsetParams;

  constructor(opts: IImageOptions) {
    const {
      style = {},
      idName = '',
      className = '',
      src = '',
      type = ImageType.SIMPLE,
      inset = '0 0 0 0',
      dataset,
    } = opts;

    super({
      idName,
      className,
      dataset,
      style,
    });

    // 解析inset参数并验证
    if (inset) {
      const values = inset.split(' ').map(Number);
      if (values.length === 4 && values.every(v => !isNaN(v) && v >= 0)) {
        const [left, top, right, bottom] = values;
        this.insetParams = {
          left,
          top,
          right,
          bottom,
        };
      } else {
        console.warn('Invalid inset parameter format. Expected: "left top right bottom"');
      }
    }

    this.imgsrc = src;
    this.imageType = type;

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

  /**
   * 设置九宫格参数
   */
  setInsetParams(params: IInsetParams) {
    // 验证参数
    if (this.validateInsetParams(params)) {
      this.insetParams = { ...params };
      this.root?.emit('repaint');
    }
  }

  /**
   * 验证九宫格参数
   */
  private validateInsetParams(params: IInsetParams): boolean {
    if (!params) return false;
    
    const { left, top, right, bottom } = params;
    
    // 检查参数是否为非负数
    if (left < 0 || top < 0 || right < 0 || bottom < 0) {
      console.warn('Inset parameters must be non-negative');
      return false;
    }
    
    // 如果有图片，检查参数是否超出图片尺寸
    if (this.img) {
      const { width: imgWidth, height: imgHeight } = this.img;
      if (left + right >= imgWidth || top + bottom >= imgHeight) {
        console.warn('Inset parameters exceed image dimensions');
        return false;
      }
    }
    
    return true;
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

    // 根据图片类型选择渲染方式
    switch (this.imageType) {
      case ImageType.SIMPLE:
        this.renderSimple(ctx, drawX, drawY, originX, originY, width, height);
        break;
      case ImageType.SLICED:
        this.renderSliced(ctx, drawX, drawY, originX, originY, width, height);
        break;
      case ImageType.TILED:
        this.renderTiled(ctx, drawX, drawY, originX, originY, width, height);
        break;
    }

    if (needClip) {
      this.renderBorder(ctx, originX, originY);
    }

    if (needStroke) {
      ctx.stroke();
    }

    ctx.translate(-originX, -originY);
    ctx.restore();
  }

  /**
   * 普通渲染
   */
  private renderSimple(ctx: CanvasRenderingContext2D, drawX: number, drawY: number, originX: number, originY: number, width: number, height: number) {
    ctx.drawImage(this.img!, drawX - originX, drawY - originY, width, height);
  }

  /**
   * 九宫格渲染 - 图像会被拉伸以适应尺寸
   */
  private renderSliced(ctx: CanvasRenderingContext2D, drawX: number, drawY: number, originX: number, originY: number, width: number, height: number) {
    if (!this.insetParams) {
      console.warn('九宫格渲染需要设置 insetParams 参数');
      this.renderSimple(ctx, drawX, drawY, originX, originY, width, height);
      return;
    }

    const { left, top, right, bottom } = this.insetParams;
    const img = this.img!;
    const imgWidth = img.width;
    const imgHeight = img.height;

    // 计算源区域尺寸
    const centerSrcWidth = imgWidth - left - right;
    const centerSrcHeight = imgHeight - top - bottom;

    // 计算目标区域尺寸
    const targetCenterWidth = Math.max(0, width - left - right);
    const targetCenterHeight = Math.max(0, height - top - bottom);

    const x = drawX - originX;
    const y = drawY - originY;

    // 1. 渲染四个角（保持原样）
    this.renderSlicedCorners(ctx, img, x, y, width, height, imgWidth, imgHeight, left, top, right, bottom);

    // 2. 渲染四条边（拉伸）
    this.renderSlicedEdges(ctx, img, x, y, width, height, imgWidth, imgHeight, left, top, right, bottom, centerSrcWidth, centerSrcHeight, targetCenterWidth, targetCenterHeight);

    // 3. 渲染中心区域（拉伸）
    if (targetCenterWidth > 0 && targetCenterHeight > 0 && centerSrcWidth > 0 && centerSrcHeight > 0) {
      ctx.drawImage(img, left, top, centerSrcWidth, centerSrcHeight,
                    x + left, y + top, targetCenterWidth, targetCenterHeight);
    }
  }

  /**
   * 平铺渲染 - 图像按原始大小重复平铺
   */
  private renderTiled(ctx: CanvasRenderingContext2D, drawX: number, drawY: number, originX: number, originY: number, width: number, height: number) {
    const img = this.img!;
    const x = drawX - originX;
    const y = drawY - originY;

    // 使用 createPattern 进行平铺渲染
    const pattern = ctx.createPattern(img, 'repeat');
    if (!pattern) return;

    ctx.save();
    
    // 设置裁剪区域
    ctx.beginPath();
    ctx.rect(x, y, width, height);
    ctx.clip();
    
    // 设置pattern并填充
    ctx.fillStyle = pattern;
    ctx.fillRect(x, y, width, height);
    
    ctx.restore();
  }

  /**
   * 渲染九宫格的四个角
   */
  private renderSlicedCorners(ctx: CanvasRenderingContext2D, img: HTMLImageElement, x: number, y: number, width: number, height: number, imgWidth: number, imgHeight: number, left: number, top: number, right: number, bottom: number) {
    // 左上角
    if (left > 0 && top > 0) {
      ctx.drawImage(img, 0, 0, left, top, x, y, left, top);
    }
    
    // 右上角
    if (right > 0 && top > 0) {
      ctx.drawImage(img, imgWidth - right, 0, right, top, 
                    x + width - right, y, right, top);
    }
    
    // 左下角
    if (left > 0 && bottom > 0) {
      ctx.drawImage(img, 0, imgHeight - bottom, left, bottom, 
                    x, y + height - bottom, left, bottom);
    }
    
    // 右下角
    if (right > 0 && bottom > 0) {
      ctx.drawImage(img, imgWidth - right, imgHeight - bottom, right, bottom,
                    x + width - right, y + height - bottom, right, bottom);
    }
  }

  /**
   * 渲染九宫格的四条边
   */
  private renderSlicedEdges(ctx: CanvasRenderingContext2D, img: HTMLImageElement, x: number, y: number, width: number, height: number, imgWidth: number, imgHeight: number, left: number, top: number, right: number, bottom: number, centerSrcWidth: number, centerSrcHeight: number, targetCenterWidth: number, targetCenterHeight: number) {
    // 上边 - 水平拉伸
    if (top > 0 && targetCenterWidth > 0) {
      ctx.drawImage(img, left, 0, centerSrcWidth, top,
                    x + left, y, targetCenterWidth, top);
    }
    
    // 下边 - 水平拉伸  
    if (bottom > 0 && targetCenterWidth > 0) {
      ctx.drawImage(img, left, imgHeight - bottom, centerSrcWidth, bottom,
                    x + left, y + height - bottom, targetCenterWidth, bottom);
    }
    
    // 左边 - 垂直拉伸
    if (left > 0 && targetCenterHeight > 0) {
      ctx.drawImage(img, 0, top, left, centerSrcHeight,
                    x, y + top, left, targetCenterHeight);
    }
    
    // 右边 - 垂直拉伸
    if (right > 0 && targetCenterHeight > 0) {
      ctx.drawImage(img, imgWidth - right, top, right, centerSrcHeight,
                    x + width - right, y + top, right, targetCenterHeight);
    }
  }
}
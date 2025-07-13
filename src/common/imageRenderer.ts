import { IInsetParams } from '../components/styleParser';

export type ImageRenderMode = 'simple' | 'sliced' | 'tiled';

export interface IImageRenderOptions {
  img: HTMLImageElement;
  x: number;
  y: number;
  width: number;
  height: number;
  mode: ImageRenderMode;
  inset?: IInsetParams;
}

/**
 * 图像渲染器 - 统一处理图像渲染逻辑
 */
export class ImageRenderer {
  /**
   * 渲染图像
   */
  static render(ctx: CanvasRenderingContext2D, options: IImageRenderOptions): void {
    const { img, x, y, width, height, mode, inset } = options;

    switch (mode) {
      case 'simple':
        ImageRenderer.renderSimple(ctx, img, x, y, width, height);
        break;
      case 'sliced':
        ImageRenderer.renderSliced(ctx, img, x, y, width, height, inset);
        break;
      case 'tiled':
        ImageRenderer.renderTiled(ctx, img, x, y, width, height);
        break;
    }
  }

  /**
   * 简单拉伸渲染
   */
  private static renderSimple(
    ctx: CanvasRenderingContext2D, 
    img: HTMLImageElement, 
    x: number, 
    y: number, 
    width: number, 
    height: number
  ): void {
    ctx.drawImage(img, x, y, width, height);
  }

  /**
   * 九宫格渲染
   */
  private static renderSliced(
    ctx: CanvasRenderingContext2D, 
    img: HTMLImageElement, 
    x: number, 
    y: number, 
    width: number, 
    height: number, 
    inset?: IInsetParams
  ): void {
    if (!inset) {
      console.warn('[Layout] sliced render need inset parameters');
      ImageRenderer.renderSimple(ctx, img, x, y, width, height);
      return;
    }

    const { left, top, right, bottom } = inset;
    const imgWidth = img.width;
    const imgHeight = img.height;

    // 计算源区域尺寸
    const centerSrcWidth = imgWidth - left - right;
    const centerSrcHeight = imgHeight - top - bottom;

    // 计算目标区域尺寸
    const targetCenterWidth = Math.max(0, width - left - right);
    const targetCenterHeight = Math.max(0, height - top - bottom);

    // 1. 渲染四个角（保持原样）
    ImageRenderer.renderCorners(ctx, img, x, y, width, height, imgWidth, imgHeight, left, top, right, bottom);

    // 2. 渲染四条边（拉伸）
    ImageRenderer.renderEdges(ctx, img, x, y, width, height, imgWidth, imgHeight, left, top, right, bottom, centerSrcWidth, centerSrcHeight, targetCenterWidth, targetCenterHeight);

    // 3. 渲染中心区域（拉伸）
    if (targetCenterWidth > 0 && targetCenterHeight > 0 && centerSrcWidth > 0 && centerSrcHeight > 0) {
      ctx.drawImage(img, left, top, centerSrcWidth, centerSrcHeight,
                    x + left, y + top, targetCenterWidth, targetCenterHeight);
    }
  }

  /**
   * 平铺渲染
   */
  private static renderTiled(
    ctx: CanvasRenderingContext2D, 
    img: HTMLImageElement, 
    x: number, 
    y: number, 
    width: number, 
    height: number
  ): void {
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
  private static renderCorners(
    ctx: CanvasRenderingContext2D, 
    img: HTMLImageElement, 
    x: number, 
    y: number, 
    width: number, 
    height: number, 
    imgWidth: number, 
    imgHeight: number, 
    left: number, 
    top: number, 
    right: number, 
    bottom: number
  ): void {
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
  private static renderEdges(
    ctx: CanvasRenderingContext2D, 
    img: HTMLImageElement, 
    x: number, 
    y: number, 
    width: number, 
    height: number, 
    imgWidth: number, 
    imgHeight: number, 
    left: number, 
    top: number, 
    right: number, 
    bottom: number, 
    centerSrcWidth: number, 
    centerSrcHeight: number, 
    targetCenterWidth: number, 
    targetCenterHeight: number
  ): void {
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
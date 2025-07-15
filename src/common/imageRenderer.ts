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

    // 先检查原始inset值是否合法
    if (left < 0 || top < 0 || right < 0 || bottom < 0) {
      console.warn('[Layout] inset values cannot be negative, fallback to simple render');
      ImageRenderer.renderSimple(ctx, img, x, y, width, height);
      return;
    }

    if (left + right >= imgWidth || top + bottom >= imgHeight) {
      console.warn(`[Layout] inset values too large for image size (${imgWidth}x${imgHeight}), fallback to simple render`);
      ImageRenderer.renderSimple(ctx, img, x, y, width, height);
      return;
    }

    // 确保inset值不超过图片尺寸（此时已经验证过合法性）
    const safeLeft = Math.min(left, imgWidth);
    const safeTop = Math.min(top, imgHeight);
    const safeRight = Math.min(right, imgWidth);
    const safeBottom = Math.min(bottom, imgHeight);

    // 计算源区域尺寸
    const centerSrcWidth = imgWidth - safeLeft - safeRight;
    const centerSrcHeight = imgHeight - safeTop - safeBottom;

    // 计算目标区域尺寸
    const targetCenterWidth = Math.max(0, width - safeLeft - safeRight);
    const targetCenterHeight = Math.max(0, height - safeTop - safeBottom);

    // 1. 渲染四个角（保持原样）
    ImageRenderer.renderCorners(ctx, img, x, y, width, height, imgWidth, imgHeight, safeLeft, safeTop, safeRight, safeBottom);

    // 2. 渲染四条边（拉伸）
    ImageRenderer.renderEdges(ctx, img, x, y, width, height, imgWidth, imgHeight, safeLeft, safeTop, safeRight, safeBottom, centerSrcWidth, centerSrcHeight, targetCenterWidth, targetCenterHeight);

    // 3. 渲染中心区域（拉伸）
    if (targetCenterWidth > 0 && targetCenterHeight > 0 && centerSrcWidth > 0 && centerSrcHeight > 0) {
      ctx.drawImage(img, safeLeft, safeTop, centerSrcWidth, centerSrcHeight,
        x + safeLeft, y + safeTop, targetCenterWidth, targetCenterHeight);
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
    const imgWidth = img.width;
    const imgHeight = img.height;

    ctx.save();

    // 设置裁剪区域
    ctx.beginPath();
    ctx.rect(x, y, width, height);
    ctx.clip();

    // 预计算完整块和边界块的数量，避免重复计算
    const fullCols = Math.ceil(width / imgWidth);
    const fullRows = Math.ceil(height / imgHeight);

    // 绘制所有的块，无需考虑边界
    for (let row = 0; row < fullRows; row++) {
      const drawY = y + row * imgHeight;
      for (let col = 0; col < fullCols; col++) {
        const drawX = x + col * imgWidth;
        ctx.drawImage(img, drawX, drawY);
      }
    }

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
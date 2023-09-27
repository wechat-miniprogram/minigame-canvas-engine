import Element from './elements';
import env from '../env'
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
      this.canvasInstance = env.createCanvas() as HTMLCanvasElement;
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

    const ctx = this.ctx as CanvasRenderingContext2D;
    ctx.save();

    const { needStroke, originX, originY, drawX, drawY, width, height } = this.baseRender();

    // 自定义渲染逻辑 开始
    ctx.drawImage(this.canvasInstance, drawX - originX, drawY - originY, width, height);
    // 自定义渲染逻辑 结束

    if (needStroke) {
      ctx.stroke();
    }

    if (this.renderForLayout.rotate) {
      ctx.translate(-originX, -originY);
    }

    ctx.restore();
  }
}

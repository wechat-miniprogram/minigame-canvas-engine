import Element from './elements';
import Pool from '../common/pool';
import BitMapFont from '../common/bitMapFont';
import { IElementOptions } from './types';

const bitMapPool = new Pool<BitMapFont>('bitMapPool');

interface IBitMapTextOptions extends IElementOptions {
  value?: string;
  font?: string;
}

export default class BitMapText extends Element {
  public ctx: CanvasRenderingContext2D | null;
  public type = 'BitMapText';
  private valuesrc: string;
  public font: BitMapFont;

  constructor(opts: IBitMapTextOptions) {
    const {
      style = {},
      idName = '',
      className = '',
      value = '',
      font = '',
      dataset,
    } = opts;
    super({
      idName,
      className,
      style,
      dataset,
    });

    this.ctx = null;
    this.valuesrc = value;

    this.font = bitMapPool.get(font);
    if (!this.font) {
      console.error(`Missing BitmapFont "${font}", please invoke API "registBitMapFont" before using "BitMapText"`);
    }
  }

  get value(): string {
    return this.valuesrc;
  }

  set value(newValue: string) {
    if (newValue !== this.valuesrc) {
      this.valuesrc = newValue;

      this.emit('repaint');
    }
  }

  repaint() {
    this.render();
  }

  destroySelf() {
    this.root = null;
  }

  render() {
    if (!this.font) {
      return;
    }

    if (this.font.ready) {
      this.renderText(this.ctx as CanvasRenderingContext2D);
    } else {
      this.font.event.on('text__load__done', () => {
        if (!this.isDestroyed) {
          this.renderText(this.ctx as CanvasRenderingContext2D);
        }
      });
    }
  }

  getTextBounds() {
    const { style } = this;

    const { letterSpacing = 0 } = style;
    let width = 0;

    for (let i = 0, len = this.value.length; i < len; i++) {
      const char = this.value[i];
      const cfg = this.font.chars[char];
      if (cfg) {
        width += cfg.w;

        if (i < len - 1) {
          width += letterSpacing;
        }
      }
    }

    return { width, height: this.font.lineHeight };
  }

  renderText(ctx: CanvasRenderingContext2D) {
    const bounds = this.getTextBounds();
    const defaultLineHeight = this.font.lineHeight as number;

    ctx.save();

    let { needStroke, originX, originY, drawX, drawY } = this.baseRender();

    const { style } = this;

    const {
      width = 0, // 没有设置采用计算出来的宽度
      height = 0, // 没有设置则采用计算出来的宽度
      textAlign, // 文字左右对齐方式
      verticalAlign,
      letterSpacing = 0,
    } = style;
    // 没有设置则采用计算出来的高度
    const lineHeight = (style.lineHeight || defaultLineHeight) as number

    const scaleY = lineHeight / defaultLineHeight;
    const realWidth = scaleY * bounds.width;

    // 如果文字的渲染区域高度小于盒子高度，采用对齐方式
    if (lineHeight < height) {
      if (verticalAlign === 'middle') {
        drawY += (height - lineHeight) / 2;
      } else if (verticalAlign === 'bottom') {
        drawY = drawY + height - lineHeight;
      }
    }

    if (width > realWidth) {
      if (textAlign === 'center') {
        drawX += (width - realWidth) / 2;
      } else if (textAlign === 'right') {
        drawY += (width - realWidth);
      }
    }

    // 记录上一个字符，方便处理 kerning
    let prevCharCode = null;

    for (let i = 0; i < this.value.length; i++) {
      const char = this.value[i];
      const cfg = this.font.chars[char];

      if (prevCharCode && cfg.kerning[prevCharCode]) {
        drawX += cfg.kerning[prevCharCode];
      }

      if (cfg) {
        ctx.drawImage(
          this.font.texture as HTMLImageElement,
          cfg.x,
          cfg.y,
          cfg.w,
          cfg.h,
          drawX + cfg.offX * scaleY - originX,
          drawY + cfg.offY * scaleY - originY,
          cfg.w * scaleY,
          cfg.h * scaleY,
        );

        drawX += (cfg.xadvance * scaleY + letterSpacing);

        prevCharCode = char;
      }
    }

    if (needStroke) {
      ctx.stroke();
    }

    ctx.translate(-originX, -originY);

    ctx.restore();
  }
}

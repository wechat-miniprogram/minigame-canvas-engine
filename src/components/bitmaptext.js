import Element from './elements.js';
import Pool from '../common/pool';

const bitMapPool = new Pool('bitMapPool');

export default class BitMapText extends Element {
  constructor(opts) {
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

    this.type = 'BitMapText';
    this.ctx  = null;
    this.valuesrc = value;

    Object.defineProperty(this, 'value', {
      get() {
        return this.valuesrc;
      },
      set(newValue) {
        if (newValue !== this.valuesrc) {
          this.valuesrc = newValue;

          this.emit('repaint');
        }
      },
      enumerable: true,
      configurable: true,
    });

    this.font = bitMapPool.get(font);
    if (!this.font) {
      console.error(`Missing BitmapFont "${font}", please invoke API "registBitMapFont" before using "BitMapText"`);
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
      this.renderText(this.ctx);
    } else {
      this.font.event.on('text__load__done', () => {
        if (!this.isDestroyed) {
          this.renderText(this.ctx);
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

  renderText(ctx) {
    const bounds = this.getTextBounds();
    const defaultLineHeight = this.font.lineHeight;

    ctx.save();

    const { needClip, needStroke } = this.renderBorder(ctx);

    if (needClip) {
      ctx.clip();
    }

    const box = this.layoutBox;
    const { style } = this;

    const {
      width, // 没有设置采用计算出来的宽度
      height, // 没有设置则采用计算出来的宽度
      lineHeight = defaultLineHeight, // 没有设置则采用计算出来的高度
      textAlign, // 文字左右对齐方式
      verticalAlign,
      letterSpacing = 0,
    } =  style;

    // 元素包围盒的左上角坐标
    let x = box.absoluteX;
    let y = box.absoluteY;

    const scaleY    = lineHeight / defaultLineHeight;
    const realWidth = scaleY * bounds.width;

    if (style.backgroundColor) {
      ctx.fillStyle = style.backgroundColor;
      ctx.fillRect(x, y, box.width, box.height);
    }

    if (style.backgroundImage && this.backgroundImage) {
      ctx.drawImage(this.backgroundImage, x, y, box.width, box.height);
    }

    // 如果文字的渲染区域高度小于盒子高度，采用对齐方式
    if (lineHeight < height) {
      if (verticalAlign === 'middle') {
        y += (height - lineHeight) / 2;
      } else if (verticalAlign === 'bottom') {
        y = y + height - lineHeight;
      }
    }

    if (width > realWidth) {
      if (textAlign === 'center') {
        x += (width - realWidth) / 2;
      } else if (textAlign === 'right') {
        x += (width - realWidth);
      }
    }

    // 记录上一个字符，方便处理 kerning
    let prevCharCode = null;


    for (let i = 0; i < this.value.length; i++) {
      const char = this.value[i];
      const cfg = this.font.chars[char];

      if (prevCharCode && cfg.kerning[prevCharCode]) {
        x += cfg.kerning[prevCharCode];
      }

      if (cfg) {
        ctx.drawImage(
          this.font.texture,
          cfg.x,
          cfg.y,
          cfg.w,
          cfg.h,
          x + cfg.offX * scaleY,
          y + cfg.offY * scaleY,
          cfg.w * scaleY,
          cfg.h * scaleY,
        );

        x += (cfg.xadvance * scaleY + letterSpacing);

        prevCharCode = char;
      }
    }

    if (needStroke) {
      ctx.stroke();
    }

    ctx.restore();
  }
}


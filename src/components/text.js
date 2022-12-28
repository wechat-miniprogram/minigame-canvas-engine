import Element from './elements.js';
import { createCanvas } from '../common/util.js';

const DEFAULT_FONT_FAMILY = 'PingFangSC-Regular, sans-serif';
let context = null;
const getContext = () => {
  if (context) {
    return context;
  }

  const canvas = createCanvas();
  canvas.width = 1;
  canvas.height = 1;
  context = canvas.getContext('2d');

  return context;
};


function getTextWidth(style, value) {
  const context = getContext();

  context.font = `${style.fontWeight || 'normal'} ${style.fontSize || 12}px ${style.fontFamily || DEFAULT_FONT_FAMILY}`;

  return context.measureText(value).width || 0;
}

function getTextWidthWithoutSetFont(value) {
  return getContext().measureText(value).width || 0;
}

function parseText(style, value) {
  value = String(value);

  let maxWidth = style.width;
  const wordWidth = getTextWidth(style, value);

  // 对文字溢出的处理，默认用...
  const textOverflow = style.textOverflow || 'ellipsis';

  // 文字最大长度不超限制
  if (wordWidth <= maxWidth) {
    return value;
  }

  // 对于用点点点处理的情况，先将最大宽度减去...的宽度
  if (textOverflow === 'ellipsis') {
    maxWidth -= getTextWidthWithoutSetFont('...');
  }

  let length = value.length - 1;
  let str = value.substring(0, length);

  while (getTextWidthWithoutSetFont(str) > maxWidth && length > 0) {
    length -= 1;
    str = value.substring(0, length);
  }

  return (length && textOverflow === 'ellipsis'
    ? `${str}...`
    : str);
}


export default class Text extends Element {
  constructor({
    style = {},
    props = {},
    idName = '',
    className = '',
    value = '',
    dataset,
  }) {
    // 没有设置宽度的时候通过canvas计算出文字宽度
    if (style.width === undefined) {
      style.width = getTextWidth(style, value);
    } else if (style.textOverflow === 'ellipsis') {
      value = parseText(style, value);
    }

    super({
      props,
      idName,
      className,
      style,
      dataset,
    });

    this.type = 'Text';
    this.ctx = null;
    this.valuesrc = value;

    this.renderBoxes = [];

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
  }

  toCanvasData() {
    const style = this.style || {};

    this.fontSize = style.fontSize || 12;
    this.textBaseline = 'top';
    this.font = `${style.fontWeight || ''} ${style.fontSize || 12}px ${DEFAULT_FONT_FAMILY}`;
    this.textAlign = style.textAlign || 'left';
    this.fillStyle = style.color || '#000';
  }

  insert(ctx, box) {
    this.renderBoxes.push({ ctx, box });

    this.render(ctx, box);
  }

  repaint() {
    this.renderBoxes.forEach((item) => {
      this.render(item.ctx, item.box);
    });
  }

  destroySelf() {
    this.root = null;
  }

  render(ctx, layoutBox) {
    this.toCanvasData();
    ctx.save();

    const box = layoutBox || this.layoutBox;
    const { style } = this;

    ctx.textBaseline = this.textBaseline;
    ctx.font = this.font;
    ctx.textAlign = this.textAlign;

    let drawX = box.absoluteX;
    let drawY = box.absoluteY;

    const { needClip, needStroke } = this.renderBorder(ctx, layoutBox);

    if (needClip) {
      ctx.clip();
    }

    if (style.backgroundColor) {
      ctx.fillStyle = style.backgroundColor;
      ctx.fillRect(drawX, drawY, box.width, box.height);
    }

    if (needStroke) {
      ctx.stroke();
    }

    ctx.fillStyle = this.fillStyle;

    if (this.textAlign === 'center') {
      drawX += box.width / 2;
    } else if (this.textAlign === 'right') {
      drawX += box.width;
    }

    if (style.lineHeight) {
      ctx.textBaseline = 'middle';
      drawY += style.lineHeight / 2;
    }

    ctx.fillText(
      this.value,
      drawX,
      drawY,
    );

    ctx.restore();
  }
}

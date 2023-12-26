import Element from './elements';
import { IStyle } from './style';
import { IElementOptions } from './types';
import env from '../env'

const DEFAULT_FONT_FAMILY = 'sans-serif';
let context: CanvasRenderingContext2D | null = null;

const getContext = (): CanvasRenderingContext2D => {
  if (context) {
    return context;
  }

  const canvas = env.createCanvas();
  canvas.width = 1;
  canvas.height = 1;
  context = canvas.getContext('2d') as CanvasRenderingContext2D;

  return context;
};

function getTextWidth(style: IStyle, value: string) {
  const context = getContext();

  context.font = `${style.fontWeight || 'normal'} ${style.fontSize || 12}px ${style.fontFamily || DEFAULT_FONT_FAMILY}`;

  return context.measureText(value).width || 0;
}

function getTextWidthWithoutSetFont(value: string) {
  return getContext().measureText(value).width || 0;
}

function parseText(style: IStyle, value: string): string {
  value = String(value);

  let maxWidth = style.width as number;
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

interface ITextProps extends IElementOptions {
  value?: string;
}

export default class Text extends Element {
  private valuesrc = '';
  private originStyleWidth: number | string | undefined;
  public fontSize?: number;
  public textBaseline: CanvasTextBaseline = 'bottom';
  public font = '';
  public textAlign: CanvasTextAlign = 'left';
  public fillStyle = '#000000';

  constructor({
    style = {},
    idName = '',
    className = '',
    value = '',
    dataset,
  }: ITextProps) {
    let originStyleWidth = style.width;
    // 没有设置宽度的时候通过canvas计算出文字宽度
    if (originStyleWidth === undefined) {
      style.width = getTextWidth(style, value);
    } else if (style.textOverflow === 'ellipsis') {
      value = parseText(style, value);
    }

    if (style.height === undefined) {
      style.height = style.lineHeight as number || style.fontSize || 12;
    }
    super({
      idName,
      className,
      style,
      dataset,
    });

    this.type = 'Text';
    this.ctx = null;
    this.valuesrc = value;
    this.originStyleWidth = originStyleWidth;
  }

  get value() {
    return this.valuesrc;
  }

  set value(newValue) {
    if (newValue !== this.valuesrc) {
      if (this.originStyleWidth === undefined) {
        this.style.width = getTextWidth(this.style, newValue);
      } else if (this.style.textOverflow === 'ellipsis') {
        newValue = parseText(this.style, newValue);
      }

      this.valuesrc = newValue;

      this.isDirty = true;
      let { parent } = this;
      while (parent) {
        parent.isDirty = true;
        parent = parent.parent;
      }
    }
  }

  toCanvasData() {
    const style = this.style || {};

    this.fontSize = style.fontSize || 12;
    this.textBaseline = 'top';
    this.font = `${style.fontWeight || ''} ${style.fontSize || 12}px ${style.fontFamily || DEFAULT_FONT_FAMILY}`;
    this.textAlign = style.textAlign || 'left';
    this.fillStyle = style.color || '#000';
  }

  repaint() {
    this.render();
  }

  destroySelf() {
    this.root = null;
  }

  insert(ctx: CanvasRenderingContext2D, needRender: boolean) {
    this.ctx = ctx;
    this.shouldUpdate = false;

    this.toCanvasData();

    if (needRender) {
      this.render();
    }
  }


  render() {
    const style = this.style;
    const ctx = this.ctx as CanvasRenderingContext2D;
    ctx.save();

    let { needStroke, originX, originY, drawX, drawY, width, height } = this.baseRender();

    ctx.textBaseline = this.textBaseline;
    ctx.font = this.font;
    ctx.textAlign = this.textAlign;

    if (needStroke) {
      ctx.stroke();
    }

    ctx.fillStyle = this.fillStyle;

    if (this.textAlign === 'center') {
      drawX += width / 2;
    } else if (this.textAlign === 'right') {
      drawX += width;
    }

    if (style.lineHeight) {
      ctx.textBaseline = 'middle';
      drawY += (style.lineHeight as number) / 2;
    }

    ctx.fillText(
      this.value,
      drawX - originX,
      drawY - originY,
    );

    ctx.translate(-originX, -originY);

    ctx.restore();
  }
}

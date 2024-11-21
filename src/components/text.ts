import Element, { StyleOpType, setDirty } from './elements';
import { IStyle } from './style';
import { IElementOptions } from './types';
import env from '../env'
import { isValidTextShadow, ITextRenderForLayout } from './styleParser';

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

export interface ITextProps extends IElementOptions {
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

  protected renderForLayout: ITextRenderForLayout = {};
  
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

    if (style.textShadow) {
      this.parseTextShadow(style.textShadow);
    }
  }

  styleChangeHandler(prop: string, styleOpType: StyleOpType, val?: any) {
    if (prop === 'textShadow') {
      if (styleOpType === StyleOpType.Set) {
        this.parseTextShadow(val);
      } else {
        this.renderForLayout.textShadows = null;
      }
    }
  }

  private parseTextShadow(textShadow: string) {
    if (!isValidTextShadow(textShadow)) {
      console.error(`[Layout]: ${textShadow} is not a valid textShadow`);
    } else {
      // 解析 text-shadow 字符串
      this.renderForLayout.textShadows = textShadow.split(',').map(shadow => {
        const parts = shadow.trim().split(/\s+/);
        const offsetX = parseFloat(parts[0]);
        const offsetY = parseFloat(parts[1]);
        const blurRadius = parseFloat(parts[2]);
        const color = parts[3];

        return { offsetX, offsetY, blurRadius, color };
      });
    }
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

      setDirty(this, 'value change');
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

    // this.toCanvasData();

    if (needRender) {
      this.render();
    }
  }

  render() {
    const style = this.style;
    const ctx = this.ctx as CanvasRenderingContext2D;
    ctx.save();

    this.toCanvasData();

    let { needStroke, originX, originY, drawX, drawY, width, height } = this.baseRender('test');
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

    // 纹理文字描边
    if (style.textStrokeColor) {
      ctx.lineWidth = style.textStrokeWidth || 1;
      ctx.strokeStyle = style.textStrokeColor as string;

      ctx.strokeText(
        this.value,
        drawX - originX,
        drawY - originY,
      );
    }

    // 处理文字阴影
    if (this.renderForLayout.textShadows) {
      this.renderForLayout.textShadows.forEach(({ offsetX, offsetY, blurRadius, color }) => {
        ctx.shadowOffsetX = offsetX;
        ctx.shadowOffsetY = offsetY;
        ctx.shadowBlur = blurRadius;
        ctx.shadowColor = color;
        ctx.fillText(
          this.value,
          drawX - originX,
          drawY - originY,
        );
      });
    } else {
      ctx.fillText(
        this.value,
        drawX - originX,
        drawY - originY,
      );  
    }

    ctx.translate(-originX, -originY);

    ctx.restore();
  }
}

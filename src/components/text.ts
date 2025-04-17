import Element, { StyleOpType, setDirty } from './elements';
import { IElementOptions } from './types';
import { isValidTextShadow, ITextRenderForLayout } from './styleParser';
import { parseText, parseTextHeight, IOriginSomeStyleInfo } from './textParser';

const DEFAULT_FONT_FAMILY = 'sans-serif';

export interface ITextProps extends IElementOptions {
  value?: string;
}

export default class Text extends Element {
  private valuesrc = '';
  private parsedValue: string[] = [];
  private originSomeStyleInfo: IOriginSomeStyleInfo;
  
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
    super({
      idName,
      className,
      style,
      dataset,
    });

    this.type = 'Text';
    this.ctx = null;
    this.valuesrc = value;

    this.originSomeStyleInfo = {
      width: style.width,
      height: style.height,
      lineHeight: style.lineHeight,
    }

    // 文本解析
    this.parsedValue = parseText(style, this.originSomeStyleInfo, value);
    parseTextHeight(style, this.originSomeStyleInfo,this.parsedValue);

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
      this.valuesrc = newValue;

      this.parsedValue = parseText(this.style, this.originSomeStyleInfo, newValue);
      parseTextHeight(this.style, this.originSomeStyleInfo, this.parsedValue);

      setDirty(this, 'value change');
    }
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


    if (needRender) {
      this.render();
    }
  }

  render(): void {
    if (!this.ctx) {
      return;
    }

    const style = this.style;
    const ctx = this.ctx;

    ctx.save();

    // 调用基类的渲染方法
    const { needStroke, originX, originY, drawX, drawY, width, height } = this.baseRender();

    // 设置文字渲染属性
    const fontSize = style.fontSize || 12;
    const lineHeight = (style.lineHeight as number) || fontSize;
    ctx.font = `${style.fontWeight || 'normal'} ${fontSize}px ${style.fontFamily || DEFAULT_FONT_FAMILY}`;
    ctx.textBaseline = 'middle';
    ctx.textAlign = style.textAlign || 'left';
    ctx.fillStyle = style.color || '#000000';

    // 处理文字换行
    const lines = this.parsedValue;
    let y = drawY - originY;

    // 垂直对齐方式处理，totalHeight 代表文字实际占用的高度
    const totalHeight = lines.length * lineHeight;

    if (style.verticalAlign === 'middle') {
      y += height / 2; // 先移动到容器中心
      y -= (totalHeight - lineHeight) / 2; // 再减去多行文本的一半高度(不包括第一行)
    } else if (style.verticalAlign === 'bottom') {
      y += height; // 移动到容器底部
      y -= totalHeight - lineHeight / 2; // 减去文本总高度，但保留半行
    } else {
      // top alignment
      y += lineHeight / 2; // 只需要移动半个行高，因为使用了 middle 基线
    }

    // 渲染每一行文字
    lines.forEach((line, index) => {
      let x = drawX - originX;

      // 水平对齐方式处理
      if (style.textAlign === 'center') {
        x += width / 2;
      } else if (style.textAlign === 'right') {
        x += width;
      }

      const currentY = y + lineHeight * index;

      // 渲染文字阴影
      if (this.renderForLayout.textShadows) {
        this.renderForLayout.textShadows.forEach((shadow) => {
          ctx.save();
          ctx.shadowOffsetX = shadow.offsetX;
          ctx.shadowOffsetY = shadow.offsetY;
          ctx.shadowBlur = shadow.blurRadius;
          ctx.shadowColor = shadow.color;
          ctx.fillText(line, x, currentY);
          ctx.restore();
        });
      }

      // 渲染文字描边
      if (style.textStrokeWidth && style.textStrokeColor) {
        ctx.strokeStyle = style.textStrokeColor;
        ctx.lineWidth = style.textStrokeWidth;
        ctx.strokeText(line, x, currentY);
      }

      // 渲染文字
      ctx.fillText(line, x, currentY);
    });

    if (needStroke) {
      ctx.stroke();
    }

    ctx.restore();
  }
}

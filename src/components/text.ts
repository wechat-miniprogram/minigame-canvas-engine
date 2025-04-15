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

function truncateText(style: IStyle, value: string, maxWidth: number): string {
  if (style.textOverflow !== 'ellipsis') {
    return value;
  }

  maxWidth -= getTextWidthWithoutSetFont('...');
  let length = value.length - 1;
  let str = value.substring(0, length);

  while (getTextWidthWithoutSetFont(str) > maxWidth && length > 0) {
    length -= 1;
    str = value.substring(0, length);
  }

  return length ? `${str}...` : str;
}

function truncateTextPure(value: string, maxWidth: number): string {
  let length = value.length;
  let str = value.substring(0, length);

  while (getTextWidthWithoutSetFont(str) > maxWidth && length > 0) {
    length -= 1;
    str = value.substring(0, length);
  }

  return str
}

/**
 * 文字解析器
 */
function parseText(style: IStyle, value: string): string {
  value = String(value);

  console.log('origin value', value)

  /**
   * 没有设置宽度的时候通过canvas计算出文字宽度，文字不会自动换行
   * TODO: 原则上来讲，没有设置宽度文字应该也是可以根据父容器的剩余宽度自动换行的，但这样会非常复杂，而且在初始化的时候，文字还不了解父容器和兄弟
   * 容器的状态，所以这里先简单处理。
   */
  if (style.width === undefined) {
    style.width = getTextWidth(style, value);
    
    return value;
  }

  // 初步计算文字的总长度
  const wordWidth = getTextWidth(style, value);
  let maxWidth = style.width as number;

  // 如果设置了超出省略号处理，进行截断处理
  if (style.textOverflow === 'ellipsis' && wordWidth > maxWidth) {
    return truncateText(style, value, maxWidth);
  }
  
  style.whiteSpace = style.whiteSpace || 'normal';
  // 处理空白符
  if (style.whiteSpace === 'pre' || style.whiteSpace === 'pre-wrap' || style.whiteSpace === 'pre-line') {
    // 保留换行符
    value = value.replace(/\r\n|\r|\n/g, '\n');
  } else {
    // 合并空白符( whiteSpace 是 normal 或者缺省）
    value = value.replace(/\s+/g, ' ');
  }

  // 如果设置了不换行，直接返回
  if (style.whiteSpace === 'nowrap') {
    return value;
  }

  // 处理需要换行的情况
  const words = splitIntoWords(value, style);

  console.log('words', words)
  const lines: string[] = [];
  let currentLine = '';
  let currentWidth = 0;

  for (const word of words) {
    // 计算每个分词宽度
    const wordWidth = getTextWidth(style, word);
    
    // 如果当前行为空且单词宽度超过最大宽度
    if (!currentLine && wordWidth > maxWidth) {
      if (style.wordBreak === 'break-all' || style.overflowWrap === 'break-word') {
        let remainingWord = word;
        let truncated = '';

        while (remainingWord) {
          truncated = truncateTextPure(remainingWord, maxWidth);
          lines.push(truncated); 
          remainingWord = remainingWord.slice(truncated.length);
        }
        console.log('truncated1', truncated)
      } else if (style.whiteSpace === 'normal') {
        let remainingWord = word;
        let truncated = '';

        while (remainingWord) {
          truncated = truncateTextPure(remainingWord, maxWidth);
          console.log('truncated', truncated)
          lines.push(truncated);
          remainingWord = remainingWord.slice(truncated.length);
        }

        console.log('truncated', truncated)
      } else {
        // 其他情况（pre-wrap等），即使超出也只能作为一行
        lines.push(word);
        currentLine = '';
        currentWidth = 0;
      }

      continue;
    }
    
    if (currentWidth + wordWidth <= maxWidth) {
      currentLine += word;
      currentWidth += wordWidth;
    } else {
      if (currentLine) {
        lines.push(currentLine);
      }
      currentLine = word;
      currentWidth = wordWidth;
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines.join('\n');
}

function splitIntoWords(text: string, style: IStyle): string[] {
  if (style.wordBreak === 'break-all') {
    return text.split('');
  }
  
  // 根据空格分词，保留空格
  return text.match(/\S+|\s+/g) || [];
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
    value = parseText(style, value);

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
    this.originStyleWidth = style.width;

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
      } else if (this.style.whiteSpace === 'pre-wrap' || this.style.whiteSpace === 'normal' || this.style.textOverflow === 'ellipsis') {
        // 需要换行或设置了省略号时，都需要处理文本
        newValue = parseText(this.style, newValue);
      }

      this.valuesrc = newValue;
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
    const lines = this.value.split('\n');
    let y = drawY - originY;

    // 垂直对齐方式处理
    const totalHeight = lines.length * lineHeight;
    
    if (style.verticalAlign === 'middle' || style.lineHeight) {
      // 如果设置了 lineHeight 或要求垂直居中，则居中对齐
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

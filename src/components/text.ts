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

/**
 * 判断文本是否包含 CJK（中日韩）字符
 * @param text 要检查的文本
 * @returns 是否包含 CJK 字符
 */
const isCJKText = (text: string): boolean => {
  // 匹配中文、日文、韩文的 Unicode 范围
  return /[\u4e00-\u9fa5\u3040-\u30ff\u3400-\u4dbf]/.test(text);
};

/**
 * 文字解析器
 * 一些知识点：
 * 1. \s 匹配一个空白字符，包括空格、制表符、换页符和换行符。
 * 2. \r 匹配一个回车符 (U+000D)。
 * 3. \n 匹配一个换行符 (U+000A)。
 * 4. \S 匹配一个非空白字符。
 */
function parseText(style: IStyle, value: string): string {
  value = String(value);

  // 1. 首先处理空白符和换行符
  const whiteSpace = style.whiteSpace || 'normal';
  
  // 根据 whiteSpace 处理空白符和换行符
  switch (whiteSpace) {
    case 'pre':
      /**
       * 连续的空白符会被保留。仅在遇到换行符时才会换行，这里统一换行符格式
       * 这里对字符的初步处理跟 pre-warp 是一样的，实际的分行处理上，pre 只有遇到分行符才会分行
       * 而 pre-wrap 除了换行符，正常的文本过长也能够自动进行换行
       */
      value = value.replace(/\r\n|\r/g, '\n');
      break;
    case 'pre-wrap':
      // 连续的空白符会被保留。在遇到换行符时根据填充行框盒子的需要换行。
      value = value.replace(/\r\n|\r/g, '\n');
      break;
    case 'pre-line':
      // 合并空白符，保留换行符
      value = value.replace(/[^\S\n]+/g, ' ')  // 合并空白符（不包括换行符）
                   .replace(/\r\n|\r/g, '\n')   // 统一换行符
                   .replace(/ \n/g, '\n')       // 删除换行符前的空格
                   .replace(/\n /g, '\n');      // 删除换行符后的空格
      break;
    case 'nowrap':
      // nowrap的空白符处理会在后面统一处理
      break;
    case 'normal':
    default:
      // 合并所有空白符
      value = value.replace(/\s+/g, ' ');
      break;
  }

  // 2. 如果没有设置宽度，直接返回处理后的文本
  if (style.width === undefined) {
    style.width = getTextWidth(style, value);
    return value;
  }

  const maxWidth = style.width as number;

  // 3. 如果设置了省略号，强制在一行显示
  if (style.textOverflow === 'ellipsis') {
    value = value.replace(/\s+/g, ' '); // 合并所有空白符
    if (getTextWidth(style, value) > maxWidth) {
      return truncateText(style, value, maxWidth);
    }
    return value;
  }

  // 4. 如果设置了不换行，直接返回
  if (whiteSpace === 'nowrap') {
    value = value.replace(/\s+/g, ' '); // 合并空白符
    return value;
  }

  // 5. 处理需要换行的情况
  const lines: string[] = [];
  const wordBreak = style.wordBreak || 'normal';
  const overflowWrap = style.overflowWrap || 'normal';

  // 首先按照自然断点（空格、换行符等）分割文本
  const segments = value.split('\n').map(line => {
    if (whiteSpace === 'pre') {
      // pre 模式下保持整行不分割，保留所有空白符
      return [line];
    } else if (whiteSpace === 'pre-wrap' || whiteSpace === 'pre-line') {
      return [line];
    }
    return line.split(' ').filter(Boolean);
  });

  for (const lineSegments of segments) {
    let currentLine = '';
    let currentWidth = 0;

    for (let i = 0; i < lineSegments.length; i++) {
      const segment = lineSegments[i];
      // 行内的最后一段不应该有空格
      const segmentWidth = i < lineSegments.length - 1 ? getTextWidth(style, segment + ' ') : getTextWidth(style, segment);
      
      // 处理单个片段超过最大宽度的情况
      if (segmentWidth + currentWidth > maxWidth) {
        // CJK 文字特殊处理
        const isCJK = isCJKText(segment);
        
        // 需要强制断行的情况
        if (wordBreak === 'break-all' || 
            (overflowWrap === 'break-word' && !isCJK) || 
            (wordBreak === 'normal' && isCJK)) {
          let remainingText = segment;

          while (remainingText) {
            const remainingWidth = maxWidth - currentWidth;
            // 这里要考虑当前行已经不是空的场景，所以可用长度要把当前用掉的长度减掉
            const truncated = truncateTextPure(remainingText, remainingWidth);
  
            remainingText = remainingText.slice(truncated.length);

            // 代表还没分割完，truncated 会完整占据一行
            if (remainingText) {
              if (currentLine) {
                // 如果不是行内的最后一段，拼接的时候应该额外加一个空格
                lines.push(i < lineSegments.length - 1 ? currentLine + ' ' + truncated : currentLine + truncated);
              } else {
                lines.push(truncated);
              }

              // 当前行用完了，重置
              currentLine = '';
              // 换行之后重置当前已用长度
              currentWidth = 0;
            } else {
              // 分割完了，但是未必占满了一行，需要记录下，可能给后续的 segment 使用
              // 也可能是刚好分割完
              currentLine = i < lineSegments.length - 1 ? currentLine + ' ' + truncated : currentLine + truncated;
              currentWidth = getTextWidth(style, currentLine);
            } 
          }
        } else {
          /**
           * 这里有几种情况
           * 1. 当前行内这一段会超长，但是按照规则不需要强制断行，作为一个整体
           * 2. 不符合1的情况，而是会把 currentLine 消费完，因此需要把 currentLine push之后处理
           */
          if (currentLine) {
            lines.push(currentLine);
            currentLine = segment;
          } else {
            lines.push(segment);
          }
        }
      } else {
        // 正常的行处理
        if (currentWidth + segmentWidth <= maxWidth) {
          currentLine += (currentLine ? ' ' : '') + segment;
          currentWidth += segmentWidth;
        } else {
          if (currentLine) {
            lines.push(currentLine);
          }
          currentLine = segment;
          currentWidth = getTextWidth(style, segment);
        }
      }
    }

    if (currentLine) {
      lines.push(currentLine);
    }
  }

  return lines.join('\n');
}

// 辅助函数：优化版本的 truncateTextPure
function truncateTextPure(value: string, maxWidth: number): string {
  const isCJK = isCJKText(value);
  
  // CJK 文字可以单字切分
  if (isCJK) {
    let length = value.length;
    let str = value.substring(0, length);

    while (getTextWidthWithoutSetFont(str) > maxWidth && length > 0) {
      length -= 1;
      str = value.substring(0, length);
    }
    return str;
  }
  
  // 非 CJK 文字尽量在单词边界切分
  const words = value.split(/(\s+)/).filter(Boolean);
  let result = '';
  let currentWidth = 0;
  
  for (const word of words) {
    const wordWidth = getTextWidthWithoutSetFont(word);
    if (currentWidth + wordWidth <= maxWidth) {
      result += word;
      currentWidth += wordWidth;
    } else {
      break;
    }
  }
  
  // 如果一个完整单词都放不下，则按字符切分
  if (!result && words[0]) {
    let length = words[0].length;
    let str = words[0].substring(0, length);
    
    while (getTextWidthWithoutSetFont(str) > maxWidth && length > 0) {
      length -= 1;
      str = words[0].substring(0, length);
    }
    return str;
  }
  
  return result;
}

function splitIntoWords(text: string, style: IStyle): string[] {
  if (style.wordBreak === 'break-all') {
    return text.split('');
  }
  
  if (style.wordBreak === 'keep-all') {
    // 对CJK文本特殊处理
    const isCJK = isCJKText(text);
    if (isCJK) {
      return [text];
    }
  }
  
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

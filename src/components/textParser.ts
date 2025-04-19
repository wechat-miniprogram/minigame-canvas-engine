import { IStyle } from './style';
import env from '../env';

const DEFAULT_FONT_FAMILY = 'sans-serif';
let context: CanvasRenderingContext2D | null = null;

export interface IOriginSomeStyleInfo {
  width: number | string | undefined;
  height: number | string | undefined;
  lineHeight: number | string | undefined;
}

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

export function getFontFromStyle(style: IStyle) {
  return `${style.fontWeight || 'normal'} ${style.fontSize || 12}px ${style.fontFamily || DEFAULT_FONT_FAMILY}`;
}

function getTextWidth(style: IStyle, value: string) {
  const context = getContext();

  context.font = getFontFromStyle(style);

  return context.measureText(value).width || 0;
}

/**
 * 使用线性查找进行文本截断
 */
function truncateTextByLinear(style: IStyle, value: string, maxWidth: number): string {
  let length = value.length;
  let str = value.substring(0, length);

  while (getTextWidth(style, str) > maxWidth && length > 0) {
    length -= 1;
    str = value.substring(0, length);
  }
  return str;
}

/**
 * 使用二分查找进行文本截断
 */
function truncateTextByBinary(style: IStyle, value: string, maxWidth: number): string {
  let left = 0;
  let right = value.length;
  let result = '';

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const str = value.substring(0, mid);
    const width = getTextWidth(style, str);

    if (width === maxWidth) {
      return str;
    } else if (width < maxWidth) {
      result = str;
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return result;
}

/**
 * 文字截断辅助函数
 * 根据文本长度选择合适的截断算法：
 * 1. 当文本较短时使用线性查找
 * 2. 当文本较长时使用二分查找
 */
function truncateTextPure(style: IStyle, value: string, maxWidth: number): string {
  // 估算每个字符的平均宽度（假设使用的是等宽字体）
  const avgCharWidth = maxWidth / value.length;

  // 如果平均每个字符的宽度大于等于 maxWidth 的 1/20，说明文本较短，使用线性查找
  // 这个阈值可以根据实际情况调整
  if (avgCharWidth >= maxWidth / 20 || value.length <= 20) {
    return truncateTextByLinear(style, value, maxWidth);
  }

  // 文本较长，使用二分查找
  return truncateTextByBinary(style, value, maxWidth);
}

function truncateText(style: IStyle, value: string, maxWidth: number): string {
  const isCJK = isCJKText(value);

  // CJK 文字可以单字切分
  if (isCJK) {
    return truncateTextPure(style, value, maxWidth);
  }

  // 非 CJK 文字尽量在单词边界或特殊字符处切分
  // 1. 首先尝试在空格处切分
  const spaceWords = value.split(/(\s+)/).filter(Boolean);
  let result = '';
  let currentWidth = 0;

  const spaceWidth = getTextWidth(style, ' ');
  for (let i = 0; i < spaceWords.length; i++) {
    const word = spaceWords[i];
    const wordWidth = getTextWidth(style, word);
    if (currentWidth + wordWidth <= maxWidth) {
      result += i < spaceWords.length - 1 ? word + ' ' : word;
      currentWidth += i < spaceWords.length - 1 ? wordWidth + spaceWidth : wordWidth;
    } else {
      break;
    }
  }

  // 2. 如果一个完整单词都放不下，尝试在特殊字符处切分
  if (!result && spaceWords[0]) {
    const word = spaceWords[0];
    // 在URL常见的分隔符处切分
    const subWords = word.split(/([\/\-\._~:?#\[\]@!$&'()*+,;=])/g).filter(Boolean);

    result = '';
    currentWidth = 0;

    for (const subWord of subWords) {
      const subWordWidth = getTextWidth(style, subWord);
      if (currentWidth + subWordWidth <= maxWidth) {
        result += subWord;
        currentWidth += subWordWidth;
      } else {
        break;
      }
    }

    // 3. 如果在特殊字符处切分后还是放不下，则按字符切分
    if (!result) {
      return truncateTextPure(style, word, maxWidth);
    }
  }

  return result;
}

function truncateTextWithDots(style: IStyle, value: string, maxWidth: number): string {
  maxWidth -= getTextWidth(style, '...');
  let str = truncateTextPure(style, value, maxWidth);
  return str === value ? str : `${str}...`;
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

function processTextWhiteSpace(value: string, whiteSpace: string): string {
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
    case 'normal':
    default:
      // 合并所有空白符
      value = value.replace(/\s+/g, ' ');
      break;
  }

  return value;
}

/**
 * 文字解析器
 * 一些知识点：
 * 1. \s 匹配一个空白字符，包括空格、制表符、换页符和换行符。
 * 2. \r 匹配一个回车符 (U+000D)。
 * 3. \n 匹配一个换行符 (U+000A)。
 * 4. \S 匹配一个非空白字符。
 */
export function parseText(style: IStyle, originSomeStyleInfo: IOriginSomeStyleInfo, value: string): string[] {
  value = String(value);

  // 1. 首先处理空白符和换行符
  const whiteSpace = style.whiteSpace || 'normal';

  value = processTextWhiteSpace(value, whiteSpace);

  // 2. 如果没有设置宽度，直接返回处理后的文本
  if (originSomeStyleInfo.width === undefined) {
    style.width = getTextWidth(style, value);
    return [value];
  }

  const maxWidth = style.width as number;

  // 3. 如果设置了不换行，强制在一行显示
  if (whiteSpace === 'nowrap') {
    if (style.textOverflow === 'ellipsis' && getTextWidth(style, value) > maxWidth) {
      return [truncateTextWithDots(style, value, maxWidth)];
    }
    return [value];
  }

  // 4. 处理需要换行的情况
  const lines: string[] = [];
  const wordBreak = style.wordBreak || 'normal';

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

        /**
         * 需要强制断行的情况
         * 1. 通过 wordBreak 设置了需要强制换行
         * 2. 虽然 wordBreak 没设置需要强制还寒，但因为是 CJK 文字，可以逐字换行
         * 3. whiteSpace 需要满足条件，whiteSpace 为 pre 和 nowrap 是不会换行的，nowrap 已经在上面的处理拦截了
         */
        if (whiteSpace !== 'pre' && (wordBreak === 'break-all' || (wordBreak === 'normal' && isCJK))) {
          let remainingText = segment;

          while (remainingText) {
            const remainingWidth = maxWidth - currentWidth;
            // 这里要考虑当前行已经不是空的场景，所以可用长度要把当前用掉的长度减掉
            const truncated = truncateText(style, remainingText, remainingWidth);

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
            currentWidth = getTextWidth(style, currentLine);
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
          currentWidth = getTextWidth(style, currentLine);
        }
      }
    }

    if (currentLine) {
      lines.push(currentLine);
    }
  }

  return lines;
}

export function parseTextHeight(style: IStyle, originSomeStyleInfo: IOriginSomeStyleInfo, parsedValue: string[]) {
  const fontSize = style.fontSize || 12;
  if (originSomeStyleInfo.lineHeight === undefined) {
    style.lineHeight = fontSize * 1.2;
  } else if (typeof style.lineHeight === 'string' && style.lineHeight.endsWith('%')) {
    style.lineHeight = fontSize * parseFloat(style.lineHeight);
  }

  // 如果没有强行指定高度，通过 lineHeight * 行高
  if (originSomeStyleInfo.height === undefined) {
    style.height = style.lineHeight as number * parsedValue.length;
  }
}

const textShadowReg = /^(\d+px\s){2}\d+px\s(?:[a-zA-Z]+|#[0-9a-fA-F]{3,6})(,\s*(\d+px\s){2}\d+px\s(?:[a-zA-Z]+|#[0-9a-fA-F]{3,6}))*$/;
function isValidTextShadow(textShadow: string) {
  return textShadowReg.test(textShadow);
}

export function parseTextShadow(textShadow: string) {
  if (!isValidTextShadow(textShadow)) {
    console.error(`[Layout]: ${textShadow} is not a valid textShadow`);
    return null;
  } else {
    // 解析 text-shadow 字符串
    return textShadow.split(',').map(shadow => {
      const parts = shadow.trim().split(/\s+/);
      const offsetX = parseFloat(parts[0]);
      const offsetY = parseFloat(parts[1]);
      const blurRadius = parseFloat(parts[2]);
      const color = parts[3];

      return { offsetX, offsetY, blurRadius, color };
    });
  }
}

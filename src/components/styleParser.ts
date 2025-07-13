
function degreesToRadians(degrees: number) {
  return degrees * Math.PI / 180;
}

// 背景图正则表达式
const isValidUrlPropReg = /\s*url\((.*?)\)\s*/;

// 九宫格配置参数
export interface IInsetParams {
  /** 左边界距离 */
  left: number;
  /** 上边界距离 */
  top: number;
  /** 右边界距离 */
  right: number;
  /** 下边界距离 */
  bottom: number;
}

// 图片渲染模式
export type ImageRenderMode = 'simple' | 'sliced' | 'tiled';

// 解析背景图片
export function backgroundImageParser(val: string) {
  if (typeof val === 'string') {
    const list = val.match(isValidUrlPropReg);

    if (list) {
      const url = list[1].replace(/('|")/g, '');

      return url;
    }
  }

  console.error(`[Layout]: ${val} is not a valid backgroundImage`);

  return null;
}

/**
 * 验证图像渲染类型
 * @param imageType 图像类型
 * @returns 有效的图像类型，无效时返回 'simple'
 */
export function validateImageType(imageType: string): ImageRenderMode {
  if (!imageType || typeof imageType !== 'string') {
    return 'simple';
  }

  const validTypes = ['simple', 'sliced', 'tiled'];
  if (validTypes.includes(imageType)) {
    return imageType as ImageRenderMode;
  }

  console.warn(`[Layout] Invalid image type: ${imageType}, fallback to 'simple'`);
  return 'simple';
}

/**
 * 解析九宫格参数
 * @param inset 格式为 "left top right bottom" 的字符串
 * @returns 解析后的九宫格参数对象，如果解析失败返回null
 */
export function parseInsetParams(inset: string): IInsetParams | null {
  if (!inset || typeof inset !== 'string') {
    return null;
  }

  const values = inset.trim().split(/\s+/).map(Number);
  if (values.length !== 4) {
    console.warn('[Layout] Invalid inset parameter format. Expected: "left top right bottom"');
    return null;
  }

  const [left, top, right, bottom] = values;
  
  // 检查是否都是有效数字
  if (values.some(v => isNaN(v))) {
    console.warn('[Layout] Invalid inset parameter format. All values must be numbers');
    return null;
  }

  // 检查是否都是非负数
  if (values.some(v => v < 0)) {
    console.warn('[Layout] Invalid inset parameters. All values must be non-negative');
    return null;
  }

  return { left, top, right, bottom };
}

function isValidTransformValue(value: string) {
  // 使用正则表达式验证数字或逗号分隔的数字，后面可以跟可选的角度单位（deg）
  return /^(-?\d+(\.\d+)?)(deg)?(,\s*(-?\d+(\.\d+)?)(deg)?)*$/.test(value);
  // return /^(-?\d+(\.\d+)?)(deg)?(,\s*(-?\d+(\.\d+)?)(deg)?)*(,\s*(true|false))?$/.test(value);
}

export interface IRenderForLayout {
  rotate?: number; // style.transform rotate解析之后得到的弧度制
  scaleX?: number; // style.transform 解析之后得到的横向缩放值
  scaleY?: number; // style.transform 解析之后得到的纵向缩放值
  backgroundImage?: HTMLImageElement; // style.backgroundImage 解析并加载之后得到的图片实例
  backgroundImageType?: ImageRenderMode; // 背景图片渲染模式
  backgroundImageInset?: IInsetParams; // 背景图片九宫格参数
  imageType?: ImageRenderMode; // 图片渲染模式
  imageInset?: IInsetParams; // 图片九宫格参数
}

interface ITextShadow {
  offsetX: number;
  offsetY: number;
  blurRadius: number;
  color: string;
}

export interface ITextRenderForLayout extends IRenderForLayout {
  textShadows?: null | ITextShadow[];
}

const transformRegex = /(\w+)\(([^)]+)\)/g;
export function parseTransform(transform: string) {
  const result: IRenderForLayout = {};

  let match;

  while ((match = transformRegex.exec(transform))) {
    const [, name, value] = match;

    if (!isValidTransformValue(value)) {
      throw new Error(`[Layout]: invalid value for ${name}: ${value}`);
    }

    const values = value
      .split(',')
      .map((val) => val.trim().replace('deg', ''))
      .map(Number);

    switch (name) {
      case 'rotate':
        result.rotate = degreesToRadians(values[0]);
        break;
      case 'scale':
        result.scaleX = values[0];
        result.scaleY = values[1] || values[0];
        break;
      default:
        break;
    }
  }

  return result;
}

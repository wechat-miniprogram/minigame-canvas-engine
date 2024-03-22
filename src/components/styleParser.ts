
function degreesToRadians(degrees: number) {
  return degrees * Math.PI / 180;
}

// 背景图正则表达式
const isValidUrlPropReg = /\s*url\((.*?)\)\s*/;

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

const textShadowReg = /^(\d+px\s){2}\d+px\s[a-zA-Z]+(,\s*(\d+px\s){2}\d+px\s[a-zA-Z]+)*$/;
export function isValidTextShadow(textShadow: string) {
  return textShadowReg.test(textShadow);
}

function isValidTransformValue(value: string) {
  // 使用正则表达式验证数字或逗号分隔的数字，后面可以跟可选的角度单位（deg）
  return /^(-?\d+(\.\d+)?)(deg)?(,\s*(-?\d+(\.\d+)?)(deg)?)*$/.test(value);
}

export interface IRenderForLayout {
  rotate?: number; // style.transform rotate解析之后得到的弧度制
  scaleX?: number; // style.transform 解析之后得到的横向缩放值
  scaleY?: number; // style.transform 解析之后得到的纵向缩放值
  backgroundImage?: HTMLImageElement; // style.backgroundImage 解析并加载之后得到的图片实例
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

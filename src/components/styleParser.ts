
function degreesToRadians(degrees: number) {
  return degrees * Math.PI / 180;
}

// 旋转的正则表达式
const rotateReg = /rotate\((\d+)deg\)/;

// 背景图正则表达式
const isValidUrlPropReg = /\s*url\((.*?)\)\s*/;

export function rotateParser(val: string) {
  const match = val.match(rotateReg);

  if (match) {
    return degreesToRadians(parseInt(match[1]));
  }

  console.error(`[Layout]: ${val} is not a valid transform rotate`);

  return null;
}

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
  rotate?: number; // transform rotate解析之后得到的弧度制
  scaleX?: number;
  scaleY?: number;
}


const transformRegex = /(\w+)\(([^)]+)\)/g;
export function parseTransform(transform: string) {
  // const result = {
    // rotate: 0,
    // scaleX: 1,
    // scaleY: 1,
    // translateX: 0,
    // translateY: 0,
  // };

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
      // case 'translate':
      //   result.translateX = values[0];
      //   result.translateY = values[1] || 0;
      //   break;
      default:
        break;
    }
  }

  return result;
}

parseTransform('rotate(45)');
parseTransform('rotate(360deg)');
parseTransform('xxxx');
parseTransform('scale(3,4)');
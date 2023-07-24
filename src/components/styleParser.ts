
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

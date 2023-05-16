import Element from "../elements";
const parser = require('./htmlparser/html2json')

import config from './config';

const { presetChars } = config;
/**
 * @description 获取字符宽度
 * @param char
 * @param fontSize
 */
export const getCharWidth = (char, fontSize) => {
  let width = 0;
  // @ts-ignore
  width = presetChars[char] > 0 ? presetChars[char] : 10;

  return (width * fontSize) / 10;
};


function iterateTree(element, callback) {
  if (callback) {
    callback(element);
  }

  if (element.nodes) {
    element.nodes.forEach((child) => {
      iterateTree(child, callback);
    });  
  }
}

export default class RichText extends Element {
  constructor(opts) {
    const {
      style = {},
      idName = '',
      className = '',
      dataset,
    } = opts;

    super({
      idName,
      className,
      dataset,
      style,
    });

    this.innerText = '';
    this.jsonData = null;
  }

  set text(value) {
    if (value === this.innerText) {
      return;
    }
    this.innerText = value;

    const jsonData = parser.html2json(this.innerText);
    this.jsonData = jsonData;

    this.root.emit('repaint');
    console.log(jsonData)
    console.log('[Layout] set text', value);

    this.buildDrawCallFromJsonData(jsonData);

  }

  get text() {
    return this.innerText;
  }

  buildDrawCallFromJsonData(jsonData) {
    let dcs = [];
    let lines = -1;
    let yStart = 0;
    const { width, lineHeight = 12 } = this.style;

    iterateTree(jsonData, (node) => {
      console.log(node);

      // tagType： block、inline
      const { tagType } = node;

      // block类型新起一行
      if (tagType === 'block') {
        lines += 1;
        yStart = lines * lineHeight;
      }
      
      // 文本类型
      if (node.text) {
        
      }
    })
  }

  repaint() {
    this.render();
  }

  destroySelf() {
    this.root = null;
  }

  insert(ctx, needRender) {
    this.ctx = ctx;

    if (needRender) {
      this.render();
    }
  }

  render() {
    const { ctx } = this;
    // this.toCanvasData();
    ctx.save();

    const box = this.layoutBox;
    const { style } = this;


    let drawX = box.absoluteX;
    let drawY = box.absoluteY;

    const { needClip, needStroke } = this.renderBorder(ctx);

    if (needClip) {
      ctx.clip();
    }

    if (style.backgroundColor) {
      ctx.fillStyle = style.backgroundColor;
      ctx.fillRect(drawX, drawY, box.width, box.height);
    }

    if (style.backgroundImage && this.backgroundImage) {
      ctx.drawImage(this.backgroundImage, drawX, drawY, box.width, box.height);
    }

    if (needStroke) {
      ctx.stroke();
    }

    if (this.jsonData) {
    }
  }
}

import Element from "../elements";
const parser = require('./htmlparser/html2json')

import config from './config';

const { presetChars } = config;
const DEFAULT_FONT_FAMILY = 'PingFangSC-Regular, sans-serif';
import { createCanvas } from '../../common/util';

const canvas = createCanvas();
const ctx = canvas.getContext('2d')

/**
 * @description 获取字符宽度
 * @param char
 * @param fontSize
 */
export const getCharWidth = (char, fontSize) => {
  let width = 0;
  // @ts-ignore
  // width = presetChars[char] > 0 ? presetChars[char] : ctx.measureText(char, fontSize).width;
  // width = presetChars[char] > 0 ? presetChars[char] : 10;

  width = ctx.measureText(char, fontSize).width

  return (width * fontSize) / 10;
  // return ctx.measureText(char, fontSize).width;
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

    let start = new Date();
    this.buildDrawCallFromJsonData(jsonData);
    console.log('buildDrawCallFromJsonData', new Date() - start)
  }

  get text() {
    return this.innerText;
  }

  createDc() {
    return {
      filleStyle: null,
      fontSize: null,
      textAlign: null,
      text: '',
    }
  }

  buildDrawCallFromJsonData(jsonData) {
    let dcs = [];
    let lines = 0;
    let linesData = [];
    let yStart = 0;
    let lineWidth  = 0;
    linesData[lines] = '';

    let currDc = this.createDc();
    dcs.push(currDc);
    
    const { width, lineHeight = 12, fontSize = 12, } = this.style;

    console.log(width, lineHeight, fontSize)

    jsonData.nodes.forEach(nodeTree => {
      iterateTree(nodeTree, (node) => {
        // console.log(node);
        if (node.node === 'element') {
          console.log(node);
        }
        
        // 文本类型
        if (node.text) {
          for (let i = 0; i < node.text.length; i++) {
            const char = node.text[i];
            const charWidth = getCharWidth(char, fontSize);
            
            // 触发了换行逻辑
            if (lineWidth + charWidth > width) {
              lines += 1;
              linesData[lines] = '';
              lineWidth = 0;
            } else {
              linesData[lines] += char;
              lineWidth += charWidth;
            }
          }
        }
      });

      // tagType： block、inline
      const { tagType } = nodeTree;
      // block类型新起一行
      if (tagType === 'block') {
        lines += 1;
        linesData[lines] = '';
        lineWidth = 0;
      }
    });

    this.linesData = linesData;

    this.style.height = this.linesData.length * lineHeight;

    console.log('linesData', linesData, this.style.height)
  }

  repaint() {
    this.render();
  }

  destroySelf() {
    this.root = null;
  }

  insert(ctx, needRender) {
    this.ctx = ctx;

    this.toCanvasData();

    if (needRender) {
      this.render();
    }
  }

  toCanvasData() {
    const style = this.style || {};

    this.fontSize = style.fontSize || 12;
    this.textBaseline = 'top';
    this.font = `${style.fontWeight || ''} ${style.fontSize || 12}px ${DEFAULT_FONT_FAMILY}`;
    this.textAlign = style.textAlign || 'left';
    this.fillStyle = style.color || '#000';
  }

  render() {
    const { ctx } = this;
    // this.toCanvasData();
    ctx.save();

    const box = this.layoutBox;
    const { style } = this;

    ctx.textBaseline = this.textBaseline;
    ctx.font = this.font;
    ctx.textAlign = this.textAlign;

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

    if (this.linesData) {
      let start = new Date()
      const { width, lineHeight = 12, fontSize = 12, } = this.style;


      this.linesData.forEach((line, index) => {
        ctx.fillText(line, drawX, drawY + index * lineHeight)        
      });

      // console.log('render', new Date() - start)
    }

    ctx.restore();
  }
}

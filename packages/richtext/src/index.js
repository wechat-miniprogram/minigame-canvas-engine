
// import Element from '../../../src/components/elements';
const parser = require('./htmlparser/html2json');
const DEFAULT_FONT_FAMILY = 'sans-serif';

function createCanvas() {
  /* istanbul ignore if*/
  if (typeof __env !== 'undefined') {
    return __env.createCanvas();
  }

  return document.createElement('canvas');
}

let ctx;

/**
 * @description 获取字符宽度
 * @param char
 * @param fontSize
 */
export const getCharWidth = (char, fontSize) => {
  if (!ctx) {
    const canvas = createCanvas();
    ctx = canvas.getContext('2d');
  }

  const { width } = ctx.measureText(char);

  return (width * fontSize) / 10;
};


function iterateTree(element, callback) {
  if (callback) {
    callback(element);
  }

  if (element.nodes) {
    element.nodes.forEach((child) => {
      child.parent = element;
      iterateTree(child, callback);
    });
  }
}


export default function install(Element) {
  return  class RichText extends Element {
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
  
      this.buildDrawCallFromJsonData(jsonData);
    }
  
    get text() {
      return this.innerText;
    }
  
    setStyleForDc(currDc, styleObj) {
      if (styleObj['font-weight']) {
        currDc.fontWeight = styleObj['font-weight'];
      }
  
      if (styleObj['font-style']) {
        currDc.fontStyle = styleObj['font-style'];
      }
  
      if (styleObj.color) {
        currDc.filleStyle = styleObj.color;
      }
  
      if (styleObj['font-size']) {
        currDc.fontSize = styleObj['font-size'].replace('px', '');
      }
    }
  
    buildDrawCallFromJsonData(jsonData) {
      const { width, lineHeight = 16, fontSize = 12, } = this.style;
  
      // 针对整个节点树进行解析，算出最后需要独立调用 canvas API 绘制的列表
      let dcs = [];
      // 换行标记
      let lines = -1;
      // 当前行宽度标记
      let lineWidth = 0;
  
      let currDc;
  
      function createDc() {
        let dc = {
          filleStyle: null,
          fontStyle: null,
          fontSize: null,
          textAlign: null,
          text: '',
          x: 0,
          y: 0,
        };
  
        dcs.push(dc);
  
        currDc = dc;
        currDc.x = lineWidth;
        currDc.y = lineHeight * lines;
  
        return dc;
      }
  
      iterateTree(jsonData, (node) => {
        // tagType： block、inline
        const { tagType, tag, styleStr } = node;
        // block类型新起一行
        if (tagType === 'block') {
          lines += 1;
          lineWidth = 0;
  
          createDc();
        }
  
        // 加粗
        if (tag === 'strong') {
          // 当前dc并不是加粗文本且并不为空，需要创建新的 dc
          if (currDc.fontWeight !== 'bold' && currDc.text) {
            createDc();
            currDc.fontWeight = 'bold';
          }
  
          // 本身刚刚新起一行，不再需要创建新的，直接用即可
          if (currDc.text === '') {
            currDc.fontWeight = 'bold';
          }
  
          if (!node.styleObj) {
            node.styleObj = {}
          }
  
          node.styleObj['font-weight'] = 'bold';
        }
  
        let styleObj = {};
        /**
         * 当前标签有样式的情况
         * 1. 处理样式，目前支持颜色、加粗、字体大小
         * 2. 目前暴力处理，不管当前dc什么状态，只要是有 style 就创建新的dc
         */
        if (styleStr) {
          styleObj = styleStr.split(';').filter(item => !!item).reduce((res, curr) => {
            const temp = curr.split(':');
            res[temp[0]] = temp[1].trim();
  
            return res;
          }, {});
  
          if (styleObj) {
            createDc();
  
            // 继承父节点的样式
            let parent = node.parent;
            while (parent) {
              if (parent.styleObj) {
                styleObj = Object.assign({}, parent.styleObj, styleObj);
              }
              parent = parent.parent;
            }
  
            this.setStyleForDc(currDc, styleObj);
  
            node.styleObj = styleObj;
          }
        } else {
          // 继承父节点的样式
          let parent = node.parent;
          while (parent) {
            if (parent.styleObj) {
              styleObj = Object.assign({}, parent.styleObj, styleObj);
            }
            parent = parent.parent;
          }
  
          const nodeIndex = node.parent?.nodes.indexOf(node);
          // 前一个节点同样存在样式，新建dc
          if (nodeIndex > 0 && (node.parent?.nodes[nodeIndex - 1].styleStr || node.parent?.nodes[nodeIndex - 1].tag === 'strong')) {
            createDc();
          }
  
          this.setStyleForDc(currDc, styleObj);
        }
  
        const localFontSize = styleObj['font-size'] ? Number(styleObj['font-size'].replace('px', '')) : fontSize;
        // 文本类型
        if (node.text) {
          if (!currDc) {
            createDc();
          }
          for (let i = 0; i < node.text.length; i++) {
            const char = node.text[i];
            const charWidth = getCharWidth(char, currDc && currDc.fontSize || fontSize);
  
            // 触发了换行逻辑
            if (lineWidth + charWidth > width) {
              lines += 1;
              lineWidth = 0;
  
              let lastDc = currDc;
              createDc();
              // 因为字符太长触发的换行样式继承到下一个dc
              Object.assign(currDc, lastDc);
              currDc.text = '';
              currDc.y = lineHeight * lines;
              currDc.x = 0;
            }
  
            lineWidth += charWidth;
            currDc.text += char;
          }
        }
      });
  
      this.dcs = dcs;
      this.style.height = lines * lineHeight;
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
  
      if (this.dcs && this.dcs.length) {
        const { width, lineHeight = 12, fontSize = 12 } = this.style;
  
  
        this.dcs.forEach((dc) => {
          if (dc.text) {
            if (dc.fontWeight || dc.fontSize || dc.filleStyle || dc.fontStyle) {
              ctx.save();
              if (dc.filleStyle) {
                ctx.fillStyle = dc.filleStyle;
              }
  
              ctx.font = `${dc.fontStyle || ''} ${dc.fontWeight || ''} ${dc.fontSize || fontSize}px ${DEFAULT_FONT_FAMILY}`;
              ctx.fillText(dc.text, drawX + dc.x, drawY + dc.y);
              ctx.restore();
            } else {
              ctx.fillText(dc.text, drawX + dc.x, drawY + dc.y);
            }
          }
        });
      }
  
      ctx.restore();
    }
  }
}

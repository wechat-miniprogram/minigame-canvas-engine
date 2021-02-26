import { getElementStyle } from "./util";

const finder = function (t, w, arr, measure) {
  let start = 0;
  let end = t.length - 1;
  let mid = Math.floor((start + end + 1) / 2);
  if (measure(t).width < w) {
    arr.push(t);
    return -1;
  }
  if (measure(t[0]).width > w) {
    return -1;
  }
  while (start < end) {
    const str = t.substring(0, mid);
    if (measure(str).width < w) {
      start = mid;
    } else {
      end = mid - 1;
    }
    mid = Math.floor((start + end + 1) / 2);
  }

  arr.push(t.substring(0, mid));
  return mid;
};

class TextManager {
  constructor(layout) {
    this.layout = layout;
    this.textNodes = [];
    this.hasUpdate = false;
  }
  /**
   * 搜集文本节点
   * @param {Object} node
   */
  addTextNode(node) {
    this.textNodes.push(node);
  }
  /**
   * 更新下文本节点的布局box
   */
  updateTextNodeLayoutBox() {
    const isDarkMode = this.layout.isDarkMode();

    for (let i = 0; i < this.textNodes.length; i++) {
      const node = this.textNodes[i];
      const style = getElementStyle.call(node, isDarkMode, false);

      node.valueBreak = [];

      const measure = this.layout._measureText({
        fontWeight: style.fontWeight || null,
        fontSize: style.fontSize || null,
        fontFamily: style.fontFamily || null,
      }, node.root.getFontSize());

      const maxWidth = style.maxWidth || style.width || node.parent.layoutBox.width

      /*console.log(node.valueInit);
      if(node.valueInit === '阿萨达萨达阿萨德阿萨德阿萨德阿萨德阿萨德阿萨德阿萨德权威的阿萨德阿萨德') {
        debugger
      }*/

      // if (node.noWrapWidth > node.parent.layoutBox.width) { // 文本的宽度大于父节点的宽度，需要给文本换行
      if (measure(node.valueInit).width > maxWidth) { // 文本的宽度大于父节点的宽度，需要给文本换行
        const dotWidth = measure('...').width;
        const nodeTextArray = this.getSubText(node.valueInit, maxWidth, {
          fontWeight: style.fontWeight || null,
          fontSize: style.fontSize || null,
          fontFamily: style.fontFamily || null,
        }, node.root.getFontSize());

        if (style.textOverflow === 'ellipsis' && style.whiteSpace === 'nowrap') { // 单行溢出...
          const t = nodeTextArray[0] || ''; // 取截断后的第一个文本片段
          let { length } = t;
          let str = t.substring(0, length);
          while (measure(str).width > (maxWidth - dotWidth) && length > 0) {
            length-=1;
            str = t.substring(0, length);
          }
          node.valueBreak = [`${str}...`];
        } else if (style.textOverflow === 'ellipsis' && style.lineClamp * 1 > 0) { // 多行溢出...
          console.log(node.valueInit, nodeTextArray);
          if (nodeTextArray.length > style.lineClamp) { // 行数超过了
            node.valueBreak = nodeTextArray.slice(0, style.lineClamp);
            // 最后一行变成...
            const t = node.valueBreak[node.valueBreak.length - 1];
            let { length } = t;
            let str = t.substring(0, length);
            while (measure(str).width > (maxWidth - dotWidth) && length > 0) {
              length-=1;
              str = t.substring(0, length);
            }
            node.valueBreak[node.valueBreak.length - 1] = `${str}...`;
          } else { // 行数没超过
            node.valueBreak = nodeTextArray;
          }
        } else { // 默认不做处理，默认显示多行
          node.valueBreak = nodeTextArray;
        }

        node.computedStyle.width = maxWidth;
        /*node.yogaNode.setWidth(maxWidth);*/

        if (style.whiteSpace !== 'nowrap') {
          node.computedStyle.height = (style.lineHeight || style.fontSize) * node.valueBreak.length;
          /*node.yogaNode.setHeight((style.lineHeight || style.fontSize) * node.valueBreak.length);*/
        }
      }
    }
  }

  clear() {
    this.textNodes = [];
    this.hasUpdate = false;
  }

  getSubText(text, width, { fontWeight, fontSize, fontFamily }, fontSizeRate) {
    const measure = this.layout._measureText({ fontWeight, fontSize, fontFamily }, fontSizeRate);
    const textArray = [];
    let m = 0;
    let _text = text;

    while ((m = finder(_text, width, textArray, measure)) > -1) {
      _text = _text.substring(m, _text.length);
    }
    // console.log(textArray)
    return textArray;
  }
}

export default TextManager;

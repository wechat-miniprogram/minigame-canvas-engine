import Element from './elements.js';

export default class Block extends Element {
  get radius() {
    const {
      borderRadius = 0, 
      borderLeftTopRadius = 0, 
      borderRightTopRadius = 0, 
      borderLeftBottomRadius = 0, 
      borderRightBottomRadius = 0 
    } = this.computedStyle;
    const tl = borderLeftTopRadius || borderRadius
    const tr = borderRightTopRadius || borderRadius
    const bl = borderLeftBottomRadius || borderRadius
    const br = borderRightBottomRadius || borderRadius
    return [tl, tr, br, bl];
  }
  getRadius(computedStyle) {
    const borderRadius = computedStyle.borderRadius || 0;
    const borderLeftTopRadius = computedStyle.borderLeftTopRadius || 0;
    const borderRightTopRadius = computedStyle.borderRightTopRadius || 0;
    const borderLeftBottomRadius = computedStyle.borderLeftBottomRadius || 0;
    const borderRightBottomRadius = computedStyle.borderRightBottomRadius || 0;

    const tl = borderLeftTopRadius || borderRadius;
    const tr = borderRightTopRadius || borderRadius;
    const bl = borderLeftBottomRadius || borderRadius;
    const br = borderRightBottomRadius || borderRadius;
    return [tl, tr, br, bl];
  }

  updateContours() {
    const renderer = this.root.renderContext;
    const { width, height, absoluteX, absoluteY } = this.layoutBox;
    if (!this.glRect) {
      this.glRect = renderer.createRoundRect(this.id);
    }
    this.glRect.updateContours([absoluteX, absoluteY, width, height]);
  }
  
  updateRenderData() { // 子组件自己实现
  }

  insert(isDarkMode) {
    const rect = this.glRect;
    const style = isDarkMode 
      ? Object.assign({}, this.styleInit, this.styleDarkInit, this.styleProp, this._innerStyle) 
      : Object.assign({}, this.styleInit, this.styleProp, this._innerStyle);

    if (style.backgroundColor) {
      rect.setBackgroundColor(style.backgroundColor);
    }
    const radius = this.getRadius(isDarkMode);
    rect.setRadius(radius);
    if (style.borderWidth) {
      rect.setBorder(style.borderWidth, style.borderColor);
    }
  }
}


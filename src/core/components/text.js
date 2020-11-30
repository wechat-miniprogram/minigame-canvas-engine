import Element from './elements.js';
import { DEFAULT_FONT_FAMILY } from '../common/util.js';

export default class Text extends Element {
  constructor({
    styleInit = {},
    styleActive = {},
    styleDarkInit = {},
    styleDarkActive = {},
    dataset = {},
    props = {},
    idName = '',
    className = '',
    value = '',
  }) {
    const valueInit = value; // 先存下初始化时的value

    // 没有设置宽度的时候通过canvas计算出文字宽度
    // if (style.width === undefined) {
    //     style.width = getTextWidth(style, value, this.root.createOffscreenCanvas());
    // } else if (style.textOverflow === 'ellipsis') { // 文本本身设置了宽度，超出文本的部分要变成省略号
    //     value = parseText(style, value, this.root.createOffscreenCanvas());
    // }

    // 默认文本节点的高度是字体大小，后面有换行需要更新下高度
    // if (typeof style.height === 'undefined') {
    //     style.height = style.lineHeight || style.fontSize;
    // }
    // if (typeof style.width === 'undefined') {
    //     style.width = getTextWidth(style, valueInit);
    // } else if (style.textOverflow === 'ellipsis') {

    // }

    super({
      props,
      idName,
      className,
      styleInit,
      styleActive,
      styleDarkInit,
      styleDarkActive,
      dataset,
    });

    this.type = 'Text';
    this.valueShow = value; // 显示的时候的value
    this.valueInit = valueInit;
    // this.noWrapWidth = style.width;
    // this.noWrapHeight = style.height;

    this.renderBoxes = [];

    Object.defineProperty(this, 'value', {
      get() {
        // return this.valuesrc;
        return this.valueInit; // 初始化是的value
      },
      set(newValue) {
        // if ( newValue !== this.valuesrc) {
        //     this.valuesrc = newValue;

        //     this.emit('repaint');
        // }
        console.log('set text value 1 ', newValue, this.valueInit);
        if (newValue !== this.valueInit) {
          console.log('set text value 2 ', newValue, this.valueInit);
          this.valueInit = newValue;
          this.valueShow = newValue;
          // this.style.width = getTextWidth(this.style, newValue);
          // this.styleInit.width = this.style.width;
          // this.noWrapWidth = this.style.width;
          this.computedStyle.width = this.root._getTextWidth(this.style, newValue, this.root.getFontSize());
          this.noWrapWidth = this.computedStyle.width;
          // this.element.style.width = this.style.width;
          // this.emit('repaint');
          // if (typeof this.parent.style.width !== undefined ) { // 如果父元素定宽度或者文本设置了...，不用再计算一遍了，自己修改下重新画一遍

          // } else { // 触发layout的回流，重新计算一边布局
          //     this.root.emit('reflow');
          // }
          if (this.layoutBox.width > 0 && this.layoutBox.height > 0) { // 不显示的节点，改了wording也不reflow
            this.root.emit('reflow');
          }
        }
      },
      enumerable: true,
      configurable: true,
    });
  }

  toCanvasData(isDarkMode) {
    // const isDarkMode = this.root.isDarkMode();
    const style = isDarkMode ? Object.assign({}, this.styleInit, this.styleDarkInit, this.styleProp, this._innerStyle)
      : Object.assign({}, this.styleInit, this.styleProp, this._innerStyle);

    // let style = this.computedStyle;

    this.fontSize = style.fontSize || 12;
    this.textBaseline = 'top';
    this.font = `${style.fontWeight || ''} ${(style.fontSize || 12) * this.root.getFontSize()}px ${style.fontFamily || DEFAULT_FONT_FAMILY}`;
    this.textAlign = style.textAlign || 'left';
    this.fillStyle = style.color || '#000';
  }

  beforeReflow() {
    this.computedStyle.width = this.noWrapWidth;
    this.computedStyle.height = this.noWrapHeight;
  }

  insert() {
    // this.render(isDarkMode)
  }

  updateContours() {
    if (!this.layoutBox) {
      return;
    }
    const box = this.layoutBox;
    const isDarkMode = this.root.isDarkMode();
    const style = isDarkMode ? Object.assign({}, this.styleInit, this.styleDarkInit, this.styleProp, this._innerStyle)
      : Object.assign({}, this.styleInit, this.styleProp, this._innerStyle);

    if (box.width * 1 === 0 || box.height * 1 === 0) { // 宽度或者高度等于0，直接不画
      return;
    }

    let { parent } = this;
    while (parent && parent.parent) {
      if (parent.styleInit.display === 'none') {
        return;
      }
      parent = parent.parent;
    }

    let boxWidth = box.width;
    let boxHeight = box.height;

    const styleNoWrap = style.whiteSpace === 'nowrap' && style.textOverflow !== 'ellipsis';
    if (!styleNoWrap && this.valueBreak && this.valueBreak.length) {
      boxWidth = this.parent.layoutBox.width - (this.parent.style.paddingLeft || 0) 
        - (this.parent.style.paddingRight || 0);
      boxHeight = box.height;
    }

    const renderer = this.root.renderContext;
    this.glRect = renderer.createRoundRect(
      this.id, this.renderer,
      [box.absoluteX, box.absoluteY, boxWidth, boxHeight],
    );
    this.glRect.setTexture({
      type: 'text',
      value: this.valueShow,
      fontSize: style.fontSize || 12,
      textBaseline: 'top',
      font: `${style.fontWeight || ''} ${(style.fontSize || 12) * this.root.getFontSize()}px ${style.fontFamily || DEFAULT_FONT_FAMILY}`,
      textAlign: style.textAlign || 'left',
      fillStyle: style.color || '#000',
    });
    // if (!this.offCanvas) {
    // this.offCanvas = this.root.canvasContext.getOffscreenCanvas(`text-${this.id}`);
    // this.offCtx = this.offCanvas.getContext('2d');
    // }
    // const canvas = this.offCanvas;
    // canvas.width = boxWidth;
    // canvas.height = boxHeight;
  }

  render(isDarkMode) {
    const box = this.layoutBox;
    if (box.width * 1 === 0 || box.height * 1 === 0) { // 宽度或者高度等于0，直接不画
      return;
    }

    // const isDarkMode = this.root.isDarkMode();
    const style = isDarkMode ? Object.assign({}, this.styleInit, this.styleDarkInit, this.styleProp, this._innerStyle)
      : Object.assign({}, this.styleInit, this.styleProp, this._innerStyle);

    this.toCanvasData(isDarkMode);

    // const canvas = this.offCanvas;
    const ctx = this.offCtx;

    ctx.textBaseline = this.textBaseline;
    ctx.font = this.font;
    ctx.textAlign = this.textAlign;

    let drawX = 0;
    let drawY = 0;

    if (style.backgroundColor) {
      mesh.setFill({ // eslint-disable-line
        color: style.backgroundColor,
      });
    }

    ctx.fillStyle = this.fillStyle;

    if (this.textAlign === 'center') {
      drawX += box.width / 2;
    } else if (this.textAlign === 'right') {
      drawX += box.width;
    }

    if (style.lineHeight) {
      ctx.textBaseline = 'middle';
      drawY += style.lineHeight / 2;
    }

    if (style.textShadow) {
      const [offsetX, offsetY, shadowBlur, shadowColor] = style.textShadow.split(' ');
      ctx.shadowOffsetX = +offsetX;
      ctx.shadowOffsetY = +offsetY;
      ctx.shadowBlur = +shadowBlur;
      ctx.shadowColor = shadowColor;
    }

    if (style.whiteSpace === 'nowrap' && style.textOverflow !== 'ellipsis') { // 不换行的时候，直接溢出处理
      ctx.fillText(
        this.valueShow,
        drawX,
        drawY,
      );
    } else {
      if (this.valueBreak && this.valueBreak.length) {
        for (let i = 0; i < this.valueBreak.length; i++) {
          const str = this.valueBreak[i];
          ctx.fillText(str, drawX, drawY);
          drawY += style.lineHeight || style.fontSize;
        }
      } else {
        ctx.fillText(
          this.valueShow,
          drawX,
          drawY,
        );
      }
    }

    // this.glRect.setTexture({
    //     image: canvas
    // })
  }

  updateRenderData(computedStyle) {
    const box = this.layoutBox;
    if (box.width * 1 === 0 || box.height * 1 === 0) { // 宽度或者高度等于0，直接不画
      return;
    }

    let { parent } = this;
    while (parent && parent.parent) {
      if (parent.styleInit.display === 'none') {
        return;
      }
      parent = parent.parent;
    }

    let boxWidth = box.width;
    let boxHeight = box.height;

    const styleNoWrap = computedStyle.whiteSpace === 'nowrap' && computedStyle.textOverflow !== 'ellipsis';
    if (!styleNoWrap && this.valueBreak && this.valueBreak.length) {
      boxWidth = this.parent.layoutBox.width - (this.parent.style.paddingLeft || 0)
                - (this.parent.style.paddingRight || 0);
      boxHeight = box.height;
    }

    const renderer = this.root.renderContext;
    if (!this.glRect) {
      this.glRect = renderer.createRoundRect(this.id, this.type);
    }
    this.glRect.reset();
    this.glRect.updateContours([box.absoluteX, box.absoluteY - 4, boxWidth, boxHeight + 8]);

    this.glRect.setText({
      value: { valueShow: this.valueShow, valueBreak: this.valueBreak },
      style: {
        drawX: box.absoluteX,
        drawY: box.absoluteY,
        fontSize: (computedStyle.fontSize || 12) * this.root.getFontSize(),
        fontWeight: computedStyle.fontWeight || '',
        fontFamily: computedStyle.fontFamily || DEFAULT_FONT_FAMILY,
        lineHeight: computedStyle.lineHeight || computedStyle.fontSize || 12,
        textAlign: computedStyle.textAlign || 'left',
        textShadow: computedStyle.textShadow,
        whiteSpace: computedStyle.whiteSpace,
        textOverflow: computedStyle.textOverflow,
        color: computedStyle.color || '#000',
      },
    });
  }
}

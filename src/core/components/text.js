import Element from './elements.js';
import { DEFAULT_FONT_FAMILY, getElementStyle } from '../common/util.js';

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

    this.renderBoxes = [];

    Object.defineProperty(this, 'value', {
      get() {
        return this.valueInit; // 初始化是的value
      },
      set(newValue) {
        console.log('set text value 1 ', newValue, this.valueInit);
        if (newValue !== this.valueInit) {
          console.log('set text value 2 ', newValue, this.valueInit);
          this.valueInit = newValue;
          this.valueShow = newValue;
          this.computedStyle.width = this.root._getTextWidth(this.style, newValue, this.root.getFontSize());
          this.noWrapWidth = this.computedStyle.width;
          if (this.layoutBox.width > 0 && this.layoutBox.height > 0) { // 不显示的节点，改了wording也不reflow
            this.root.emit('reflow');
          }
        }
      },
      enumerable: true,
      configurable: true,
    });
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
    const style = getElementStyle.call(this, isDarkMode);

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
  }

  render(isDarkMode) {
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

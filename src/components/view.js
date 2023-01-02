import Element from './elements.js';

export default class View extends Element {
  constructor({
    style = {},
    props = {},
    idName = '',
    className = '',
    dataset,
  }) {
    super({
      props,
      idName,
      className,
      style,
      dataset,
    });

    this.type = 'View';
    this.ctx  = null;
  }

  destroySelf() {
    this.isDestroyed  = true;
    this.children     = null;
    this.root          = null;
  }

  // 有些节点仅仅作为容器，实际上不需要任何渲染逻辑，这里加个判断可以提高性能
  checkNeedRender() {
    const style       = this.style || {};
    const { borderColor } = style;

    return !!(style.backgroundColor
      || (style.borderWidth       && borderColor)
      || (style.borderTopWidth    && (borderColor  || style.borderTopColor))
      || (style.borderBottomWidth && (borderColor  || style.borderBottomColor))
      || (style.borderLeftWidth   && (borderColor  || style.borderLeftColor))
      || (style.borderRightWidth  && (borderColor  || style.borderRightColor)));
  }

  render() {
    const style = this.style || {};
    const box = this.layoutBox;
    const { ctx } = this;

    ctx.save();

    const borderWidth = style.borderWidth || 0;
    const drawX         = box.absoluteX;
    const drawY         = box.absoluteY;

    const borderLeftWidth   = style.borderLeftWidth   || borderWidth;
    const borderRightWidth  = style.borderRightWidth  || borderWidth;
    const borderTopWidth    = style.borderTopWidth    || borderWidth;
    const borderBottomWidth = style.borderBottomWidth || borderWidth;

    this.renderBorder(ctx);
    const { needClip, needStroke } = this.renderBorder(ctx);

    if (needClip) {
      ctx.clip();
    }

    if (style.backgroundColor) {
      ctx.fillStyle = style.backgroundColor;
      ctx.fillRect(
        drawX + borderLeftWidth,
        drawY + borderRightWidth,
        box.width - (borderLeftWidth + borderRightWidth),
        box.height - (borderTopWidth + borderBottomWidth),
      );
    }

    if (needStroke) {
      ctx.stroke();
    }

    ctx.restore();
  }

  insert(ctx) {
    this.ctx = ctx;

    this.render();
  }

  repaint() {
    this.render();
  }
}


import Block from './block.js';
import { none, nextTick } from '../common/util.js';

export default class View extends Block {
  constructor({
    styleInit = {},
    styleActive = {},
    styleDarkInit = {},
    styleDarkActive = {},
    props = {},
    dataset = {},
    idName = '',
    className = '',
  }) {
    super({
      props,
      dataset,
      idName,
      className,
      styleInit,
      styleActive,
      styleDarkInit,
      styleDarkActive,
    });

    this.type = 'View';
    this.renderBoxes = [];

    nextTick(() => {
      const style = this.root.isDarkMode() ? this.styleInit : this.styleDarkInit;
      if (style.backgroundImage && this.root && this.root.canvasContext) {
        this.root.canvasContext.postMessage && this.root.canvasContext.postMessage({
          type: 'preload-image',
          data: {
            src: style.backgroundImage,
          },
        });
      }
    });
  }

  destroySelf() {
    this.isDestroyed = true;
    this.children = null;
  }

  // 有些节点仅仅作为容器，实际上不需要任何渲染逻辑，这里加个判断可以提高性能
  checkNeedRender() {
    return true;
  }

  // 废弃
  render(img) {

  }

  // 废弃
  loadImg(src, callback = none) {

  }

  // 废弃
  insert(isDarkMode) {

  }

  updateRenderData(computedStyle) {
    if (!this.layoutBox) {
      return;
    }
    const renderer = this.root ? this.root.renderContext : this.renderContext;
    if (!this.glRect) {
      this.glRect = renderer.createRoundRect(this.id, this.type);
    }
    this.glRect.reset();
    const { width, height, absoluteX, absoluteY } = this.layoutBox;
    // 设置渲染区域数据
    this.glRect.updateContours([absoluteX, absoluteY, width, height]);
    // 设置背景色数据
    if (computedStyle.backgroundColor) {
      this.glRect.setBackgroundColor(computedStyle.backgroundColor);
    }
    // 设置边框数据
    if (computedStyle.borderWidth) {
      this.glRect.setBorder(computedStyle.borderWidth, computedStyle.borderColor);
    }
    // 设置圆角数据
    const radius = this.getRadius(computedStyle);
    this.glRect.setRadius(radius);

    if (computedStyle.backgroundImage) { // 设置背景图片
      this.glRect.setBackgroundImage(
        computedStyle.backgroundImage, computedStyle.backgroundSize,
        computedStyle.backgroundPosition,
      );
    }
  }
}


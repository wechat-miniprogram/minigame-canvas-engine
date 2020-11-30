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
        this.root.canvasContext.postMessage({
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
    const isDarkMode = this.root.isDarkMode();
    const style = isDarkMode
      ? Object.assign({}, this.styleInit, this.styleDarkInit, this.styleProp, this._innerStyle)
      : Object.assign({}, this.styleInit, this.styleProp, this._innerStyle);

    // let style = this.computedStyle;

    const { borderColor } = style;

    return !!(style.backgroundColor
                  || (style.borderWidth       && borderColor)
                  || (style.borderTopWidth    && (borderColor  || style.borderTopColor))
                  || (style.borderBottomWidth && (borderColor  || style.borderBottomColor))
                  || (style.borderLeftWidth   && (borderColor  || style.borderLeftColor))
                  || (style.borderRightWidth  && (borderColor  || style.borderRightColor)));
  }

  // 废弃
  render(img) {
    const isDarkMode = this.root.isDarkMode();
    const style = isDarkMode
      ? Object.assign({}, this.styleInit, this.styleDarkInit, this.styleProp, this._innerStyle)
      : Object.assign({}, this.styleInit, this.styleProp, this._innerStyle);

    const baseX = this.layoutBox.absoluteX;
    const baseY = this.layoutBox.absoluteY;
    const boxWidth = this.layoutBox.width;
    const boxHeight = this.layoutBox.height;
    const borderWidth = style.borderWidth || 0;
    let finalX = baseX - borderWidth; // eslint-disable-line
    let finalY = baseY - borderWidth; // eslint-disable-line
    let { width, height } = img;

    if (style.backgroundSize) {
      const splitVal = style.backgroundSize.split(' ');
      if (splitVal.length === 2) {
        const setWidth = splitVal[0];
        const setHeight = splitVal[1];
        width = setWidth[setWidth.length - 1] === '%' ? (boxWidth * parseFloat(setWidth.slice(0, -1))) / 100 : parseFloat(setWidth);
        height = setHeight[setHeight.length - 1] === '%' ? (boxHeight * parseFloat(setHeight.slice(0, -1))) / 100 : parseFloat(setHeight);
      } else if (splitVal.length === 1) {
        const imgRatio = width / height;
        const boxRatio = boxWidth / boxHeight;
        switch (splitVal[0]) {
          case 'contain':
            if (imgRatio < boxRatio) {
              height = boxHeight;
              width = height * imgRatio;
              if (!style.backgroundPosition) {
                finalY = baseY;
                finalX = baseX + (boxWidth - width) / 2;
              }
            } else {
              width = boxWidth;
              height = width / imgRatio;
              if (!style.backgroundPosition) {
                finalX = baseX;
                finalY = baseY + (boxHeight - height) / 2;
              }
            }
            break;
          case 'cover':
            if (imgRatio < boxRatio) {
              width = boxWidth;
              height = width / imgRatio;
              if (!style.backgroundPosition) {
                finalX = baseX;
                finalY = baseY - (height - boxHeight) / 2;
              }
            } else {
              height = boxHeight;
              width = height * imgRatio;
              if (!style.backgroundPosition) {
                finalY = baseY;
                finalX = baseX - (width - boxWidth) / 2;
              }
            }
            break;
        }
      }
    }

    if (style.backgroundPosition) {
      let [x, y] = style.backgroundPosition.split(' ');
      switch (x) {
        case 'left':
          x = '0%';
          break;
        case 'center':
          x = '50%';
          break;
        case 'right':
          x = '100%';
      }
      switch (y) {
        case 'top':
          y = '0%';
          break;
        case 'center':
          y = '50%';
          break;
        case 'bottom':
          y = '100%';
      }
      x = x[x.length - 1] === '%' ? ((boxWidth - width) * parseFloat(x.slice(0, -1))) / 100 : parseFloat(x);
      y = y[y.length - 1] === '%' ? ((boxHeight - height) * parseFloat(y.slice(0, -1))) / 100 : parseFloat(y);
      finalX += x; // eslint-disable-line
      finalY += y; // eslint-disable-line
    }

    // this.glRect.setTexture({
    //     image: img,
    //     rect: [finalX - baseX, finalY - baseY, width, height]
    // })
  }

  // 废弃
  loadImg(src, callback = none) {
    const img = this.root.imgPool.get(src);
    if (img && img.loadDone) {
      callback(img);
    } else if (img && !img.loadDone) {
      img.onloadcbks.push(callback);
    } else {
      const newImg = this.root.canvasContext.createImage();
      newImg.onloadcbks = [];
      this.root.imgPool.set(src, newImg);
      newImg.onload = () => {
        // newImg.onloadcbks.forEach(fn => fn(newImg));
        callback = newImg.onloadcbks.pop() || callback;
        newImg.onloadcbks = [];
        newImg.loadDone = true;
        callback(newImg);
        this.repaint();
      };
      newImg.setSrc(src);
    }
  }

  // 废弃
  insert(isDarkMode) {
    super.insert(isDarkMode);
    // const isDarkMode = this.root.isDarkMode();
    const style = isDarkMode
      ? Object.assign({}, this.styleInit, this.styleDarkInit, this.styleProp, this._innerStyle)
      : Object.assign({}, this.styleInit, this.styleProp, this._innerStyle);
    if (style.backgroundImage) {
      this.loadImg(style.backgroundImage, (img) => {
        this.render(img);
      });
    }
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


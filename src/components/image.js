import Element from './elements.js';
import imageManager from '../common/imageManager';

export default class Image extends Element {
  constructor(opts) {
    const {
      style = {},
      props = {},
      idName = '',
      className = '',
      src = '',
      dataset,
    } = opts;

    super({
      props,
      idName,
      className,
      dataset,
      style,
    });

    this.imgsrc = src;

    Object.defineProperty(this, 'src', {
      get() {
        return this.imgsrc;
      },
      set(newValue) {
        if (newValue !== this.imgsrc) {
          this.imgsrc = newValue;
          imageManager.loadImage(this.src, (img) => {
            this.img = img;
            // 当图片加载完成，实例可能已经被销毁了
            this.root.emit('repaint');
          });
        }
      },
      enumerable: true,
      configurable: true,
    });

    this.type = 'Image';

    this.img = imageManager.loadImage(this.src, (img, fromCache) => {
      if (fromCache) {
        this.img = img;
      } else {
        // 当图片加载完成，实例可能已经被销毁了
        this.root.emit('repaint');
      }
    });
  }

  repaint() {
    this.render();
  }

  // 子类填充实现
  destroySelf() {
    this.isDestroyed = true;
    this.img = null;

    delete this.src;

    this.root = null;
  }

  render() {
    if (!this.img || !this.img.loadDone) {
      return;
    }

    const style = this.style || {};
    const box = this.layoutBox;
    const { ctx } = this;

    ctx.save();

    if (style.borderColor) {
      ctx.strokeStyle = style.borderColor;
    }

    ctx.lineWidth = style.borderWidth || 0;

    const drawX = box.absoluteX;
    const drawY = box.absoluteY;

    const { needClip, needStroke } = this.renderBorder(ctx);

    if (needClip) {
      ctx.clip();
    }

    try {
      ctx.drawImage(this.img, drawX, drawY, box.width, box.height);
    } catch (e) {
      debugger;
    }

    if (needStroke) {
      ctx.stroke();
    }

    ctx.restore();
  }
}

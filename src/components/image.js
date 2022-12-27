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
            this.emit('repaint');
          });
        }
      },
      enumerable: true,
      configurable: true,
    });

    this.type = 'Image';
    this.renderBoxes = [];

    this.img = imageManager.loadImage(this.src, (img, fromCache) => {
      if (fromCache) {
        this.img = img;
      } else {
        // 当图片加载完成，实例可能已经被销毁了
        if (this.img && this.isScrollViewChild) {
          this.EE.emit('image__render__done', this);
        }
      }
    });
  }

  get isScrollViewChild() {
    let flag = false;
    let { parent } = this;
    while (parent && !flag) {
      if (parent.type === 'ScrollView') {
        flag = true;
      } else {
        parent = parent.parent;
      }
    }

    return flag;
  }

  repaint() {
    this.renderBoxes.forEach((item) => {
      this.render(item.ctx, item.box, false);
    });
  }

  // 子类填充实现
  destroySelf() {
    this.isDestroyed = true;
    this.img = null;

    delete this.src;

    this.root = null;
  }

  render(ctx, layoutBox) {
    if (!this.img || !this.img.loadDone) {
      return;
    }

    const style = this.style || {};
    const box = layoutBox || this.layoutBox;

    ctx.save();

    if (style.borderColor) {
      ctx.strokeStyle = style.borderColor;
    }

    ctx.lineWidth = style.borderWidth || 0;

    const drawX = box.absoluteX;
    const drawY = box.absoluteY;

    const { needClip, needStroke } = this.renderBorder(ctx, layoutBox);

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

  insert(ctx, box) {
    this.renderBoxes.push({ ctx, box });

    this.img = imageManager.loadImage(this.src, (img, fromCache) => {
      // 来自缓存的，还没返回img就会执行回调函数
      if (fromCache) {
        this.img = img;
        this.render(ctx, box, false);
      } else {
        // 当图片加载完成，实例可能已经被销毁了
        if (this.img) {
          const eventName = this.isScrollViewChild
            ? 'image__render__done'
            : 'one__image__render__done';
          this.EE.emit(eventName, this);
        }
      }
    });
  }
}

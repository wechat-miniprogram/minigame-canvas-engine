import View                from './view.js';
import Touch               from '../common/touch.js';
import {throttle, createCanvas} from '../common/util.js';

export default class ScrollView extends View {
  constructor({
    style={},
    props={},
    name ='',
  }) {
    super({
      props,
      name,
      style,
    });

    this.type            = 'ScrollView';

    // 当前列表滚动的值
    this.top             = 0;

    // 滚动处理器
    this.touch           = new Touch();

    // 图片加载完成之后会触发scrollView的重绘函数，当图片过多的时候用节流提升性能
    this.throttleImageLoadDone = throttle(this.childImageLoadDoneCbk, 32, this);

    this.scrollCanvas = null;
    this.scrollCtx = null;

    this.requestID = null;
  }

  /**
   * 获取滚动列表内所有元素的高度和
   * 这里不能简单将所有子元素的高度累加，因为每个元素之间可能是有空隙的
   */
  get scrollHeight() {
    // scrollview为空的情况
    if (!this.children.length) {
      return 0;
    }

    const last = this.children[this.children.length - 1];

    return last.layoutBox.top + last.layoutBox.height;
  }

  repaint() {
    this.clear();

    this.renderBoxes.forEach( item => {
      this.render(item.ctx, item.box);
    });

    this.scrollRender(this.top);
  }

  /**
   * 与主canvas的尺寸保持一致
   */
  updateRenderPort(renderport) {
    this.renderport = renderport;

    this.scrollCanvas = createCanvas();
    this.scrollCtx    = this.scrollCanvas.getContext('2d');

    this.scrollCanvas.width  = this.renderport.width;
    this.scrollCanvas.height = this.renderport.height;
  }

  destroySelf() {
    this.touch           = null;
    this.isDestroyed     = true;

    this.root.off('repaint__done');
    this.ctx             = null;
    this.children        = null;
    this.root            = null;

    this.scrollCanvas = null;
    this.scrollCtx = null;

    this.requestID && cancelAnimationFrame(this.requestID)
  }

  renderTreeWithTop(tree, top) {
    const layoutBox = tree.layoutBox;
    // 计算实际渲染的Y轴位置
    layoutBox.absoluteY = layoutBox.originalAbsoluteY - top;
    tree.render(this.scrollCtx, layoutBox);

    tree.children.forEach( child => {
      this.renderTreeWithTop(child, top);
    });
  }

  clear() {
    const box   = this.layoutBox;
    this.ctx.clearRect(box.absoluteX, box.absoluteY, box.width, box.height);
    this.scrollCtx.clearRect(0, 0, this.renderport.width, this.renderport.height)
  }

  scrollRender(top) {
    this.requestID = requestAnimationFrame(() => {
      const box   = this.layoutBox;
      this.top = -top;
      // scrollview在全局节点中的Y轴位置
      const abY   = box.absoluteY;

      // 根据滚动值获取裁剪区域
      const startY = abY + this.top;
      const endY   = abY + this.top + box.height;

      // 清理滚动画布和主屏画布
      this.clear();

      this.children.forEach(child => {
        const layoutBox = child.layoutBox;
        const height = layoutBox.height;
        let originY   = layoutBox.originalAbsoluteY;

        // 判断处于可视窗口内的子节点，渲染该子节点
        if (originY + height >= startY && originY <= endY) {
          this.renderTreeWithTop(child, this.top);
        }
      });
    this.ctx.drawImage(
      this.scrollCanvas,
      box.absoluteX, box.absoluteY,
      box.width, box.height,
      box.absoluteX, box.absoluteY,
      box.width, box.height,
    );
    });

  }

  childImageLoadDoneCbk(img) {
    const box   = this.layoutBox;

    // 根据滚动值获取裁剪区域
    const startY = box.absoluteY + this.top;
    const endY   = box.absoluteY + this.top + box.height;

    const layoutBox = img.layoutBox;
    const height = layoutBox.height;
    let originY   = layoutBox.originalAbsoluteY;

    // 判断处于可视窗口内的子节点，渲染该子节点
    if (originY + height >= startY && originY <= endY) {
      this.scrollRender(-this.top);
    }
  }

  insertScrollView(context) {
    // 绘制容器
    this.insert(context);

    // Layout提供了repaint API，会抛出repaint__done事件，scrollview执行相应的repaint逻辑
    this.root.on('repaint__done', () => {
      this.scrollRender(this.top)
    });

    this.scrollRender(0);

    // 图片加载可能是异步的，监听图片加载完成事件完成列表重绘逻辑
    this.EE.on('image__render__done', (img) => {
      this.throttleImageLoadDone(img);
    });

    /**
     * scrollview子元素总高度大于盒子高度，绑定滚动事件
     */
    if ( this.scrollHeight > this.layoutBox.height ) {
      this.touch.setTouchRange(
        -(this.scrollHeight - this.layoutBox.height),
        0,
        this.scrollRender.bind(this)
      );

      // 监听触摸相关事件，将滚动处理逻辑交给相应的处理器处理
      this.on('touchstart', this.touch.startFunc);
      this.on('touchmove',  this.touch.moveFunc);
      this.on('touchend',   this.touch.endFunc);
    }
  }
}


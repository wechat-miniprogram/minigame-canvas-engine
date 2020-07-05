import View                from './view.js';
import Pool                from '../common/pool.js';
import Touch               from '../common/touch.js';
import {
  throttle,
  STATE,
  createCanvas,
  repaintTree,
} from '../common/util.js';

let id = 0;

const canvasPool = new Pool('canvasPool');

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

    // canvas高度不能过高，在小游戏里面，对canvas尺寸是有限制的
    this.pageHeight      = 2000;

    // 根据列表总高度和单页高度计算的分页数量
    this.pageCount       = 1;
    this.canvasMap       = {};

    // 图片加载完成之后会触发scrollView的重绘函数，当图片过多的时候用节流提升性能
    this.throttleImageLoadDone = throttle(this.childImageLoadDoneCbk, 32, this);

    this.renderTimers = [];

    this.requestID = null;

    this.highPerformance = false;
    this.scrollCanvas = null;
    this.scrollCtx = null;
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

    if (!this.highPerformance) {
      this.scrollRender(this.top)
    }
  }

  /**
   * 列表子元素重绘之前先将所有的canvas擦除
   */
  clear() {
    Object.keys(this.canvasMap).forEach( key => {
      let item = this.canvasMap[key];
      item.context && item.context.clearRect(0, 0, item.canvas.width, item.canvas.height);
    });
  }

  /**
   * 与主canvas的尺寸保持一致
   */
  updateRenderPort(renderport) {
    this.renderport = renderport;

    if (!this.highPerformance) {
      let can    = createCanvas();
      let ctx    = can.getContext('2d');

      can.width  = this.renderport.width;
      can.height = this.renderport.height;

      this.scrollCanvas = can;
      this.scrollCtx    = ctx;
    }
  }

  /**
   * 计算分页数据
   * 小游戏的canvas对尺寸有要求，如果如果高度过高，可能出现渲染不出来的情况
   * 因此需要手动分页，列表过长的时候将数据绘制到几个canvas上面，这里预创建几个canvas
   */
  calPageData() {
    this.pageCount = Math.ceil((this.scrollHeight + this.layoutBox.absoluteY) / this.pageHeight);

    for ( let i = 0; i < this.pageCount; i++ ) {
      let cache = canvasPool.get(i);
      if ( cache ) {
        cache.context && cache.context.clearRect(0, 0, cache.canvas.width, cache.canvas.height);
        cache.elements = [];

        this.canvasMap[i] = cache;
      } else {
        this.canvasMap[i] = {
          elements: [],
        }

        canvasPool.set(i, this.canvasMap[i]);
      }
    }
  }

  destroySelf() {
    this.touch           = null;
    this.isDestroyed     = true;

    this.renderTimers.forEach( timer => {
      clearTimeout(timer);
    });

    this.root.off('repaint__done');

    this.renderTimers = [];
    this.canvasMap    = {};
    this.ctx          = null;
    this.children     = null;

    this.requestID && cancelAnimationFrame(this.requestID);
    this.root          = null;

    this.scrollCanvas = null;
    this.scrollCtx = null;
  }

  renderTreeWithTop(tree, top) {
    const layoutBox = tree.layoutBox;
    const box = {...layoutBox}
    box.absoluteY -= top;
    tree.render(this.scrollCtx, box);

    tree.children.forEach( child => {
      this.renderTreeWithTop(child, top);
    });
  }

  scrollRender(top) {
    const start = new Date();
    const box   = this.layoutBox;
    this.top = -top;
    // scrollview在全局节点中的Y轴位置
    const abY   = box.absoluteY;

    // 根据滚动值获取裁剪区域
    const startY = abY + this.top;
    const endY   = abY + this.top + box.height;

    // 清理滚动画布和主屏画布
    this.ctx.clearRect(box.absoluteX, abY, box.width, box.height);
    this.scrollCtx.clearRect(0, 0, this.renderport.width, this.renderport.height)

    this.children.forEach(child => {
      const layoutBox = child.layoutBox;
      const height = layoutBox.height;
      let originY   = layoutBox.originalAbsoluteY;

      if (originY + height >= startY && originY <= endY) {
        this.renderTreeWithTop(child, this.top);
      }
    })

    this.ctx.drawImage(
      this.scrollCanvas,
      box.absoluteX, box.absoluteY,
      box.width, box.height,
      box.absoluteX, box.absoluteY,
      box.width, box.height,
    );

    /*console.log('scrollRender cost ', new Date() - start)*/
  }

  /**
   * 滚动列表重绘逻辑
   * 将分页canvas按照滚动裁剪绘制到主canvas上面
   */
  clipRepaint(top) {
    if ( this.isDestroyed ) {
      return;
    }

    this.requestID = requestAnimationFrame(() => {
      top         = -top;
      this.top    = top;
      const box   = this.layoutBox;
      // scrollview在全局节点中的Y轴位置
      const abY   = box.absoluteY;

      if ( this.isDestroyed || this.root.state === STATE.CLEAR ) {
        return;
      }

      // 在主canvas上面将滚动列表区域擦除
      this.ctx.clearRect(box.absoluteX, abY, box.width, box.height);

      // 背景填充
      this.ctx.fillStyle = this.parent.style.backgroundColor || '#ffffff';
      this.ctx.fillRect(box.absoluteX, abY, box.width, box.height);

      for ( let i = 0; i < this.pageCount; i++ ) {
        const canvas = this.canvasMap[i].canvas;
        // 根据滚动值获取裁剪区域
        const startY = abY + top;
        const endY   = abY + top + box.height;

        // 计算在裁剪区域内的canvas
        if (   startY < this.pageHeight * ( i + 1 )
          && endY > this.pageHeight * i  ) {

          /**
           * 这里不能按照box.width * box.height的区域去裁剪
           * 在浏览器里面正常，但是在小游戏里面会出现诡异的渲染出错，所以裁剪canvas真实有效的区域
           */
          let clipY   = (abY + top) - this.pageHeight * i;
          let clipH   = box.height;
          let renderY = abY;

          if ( clipY > 0 && this.pageHeight - clipY < box.height ) {
            clipH   = this.pageHeight - clipY;
          } else if ( clipY < 0 ) {
            clipH   = clipY + box.height;
            renderY = renderY - clipY;
            clipY   =  0;
          }

          this.ctx.drawImage(
            canvas,
            box.absoluteX, clipY, box.width, clipH,
            box.absoluteX, renderY, box.width, clipH,
          );
        }
      }
    })
  }

  /**
   * 前面已经计算了列表总共会分几页
   * 这里计算每一个子元素分别会属于那一页
   */
  renderChildren(tree) {
    const children = tree.children;
    const height   = this.pageHeight;

    Object.keys(children).forEach( id => {
      const child   = children[id];
      let originY   = child.layoutBox.originalAbsoluteY;
      let pageIndex = Math.floor(originY / height);
      let nextPage  = pageIndex + 1;

      child.layoutBox.absoluteY -= this.pageHeight * (pageIndex);

      if ( child.checkNeedRender() ) {
        this.canvasMap[pageIndex].elements.push({
          element: child, box: child.layoutBox
        });
      }

      // 对于跨界的元素，两边都绘制下
      if ( originY + child.layoutBox.height > height * nextPage ) {
        let tmpBox = Object.assign({}, child.layoutBox);
        tmpBox.absoluteY = originY - this.pageHeight * nextPage;

        if ( child.checkNeedRender() ) {
          this.canvasMap[nextPage].elements.push({
            element: child, box: tmpBox
          });
        }
      }

      this.renderChildren(child);
    });
  }

  insertElements(pageIndex) {
    let can    = createCanvas();
    let ctx    = can.getContext('2d');

    can.width  = this.renderport.width;
    can.height = this.pageHeight;
    ctx.id     = ++id;

    this.canvasMap[pageIndex].canvas  = can;
    this.canvasMap[pageIndex].context = ctx;

    this.canvasMap[pageIndex].elements.forEach( ele => {
      ele.element.insert(ctx, ele.box);
    });

    /**
     * 这里属于不太优雅的写法，小游戏里面扛不住一次性这么多的绘制
     * 简单加个定时器缓解渲染压力
     */
    if ( pageIndex < this.pageCount - 1 ) {
      let timer = setTimeout(() => {
        this.insertElements(++pageIndex);
      }, 250);

      this.renderTimers.push(timer);
    }
  }

  childImageLoadDoneCbk(img) {
    const list = Object.values(this.canvasMap);
    let pageIndex = -1;
    for ( let i = 0; i < list.length; i++ ) {
      if (list[i].elements.find(item => item.element === img)) {
        pageIndex = i;
        break;
      }
    }

    if ( pageIndex > -1) {
      const canItem = this.canvasMap[pageIndex];
      const canvas = canItem.canvas;
      const ctx = canItem.context;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      this.canvasMap[pageIndex].elements.forEach( ele => {
        repaintTree(ele.element);
      });
    }

    this.clipRepaint(-this.top);
  }

  insertScrollView(context) {
    // 绘制容器
    this.insert(context);

    // Layout提供了repaint API，会抛出repaint__done事件，scrollview执行相应的repaint逻辑
    this.root.on('repaint__done', () => {
      if(this.highPerformance) {
        this.clipRepaint(-this.top);
      }
    });

    /**
     * 高性能方案：用空间换时间，分页数据创建对应的canvas并绘制
     * 滚动过程中，只需要截取分页canvas绘制即可，不需要重新绘制每一个节点
     */
    if (this.highPerformance) {
      // 计算列表应该分割成几页
      this.calPageData();

      // 计算分页数据：每个元素应该坐落在哪个canvas
      this.renderChildren(this);

      // 渲染第一页数据
      this.insertElements(0);

      // 根据当前的滚动位置执行渲染
      this.clipRepaint(-this.top);
    } else {
      this.scrollRender(0);
    }

    // 图片加载可能是异步的，监听图片加载完成事件完成列表重绘逻辑
    this.EE.on('image__render__done', (img) => {
      /*this.throttleImageLoadDone(img)*/
    });

    /**
     * scrollview子元素总高度大于盒子高度，绑定滚动事件
     */
    if ( this.scrollHeight > this.layoutBox.height ) {
      const handler = this.highPerformance ? this.clipRepaint.bind(this) : this.scrollRender.bind(this);
      this.touch.setTouchRange(
        -(this.scrollHeight - this.layoutBox.height),
        0,
        handler
      );

      // 监听触摸相关事件，将滚动处理逻辑交给相应的处理器处理
      this.on('touchstart', this.touch.startFunc);
      this.on('touchmove',  this.touch.moveFunc);
      this.on('touchend',   this.touch.endFunc);
    }
  }
}


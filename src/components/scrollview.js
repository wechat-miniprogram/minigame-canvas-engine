import View                from './view.js';
import Pool                from '../common/pool.js';
import Touch               from '../common/touch.js';
import {
    throttle,
    STATE,
    createCanvas,
} from '../common/util.js';

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
        this.throttleRepaint = throttle(this.clipRepaint, 16, this);

        this.renderTimers = [];
    }

    /**
     * 获取滚动列表内所有元素的高度和
     * 这里不能简单将所有子元素的高度累加，因为每个元素之间可能是有空隙的
     */
    get scrollHeight() {
        let ids  = Object.keys(this.children);
        let last = this.children[ids[ids.length - 1]];

        return last.layoutBox.top + last.layoutBox.height;
    }

    // 重写基类的initRepaint方法，因为scrollView比较特殊，他有自己的绘制函数，因此repaint不需要上升到parent
    initRepaint() {
        this.on('repaint', () => {
            this.clear();
            this.repaint();
            this.clipRepaint(-this.top);
        });
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
     * 递归将整颗树的节点repaint一次
     * 由于renderChildren阶段已经计算过每个元素会在哪一个canvas绘制，并且子元素会保留这些绘制信息
     * 因为仅仅需要repaint而不需要重新renderChildren，以提升性能
     */
    repaint(tree) {
        if ( !tree ) {
            tree = this;
        }

        const children = tree.children;

        Object.keys(children).forEach( id => {
            const child = children[id];

            child.repaint();

            this.repaint(child);
        });
    }

    // 与主canvas的尺寸保持一致
    updateRenderPort(renderport) {
        this.renderport = renderport;
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
        this.throttleRepaint = null;

        this.renderTimers.forEach( timer => {
            clearTimeout(timer);
        });

        this.renderTimers = [];
        this.canvasMap    = {};
        this.ctx          = null;
        this.children     = null;
    }

    /**
     * 滚动列表重绘逻辑
     * 将分页canvas按照滚动裁剪绘制到主canvas上面
     */
    clipRepaint(top) {
        if ( this.isDestroyed ) {
            return;
        }
        top         = -top;
        this.top    = top;
        const box   = this.layoutBox;
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

                // let start = new Date();
                // this.canvasMap[i].elements.forEach( ele => {
                //     ele.element.insert(this.canvasMap[i].context, ele.box);
                // });
                // console.log(new Date() - start);

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
    }

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

        this.canvasMap[pageIndex].canvas  = can;
        this.canvasMap[pageIndex].context = ctx;

        /*canvasPool.set(pageIndex, this.canvasMap[pageIndex]);*/
        /*let ctx = this.canvasMap[pageIndex].context;*/

        // console.log('elements count', this.canvasMap[pageIndex].elements.length);

        // let start2 = new Date();

        this.canvasMap[pageIndex].elements.forEach( ele => {
            ele.element.insert(ctx, ele.box);
        });

        // console.log(new Date() - start2);

        if ( pageIndex < this.pageCount - 1 ) {
            let timer = setTimeout(() => {
                this.insertElements(++pageIndex);
            }, 250);

            this.renderTimers.push(timer);
        }
    }

    insertScrollView(context) {
        // 绘制容器
        this.insert(context);

        // 计算列表应该分割成几页
        this.calPageData();

        // 计算分页数据：每个元素应该坐落在哪个canvas
        this.renderChildren(this);

        this.insertElements(0);

        this.clipRepaint(-this.top);

        // 图片加载可能是异步的，监听图片加载完成事件完成列表重绘逻辑
        this.EE.on('image__render__done', () => {
            this.throttleRepaint(-this.top || 0);
        });

        if ( this.scrollHeight > this.layoutBox.height ) {
            this.touch.setTouchRange(
                -(this.scrollHeight - this.layoutBox.height),
                0,
                /*this.throttleRepaint,*/
                this.clipRepaint.bind(this),
            );

            // 监听触摸相关事件，将滚动处理逻辑交给相应的处理器处理
            this.on('touchstart', this.touch.startFunc);
            this.on('touchmove',  this.touch.moveFunc);
            this.on('touchend',   this.touch.endFunc);
        }
    }
}

import Element  from './elements.js';
import { none, createImage } from '../common/util.js';
import Pool     from '../common/pool.js';
import imageManager from '../common/imageManager';

const imgPool = new Pool('imgPool');

export default class Image extends Element {
    constructor(opts) {
        let {
            style={},
            props={},
            idName='',
            className='',
            src=''
        } = opts;

        super({
            props,
            idName,
            className,
            style,
        });

        this.imgsrc = src;

        Object.defineProperty(this, "src", {
            get : function(){
                return this.imgsrc;
            },
            set : function(newValue){
                if ( newValue !== this.imgsrc ) {
                    this.imgsrc = newValue;
                    imageManager.loadImage(this.src, (img, fromCache) => {
                        this.img = img;
                        /*this.repaint();*/
                        this.emit('repaint');
                    });
                }
            },
            enumerable   : true,
            configurable : true
        });

        this.type        = 'Image';
        this.renderBoxes = [];
    }

    repaint() {
        this.renderBoxes.forEach(item => {
            this.renderImg(item.ctx, item.box, false);
        });
    }

     // 子类填充实现
    destroySelf() {
        this.isDestroyed = true;
        this.img = null;

        delete this.src;

        this.off('img__load__done');
    }

    renderImg(ctx, layoutBox, needEmitEvent = true) {
        if ( !this.img ) {
            return;
        }

        const style = this.style || {};
        const box   = layoutBox || this.layoutBox;

        ctx.save();

        if ( style.borderColor ) {
            ctx.strokeStyle = style.borderColor;
        }

        ctx.lineWidth = style.borderWidth || 0;

        let drawX = box.absoluteX;
        let drawY = box.absoluteY;

        this.renderBorder(ctx, layoutBox);

        ctx.drawImage(this.img, drawX, drawY, box.width, box.height);

        ctx.restore();

        if ( needEmitEvent ) {
            this.EE.emit('image__render__done');
        }
    }

    insert(ctx, box) {
        this.renderBoxes.push({ ctx, box });

        this.img = imageManager.loadImage(this.src, (img, fromCache) => {
            // 来自缓存的，还没返回img就会执行回调函数
            if (fromCache) {
                this.img = img;
                this.renderImg(ctx, box);
            } else {
                // 当图片加载完成，实例可能已经被销毁了
                if (this.img) {
                    this.emit('img__load__done')
                    this.renderImg(ctx, box);
                }
            }
        });
    }
}

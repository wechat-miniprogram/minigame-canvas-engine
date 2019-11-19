import Element  from './elements.js';
import { none, createImage } from '../common/util.js';
import Pool     from '../common/pool.js';

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

                    this.initImg(() => {
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
        this.img         = null;

        this.off('img__load__done');
    }

    initImg(callback = none) {
        this.img         = null;
        this.imgLoadDone = false;
        const cache      = imgPool.get(this.src);

        if ( !this.src ) {
            this.imgLoadDone = true;
            callback();
            return;
        }

        if ( cache && cache.loadDone ) {
            this.img         = cache;
            this.imgLoadDone = true;
            callback();
        } else if ( cache && !cache.loadDone ) {
            this.img = cache;

            cache.onloadcbks.push(() => {
                if ( !this.img ) {
                    return;
                }

                this.imgLoadDone = true;
                this.emit('img__load__done');
                callback();
            });
        } else {
            this.img = createImage();
            this.img.onloadcbks = [];
            imgPool.set(this.src, this.img);

            this.img.onload = () => {
                if ( !this.img ) {
                    return;
                }

                if ( this.img ) {
                    this.img.onloadcbks.forEach(fn => fn());
                    this.img.onloadcbks = [];
                    this.img.loadDone   = true;
                    this.imgLoadDone    = true;
                }

                this.emit('img__load__done');

                callback();
            }

            this.img.onerror = (e) => {
                console.log('img load error', e);
            }

            this.img.src = this.src;
        }
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

        this.renderBorder(ctx);

        ctx.drawImage(this.img, drawX, drawY, box.width, box.height);

        ctx.restore();

        if ( needEmitEvent ) {
            this.EE.emit('image__render__done');
        }
    }

    insert(ctx, box) {
        this.renderBoxes.push({ ctx, box });
        this.initImg(() => {
            this.renderImg(ctx, box);
        });
    }
}

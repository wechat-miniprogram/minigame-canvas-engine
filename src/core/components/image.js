import Block from './block.js';
import { none, nextTick } from '../common/util.js';

export default class Image extends Block {
    constructor(opts) {
        const {
            styleInit = {},
            styleActive = {},
            styleDarkInit = {},
            styleDarkActive = {},
            props = {},
            dataset = {},
            idName = '',
            className = '',
            src = ''
        } = opts;
        super({
            props,
            dataset,
            idName,
            className,
            styleInit,
            styleActive,
            styleDarkInit,
            styleDarkActive
        });

        this.imgsrc = src;

        Object.defineProperty(this, "src", {
            get : function(){
                return this.imgsrc;
            },
            set : function(newValue){
                if ( newValue !== this.imgsrc ) {
                    this.imgsrc = newValue;

                    // this.initImg(() => {
                    //     this.render();
                    // });
                    this.glRect.setImage(newValue);
                }
            },
            enumerable   : true,
            configurable : true
        });

        this.type = 'Image';
        this.renderBoxes = [];

        nextTick(() => {
            if (this.root && this.root.canvasContext) {
                this.root.canvasContext.postMessage({
                    type: 'preload-image',
                    data: {
                        src: this.src
                    }
                })
            }
        })
    }

     // 子类填充实现
    destroySelf() {
        this.isDestroyed = true;
        if ( this.img ) {
            this.img.onloadcbks = [];
            this.img.onload  = null;
            this.img.onerror = null;
        }

        this.img         = null;

        delete this.src;
    }

    // 废弃
    initImg(callback = none) {
        this.img = null;
        this.imgLoadDone = false;
        const cache = this.root.imgPool.get(`${this.id}_${this.src}`);

        if (!this.src) {
            this.imgLoadDone = true;
            callback();
            return;
        }

        if (cache && cache.loadDone) {
            // console.log('cache done', this.className);
            this.img = cache;
            this.imgLoadDone = true;
            callback();
        } else if (cache && !cache.loadDone) {
            // console.log('cache not done', this.className);
            this.img = cache;

            cache.onloadcbks.push(() => {
                if ( !this.img ) {
                    return;
                }

                this.imgLoadDone = true;
                // this.emit('img__load__done');
                callback();
            });
        } else { // 第一次没有图片的时候，会走到这里
            // console.log('no cache', this.className);
            this.img = this.root.canvasContext.createImage();
            this.img.onloadcbks = [];
            this.root.imgPool.set(`${this.id}_${this.src}`, this.img);

            this.img.onload = () => {
                if (!this.img) {
                    return;
                }

                if (this.img) { // 清空所有的load回调
                    // this.img.onloadcbks.forEach(fn => fn());
                    callback = this.img.onloadcbks.pop() || callback;
                    this.img.onloadcbks = [];
                    this.img.loadDone   = true;
                    this.imgLoadDone    = true;
                }

                callback();
                this.repaint();
            }

            this.img.onerror = (e) => {
                // console.log('img load error', e);
            }
            this.img.setSrc(this.src);
        }
    }

    render(needEmitEvent = true) {
        if ( !this.img ) {
            return;
        }

        // this.glRect.setTexture({ image: this.img })
    }

    insert(isDarkMode) {
        super.insert(isDarkMode);
        this.glRect.setTexture({ type: 'image', src: this.src });
        this.initImg(() => {
            this.render();
        });
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

        // 设置图片
        this.glRect.setImage(this.src);
    }
}

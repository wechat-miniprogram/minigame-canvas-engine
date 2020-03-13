import Element from './elements.js';
import computeLayout                   from 'css-layout';
import BitMapFont  from '../common/bitMapFont';

export default class BitMapText extends Element {
    constructor(opts) {
        let {
            style={},
            props={},
            idName='',
            className='',
            value=''
        } = opts
        super({
            props,
            idName,
            className,
            style,
        });

        this.type = "BitMapText";
        this.ctx  = null;
        this.valuesrc = value;
        this.renderBoxes = []

        Object.defineProperty(this, "value", {
            get : function() {
                return this.valuesrc;
            },
            set : function(newValue){
                if ( newValue !== this.valuesrc) {
                    this.valuesrc = newValue;

                    this.emit('repaint');
                }
            },
            enumerable   : true,
            configurable : true
        });

        this.font = new BitMapFont('fnt_nuber_Star_Proficiency')
    }

    insert(ctx, box) {
        this.renderBoxes.push({ ctx, box });

        this.render(ctx, box)
    }

    repaint() {
        this.renderBoxes.forEach( item => {
            this.render(item.ctx, item.box);
        });
    }


    render(ctx, layoutBox) {
        /*this.style.width = 200;
        let tree = {
            style: this.parent.style,
            children: [
                {
                    style: this.style
                }
            ]
        }

        computeLayout(tree)
        console.log(tree)*/

        if ( this.font.ready ) {
            this.renderText(ctx, layoutBox)
        } else {
            this.font.event.on('text__load__done', () => {
                this.renderText(ctx, layoutBox)
            })
        }
    }

    getTextBounds() {
        const style = this.style;

        let { letterSpacing = 0 } = style;

        let width = 0;
        let height = 0;
        let offsetX = 0;
        let offsetY = 0;

        for ( let i = 0, len = this.value.length; i < len; i++ ) {
            let char = this.value[i];
            let cfg = this.font.chars[char]
            if ( cfg ) {
                width += cfg.w
                height = Math.max(cfg.h, height)

                if ( i < len - 1 ) {
                    width += letterSpacing
                }
            }
        }

        return { width, height}
    }

    renderText(ctx, layoutBox) {
        let bounds = this.getTextBounds()

        ctx.save();
        this.renderBorder(ctx, layoutBox);

        const box = layoutBox || this.layoutBox;
        const style = this.style;

        let {
            width = bounds.width, // 没有设置采用计算出来的宽度
            height = bounds.height, // 没有设置则采用计算出来的宽度
            lineHeight = bounds.height, // 没有设置则采用计算出来的高度
            textAlign, // 文字左右对齐方式
            textBaseline // 文字垂直对齐方式
        } =  style;

        let x = box.absoluteX;
        let y = box.absoluteY;

        let scaleY    = height / bounds.height;
        let realWidth = scaleY * bounds.width

        // 行高大于元素的高度，文字溢出容器，但是居中方式仍然按照lineHeight来
        if ( lineHeight && lineHeight > height ) {
            y += (lineHeight - height) / 2
        } else {
            // 行高小于等于元素的高度，textBaseline开始起作用
            if ( textBaseline === 'middle') {
            }
        }

        if ( width > realWidth && textAlign === 'center' ) {
            x += ( width - realWidth) / 2
        }


        console.log(width, height, realWidth)

        for ( let i = 0; i < this.value.length; i++ ) {
            let char = this.value[i];
            let cfg = this.font.chars[char]

            if ( cfg ) {
                ctx.drawImage(this.font.texture, cfg.x, cfg.y, cfg.w, cfg.h, x + cfg.offX, y + cfg.offY, cfg.w * scaleY, cfg.h * scaleY)
                x += cfg.w * scaleY;
            }
        }
    }
}


import Element from './elements.js';
import { createCanvas } from '../common/util.js';

const DEFAULT_FONT_FAMILY = 'PingFangSC-Regular,Helvetica Neue,Helvetica,Arial,Microsoft YaHei,SimSun,sans-serif';
let context = null;
const getContext = () => {
    if (context) {
        return context;
    }

    const canvas = createCanvas();
    canvas.width = 1
    canvas.height = 1
    context = canvas.getContext('2d');

    return context;
}


export default class Text extends Element {
    constructor({
        style={},
        props={},
        idName='',
        className='',
        value=''
    }) {
        if ( style.width === undefined ) {
            const context = getContext();
            context.font = `${style.fontSize || 12}px ${DEFAULT_FONT_FAMILY} ${style.fontWeight || ''}`;
            style.width = context.measureText(value).width || 0;
        }

        super({
            props,
            idName,
            className,
            style,
        });

        this.type  = 'Text';
        this.ctx   = null;
        this.valuesrc = value;

        this.renderBoxes = [];

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
    }

    toCanvasData() {
        let style = this.style || {};

        this.fontSize = style.fontSize || 12;
        this.textBaseline = 'top';
        this.font = `${style.fontWeight || ''} ${style.fontSize || 12}px ${DEFAULT_FONT_FAMILY}`;
        this.textAlign = style.textAlign || 'left';
        this.fillStyle = style.color || '#000';
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
        this.toCanvasData();
        ctx.save();

        const box = layoutBox || this.layoutBox;
        const style = this.style;

        ctx.textBaseline = this.textBaseline;
        ctx.font         = this.font;
        ctx.textAlign    = this.textAlign;

        let drawX = box.absoluteX;
        let drawY = box.absoluteY;

        this.renderBorder(ctx);

        if ( style.backgroundColor ) {
            ctx.fillStyle = style.backgroundColor;
            ctx.fillRect(drawX, drawY, box.width, box.height)
        }

        ctx.fillStyle = this.fillStyle;

        if ( this.textAlign === 'center' ) {
            drawX += box.width / 2;
        } else if ( this.textAlign === 'right' ) {
            drawX += box.width;
        }

        if ( style.lineHeight ) {
            ctx.textBaseline = 'middle';
            drawY += style.lineHeight / 2;
        }

        ctx.fillText(
          this.value,
          drawX,
          drawY
        );

        ctx.restore();
    }
}

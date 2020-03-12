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
        console.log('font', this.font)
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
        ctx.save();

        const box = layoutBox || this.layoutBox;
        const style = this.style;

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

        console.log(this.value, box)

        let x = box.absoluteX;
        let y = box.absoluteY;
        for ( let i = 0; i < this.value.length; i++ ) {
            let char = this.value[i];
            let cfg = this.font.chars[char]

            console.log(cfg)
            ctx.drawImage(this.font.texture, cfg.x, cfg.y, cfg.w, cfg.h, x, y, cfg.w * 3, cfg.h * 3)
            x += cfg.w * 3;
        }
    }
}


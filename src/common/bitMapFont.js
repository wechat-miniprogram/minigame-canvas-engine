import { createCanvas } from './util.js';
import imageManager from './imageManager';
import Pool from './pool';

const bitMapPool = new Pool('bitMapPool')
let Emitter = require('tiny-emitter');

/**
 * http://www.angelcode.com/products/bmfont/doc/file_format.html
 */
export default class BitMapFont {
    constructor(name, src, config) {
        let cache = bitMapPool.get(name)

        if ( cache ) {
            return cache
        }

        this.config  = config;
        this.chars   = this.parseConfig(config)
        this.ready   = false;
        this.event = new Emitter();

        this.texture = imageManager.loadImage(src, () => {
            this.ready = true;
            this.event.emit('text__load__done');
        })

        bitMapPool.set(name, this)
    }

    parseConfig(fntText) {
        fntText = fntText.split("\r\n").join("\n");
        let lines = fntText.split("\n");

        let charsCount = this.getConfigByKey(lines[3], "count")
        this.lineHeight = this.getConfigByKey(lines[1], 'lineHeight')
        this.fontSize   = this.getConfigByKey(lines[0], 'size')

        let chars = {};
        for (let i= 4; i < 4 + charsCount; i++) {
            let charText = lines[i];
            let letter = String.fromCharCode(this.getConfigByKey(charText, "id"));
            let c = {};
            chars[letter] = c;
            c["x"] = this.getConfigByKey(charText, "x");
            c["y"] = this.getConfigByKey(charText, "y");
            c["w"] = this.getConfigByKey(charText, "width");
            c["h"] = this.getConfigByKey(charText, "height");
            c["offX"] = this.getConfigByKey(charText, "xoffset");
            c["offY"] = this.getConfigByKey(charText, "yoffset");
            c["xadvance"] = this.getConfigByKey(charText, "xadvance");
        }

        return chars;
    }

    getConfigByKey(configText, key){
        let itemConfigTextList = configText.split(" ");

        for (let i = 0 , length = itemConfigTextList.length; i < length; i++) {
            let itemConfigText = itemConfigTextList[i];
            if (key === itemConfigText.substring(0, key.length)) {
                let value = itemConfigText.substring(key.length + 1);
                return parseInt(value);
            }
        }

        return 0;
    }
}

/*new BitMapFont()*/


/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


/* eslint-disable */
const __placeImgeUrlHttps = 'https';
const __emojisReg = '';
const __emojisBaseSrc = '';
const __emojis = {};
const HTMLParser = __webpack_require__(2);
// Block Elements - HTML 5
const block = makeMap('br,a,code,address,article,applet,aside,audio,blockquote,button,canvas,center,dd,del,dir,div,dl,dt,fieldset,figcaption,figure,footer,form,frameset,h1,h2,h3,h4,h5,h6,header,hgroup,hr,iframe,ins,isindex,li,map,menu,noframes,noscript,object,ol,output,p,pre,section,script,table,tbody,td,tfoot,th,thead,tr,ul,video');
// Inline Elements - HTML 5
const inline = makeMap('abbr,acronym,applet,b,basefont,bdo,big,button,cite,del,dfn,em,font,i,iframe,img,input,ins,kbd,label,map,object,q,s,samp,script,select,small,span,strike,strong,sub,sup,textarea,tt,u,var');
// Elements that you can, intentionally, leave open
// (and which close themselves)
const closeSelf = makeMap('colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr');
function makeMap(str) {
    const obj = {};
    const items = str.split(',');
    for (let i = 0; i < items.length; i++)
        obj[items[i]] = true;
    return obj;
}
function q(v) {
    return `"${v}"`;
}
function removeDOCTYPE(html) {
    return html
        .replace(/<\?xml.*\?>\n/, '')
        .replace(/<.*!doctype.*\>\n/, '')
        .replace(/<.*!DOCTYPE.*\>\n/, '');
}
function trimHtml(html) {
    return html
        .replace(/\r?\n+/g, '')
        .replace(/<!--.*?-->/ig, '')
        .replace(/\/\*.*?\*\//ig, '')
        .replace(/[ ]+</ig, '<');
}
function html2json(html) {
    // 处理字符串
    html = removeDOCTYPE(html);
    html = trimHtml(html);
    html = strDiscode(html);
    // 生成node节点
    const bufArray = [];
    const results = {
        node: '',
        nodes: [],
        images: [],
        imageUrls: [],
    };
    let index = 0;
    HTMLParser(html, {
        start(tag, attrs, unary) {
            // debug(tag, attrs, unary);
            // node for this element
            const node = {
                node: 'element',
                tag,
            };
            if (bufArray.length === 0) {
                node.index = index.toString();
                index += 1;
            }
            else {
                var parent = bufArray[0];
                if (parent.nodes === undefined) {
                    parent.nodes = [];
                }
                node.index = `${parent.index}.${parent.nodes.length}`;
            }
            if (block[tag]) {
                node.tagType = 'block';
            }
            else if (inline[tag]) {
                node.tagType = 'inline';
            }
            else if (closeSelf[tag]) {
                node.tagType = 'closeSelf';
            }
            if (attrs.length !== 0) {
                node.attr = attrs.reduce((pre, attr) => {
                    const { name } = attr;
                    let { value } = attr;
                    if (name == 'class') {
                        // console.dir(value);
                        //  value = value.join("")
                        node.classStr = value;
                    }
                    // has multi attibutes
                    // make it array of attribute
                    if (name == 'style') {
                        // console.dir(value);
                        //  value = value.join("")
                        node.styleStr = value;
                    }
                    if (value.match(/ /)) {
                        value = value.split(' ');
                    }
                    // if attr already exists
                    // merge it
                    if (pre[name]) {
                        if (Array.isArray(pre[name])) {
                            // already array, push to last
                            pre[name].push(value);
                        }
                        else {
                            // single value, make it array
                            pre[name] = [pre[name], value];
                        }
                    }
                    else {
                        // not exist, put it
                        pre[name] = value;
                    }
                    return pre;
                }, {});
            }
            if (unary) {
                // if this tag doesn't have end tag
                // like <img src="hoge.png"/>
                // add to parents
                var parent = bufArray[0] || results;
                if (parent.nodes === undefined) {
                    parent.nodes = [];
                }
                parent.nodes.push(node);
            }
            else {
                bufArray.unshift(node);
            }
        },
        end(tag) {
            // debug(tag);
            // merge into parent tag
            const node = bufArray.shift();
            if (node.tag !== tag)
                console.error('invalid state: mismatch end tag');
            // 当有缓存source资源时于于video补上src资源
            if (node.tag === 'video' && results.source) {
                node.attr.src = results.source;
                delete results.source;
            }
            if (bufArray.length === 0) {
                results.nodes.push(node);
            }
            else {
                const parent = bufArray[0];
                if (parent.nodes === undefined) {
                    parent.nodes = [];
                }
                parent.nodes.push(node);
            }
        },
        chars(text) {
            // debug(text);
            const node = {
                node: 'text',
                text,
                // textArray: transEmojiStr(text),
            };
            if (bufArray.length === 0) {
                node.index = index.toString();
                index += 1;
                results.nodes.push(node);
            }
            else {
                const parent = bufArray[0];
                if (parent.nodes === undefined) {
                    parent.nodes = [];
                }
                node.index = `${parent.index}.${parent.nodes.length}`;
                parent.nodes.push(node);
            }
        },
        comment(text) {
        },
    });
    return results;
}
function strcharacterDiscode(str) {
    str = str.replace(/&nbsp;/g, ' ');
    str = str.replace(/&quot;/g, "'");
    str = str.replace(/&amp;/g, '&');
    str = str.replace(/&lt;/g, '<');
    str = str.replace(/&gt;/g, '>');
    str = str.replace(/&#8226;/g, '•');
    return str;
}
function strMoreDiscode(str) {
    str = str.replace(/\r\n/g, '');
    str = str.replace(/\n/g, '');
    str = str.replace(/code/g, 'wxxxcode-style');
    return str;
}
function strDiscode(str) {
    str = strcharacterDiscode(str);
    str = strMoreDiscode(str);
    return str;
}
function transEmojiStr(str) {
    const emojiObjs = [];
    // 如果正则表达式为空
    if (__emojisReg.length == 0 || !__emojis) {
        var emojiObj = {};
        emojiObj.node = 'text';
        emojiObj.text = str;
        array = [emojiObj];
        return array;
    }
    // 这个地方需要调整
    str = str.replace(/\[([^\[\]]+)\]/g, ':$1:');
    const eReg = new RegExp('[:]');
    var array = str.split(eReg);
    for (let i = 0; i < array.length; i++) {
        const ele = array[i];
        var emojiObj = {};
        if (__emojis[ele]) {
            emojiObj.node = 'element';
            emojiObj.tag = 'emoji';
            emojiObj.text = __emojis[ele];
            emojiObj.baseSrc = __emojisBaseSrc;
        }
        else {
            emojiObj.node = 'text';
            emojiObj.text = ele;
        }
        emojiObjs.push(emojiObj);
    }
    return emojiObjs;
}
module.exports = {
    html2json,
};


/***/ }),
/* 2 */
/***/ ((module) => {


/* eslint-disable */
// Regular Expressions for parsing tags and attributes
const startTag = /^<([-A-Za-z0-9_]+)((?:\s+[a-zA-Z_:][-a-zA-Z0-9_:.]*(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)>/;
const endTag = /^<\/([-A-Za-z0-9_]+)[^>]*>/;
const attr = /([a-zA-Z_:][-a-zA-Z0-9_:.]*)(?:\s*=\s*(?:(?:"((?:\\.|[^"])*)")|(?:'((?:\\.|[^'])*)')|([^>\s]+)))?/g;
// Empty Elements - HTML 5
const empty = makeMap('area,base,basefont,br,col,frame,hr,img,input,link,meta,param,embed,command,keygen,source,track,wbr');
// Block Elements - HTML 5
const block = makeMap('a,address,code,article,applet,aside,audio,blockquote,button,canvas,center,dd,del,dir,div,dl,dt,fieldset,figcaption,figure,footer,form,frameset,h1,h2,h3,h4,h5,h6,header,hgroup,hr,iframe,ins,isindex,li,map,menu,noframes,noscript,object,ol,output,p,pre,section,script,table,tbody,td,tfoot,th,thead,tr,ul,video');
// Inline Elements - HTML 5
const inline = makeMap('abbr,acronym,applet,b,basefont,bdo,big,br,button,cite,del,dfn,em,font,i,iframe,img,input,ins,kbd,label,map,object,q,s,samp,script,select,small,span,strike,strong,sub,sup,textarea,tt,u,var');
// Elements that you can, intentionally, leave open
// (and which close themselves)
const closeSelf = makeMap('colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr');
// Attributes that have their values filled in disabled="disabled"
const fillAttrs = makeMap('checked,compact,declare,defer,disabled,ismap,multiple,nohref,noresize,noshade,nowrap,readonly,selected');
// Special Elements (can contain anything)
const special = makeMap('wxxxcode-style,script,style,view,scroll-view,block');
function HTMLParser(html, handler) {
    let index;
    let chars;
    let match;
    const stack = [];
    let last = html;
    stack.last = function () {
        return this[this.length - 1];
    };
    while (html) {
        chars = true;
        // Make sure we're not in a script or style element
        if (!stack.last() || !special[stack.last()]) {
            // Comment
            if (html.indexOf('<!--') == 0) {
                index = html.indexOf('-->');
                if (index >= 0) {
                    if (handler.comment) {
                        handler.comment(html.substring(4, index));
                    }
                    html = html.substring(index + 3);
                    chars = false;
                }
                // end tag
            }
            else if (html.indexOf('</') == 0) {
                match = html.match(endTag);
                if (match) {
                    html = html.substring(match[0].length);
                    match[0].replace(endTag, parseEndTag);
                    chars = false;
                }
                // start tag
            }
            else if (html.indexOf('<') == 0) {
                match = html.match(startTag);
                if (match) {
                    html = html.substring(match[0].length);
                    match[0].replace(startTag, parseStartTag);
                    chars = false;
                }
            }
            if (chars) {
                index = html.indexOf('<');
                let text = '';
                while (index === 0) {
                    text += '<';
                    html = html.substring(1);
                    index = html.indexOf('<');
                }
                text += index < 0 ? html : html.substring(0, index);
                html = index < 0 ? '' : html.substring(index);
                if (handler.chars) {
                    handler.chars(text);
                }
            }
        }
        else {
            html = html.replace(new RegExp(`([\\s\\S]*?)<\/${stack.last()}[^>]*>`), (all, text) => {
                text = text.replace(/<!--([\s\S]*?)-->|<!\[CDATA\[([\s\S]*?)]]>/g, '$1$2');
                if (handler.chars) {
                    handler.chars(text);
                }
                return '';
            });
            parseEndTag('', stack.last());
        }
        if (html == last) {
            throw `Parse Error: ${html}`;
        }
        last = html;
    }
    // Clean up any remaining tags
    parseEndTag();
    function parseStartTag(tag, tagName, rest, unary) {
        tagName = tagName.toLowerCase();
        if (block[tagName]) {
            while (stack.last() && inline[stack.last()]) {
                parseEndTag('', stack.last());
            }
        }
        if (closeSelf[tagName] && stack.last() == tagName) {
            parseEndTag('', tagName);
        }
        unary = empty[tagName] || !!unary;
        if (!unary) {
            stack.push(tagName);
        }
        if (handler.start) {
            const attrs = [];
            rest.replace(attr, function (match, name) {
                const value = arguments[2] ? arguments[2]
                    : arguments[3] ? arguments[3]
                        : arguments[4] ? arguments[4]
                            : fillAttrs[name] ? name : '';
                attrs.push({
                    name,
                    value,
                    escaped: value.replace(/(^|[^\\])"/g, '$1\\\"'), // "
                });
            });
            if (handler.start) {
                handler.start(tagName, attrs, unary);
            }
        }
    }
    function parseEndTag(tag, tagName) {
        // If no tag name is provided, clean shop
        if (!tagName) {
            var pos = 0;
        }
        // Find the closest opened tag of the same type
        else {
            tagName = tagName.toLowerCase();
            for (var pos = stack.length - 1; pos >= 0; pos--) {
                if (stack[pos] == tagName) {
                    break;
                }
            }
        }
        if (pos >= 0) {
            // Close all the open elements, up the stack
            for (let i = stack.length - 1; i >= pos; i--) {
                if (handler.end) {
                    handler.end(stack[i]);
                }
            }
            // Remove the open elements from the stack
            stack.length = pos;
        }
    }
}
function makeMap(str) {
    const obj = {};
    const items = str.split(',');
    for (let i = 0; i < items.length; i++) {
        obj[items[i]] = true;
    }
    return obj;
}
module.exports = HTMLParser;


/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   getCharWidth: () => (/* binding */ getCharWidth)
/* harmony export */ });
/* harmony import */ var _htmlparser_html2json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var _htmlparser_html2json__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_htmlparser_html2json__WEBPACK_IMPORTED_MODULE_0__);

const DEFAULT_FONT_FAMILY = 'sans-serif';
function createCanvas() {
    if (typeof __env !== 'undefined') {
        return __env.createCanvas();
    }
    return document.createElement('canvas');
}
let ctx;
/**
 * @description 获取字符宽度
 * @param char
 * @param fontSize
 */
const getCharWidth = (char, fontSize) => {
    if (!ctx) {
        const canvas = createCanvas();
        ctx = canvas.getContext('2d');
    }
    const { width } = ctx.measureText(char);
    return (width * fontSize) / 10;
};
function iterateTree(element, callback) {
    if (callback) {
        callback(element);
    }
    if (element.nodes) {
        element.nodes.forEach((child) => {
            child.parent = element;
            iterateTree(child, callback);
        });
    }
}
function install(layout) {
    class RichText extends layout.Element {
        constructor(opts) {
            const { style = {}, idName = '', className = '', dataset, } = opts;
            super({
                idName,
                className,
                dataset,
                style,
            });
            this.innerText = '';
            this.jsonData = null;
            this.dcs = [];
            this.textBaseline = 'top';
            this.font = '';
            this.textAlign = 'left';
            this.fillStyle = '#000000';
        }
        set text(value) {
            if (value === this.innerText) {
                return;
            }
            this.innerText = value;
            const jsonData = _htmlparser_html2json__WEBPACK_IMPORTED_MODULE_0___default().html2json(this.innerText);
            this.jsonData = jsonData;
            this.buildDrawCallFromJsonData(this.jsonData);
        }
        get text() {
            return this.innerText;
        }
        setStyleForDc(currDc, styleObj) {
            if (styleObj['font-weight']) {
                currDc.fontWeight = styleObj['font-weight'];
            }
            if (styleObj['font-style']) {
                currDc.fontStyle = styleObj['font-style'];
            }
            if (styleObj.color) {
                currDc.filleStyle = styleObj.color;
            }
            if (styleObj['font-size']) {
                currDc.fontSize = styleObj['font-size'].replace('px', '');
            }
            if (styleObj['text-align']) {
                currDc.textAlign = styleObj['text-align'];
            }
        }
        buildDrawCallFromJsonData(jsonData) {
            const { width = 0, fontSize = 12, } = this.style;
            let lineHeight = this.style.lineHeight || 16;
            // 针对整个节点树进行解析，算出最后需要独立调用 canvas API 绘制的列表
            let dcs = [];
            // 换行标记
            let lines = -1;
            // 当前行宽度标记
            let lineWidth = 0;
            let currDc;
            function createDc() {
                let dc = {
                    filleStyle: null,
                    fontStyle: null,
                    fontWeight: null,
                    fontSize: null,
                    textAlign: null,
                    text: '',
                    x: 0,
                    y: 0,
                };
                dcs.push(dc);
                currDc = dc;
                currDc.x = lineWidth;
                currDc.y = lineHeight * lines;
                return dc;
            }
            iterateTree(jsonData, (node) => {
                var _a, _b, _c;
                // tagType： block、inline
                const { tagType, tag, styleStr } = node;
                // block类型新起一行
                if (tagType === 'block') {
                    lines += 1;
                    lineWidth = 0;
                    createDc();
                }
                // 加粗
                if (tag === 'strong') {
                    // 当前dc并不是加粗文本且并不为空，需要创建新的 dc
                    if (currDc.fontWeight !== 'bold' && currDc.text) {
                        createDc();
                        currDc.fontWeight = 'bold';
                    }
                    // 本身刚刚新起一行，不再需要创建新的，直接用即可
                    if (currDc.text === '') {
                        currDc.fontWeight = 'bold';
                    }
                    if (!node.styleObj) {
                        node.styleObj = {};
                    }
                    node.styleObj['font-weight'] = 'bold';
                }
                let styleObj = {};
                /**
                 * 当前标签有样式的情况
                 * 1. 处理样式，目前支持颜色、加粗、字体大小
                 * 2. 目前暴力处理，不管当前dc什么状态，只要是有 style 就创建新的dc
                 */
                if (styleStr) {
                    styleStr.split(';').filter(item => !!item).reduce((res, curr) => {
                        const temp = curr.split(':');
                        if (temp.length) {
                            res[temp[0]] = temp[1].trim();
                        }
                        return res;
                    }, styleObj);
                    if (styleObj) {
                        createDc();
                        // 继承父节点的样式
                        let parent = node.parent;
                        while (parent) {
                            if (parent.styleObj) {
                                styleObj = Object.assign({}, parent.styleObj, styleObj);
                            }
                            parent = parent.parent;
                        }
                        this.setStyleForDc(currDc, styleObj);
                        node.styleObj = styleObj;
                    }
                }
                else {
                    // 继承父节点的样式
                    let parent = node.parent;
                    while (parent) {
                        if (parent.styleObj) {
                            styleObj = Object.assign({}, parent.styleObj, styleObj);
                        }
                        parent = parent.parent;
                    }
                    const nodeIndex = (_a = node.parent) === null || _a === void 0 ? void 0 : _a.nodes.indexOf(node);
                    // 前一个节点同样存在样式，新建dc
                    if (nodeIndex > 0 && (((_b = node.parent) === null || _b === void 0 ? void 0 : _b.nodes[nodeIndex - 1].styleStr) || ((_c = node.parent) === null || _c === void 0 ? void 0 : _c.nodes[nodeIndex - 1].tag) === 'strong')) {
                        createDc();
                    }
                    this.setStyleForDc(currDc, styleObj);
                }
                // 只有block类型的能处理text-align
                if (currDc && tagType === 'block' && currDc.textAlign) {
                    switch (currDc.textAlign) {
                        case 'left':
                            currDc.x = 0;
                            break;
                        case 'right':
                            currDc.x = width;
                            break;
                        case 'center':
                            currDc.x = width / 2;
                            break;
                        default:
                            currDc.x = 0;
                    }
                }
                const localFontSize = styleObj['font-size'] ? Number(styleObj['font-size'].replace('px', '')) : fontSize;
                // 文本类型
                if (node.text) {
                    if (!currDc) {
                        createDc();
                    }
                    for (let i = 0; i < node.text.length; i++) {
                        const char = node.text[i];
                        const charWidth = getCharWidth(char, currDc && currDc.fontSize || fontSize);
                        // 触发了换行逻辑
                        if (lineWidth + charWidth > width) {
                            lines += 1;
                            lineWidth = 0;
                            let lastDc = currDc;
                            createDc();
                            // 因为字符太长触发的换行样式继承到下一个dc
                            Object.assign(currDc, lastDc);
                            currDc.text = '';
                            currDc.y = lineHeight * lines;
                            if (currDc.textAlign === 'left' || !currDc.textAlign) {
                                currDc.x = 0;
                            }
                        }
                        lineWidth += charWidth;
                        currDc.text += char;
                    }
                }
            });
            this.dcs = dcs;
            this.style.height = (lines + 1) * lineHeight;
        }
        repaint() {
            this.render();
        }
        destroySelf() {
            this.root = null;
        }
        insert(ctx, needRender) {
            this.ctx = ctx;
            this.toCanvasData();
            if (needRender) {
                this.render();
            }
        }
        toCanvasData() {
            const style = this.style || {};
            this.fontSize = style.fontSize || 12;
            this.textBaseline = 'top';
            this.font = `${style.fontWeight || ''} ${style.fontSize || 12}px ${DEFAULT_FONT_FAMILY}`;
            this.textAlign = style.textAlign || 'left';
            this.fillStyle = style.color || '#000';
        }
        render() {
            const ctx = this.ctx;
            ctx.save();
            const box = this.layoutBox;
            const { style } = this;
            ctx.textBaseline = this.textBaseline;
            ctx.font = this.font;
            ctx.textAlign = this.textAlign;
            let drawX = box.absoluteX;
            let drawY = box.absoluteY;
            if (style.opacity !== 1) {
                ctx.globalAlpha = style.opacity;
            }
            let originX = 0;
            let originY = 0;
            if (this.renderForLayout.rotate) {
                originX = drawX + box.width / 2;
                originY = drawY + box.height / 2;
                ctx.translate(originX, originY);
                ctx.rotate(this.renderForLayout.rotate);
            }
            const { needClip, needStroke } = this.renderBorder(ctx, originX, originY);
            if (needClip) {
                ctx.clip();
            }
            if (style.backgroundColor) {
                ctx.fillStyle = style.backgroundColor;
                ctx.fillRect(drawX - originX, drawY - originY, box.width, box.height);
            }
            if (style.backgroundImage && this.backgroundImage) {
                ctx.drawImage(this.backgroundImage, drawX - originX, drawY - originY, box.width, box.height);
            }
            if (needStroke) {
                ctx.stroke();
            }
            if (this.dcs && this.dcs.length) {
                const { fontSize = 12 } = this.style;
                this.dcs.forEach((dc) => {
                    if (dc.text) {
                        if (dc.fontWeight || dc.fontSize || dc.filleStyle || dc.fontStyle || dc.textAlign) {
                            ctx.save();
                            if (dc.filleStyle) {
                                ctx.fillStyle = dc.filleStyle;
                            }
                            if (dc.textAlign) {
                                ctx.textAlign = dc.textAlign;
                            }
                            ctx.font = `${dc.fontStyle || ''} ${dc.fontWeight || ''} ${dc.fontSize || fontSize}px ${DEFAULT_FONT_FAMILY}`;
                            ctx.fillText(dc.text, drawX + dc.x - originX, drawY + dc.y - originY);
                            ctx.restore();
                        }
                        else {
                            ctx.fillText(dc.text, drawX + dc.x - originX, drawY + dc.y - originY);
                        }
                    }
                });
            }
            if (this.renderForLayout.rotate) {
                ctx.translate(-originX, -originY);
            }
            ctx.restore();
        }
    }
    layout.registerComponent('richtext', RichText);
    // @ts-ignore
    layout.RichText = RichText;
    return RichText;
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
    install,
    name: 'RichText'
});

})();

module.exports = __webpack_exports__;
/******/ })()
;
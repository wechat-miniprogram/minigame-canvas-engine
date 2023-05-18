/* eslint-disable */

const __placeImgeUrlHttps = 'https';
const __emojisReg = '';
const __emojisBaseSrc = '';
const __emojis = {};
const HTMLParser = require('./htmlparser');
// Block Elements - HTML 5
const block = makeMap('br,a,code,address,article,applet,aside,audio,blockquote,button,canvas,center,dd,del,dir,div,dl,dt,fieldset,figcaption,figure,footer,form,frameset,h1,h2,h3,h4,h5,h6,header,hgroup,hr,iframe,ins,isindex,li,map,menu,noframes,noscript,object,ol,output,p,pre,section,script,table,tbody,td,tfoot,th,thead,tr,ul,video');

// Inline Elements - HTML 5
const inline = makeMap('abbr,acronym,applet,b,basefont,bdo,big,button,cite,del,dfn,em,font,i,iframe,img,input,ins,kbd,label,map,object,q,s,samp,script,select,small,span,strike,strong,sub,sup,textarea,tt,u,var');

// Elements that you can, intentionally, leave open
// (and which close themselves)
const closeSelf = makeMap('colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr');

function makeMap(str) {
  const obj = {}; const
    items = str.split(',');
  for (let i = 0; i < items.length; i++) obj[items[i]] = true;
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
      } else {
        var parent = bufArray[0];
        if (parent.nodes === undefined) {
          parent.nodes = [];
        }
        node.index = `${parent.index}.${parent.nodes.length}`;
      }

      if (block[tag]) {
        node.tagType = 'block';
      } else if (inline[tag]) {
        node.tagType = 'inline';
      } else if (closeSelf[tag]) {
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
            } else {
              // single value, make it array
              pre[name] = [pre[name], value];
            }
          } else {
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
      } else {
        bufArray.unshift(node);
      }
    },
    end(tag) {
      // debug(tag);
      // merge into parent tag
      const node = bufArray.shift();
      if (node.tag !== tag) console.error('invalid state: mismatch end tag');

      // 当有缓存source资源时于于video补上src资源
      if (node.tag === 'video' && results.source) {
        node.attr.src = results.source;
        delete results.source;
      }

      if (bufArray.length === 0) {
        results.nodes.push(node);
      } else {
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
      } else {
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
    } else {
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

import template   from './template.js';
import css        from './style.js';
import js         from './js.js';

import newtemplate   from './newtemplate.js';
import newcss        from './newstyle.js';
import newjs         from './newjs.js';

let beautify      = require('js-beautify').js

let localTemplate = localStorage.getItem('template');
let localCss      = localStorage.getItem('css');
let localJs       = localStorage.getItem('js');

import CodeMirror from 'codemirror';
import Layout     from '../../../index'
import doT        from 'dot';

window.doT        = doT;
window.CodeMirror = CodeMirror;
window.Layout     = Layout;

require('codemirror/addon/hint/show-hint.js');
require('codemirror/addon/fold/xml-fold.js');
require('codemirror/addon/edit/matchtags.js');
require('codemirror/mode/xml/xml.js');
require("codemirror/addon/edit/matchbrackets.js");
require("codemirror/addon/comment/continuecomment.js");
require("codemirror/addon/comment/comment.js");
require("codemirror/mode/javascript/javascript.js")

window.xml = CodeMirror(document.getElementById("xml"), {
    value: localTemplate || template,
    mode: "text/html",
    lineNumbers: true,
});

window.style = CodeMirror(document.getElementById("style"), {
    value: localCss || css,

    lineNumbers: true,
    mode: "text/javascript",
    matchTags: {bothTags: true},
    extraKeys: {"Ctrl-J": "toMatchingTag"}
});

try {
window.js = CodeMirror(document.getElementById("js"), {
    value: localJs || js,
    lineNumbers: true,
    mode: "text/javascript",
    matchTags: {bothTags: true},
    extraKeys: {"Ctrl-J": "toMatchingTag"}
});
} catch(e) {
    console.log(e)
}

window.dot = CodeMirror(document.getElementById("dot"), {
    value: '',
    lineNumbers: true,
    mode: "text/javascript",
    matchTags: {bothTags: true},
    extraKeys: {"Ctrl-J": "toMatchingTag"}
});

function run(xml, style, js) {
    let jscontent = window.js.getValue()
    document.getElementById('error').innerHTML = '';
    try {
        eval(jscontent);

        localStorage.setItem('template', xml);
        localStorage.setItem('css', style);
        localStorage.setItem('js', js);

        let comment =
        `/**\n * xml经过doT.js编译出的模板函数\n * 因为小游戏不支持new Function，模板函数只能外部编译\n * 可直接拷贝本函数到小游戏中使用\n */\n`;
        let be = beautify(String(doT.template(xml)), { indent_size: 4, space_in_empty_paren: true })

        window.dot.setValue(
            comment + be
        );

        console.log(Layout);
    } catch(e) {
        console.log(e);
        document.getElementById('error').innerHTML = e;
    }
}

setTimeout(() => {
    run();
}, 0)

document.getElementById('run').onclick = function() {
    run();
};

document.getElementById('reset').onclick = function() {
    window.xml.setValue(template);
    window.style.setValue(css);
    window.js.setValue(js);

    setTimeout(() => {
        run();
    }, 0);
};

let items = [].slice.call(document.getElementsByClassName('panels__item'))
let panels = [].slice.call(document.getElementsByClassName('code'));

let status = panels.map( item => 1);
if (localStorage.getItem('panels')) {
    status = JSON.parse(localStorage.getItem('panels'))

    panels.forEach((item, index) => {
        if ( status[index] === 0 ) {
            item.style.display = 'none';
        }
    })
    resetSize()
}

function resetSize() {
    let showLength = panels.filter( item => item.style.display !== 'none').length;


    items.forEach( (item, index) => {
        item.className = status[index] ?  'panels__item active' : 'panels__item';
    })


    panels.forEach( (item) => {
        item.style.width = (1 / showLength) * 100 + '%';
    });
}


for ( let i = 0; i < items.length; i++ ) {
    let item = items[i];

    item.onclick = () => {
        let showLength = panels.filter( item => item.style.display !== 'none').length;

        let panel = document.getElementById(item.dataset.panel);
        let curr = panel.style.display;
        panel.style.display = curr === '' ? 'none' : '';

        status[i] = curr === '' ? 0 : 1;

        localStorage.setItem('panels', JSON.stringify(status))

        resetSize()

        run();
    }
};

// 获取元素的绝对位置坐标（像对于页面左上角）
window.getElementPagePosition = function(element){
  //计算x坐标
  var actualLeft = element.offsetLeft;
  var current = element.offsetParent;
  while (current !== null){
    actualLeft += current.offsetLeft;
    current = current.offsetParent;
  }
  //计算y坐标
  var actualTop = element.offsetTop;
  var current = element.offsetParent;
  while (current !== null){
    actualTop += (current.offsetTop+current.clientTop);
    current = current.offsetParent;
  }
  //返回结果
  return {x: actualLeft, y: actualTop}
}

window.canvas = document.getElementById('canvas');
window.context = canvas.getContext('2d');

let defaultProjects = [
    {
        name: "默认示例",
        js,
        style,
        template
    }
]
let projectIndex = 0;
let projects = []
let local = localStorage.getItem('projects');
try {
    projects = JSON.parse(local)
} catch {
    projects = defaultProjects
    projectIndex = 0
}

console.log(projects)

let create = document.getElementById('create')
create.onclick = () => {

}


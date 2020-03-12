import template   from './template.js';
import css        from './style.js';
import js         from './js.js';
let beautify      = require('js-beautify').js

let localTemplate = localStorage.getItem('template');
let localCss      = localStorage.getItem('css');
let localJs       = localStorage.getItem('js');

import CodeMirror from 'codemirror';
import Layout     from '../../index'
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

window.js = CodeMirror(document.getElementById("js"), {
    value: localJs || js,
    lineNumbers: true,
    mode: "text/javascript",
    matchTags: {bothTags: true},
    extraKeys: {"Ctrl-J": "toMatchingTag"}
});

window.dot = CodeMirror(document.getElementById("dot"), {
    value: '',
    lineNumbers: true,
    mode: "text/javascript",
    matchTags: {bothTags: true},
    extraKeys: {"Ctrl-J": "toMatchingTag"}
});

function run() {
    document.getElementById('error').innerHTML = '';
    try {
        eval(window.js.getValue());

        localStorage.setItem('template', window.xml.getValue());
        localStorage.setItem('css', window.style.getValue());
        localStorage.setItem('js', window.js.getValue());

        let comment =
        `/**\n * xml经过doT.js编译出的模板函数\n * 因为小游戏不支持new Function，模板函数只能外部编译\n * 可直接拷贝本函数到小游戏中使用\n */\n`;
        let be = beautify(String(doT.template(window.xml.getValue())), { indent_size: 4, space_in_empty_paren: true })

        window.dot.setValue(
            comment + be
        );

        console.log(Layout);
    } catch(e) {
        console.log(e);
        document.getElementById('error').innerHTML = e;
    }
}

run();

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


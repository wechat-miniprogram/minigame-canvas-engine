import template   from './template.js';
import css        from './style.js';
import js         from './js.js';

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

function run() {
    document.getElementById('error').innerHTML = '';
    try {
        eval(window.js.getValue());

        localStorage.setItem('template', window.xml.getValue());
        localStorage.setItem('css', window.style.getValue());
        localStorage.setItem('js', window.js.getValue());

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


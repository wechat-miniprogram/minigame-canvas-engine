import template   from './template.js';
import css        from './style.js';
import js         from './js.js';
import CodeMirror from 'codemirror';
import Layout     from '../../index'
import doT        from 'dot';

window.doT        = doT;
window.CodeMirror = CodeMirror;
window.Layout     = Layout;

/*require('codemirror/lib/codemirror.css');*/

require('codemirror/addon/hint/show-hint.js');
require('codemirror/addon/fold/xml-fold.js');
require('codemirror/addon/edit/matchtags.js');
require('codemirror/mode/xml/xml.js');
require("codemirror/addon/edit/matchbrackets.js");
require("codemirror/addon/comment/continuecomment.js");
require("codemirror/addon/comment/comment.js");
require("codemirror/mode/javascript/javascript.js")

window.xml = CodeMirror(document.getElementById("xml"), {
    value: template,
    mode: "text/html",
    lineNumbers: true,
    matchTags: {bothTags: true},
    extraKeys: {"Ctrl-J": "toMatchingTag"}
});

window.style = CodeMirror(document.getElementById("style"), {
    value: css,

    lineNumbers: true,
    mode: "text/javascript",
    matchTags: {bothTags: true},
    extraKeys: {"Ctrl-J": "toMatchingTag"}
});

window.js = CodeMirror(document.getElementById("js"), {
    value: js,
    lineNumbers: true,
    mode: "text/javascript",
    matchTags: {bothTags: true},
    extraKeys: {"Ctrl-J": "toMatchingTag"}
});

function run() {
    document.getElementById('error').innerHTML = '';
    try {
        eval(window.js.getValue());
    } catch(e) {
        document.getElementById('error').innerHTML = e;
    }
}

run();

document.getElementById('run').onclick = function() {
    run();
};


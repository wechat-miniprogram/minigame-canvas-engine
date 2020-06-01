import template   from './template.js';
import css        from './style.js';
import js         from './js.js';

import newtemplate   from './newtemplate.js';
import newcss        from './newstyle.js';
import newjs         from './newjs.js';

import Vue from 'vue/dist/vue.js'

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

function run(xml, css, js) {
    document.getElementById('error').innerHTML = '';
    try {
        eval(js);

        let comment =
            `/**\n * xml经过doT.js编译出的模板函数\n * 因为小游戏不支持new Function，模板函数只能外部编译\n * 可直接拷贝本函数到小游戏中使用\n */\n`;
        let be = beautify(String(window.doT.template(xml)), { indent_size: 4, space_in_empty_paren: true })

        window.dot.setValue(
            comment + be
        );

    } catch(e) {
        console.log(e);
        document.getElementById('error').innerHTML = e;
    }
}


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

function init(proj = {}) {
    let {xml, css, js} = proj;

    window.xml = CodeMirror(document.getElementById("xml"), {
        value: xml,
        mode: "text/html",
        lineNumbers: true,
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

    window.dot = CodeMirror(document.getElementById("dot"), {
        value: '',
        lineNumbers: true,
        mode: "text/javascript",
        matchTags: {bothTags: true},
        extraKeys: {"Ctrl-J": "toMatchingTag"}
    });

    setTimeout(() => {
        run(xml, css, js);
    }, 0)
}

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
        css,
        xml: template
    }
]

// init projects
let projectIndex = 0;
let projects = []
let local = localStorage.getItem('projects');
try {
    if (local) {
        projects = JSON.parse(local);
    } else {
        projects = defaultProjects;
        localStorage.setItem('projects', JSON.stringify(projects));
    }
} catch {
    projects = defaultProjects
    projectIndex = 0
}

init(projects[projectIndex]);

// 绑定运行按钮事件
document.getElementById('run').onclick = function() {
    run(window.xml.getValue(), window.style.getValue(), window.js.getValue());
};

document.getElementById('reset').onclick = function() {
};

var app = new Vue({
    el: '#app',
    data: {
        projects,
        projectIndex,
    },

    computed: {
        currName() {
            return this.projects[this.projectIndex].name
        }
    },

    mounted() {
        document.getElementById('app').style.display = 'block';
    },

    methods: {
        create() {
            const name = prompt("项目名称", "新项目");

            if (name === null) {
                return
            }

            let newProj = {
                name,
                js: newjs,
                css: newcss,
                xml: newtemplate
            }

            projects.push(newProj)
            projectIndex = projects.length - 1;

            localStorage.setItem('projects', JSON.stringify(projects))

            setTimeout(() => {
                this.runProj(newProj)
            }, 0);
        },

        runProj(proj) {
            window.xml.setValue(proj.xml)
            window.style.setValue(proj.css)
            window.js.setValue(proj.js)
            run(proj.xml, proj.css, proj.js);
        },

        setAsCurrent(proj, index) {
            this.projectIndex = index;
            this.runProj(proj)
        }
    }
})


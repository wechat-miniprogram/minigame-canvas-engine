(window.webpackJsonp=window.webpackJsonp||[]).push([[13],{401:function(t,a,s){"use strict";s.r(a);var n=s(52),e=Object(n.a)({},(function(){var t=this,a=t.$createElement,s=t._self._c||a;return s("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[s("h1",{attrs:{id:"缓动系统-beta"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#缓动系统-beta"}},[t._v("#")]),t._v(" 缓动系统(Beta)")]),t._v(" "),s("h2",{attrs:{id:"简介"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#简介"}},[t._v("#")]),t._v(" 简介")]),t._v(" "),s("p",[t._v("缓动动画是很常见的需求，游戏引擎会一般内置缓动系统，如果没有内置的缓动系统，通过引入缓动引擎也能够很容易实现缓动动画能力。")]),t._v(" "),s("p",[t._v("Layout 默认挂载了"),s("a",{attrs:{href:"https://github.com/tweenjs/tween.js/",target:"_blank",rel:"noopener noreferrer"}},[t._v("https://github.com/tweenjs/tween.js/"),s("OutboundLink")],1),t._v("模块，使用 tween.js 来实现动画能力与浏览器插件的 DOM 动画差异不大。")]),t._v(" "),s("p",[t._v("支持缓动系统的版本改动较大，请先引用"),s("a",{attrs:{href:"https://github.com/wechat-miniprogram/minigame-canvas-engine/blob/master/index.js",target:"_blank",rel:"noopener noreferrer"}},[t._v("https://github.com/wechat-miniprogram/minigame-canvas-engine/blob/master/index.js"),s("OutboundLink")],1),t._v("来使用，版本稳定会会发布至 npm 和小游戏插件。")]),t._v(" "),s("h2",{attrs:{id:"原理"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#原理"}},[t._v("#")]),t._v(" 原理")]),t._v(" "),s("p",[t._v("Layout 要实现缓动动画的原理与浏览器是类似的，浏览器里面一般要给 DOM 节点实现动画能力需要先给节点设置 position 为 relative 或者 absolute，然后定时改变节点的 top 和 left 的值就实现了动画的效果。")]),t._v(" "),s("p",[t._v("详见文档：https://developer.mozilla.org/en-US/docs/Web/CSS/position")]),t._v(" "),s("blockquote",[s("p",[t._v("The element is positioned according to the normal flow of the document, and then offset relative to itself based on the values of top, right, bottom, and left. The offset does not affect the position of any other elements;")])]),t._v(" "),s("p",[t._v("可以简单理解为，当布局已经确定之后，改变元素的 top 和 left 属性，只会影响自己不会影响其他元素。")]),t._v(" "),s("p",[t._v("Layout 里面实现动画也是类似的，当改变元素的 style 属性，Layout 内部在监听到这种修改之后，会触发布局的重计算并重新渲染(这个过程被称为 reflow)，只要合理利用 TWEEN，也能实现丰富的动画效果。")]),t._v(" "),s("h2",{attrs:{id:"简单示例"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#简单示例"}},[t._v("#")]),t._v(" 简单示例")]),t._v(" "),s("p",[t._v("下面分别是示例需要的 xml、style 和缓动函数调用示例，省略 Layout 初始化和 layout 等逻辑。")]),t._v(" "),s("div",{staticClass:"language-xml extra-class"},[s("pre",{pre:!0,attrs:{class:"language-xml"}},[s("code",[s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("<")]),t._v("view")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token attr-name"}},[t._v("id")]),s("span",{pre:!0,attrs:{class:"token attr-value"}},[s("span",{pre:!0,attrs:{class:"token punctuation attr-equals"}},[t._v("=")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v('"')]),t._v("container"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v('"')])]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("<")]),t._v("view")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token attr-name"}},[t._v("class")]),s("span",{pre:!0,attrs:{class:"token attr-value"}},[s("span",{pre:!0,attrs:{class:"token punctuation attr-equals"}},[t._v("=")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v('"')]),t._v("ball"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v('"')])]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("</")]),t._v("view")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token tag"}},[s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("</")]),t._v("view")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(">")])]),t._v("\n")])])]),s("div",{staticClass:"language-json extra-class"},[s("pre",{pre:!0,attrs:{class:"language-json"}},[s("code",[s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    container"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n        width"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("300")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n        height"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("300")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n        backgroundColor"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" '#ffffff'"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n        justContent"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" 'center'"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n        alignItems"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" 'center'"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    ball"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n        backgroundColor"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" 'blue'"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n        width"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("50")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n        height"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("50")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n      \tborderRadius"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("25")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),s("div",{staticClass:"language-js extra-class"},[s("pre",{pre:!0,attrs:{class:"language-js"}},[s("code",[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("const")]),t._v(" ball "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" Layout"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("getElementsByClassName")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'ball'")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("[")]),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("0")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("]")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n\n"),s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("new")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token class-name"}},[t._v("Layout"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("TWEEN"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("Tween")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("ball"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("style"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("to")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("top")]),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("250")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("1000")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("easing")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("Layout"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token constant"}},[t._v("TWEEN")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("Easing"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("Bounce"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("Out"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),s("span",{pre:!0,attrs:{class:"token function"}},[t._v("start")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n")])])]),s("h2",{attrs:{id:"接口限制"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#接口限制"}},[t._v("#")]),t._v(" 接口限制")]),t._v(" "),s("p",[t._v("Layout 仅仅是引用了 TWEEN，缓动相关的能力见 tween.js 的"),s("a",{attrs:{href:"https://github.com/tweenjs/tween.js/blob/main/docs/user_guide.md",target:"_blank",rel:"noopener noreferrer"}},[t._v("文档"),s("OutboundLink")],1),t._v("。\n借助 tween.js，只要是能够实现两类动画")]),t._v(" "),s("ol",[s("li",[t._v("改变位置相关动画: 如示例所示，改变 "),s("strong",[t._v("style.left")]),t._v("、"),s("strong",[t._v("style.top")]),t._v("即可;")]),t._v(" "),s("li",[t._v("改变布局的动画：更改 "),s("strong",[t._v("style.width")]),t._v("、"),s("strong",[t._v("style.height")]),t._v("等会改变布局的属性，布局属性列表可见"),s("RouterLink",{attrs:{to:"/api/style.html#布局"}},[t._v("布局属性")]),t._v(";")],1)]),t._v(" "),s("h2",{attrs:{id:"一些参考资料"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#一些参考资料"}},[t._v("#")]),t._v(" 一些参考资料")]),t._v(" "),s("ol",[s("li",[s("a",{attrs:{href:"https://www.w3school.com.cn/js/js_htmldom_animate.asp",target:"_blank",rel:"noopener noreferrer"}},[t._v("JavaScript HTML DOM 动画"),s("OutboundLink")],1)]),t._v(" "),s("li",[s("a",{attrs:{href:"https://developer.mozilla.org/en-US/docs/Web/CSS/position",target:"_blank",rel:"noopener noreferrer"}},[t._v("CSS positon"),s("OutboundLink")],1)])])])}),[],!1,null,null,null);a.default=e.exports}}]);
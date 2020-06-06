export default
`/**
  * xml为编辑器实例，挂载到window对象，通过xml.getValue可以拿到模板字符串
  * style为编辑器实例，挂载到window对象，通过style.getValue可以拿到样式对象的字符串值
  * 控制台默认
  */
let xmlValue   = window.xml.getValue();
let styleValue = window.style.getValue();
let styleObj = eval(styleValue);

let datasource =  {
}

// 将XML模板编译成XML字符串
let tempFn     = window.doT.template(xmlValue);
let resultText = tempFn(datasource);

function init() {
  	// getElementPagePosition为IDE内置函数
    let pos = window.getElementPagePosition(canvas);
    // 每次初始化之前先执行清理逻辑保证内存不会一直增长
    Layout.clear();
    // 初始化引擎
    Layout.init(resultText, styleObj);

  	console.log(Layout)
  	// 设置canvas的尺寸和样式的container比例一致
    canvas.width = Layout.renderport.width;
    canvas.height = Layout.renderport.height;
  	canvas.style.width = 300 + 'px';
    canvas.style.height = canvas.height / canvas.width * 300 + 'px';

    Layout.updateViewPort({
        x     : pos.x,
        y     : pos.y,
        width : canvas.offsetWidth,
        height: canvas.offsetHeight,
    });

    Layout.layout(context);
}

init();
window.onresize = init;`

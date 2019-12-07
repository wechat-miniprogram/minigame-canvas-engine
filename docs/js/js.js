export default
`
/**
  * xml为编辑器实例，挂载到window对象，通过xml.getValue可以拿到模板字符串
  * style为编辑器实例，挂载到window对象，通过style.getValue可以拿到样式对象的字符串值
  */
let xmlValue   = xml.getValue();
let styleValue = style.getValue();

// 创建mock数据
let item = {
    nickname: "zim",
    rankScore: 1,
    avatarUrl: 'https://res.wx.qq.com/wechatgame/product/webpack/userupload/20191119/wegoing.jpeg',
    starSum: 1,
};
let datasource =  {
    data     :[],
    selfIndex: 0,
    self     : item
}
for ( let i = 0; i < 20;i++ ) {
    var cp = JSON.parse(JSON.stringify(item));
    cp.rankScore = Math.floor(Math.random()*1000+1)
    cp.starSum   = i + 1;
    datasource.data.push(cp);
}

// 将XML模板编译成XML字符串
let tempFn     = doT.template(xmlValue);
let resultText = tempFn(datasource);

// 获取元素的绝对位置坐标（像对于页面左上角）
function getElementPagePosition(element){
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

let canvas = document.getElementById('canvas');
let context = canvas.getContext('2d');

// 设置canvas的尺寸和样式的container比例一致
canvas.style.width = 300 + 'px';
canvas.style.height = 1410/ 960* 300 + 'px';
canvas.width = 960;
canvas.height = 1410;

function init() {
    let pos = getElementPagePosition(canvas);
    // 每次初始化之前先执行清理逻辑保证内存不会一直增长
    Layout.clear();
    // 初始化引擎
    Layout.init(resultText, eval(styleValue));
    Layout.updateViewPort({
        x     : pos.x,
        y     : pos.y,
        width : canvas.offsetWidth,
        height: canvas.offsetHeight,
    });

    Layout.layout(context);

}

init();
window.onresize = init;
`

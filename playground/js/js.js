setTimeout(() => {
    Layout.registBitMapFont(
'fnt_number-export',
'https://res.wx.qq.com/wechatgame/product/webpack/userupload/20200314/fnt_number-export.png',
`info face="fnt_number-export" size=50 bold=0 italic=0 charset="" unicode=0 stretchH=100 smooth=1 aa=1 padding=0,0,0,0 spacing=1,1
common lineHeight=60 base=26 scaleW=190 scaleH=181 pages=1 packed=0 alphaChnl=1 redChnl=0 greenChnl=0 blueChnl=0
page id=0 file="fnt_number-export.png"
chars count=15
char id=31561 x=0 y=61 width=60 height=61 xoffset=0 yoffset=2 xadvance=57 page=0 chnl=0 letter="等"
char id=32423 x=0 y=0 width=62 height=60 xoffset=0 yoffset=2 xadvance=59 page=0 chnl=0 letter="级"
char id=46 x=168 y=116 width=21 height=21 xoffset=0 yoffset=39 xadvance=18 page=0 chnl=0 letter="."
char id=49 x=145 y=0 width=27 height=57 xoffset=0 yoffset=3 xadvance=24 page=0 chnl=0 letter="1"
char id=50 x=44 y=123 width=41 height=57 xoffset=0 yoffset=3 xadvance=38 page=0 chnl=0 letter="2"
char id=51 x=102 y=58 width=40 height=57 xoffset=0 yoffset=3 xadvance=37 page=0 chnl=0 letter="3"
char id=52 x=143 y=58 width=40 height=57 xoffset=0 yoffset=3 xadvance=37 page=0 chnl=0 letter="4"
char id=53 x=0 y=123 width=43 height=57 xoffset=0 yoffset=3 xadvance=40 page=0 chnl=0 letter="5"
char id=54 x=127 y=116 width=40 height=57 xoffset=0 yoffset=3 xadvance=37 page=0 chnl=0 letter="6"
char id=55 x=86 y=119 width=40 height=57 xoffset=0 yoffset=3 xadvance=37 page=0 chnl=0 letter="7"
char id=56 x=63 y=0 width=40 height=57 xoffset=0 yoffset=3 xadvance=37 page=0 chnl=0 letter="8"
char id=57 x=104 y=0 width=40 height=57 xoffset=0 yoffset=3 xadvance=37 page=0 chnl=0 letter="9"
char id=48 x=61 y=61 width=40 height=57 xoffset=0 yoffset=3 xadvance=37 page=0 chnl=0 letter="0"
char id=32 x=0 y=0 width=0 height=0 xoffset=0 yoffset=0 xadvance=0 page=0 chnl=0 letter=" "
char id=9 x=0 y=0 width=0 height=0 xoffset=0 yoffset=0 xadvance=0 page=0 chnl=0 letter="	"

kernings count=0`
)

}, 0)

export default
`
/**
  * xml为编辑器实例，挂载到window对象，通过xml.getValue可以拿到模板字符串
  * style为编辑器实例，挂载到window对象，通过style.getValue可以拿到样式对象的字符串值
  * 控制台默认
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

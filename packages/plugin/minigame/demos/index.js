/**
 * Demo 索引文件
 * 所有 demo 均为纯 JS，从 devtools 的 Vue demo 复刻而来
 * 每个 demo 导出一个函数 function(Layout, canvas, ctx)
 */
const demos = {
  helloworld:     require('./helloworld'),
  button:         require('./button'),
  text:           require('./text'),
  loading:        require('./loading'),
  invite:         require('./invite'),
  insertElement:  require('./insertElement'),
  bitmaptext:     require('./bitmaptext'),
  canvas:         require('./canvas'),
  tween:          require('./tween'),
  richtext:       require('./richtext'),
};

module.exports = demos;

/**
 * Demo 索引文件
 * 所有 demo 均为纯 JS，从 devtools 的 Vue demo 复刻而来
 * 每个 demo 导出一个函数 function(Layout, canvas, ctx)
 */

// 按分类组织，菜单页会按此结构渲染分组标题
const categories = [
  {
    title: '基础组件',
    demos: {
      helloworld:    require('./helloworld'),
      text:          require('./text'),
      button:        require('./button'),
      bitmaptext:    require('./bitmaptext'),
      canvas:        require('./canvas'),
      loading:       require('./loading'),
      insertElement: require('./insertElement'),
      richtext:      require('./richtext'),
    },
  },
  {
    title: '缓动动画',
    demos: {
      tween_hello_world: require('./tween_hello_world'),
      tween_easing:      require('./tween_easing'),
      tween_repeat:      require('./tween_repeat'),
      tween_yoyo:        require('./tween_yoyo'),
      tween_chain:       require('./tween_chain'),
      tween_delay:       require('./tween_delay'),
      tween_pause:       require('./tween_pause'),
      tween_color:       require('./tween_color'),
    },
  },
  {
    title: '实践案例',
    demos: {
      invite:   require('./invite'),
      ranklist: require('./ranklist'),
    },
  },
];

// 扁平映射，供 runDemo(name) 直接查找
const demos = {};
categories.forEach(function (cat) {
  Object.keys(cat.demos).forEach(function (key) {
    demos[key] = cat.demos[key];
  });
});

module.exports = demos;
module.exports.categories = categories;

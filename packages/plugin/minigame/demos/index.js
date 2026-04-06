/**
 * Demo 索引文件
 * 所有 demo 均为纯 JS，每个 demo 导出一个函数 function(Layout, canvas, ctx)
 */

// 按分类组织，菜单页会按此结构渲染分组标题
const categories = [
  {
    title: '基础组件',
    demos: {
      helloworld:    require('./basic/helloworld'),
      text:          require('./basic/text'),
      button:        require('./basic/button'),
      bitmaptext:    require('./basic/bitmaptext'),
      canvas:        require('./basic/canvas'),
      loading:       require('./basic/loading'),
      insertElement: require('./basic/insertElement'),
      richtext:      require('./basic/richtext'),
    },
  },
  {
    title: '缓动动画',
    demos: {
      tween_hello_world: require('./tween/tween_hello_world'),
      tween_easing:      require('./tween/tween_easing'),
      tween_repeat:      require('./tween/tween_repeat'),
      tween_yoyo:        require('./tween/tween_yoyo'),
      tween_chain:       require('./tween/tween_chain'),
      tween_delay:       require('./tween/tween_delay'),
      tween_pause:       require('./tween/tween_pause'),
      tween_color:       require('./tween/tween_color'),
    },
  },
  {
    title: '物理引擎',
    demos: {
      matter_ballPool:     require('./matter/matter_ballPool'),
      matter_circleStack:  require('./matter/matter_circleStack'),
      matter_avalanche:    require('./matter/matter_avalanche'),
      matter_pinball:      require('./matter/matter_pinball'),
    },
  },
  {
    title: '实践案例',
    demos: {
      invite:   require('./practice/invite'),
      ranklist: require('./practice/ranklist'),
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

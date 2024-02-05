# ScrollBar
::: tip 兼容性
滚动条特性 v1.0.4版本开始支持
:::


滚动条组件，服务于 ScrollView，不能独立使用。


当 ScrollView 开启横向滚动或者纵向滚动的时候，会自动给 ScrollView 插入相应的 ScrollBar，ScrollBar继承自 View 组件。

## 属性
| 属性      | 类型   | 说明                                                                       |
| --------- | ------ | -------------------------------------------------------------------------- |
| width   | Number | 滚动条的粗细，因为要兼容横竖滚动，所以 style.width 在不同模式下代表的意思不一样，因此通过单独的 width 属性来代表滚动条的粗细 |
| autoHide | boolean | 是否自动隐藏滚动条，默认为 true，在滚动结束后会自动隐藏 |
| autoHideTime | number | 与 autoHide 配套属性，开启了自动隐藏，在一定时间内隐藏滚动条，默认是1000，单位 ms |

示例
``` js
const list = Layout.getElementById('scrolllist');

// 在 init 之后内部有些异步逻辑取不到 vertivalScrollbar，需要延迟一帧执行
Layout.ticker.next(() => {
  // 设置滚动条的粗细
  list.vertivalScrollbar.width = 20;

  list.vertivalScrollbar.autoHide = false;
});

```

## 方法

### hide
隐藏滚动条

```js
const list = Layout.getElementById('scrolllist');

// 在 init 之后内部有些异步逻辑取不到 vertivalScrollbar，需要延迟一帧执行
Layout.ticker.next(() => {
  list.vertivalScrollbar.hide();
});
```

### show
展示滚动条

```js
const list = Layout.getElementById('scrolllist');

// 在 init 之后内部有些异步逻辑取不到 vertivalScrollbar，需要延迟一帧执行
Layout.ticker.next(() => {
  list.vertivalScrollbar.show();
});
```

## 样式
ScrollBar 本身只是个普通的 View 组件，只不过默认带了一些样式，下面介绍 ScrollBar 默认的样式。

| 属性 | 类型 | 描述|
| --------- | ------ | -------------------------------------------------------------------------- |
| backgroundColor | string | 默认值'rgba(162, 162, 162, 1)'，建议采用 rgba 的格式设置颜色 |
| position | string | 'absolute'，`不建议修改` |
| opacity | number | 透明度，开启了autoHide会动态修改透明度，`不建议修改` |
| borderRadius | number |  值为 width / 2，`不建议修改` |
| width | number | 滚动宽度，自动计算，`不建议修改` |
| height | number | 滚动条高度，自动计算，`不建议修改` |
| left | number | 滚动条定位，自动计算，`不建议修改` |
| top | number | 滚动条定位，自动计算，`不建议修改` |

示例
``` js
const list = Layout.getElementById('scrolllist');
// 在 init 之后内部有些异步逻辑取不到 vertivalScrollbar，需要延迟一帧执行
Layout.ticker.next(() => {
  list.vertivalScrollbar.style.backgroundColor = 'red';
});
```
# Button

Button 组件是一种常见的需求，当 Button 被点击的时候，自身会有一些状态变化，比如元素会有一定的缩放行为。

一般的引擎设计，Button 由两部分构成，第一部分是容器，这个容器承载了 Button 的背景色、背景图等内容，第二部分是一个 label，代表 Button 的文本。Layout 同样如此，Button 组件实际上是由一个 View 包裹着 Text 实现的，View 负责背景色和背景图等逻辑的渲染，Text 只关注按钮文案。

```xml
<button id="testButton" value="邀请"></button>
```
当在 xml 声明一个 Button 组件的时候，Layout 实际上做了几个事情：

1. 创建一个 View 容器，容器样式如下，这是一个绿色背景的矩形，矩形内的元素(即label)会水平和垂直居中。
``` json
{
  width: 300,
  height: 60,
  borderRadius: 10,
  backgroundColor: '#34a123',
  justifyContent: 'center',
  alignItems: 'center',
}
```

2. 创建一个 Text，默认样式如下：
``` json
{
  color: '#ffffff', // button 容器样式的 color 会透传覆盖这里的默认值
  fontSize: 30, // button 容器样式的 fontSize 会透传覆盖这里的默认值
}
```

如果要更改 Button 的默认样式，只需要在 style 声明覆盖即可，比如
``` json
{
  testButton: {
    color: 'red', // 按钮文字会变成红色
    backgroundColor: '#f3f3f3', // 按钮背景色会变成灰色
    ... // 其他样式，因为 Button 本身只是个 View + Text，样式可以自由定义
  }
}
```

## 特殊属性
|      属性      |  类型  | 是否必填 |          说明          |
|----------------|--------|--------|------------------------|
| value | string |  否 | 按钮文案，不填默认为 `button` |


## 实例属性

### label
按钮的 Text 组件实例，如果要修改按钮的文案的值和样式等都需要通过 label 来操作。

``` js
const testButton = Layout.getElementById('testButton');

testButton.label.value = '按钮';

testButton.label.style.color = 'red';
```

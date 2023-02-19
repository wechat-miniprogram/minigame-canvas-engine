# Element

Element 是所有组件的基类，Element 描述了所有组件所普遍具有的方法和属性。一些组件继承自 Element 并且增加了一些额外功能的接口描述了具体的行为。

## 属性

| 属性      | 类型   | 说明                                                                       |
| --------- | ------ | -------------------------------------------------------------------------- |
| dataset   | Object | 标签上通过 **data-\*** 设置的属性会存到 dataset 字段，方便记录一些节点信息 |

<!-- | layoutBox | Object | 组件在 canvas 渲染的位置和尺寸信息                                         | -->
<!-- 
### layoutBox
::: tip
坐标系原点为左上角，一般而言根节点的尺寸与渲染目标 canvas 的尺寸一致。
:::

| key       | 类型   | 说明                  |
| --------- | ------ | --------------------- |
| absoluteX | Number | 组件被渲染到 canvas 上坐标的 X 值 |
| absoluteY | Number | 组件被渲染到 canvas 上坐标的 Y 值 |
| width | Number | 组件宽度 |
| height | Number | 组件高度 |
| left | Number | 以父节点左上角为坐标系原点的 X 坐标值 |
| top | Number | 以父节点左上角为坐标系原点的 Y 坐标值 | -->


## 方法

### getElementsById(elementId: string): Element[]

获取元素id为**elementId**的一组元素，之所以是一组元素是因为这里 id 的实现没有对齐 Web，id并不是唯一的，只是一个标识。
```js
// <view id="container"></view>
const container = Layout.getElementsById('container')[0];
```

### getElementsByClassName(className: string): Element[]

获取包含class为**className**的一组元素。

```js
/**
 * <view id="container">
    <view class="item"></view>
    <view class="item"></view>
    <view class="item"></view>
   </view>
 */
const list = Layout.getElementsByClassName('item');

console.log(list.length); // 3
```

### getBoundingClientRect(): [Rect](/components/rect.html)
返回一个组件在**canvas**画布中的位置和尺寸信息。

### getViewportRect(): [Rect](/components/rect.html)
返回一个组件在**屏幕**中的位置和尺寸信息，前提是正确调用[updateViewPort](/api/api.html#updateviewport)。

### appendChild(ele: Element)
给一个组件添加子节点，这通常用于拷贝A组件之后添加到A组件的父容器，避免重新执行 Layout.init 流程，提升性能。
```js
// 获取 ScrollView
const list = Layout.getElementsByClassName('list')[0];
// 获取列表的每一项
const listItem = list.getElementsByClassName('listItem');

listItem.forEach(item => {
  list.appendChild(Layout.cloneNode(item))
});
```
# Element

Element 是所有组件的基类，Element 描述了所有组件所普遍具有的方法和属性。一些组件继承自 Element 并且增加了一些额外功能的接口描述了具体的行为。

## 属性

| 属性      | 类型   | 说明                                                                       |
| --------- | ------ | -------------------------------------------------------------------------- |
| dataset   | Object | 标签上通过 **data-\*** 设置的属性会存到 dataset 字段，方便记录一些节点信息 |
| layoutBox | Object | 组件在 canvas 渲染的位置和尺寸信息                                         |

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
| top | Number | 以父节点左上角为坐标系原点的 Y 坐标值 |


## 方法

### getBoundingClientRect


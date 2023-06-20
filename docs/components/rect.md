# Rect
一个 Rect 代表一个矩形。

## 属性

| 属性      | 类型   | 说明                                                                       |
| --------- | ------ | -------------------------------------------------------------------------- |
| width   | Number | 矩形的宽度 |
| height   | Number | 矩形的高度 |
| left   | Number | 矩形 X 轴上的最小值 |
| right   | Number | 矩形 X 轴上的最大值 |
| top   | Number | 矩形 Y 轴上的最小值 |
| bottom   | Number | 矩形 Y 轴上的最大值 |

## 方法

### set(left: number, top: number, width: number, height: number)
更新矩形的相关信息。

### intersects(rect: Rect): boolean
判断两个矩形是否相交

```js
const rect1 = Layout.getElementsById('box1')[0];
const rect2 = Layout.getElementsById('box2')[0];

console.log(rect1.intersects(rect2));
```
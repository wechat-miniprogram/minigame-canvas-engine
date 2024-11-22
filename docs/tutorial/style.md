# 动态修改样式

动态修改样式是很常见的需求，Layout 支持了一些场景的动态修改样式的能力。

## style 属性
初始化 Layout 的时候，会传入模板和样式，针对于每个节点，Layout 会根据 id 和 class 属性，从样式表中找出应该生效的样式，最终样式会挂载在 style 属性上。

通过 style 属性，可以动态修改元素的样式，Layout 会判定当前的修改是触发重新布局还是重新渲染，无需其他操作，样式会自动生效。
``` js
let testText = Layout.getElementById('testText');

testText.style.backgroundColor = '#f3f3f3'
```

动态修改 style 很常见的使用场景是缓动系统，详情可见[教程](../api/tween.md)。

## classList 属性
通过 style 动态修改样式一般作用于样式修改比较少的场景，如果需要批量修改样式，更好的方式是通过操作 class 的方式，通过 [classList](../components/classList.md) 可以动态操作元素的 class 集合，需要特别注意的是，id 会默认添加到 class 集合。

```js
// <view id="container" class="info"></view>
const container = Layout.getElementById('container');

console.log(container.classList.value); // `container info`

container.classList.add('test');

container.classList.remove('test');
```

## 伪类能力

用来添加一些选择器的特殊效果，目前仅支持最场景的 `:active` 场景，伪类本质上是快捷的修改 style 操作，避免通过 js 反复操作元素样式。

| 属性名 | 支持的值或类型 | 说明 |
| --------------- | ------------------- | ----------- |
| ':active' | Object | **(v1.0.9开始支持)**，当节点触发 'touchstart' 事件的时候触发 |

如下所示，当元素被点击的时候，元素会放大，当点击结束，元素又会重置会原样，这对实现按钮特性的时候尤为有用，不需要单独给按钮绑定点击事件手动对元素进行缩放和重置。
``` json
{
  color: '#ffffff',
  backgroundColor: '#34a123',
  borderRadius: 10,
  width: 400,
  height: 120,
  lineHeight: 120,
  fontSize: 50,
  textAlign: 'center',
  marginTop: 20,
  ':active': {
    transform: 'scale(1.05, 1.05)',
  },
}
```

<iframe height="439.15838623046875" style="width: 100%;" scrolling="no" title="Layout Text Button" src="https://codepen.io/yuanzm/embed/MWRoexw?default-tab=js%2Cresult&editable=true" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/yuanzm/pen/MWRoexw">
  Layout Text Button</a> by yuanzm (<a href="https://codepen.io/yuanzm">@yuanzm</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>
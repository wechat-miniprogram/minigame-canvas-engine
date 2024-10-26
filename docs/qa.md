# 常见问题
**Q1. 为什么小游戏用了 Layout 之后感觉滚动不灵敏或者有点按钮的点击位置感觉偏了？**

A1. 因为 Layout 仅仅负责开放数据域的渲染，它不知道自己最终有没有上屏或者被绘制到了屏幕的什么位置，因此要做好事件处理，最方便的就是通过[updateViewPort](../api/api.html#updateviewport)精准告诉 Layout，绝大部分反馈都是这里的值没有传对，请仔细阅读文档并校验参数是否符合预期。

**Q2. Layout 支持 Unity 和 Cocos 等游戏引擎里面的九宫格图么？**

A2. 不支持，Unity 和 Cocos 支持九宫格图的引擎都是在 IDE 里面可以很方面操作，而 Layout 只是个渲染引擎没有 IDE，因此要把九宫格操作用 CSS 的方式表达出来会非常麻烦而且不太好支持，权衡之下目前不考虑支持。

**Q3. Layout 支持节点的显示和隐藏么？**

A3. 不支持通过display none的方式设置隐藏，核心有两个原因，一是 Layout 用的布局引擎是纯 js 版本，已经很多年不更新了，如果要支持隐藏的属性比较麻烦，二是升级布局引擎的话，Layout 的体积会直线上升违背了设计初衷，因此暂不支持。但实际上可以通过 Element.remove 方法将组件从节点树中移除，也可以通过 Element.appendChild 将节点重新添加到节点树来实现显示和隐藏切换的效果，详情可以查看 [Element](components/element) 的文档。

**Q4. Layout支持使用自定义字体么？**

A4. 支持，详情可见[教程](tutorial/font)。
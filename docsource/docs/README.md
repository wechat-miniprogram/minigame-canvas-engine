## 简介


当我们开发一个canvas应用的时候，出于效率的考量，免不了要选择一个渲染引擎（比如**PixiJS**)或者工具链更完备的游戏引擎（比如**Cocos Creator**、**Layabox**)。

渲染引擎通常会有Sprite的概念，一个完整的界面会由很多的Sprite组成，如果编写复杂一点的界面，代码里面会充斥创建精灵、设置精灵位置和样式的“重复代码”，最终我们得到了极致的渲染性能却牺牲了代码的可读性。

为了解决这个问题，游戏引擎通常会有配套的IDE，界面通过拖拽即可生成，最终导出场景配置文件，这大大方便了UI开发，但是游戏引擎一般都很庞大，有时候我们仅仅想开发个好友排行榜。

如果有一款渲染引擎，既能用配置文件的方式来表达界面，又可以做到轻量级，将会大大满足我们开发轻量级 canvas 应用的场景，minigame-canvas-engine 应运而生(后面简称 **Layout** )

有兴趣可以查看详细原理介绍[文章](https://segmentfault.com/a/1190000021297495?_ea=27021986)。

## web端调试

为了方便调试，可以基于 codepen [模板](https://codepen.io/pen?template=VwEeLKw) 构建demo，旧版本[Playground](https://wechat-miniprogram.github.io/minigame-canvas-engine/playground.html)已不再维护。

## 效果预览
<img :src="$withBase('/imgs/screenshot.gif')" width=300>

## 谁在使用
小游戏官方示例

<img :src="$withBase('/imgs/demo.png')" width=200>

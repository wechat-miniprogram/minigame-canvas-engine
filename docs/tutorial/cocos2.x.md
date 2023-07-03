# cocos2.x版本适配

## 简介
Cocos Creator 2.x 自带支持开放数据域开放，详情可见[文档](https://docs.cocos.com/creator/2.4/manual/zh/publish/publish-wechatgame-sub-domain.html)。

Cocos Creator 2.x 对开放数据域的支持原理为开放数据域同样为一个完整的 Cocos 项目，在主域通过 SubContextView 组件来实现开放数据域的绘制和更新等逻辑。使用 Cocos 来开发开放数据域好处在于在开放数据域也是一个完整的游戏引擎在驱动，因此可以更丰富的 UI 效果，但弊端也不少，比如 开放数据域也需要一个引擎、每次调试需要构建等，因此 Cocos Creator 3.x 开放数据域开发方案换成了 Layout 方案，详情可见[文档](https://docs.cocos.com/creator/manual/zh/editor/publish/build-open-data-context.html)。

实际上，Cocos Creator 2.x 同样支持使用 Layout 来开发开放数据域，本文详细介绍。

## 1. 项目创建
本文采用 2.4.11 版本制作 demo，低版本的处理大同小异。

## 简介
原生js开发canvas界面困难而可维护性差，而引入一款游戏引擎又显得太过笨重。本项目旨在让开发者通过类Web开发的方式来降低canvas的开发门槛。

详细原理介绍文章：[https://segmentfault.com/a/1190000021297495?_ea=27021986](https://segmentfault.com/a/1190000021297495?_ea=27021986)

## web端调试
为了方便UI调试，可以在线编辑预览效果: [Playground](https://wechat-miniprogram.github.io/minigame-canvas-engine/playground.html)

## 效果预览
<img :src="$withBase('/imgs/screenshot.gif')" width=300>

## 更多案例
小游戏官方示例

<img :src="$withBase('/imgs/demo.png')" width=300>

动物餐厅

<img :src="$withBase('/imgs/canting.png')" width=300>

## 微信小游戏插件
### 安装使用
1.在game.json配置插件引用:
```
{
    "deviceOrientation": "portrait",
    "openDataContext": "sub",
    "plugins": {
      "Layout": {
        "version": "0.0.14",
        "provider": "wx7a727ff7d940bb3f",
        "contexts":[{"type":"openDataContext"}]
      }
    }
}

```

2.在开放数据域内引用插件：
```
const Layout = requirePlugin('Layout').default;
```

3. 正常使用Layout来进行渲染

## 更新日志
#### 2022.11.19
1. `F` 修复ScrollView可能出现的图片渲染不出来的问题
2. `U` 小游戏插件发布 0.0.14 版本

#### 2022.7.27
1. `F` 修复事件问题，修复图片渲染问题
2. `U` 小游戏插件发布 0.0.13 版本

#### 2022.1.13
1. `U` 支持 dataset 特性
2. `U` 小游戏插件发布 0.0.10 版本
#### 2022.1.9
1. `U` BitMapText 支持 letterSpacing样式，支持解析配置里面的kerning
2. `U` 小游戏插件发布 0.0.9 版本
#### 2021.12.6
1. `F` 修复点击层级的问题；
2. `U` 小游戏插件发布 0.0.8 版本
#### 2021.9.19
1. `F` 修复文档拼写错误；
2. `U` npm 发布1.0.6版本；
3. `F` 修复点击事件不准确[问题](https://github.com/wechat-miniprogram/minigame-canvas-engine/issues/6);
#### 2021.9.2
1. `U` 重写Scrollview，引用[scroller](https://github.com/pbakaus/scroller)，支持横向滚动和纵向滚动，体验更好；
2. `A` Scrollview 新增scrollX和scrollY配置，用于标识是否需要横向滚动和纵向滚动；
3. `F` 修复 ScrollView 查询节点找不到的bug；
4. `A` ScrollView 支持 scroll 事件；
5. `A` ScrollView 支持 scrollTo API；
6. `F` borderRadius 和 borderWidth 原先属性冲突；
7. `A` 新增样式支持：borderTopLeftRadius、borderTopRightRadius、borderBottomLeftRadius、borderBottomRightRadius
8. `D` borderLeftWidth、borderRightWidth、borderTopWidth、borderBottomWidth、borderTopColor、borderBottomColor、borderLeftColor、borderRightColor 废弃；
9. `U` [引擎插件](https://mp.weixin.qq.com/wxopen/plugindevdoc?appid=wx7a727ff7d940bb3f&token=1278230091&lang=zh_CN)发布0.0.7版本，支持以上更新点；

#### 2019.11.19
1. `U` 重写Scrollview，内存占用更低
2. `U` [引擎插件](https://mp.weixin.qq.com/wxopen/plugindevdoc?appid=wx7a727ff7d940bb3f&token=1278230091&lang=zh_CN)发布0.0.6版本

#### 2020.6.11
1. `F` 修复渲染层级问题
2. `A` 发布成小游戏[引擎插件](https://mp.weixin.qq.com/wxopen/plugindevdoc?appid=wx7a727ff7d940bb3f&token=1766767136&lang=zh_CN)
3. `U` IDE迭代，支持项目切换

#### 2019.11.24
1. `U` 对文字增加textOverflow支持

#### 2019.11.19
1. 初次发布


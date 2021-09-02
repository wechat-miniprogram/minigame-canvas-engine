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
        "version": "0.0.7",
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
详见[CHANGELOG.md](CHANGELOG.md)

# 轻量级canvas渲染引擎插件

## 简介
本插件将[minigame-canvas-engine](https://wechat-miniprogram.github.io/minigame-canvas-engine/)发布成引擎插件。

## 安装使用
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

2.在开放数据域内引用插件:
```
const Layout = requirePlugin('Layout').default;
```

3.正常使用Layout来进行渲染；
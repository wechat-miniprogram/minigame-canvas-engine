# 微信小游戏插件

除了通过 npm 的方式引用，在微信小游戏场景下，还支持通过插件的方式引用。

::: tip
通过插件的方式，玩家本地有其他游戏使用了相同版本插件可以免去下载，达到提升启动速度的效果。
:::

## 安装使用

### 开放数据域引用

1.在game.json声明Layout插件:
``` json
{
  "deviceOrientation": "portrait",
  "openDataContext": "sub",
  "plugins": {
    "Layout": {
      "version": "1.0.8",
      "provider": "wx7a727ff7d940bb3f",
      "contexts":[{"type":"openDataContext"}]
    }
  }
}

```

2. 添加Layout插件
game.json 声明 Layout 插件之后，微信开发者工具控制台会出现添加插件按钮，点击添加即可。
![Alt text](image.png)

某些低版本的微信开发者工具可能没有这个添加入口，可以通过[链接](https://mp.weixin.qq.com/wxopen/plugindevdoc?appid=wx7a727ff7d940bb3f&token=&lang=zh_CN) 手动添加下。
![Alt text](image-1.png)

3. 在开放数据域内引用插件：
``` js
const Layout = requirePlugin('Layout').default;
```

4. 使用Layout来进行渲染。

### 在游戏域引用
::: tip
在游戏域引用和在开放数据域引用的差别在于 contexts 的类型，在游戏域为 **gameContext**，在开放数据域为 **openDataContext**
:::


1.在game.json配置插件引用:
``` json
{
  "deviceOrientation": "portrait",
  "plugins": {
    "Layout": {
      "version": "1.0.8",
      "provider": "wx7a727ff7d940bb3f",
      "contexts":[{"type":"gameContext"}]
    }
  }
}
```

2.在开放数据域内引用插件：
``` js
const Layout = requirePlugin('Layout').default;
```

3. 正常使用Layout来进行渲染。


### 同时在游戏域和开放数据域使用
配置方式如下
``` json
{
  "deviceOrientation": "portrait",
  "plugins": {
    "Layout": {
      "version": "1.0.8",
      "provider": "wx7a727ff7d940bb3f",
      "contexts":[{"type":"gameContext"}, {"type":"openDataContext"}]
    }
  }
}
```

## 版本列表
| 版本          | 特性      | 
| --------------- | ------------------- |
| 1.0.8        | 支持文字描边和文字阴影效果，详情可见[布局和样式](../components//overview.md) |
| 1.0.7        | 修复1.0.6版本Image的borderRadius失效问题 |
| 1.0.6        | 1. 修复圆角矩形在有borderRadius的时候绘制不够圆润问题；2. 文字样式支持fontFamily属性；3. 修复 ScrollView 的滚动条在页面布局变化时会位置异常问题; |
| 1.0.5        | transform 部分属性支持，使用可见[教程](../tutorial/loading.md) |
| 1.0.4        | ScrollView 支持 [滚动条](../components/scrollbar.md) 特性 |
| 1.0.3        | 兼容在字节小游戏下报错问题 |
| 1.0.2        | ts重构项目，支持富文本插件能力 |
| 1.0.1        | 修复style.backgroundImage调用不生效问题 |
| 1.0.0        | 修复一些渲染问题；支持缓动特性；支持canvas组件 |
| 0.0.14        | 起始版本，之前的版本小修小补一些问题，**不建议引用** |


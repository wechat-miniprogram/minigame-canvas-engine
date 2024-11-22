import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Layout",
  description: "轻量级 Canvas2d 渲染引擎",
  base: "/minigame-canvas-engine/",
  head: [
    // meta
    ["meta", { name: "robots", content: "all" }],
    ["meta", { name: "author", content: "yuanzm" }],
    ["meta", { name: "keywords", content: "minigame-canvans-engine, minigame, canvas, engine, game engine" }],
    ['link', { rel: 'shortcut icon', type: "image/x-icon", href: `./imgs/favicon.ico` }],
    [
      'script',
      { id: 'statcounter' },
      `
        var sc_project=12873270; 
        var sc_invisible=1; 
        var sc_security="efed24b4";
      `
    ],
    ["script", { src: "https://www.statcounter.com/counter/counter.js", async: "true" }]
  ],

  themeConfig: {
    search: {
      provider: 'local',
      options: {
        translations: {
          button: {
            buttonText: '搜索',
            buttonAriaLabel: '搜索'
          },
          modal: {
            displayDetails: '显示详细列表',
            resetButtonTitle: '重置搜索',
            backButtonTitle: '关闭搜索',
            noResultsText: '没有结果',
            footer: {
              selectText: '选择',
              selectKeyAriaLabel: '输入',
              navigateText: '导航',
              navigateUpKeyAriaLabel: '上箭头',
              navigateDownKeyAriaLabel: '下箭头',
              closeText: '关闭',
              closeKeyAriaLabel: 'esc'
            }
          }
        },
      }
    },
    lastUpdated: {
      text: '上次更新',
      formatOptions: {
        dateStyle: 'full',
        timeStyle: 'medium'
      }
    },
    outline: {
      label: '页面导航'
    },
    nav: [
      {
        text: "微信小游戏官方文档",
        link: "https://developers.weixin.qq.com/minigame/dev/guide/",
      },
    ],

    sidebar: [
      {
        text: "概览",
        link: "/index",
        items: [
          { text: '简介', link: '/index'},
          { text: '常见问题', link: '/qa'},
          {
            text: '更新日志',
            link: '/CHANGELOG',
          }
        ]
      },

      {
        text: "安装使用",
        link: '/overview/guide',
        items: [
          { text: '快速入门', link: '/overview/guide'},
          { text: '微信小游戏插件', link: '/overview/plugin'}
        ]
      },
      {
        text: '教程',
        link: '/tutorial/cocos2.x',
        items: [
          { text: '模板引擎使用', link: '/tutorial/templateengine'},
          { text: '动态修改样式', link: '/tutorial/style'},
          { text: 'cocos2.x版本适配', link: '/tutorial/cocos2.x'},
          { text: '使用字体', link: '/tutorial/font'},
          { text: '加载中效果实现', link: '/tutorial/loading'},
          { text: '平台适配', link: '/tutorial/platform'},
          { text: '缓动系统', link: '/api/tween'},
        ],
      },
      {
        text: '更多示例',
        link:'/demos/invite',
        items: [
          { text: '好友排行榜', link: '/demos/rank'},
          { text: '邀请好友组件', link: '/demos/invite'},
        ],
      },
      {
        text: 'API 文档',
        link: '/api/api',
        items: [
          { text: 'Layout', link: '/api/api', },
          { text: '布局和样式', link: '/components/overview.md', },
          {
            text: '组件',
            link: '/components/element.md',
            items: [
              { text: 'Element', link: '/components/element.md', },
              { text: 'View', link: '/components/view.md', },
              { text: 'Image', link: '/components/image.md', },
              { text: 'Text', link: '/components/text.md', },
              { text: 'BitmapText', link: '/components/bitmapfont.md', },
              { text: 'Canvas', link: '/components/canvas.md', },
              { text: 'ScrollView', link: '/components/scrollview.md', },
            ]
          },
        ],
      },
      {
        text: '插件机制',
        link: '/plugin/guide',
        items: [
          { text: '概览', link: '/plugin/guide', },
          { text: '富文本插件', link: '/plugin/richtext'}
        ],
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/wechat-miniprogram/minigame-canvas-engine' }
    ]
  }
})

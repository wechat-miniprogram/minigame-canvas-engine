import { defaultTheme } from 'vuepress';

let statcounter = [];

if (process.env.NODE_ENV === 'production') {
  statcounter = [["script", {}, `
  var sc_project=12873270; 
  var sc_invisible=1; 
  var sc_security="efed24b4"; 
  `],
  ["script", { src: "https://www.statcounter.com/counter/counter.js", async: true }]];
}


export default {
  base: "/minigame-canvas-engine/",
  description: '轻量级canvas渲染引擎',
  head: [
    // meta
    ["meta", { name: "robots", content: "all" }],
    ["meta", { name: "author", content: "yuanzm" }],
    ["meta", { name: "keywords", content: "minigame-canvans-engine, minigame, canvas, engine, game engine" }],
    ['link', { rel: 'shortcut icon', type: "image/x-icon", href: `./imgs/favicon.ico` }]
  ].concat(statcounter),
  theme: defaultTheme({
    logo: '/imgs/logo.png',
    contributors: false,
    repo: 'wechat-miniprogram/minigame-canvas-engine',
    lastUpdated: true,
    lastUpdatedText: '上次更新', // string | boolean
    sidebarDepth: 1,
    sidebar: [
      // SidebarItem
      {
        text: '概览',   // 必要的
        link: '/',
      },
      {
        text: '安装使用',
        link: '/overview/guide',
        children: [
          '/overview/guide',
          '/overview/plugin.md'
        ],
      },
      {
        text: '更多示例',
        link: '/demos/invite',
        children: [
          '/demos/invite',
          '/demos/rank'
        ],
      },
      {
        text: 'API 文档',
        link: '/api/api',
        children: [
          '/api/api',
          '/components/overview.md',
          {
            text: '组件',
            link: '/components/element.md',
            collapsible: true,
            children: [
              '/components/element.md',
              '/components/view.md',
              '/components/image.md',
              '/components/text.md',
              '/components/bitmapfont.md',
              '/components/canvas.md',
              '/components/scrollview.md',
            ]
          },
          '/api/tween',
        ],
      },
      {
        text: '插件机制',
        link: '/plugin/guide',
        children: [
          '/plugin/guide',
          '/plugin/richtext'
        ],
      },
      {
        text: '更新日志',
        link: '/CHANGELOG',
      }
    ],
  })
}

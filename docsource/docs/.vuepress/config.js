module.exports = {
  title: 'minigame-canvas-engine',
  base: "/minigame-canvas-engine/",
  description: '轻量级canvas渲染引擎',
  head: [
    // meta
    ["meta", { name: "robots", content: "all" }],
    ["meta", { name: "author", content: "yuanzm" }],
    ["meta", { name: "keywords", content: "minigame-canvans-engine, minigame, canvas, engine, game engine" }],
  ],
  themeConfig: {
    repo: 'wechat-miniprogram/minigame-canvas-engine',
    lastUpdated: '上次更新', // string | boolean
    sidebar: [
      {
        title: '概览',   // 必要的
        path: '/',       
      },
      {
        title: '安装使用',
        collapsable: false, // 可选的, 默认值是 true,
        sidebarDepth: 2,    // 可选的, 默认值是 1
        children: [
          '/overview/guide',
          '/overview/plugin.md'
        ]
      },
      {
        title: 'API 文档',
        collapsable: false, // 可选的, 默认值是 true,
        sidebarDepth: 1,    // 可选的, 默认值是 1
        children: [
          '/api/api',
          '/api/tags',
          '/api/style',
          '/api/tween',
        ]
      },
      {
        title: '更新日志',
        path: '/CHANGELOG',
      },
    ]
  }
}

window.smartMapleBridgeKnowledge = {
  greeting: {
    title: "智能枫桥",
    helper: "我可以帮你快速判断先看哪里、适合走哪条路径，以及该进入哪个页面。"
  },
  quickActions: [
    "了解枫桥",
    "今日推荐路线",
    "进入互动地图",
    "查看照片墙",
    "查看公告栏",
    "适合居民的信息"
  ],
  responses: {
    "了解枫桥": {
      title: "先认识枫桥",
      text: "枫桥最适合先从古桥、水巷和寒山寺三条线索理解。首页导览能帮你快速建立整体印象，再决定继续看地图、照片还是公告。",
      links: [
        { label: "前往首页导览", href: "index.html#guide" },
        { label: "查看景区信息", href: "index.html#services" }
      ]
    },
    "今日推荐路线": {
      title: "今天适合这样走",
      text: "如果你是第一次来，建议先看首页导览，再进入互动地图建立空间感，最后用照片墙补足氛围。如果时间更紧，可以先看首页的核心信息和服务提示。",
      links: [
        { label: "查看首页导览", href: "index.html#guide" },
        { label: "进入互动地图", href: "interactive-map.html" }
      ]
    },
    "进入互动地图": {
      title: "去更深的探索页",
      text: "互动地图适合想继续深入的游客。那里可以点击景点热点、体验寒山寺祈福互动，还能在水域区域进入《枫桥夜泊》的诗意体验。",
      links: [
        { label: "打开互动地图", href: "interactive-map.html" }
      ]
    },
    "查看照片墙": {
      title: "去看看大家留下的枫桥瞬间",
      text: "照片墙更适合轻松浏览氛围、人物和日常片段，也方便随手上传你在枫桥拍下的瞬间。",
      links: [
        { label: "打开照片墙", href: "photo-wall.html" }
      ]
    },
    "查看公告栏": {
      title: "需要更实用的信息时",
      text: "公告栏更偏社区信息页，适合查看活动安排、运营更新和便民提醒。它的信息结构比首页更完整，也更适合居民快速扫读。",
      links: [
        { label: "打开公告栏", href: "notice-board.html" }
      ]
    },
    "适合居民的信息": {
      title: "居民可以先看这些",
      text: "如果你更关心社区活动、场地安排或日常提醒，建议直接进入公告栏。那里已经按“社区活动、景区运营、便民提醒”做了分类。",
      links: [
        { label: "查看居民公告", href: "notice-board.html" },
        { label: "回到首页服务信息", href: "index.html#services" }
      ]
    },
    "我想快速看懂枫桥": {
      title: "用最短路径了解枫桥",
      text: "建议先浏览首页导览区，再看服务信息和互动入口。这样可以在较短时间内建立景点印象与浏览顺序。",
      links: [
        { label: "回到首页导览", href: "index.html#guide" }
      ]
    },
    "我想拍照和看氛围": {
      title: "适合先去照片墙",
      text: "如果你更关注氛围、光影和共享内容，照片墙会比地图更直接。它更轻松，也更适合先感受枫桥的视觉气质。",
      links: [
        { label: "进入照片墙", href: "photo-wall.html" }
      ]
    },
    "今天怎么玩": {
      title: "给你一条今日轻量路径",
      text: "先看首页导览，再进入互动地图点开两个热点，最后去照片墙或公告栏补足你更关心的内容。游客适合照片墙，居民适合公告栏。",
      links: [
        { label: "查看首页", href: "index.html" },
        { label: "打开互动地图", href: "interactive-map.html" }
      ]
    }
  },
  fallback: {
    title: "可以这样继续",
    text: "我会帮你在导览、路线、互动地图、照片墙和公告栏之间快速找到下一步。",
    links: [
      { label: "回到首页概览", href: "index.html" },
      { label: "查看完整助手页", href: "smart-agent.html" }
    ]
  }
};

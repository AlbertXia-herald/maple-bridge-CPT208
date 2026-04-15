window.smartMapleBridgeKnowledge = {
  greeting: {
    title: "智能枫桥",
    helper: "我可以帮你快速判断更适合走哪种方向、看哪段内容，以及从哪里开始更顺手。"
  },
  quickActions: [
    "了解枫桥",
    "今日推荐路线",
    "路线推荐",
    "查看照片墙",
    "查看公告栏",
    "适合居民的信息"
  ],
  responses: {
    "了解枫桥": {
      title: "先认识枫桥",
      text: "如果想先建立整体印象，建议从桥、水巷和寒山寺这三条线索进入。先把景区气质看清楚，再决定往运河、关隘还是古镇方向继续走。",
      links: [
        { label: "前往首页导览", href: "index.html#guide" },
        { label: "查看景区信息", href: "index.html#services" }
      ]
    },
    "今日推荐路线": {
      title: "今天适合这样走",
      text: "如果你是第一次来，今天更适合从桥与运河线入手：先看枫桥桥身与江村桥，再沿着古运河慢慢走。如果更想看历史层次，可以把重点放在铁岭关与沿线旧址；想轻松逛，就走古镇漫游方向。",
      links: [
        { label: "景区概览", href: "index.html#guide" },
        { label: "路线推荐", href: "interactive-map.html#route-recommend-panel" }
      ]
    },
    "路线推荐": {
      title: "去看更细的路线建议",
      text: "互动地图里的路线推荐会按时间和偏好，帮你在桥与运河、历史关隘、古镇漫游之间挑出更合适的一条，适合已经准备开始逛的人。",
      links: [
        { label: "路线推荐", href: "interactive-map.html#route-recommend-panel" }
      ]
    },
    "查看照片墙": {
      title: "去看看大家留下的枫桥瞬间",
      text: "如果你更关注光影、人物与生活气息，照片墙会比地图更快带你进入气氛，也方便先看看别人都把镜头停留在哪些角落。",
      links: [
        { label: "打开照片墙", href: "photo-wall.html" }
      ]
    },
    "查看公告栏": {
      title: "需要更实用的信息时",
      text: "如果你更关心社区活动、运营更新或便民提醒，建议直接查看公告栏。它更适合快速确认最近安排，不必在景区信息里来回找。",
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
      title: "用最短路径认识枫桥",
      text: "建议先看首页导览建立整体印象，再根据你更偏好的方向决定下一步：想看空间肌理走桥与运河，想看历史层次走历史关隘，想轻松漫游就看古镇方向。",
      links: [
        { label: "回到首页导览", href: "index.html#guide" },
        { label: "路线推荐", href: "interactive-map.html#route-recommend-panel" }
      ]
    },
    "我想拍照和看氛围": {
      title: "适合先去照片墙",
      text: "如果你更关注光影、街巷与人情味，照片墙会比地图更快带你进入气氛，也方便先看看别人都把镜头停留在哪些角落。",
      links: [
        { label: "进入照片墙", href: "photo-wall.html" }
      ]
    },
    "今天怎么玩": {
      title: "今天可以这样安排",
      text: "若时间不长，优先走桥与运河线；若想看更厚重的历史层次，可以转向铁岭关一带；若更想放慢节奏，则适合去古镇漫游。想把路线细化时，可以直接去互动地图看路线推荐。",
      links: [
        { label: "景区概览", href: "index.html" },
        { label: "路线推荐", href: "interactive-map.html#route-recommend-panel" }
      ]
    }
  },
  fallback: {
    title: "可以这样继续",
    text: "我会帮你在游玩方向、路线推荐、照片墙和公告栏之间快速找到更适合的下一步。",
    links: [
      { label: "回到首页概览", href: "index.html" },
      { label: "查看完整助手页", href: "smart-agent.html" }
    ]
  }
};
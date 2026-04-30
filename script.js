const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");
const navLinks = document.querySelectorAll(".site-nav a");
const audioToggle = document.querySelector("[data-audio-toggle]");
const seniorModeToggle = document.querySelector("[data-senior-mode-toggle]");
const languageToggle = document.querySelector("[data-language-toggle]");
const settingsToggle = document.querySelector("[data-settings-toggle]");
const settingsPanel = document.querySelector("[data-settings-panel]");
const settingsAudioAction = document.querySelector("[data-settings-audio]");
const settingsSeniorAction = document.querySelector("[data-settings-senior]");
const settingsLanguageAction = document.querySelector("[data-settings-language]");
const settingsAudioStatus = document.querySelector("[data-settings-audio-status]");
const settingsSeniorStatus = document.querySelector("[data-settings-senior-status]");
const settingsLanguageStatus = document.querySelector("[data-settings-language-status]");
const AUDIO_MUTED_STORAGE_KEY = "mapleBridgeAudioMuted";
const SENIOR_MODE_STORAGE_KEY = "mapleBridgeSeniorMode";
const LANGUAGE_STORAGE_KEY = "mapleBridgeLanguage";
// Replace this path to choose a different background music file for the site.
const BACKGROUND_AUDIO_SRC = "audio/塞壬唱片-MSR,HeartStrings - 辞岁行.mp3";

const I18N_TEXT = {
  "common.brand.name": { zh: "枫盈苏州", en: "Maple Bridge Suzhou" },
  "common.brand.tagline": { zh: "苏州枫桥文化导览", en: "Maple Bridge Cultural Guide" },
  "common.audio": { zh: "音乐", en: "Music" },
  "common.senior": { zh: "长辈模式", en: "Senior Mode" },
  "common.language": { zh: "中/EN", en: "ZH/英" },
  "common.settings": { zh: "设置", en: "Settings" },
  "common.nav.open": { zh: "打开导航", en: "Open navigation" },
  "common.nav.home": { zh: "首页", en: "Home" },
  "common.nav.map": { zh: "互动地图", en: "Interactive Map" },
  "common.nav.photo": { zh: "照片墙", en: "Photo Wall" },
  "common.nav.notice": { zh: "公告栏", en: "Notice Board" },
  "common.nav.agent": { zh: "智能枫桥", en: "Smart Maple Bridge" },
  "common.close": { zh: "关闭", en: "Close" },
  "index.hero.title": { zh: '用一页看懂枫桥，<span>也能从这里慢慢深入。</span>', en: 'Understand Maple Bridge in one page,<span>and still keep exploring from here.</span>' },
  "index.hero.summary": { zh: "在进入景区之前，你可以先用这一页建立对枫桥的整体印象，再按兴趣进入互动地图、照片墙、公告栏与智能问答，找到更适合自己的浏览方式。", en: "Before you enter the scenic area, use this page to build a clear first impression of Maple Bridge, then continue into the interactive map, photo wall, notice board, or smart guide based on your interests." },
  "index.weather.eyebrow": { zh: "当日天气", en: "Today's Weather" },
  "index.weather.title": { zh: "枫桥出游指数", en: "Maple Bridge Visit Index" },
  "index.forecast.eyebrow": { zh: "未来 7 天", en: "Next 7 Days" },
  "index.forecast.title": { zh: "一周天气趋势", en: "Weekly Weather Trend" },
  "index.forecast.high": { zh: "最高温", en: "High" },
  "index.forecast.low": { zh: "最低温", en: "Low" },
  "index.guide.eyebrow": { zh: "导览", en: "Guide" },
  "index.guide.title": { zh: "一听钟声深处，半入枫桥画中", en: "Enter its history through a few words." },
  "index.guide.summary": { zh: "欢迎来到枫桥，这里不只是古运河畔的一处景点，更是《枫桥夜泊》里穿越千年的回响。请放慢脚步，在古寺、古桥与流水间，寻回那份独属于江南的宁静与诗意。", en: "Maple Bridge Scenic Area works well as a cultural starting point for a first visit to Suzhou. Its appeal lies not in a single landmark, but in the combined atmosphere created by old bridges, canals, temples, waterside lanes, and poetic memory." },
  "index.guide.card1.title": { zh: "景区概貌", en: "What Kind of Place Is Maple Bridge?" },
  "index.guide.card1.p1": { zh: "今日的枫桥景区，是以寒山寺为核心，整合大运河故道、铁铃关、江村桥及水乡水巷资源形成的文化生态保护区。", en: "Located along Suzhou's Grand Canal, Maple Bridge Scenic Area is shaped by Maple Bridge, Hanshan Temple, Jiangcun Bridge, and the waterside lanes nearby. It is not a theme-park-style destination, but a Jiangnan cultural place centered on atmosphere, heritage, and slow exploration." },
  "index.guide.card1.p2": { zh: "景区完整保留了“粉墙黛瓦、人家枕河”的江南水乡格局，是苏式传统生活形态的典型留存区域。通过持续开展生态修复与环境提升，铁铃关等历史遗存与新建的运河步道、滨水绿廊有机融合，实现了历史风貌保护与现代公共休闲功能的衔接。", en: "When people mention Maple Bridge, they often think of the imagery of 'Mooring by Maple Bridge at Night'. Visitors therefore do not just look at bridges, water, and temples here; they step into a cultural scene shaped by night mooring, bell sounds, and canal memory." },
  "index.guide.card1.p3": { zh: "作为苏州城西重要的生态休闲空间，枫桥景区既是市民日常休憩的城市绿肺，也是展示大运河文化带建设成果、传播江南水乡文化的重要窗口。", en: "" },
  "index.guide.card2.title": { zh: "历史脉络", en: "Cultural Value" },
  "index.guide.card2.p": { zh: "枫桥的历史脉络可追溯至隋唐时期，于明清两代达到鼎盛。作为大运河沿线重要节点，它曾是“吴门第一关”，承担漕运枢纽与军事防御功能，见证了苏州城市发展与商贸兴衰。", en: "What makes the area especially compelling is the resonance between poetry, history, and real space. The bells of Hanshan Temple, the waterways by the bridge, and the Jiangnan nightscape make it a place not only to visit, but also to read slowly and remember." },
  "index.guide.card3.title": { zh: "文学滥觞", en: "How to Approach a Visit" },
  "index.guide.card3.p": { zh: "唐代诗人张继《枫桥夜泊》的流传，使枫桥成为极具影响力的文化符号；明代铁铃关的修筑，更赋予其抵御外侮的历史意义。从漕运商贸的繁华盛景，到文人雅士的诗意吟咏，再到保家卫国的烽火记忆，历史印记层层积淀，赋予景区内古桥、古碑、关隘等遗存深厚的文化内涵与历史价值。", en: "If it is your first time here, think of Maple Bridge as a cultural site best experienced by walking, watching, listening, and reflecting. The homepage builds the overall impression first, while the next pages unfold its spatial relationships and visual atmosphere in more depth." },
  "index.guide.notice.title": { zh: "参观须知", en: "Visitor Notes" },
  "index.guide.notice.intro": { zh: "先记住几条稳定的园区提醒，会让当天的参观更从容，也更适合与周围环境相处。", en: "A few steady on-site reminders can make the visit smoother and more considerate of the space around you." },
  "index.guide.notice.item1": { zh: "文明游园，爱护景观设施，保持环境整洁。", en: "Visit respectfully, take care of the landscape facilities, and help keep the area clean." },
  "index.guide.notice.item2": { zh: "宠物、危险品及机动车、非机动车不得进入游览区域。", en: "Pets, dangerous items, and motor or non-motor vehicles are not allowed in the visiting areas." },
  "index.guide.notice.item3": { zh: "注意水域安全，请勿攀爬翻越；放飞无人机等活动需事先许可。", en: "Stay safe near the water, do not climb or cross barriers, and get permission before activities such as drone flying." },
  "index.services.eyebrow": { zh: "攻略秘籍", en: "Essentials" },
  "index.services.title": { zh: "把到访前最常用的支持信息集中在这里", en: "Keep the most useful pre-visit information in one clear place." },
  "index.services.summary": { zh: "保留一组简洁、可靠的服务信息，帮助首次浏览首页的用户快速处理出行、票务和现场咨询这三类常见问题。", en: "This section keeps travel, ticketing, and on-site enquiry information concise and reliable for users who want practical support at a glance." },
  "index.services.travel.tag": { zh: "出行", en: "Travel" },
  "index.services.travel.title": { zh: "景区怎么到", en: "How to Get There" },
  "index.services.travel.metro": { zh: "<strong>地铁：</strong>乘坐地铁1号线至「西环路站」下车，步行约15分钟可达。", en: "<strong>Metro:</strong> Take Metro Line 1 to Xihuan Road Station, then walk about 15 minutes." },
  "index.services.travel.bus": { zh: "<strong>公交：</strong>可乘坐301路、303路、313路、406路、415路、442路至「枫桥景区站」下车。", en: "<strong>Bus:</strong> Routes 301, 303, 313, 406, 415, and 442 stop at Maple Bridge Scenic Area Station." },
  "index.services.travel.drive": { zh: "<strong>自驾：</strong>景区内设有停车场，位于枫桥路与寒山寺路交叉口，收费标准为10元/次。", en: "<strong>Driving:</strong> Parking is available inside the scenic area near the Fengqiao Road and Hanshan Temple Road junction. Fee: RMB 10 per entry." },
  "index.services.travel.detail": { zh: "详情", en: "Details" },
  "index.services.travel.modal.kicker": { zh: "出行详情", en: "Travel Details" },
  "index.services.ticket.tag": { zh: "票务", en: "Tickets" },
  "index.services.ticket.title": { zh: "在线订票", en: "Book Tickets Online" },
  "index.services.ticket.p1": { zh: "点击进入官方票务入口，提前查看开放安排、购票要求与入园说明。", en: "Open the official ticketing page to review opening arrangements, booking requirements, and admission guidance in advance." },
  "index.services.ticket.p2": { zh: "新标签页打开，便于随时返回首页继续浏览。", en: "Opens in a new tab so you can return to the homepage at any time." },
  "index.services.ticket.time": { zh: "服务时间：07:30-17:00", en: "Service Hours: 07:30-17:00" },
  "index.services.ticket.note": { zh: "点击图标即可跳转至购票页面", en: "Tap the icon to open the ticket booking page." },
  "index.services.hotline.tag": { zh: "热线电话", en: "Hotline" },
  "index.services.hotline.title": { zh: "咨询电话", en: "Enquiry Number" },
  "index.services.hotline.time": { zh: "服务时间：08:00-20:00", en: "Service Hours: 08:00-20:00" },
  "index.services.hotline.note": { zh: "可用于咨询出行、票务或现场参观相关问题。", en: "Available for travel, ticketing, and on-site visit enquiries." },
  "index.entries.agent.eyebrow": { zh: "智能枫桥", en: "Smart Maple Bridge" },
  "index.entries.agent.title": { zh: "从此处走入枫桥的智慧世界", en: "From here scor into the world of Maple Bridge." },
  "index.entries.agent.p": { zh: "智能枫桥承担首页之外的即时帮助，让“想知道下一步看什么”的用户不需要自己摸索。它既适合游客快速找入口，也适合居民直接跳到公告信息。", en: "Smart Maple Bridge offers instant help beyond the homepage, so users do not need to guess what to do next. It works both for visitors seeking quick guidance and for residents who want to jump straight to notices." },
  "index.entries.agent.open": { zh: "打开智能枫桥", en: "Open Smart Guide" },
  "index.entries.agent.full": { zh: "查看完整助手页", en: "Open Full Assistant Page" },
  "index.entries.map.tag": { zh: "互动地图", en: "Interactive Map" },
  "index.entries.map.title": { zh: "实景导览", en: "Explore by Location" },
  "index.entries.map.p": { zh: "支持个性化路线定制，直观掌握景点布局，让您出行更省心。", en: "Best for visitors who want a stronger sense of place and route." },
  "index.entries.photo.tag": { zh: "照片墙", en: "Photo Wall" },
  "index.entries.photo.title": { zh: "撞见枫桥光影", en: "Enter Through Images" },
  "index.entries.photo.p": { zh: "汇集经典场景与游客实拍，用图片感受枫桥的诗意，提前种草打卡点。", en: "A lighter visual way to browse the atmosphere of Maple Bridge." },
  "index.entries.notice.tag": { zh: "公告栏", en: "Notice Board" },
  "index.entries.notice.title": { zh: "最新动态提醒", en: "See Updates and Alerts" },
  "index.entries.notice.p": { zh: "集中展示最新社区活动、景区运营与便民服务通知，让您及时了解重要信息。", en: "View notices, activities, and updates in a clear, practical format." },
  "index.modal.kicker": { zh: "智能枫桥", en: "Smart Maple Bridge" },
  "index.modal.title": { zh: "景区导览助手", en: "Scenic Guide Assistant" },
  "interactive.hero.title": { zh: '点开一张枫桥地图，<span>从景点、诗意与祈愿里</span>慢慢走进去。', en: 'Open a Maple Bridge map,<span>and wander in through sights, poetry,</span>and blessings.' },
  "interactive.hero.summary": { zh: "你可以点击不同地点，查看景点解读，或进入围绕寒山寺与水面意象展开的趣味小游戏。", en: "Tap different locations to read about scenic spots or enter playful interactions built around Hanshan Temple and the imagery of the water." },
  "interactive.route.eyebrow": { zh: "路线推荐", en: "Route Suggestions" },
  "interactive.route.title": { zh: "按停留时间与兴趣方向，挑一条更适合当下节奏的走法。", en: "Choose a route that fits your time and interests." },
  "interactive.route.note": { zh: "先选时间，再定偏好。完成后会先在这里给出一条轻量摘要，想看完整建议时可以打开详细页查看。", en: "Choose your time first, then your preference. A quick summary will appear here, and you can open the full recommendation when needed." },
  "interactive.route.time": { zh: "时间", en: "Time" },
  "interactive.route.preference": { zh: "偏好", en: "Preference" },
  "interactive.map.eyebrow": { zh: "地图探索", en: "Map Exploration" },
  "interactive.map.title": { zh: "点击地点入口，沿着枫桥一带慢慢发现内容", en: "Tap the points and discover Maple Bridge step by step." },
  "interactive.map.summary": { zh: "圆形入口：景点介绍，三角形入口：玩法互动", en: "Round markers open scenic information. Triangle markers open playful interactions." },
  "interactive.map.scenic.title": { zh: "景点入口", en: "Scenic Spots" },
  "interactive.map.scenic.p": { zh: "圆形按钮会打开景点信息面板，阅读景点介绍、历史片段与看点摘要。", en: "Round buttons open a scenic information panel with short introductions, history, and key highlights." },
  "interactive.map.play.title": { zh: "玩法入口", en: "Playful Interactions" },
  "interactive.map.play.p": { zh: "三角形按钮代表小游戏入口。寒山寺可进行祈福小游戏，水域区域可进入《枫桥夜泊》互动。", en: "Triangle buttons lead to mini interactions. Hanshan Temple offers a blessing game, while the water area opens the poem interaction." },
  "interactive.legend.scenic": { zh: "景点解读", en: "Scenic Info" },
  "interactive.legend.play": { zh: "游戏交互", en: "Playful Mode" },
  "interactive.fallback.eyebrow": { zh: "真实地图未就绪", en: "Map Unavailable" },
  "interactive.fallback.title": { zh: "地图暂时未能加载", en: "The map could not be loaded right now." },
  "interactive.fallback.p": { zh: "请稍后刷新页面，或检查当前网络环境后再次进入互动地图。", en: "Please refresh later or check your network connection before reopening the interactive map." },
  "interactive.modal.exploring": { zh: "探索中", en: "Exploring" },
  "interactive.modal.route": { zh: "路线推荐", en: "Route Suggestions" },
  "interactive.modal.routeTitle": { zh: "导览建议", en: "Guide Suggestion" },
  "photo.hero.title": { zh: '把你在枫桥遇见的<span>光影、桥影和人情味，</span>轻轻挂上来。', en: 'Hang up the moments you meet at Maple Bridge,<span>its light, bridges, and human warmth.</span>' },
  "photo.hero.summary": { zh: "照片墙汇集了游客与居民在枫桥留下的光影瞬间，也欢迎你把自己的所见所感一并挂上来。", en: "The photo wall gathers moments captured by visitors and residents at Maple Bridge, and welcomes you to share your own view as well." },
  "photo.upload.eyebrow": { zh: "上传入口", en: "Upload" },
  "photo.upload.title": { zh: "上传一张照片", en: "Upload a Photo" },
  "photo.upload.p": { zh: "选中图片后即可查看效果", en: "Choose an image to preview it instantly." },
  "photo.upload.strong": { zh: "把这一刻挂上来", en: "Hang This Moment Here" },
  "photo.upload.span": { zh: "选择图片后会在下方即时预览", en: "Selected images will appear below right away." },
  "photo.meta": { zh: '当前已展示 <span id="photo-count">0</span> 张照片', en: 'Now showing <span id="photo-count">0</span> photos' },
  "photo.gallery.eyebrow": { zh: "共享照片墙", en: "Shared Photo Wall" },
  "photo.gallery.title": { zh: "浏览大家留下的枫桥瞬间", en: "Browse the moments everyone left at Maple Bridge" },
  "photo.toast.success": { zh: "上传成功", en: "Upload complete" },
  "photo.lightbox.kicker": { zh: "照片预览", en: "Photo Preview" },
  "photo.lightbox.title": { zh: "枫桥瞬间", en: "Maple Bridge Moment" },
  "notice.hero.title": { zh: '枫桥公告栏<span>家门口的重要提醒，</span>都在这。', en: 'Keep community updates,<span>scenic operations, and practical notices</span>clear on one page.' },
  "notice.hero.summary": { zh: "这是面向游客、枫桥街道居民与社区关注者的公告汇总页，信息分类清晰、阅读便捷，帮助您快速查找日常服务、邻里活动及景区运营相关内容。", en: "This notice board is designed for residents and people who follow the community. It focuses on clear categories, trustworthy information, and direct reading." },
  "notice.alert.eyebrow": { zh: "重要提醒", en: "Important Alerts" },
  "notice.alert.title": { zh: "优先查看最新提醒", en: "Check the latest alerts first" },
  "notice.board.eyebrow": { zh: "公告列表", en: "Notice List" },
  "notice.board.title": { zh: "按类别查看社区活动、运营信息与便民提醒", en: "Browse community events, operations, and service notices by category" },
  "notice.board.summary": { zh: "内容按居民视角组织，方便快速查看社区活动、景区运营与便民提醒。", en: "The content is organised from a resident's perspective so updates can be found quickly." },
  "notice.filter.all": { zh: "全部", en: "All" },
  "notice.filter.community": { zh: "社区活动", en: "Community Events" },
  "notice.filter.operations": { zh: "景区运营", en: "Scenic Operations" },
  "notice.filter.service": { zh: "便民提醒", en: "Service Notices" },
  "notice.modal.kicker": { zh: "公告详情", en: "Notice Details" },
  "notice.modal.title": { zh: "查看完整内容", en: "View Full Details" },
  "smart.hero.title": { zh: '智能枫桥<span>畅游枫桥</span>从智能向导开始。', en: 'Let Smart Maple Bridge help first,<span>so you can decide what to</span>explore next.' },
  "smart.hero.summary": { zh: "智能枫桥可提供常见问题解答，快速获取路线、门票、参观须知等实用信息。", en: "Smart Maple Bridge helps you decide which direction suits your interests, what to see first, and where to begin most smoothly." },
  "smart.direction.kicker": { zh: "游玩方向", en: "Visit Styles" },
  "smart.direction.title": { zh: "先按兴趣选一种逛法", en: "Pick a visiting style by interest" },
  "smart.direction.summary": { zh: "这里先帮你把枫桥常见的三种游览线索收清楚，再决定要不要去互动地图看详细路线。", en: "This page first sorts the three common ways to explore Maple Bridge, then helps you decide whether to continue to the interactive map for detailed routes." },
  "smart.direction.water.title": { zh: "桥与运河", en: "Bridges and Canal" },
  "smart.direction.water.p": { zh: "适合先看古桥、水巷与运河肌理，走法轻松，也最容易建立枫桥的空间印象。", en: "A relaxed route focused on old bridges, waterside lanes, and the canal, ideal for building a spatial impression of Maple Bridge." },
  "smart.direction.history.title": { zh: "历史关隘", en: "Historic Passes" },
  "smart.direction.history.p": { zh: "适合想了解关防、边界与运营痕迹的人，能更快进入枫桥厚重的历史语境。", en: "Best for visitors who want to understand border defense, urban edges, and traces of operation in Maple Bridge's deeper history." },
  "smart.direction.town.title": { zh: "古镇漫游", en: "Old Town Walk" },
  "smart.direction.town.p": { zh: "适合慢慢走看街巷、居民生活与古镇氛围，把节奏放缓一些，感受更完整。", en: "A slower walk through lanes, daily life, and old-town atmosphere for a fuller local experience." }
};

const PAGE_META = {
  "index.html": {
    title: { zh: "枫盈苏州 | 苏州枫桥文化导览", en: "Maple Bridge Suzhou | Cultural Guide to Fengqiao, Suzhou" },
    description: { zh: "枫盈苏州首页，集中呈现枫桥景区概览、游览信息、互动入口与社区动态。", en: "Homepage of Maple Bridge Suzhou, presenting a clear overview of Maple Bridge Scenic Area, practical visit information, interactive entries, and community updates." }
  },
  "interactive-map.html": {
    title: { zh: "互动地图 | 枫盈苏州", en: "Interactive Map | Maple Bridge Suzhou" },
    description: { zh: "枫盈苏州互动地图，支持景点解读与游戏交互体验。", en: "Interactive map of Maple Bridge Suzhou, featuring scenic interpretation and playful interactions." }
  },
  "photo-wall.html": {
    title: { zh: "照片墙 | 枫盈苏州", en: "Photo Wall | Maple Bridge Suzhou" },
    description: { zh: "枫盈苏州照片墙，浏览大家留下的枫桥瞬间，并上传自己的影像记录。", en: "Photo wall of Maple Bridge Suzhou, where you can browse shared moments and upload your own visual records." }
  },
  "notice-board.html": {
    title: { zh: "公告栏 | 枫盈苏州", en: "Notice Board | Maple Bridge Suzhou" },
    description: { zh: "枫盈苏州公告栏，集中展示社区活动、景区运营更新与便民提醒。", en: "Notice board of Maple Bridge Suzhou, gathering community activities, scenic operation updates, and practical reminders." }
  },
  "smart-agent.html": {
    title: { zh: "智能枫桥 | 枫盈苏州", en: "Smart Maple Bridge | Maple Bridge Suzhou" },
    description: { zh: "枫盈苏州智能问答页，帮助用户快速找到更适合自己的枫桥游玩方向、路线与信息入口。", en: "Smart guide page of Maple Bridge Suzhou, helping users quickly find suitable visit styles, routes, and information entries." }
  }
};

const TRAVEL_DETAIL_CONTENT = {
  metro: {
    title: { zh: "地铁路线详情", en: "Metro Route Details" },
    summary: {
      zh: "适合第一次来访、希望路线稳定清晰的游客。先坐地铁到西环路站，再按步行方向前往枫桥景区入口。",
      en: "This is the clearest and most stable option for a first visit. Take the metro to Xihuan Road Station, then continue on foot to the Maple Bridge Scenic Area entrance."
    },
    steps: {
      zh: [
        "乘坐苏州地铁 1 号线，到「西环路站」下车。",
        "出站后按前往枫桥景区方向的地面指引步行，沿主路继续前进。",
        "步行途中会经过景区周边道路与沿线店铺，整体路线较直观。",
        "全程步行约 15 分钟，到达枫桥景区入口后即可开始游览。"
      ],
      en: [
        "Take Suzhou Metro Line 1 and get off at Xihuan Road Station.",
        "After leaving the station, follow the street-level signs toward Maple Bridge Scenic Area.",
        "Continue along the main road; the walking route is relatively direct and easy to follow.",
        "The walk takes about 15 minutes, after which you will reach the scenic area entrance."
      ]
    }
  },
  bus: {
    title: { zh: "公交路线详情", en: "Bus Route Details" },
    summary: {
      zh: "适合已经在苏州市区活动、希望少换乘的用户。可直接选择经过枫桥景区站的线路，下车后短距离步行即可进入景区。",
      en: "This option works well if you are already moving around Suzhou and want fewer transfers. Choose a route that stops at Maple Bridge Scenic Area Station, then walk a short distance to the entrance."
    },
    steps: {
      zh: [
        "可优先选择 301 路、303 路、313 路、406 路、415 路或 442 路前往景区。",
        "在「枫桥景区站」下车，留意站牌与景区方向提示。",
        "下车后沿道路步行前往景区入口，通常只需短距离步行即可到达。",
        "若同行人员较多或携带物品，建议下车后先在站点附近整理，再统一进入景区。"
      ],
      en: [
        "Choose routes such as 301, 303, 313, 406, 415, or 442 to reach the scenic area.",
        "Get off at Maple Bridge Scenic Area Station and check the stop signage for the scenic direction.",
        "From the stop, walk a short distance along the road to the scenic area entrance.",
        "If you are travelling in a group or carrying items, it is easier to regroup near the stop before entering."
      ]
    }
  },
  drive: {
    title: { zh: "自驾路线详情", en: "Driving Route Details" },
    summary: {
      zh: "适合携带较多物品、同行人员较多，或希望直接把车停在景区周边的用户。建议先导航到停车点，再步行进入景区。",
      en: "This is suitable if you have more belongings, are travelling with several people, or prefer to park close to the scenic area. Drive to the parking point first, then enter on foot."
    },
    steps: {
      zh: [
        "导航时可将目的地设置为枫桥路与寒山寺路交叉口附近的景区停车区域。",
        "到达后按现场停车引导进入停车位，注意节假日高峰时段可能需要排队。",
        "当前停车参考费用为 10 元 / 次，具体以现场公示信息为准。",
        "停车后步行前往景区入口，建议确认随身物品后再开始游览。"
      ],
      en: [
        "Set your destination to the scenic parking area near the Fengqiao Road and Hanshan Temple Road junction.",
        "Follow the on-site parking guidance after arrival; queues may form during weekends or holidays.",
        "The current reference parking fee is RMB 10 per entry, subject to on-site information.",
        "After parking, walk to the scenic area entrance and check that you have all essential items before entering."
      ]
    }
  }
};

const getStoredLanguage = () => {
  try {
    return window.localStorage.getItem(LANGUAGE_STORAGE_KEY) === "en" ? "en" : "zh";
  } catch (error) {
    return "zh";
  }
};

let currentLanguage = getStoredLanguage();
const backgroundAudio = BACKGROUND_AUDIO_SRC ? new Audio(BACKGROUND_AUDIO_SRC) : null;

if (backgroundAudio) {
  backgroundAudio.loop = true;
  backgroundAudio.preload = "auto";
}

const getLocalizedText = (value, fallback = "") => {
  if (!value) {
    return fallback;
  }
  if (typeof value === "string") {
    return value;
  }
  return value[currentLanguage] || value.zh || value.en || fallback;
};

const setStoredLanguage = (language) => {
  try {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  } catch (error) {
    // Ignore storage failures and keep the current page usable.
  }
};

const readAudioMutedPreference = () => {
  try {
    return window.localStorage.getItem(AUDIO_MUTED_STORAGE_KEY) !== "false";
  } catch (error) {
    return true;
  }
};

const writeAudioMutedPreference = (muted) => {
  try {
    window.localStorage.setItem(AUDIO_MUTED_STORAGE_KEY, String(muted));
  } catch (error) {
    // Ignore storage failures and keep the current page state usable.
  }
};

window.MAPLE_BRIDGE_I18N = {
  getLanguage: () => currentLanguage,
  isEnglish: () => currentLanguage === "en",
  text: getLocalizedText,
};

const readSeniorModePreference = () => {
  try {
    return window.localStorage.getItem(SENIOR_MODE_STORAGE_KEY) === "true";
  } catch (error) {
    return false;
  }
};

const writeSeniorModePreference = (enabled) => {
  try {
    window.localStorage.setItem(SENIOR_MODE_STORAGE_KEY, String(enabled));
  } catch (error) {
    // Ignore storage failures and keep the current page state usable.
  }
};

const closeSettingsPanel = () => {
  document.body.classList.remove("is-settings-open");

  if (!settingsToggle || !settingsPanel) {
    return;
  }

  settingsToggle.setAttribute("aria-expanded", "false");
  settingsPanel.setAttribute("aria-hidden", "true");
};

const getAudioStatusText = () => {
  if (!backgroundAudio || !BACKGROUND_AUDIO_SRC) {
    return currentLanguage === "en" ? "No music source" : "未设置音乐";
  }

  if (!backgroundAudio.paused && !backgroundAudio.muted) {
    return currentLanguage === "en" ? "Currently playing" : "当前播放";
  }

  if (!backgroundAudio.paused && backgroundAudio.muted) {
    return currentLanguage === "en" ? "Currently muted" : "当前静音";
  }

  return currentLanguage === "en" ? "Tap to play" : "点击播放";
};

const syncAudioUi = () => {
  if (!audioToggle) {
    return;
  }

  const isAudible = Boolean(backgroundAudio && !backgroundAudio.paused && !backgroundAudio.muted);
  const audioLabel = getLocalizedText(I18N_TEXT["common.audio"]);

  audioToggle.textContent = audioLabel;
  audioToggle.setAttribute("aria-pressed", String(isAudible));
  audioToggle.setAttribute("aria-label", `${audioLabel}：${getAudioStatusText()}`);
  audioToggle.title = getAudioStatusText();

  if (settingsAudioStatus) {
    settingsAudioStatus.textContent = getAudioStatusText();
  }
};

const toggleBackgroundAudio = async () => {
  if (!backgroundAudio || !BACKGROUND_AUDIO_SRC) {
    syncAudioUi();
    return;
  }

  if (!backgroundAudio.paused && !backgroundAudio.muted) {
    backgroundAudio.muted = true;
    writeAudioMutedPreference(true);
    syncAudioUi();
    return;
  }

  backgroundAudio.muted = false;

  try {
    await backgroundAudio.play();
    writeAudioMutedPreference(false);
  } catch (error) {
    backgroundAudio.muted = true;
    writeAudioMutedPreference(true);
  }

  syncAudioUi();
};

const initBackgroundAudio = async () => {
  if (!backgroundAudio || !BACKGROUND_AUDIO_SRC) {
    syncAudioUi();
    return;
  }

  backgroundAudio.muted = readAudioMutedPreference();

  try {
    await backgroundAudio.play();
  } catch (error) {
    // Browsers may block autoplay before a user gesture.
  }

  syncAudioUi();
};

const syncSettingsSummary = () => {
  const seniorEnabled = document.body.classList.contains("is-senior-mode");

  if (settingsAudioStatus) {
    settingsAudioStatus.textContent = getAudioStatusText();
  }

  if (settingsSeniorStatus) {
    settingsSeniorStatus.textContent = seniorEnabled
      ? (currentLanguage === "en" ? "Currently on" : "当前开启")
      : (currentLanguage === "en" ? "Currently off" : "当前关闭");
  }

  if (settingsLanguageStatus) {
    settingsLanguageStatus.textContent = currentLanguage === "en"
      ? "Current language: English"
      : "当前语言：中文";
  }

  if (settingsToggle) {
    settingsToggle.setAttribute("aria-label", currentLanguage === "en" ? "Open settings" : "打开设置");
    settingsToggle.title = currentLanguage === "en" ? "Open settings" : "打开设置";
  }

  syncAudioUi();
};

const syncSeniorModeUi = (enabled) => {
  document.documentElement.classList.toggle("is-senior-mode", enabled);
  document.body.classList.toggle("is-senior-mode", enabled);

  if (!seniorModeToggle) {
    return;
  }

  seniorModeToggle.setAttribute("aria-pressed", String(enabled));
  seniorModeToggle.setAttribute("aria-label", enabled ? "退出长辈模式" : "开启长辈模式");
  seniorModeToggle.title = enabled ? "点击退出长辈模式" : "点击开启长辈模式";
  syncSettingsSummary();
};

let activeTravelDetailType = null;

function buildTravelDetailMarkup(detail) {
  const summary = getLocalizedText(detail.summary);
  const steps = getLocalizedText(detail.steps, []);
  const stepsMarkup = steps
    .map((step, index) => `
      <li>
        <span class="travel-detail-step-index">${index + 1}</span>
        <p>${step}</p>
      </li>
    `)
    .join("");

  return `
    <div class="travel-detail-content">
      <p class="travel-detail-summary">${summary}</p>
      <ol class="travel-detail-steps">${stepsMarkup}</ol>
    </div>
  `;
}

function syncTravelDetailModalContent() {
  if (!activeTravelDetailType) {
    return;
  }

  const detail = TRAVEL_DETAIL_CONTENT[activeTravelDetailType];
  const travelDetailTitle = document.querySelector("#travel-detail-title");
  const travelDetailRoot = document.querySelector("#travel-detail-modal-root");

  if (!detail || !travelDetailTitle || !travelDetailRoot) {
    return;
  }

  travelDetailTitle.textContent = getLocalizedText(detail.title);
  travelDetailRoot.innerHTML = buildTravelDetailMarkup(detail);
}

const applyPageMeta = () => {
  const pageName = window.location.pathname.split("/").pop() || "index.html";
  const meta = PAGE_META[pageName] || PAGE_META["index.html"];
  const descriptionMeta = document.querySelector('meta[name="description"]');

  document.documentElement.lang = currentLanguage === "en" ? "en" : "zh-CN";
  document.body.classList.toggle("is-lang-en", currentLanguage === "en");

  if (meta?.title) {
    document.title = getLocalizedText(meta.title);
  }

  if (descriptionMeta && meta?.description) {
    descriptionMeta.content = getLocalizedText(meta.description);
  }
};

const applyStaticTranslations = () => {
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    const key = node.getAttribute("data-i18n");
    node.textContent = getLocalizedText(I18N_TEXT[key], node.textContent);
  });

  document.querySelectorAll("[data-i18n-html]").forEach((node) => {
    const key = node.getAttribute("data-i18n-html");
    node.innerHTML = getLocalizedText(I18N_TEXT[key], node.innerHTML);
  });

  document.querySelectorAll("[data-i18n-aria-label]").forEach((node) => {
    const key = node.getAttribute("data-i18n-aria-label");
    node.setAttribute("aria-label", getLocalizedText(I18N_TEXT[key], node.getAttribute("aria-label") || ""));
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((node) => {
    const key = node.getAttribute("data-i18n-placeholder");
    node.setAttribute("placeholder", getLocalizedText(I18N_TEXT[key], node.getAttribute("placeholder") || ""));
  });

  applyPageMeta();

  if (languageToggle) {
    languageToggle.textContent = getLocalizedText(I18N_TEXT["common.language"]);
    languageToggle.setAttribute("aria-label", currentLanguage === "en" ? "Switch to Chinese" : "切换到英文");
    languageToggle.title = currentLanguage === "en" ? "Switch to Chinese" : "Switch to English";
  }

  if (audioToggle) {
    audioToggle.textContent = getLocalizedText(I18N_TEXT["common.audio"]);
  }

  if (seniorModeToggle) {
    seniorModeToggle.textContent = getLocalizedText(I18N_TEXT["common.senior"]);
  }

  syncSettingsSummary();
};

const setLanguage = (language, shouldReload = false) => {
  currentLanguage = language === "en" ? "en" : "zh";
  setStoredLanguage(currentLanguage);
  applyStaticTranslations();
  syncTravelDetailModalContent();

  if (shouldReload) {
    window.location.reload();
  }
};

syncSeniorModeUi(readSeniorModePreference());
applyStaticTranslations();
initBackgroundAudio();

if (audioToggle) {
  audioToggle.addEventListener("click", async () => {
    await toggleBackgroundAudio();
    closeSettingsPanel();
  });
}

if (seniorModeToggle) {
  seniorModeToggle.addEventListener("click", () => {
    const nextEnabled = !document.body.classList.contains("is-senior-mode");
    syncSeniorModeUi(nextEnabled);
    writeSeniorModePreference(nextEnabled);
    closeSettingsPanel();
  });
}

if (languageToggle) {
  languageToggle.addEventListener("click", () => {
    setLanguage(currentLanguage === "zh" ? "en" : "zh", true);
  });
}

if (settingsAudioAction) {
  settingsAudioAction.addEventListener("click", async () => {
    await toggleBackgroundAudio();
    closeSettingsPanel();
  });
}

if (settingsSeniorAction) {
  settingsSeniorAction.addEventListener("click", () => {
    const nextEnabled = !document.body.classList.contains("is-senior-mode");
    syncSeniorModeUi(nextEnabled);
    writeSeniorModePreference(nextEnabled);
    closeSettingsPanel();
  });
}

if (settingsLanguageAction) {
  settingsLanguageAction.addEventListener("click", () => {
    closeSettingsPanel();
    setLanguage(currentLanguage === "zh" ? "en" : "zh", true);
  });
}

const travelDetailModal = document.querySelector("#travel-detail-modal");
const travelDetailTriggers = Array.from(document.querySelectorAll("[data-travel-detail-trigger]"));
const travelDetailCloseButtons = Array.from(document.querySelectorAll("[data-close-travel-modal]"));

const closeTravelDetailModal = () => {
  if (!travelDetailModal) {
    return;
  }

  travelDetailModal.classList.remove("is-open");
  travelDetailModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("travel-modal-open");
};

const openTravelDetailModal = (type) => {
  if (!travelDetailModal || !TRAVEL_DETAIL_CONTENT[type]) {
    return;
  }

  activeTravelDetailType = type;
  syncTravelDetailModalContent();
  travelDetailModal.classList.add("is-open");
  travelDetailModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("travel-modal-open");
};

travelDetailTriggers.forEach((trigger) => {
  trigger.addEventListener("click", () => {
    const type = trigger.getAttribute("data-travel-detail-trigger");
    openTravelDetailModal(type);
  });
});

travelDetailCloseButtons.forEach((button) => {
  button.addEventListener("click", () => {
    closeTravelDetailModal();
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && travelDetailModal?.classList.contains("is-open")) {
    closeTravelDetailModal();
  }
});

if (menuToggle && siteNav) {
  const closeMenu = () => {
    document.body.classList.remove("nav-open");
    menuToggle.setAttribute("aria-expanded", "false");
  };

  menuToggle.addEventListener("click", () => {
    closeSettingsPanel();
    const isOpen = document.body.classList.toggle("nav-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth >= 760) {
      closeMenu();
    }

    if (window.innerWidth >= 760) {
      closeSettingsPanel();
    }
  });
}

if (settingsToggle && settingsPanel) {
  settingsToggle.addEventListener("click", (event) => {
    event.stopPropagation();
    const nextOpen = !document.body.classList.contains("is-settings-open");

    document.body.classList.toggle("is-settings-open", nextOpen);
    settingsToggle.setAttribute("aria-expanded", String(nextOpen));
    settingsPanel.setAttribute("aria-hidden", String(!nextOpen));

    if (nextOpen) {
      document.body.classList.remove("nav-open");
      if (menuToggle) {
        menuToggle.setAttribute("aria-expanded", "false");
      }
    }
  });

  settingsPanel.addEventListener("click", (event) => {
    event.stopPropagation();
  });

  document.addEventListener("click", (event) => {
    if (!document.body.classList.contains("is-settings-open")) {
      return;
    }

    if (settingsToggle.contains(event.target) || settingsPanel.contains(event.target)) {
      return;
    }

    closeSettingsPanel();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeSettingsPanel();
    }
  });
}

const homepageHero = document.querySelector(".hero");

if (homepageHero) {
  const heroIndicatorDots = Array.from(homepageHero.querySelectorAll(".hero-indicator-dot"));
  const HERO_BACKGROUND_COUNT = 4;
  const HERO_BACKGROUND_ROTATE_INTERVAL = 8000;
  let activeHeroBackgroundIndex = 0;

  const syncHeroIndicators = (index) => {
    heroIndicatorDots.forEach((dot, dotIndex) => {
      dot.classList.toggle("is-active", dotIndex === index);
    });
  };

  if (heroIndicatorDots.length === HERO_BACKGROUND_COUNT) {
    syncHeroIndicators(activeHeroBackgroundIndex);
    window.setInterval(() => {
      activeHeroBackgroundIndex = (activeHeroBackgroundIndex + 1) % HERO_BACKGROUND_COUNT;
      syncHeroIndicators(activeHeroBackgroundIndex);
    }, HERO_BACKGROUND_ROTATE_INTERVAL);
  }
}

const weatherTicker = document.querySelector("[data-weather-ticker]");

if (weatherTicker) {
  const slides = Array.from(weatherTicker.querySelectorAll(".weather-slide"));
  let activeIndex = 0;
  const WEATHER_ROTATE_INTERVAL = 4000;
  const weatherDate = document.querySelector("[data-weather-date]");
  const templeDate = document.querySelector("[data-temple-date]");
  const weatherIcon = document.querySelector("[data-weather-icon]");
  const weatherTemp = document.querySelector("[data-weather-temp]");
  const weatherSummary = document.querySelector("[data-weather-summary]");
  const weatherHigh = document.querySelector("[data-weather-high]");
  const weatherLow = document.querySelector("[data-weather-low]");
  const weatherAqiBadge = document.querySelector("[data-weather-aqi-badge]");
  const weatherAqiLevel = document.querySelector("[data-weather-aqi-level]");
  const weatherAqiSummary = document.querySelector("[data-weather-aqi-summary]");
  const weatherPm25 = document.querySelector("[data-weather-pm25]");
  const weatherAqiTip = document.querySelector("[data-weather-aqi-tip]");
  const weatherHumidityBadge = document.querySelector("[data-weather-humidity-badge]");
  const weatherWind = document.querySelector("[data-weather-wind]");
  const weatherComfortSummary = document.querySelector("[data-weather-comfort-summary]");
  const weatherUpdate = document.querySelector("[data-weather-update]");
  const weatherLocation = document.querySelector("[data-weather-location]");
  const forecastChart = document.querySelector("[data-forecast-chart]");
  const forecastUpdate = document.querySelector("[data-forecast-update]");
  const WEATHER_LOCATION = {
    label: currentLanguage === "en" ? "Suzhou · Maple Bridge Scenic Area" : "苏州·枫桥景区",
    latitude: 31.3141,
    longitude: 120.5553,
    timezone: "Asia/Shanghai",
  };
  const weatherCodeMap = {
    0: { icon: "☀", label: currentLanguage === "en" ? "Clear" : "晴朗" },
    1: { icon: "🌤", label: currentLanguage === "en" ? "Mostly Clear" : "大致晴朗" },
    2: { icon: "⛅", label: currentLanguage === "en" ? "Partly Cloudy" : "局部多云" },
    3: { icon: "☁", label: currentLanguage === "en" ? "Overcast" : "阴天" },
    45: { icon: "🌫", label: currentLanguage === "en" ? "Fog" : "有雾" },
    48: { icon: "🌫", label: currentLanguage === "en" ? "Rime Fog" : "雾凇" },
    51: { icon: "🌦", label: currentLanguage === "en" ? "Light Drizzle" : "小毛雨" },
    53: { icon: "🌦", label: currentLanguage === "en" ? "Drizzle" : "毛雨" },
    55: { icon: "🌧", label: currentLanguage === "en" ? "Heavy Drizzle" : "强毛雨" },
    61: { icon: "🌦", label: currentLanguage === "en" ? "Light Rain" : "小雨" },
    63: { icon: "🌧", label: currentLanguage === "en" ? "Moderate Rain" : "中雨" },
    65: { icon: "🌧", label: currentLanguage === "en" ? "Heavy Rain" : "大雨" },
    71: { icon: "🌨", label: currentLanguage === "en" ? "Light Snow" : "小雪" },
    73: { icon: "🌨", label: currentLanguage === "en" ? "Moderate Snow" : "中雪" },
    75: { icon: "❄", label: currentLanguage === "en" ? "Heavy Snow" : "大雪" },
    80: { icon: "🌦", label: currentLanguage === "en" ? "Rain Showers" : "阵雨" },
    81: { icon: "🌧", label: currentLanguage === "en" ? "Strong Showers" : "较强阵雨" },
    82: { icon: "⛈", label: currentLanguage === "en" ? "Heavy Showers" : "强阵雨" },
    95: { icon: "⛈", label: currentLanguage === "en" ? "Thunderstorm" : "雷暴" },
  };
  const forecastDays = currentLanguage === "en" ? ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] : ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];

  const showSlide = (index) => {
    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle("is-active", slideIndex === index);
      slide.setAttribute("aria-hidden", slideIndex === index ? "false" : "true");
    });
  };

  const formatDate = (isoString) => {
    const date = isoString ? new Date(isoString) : new Date();

    return `${String(date.getMonth() + 1).padStart(2, "0")} / ${String(date.getDate()).padStart(2, "0")}`;
  };

  const formatTime = (isoString) => {
    const date = isoString ? new Date(isoString) : new Date();

    return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
  };

  const formatForecastDay = (isoString) => {
    const date = new Date(isoString);
    return forecastDays[date.getDay()];
  };

  const buildForecastSeries = (dailyWeather) =>
    dailyWeather.time.map((time, index) => ({
      time,
      label: formatForecastDay(time),
      icon: (weatherCodeMap[dailyWeather.weather_code[index]] || { icon: "⛅" }).icon,
      max: Math.round(dailyWeather.temperature_2m_max[index]),
      min: Math.round(dailyWeather.temperature_2m_min[index]),
    }));

  const createForecastSvg = (series) => {
    const width = 640;
    const height = 132;
    const padding = { top: 24, right: 18, bottom: 24, left: 18 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;
    const allTemps = series.flatMap((item) => [item.max, item.min]);
    const minTemp = Math.min(...allTemps) - 2;
    const maxTemp = Math.max(...allTemps) + 2;
    const tempRange = Math.max(maxTemp - minTemp, 1);
    const getX = (index) => padding.left + (chartWidth / Math.max(series.length - 1, 1)) * index;
    const getY = (value) => padding.top + ((maxTemp - value) / tempRange) * chartHeight;
    const highPoints = series.map((item, index) => `${getX(index)},${getY(item.max)}`).join(" ");
    const lowPoints = series.map((item, index) => `${getX(index)},${getY(item.min)}`).join(" ");
    const gridLines = [0, 0.5, 1]
      .map((ratio) => {
        const y = padding.top + chartHeight * ratio;
        return `<line x1="${padding.left}" y1="${y}" x2="${width - padding.right}" y2="${y}" stroke="rgba(111, 99, 88, 0.12)" stroke-width="1" />`;
      })
      .join("");
    const labels = series
      .map((item, index) => {
        const x = getX(index);
        const yHigh = getY(item.max);
        const yLow = getY(item.min);

        return `
          <text x="${x}" y="${padding.top - 10}" text-anchor="middle" font-size="13">${item.icon}</text>
          <text x="${x}" y="${yHigh - 8}" text-anchor="middle" font-size="9.5" fill="#8c4a37" font-weight="700">${item.max}°</text>
          <circle cx="${x}" cy="${yHigh}" r="3.2" fill="#9a4f3c" />
          <text x="${x}" y="${yLow + 14}" text-anchor="middle" font-size="9.5" fill="#5e7b87" font-weight="700">${item.min}°</text>
          <circle cx="${x}" cy="${yLow}" r="3.2" fill="#6f92a0" />
          <text x="${x}" y="${height - 10}" text-anchor="middle" font-size="9.5" fill="#6f6358">${item.label}</text>
        `;
      })
      .join("");

    return `
      <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${currentLanguage === "en" ? "Temperature trend for the next seven days" : "未来七天最高温和最低温趋势图"}" preserveAspectRatio="none">
        ${gridLines}
        <polyline points="${highPoints}" fill="none" stroke="#9a4f3c" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
        <polyline points="${lowPoints}" fill="none" stroke="#6f92a0" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
        ${labels}
      </svg>
    `;
  };

  const renderForecastChart = (dailyWeather) => {
    if (!forecastChart) {
      return;
    }

    if (
      !dailyWeather ||
      !Array.isArray(dailyWeather.time) ||
      !Array.isArray(dailyWeather.temperature_2m_max) ||
      !Array.isArray(dailyWeather.temperature_2m_min) ||
      !Array.isArray(dailyWeather.weather_code) ||
      dailyWeather.time.length < 2
    ) {
      forecastChart.textContent = currentLanguage === "en" ? "The weekly weather trend is unavailable." : "未来一周天气趋势暂不可用。";
      return;
    }

    const series = buildForecastSeries(dailyWeather);
    forecastChart.innerHTML = createForecastSvg(series);
  };

  const getAqiLevel = (aqi) => {
    if (aqi <= 50) {
      return {
        label: currentLanguage === "en" ? "Good Air" : "空气优",
        summary: currentLanguage === "en" ? "Air quality is good and suitable for walking and photography." : "空气状态较好，适合在枫桥慢行与拍照。",
        tip: currentLanguage === "en" ? "Comfortable outdoors" : "户外活动舒适",
        warn: false,
      };
    }

    if (aqi <= 100) {
      return {
        label: currentLanguage === "en" ? "Moderate Air" : "空气良",
        summary: currentLanguage === "en" ? "Overall suitable for visiting, though sensitive groups should avoid long stays near traffic." : "整体适合游览，敏感人群可减少长时间停留在车流附近。",
        tip: currentLanguage === "en" ? "Sensitive groups should take care" : "敏感人群留意防护",
        warn: false,
      };
    }

    if (aqi <= 150) {
      return {
        label: currentLanguage === "en" ? "Light Pollution" : "轻度污染",
        summary: currentLanguage === "en" ? "Avoid long periods of intense outdoor activity and consider a mask for longer stays." : "建议控制长时间剧烈活动，停留较久时可佩戴口罩。",
        tip: currentLanguage === "en" ? "Protection advised for long outdoor stays" : "久留户外建议防护",
        warn: true,
      };
    }

    if (aqi <= 200) {
      return {
        label: currentLanguage === "en" ? "Moderate Pollution" : "中度污染",
        summary: currentLanguage === "en" ? "Short visits are still possible, but older adults and children should reduce intense outdoor activity." : "适合短时浏览，老人和儿童建议减少高强度户外活动。",
        tip: currentLanguage === "en" ? "Shorter stays are recommended" : "建议缩短停留时长",
        warn: true,
      };
    }

    return {
      label: currentLanguage === "en" ? "Poor Air" : "空气较差",
      summary: currentLanguage === "en" ? "Indoor activity or short outdoor stays are recommended, with basic protection." : "建议以室内或短时活动为主，并做好基础防护。",
      tip: currentLanguage === "en" ? "Use stronger protection outdoors" : "外出请加强防护",
      warn: true,
    };
  };

  const getWeatherSummary = (label, temperature, maxTemp, minTemp) => {
    if (temperature >= 30) {
      return currentLanguage === "en" ? `${label}. It feels hot, so avoid the warmest afternoon hours.` : `${label}，体感偏热，建议避开午后高温时段。`;
    }

    if (temperature <= 8) {
      return currentLanguage === "en" ? `${label}. The temperature is low, so bring layers for a slower walk.` : `${label}，气温偏低，适合慢游但需注意保暖。`;
    }

    if (maxTemp - minTemp >= 8) {
      return currentLanguage === "en" ? `${label}. The day-night temperature gap is noticeable, so carry a light outer layer.` : `${label}，昼夜温差较明显，出行建议带一件薄外套。`;
    }

    return currentLanguage === "en" ? `${label}. Conditions feel comfortable for a light stroll around Maple Bridge.` : `${label}，体感较舒适，适合在枫桥轻量漫游。`;
  };

  const getComfortSummary = (humidity, windSpeed, weatherLabel) => {
    if (windSpeed >= 20) {
      return currentLanguage === "en" ? `${weatherLabel} with noticeable wind. Take care when photographing near the water.` : `${weatherLabel}伴随较明显风感，临水拍照时注意防风。`;
    }

    if (humidity >= 80) {
      return currentLanguage === "en" ? `The air is humid, and ${weatherLabel.toLowerCase()} suits a slower visit with short pauses.` : `空气湿润，${weatherLabel}下更适合慢节奏浏览与短暂停留。`;
    }

    return currentLanguage === "en" ? `${weatherLabel} with mild wind, suitable for easy walking, photos, and quick browsing.` : `${weatherLabel}下风感平稳，适合轻量步行、拍照与快速浏览。`;
  };

  const setWeatherErrorState = () => {
    if (weatherDate) {
      weatherDate.textContent = formatDate();
    }

    if (templeDate) {
      templeDate.textContent = formatDate();
    }

    if (weatherIcon) {
      weatherIcon.textContent = "☁";
    }

    if (weatherTemp) {
      weatherTemp.textContent = currentLanguage === "en" ? "Weather unavailable" : "天气暂不可用";
    }

    if (weatherSummary) {
      weatherSummary.textContent = currentLanguage === "en" ? "Live weather data could not be loaded. Please refresh later." : "实时天气数据获取失败，请稍后刷新再试。";
    }

    if (weatherHigh) {
      weatherHigh.textContent = currentLanguage === "en" ? "High --°C" : "最高 --°C";
    }

    if (weatherLow) {
      weatherLow.textContent = currentLanguage === "en" ? "Low --°C" : "最低 --°C";
    }

    if (weatherAqiBadge) {
      weatherAqiBadge.textContent = "AQI --";
      weatherAqiBadge.classList.remove("weather-badge-warn");
    }

    if (weatherAqiLevel) {
      weatherAqiLevel.textContent = currentLanguage === "en" ? "Air data unavailable" : "空气数据暂不可用";
    }

    if (weatherAqiSummary) {
      weatherAqiSummary.textContent = currentLanguage === "en" ? "The air quality service did not return a result." : "空气质量接口暂时未返回结果。";
    }

    if (weatherPm25) {
      weatherPm25.textContent = "PM2.5 --";
    }

    if (weatherAqiTip) {
      weatherAqiTip.textContent = currentLanguage === "en" ? "Please try again later" : "稍后可再次尝试";
    }

    if (weatherHumidityBadge) {
      weatherHumidityBadge.textContent = currentLanguage === "en" ? "Humidity --" : "湿度 --";
    }

    if (weatherWind) {
      weatherWind.textContent = currentLanguage === "en" ? "Wind --" : "风速 --";
    }

    if (weatherComfortSummary) {
      weatherComfortSummary.textContent = currentLanguage === "en" ? "When live weather is unavailable, please follow on-site guidance in the scenic area." : "实时天气不可用时，建议以景区现场提示为准。";
    }

    if (weatherUpdate) {
      weatherUpdate.textContent = currentLanguage === "en" ? "Live data unavailable" : "实时接口暂不可用";
    }

    if (weatherLocation) {
      weatherLocation.textContent = WEATHER_LOCATION.label;
    }

    if (forecastChart) {
      forecastChart.textContent = currentLanguage === "en" ? "The weekly weather trend is unavailable." : "未来一周天气趋势暂不可用。";
    }

    if (forecastUpdate) {
      forecastUpdate.textContent = currentLanguage === "en" ? "No data" : "暂无数据";
    }
  };

  const loadRealtimeWeather = async () => {
    try {
      const weatherUrl = new URL("https://api.open-meteo.com/v1/forecast");
      weatherUrl.searchParams.set("latitude", String(WEATHER_LOCATION.latitude));
      weatherUrl.searchParams.set("longitude", String(WEATHER_LOCATION.longitude));
      weatherUrl.searchParams.set("current", "temperature_2m,weather_code,relative_humidity_2m,wind_speed_10m");
      weatherUrl.searchParams.set("daily", "temperature_2m_max,temperature_2m_min,weather_code");
      weatherUrl.searchParams.set("forecast_days", "7");
      weatherUrl.searchParams.set("timezone", WEATHER_LOCATION.timezone);

      const airUrl = new URL("https://air-quality-api.open-meteo.com/v1/air-quality");
      airUrl.searchParams.set("latitude", String(WEATHER_LOCATION.latitude));
      airUrl.searchParams.set("longitude", String(WEATHER_LOCATION.longitude));
      airUrl.searchParams.set("current", "us_aqi,pm2_5");
      airUrl.searchParams.set("timezone", WEATHER_LOCATION.timezone);

      const [weatherResponse, airResponse] = await Promise.all([
        fetch(weatherUrl.toString()),
        fetch(airUrl.toString()),
      ]);

      if (!weatherResponse.ok || !airResponse.ok) {
        throw new Error(`Weather API request failed: weather=${weatherResponse.status}, air=${airResponse.status}`);
      }

      const [weatherData, airData] = await Promise.all([
        weatherResponse.json(),
        airResponse.json(),
      ]);

      const currentWeather = weatherData.current;
      const dailyWeather = weatherData.daily;
      const currentAir = airData.current;

      if (!currentWeather || !dailyWeather || !currentAir) {
        throw new Error("Incomplete weather payload.");
      }

      const weatherInfo = weatherCodeMap[currentWeather.weather_code] || {
        icon: "⛅",
        label: "天气平稳",
      };
      const temperature = Math.round(currentWeather.temperature_2m);
      const maxTemp = Math.round(dailyWeather.temperature_2m_max[0]);
      const minTemp = Math.round(dailyWeather.temperature_2m_min[0]);
      const humidity = Math.round(currentWeather.relative_humidity_2m);
      const windSpeed = Math.round(currentWeather.wind_speed_10m);
      const aqi = Math.round(currentAir.us_aqi);
      const pm25 = Number(currentAir.pm2_5);
      const aqiLevel = getAqiLevel(aqi);

      if (weatherDate) {
        weatherDate.textContent = formatDate(currentWeather.time);
      }

      if (templeDate) {
        templeDate.textContent = formatDate(currentWeather.time);
      }

      if (weatherIcon) {
        weatherIcon.textContent = weatherInfo.icon;
      }

      if (weatherTemp) {
        weatherTemp.textContent = `${temperature}°C`;
      }

      if (weatherSummary) {
        weatherSummary.textContent = getWeatherSummary(weatherInfo.label, temperature, maxTemp, minTemp);
      }

      if (weatherHigh) {
        weatherHigh.textContent = currentLanguage === "en" ? `High ${maxTemp}°C` : `最高 ${maxTemp}°C`;
      }

      if (weatherLow) {
        weatherLow.textContent = currentLanguage === "en" ? `Low ${minTemp}°C` : `最低 ${minTemp}°C`;
      }

      if (weatherAqiBadge) {
        weatherAqiBadge.textContent = `AQI ${aqi}`;
        weatherAqiBadge.classList.toggle("weather-badge-warn", aqiLevel.warn);
      }

      if (weatherAqiLevel) {
        weatherAqiLevel.textContent = aqiLevel.label;
      }

      if (weatherAqiSummary) {
        weatherAqiSummary.textContent = aqiLevel.summary;
      }

      if (weatherPm25) {
        weatherPm25.textContent = `PM2.5 ${Number.isFinite(pm25) ? `${Math.round(pm25)} ug/m3` : "--"}`;
      }

      if (weatherAqiTip) {
        weatherAqiTip.textContent = aqiLevel.tip;
      }

      if (weatherHumidityBadge) {
        weatherHumidityBadge.textContent = currentLanguage === "en" ? `Humidity ${humidity}%` : `湿度 ${humidity}%`;
      }

      if (weatherWind) {
        weatherWind.textContent = currentLanguage === "en" ? `Wind ${windSpeed} km/h` : `风速 ${windSpeed} km/h`;
      }

      if (weatherComfortSummary) {
        weatherComfortSummary.textContent = getComfortSummary(humidity, windSpeed, weatherInfo.label);
      }

      if (weatherUpdate) {
        weatherUpdate.textContent = currentLanguage === "en" ? `Updated ${formatTime(currentWeather.time)}` : `更新于 ${formatTime(currentWeather.time)}`;
      }

      if (weatherLocation) {
        weatherLocation.textContent = WEATHER_LOCATION.label;
      }

      renderForecastChart(dailyWeather);

      if (forecastUpdate) {
        forecastUpdate.textContent = currentLanguage === "en" ? `Updated ${formatTime(currentWeather.time)}` : `更新于 ${formatTime(currentWeather.time)}`;
      }
    } catch (error) {
      console.error(error);
      setWeatherErrorState();
    }
  };

  weatherTicker.setAttribute("aria-busy", "true");
  showSlide(activeIndex);
  loadRealtimeWeather().finally(() => {
    weatherTicker.setAttribute("aria-busy", "false");
  });
  window.setInterval(loadRealtimeWeather, 10 * 60 * 1000);

  if (slides.length > 1) {
    window.setInterval(() => {
      activeIndex = (activeIndex + 1) % slides.length;
      showSlide(activeIndex);
    }, WEATHER_ROTATE_INTERVAL);
  }
}

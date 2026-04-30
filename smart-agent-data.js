(function () {
  const sharedLinks = {
    map: {
      zh: { label: "打开互动地图", href: "interactive-map.html" },
      en: { label: "Open Interactive Map", href: "interactive-map.html" }
    },
    photo: {
      zh: { label: "前往照片墙", href: "photo-wall.html" },
      en: { label: "Go to Photo Wall", href: "photo-wall.html" }
    },
    notice: {
      zh: { label: "查看公告栏", href: "notice-board.html" },
      en: { label: "View Notice Board", href: "notice-board.html" }
    }
  };

  window.smartMapleBridgeFaq = {
    zh: {
      intro: {
        eyebrow: "静态 FAQ Agent",
        title: "先问一句，再决定下一步怎么逛枫桥。",
        helper: "这里不会调用外部 AI，也不做实时承诺，而是用一组常见问题，帮你更快找到路线、门票、参观和内容入口。"
      },
      categories: [
        { key: "all", label: "全部问题" },
        { key: "transport", label: "交通路线" },
        { key: "tickets", label: "门票与收费" },
        { key: "hours", label: "开放时间" },
        { key: "visit", label: "参观须知" },
        { key: "route", label: "路线定制" },
        { key: "spots", label: "景点介绍" },
        { key: "photo", label: "照片墙" },
        { key: "culture", label: "文化背景" }
      ],
      fixedSuggestions: [
        "枫桥在哪里？",
        "怎么去枫桥？",
        "需要门票吗？",
        "有哪些免费内容？",
        "推荐游览路线是什么？",
        "参观需要注意什么？"
      ],
      fallback: {
        title: "我暂时没有完全匹配的问题",
        answer: "我还不能像实时客服那样回答所有问题，但你可以先试试下面这些常见问法，我会优先用本地 FAQ 帮你找答案。",
        suggestedQuestions: [
          "枫桥在哪里？",
          "怎么去枫桥景区？",
          "枫桥需要门票吗？",
          "适合第一次来的路线是什么？",
          "枫桥和寒山寺是什么关系？"
        ]
      },
      faqs: [
        {
          id: "faq-location",
          category: "spots",
          categoryLabel: "景点介绍",
          question: "枫桥在哪里？",
          answer: "枫桥景区位于苏州古运河一带，常和寒山寺一起被提起。你可以先把它理解为围绕古桥、运河、寺院与水巷展开的一片文化游览区域；如果想更直观地找入口和周边关系，可以直接打开互动地图查看。",
          keywords: ["枫桥在哪里", "在哪", "位置", "地址", "maple bridge", "where", "location"],
          suggestedQuestions: ["怎么去枫桥景区？", "枫桥和寒山寺是什么关系？", "适合第一次来的路线是什么？"],
          links: [sharedLinks.map.zh],
          hot: true
        },
        {
          id: "faq-transport",
          category: "transport",
          categoryLabel: "交通路线",
          question: "怎么去枫桥景区？",
          answer: "常见方式有地铁、公交和自驾。地铁可先到西环路站，再步行约 15 分钟；公交可关注枫桥景区站；自驾则更适合多人同行或携带物品较多的情况。想看更直观的到达方式和路线入口，可以去互动地图继续看。",
          keywords: ["怎么去", "怎么到", "交通", "路线", "地铁", "公交", "自驾", "route", "metro", "bus", "drive"],
          suggestedQuestions: ["枫桥在哪里？", "适合第一次来的路线是什么？", "如果我只有一小时应该怎么玩？"],
          links: [sharedLinks.map.zh],
          hot: true
        },
        {
          id: "faq-ticket",
          category: "tickets",
          categoryLabel: "门票与收费",
          question: "枫桥需要门票吗？",
          answer: "是否需要购票、票价多少，以及是否有预约要求，可能会随活动安排和运营政策变化。具体票价、开放时间和预约渠道可能会变化，建议出行前通过官方渠道再次确认。如果你只想先看站内更新，也可以顺手查看公告栏。",
          keywords: ["门票", "票价", "收费", "多少钱", "ticket", "price", "fee", "book"],
          suggestedQuestions: ["哪些内容是免费的？", "开放时间是什么？", "公告栏有什么用？"],
          links: [sharedLinks.notice.zh],
          hot: true
        },
        {
          id: "faq-free",
          category: "tickets",
          categoryLabel: "门票与收费",
          question: "哪些内容是免费的？",
          answer: "站内的首页导览、互动地图浏览、照片墙浏览和公告栏查看，都是这个课程原型里可以直接使用的免费内容。至于线下景区是否免票、是否有免费开放时段，仍建议你在出发前通过官方渠道确认。",
          keywords: ["免费", "哪些免费", "不用花钱", "free", "without ticket"],
          suggestedQuestions: ["枫桥需要门票吗？", "照片墙在哪里？", "公告栏有什么用？"],
          links: [sharedLinks.photo.zh, sharedLinks.notice.zh],
          hot: false
        },
        {
          id: "faq-hours",
          category: "hours",
          categoryLabel: "开放时间",
          question: "开放时间是什么？",
          answer: "开放时间可能会因为季节、节假日、临时活动或现场安排而调整。具体票价、开放时间和预约渠道可能会变化，建议出行前通过官方渠道再次确认。如果近期有临时提醒，也可以先看公告栏。",
          keywords: ["开放时间", "几点开门", "几点关门", "营业时间", "hours", "open", "opening"],
          suggestedQuestions: ["枫桥需要门票吗？", "公告栏有什么用？", "参观需要注意什么？"],
          links: [sharedLinks.notice.zh],
          hot: false
        },
        {
          id: "faq-notes",
          category: "visit",
          categoryLabel: "参观须知",
          question: "参观需要注意什么？",
          answer: "建议文明游览，爱护景观设施，注意保持环境整洁；靠近水域时留意安全，不要攀爬翻越；如果涉及无人机等特殊活动，通常也应先确认是否允许。你也可以先把它当作一处适合慢慢走、慢慢看的文化空间，而不是快节奏打卡点。",
          keywords: ["参观须知", "注意什么", "注意事项", "安全", "无人机", "visitor notes", "notice", "safe"],
          suggestedQuestions: ["适合第一次来的路线是什么？", "开放时间是什么？", "枫桥和寒山寺是什么关系？"],
          links: [],
          hot: true
        },
        {
          id: "faq-first-route",
          category: "route",
          categoryLabel: "路线定制",
          question: "适合第一次来的路线是什么？",
          answer: "如果是第一次来，比较稳妥的走法是先从古桥与运河氛围入手，再看寒山寺和周边空间关系，最后根据体力决定是否继续慢逛街巷。这样既容易建立整体印象，也不会一开始就把信息看得太散。想按位置继续展开，可以去互动地图看路线入口。",
          keywords: ["第一次来", "推荐路线", "游览路线", "怎么逛", "first time", "recommended route", "plan"],
          suggestedQuestions: ["如果我只有一小时应该怎么玩？", "怎么去枫桥景区？", "枫桥和寒山寺是什么关系？"],
          links: [sharedLinks.map.zh],
          hot: true
        },
        {
          id: "faq-one-hour",
          category: "route",
          categoryLabel: "路线定制",
          question: "如果我只有一小时应该怎么玩？",
          answer: "如果停留时间只有一小时，建议优先看最能代表枫桥气质的部分：古桥、运河、水巷和与寒山寺相关的外部空间关系。不要贪多，先抓住“桥、水、寺、诗意记忆”这条主线，会比匆忙跑很多点更有收获。",
          keywords: ["一小时", "时间不多", "快速", "短时间", "one hour", "quick route", "short visit"],
          suggestedQuestions: ["适合第一次来的路线是什么？", "枫桥在哪里？", "照片墙在哪里？"],
          links: [sharedLinks.map.zh, sharedLinks.photo.zh],
          hot: false
        },
        {
          id: "faq-agent",
          category: "route",
          categoryLabel: "路线定制",
          question: "智能枫桥可以帮我做什么？",
          answer: "它更像一个静态 FAQ 助手，适合帮你快速判断从哪里开始看、该去哪个页面找内容，以及先问哪些常见问题。它不会提供实时票务、天气或在线客服能力，但能把地图、照片墙和公告栏这些入口串起来。",
          keywords: ["智能枫桥", "可以帮我做什么", "有什么用", "assistant", "help", "what can you do"],
          suggestedQuestions: ["公告栏有什么用？", "照片墙在哪里？", "适合第一次来的路线是什么？"],
          links: [sharedLinks.map.zh, sharedLinks.photo.zh, sharedLinks.notice.zh],
          hot: false
        },
        {
          id: "faq-photo",
          category: "photo",
          categoryLabel: "照片墙",
          question: "照片墙在哪里？",
          answer: "照片墙是独立页面，适合用更轻松的方式看游客和居民留下的枫桥瞬间。如果你想先从图像感受氛围，再决定要不要深入看地图或历史内容，可以直接进入照片墙页浏览。",
          keywords: ["照片墙", "照片", "图片", "拍照", "photo wall", "photos", "gallery"],
          suggestedQuestions: ["哪些内容是免费的？", "公告栏有什么用？", "枫桥和寒山寺是什么关系？"],
          links: [sharedLinks.photo.zh],
          hot: true
        },
        {
          id: "faq-notice-board",
          category: "visit",
          categoryLabel: "参观须知",
          question: "公告栏有什么用？",
          answer: "公告栏更偏向居民和实际到访前的信息查看，适合集中浏览活动提醒、运营更新和便民通知。你可以把它当作“出发前再确认一遍”的页面，尤其适合查近期提醒和变化信息。",
          keywords: ["公告栏", "公告", "提醒", "通知", "notice board", "announcement", "alerts"],
          suggestedQuestions: ["开放时间是什么？", "枫桥需要门票吗？", "智能枫桥可以帮我做什么？"],
          links: [sharedLinks.notice.zh],
          hot: true
        },
        {
          id: "faq-culture",
          category: "culture",
          categoryLabel: "文化背景",
          question: "枫桥和寒山寺是什么关系？",
          answer: "两者经常被放在同一组文化记忆里理解。枫桥的桥、水、运河空间，与寒山寺的寺院意象和钟声记忆一起，构成了很多人理解这片区域的方式。也正因为这种关联，游客来到这里时，往往不是只看单一景点，而是在读一整段诗意和历史语境。",
          keywords: ["寒山寺", "关系", "文化背景", "诗", "钟声", "hanshan temple", "relationship", "culture"],
          suggestedQuestions: ["枫桥在哪里？", "适合第一次来的路线是什么？", "照片墙在哪里？"],
          links: [sharedLinks.map.zh, sharedLinks.photo.zh],
          hot: true
        }
      ]
    },
    en: {
      intro: {
        eyebrow: "Static FAQ Agent",
        title: "Ask one question first, then choose how to explore Maple Bridge.",
        helper: "This page does not use a live AI service. It uses a local FAQ knowledge base to help you find routes, ticket guidance, visitor notes, and the right page to open next."
      },
      categories: [
        { key: "all", label: "All Topics" },
        { key: "transport", label: "How to get there" },
        { key: "tickets", label: "Tickets and fees" },
        { key: "hours", label: "Opening hours" },
        { key: "visit", label: "Visitor notes" },
        { key: "route", label: "Route planning" },
        { key: "spots", label: "Scenic spots" },
        { key: "photo", label: "Photo wall" },
        { key: "culture", label: "Cultural background" }
      ],
      fixedSuggestions: [
        "Where is Maple Bridge?",
        "How to get there?",
        "Do I need a ticket?",
        "What is free?",
        "What route do you recommend?",
        "What should I note before visiting?"
      ],
      fallback: {
        title: "I could not find a fully matching question yet",
        answer: "I am a lightweight local FAQ assistant, not a live AI service. You can try one of these common questions first and I will match it against the built-in knowledge base.",
        suggestedQuestions: [
          "Where is Maple Bridge?",
          "How to get there?",
          "Do I need a ticket?",
          "What route do you recommend?",
          "What is the relationship with Hanshan Temple?"
        ]
      },
      faqs: [
        {
          id: "faq-location",
          category: "spots",
          categoryLabel: "Scenic spots",
          question: "Where is Maple Bridge?",
          answer: "Maple Bridge Scenic Area is in the Grand Canal area of Suzhou and is often understood together with Hanshan Temple. It is best approached as a cultural area shaped by the bridge, canal, temple, and nearby waterside lanes. If you want a clearer sense of location, open the interactive map.",
          keywords: ["where is maple bridge", "location", "where", "address", "maple bridge"],
          suggestedQuestions: ["How to get there?", "What is the relationship with Hanshan Temple?", "What route do you recommend?"],
          links: [sharedLinks.map.en],
          hot: true
        },
        {
          id: "faq-transport",
          category: "transport",
          categoryLabel: "How to get there",
          question: "How to get there?",
          answer: "Visitors usually arrive by metro, bus, or car. A common option is to reach Xihuan Road Station first and then walk for about 15 minutes. If you prefer a more visual route reference, open the interactive map for guidance.",
          keywords: ["how to get there", "route", "metro", "bus", "drive", "transport", "go there"],
          suggestedQuestions: ["Where is Maple Bridge?", "What route do you recommend?", "If I only have one hour, what should I do?"],
          links: [sharedLinks.map.en],
          hot: true
        },
        {
          id: "faq-ticket",
          category: "tickets",
          categoryLabel: "Tickets and fees",
          question: "Do I need a ticket?",
          answer: "Ticket policy, fees, and reservation channels may change with operations or seasonal arrangements. Specific ticket prices, opening hours, and reservation channels may change, so it is best to confirm again through official channels before your trip. You can also check the notice board for recent updates.",
          keywords: ["ticket", "fee", "price", "do i need a ticket", "booking"],
          suggestedQuestions: ["What is free?", "What are the opening hours?", "What is the notice board for?"],
          links: [sharedLinks.notice.en],
          hot: true
        },
        {
          id: "faq-free",
          category: "tickets",
          categoryLabel: "Tickets and fees",
          question: "What is free?",
          answer: "Within this coursework prototype, the homepage guide, interactive map browsing, photo wall browsing, and notice board browsing are all free to use. For the real scenic area, whether entry is free or ticketed should still be confirmed through official channels before you go.",
          keywords: ["free", "what is free", "free content", "without ticket"],
          suggestedQuestions: ["Do I need a ticket?", "Where is the photo wall?", "What is the notice board for?"],
          links: [sharedLinks.photo.en, sharedLinks.notice.en],
          hot: false
        },
        {
          id: "faq-hours",
          category: "hours",
          categoryLabel: "Opening hours",
          question: "What are the opening hours?",
          answer: "Opening hours may change because of seasons, holidays, temporary events, or on-site arrangements. Specific ticket prices, opening hours, and reservation channels may change, so it is best to confirm again through official channels before your trip. If you want nearby reminders first, check the notice board.",
          keywords: ["opening hours", "hours", "open", "close", "when open"],
          suggestedQuestions: ["Do I need a ticket?", "What is the notice board for?", "What should I note before visiting?"],
          links: [sharedLinks.notice.en],
          hot: false
        },
        {
          id: "faq-notes",
          category: "visit",
          categoryLabel: "Visitor notes",
          question: "What should I note before visiting?",
          answer: "Visit respectfully, protect the scenic facilities, and keep the environment clean. Be careful near the water, do not climb over barriers, and check permission in advance for special activities such as drone flying. It helps to treat Maple Bridge as a place to walk and absorb slowly rather than a fast checklist stop.",
          keywords: ["visitor notes", "note", "safety", "what should i note", "drone", "rules"],
          suggestedQuestions: ["What route do you recommend?", "What are the opening hours?", "What is the relationship with Hanshan Temple?"],
          links: [],
          hot: true
        },
        {
          id: "faq-first-route",
          category: "route",
          categoryLabel: "Route planning",
          question: "What route do you recommend?",
          answer: "For a first visit, a steady route is to begin with the bridge and canal atmosphere, then understand the relationship with Hanshan Temple, and finally decide whether to continue into the slower old-town spaces. This gives you a cleaner first impression without scattering your attention too early.",
          keywords: ["recommended route", "route", "plan", "first visit", "first time"],
          suggestedQuestions: ["If I only have one hour, what should I do?", "How to get there?", "What is the relationship with Hanshan Temple?"],
          links: [sharedLinks.map.en],
          hot: true
        },
        {
          id: "faq-one-hour",
          category: "route",
          categoryLabel: "Route planning",
          question: "If I only have one hour, what should I do?",
          answer: "If you only have one hour, focus on the parts that best express Maple Bridge: the old bridge, canal, waterside atmosphere, and the wider spatial relationship with Hanshan Temple. It is usually better to follow one clear theme than rush through many points.",
          keywords: ["one hour", "quick visit", "short visit", "only one hour"],
          suggestedQuestions: ["What route do you recommend?", "Where is Maple Bridge?", "Where is the photo wall?"],
          links: [sharedLinks.map.en, sharedLinks.photo.en],
          hot: false
        },
        {
          id: "faq-agent",
          category: "route",
          categoryLabel: "Route planning",
          question: "What can Smart Maple Bridge do?",
          answer: "It works like a lightweight static FAQ assistant. It can help you decide where to start, which page to open next, and which common questions to ask first. It does not provide live ticketing, weather, or customer service, but it connects the map, photo wall, and notice board clearly.",
          keywords: ["what can smart maple bridge do", "assistant", "help", "what can you do"],
          suggestedQuestions: ["What is the notice board for?", "Where is the photo wall?", "What route do you recommend?"],
          links: [sharedLinks.map.en, sharedLinks.photo.en, sharedLinks.notice.en],
          hot: false
        },
        {
          id: "faq-photo",
          category: "photo",
          categoryLabel: "Photo wall",
          question: "Where is the photo wall?",
          answer: "The photo wall is a separate page where you can browse visitor and resident images of Maple Bridge. It is a good place to start if you want to feel the atmosphere through images before going deeper into map or history content.",
          keywords: ["photo wall", "photos", "gallery", "images"],
          suggestedQuestions: ["What is free?", "What is the notice board for?", "What is the relationship with Hanshan Temple?"],
          links: [sharedLinks.photo.en],
          hot: true
        },
        {
          id: "faq-notice-board",
          category: "visit",
          categoryLabel: "Visitor notes",
          question: "What is the notice board for?",
          answer: "The notice board is more practical and update-focused. It helps residents and visitors review announcements, service reminders, and operation changes in one place, especially before a trip or when checking recent updates.",
          keywords: ["notice board", "notice", "announcement", "alerts", "updates"],
          suggestedQuestions: ["What are the opening hours?", "Do I need a ticket?", "What can Smart Maple Bridge do?"],
          links: [sharedLinks.notice.en],
          hot: true
        },
        {
          id: "faq-culture",
          category: "culture",
          categoryLabel: "Cultural background",
          question: "What is the relationship between Maple Bridge and Hanshan Temple?",
          answer: "They are often understood together as part of the same cultural memory. The bridge, water, and canal space connect with the temple imagery and bell memory of Hanshan Temple, so visitors usually experience the area as one larger poetic and historical context rather than a single isolated spot.",
          keywords: ["hanshan temple", "relationship", "cultural background", "poetry", "bells"],
          suggestedQuestions: ["Where is Maple Bridge?", "What route do you recommend?", "Where is the photo wall?"],
          links: [sharedLinks.map.en, sharedLinks.photo.en],
          hot: true
        }
      ]
    }
  };
})();

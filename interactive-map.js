const mapModal = document.querySelector("#map-modal");
const mapModalBody = document.querySelector("#map-modal-body");
const mapModalClose = document.querySelector("#map-modal-close");
const mapModalKicker = document.querySelector("#map-modal-kicker");
const mapSurface = document.querySelector("#amap-container");
const mapStatus = document.querySelector("[data-map-status]");
const mapFallback = document.querySelector("[data-map-fallback]");
const routePanel = document.querySelector("#route-recommend-panel");
const routeTimeOptions = document.querySelector("#route-time-options");
const routePreferenceOptions = document.querySelector("#route-preference-options");
const routeResultInline = document.querySelector("#route-result-inline");
const routeModal = document.querySelector("#route-modal");
const routeModalBody = document.querySelector("#route-modal-body");
const routeModalClose = document.querySelector("#route-modal-close");
const mapExplorerSection = document.querySelector("#map-explorer");

const MAP_CONFIG = window.MAPLE_BRIDGE_AMAP_CONFIG || {};
const MAP_CENTER = Array.isArray(MAP_CONFIG.center) ? MAP_CONFIG.center : [120.5662, 31.3161];
const MAP_ZOOM = typeof MAP_CONFIG.zoom === "number" ? MAP_CONFIG.zoom : 15.9;
const MAP_VERSION = MAP_CONFIG.version || "2.0";
const mapLanguage = window.MAPLE_BRIDGE_I18N?.getLanguage?.() || "zh";
const localize = (value) => window.MAPLE_BRIDGE_I18N?.text?.(value) || (typeof value === "string" ? value : value.zh);
const SCENIC_BOUNDS = {
  southWest: [120.5651, 31.3071],
  northEast: [120.5702, 31.3112],
};

let mapInstance = null;
let activeHotspot = null;
let activePoemImageryId = "";
let fortuneShakeTimer = null;
let activeRouteFilters = {
  time: "",
  preference: "",
};
let activeRouteRecommendation = null;
let isRouteModalOpen = false;

const scenicImage = ({ palette, title, subtitle }) => {
  const [first, second, third] = palette;
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="920" height="600" viewBox="0 0 920 600">
      <defs>
        <linearGradient id="scene-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${first}" />
          <stop offset="100%" stop-color="${second}" />
        </linearGradient>
      </defs>
      <rect width="920" height="600" rx="40" fill="url(#scene-bg)" />
      <path d="M80 445 C210 300, 380 280, 510 420 S760 525, 860 420" fill="none" stroke="rgba(52,42,35,0.62)" stroke-width="18" stroke-linecap="round"/>
      <path d="M95 460 H835" stroke="rgba(255,250,244,0.34)" stroke-width="6"/>
      <rect x="620" y="180" width="120" height="170" rx="16" fill="rgba(246,238,229,0.58)"/>
      <path d="M605 195 L680 145 L755 195" stroke="${third}" stroke-width="16" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="155" cy="120" r="42" fill="${third}" fill-opacity="0.8"/>
      <text x="72" y="92" fill="rgba(45,42,38,0.86)" font-size="48" font-family="Noto Serif SC, serif">${title}</text>
      <text x="72" y="138" fill="rgba(45,42,38,0.58)" font-size="24" font-family="Manrope, sans-serif">${subtitle}</text>
    </svg>`;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

const MAP_SCENE_IMAGE_BY_ID = {
  "ancient-wharf": "images/map_scene/ancient-dock.jpg",
  "bell-corridor": "images/map_scene/bell-gallary.jpg",
  "fengqiao-bridge": "images/map_scene/maple-bridge-body.jpg",
  "fengqiao-old-town": "images/map_scene/maple-bridge-town.jpg",
  "jiangcun-bridge": "images/map_scene/jiangcun-bridge.jpg",
  "tieling-pass": "images/map_scene/tielingguan.jpg",
  "grand-canal": "images/map_scene/ancient-manual-river.jpg",
  "opera-stage-square": "images/map_scene/ancient-dramatic-planet-square.jpg",
  "puming-pagoda": "images/map_scene/puming-tower.jpg",
};

const mapUiText = {
  routeCurrent: { zh: "当前推荐", en: "Current Pick" },
  routeOrder: { zh: "推荐顺序", en: "Suggested Order" },
  scenicTitle: { zh: "景点解读", en: "Scenic Reading" },
  scenicHighlights: { zh: "看点摘要", en: "Key Highlights" },
  gameTitle: { zh: "玩法说明", en: "How It Works" },
  gameBody: { zh: "点击下方按钮，系统会随机生成一条今日签语风格的结果，让祈福体验更轻松自然地融入游览过程。", en: "Tap the button below and the system will generate a blessing-style result for today, making the interaction feel light and gentle." },
  fortuneDraw: { zh: "抽取今日福运", en: "Draw Today's Blessing" },
  fortuneReset: { zh: "重新来过", en: "Try Again" },
  fortuneIdleTitle: { zh: "轻触按钮，听一声今日回响。", en: "Tap the button and listen for today's echo." },
  fortuneIdleText: { zh: "结果会在这里出现。", en: "Your result will appear here." },
  poemIdleTitle: { zh: "点开一个意象，慢慢读进枫桥夜色。", en: "Tap an image and read your way into Maple Bridge at night." },
  poemIdleText: { zh: "点击诗中加粗的词语，下方会出现对应的画面和诗文解析。", en: "Click the highlighted imagery in the poem to reveal its visual scene and interpretation below." },
  poemLead: { zh: "诗句中的五个关键意象已经被标记出来。点开它们，让《枫桥夜泊》的画面、地点与回响在下方慢慢展开。", en: "Five key images in the poem have been marked. Tap them to unfold the scene, setting, and echoes of 'Mooring by Maple Bridge at Night' below." },
  mapPreparing: { zh: "正在准备真实地图...", en: "Preparing the live map..." },
  mapFallback: { zh: "地图暂时未能加载", en: "The map could not be loaded right now." }
};

const routeEn = {
  "route-60-waterway": {
    title: "1-Hour Bridges & Canal Route",
    summary: "Build a first impression of Maple Bridge through its bridges and canal in a short visit.",
    whyRecommended: "Ideal for visitors with limited time who want to understand the bridge-canal relationship first."
  },
  "route-90-waterway": {
    title: "90-Minute Bridges & Canal Route",
    summary: "Spend longer among the bridges and canal, and include the old wharf and shoreline.",
    whyRecommended: "Suitable for visitors who want a slower waterside route with time to pause and take photos."
  },
  "route-120-waterway": {
    title: "2-Hour Deep Canal Route",
    summary: "Follow the waterside route out toward the old town for a fuller impression of Maple Bridge.",
    whyRecommended: "Best for visitors with more time who want a complete sense of bridges, water, shoreline, and lanes."
  },
  "route-60-history": {
    title: "1-Hour Historic Passes Route",
    summary: "Focus on Tieling Pass, temple bells, and tower views for a denser historic thread.",
    whyRecommended: "Recommended for visitors who care more about historic boundaries and temple culture."
  },
  "route-90-history": {
    title: "90-Minute Historic Passes Route",
    summary: "Read Maple Bridge through bells, gates, and pagoda views in a steadier historical sequence.",
    whyRecommended: "Build a fuller historic reading path across defense, memorial landmarks, and bridge-side space."
  },
  "route-90-old-town": {
    title: "90-Minute Old Town Walk",
    summary: "Move from bridge to lanes, square, and old-town texture at a slower rhythm.",
    whyRecommended: "Great for visitors who want more local atmosphere rather than moving only between landmarks."
  }
};

const hotspotEn = {
  "fengqiao-bridge": {
    title: "Maple Bridge",
    tag: "Scenic Reading",
    shortDescription: "Standing on the bridge is the easiest way to understand why poetry, the canal, and Suzhou meet here.",
    detail: "Maple Bridge is one of the core cultural anchors of the scenic area. It links literature, transport history, and local memory in one place: the canal below, Hanshan Temple and Tieling Pass nearby, and the classic poetic viewpoint above.",
    highlights: ["The most representative landmark in the area", "Connects the canal, temple, and poetic atmosphere", "The best place to ground the imagery of river maples and fishing lights"]
  },
  "hanshan-temple": {
    title: "Hanshan Temple Blessing",
    tag: "Blessing Play",
    shortDescription: "What moves people here is not only the blessing itself, but the quiet strength that follows the bell.",
    intro: "Tap the blessing button and let today's wish unfold slowly in the imagery of temple bells.",
    fortunes: [
      { title: "Bell in the Heart", summary: "Today is better for slow decisions. The calmer you are, the clearer the way becomes.", blessing: "May every step you take today be answered by a clear echo." },
      { title: "Bridge-side Good Fortune", summary: "A good day to meet people, talk, and share your work. Your expression will be warmly received.", blessing: "May you keep your own calm even when surrounded by others." },
      { title: "Smooth Water Light", summary: "Today is suitable for sorting out plans. Steady progress will work better than last-minute rushing.", blessing: "May what you want to do always find a bridge to cross and a shore to reach." },
      { title: "Thoughts by Night Mooring", summary: "A good day for solitude and reflection. Inspiration may arrive in stillness.", blessing: "May you hear the bell and answer that belong to you alone." }
    ]
  },
  "water-poem": {
    title: "Poetic Waters",
    tag: "Poetic Interaction",
    shortDescription: "What makes Maple Bridge most moving is not one building, but the way the water gathers all things into one atmosphere. Tap the key imagery in the poem to reveal the scene.",
    poemTitle: "Mooring by Maple Bridge at Night",
    poemAuthor: "Zhang Ji",
    imageryNotes: {
      "moon-crow": { title: "Moonset and Crow Calls", note: "As the moon sinks and crows cry out, hearing and sky conditions arrive together. This line opens the poem with chill, wakefulness, and drifting solitude." },
      "river-maple-lights": { title: "River Maples and Fishing Lights", note: "The maple shadows and scattered fishing lights give the wide water a point of focus and bring the traveller's emotion down into something visible." },
      "gusu-city": { title: "Gusu City", note: "When the poem reaches Gusu, the night on the water gains a real geographic anchor. The mood is no longer abstract; it belongs to Suzhou." },
      "hanshan-temple": { title: "Hanshan Temple", note: "Hanshan Temple works like a cultural anchor in the poem, connecting the traveller's mind with the temple, its bells, and the wider memory of Maple Bridge." },
      "midnight-bell": { title: "Midnight Bells", note: "The bells reaching the boat are the most penetrating moment in the poem. They turn a still night scene into a living experience remembered for centuries." }
    }
  },
  "ancient-wharf": {
    title: "Ancient Wharf",
    tag: "Scenic Reading",
    shortDescription: "The old wharf preserves the everyday rhythm of trade, water travel, and stopping by the canal.",
    detail: "If Maple Bridge defines the spatial frame of the area, the old wharf reveals how people actually moved through it. Boats stopped here, people changed shore, and the poetic idea of night mooring became part of real local life.",
    highlights: ["Strong everyday and transport memory", "Connects boat travel with mooring imagery", "A realistic entry point for understanding 'night mooring'"]
  },
  "bell-corridor": {
    title: "Bell Corridor",
    tag: "Scenic Reading",
    shortDescription: "This is where hearing Hanshan Temple turns into physically entering its cultural atmosphere.",
    detail: "The bell culture of Hanshan Temple is not just about sound. It also extends through inscriptions, temple memory, and movement through space. This corridor works as a transition from seeing a site to inhabiting its cultural mood.",
    highlights: ["Extends the temple's bell culture into space", "Links poetry, bells, and walking experience", "A key step from viewing into immersion"]
  },
  "jiangcun-bridge": {
    title: "Jiangcun Bridge",
    tag: "Scenic Reading",
    shortDescription: "If Maple Bridge is the main figure, Jiangcun Bridge is the other half that completes the poem's space.",
    detail: "Jiangcun Bridge stands across the water from Maple Bridge and helps create the layered scene behind the famous poem. Its value lies in this scenic relationship: the bridges, canal, bells, and boats make sense together rather than as isolated landmarks.",
    highlights: ["Forms the classic poetic space with Maple Bridge", "Useful for reading the canal's layered view", "A quiet but memorable bridge in the scenic area"]
  },
  "tieling-pass": {
    title: "Tieling Pass",
    tag: "Scenic Reading",
    shortDescription: "If Maple Bridge is the poetic entrance, Tieling Pass is one of the few places that reveals the area's harder historic edge.",
    detail: "Tieling Pass reminds visitors that Maple Bridge is not only about bells and river mist. It also carries memories of defense, border control, and resistance. That contrast gives the area both gentleness and strength.",
    highlights: ["Highly legible Ming-period defense site", "Balances the scenic area's poetic image with history", "Adds depth and tension to the overall reading"]
  },
  "grand-canal": {
    title: "Grand Canal",
    tag: "Scenic Reading",
    shortDescription: "To understand Maple Bridge, you must read not only the bridge and temple, but also the canal that keeps everything moving.",
    detail: "The Grand Canal is the long historical line behind Maple Bridge. It is not just scenery. It shaped Suzhou's urban rhythm, commerce, and cultural memory, turning the scenic area into a living slice of city civilisation.",
    highlights: ["The main spatial and historical line of the area", "Helps explain Suzhou's old-city structure", "Supports the theme of a flowing cultural heritage"]
  },
  "fengqiao-old-town": {
    title: "Maple Bridge Old Town",
    tag: "Scenic Reading",
    shortDescription: "This is where visitors move from looking at landmarks to feeling local life.",
    detail: "The old town brings bridges, temples, and passes back into the scale of daily living. Waterside homes, narrow lanes, and a slower pace make the area feel inhabited rather than staged, helping the scenic narrative settle into ordinary life.",
    highlights: ["One of the most life-filled parts of the scenic area", "Best for reading Jiangnan lanes and waterside daily life", "Turns macro heritage into intimate local atmosphere"]
  },
  "opera-stage-square": {
    title: "Opera Stage Square",
    tag: "Scenic Reading",
    shortDescription: "This is less a static background and more the public cultural living room of the scenic area.",
    detail: "Opera Stage Square shows that culture in Maple Bridge is still something people use, gather around, and share. Performances, gatherings, and seasonal events make this a place of living tradition rather than passive display.",
    highlights: ["Suitable for performances, gatherings, and festivals", "Highlights living culture instead of static exhibition", "Encourages staying, meeting, and participating"]
  },
  "puming-pagoda": {
    title: "Puming Pagoda",
    tag: "Scenic Reading",
    shortDescription: "It restores the complete skyline of temple and tower facing each other again.",
    detail: "Puming Pagoda gives Hanshan Temple a strong vertical symbol. Alongside bells, temple halls, and the canal, it helps visitors understand why Maple Bridge became such a lasting cultural image.",
    highlights: ["Restores the historic temple-and-pagoda relationship", "A strong visual focus for Hanshan Temple", "Useful for expressing spiritual height and depth"]
  }
};

const hotspots = [
  {
    id: "fengqiao-bridge",
    title: "枫桥桥身",
    type: "scenic",
    position: { lng: 120.56685, lat: 31.31088 },
    tag: "景点解读",
    shortDescription: "站在桥上，最容易理解诗、运河与苏州为什么会在这里重合。",
    detail: "枫桥是景区最核心的文化坐标之一。它旧名“封桥”，与古代漕运夜间封桥禁行有关，后逐渐写作“枫桥”。现存桥体为清同治六年重建的花岗石单孔石拱桥，后又经过整修。它的价值并不只在“古”，更在于它把文学、交通与地方历史压缩在同一个空间里：桥下是千年运河，桥畔是寒山寺与铁铃关，桥上则是无数游客进入《枫桥夜泊》意境的第一视角。来到这里，看到的不是一座孤立的桥，而是苏州水城文化的一处现实入口。",
    highlights: ["枫桥景区最具代表性的核心地标", "适合串联运河、古寺与诗意场景理解", "是“江枫渔火”意象落入现实的最佳观察点"],
    image: MAP_SCENE_IMAGE_BY_ID["fengqiao-bridge"] || scenicImage({
      palette: ["#eadbc7", "#b88660", "#f6e5c3"],
      title: "枫桥桥身",
      subtitle: "Bridge View"
    })
  },
  {
    id: "hanshan-temple",
    title: "寒山寺祈福",
    type: "game",
    position: { lng: 120.56855, lat: 31.3103},
    tag: "祈福互动",
    shortDescription: "这里最动人的，不只是“灵”，而是钟声之后那种安静下来的力量。",
    intro: "点一下祈福按钮，让今天的祝福回应在钟声意象里慢慢展开。",
    fortunes: [
      {
        title: "钟声入怀",
        summary: "今天适合慢一点做决定，越不着急，越容易看清方向。",
        blessing: "愿你今日所行之路，皆有清响回应。"
      },
      {
        title: "桥畔小吉",
        summary: "适合见人、交流、分享作品，你的表达会被温柔接住。",
        blessing: "愿你在人群中也能保有自己的安静。"
      },
      {
        title: "水光平顺",
        summary: "今天适合整理计划，循序推进会比临时冲刺更顺利。",
        blessing: "愿你想做的事，有桥可过，有岸可抵。"
      },
      {
        title: "夜泊有思",
        summary: "适合独处与沉淀，灵感可能出现在安静时刻。",
        blessing: "愿你听见属于自己的钟声与回音。"
      }
    ]
  },
  {
    id: "water-poem",
    title: "水面诗境",
    type: "poem",
    position: { lng: 120.56655, lat: 31.30948 },
    tag: "诗意互动",
    shortDescription: "枫桥最迷人的，不是某一处建筑，而是水面把所有景物连成了一种气氛。S点击诗中的关键意象，水中诗景将会浮现。",
    poemTitle: "枫桥夜泊",
    poemAuthor: "张继",
    poemLines: [
      {
        text: "月落乌啼霜满天",
        segments: [
          { type: "imagery", imageryId: "moon-crow", text: "月落乌啼" },
          { type: "text", text: "霜满天" }
        ]
      },
      {
        text: "江枫渔火对愁眠",
        segments: [
          { type: "imagery", imageryId: "river-maple-lights", text: "江枫渔火" },
          { type: "text", text: "对愁眠" }
        ]
      },
      {
        text: "姑苏城外寒山寺",
        segments: [
          { type: "imagery", imageryId: "gusu-city", text: "姑苏城" },
          { type: "text", text: "外" },
          { type: "imagery", imageryId: "hanshan-temple", text: "寒山寺" }
        ]
      },
      {
        text: "夜半钟声到客船",
        segments: [
          { type: "imagery", imageryId: "midnight-bell", text: "夜半钟声" },
          { type: "text", text: "到客船" }
        ]
      }
    ],
    imageryNotes: [
      {
        id: "moon-crow",
        label: "月落乌啼",
        title: "月落乌啼",
        note: "月色渐沉、乌啼忽起，把夜航人的听觉与天色变化一起推到眼前。它不是单纯写景，而是在第一瞬就把枫桥夜泊的清寒、惊醒与漂泊感安静地铺开。",
        image: "images/poem/yueluowuti.jpg"
      },
      {
        id: "river-maple-lights",
        label: "江枫渔火",
        title: "江枫渔火",
        note: "江边枫影与点点渔火让广阔水面忽然有了可停驻的画面焦点，也让旅人的情绪落到可感知的地方。它把远夜写得不空，给整首诗添上最鲜明的人间温度。",
        image: "images/poem/jiangfengyuhuo.jpg"
      },
      {
        id: "gusu-city",
        label: "姑苏城",
        title: "姑苏城",
        note: "诗句写到姑苏城，水上的夜色便有了真实坐标。它把前两句的氛围感引回苏州这座古城，也让读者意识到，这份愁绪并不是虚景，而是停泊在可被抵达的地方文化中。",
        image: "images/poem/gusu_city.jpg"
      },
      {
        id: "hanshan-temple",
        label: "寒山寺",
        title: "寒山寺",
        note: "寒山寺在诗中像一枚沉稳的文化锚点，让漂泊的夜晚突然有了精神寄托。它不仅提示地点，更把寺院、钟声与旅人心绪连成枫桥最经典的一层记忆。",
        image: "images/poem/hanshan_temple.jpg"
      },
      {
        id: "midnight-bell",
        label: "夜半钟声",
        title: "夜半钟声",
        note: "钟声穿过深夜传到客船，是整首诗里最有穿透力的瞬间。它让原本静止的夜景突然流动起来，也把旅人的孤寂、寺院的回响与枫桥的文化意象一起留在记忆里。",
        image: "images/poem/midnight_bell_sound.jpg"
      }
    ]
  },
  {
    id: "ancient-wharf",
    title: "古渡口",
    type: "scenic",
    position: { lng: 120.56667, lat: 31.31198 },
    tag: "景点解读",
    shortDescription: "古渡口镌刻了古老岁月里日常流动的生活感，将商旅、水路与停泊的记忆刻在石砖片瓦之中。",
    detail: "如果说桥身强调的是空间骨架，那么古渡口强调的就是人与水路的关系。这里承接停舟、换岸、短暂停留等动作，也让枫桥不只是诗里的意象，而是曾经真实运转的地方。",
    highlights: ["生活性与交通性记忆", "适合串联船行与停泊意象", "是游客理解“夜泊”的现实场景入口"],
    image: MAP_SCENE_IMAGE_BY_ID["ancient-wharf"] || scenicImage({
      palette: ["#dfe7e2", "#769183", "#efe2cb"],
      title: "古渡口",
      subtitle: "Old Wharf"
    })
  },
  {
    id: "bell-corridor",
    title: "钟声长廊",
    type: "scenic",
    position: { lng: 120.56965, lat: 31.30972 },
    tag: "景点解读",
    shortDescription: "这是最适合把“听见寒山”变成“走进寒山”的一段空间。",
    detail: "寒山寺最著名的文化符号当然是钟声，但钟声真正动人的地方，不只在“响”，而在它周围形成的完整文化系统。官方资料中，寒山寺既有“千年钟声”的传统，也有“古碑长廊”等碑刻空间，诗、钟、碑、塔共同构成了寒山文化的体验脉络。因此，“钟声长廊”这个热点很适合写成一段过渡性的文化廊道：游客在行走中不是只看建筑，而是在阅读碑刻、联想诗句、感受钟韵之间，慢慢把文学中的《枫桥夜泊》转化为身体可以亲历的场景。这里强调的不是热闹，而是沉浸。",
    highlights: ["适合表现寒山寺“钟声文化”的延展性", "可连接诗碑、钟韵与步行体验", "是从“看景点”过渡到“入情境”的关键节点"],
    image: MAP_SCENE_IMAGE_BY_ID["bell-corridor"] || scenicImage({
      palette: ["#ead7bd", "#8f6545", "#f6e7c2"],
      title: "钟声长廊",
      subtitle: "Bell Echo"
    })
  },
  {
    id: "jiangcun-bridge",
    title: "江村桥",
    type: "scenic",
    position: { lng: 120.56768, lat: 31.30974 },
    tag: "景点解读",
    shortDescription: "若说枫桥是主角，那么江村桥就是让整首诗真正成立的另一半空间。",
    detail: "枫桥景区最有层次的地方，在于并不是只有一座桥。官方资料显示，江村桥为单孔石拱桥，原建于唐代，清康熙四十五年由地方募资重建，1984年又经整修。它与枫桥隔水相望，共同构成《枫桥夜泊》的空间想象：桥影、船行、钟声、夜色，并不是从单一点位生成的，而是在两桥与运河之间慢慢展开。相比名气更大的枫桥，江村桥的价值在于它的“配景性”——正因为有它，游客看到的才不是单一地标，而是一幅具有前后景、远近景的完整江南夜泊图景。",
    highlights: ["与枫桥共同构成经典诗意空间", "适合从对景关系理解运河两岸层次", "是景区中很有“回味感”的古桥节点"],
    image: MAP_SCENE_IMAGE_BY_ID["jiangcun-bridge"] || scenicImage({
      palette: ["#e6dccd", "#9a7050", "#f2dfba"],
      title: "江村桥",
      subtitle: "Jiangcun Bridge"
    })
  },
  {
    id: "tieling-pass",
    title: "铁岭关",
    type: "scenic",
    position: { lng: 120.56752, lat: 31.31082 },
    tag: "景点解读",
    shortDescription: "如果说枫桥是诗意入口，那么铁铃关就是这片水乡少有的历史棱角。",
    detail: "铁铃关建于明嘉靖三十六年，又称枫桥敌楼，是苏州“三关”之一，也是当地保存较完整的抗倭历史遗存。很多游客初到这里，会先被城楼、关台和厚重的墙体吸引，但它真正重要的地方，在于补足了枫桥“柔美之外”的另一面。运河带来商旅往来，也带来防御需求；江南水乡不只有烟雨和钟声，也有城防、警戒与战事记忆。铁铃关让人意识到，枫桥并不只是文人笔下的愁眠之地，它同样经历过守卫城市、抵御外侮的历史时刻，因此这里的气质既温润，也坚硬。",
    highlights: ["明代城防遗存，历史辨识度很高", "能补充游客对枫桥“诗意之外”的理解", "适合表现景区的历史纵深与空间张力"],
    image: MAP_SCENE_IMAGE_BY_ID["tieling-pass"] || scenicImage({
      palette: ["#ddd2c4", "#8d6649", "#e9d6b3"],
      title: "铁岭关",
      subtitle: "Tieling Pass"
    })
  },
  {
    id: "grand-canal",
    title: "古运河",
    type: "scenic",
    position: { lng: 120.5661, lat: 31.31051 },
    tag: "景点解读",
    shortDescription: "想读懂枫桥，不能只看桥与寺，更要看一直流动的古运河。",
    detail: "枫桥景区依托古运河展开，而大运河苏州段作为世界文化遗产的重要组成部分，使这里不仅是观光景点，更是一处持续运转的历史现场。苏州也是运河沿线唯一以“古城概念”参与申遗的城市，这意味着运河并不是城市外的一条水道，而是与古城街巷、水网格局和生活方式紧密连在一起的文化骨架。站在古运河边看枫桥，看到的不只是水面风景，而是一条塑造苏州城市节奏、商业往来和文化记忆的时间长线。它让整个景区从“诗歌场景”上升为“城市文明的切片”。",
    highlights: ["枫桥景区的空间主线与历史背景", "可从运河角度理解苏州古城格局", "适合强调“流动的文化遗产”这一主题"],
    image: MAP_SCENE_IMAGE_BY_ID["grand-canal"] || scenicImage({
      palette: ["#d8e2e1", "#6c8790", "#efe1c9"],
      title: "古运河",
      subtitle: "Grand Canal"
    })
  },
  {
    id: "fengqiao-old-town",
    title: "枫桥古镇",
    type: "scenic",
    position: { lng: 120.56722, lat: 31.31014 },
    tag: "景点解读",
    shortDescription: "这里让游客从“看景”走向“感受地方生活”。",
    detail: "枫桥景区的魅力，并不只来自寒山寺、古桥和城关，也来自古镇肌理本身。官方资料将枫桥古镇列入景区“五古”之一，正说明它并非配角。沿河街巷、临水民居、商铺尺度与慢节奏步行体验，共同构成了江南水乡最日常也最耐看的部分。桥、寺、关更多承载的是地标和历史，古镇则负责把这些宏观文化重新落回生活：人在这里如何居住、交易、往来，运河如何进入日常，地方气质又如何在细碎的空间中沉淀下来。它让整个游览不止停留在“打卡古迹”，而更像一次进入苏州地方生活纹理的阅读。",
    highlights: ["景区“五古”之一，生活气息最强", "适合表现江南街巷与水乡日常", "能把宏观景点叙事转成细腻的人间感受"],
    image: MAP_SCENE_IMAGE_BY_ID["fengqiao-old-town"] || scenicImage({
      palette: ["#e8ddcf", "#b37f58", "#f4e7cf"],
      title: "枫桥古镇",
      subtitle: "Old Town"
    })
  },
  {
    id: "opera-stage-square",
    title: "古戏台广场",
    type: "scenic",
    position: { lng: 120.56722, lat: 31.30964 },
    tag: "景点解读",
    shortDescription: "这里不是静止的背景板，而是景区最像“文化客厅”的公共空间。",
    detail: "枫桥景区今天的吸引力，不只在历史遗存，也在文化如何继续发生。官方资料中，吴门戏台已是景区的重要节点，而寒山雅集等活动也曾在古戏台广场举行。对游客来说，这里最值得强调的不是“古”，而是“活”——它让评弹、雅集、节庆、市民驻足和游客停留，都有了一个可以承载的场所。与桥、寺、关不同，古戏台广场更偏向公共文化体验：人在这里不只是观看历史，而是通过表演、集市和节庆氛围，感受到传统文化在当代城市中仍然可以被使用、被分享、被重新理解。",
    highlights: ["适合承载演艺、雅集与节庆活动", "突出景区“活态文化”而非单纯静态展示", "能增强游客停留、交流与参与感"],
    image: MAP_SCENE_IMAGE_BY_ID["opera-stage-square"] || scenicImage({
      palette: ["#ead8ca", "#9c6544", "#f1ddbb"],
      title: "古戏台广场",
      subtitle: "Stage Square"
    })
  },
  {
    id: "puming-pagoda",
    title: "普明宝塔",
    type: "scenic",
    position: { lng: 120.56955, lat: 31.31035 },
    tag: "景点解读",
    shortDescription: "它让寒山寺重新拥有了“寺与塔相互映照”的完整天际线。",
    detail: "寒山寺开山原有“妙利普明塔”，但元代以后长期有寺无塔。今天游客看到的普明宝塔为1996年重建，采用仿唐木结构楼阁式样，既回应了寒山寺最初的历史名称，也恢复了古刹应有的塔影景观。对于网页叙事来说，这里不只是一个“高处看景”的点位，更是理解寺院空间秩序的重要线索：塔的垂直感让寒山寺从平面的游览路线中拔起，形成更鲜明的精神性象征。塔、钟、寺、河相互映照之后，游客会更容易理解为什么“枫桥夜泊”能成为跨越千年的文化意象。",
    highlights: ["重现寒山寺“有寺有塔”的历史格局", "是寒山寺视觉识别度极高的空间焦点", "适合表现古刹的纵深感与精神象征"],
    image: MAP_SCENE_IMAGE_BY_ID["puming-pagoda"] || scenicImage({
      palette: ["#e4d5c2", "#916447", "#eedab7"],
      title: "普明宝塔",
      subtitle: "Puming Pagoda"
    })
  }
];

const routeTimeOptionsData = ["60分钟", "90分钟", "120分钟"];
const routePreferenceOptionsData = ["桥与运河", "历史关隘", "古镇漫游"];

const routeRecommendations = [
  {
    id: "route-60-waterway",
    title: "一小时桥与运河线",
    time: "60分钟",
    preference: "桥与运河",
    summary: "沿桥身与运河快速建立对枫桥水岸空间的第一印象。",
    stops: ["fengqiao-bridge", "jiangcun-bridge", "grand-canal"],
    durationLabel: "约 60 分钟",
    whyRecommended: "适合停留时间有限、但想优先抓住桥与运河关系的游客。"
  },
  {
    id: "route-90-waterway",
    title: "九十分钟桥与运河线",
    time: "90分钟",
    preference: "桥与运河",
    summary: "在桥与水之间多停一会儿，把渡口和岸线也一起看清楚。",
    stops: ["fengqiao-bridge", "jiangcun-bridge", "grand-canal", "ancient-wharf"],
    durationLabel: "约 90 分钟",
    whyRecommended: "适合想顺着水路慢慢看，也希望保留拍照与停留节奏的访客。"
  },
  {
    id: "route-120-waterway",
    title: "两小时桥与运河深览线",
    time: "120分钟",
    preference: "桥与运河",
    summary: "沿水路主线延展到古镇边缘，把枫桥最鲜明的水岸气质看得更完整。",
    stops: ["fengqiao-bridge", "jiangcun-bridge", "grand-canal", "ancient-wharf", "fengqiao-old-town"],
    durationLabel: "约 120 分钟",
    whyRecommended: "适合时间更充裕、想完整感受桥、水、岸与街巷关系的人。"
  },
  {
    id: "route-60-history",
    title: "一小时历史关隘线",
    time: "60分钟",
    preference: "历史关隘",
    summary: "用较短时间先抓住铁岭关、钟声与塔景这一条更厚重的历史线索。",
    stops: ["bell-corridor", "tieling-pass", "puming-pagoda"],
    durationLabel: "约 60 分钟",
    whyRecommended: "适合更在意历史边界与寺院文化层次的访问者。"
  },
  {
    id: "route-90-history",
    title: "九十分钟历史关隘线",
    time: "90分钟",
    preference: "历史关隘",
    summary: "从钟声、关隘到宝塔，理解枫桥一带更沉稳的历史边界感。",
    stops: ["bell-corridor", "tieling-pass", "puming-pagoda", "jiangcun-bridge"],
    durationLabel: "约 90 分钟",
    whyRecommended: "在关防、纪念性地标与桥畔空间之间建立更完整的历史阅读路径。"
  },
  {
    id: "route-90-old-town",
    title: "九十分钟古镇漫游线",
    time: "90分钟",
    preference: "古镇漫游",
    summary: "从桥边进入街巷、广场与古镇肌理，把游览节奏放得更缓一些。",
    stops: ["fengqiao-old-town", "opera-stage-square", "ancient-wharf", "fengqiao-bridge"],
    durationLabel: "约 90 分钟",
    whyRecommended: "适合想多感受地方生活氛围、而不只在地标之间穿梭的游客。"
  }
];

const scenicHotspots = new Map(
  hotspots
    .filter((hotspot) => hotspot.type === "scenic")
    .map((hotspot) => [hotspot.id, hotspot])
);

const getHotspotMode = (hotspot) => (hotspot.type === "scenic" ? "intro" : "play");

const resolveRecommendedRoute = (time, preference) => {
  const exactRoute = routeRecommendations.find((route) => route.time === time && route.preference === preference);

  if (exactRoute) {
    return exactRoute;
  }

  const samePreferenceRoutes = routeRecommendations.filter((route) => route.preference === preference);
  const timePriority = ["60分钟", "90分钟", "120分钟"];
  const selectedIndex = timePriority.indexOf(time);

  if (samePreferenceRoutes.length > 0 && selectedIndex !== -1) {
    const orderedPreferenceRoutes = [...samePreferenceRoutes].sort((left, right) => {
      return Math.abs(timePriority.indexOf(left.time) - selectedIndex) - Math.abs(timePriority.indexOf(right.time) - selectedIndex);
    });

    if (orderedPreferenceRoutes[0]) {
      return orderedPreferenceRoutes[0];
    }
  }

  return (
    routeRecommendations.find((route) => route.time === time) ||
    samePreferenceRoutes[0] ||
    routeRecommendations[0]
  );
};

const getLocalizedHotspot = (hotspot) => {
  if (mapLanguage !== "en") {
    return hotspot;
  }

  const en = hotspotEn[hotspot.id] || {};
  return {
    ...hotspot,
    title: en.title || hotspot.title,
    tag: en.tag || hotspot.tag,
    shortDescription: en.shortDescription || hotspot.shortDescription,
    detail: en.detail || hotspot.detail,
    intro: en.intro || hotspot.intro,
    poemTitle: en.poemTitle || hotspot.poemTitle,
    poemAuthor: en.poemAuthor || hotspot.poemAuthor,
    highlights: en.highlights || hotspot.highlights,
    fortunes: en.fortunes || hotspot.fortunes,
    imageryNotes: hotspot.imageryNotes?.map((item) => ({
      ...item,
      title: en.imageryNotes?.[item.id]?.title || item.title,
      note: en.imageryNotes?.[item.id]?.note || item.note
    })) || hotspot.imageryNotes
  };
};

const getLocalizedRoute = (route) => {
  if (mapLanguage !== "en") {
    return route;
  }

  const en = routeEn[route.id] || {};
  return {
    ...route,
    title: en.title || route.title,
    summary: en.summary || route.summary,
    whyRecommended: en.whyRecommended || route.whyRecommended,
    durationLabel: route.durationLabel.replace("约 ", "About ").replace(" 分钟", " min"),
    preference: routePreferenceLabel(route.preference)
  };
};

const routeTimeLabel = (time) => (mapLanguage === "en" ? time.replace("分钟", " min") : time);
const routePreferenceLabel = (preference) => {
  if (mapLanguage !== "en") return preference;
  if (preference === "桥与运河") return "Bridges & Canal";
  if (preference === "历史关隘") return "Historic Passes";
  return "Old Town Walk";
};

const renderRouteFilters = () => {
  if (routeTimeOptions) {
    routeTimeOptions.innerHTML = routeTimeOptionsData
      .map(
        (time) => `
          <button
            class="route-filter-chip ${activeRouteFilters.time === time ? "is-active" : ""}"
            type="button"
            data-route-time="${time}"
          >
            ${routeTimeLabel(time)}
          </button>
        `
      )
      .join("");
  }

  if (routePreferenceOptions) {
    routePreferenceOptions.innerHTML = routePreferenceOptionsData
      .map(
        (preference) => `
          <button
            class="route-filter-chip ${activeRouteFilters.preference === preference ? "is-active" : ""}"
            type="button"
            data-route-preference="${preference}"
          >
            ${routePreferenceLabel(preference)}
          </button>
        `
      )
      .join("");
  }
};

const setRouteModalOpen = (nextOpen) => {
  isRouteModalOpen = nextOpen;

  if (!routeModal) {
    return;
  }

  routeModal.classList.toggle("is-open", nextOpen);
  routeModal.setAttribute("aria-hidden", String(!nextOpen));
  document.body.classList.toggle("route-modal-open", nextOpen);
};

const closeRouteModal = () => {
  setRouteModalOpen(false);
};

const renderRouteInlineEmpty = () => {
  if (!routeResultInline) {
    return;
  }

  routeResultInline.hidden = true;
  routeResultInline.classList.add("is-hidden");
  routeResultInline.innerHTML = "";
};

const buildRouteStopsMarkup = (route) =>
  route.stops
    .map((stopId) => scenicHotspots.get(stopId))
    .filter(Boolean)
    .map(
      (stop, index) => `
        <li>
          <span class="route-stop-index">${index + 1}</span>
          <div>
            <strong>${getLocalizedHotspot(stop).title}</strong>
            <p>${getLocalizedHotspot(stop).shortDescription}</p>
          </div>
        </li>
      `
    )
    .join("");

const renderRouteInlineResult = (route) => {
  if (!routeResultInline) {
    return;
  }

  const localizedRoute = getLocalizedRoute(route);

  const stopSummary = route.stops
    .map((stopId) => scenicHotspots.get(stopId))
    .filter(Boolean)
    .map((stop) => getLocalizedHotspot(stop).title)
    .filter(Boolean)
    .join(" -> ");

  routeResultInline.hidden = false;
  routeResultInline.classList.remove("is-hidden");
  routeResultInline.innerHTML = `
    <div class="route-result-inline-head">
      <span class="kicker">${localize(mapUiText.routeCurrent)}</span>
      <span class="route-time">${localizedRoute.durationLabel}</span>
    </div>
    <h3>${localizedRoute.title}</h3>
    <p class="route-result-inline-seq">${stopSummary}</p>
    <div class="route-result-inline-actions">
      <button class="button button-secondary route-detail-button" type="button" data-route-detail="${route.id}">
        ${mapLanguage === "en" ? "View Full Route" : "查看详细路线"}
      </button>
    </div>
  `;
};

const openRouteModal = (route) => {
  if (!routeModalBody || !routeModal) {
    return;
  }

  const localizedRoute = getLocalizedRoute(route);
  activeRouteRecommendation = localizedRoute;
  routeModalBody.innerHTML = `
    <article class="route-route-summary">
      <div class="route-result-head">
        <span class="kicker">${localizedRoute.preference}</span>
        <span class="route-time">${localizedRoute.durationLabel}</span>
      </div>
      <h3>${localizedRoute.title}</h3>
      <p class="route-result-summary">${localizedRoute.summary}</p>
      <p class="route-result-reason">${localizedRoute.whyRecommended}</p>
    </article>
    <section class="route-sheet-section">
      <h3>${localize(mapUiText.routeOrder)}</h3>
      <ol class="route-stop-list">
        ${buildRouteStopsMarkup(route)}
      </ol>
    </section>
    <div class="route-sheet-actions">
      <button class="button button-secondary route-map-button" type="button" data-route-scroll="map">
        ${mapLanguage === "en" ? "View This Route on Map" : "按这条路线看地图"}
      </button>
    </div>
  `;

  setRouteModalOpen(true);
};

const updateRouteRecommendation = () => {
  renderRouteFilters();

  if (!activeRouteFilters.time || !activeRouteFilters.preference) {
    activeRouteRecommendation = null;
    renderRouteInlineEmpty();
    return;
  }

  const route = resolveRecommendedRoute(activeRouteFilters.time, activeRouteFilters.preference);
  activeRouteRecommendation = route;
  renderRouteInlineResult(route);
};

const initRouteRecommendation = () => {
  if (!routePanel) {
    return;
  }

  updateRouteRecommendation();

  routePanel.addEventListener("click", (event) => {
    const target = event.target;

    if (!(target instanceof HTMLElement)) {
      return;
    }

    const timeButton = target.closest("[data-route-time]");
    const preferenceButton = target.closest("[data-route-preference]");
    const detailButton = target.closest("[data-route-detail]");

    if (detailButton instanceof HTMLElement && detailButton.dataset.routeDetail) {
      const route = routeRecommendations.find((item) => item.id === detailButton.dataset.routeDetail);

      if (route) {
        openRouteModal(route);
      }
      return;
    }

    if (timeButton instanceof HTMLElement && timeButton.dataset.routeTime) {
      activeRouteFilters.time = timeButton.dataset.routeTime;
      updateRouteRecommendation();
      return;
    }

    if (preferenceButton instanceof HTMLElement && preferenceButton.dataset.routePreference) {
      activeRouteFilters.preference = preferenceButton.dataset.routePreference;
      updateRouteRecommendation();
    }
  });
};

const openModal = () => {
  if (!mapModal) {
    return;
  }

  mapModal.classList.add("is-open");
  mapModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("map-modal-open");
};

const closeModal = () => {
  if (!mapModal) {
    return;
  }

  mapModal.classList.remove("is-open");
  mapModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("map-modal-open");
};

const scenicTemplate = (hotspot) => `
  <article class="sheet-hero">
    <figure class="sheet-image-frame">
      <img src="${hotspot.image}" alt="${hotspot.title}${mapLanguage === "en" ? " scene image" : "景观示意图"}">
    </figure>
    <div class="sheet-copy">
      <p class="sheet-tag">${hotspot.tag}</p>
      <h2 id="map-modal-title">${hotspot.title}</h2>
      <p class="sheet-lead">${hotspot.shortDescription}</p>
    </div>
  </article>
  <section class="sheet-section">
    <h3>${localize(mapUiText.scenicTitle)}</h3>
    <p>${hotspot.detail}</p>
  </section>
  <section class="sheet-section">
    <h3>${localize(mapUiText.scenicHighlights)}</h3>
    <ul class="sheet-list">
      ${hotspot.highlights.map((item) => `<li>${item}</li>`).join("")}
    </ul>
  </section>
`;

const gameTemplate = (hotspot) => `
  <article class="sheet-hero sheet-hero-soft">
    <div class="sheet-copy">
      <p class="sheet-tag">${hotspot.tag}</p>
      <h2 id="map-modal-title">${hotspot.title}</h2>
      <p class="sheet-lead">${hotspot.intro}</p>
    </div>
    <figure class="fortune-vessel" id="fortune-vessel" aria-hidden="true">
      <img src="images/qiangtong.png" alt="" loading="lazy" decoding="async">
    </figure>
  </article>
  <section class="sheet-section">
    <h3>${localize(mapUiText.gameTitle)}</h3>
    <p>${localize(mapUiText.gameBody)}</p>
    <div class="fortune-actions">
      <button class="button button-primary" type="button" data-fortune-action="draw">${localize(mapUiText.fortuneDraw)}</button>
      <button class="button button-secondary" type="button" data-fortune-action="reset">${localize(mapUiText.fortuneReset)}</button>
    </div>
    <div class="fortune-result" id="fortune-result">
      <strong>${localize(mapUiText.fortuneIdleTitle)}</strong>
      <p>${localize(mapUiText.fortuneIdleText)}</p>
    </div>
  </section>
`;

const renderPoemLineSegments = (segments, activeImageryId) =>
  segments
    .map((segment) => {
      if (segment.type === "imagery") {
        const isActive = segment.imageryId === activeImageryId;
        return `
          <button
            class="poem-imagery${isActive ? " is-active" : ""}"
            type="button"
            data-poem-imagery="${segment.imageryId}"
            aria-pressed="${isActive ? "true" : "false"}"
          >
            ${segment.text}
          </button>
        `;
      }

      return `<span class="poem-text-fragment">${segment.text}</span>`;
    })
    .join("");

const createPoemNoteMarkup = (imagery) => {
  if (!imagery) {
    return `
      <div class="poem-note-empty">
        <strong>${localize(mapUiText.poemIdleTitle)}</strong>
        <p>${localize(mapUiText.poemIdleText)}</p>
      </div>
    `;
  }

  return `
    <figure class="poem-note-media">
      <img src="${imagery.image}" alt="${imagery.title}${mapLanguage === "en" ? " imagery image" : "意象示意图"}" loading="lazy" decoding="async">
    </figure>
    <div class="poem-note-copy">
      <strong>${imagery.title}</strong>
      <p>${imagery.note}</p>
    </div>
  `;
};

const poemTemplate = (hotspot) => `
  <article class="sheet-hero sheet-hero-soft">
    <div class="sheet-copy">
      <p class="sheet-tag">${hotspot.tag}</p>
      <h2 id="map-modal-title">${hotspot.poemTitle}</h2>
      <p class="sheet-lead">${localize(mapUiText.poemLead)}</p>
      <p class="poem-author">${hotspot.poemAuthor}</p>
    </div>
  </article>
  <section class="sheet-section">
    <div class="poem-lines" id="poem-lines" aria-label="${hotspot.poemTitle}全文">
      ${hotspot.poemLines
        .map(
          (item) => `
            <p class="poem-line">
              ${renderPoemLineSegments(item.segments, activePoemImageryId)}
            </p>
          `
        )
        .join("")}
    </div>
    <div class="poem-note" id="poem-note">
      ${createPoemNoteMarkup(null)}
    </div>
  </section>
`;

const renderModal = (hotspot) => {
  if (!mapModalBody || !mapModalKicker) {
    return;
  }

  const localizedHotspot = getLocalizedHotspot(hotspot);
  activeHotspot = localizedHotspot;
  mapModalKicker.textContent = localizedHotspot.tag;

  if (localizedHotspot.type === "scenic") {
    mapModalBody.innerHTML = scenicTemplate(localizedHotspot);
  }

  if (localizedHotspot.type === "game") {
    mapModalBody.innerHTML = gameTemplate(localizedHotspot);
  }

  if (localizedHotspot.type === "poem") {
    activePoemImageryId = "";
    mapModalBody.innerHTML = poemTemplate(localizedHotspot);
  }

  openModal();
};

const triggerFortuneVesselShake = () => {
  const fortuneVessel = document.querySelector("#fortune-vessel");

  if (!(fortuneVessel instanceof HTMLElement)) {
    return;
  }

  fortuneVessel.classList.remove("is-shaking");
  void fortuneVessel.offsetWidth;
  fortuneVessel.classList.add("is-shaking");

  if (fortuneShakeTimer) {
    window.clearTimeout(fortuneShakeTimer);
  }

  fortuneShakeTimer = window.setTimeout(() => {
    fortuneVessel.classList.remove("is-shaking");
    fortuneShakeTimer = null;
  }, 900);
};


const setMapStatus = (message) => {
  if (mapStatus) {
    mapStatus.textContent = message;
  }
};

const showMapFallback = (message) => {
  if (mapFallback) {
    mapFallback.hidden = false;

    const fallbackText = mapFallback.querySelector(".map-fallback-card p:last-child");
    if (fallbackText) {
      fallbackText.textContent = message;
    }
  }

  if (mapSurface) {
    mapSurface.setAttribute("aria-hidden", "true");
  }

  setMapStatus(message);
};

const hideMapFallback = () => {
  if (mapFallback) {
    mapFallback.hidden = true;
  }

  if (mapSurface) {
    mapSurface.removeAttribute("aria-hidden");
  }
};

const createMarkerContent = (hotspot) => {
  const button = document.createElement("button");
  const hotspotMode = getHotspotMode(hotspot);
  const localizedHotspot = getLocalizedHotspot(hotspot);
  button.type = "button";
  button.className = `map-hotspot-chip map-hotspot-${hotspot.type} is-${hotspotMode}`;
  button.setAttribute("aria-label", mapLanguage === "en" ? `Open ${localizedHotspot.title} (${localizedHotspot.tag})` : `打开${localizedHotspot.title}${localizedHotspot.tag}`);
  button.innerHTML = `
    <span class="map-hotspot-dot" aria-hidden="true"></span>
    <span class="map-hotspot-label">${localizedHotspot.title}</span>
  `;

  return button;
};

const bindMarkerEvents = (marker, hotspot) => {
  marker.on("click", () => {
    renderModal(hotspot);
  });
};

const createMapMarker = (hotspot) => {
  const AMap = window.AMap;

  if (!AMap || !mapInstance) {
    throw new Error("AMap marker cannot be created before map initialization.");
  }

  const marker = new AMap.Marker({
    position: [hotspot.position.lng, hotspot.position.lat],
    content: createMarkerContent(hotspot),
    anchor: "bottom-center",
    offset: new AMap.Pixel(0, -4),
    title: hotspot.title,
  });

  bindMarkerEvents(marker, hotspot);
  marker.setMap(mapInstance);

  return marker;
};

const loadExternalScript = (src, marker) =>
  new Promise((resolve, reject) => {
    const existingScript = document.querySelector(`script[data-${marker}="true"]`);

    if (existingScript) {
      if (existingScript.dataset.loaded === "true") {
        resolve();
        return;
      }

      existingScript.addEventListener("load", () => resolve(), { once: true });
      existingScript.addEventListener("error", () => reject(new Error(`${marker} failed to load.`)), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.defer = true;
    script.dataset[marker] = "true";
    script.addEventListener(
      "load",
      () => {
        script.dataset.loaded = "true";
        resolve();
      },
      { once: true }
    );
    script.addEventListener("error", () => reject(new Error(`${marker} failed to load.`)), { once: true });
    document.head.appendChild(script);
  });

const loadAmapSdk = async () => {
  if (!MAP_CONFIG.key) {
    throw new Error("Missing AMap key.");
  }

  if (window.AMap && window.AMapLoader) {
    return window.AMapLoader.load({
      key: MAP_CONFIG.key,
      version: MAP_VERSION,
    });
  }

  if (MAP_CONFIG.securityJsCode) {
    window._AMapSecurityConfig = {
      securityJsCode: MAP_CONFIG.securityJsCode,
    };
  }

  await loadExternalScript("https://webapi.amap.com/loader.js", "amapLoader");

  if (!window.AMapLoader) {
    throw new Error("AMapLoader unavailable.");
  }

  return window.AMapLoader.load({
    key: MAP_CONFIG.key,
    version: MAP_VERSION,
  });
};

const initInteractiveMap = async () => {
  if (!mapSurface) {
    return;
  }

  if (!MAP_CONFIG.key) {
    showMapFallback("尚未配置高德地图 Key");
    return;
  }

  setMapStatus("正在连接高德真实地图...");

  try {
    const AMap = await loadAmapSdk();

    if (!AMap) {
      throw new Error("AMap SDK unavailable.");
    }

    mapInstance = new AMap.Map("amap-container", {
      viewMode: "2D",
      center: MAP_CENTER,
      zoom: MAP_ZOOM,
      resizeEnable: true,
      dragEnable: true,
      zoomEnable: true,
      doubleClickZoom: true,
      jogEnable: false,
      keyboardEnable: false,
      features: ["bg", "road", "building", "point"],
    });

    const markers = hotspots.map((hotspot) => createMapMarker(hotspot));
    const scenicBounds = new AMap.Bounds(SCENIC_BOUNDS.southWest, SCENIC_BOUNDS.northEast);

    mapInstance.setBounds(scenicBounds, false, [84, 120, 92, 118]);
    mapInstance.setFitView(markers, false, [116, 176, 96, 146], MAP_ZOOM);
    mapInstance.setZoomAndCenter(Math.max(mapInstance.getZoom(), MAP_ZOOM), MAP_CENTER);

    hideMapFallback();
    setMapStatus("圆形看景点介绍，三角形进入游戏交互");
  } catch (error) {
    console.error(error);
    showMapFallback(`真实地图加载失败：${error instanceof Error ? error.message : "请检查 Key、网络或浏览器控制台"}`);
  }
};

initInteractiveMap();
initRouteRecommendation();

document.addEventListener("click", (event) => {
  const target = event.target;

  if (!(target instanceof HTMLElement)) {
    return;
  }

  if (target.dataset.closeModal === "true" || target.id === "map-modal-close") {
    closeModal();
  }

  if (target.dataset.closeRouteModal === "true" || target.id === "route-modal-close") {
    closeRouteModal();
  }

  if (target.dataset.routeScroll === "map") {
    closeRouteModal();
    mapExplorerSection?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  if (target.dataset.fortuneAction === "draw" && activeHotspot?.type === "game") {
    triggerFortuneVesselShake();
    const pool = activeHotspot.fortunes;
    const fortune = pool[Math.floor(Math.random() * pool.length)];
    const fortuneResult = document.querySelector("#fortune-result");

    if (fortuneResult) {
      fortuneResult.innerHTML = `
        <strong>${fortune.title}</strong>
        <p>${fortune.summary}</p>
        <p>${fortune.blessing}</p>
      `;
    }
  }

  if (target.dataset.fortuneAction === "reset") {
    const fortuneResult = document.querySelector("#fortune-result");

    if (fortuneResult) {
      fortuneResult.innerHTML = `
        <strong>${localize(mapUiText.fortuneIdleTitle)}</strong>
        <p>${localize(mapUiText.fortuneIdleText)}</p>
      `;
    }
  }

  if (target.dataset.poemImagery && activeHotspot?.type === "poem") {
    activePoemImageryId = target.dataset.poemImagery;

    const poemButtons = document.querySelectorAll(".poem-imagery");
    poemButtons.forEach((button) => {
      const isActive = button.getAttribute("data-poem-imagery") === activePoemImageryId;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", isActive ? "true" : "false");
    });

    const poemNote = document.querySelector("#poem-note");
    const imagery = activeHotspot.imageryNotes.find((item) => item.id === activePoemImageryId);

    if (poemNote && imagery) {
      poemNote.innerHTML = createPoemNoteMarkup(imagery);
    }
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") {
    return;
  }

  if (routeModal?.classList.contains("is-open")) {
    closeRouteModal();
    return;
  }

  if (mapModal?.classList.contains("is-open")) {
    closeModal();
  }
});

if (mapModalClose) {
  mapModalClose.addEventListener("click", closeModal);
}

if (routeModalClose) {
  routeModalClose.addEventListener("click", closeRouteModal);
}

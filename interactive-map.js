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
const SCENIC_BOUNDS = {
  southWest: [120.5651, 31.3071],
  northEast: [120.5702, 31.3112],
};

let mapInstance = null;
let activeHotspot = null;
let activePoemIndex = 0;
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

const hotspots = [
  {
    id: "fengqiao-bridge",
    title: "枫桥桥身",
    type: "scenic",
    position: { lng: 120.56685, lat: 31.31088 },
    tag: "景点解读",
    shortDescription: "从桥身向两侧望去，可以同时感受到水巷尺度与游线转折，是枫桥最适合建立空间印象的位置。",
    detail: "枫桥不仅是一个地理节点，更是诗意意象的聚合点。站在桥面上，能直观理解桥、水、寺、街巷之间的相互关系，也是游客初次到访时最容易形成“我已经到了枫桥”这一感受的地方。",
    highlights: ["桥上视角适合建立空间认知", "可串联寒山寺、水巷与步行流线", "是讲述《枫桥夜泊》意象的最佳起点"],
    image: scenicImage({
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
    shortDescription: "在钟声与香火意象里进行一次轻量祈愿，生成今日签语风格的福运结果。",
    intro: "寒山寺是这页中最适合做祈愿互动的地点。点一下祈福按钮，让今天的祝福回应在钟声意象里慢慢展开。",
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
    shortDescription: "围绕水域展开《枫桥夜泊》互动，点击诗句可以看到意象解释与氛围回应。",
    poemTitle: "枫桥夜泊",
    poemAuthor: "张继",
    poemLines: [
      {
        line: "月落乌啼霜满天",
        note: "这一句把听觉、视觉和体感并置在一起，开场就建立了深夜、清冷而辽阔的氛围。"
      },
      {
        line: "江枫渔火对愁眠",
        note: "江边枫树与渔火让空间有了落点，也让情绪有了停驻之处，是诗里最有画面感的一句。"
      },
      {
        line: "姑苏城外寒山寺",
        note: "从水上夜景回到明确地点，寒山寺在这里不是背景板，而是情感坐标。"
      },
      {
        line: "夜半钟声到客船",
        note: "钟声的抵达让诗从静景变成被触动的体验，也因此和枫桥、寒山寺长期连在一起。"
      }
    ]
  },
  {
    id: "ancient-wharf",
    title: "古渡口",
    type: "scenic",
    position: { lng: 120.56667, lat: 31.31198 },
    tag: "景点解读",
    shortDescription: "古渡口更接近日常流动的生活感，适合讲述商旅、水路与停泊记忆。",
    detail: "如果说桥身强调的是空间骨架，那么古渡口强调的就是人与水路的关系。这里承接停舟、换岸、短暂停留等动作，也让枫桥不只是诗里的意象，而是曾经真实运转的地方。",
    highlights: ["更偏生活性与交通性记忆", "适合串联船行与停泊意象", "可作为游客理解“夜泊”的现实场景入口"],
    image: scenicImage({
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
    shortDescription: "这里适合承接“钟声到客船”的文化联想，把声音经验转化成叙事体验。",
    detail: "钟声长廊并不需要复杂的机制，就能成为文化理解的锚点。它适合放置关于寒山寺钟声、夜半回响和游客记忆的解释，让用户从“听到”的意象进入更完整的文化背景。",
    highlights: ["连接钟声、寺院与诗歌", "适合作为文化解读节点", "可扩展为声音播放或时间轴内容"],
    image: scenicImage({
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
    shortDescription: "江村桥与枫桥共同构成这片景区最重要的桥梁意象，是理解水路与步行游线关系的关键点位。",
    detail: "江村桥更偏向空间秩序与交通组织的理解入口。站在这里，可以看清桥、水、岸线与寺院之间的层次关系，也能把“桥畔夜泊”的诗意感受落回到真实的地理场景中。",
    highlights: ["适合观察桥梁与古运河的相对关系", "可与枫桥桥身形成对照观看", "是游客建立景区空间感的重要节点"],
    image: scenicImage({
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
    shortDescription: "铁岭关强调的是枫桥一带更厚重的历史边界感，让游览从桥与水延伸到关隘与防守记忆。",
    detail: "相比桥梁与水巷的柔和感受，铁岭关更适合讲述枫桥一带在历史上的出入节点与关防意味。它让这片景区不只是诗意夜泊的地方，也保留了古代交通与边界管理的层次。",
    highlights: ["适合承接历史边界与关防叙事", "为空间体验补充更厚重的历史语境", "能与桥、水、寺形成更完整的文化层次"],
    image: scenicImage({
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
    shortDescription: "古运河是这片景区真正的流动背景，桥、渡口、钟声和夜泊意象都要回到这条水路上理解。",
    detail: "古运河并不是地图上的陪衬，而是枫桥景区叙事真正流动起来的主线。顺着河道看过去，桥梁、寺院、停泊与商旅往来会被串成一个整体，也让《枫桥夜泊》的情绪有了现实依托。",
    highlights: ["连接桥梁、渡口与船行意象", "是理解夜泊与钟声传播的真实媒介", "适合做整条游线的背景认知节点"],
    image: scenicImage({
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
    shortDescription: "古镇部分承接更接近日常的街巷体验，让游客从“看景点”过渡到“感受地方生活肌理”。",
    detail: "枫桥古镇的意义在于补足生活性的感受。相比桥与寺的高辨识度地标，这里更适合讲述街巷、商铺、停留节奏和地方气质，让整段游览不止停留在几个打卡点之间。",
    highlights: ["适合理解枫桥的街巷与生活感", "能承接更缓慢的步行浏览体验", "帮助景区从地标观看延伸到地方氛围"],
    image: scenicImage({
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
    shortDescription: "古戏台广场更适合承接公共活动与文化展示的想象，是景区里更具聚集感与演出感的位置。",
    detail: "古戏台广场让枫桥的文化体验从静态观看延伸到公共活动场景。它适合讲述节庆、表演、临时展演与游客停留，帮助用户理解景区也可以是被共同使用、共同观看的文化空间。",
    highlights: ["强化景区的公共活动感", "适合扩展节庆或演出内容", "是从静态风景进入公共文化空间的重要节点"],
    image: scenicImage({
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
    shortDescription: "普明宝塔为景区补充了更鲜明的垂直地标感，也让寺院文化的层次更加完整。",
    detail: "普明宝塔适合被理解为视线中的垂直锚点。相比桥和运河的水平展开，宝塔让这片区域拥有了更明显的上升感与纪念感，也为景区的宗教与历史氛围增加了另一层识别度。",
    highlights: ["提供明显的垂直地标识别", "补足寺院文化与历史层次", "适合作为景区轮廓中的视觉锚点"],
    image: scenicImage({
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
            ${time}
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
            ${preference}
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
            <strong>${stop.title}</strong>
            <p>${stop.shortDescription}</p>
          </div>
        </li>
      `
    )
    .join("");

const renderRouteInlineResult = (route) => {
  if (!routeResultInline) {
    return;
  }

  const stopSummary = route.stops
    .map((stopId) => scenicHotspots.get(stopId)?.title)
    .filter(Boolean)
    .join(" -> ");

  routeResultInline.hidden = false;
  routeResultInline.classList.remove("is-hidden");
  routeResultInline.innerHTML = `
    <div class="route-result-inline-head">
      <span class="kicker">当前推荐</span>
      <span class="route-time">${route.durationLabel}</span>
    </div>
    <h3>${route.title}</h3>
    <p class="route-result-inline-seq">${stopSummary}</p>
    <div class="route-result-inline-actions">
      <button class="button button-secondary route-detail-button" type="button" data-route-detail="${route.id}">
        查看详细路线
      </button>
    </div>
  `;
};

const openRouteModal = (route) => {
  if (!routeModalBody || !routeModal) {
    return;
  }

  activeRouteRecommendation = route;
  routeModalBody.innerHTML = `
    <article class="route-route-summary">
      <div class="route-result-head">
        <span class="kicker">${route.preference}</span>
        <span class="route-time">${route.durationLabel}</span>
      </div>
      <h3>${route.title}</h3>
      <p class="route-result-summary">${route.summary}</p>
      <p class="route-result-reason">${route.whyRecommended}</p>
    </article>
    <section class="route-sheet-section">
      <h3>推荐顺序</h3>
      <ol class="route-stop-list">
        ${buildRouteStopsMarkup(route)}
      </ol>
    </section>
    <div class="route-sheet-actions">
      <button class="button button-secondary route-map-button" type="button" data-route-scroll="map">
        按这条路线看地图
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
      <img src="${hotspot.image}" alt="${hotspot.title}景观示意图">
    </figure>
    <div class="sheet-copy">
      <p class="sheet-tag">${hotspot.tag}</p>
      <h2 id="map-modal-title">${hotspot.title}</h2>
      <p class="sheet-lead">${hotspot.shortDescription}</p>
    </div>
  </article>
  <section class="sheet-section">
    <h3>景点解读</h3>
    <p>${hotspot.detail}</p>
  </section>
  <section class="sheet-section">
    <h3>看点摘要</h3>
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
  </article>
  <section class="sheet-section">
    <h3>玩法说明</h3>
    <p>点击下方按钮，系统会随机生成一条今日签语风格的结果，让祈福体验更轻松自然地融入游览过程。</p>
    <div class="fortune-actions">
      <button class="button button-primary" type="button" data-fortune-action="draw">抽取今日福运</button>
      <button class="button button-secondary" type="button" data-fortune-action="reset">重新来过</button>
    </div>
    <div class="fortune-result" id="fortune-result">
      <strong>轻触按钮，听一声今日回响。</strong>
      <p>结果会在这里出现。</p>
    </div>
  </section>
`;

const poemTemplate = (hotspot) => `
  <article class="sheet-hero sheet-hero-soft">
    <div class="sheet-copy">
      <p class="sheet-tag">${hotspot.tag}</p>
      <h2 id="map-modal-title">${hotspot.poemTitle}</h2>
      <p class="sheet-lead">点击每一行诗句，查看它在枫桥水域语境中的意象解释，让阅读变成一次缓慢参与的过程。</p>
      <p class="poem-author">${hotspot.poemAuthor}</p>
    </div>
  </article>
  <section class="sheet-section">
    <div class="poem-lines" id="poem-lines">
      ${hotspot.poemLines
        .map(
          (item, index) => `
            <button class="poem-line ${index === 0 ? "is-active" : ""}" type="button" data-poem-index="${index}">
              ${item.line}
            </button>
          `
        )
        .join("")}
    </div>
    <div class="poem-note" id="poem-note">
      <strong>${hotspot.poemLines[0].line}</strong>
      <p>${hotspot.poemLines[0].note}</p>
    </div>
  </section>
`;

const renderModal = (hotspot) => {
  if (!mapModalBody || !mapModalKicker) {
    return;
  }

  activeHotspot = hotspot;
  mapModalKicker.textContent = hotspot.tag;

  if (hotspot.type === "scenic") {
    mapModalBody.innerHTML = scenicTemplate(hotspot);
  }

  if (hotspot.type === "game") {
    mapModalBody.innerHTML = gameTemplate(hotspot);
  }

  if (hotspot.type === "poem") {
    activePoemIndex = 0;
    mapModalBody.innerHTML = poemTemplate(hotspot);
  }

  openModal();
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
  button.type = "button";
  button.className = `map-hotspot-chip map-hotspot-${hotspot.type} is-${hotspotMode}`;
  button.setAttribute("aria-label", `打开${hotspot.title}${hotspot.tag}`);
  button.innerHTML = `
    <span class="map-hotspot-dot" aria-hidden="true"></span>
    <span class="map-hotspot-label">${hotspot.title}</span>
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
        <strong>轻触按钮，听一声今日回响。</strong>
        <p>结果会在这里出现。</p>
      `;
    }
  }

  if (target.dataset.poemIndex && activeHotspot?.type === "poem") {
    const poemIndex = Number(target.dataset.poemIndex);
    activePoemIndex = poemIndex;

    const poemButtons = document.querySelectorAll(".poem-line");
    poemButtons.forEach((button, index) => {
      button.classList.toggle("is-active", index === activePoemIndex);
    });

    const poemNote = document.querySelector("#poem-note");
    const line = activeHotspot.poemLines[activePoemIndex];

    if (poemNote && line) {
      poemNote.innerHTML = `
        <strong>${line.line}</strong>
        <p>${line.note}</p>
      `;
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

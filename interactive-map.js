const mapModal = document.querySelector("#map-modal");
const mapModalBody = document.querySelector("#map-modal-body");
const mapModalClose = document.querySelector("#map-modal-close");
const mapModalKicker = document.querySelector("#map-modal-kicker");
const mapSurface = document.querySelector("#amap-container");
const mapStatus = document.querySelector("[data-map-status]");
const mapFallback = document.querySelector("[data-map-fallback]");

const MAP_CONFIG = window.MAPLE_BRIDGE_AMAP_CONFIG || {};
const MAP_CENTER = Array.isArray(MAP_CONFIG.center) ? MAP_CONFIG.center : [120.5662, 31.3161];
const MAP_ZOOM = typeof MAP_CONFIG.zoom === "number" ? MAP_CONFIG.zoom : 15.9;
const MAP_VERSION = MAP_CONFIG.version || "2.0";
const SCENIC_BOUNDS = {
  southWest: [120.5626, 31.3062],
  northEast: [120.5668, 31.3096],
};

let mapInstance = null;
let activeHotspot = null;
let activePoemIndex = 0;

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
    position: { lng: 120.56745, lat: 31.30888 },
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
    position: { lng: 120.56915, lat: 31.31018 },
    tag: "祈福互动",
    shortDescription: "在钟声与香火意象里进行一次轻量祈愿，生成今日签语风格的福运结果。",
    intro: "寒山寺是这页中最适合做“祈愿式互动”的地点。点一下祈福按钮，让原型用一种温和、课程友好的方式给出今天的祝福回应。",
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
    position: { lng: 120.56705, lat: 31.30848 },
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
    position: { lng: 120.56818, lat: 31.30796 },
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
    position: { lng: 120.56845, lat: 31.30926 },
    tag: "景点解读",
    shortDescription: "这里适合承接“钟声到客船”的文化联想，把声音经验转化成叙事体验。",
    detail: "钟声长廊并不需要复杂的机制，就能成为文化理解的锚点。它适合放置关于寒山寺钟声、夜半回响和游客记忆的解释，让用户从“听到”的意象进入更完整的文化背景。",
    highlights: ["连接钟声、寺院与诗歌", "适合作为文化解读节点", "可扩展为声音播放或时间轴内容"],
    image: scenicImage({
      palette: ["#ead7bd", "#8f6545", "#f6e7c2"],
      title: "钟声长廊",
      subtitle: "Bell Echo"
    })
  }
];

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
    <p>点击下方按钮，系统会随机生成一条今日签语风格的结果。整个体验保持轻量，适合原型展示与移动端演示。</p>
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
  button.type = "button";
  button.className = `map-hotspot-chip map-hotspot-${hotspot.type}`;
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

    mapInstance.setBounds(scenicBounds, false, [88, 96, 88, 96]);
    mapInstance.setFitView(markers, false, [132, 160, 88, 120], MAP_ZOOM);
    mapInstance.setZoomAndCenter(Math.max(mapInstance.getZoom(), MAP_ZOOM), MAP_CENTER);

    hideMapFallback();
    setMapStatus("可点击地图热点以查看景点解读、祈福或诗意互动");
  } catch (error) {
    console.error(error);
    showMapFallback(`真实地图加载失败：${error instanceof Error ? error.message : "请检查 Key、网络或浏览器控制台"}`);
  }
};

initInteractiveMap();

document.addEventListener("click", (event) => {
  const target = event.target;

  if (!(target instanceof HTMLElement)) {
    return;
  }

  if (target.dataset.closeModal === "true" || target.id === "map-modal-close") {
    closeModal();
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
  if (event.key === "Escape" && mapModal?.classList.contains("is-open")) {
    closeModal();
  }
});

if (mapModalClose) {
  mapModalClose.addEventListener("click", closeModal);
}

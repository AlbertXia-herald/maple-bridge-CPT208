const noticeHeroAlertList = document.querySelector("#notice-hero-alert-list");
const noticeColumns = document.querySelector("#notice-columns");
const noticeTotalCount = document.querySelector("#notice-total-count");
const noticeFilterButtons = document.querySelectorAll("[data-category-filter]");
const noticeModal = document.querySelector("#notice-modal");
const noticeModalBackdrop = document.querySelector(".notice-modal-backdrop");
const noticeModalClose = document.querySelector(".notice-sheet-close");
const noticeSheetTitle = document.querySelector("#notice-sheet-title");
const noticeSheetBody = document.querySelector("#notice-sheet-body");
const noticeLang = window.MAPLE_BRIDGE_I18N?.getLanguage?.() || "zh";
const t = (value) => window.MAPLE_BRIDGE_I18N?.text?.(value) || (typeof value === "string" ? value : value.zh);

const categoryConfig = [
  { key: "community", label: { zh: "社区活动", en: "Community Events" } },
  { key: "operations", label: { zh: "景区运营", en: "Scenic Operations" } },
  { key: "service", label: { zh: "便民提醒", en: "Service Notices" } }
];

const CATEGORY_LABELS = {
  community: { zh: "社区活动", en: "Community Events" },
  operations: { zh: "景区运营", en: "Scenic Operations" },
  service: { zh: "便民提醒", en: "Service Notices" }
};

const normalizeDate = (value) => {
  const [year = "", month = "", day = ""] = String(value).split(".");
  return `${year}.${month.padStart(2, "0")}.${day.padStart(2, "0")}`;
};

const toSortValue = (value) => Number(String(value).replaceAll(".", ""));

const createNotice = ({
  id,
  category,
  date,
  title,
  detailBody,
  audience,
  status,
  sourceUrl = "",
  note = "",
}) => {
  const normalizedDate = normalizeDate(date);
  const archived = /已结束|2024年发的|年初已经结束/.test(note);

  return {
    id,
    category,
    categoryLabel: CATEGORY_LABELS[category],
    date: normalizedDate,
    sortValue: toSortValue(normalizedDate),
    title,
    summary: detailBody,
    detailBody,
    audience,
    status,
    sourceUrl,
    note,
    isArchived: archived,
  };
};

const noticeData = [
  createNotice({
    id: "nb-01",
    category: "community",
    date: "2026.4.15",
    title: "枫华社区 “阅苏州・绘童心” 亲子公益活动",
    detailBody: "共读苏州绘本，亲子共绘团扇，展现苏州古今风貌，推动家校社协同育人。",
    audience: "社区儿童及家长",
    status: { zh: "已结束", en: "Ended" },
    sourceUrl: "https://mp.weixin.qq.com/s?__biz=MzI4MzE4NjY2MA==&mid=2247573577&idx=7&sn=44f8f3917b319dfd548cbf28ffd47226&chksm=ea6b7b787f8d298ff7b5b442c82ee857ccfa2dfc9ab7cbba8568578ee467da2b89ca476cedbe&scene=27",
    note: "四月底已结束",
  }),
  createNotice({
    id: "nb-02",
    category: "community",
    date: "2026.4.19",
    title: "枫津社区痛风与关节炎健康科普义诊活动",
    detailBody: "邀请苏大附二院专家科普痛风防治知识，讲解饮食用药，提供一对一义诊咨询。",
    audience: "社区居民（中老年为主）",
    status: { zh: "已结束", en: "Ended" },
    sourceUrl: "https://mp.weixin.qq.com/s?__biz=MzI4MzE4NjY2MA==&mid=2247573577&idx=7&sn=44f8f3917b319dfd548cbf28ffd47226&chksm=ea6b7b787f8d298ff7b5b442c82ee857ccfa2dfc9ab7cbba8568578ee467da2b89ca476cedbe&scene=27",
    note: "四月底已结束",
  }),
  createNotice({
    id: "nb-03",
    category: "operations",
    date: "2024.12.2",
    title: "苏州枫桥景区限流免费开放",
    detailBody: "寒山寺听钟声跨年活动来啦，自2024年12月31日（星期二）13∶00开始，苏州枫桥景区将实行限流免费开放，瞬时流量控制在3000人以内。",
    audience: "居民与游客",
    status: { zh: "历史通知", en: "Archived Notice" },
    sourceUrl: "https://suzhou.bendibao.com/news/20241230/128011.shtm",
    note: "这个通知是2024年发的",
  }),
  createNotice({
    id: "nb-04",
    category: "operations",
    date: "2025.10.17",
    title: "关于枫桥景区建筑景观整体提升工程中标公告",
    detailBody: "枫桥景区建筑景观提升工程已于2025年10月完成招标，中标单位为苏州混凝土水泥制品研究院有限公司联合体，工期100天，若为您出行造成不便，敬请谅解。",
    audience: "居民与游客",
    status: { zh: "已归档", en: "Archived" },
    sourceUrl: "https://xunbiaobao.baidu.com/biddingDetail?id=3b9df65b140849c133a0b49032805695a0b2491e&source=seo",
    note: "这个年初已经结束了",
  }),
  createNotice({
    id: "nb-05",
    category: "service",
    date: "2026.4.27",
    title: "枫桥街道白马涧社区开展多元化便民服务活动",
    detailBody: "白马涧社区开展便民服务，提供义诊、义剪、缝补及反诈宣传体验，贴心服务送到家门口，暖民心、聚家园。",
    audience: "社区全体居民",
    status: { zh: "已发布", en: "Published" },
    sourceUrl: "https://js.news.163.com/26/0427/17/KRHOT8PT04249CU3.html",
  }),
  createNotice({
    id: "nb-06",
    category: "service",
    date: "2025.5.15",
    title: "枫桥街道便民服务中心：午间服务“不打烊”， 贴心服务暖民心",
    detailBody: "2025 年 3 月起推行午间不打烊，工作日全天服务，办理社保、医保、证件等业务，惠及上班族与老人，获居民好评。",
    audience: "街道全体居民",
    status: { zh: "已发布", en: "Published" },
    sourceUrl: "https://js.news.163.com/25/0515/17/JVK94DAA04249CU3.html",
  }),
];

let activeCategory = "all";
let activeNoticeId = null;

const getFocusNotices = () => {
  const primaryOperationsNotice = noticeData.find((item) => item.category === "operations");
  const secondaryNotices = noticeData
    .filter((item) => !item.isArchived && item.id !== primaryOperationsNotice?.id)
    .sort((a, b) => b.sortValue - a.sortValue)
    .slice(0, 1);

  return [primaryOperationsNotice, ...secondaryNotices].filter(Boolean);
};

const getNoticeTagClass = (category) => {
  if (category === "community") return "notice-tag-community";
  if (category === "operations") return "notice-tag-operations";
  return "notice-tag-service";
};

const getNoticeById = (noticeId) => noticeData.find((item) => item.id === noticeId);

const createNoticeCard = (notice, compact = false) => `
  <article class="notice-card notice-card-clickable ${compact ? "notice-card-compact" : ""}" data-notice-id="${notice.id}" tabindex="0" role="button" aria-label="${noticeLang === "en" ? `View notice details: ${t(notice.title)}` : `查看${t(notice.title)}公告详情`}">
    <div class="notice-card-meta">
      <span class="notice-tag ${getNoticeTagClass(notice.category)}">${t(notice.categoryLabel)}</span>
      <span class="notice-date">${notice.date}</span>
    </div>
    <h3>${t(notice.title)}</h3>
    <p>${t(notice.summary)}</p>
    <div class="notice-card-footer">
      <span>${noticeLang === "en" ? `Audience: ${t(notice.audience)}` : `对象：${t(notice.audience)}`}</span>
      <span class="notice-status">${t(notice.status)}</span>
    </div>
  </article>
`;

const createHeroAlertItem = (notice) => `
  <article class="notice-hero-alert-item" data-notice-id="${notice.id}" tabindex="0" role="button" aria-label="${noticeLang === "en" ? `View notice details: ${t(notice.title)}` : `查看${t(notice.title)}公告详情`}">
    <div class="notice-hero-alert-meta">
      <span class="notice-tag ${getNoticeTagClass(notice.category)}">${t(notice.categoryLabel)}</span>
      <span class="notice-date">${notice.date}</span>
    </div>
    <h3>${t(notice.title)}</h3>
    <p>${t(notice.summary)}</p>
    <div class="notice-hero-alert-footer">
      <span>${t(notice.audience)}</span>
      <span class="notice-status">${t(notice.status)}</span>
    </div>
  </article>
`;

const createNoticeDetail = (notice) => `
  <article class="notice-detail">
    <div class="notice-detail-meta">
      <span class="notice-tag ${getNoticeTagClass(notice.category)}">${t(notice.categoryLabel)}</span>
      <span class="notice-date">${notice.date}</span>
      <span class="notice-status">${t(notice.status)}</span>
    </div>
    <h3>${t(notice.title)}</h3>
    <p class="notice-detail-summary">${t(notice.detailBody)}</p>
    <div class="notice-detail-section">
      <h4>${noticeLang === "en" ? "Audience" : "适用对象"}</h4>
      <p>${t(notice.audience)}</p>
    </div>
    <div class="notice-detail-section">
      <h4>${noticeLang === "en" ? "Status" : "当前状态"}</h4>
      <p>${t(notice.status)}</p>
    </div>
    ${notice.note ? `
      <div class="notice-detail-section">
        <h4>${noticeLang === "en" ? "Note" : "说明"}</h4>
        <p>${notice.note}</p>
      </div>
    ` : ""}
    ${notice.sourceUrl ? `
      <div class="notice-detail-section">
        <h4>${noticeLang === "en" ? "Source" : "活动详情"}</h4>
        <a class="notice-detail-link" href="${notice.sourceUrl}" target="_blank" rel="noopener noreferrer">${noticeLang === "en" ? "View original notice" : "查看原文"}</a>
      </div>
    ` : ""}
  </article>
`;

const renderHeroAlerts = () => {
  if (!noticeHeroAlertList) return;
  noticeHeroAlertList.innerHTML = getFocusNotices().map((item) => createHeroAlertItem(item)).join("");
};

const renderNoticeColumns = () => {
  if (!noticeColumns) return;

  const scopedCategories = categoryConfig.filter((category) => activeCategory === "all" || activeCategory === category.key);

  noticeColumns.innerHTML = scopedCategories
    .map((category) => {
      const items = noticeData
        .filter((notice) => notice.category === category.key)
        .sort((a, b) => b.sortValue - a.sortValue);

      return `
        <section class="notice-column">
          <header class="notice-column-header">
            <h3>${t(category.label)}</h3>
            <span>${noticeLang === "en" ? `${items.length} items` : `${items.length} 条`}</span>
          </header>
          <div class="notice-list">
            ${items.map((notice) => createNoticeCard(notice)).join("")}
          </div>
        </section>
      `;
    })
    .join("");
};

const openNoticeModal = (noticeId) => {
  const notice = getNoticeById(noticeId);
  if (!notice || !noticeModal || !noticeSheetBody || !noticeSheetTitle) return;

  activeNoticeId = noticeId;
  noticeSheetTitle.textContent = t(notice.title);
  noticeSheetBody.innerHTML = createNoticeDetail(notice);
  noticeModal.classList.add("is-open");
  noticeModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("notice-modal-open");
};

const closeNoticeModal = () => {
  if (!noticeModal || !noticeSheetBody) return;

  activeNoticeId = null;
  noticeModal.classList.remove("is-open");
  noticeModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("notice-modal-open");
  noticeSheetBody.innerHTML = "";
};

const bindNoticeCardInteractions = () => {
  document.querySelectorAll("[data-notice-id]").forEach((card) => {
    card.addEventListener("click", () => {
      openNoticeModal(card.dataset.noticeId || "");
    });

    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openNoticeModal(card.dataset.noticeId || "");
      }
    });
  });
};

renderHeroAlerts();
renderNoticeColumns();
bindNoticeCardInteractions();

if (noticeTotalCount) {
  noticeTotalCount.textContent = String(noticeData.length);
}

noticeFilterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeCategory = button.dataset.categoryFilter || "all";

    noticeFilterButtons.forEach((chip) => {
      chip.classList.toggle("is-active", chip === button);
    });

    renderNoticeColumns();
    bindNoticeCardInteractions();
  });
});

noticeModalBackdrop?.addEventListener("click", closeNoticeModal);
noticeModalClose?.addEventListener("click", closeNoticeModal);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && noticeModal?.classList.contains("is-open")) {
    closeNoticeModal();
  }
});

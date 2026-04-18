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

const noticeData = [
  {
    id: "nb-01",
    title: { zh: "四月社区曲艺体验课开放报名", en: "April Community Opera Workshop Now Open for Registration" },
    category: "community",
    categoryLabel: { zh: "社区活动", en: "Community Events" },
    priority: { zh: "重要", en: "Important" },
    date: "2026.04.12",
    summary: { zh: "本月社区文化活动将开设两场曲艺体验课，面向周边居民开放预约报名，名额有限。", en: "Two community opera workshops will be held this month. Nearby residents may register in advance. Places are limited." },
    audience: { zh: "周边居民", en: "Nearby residents" },
    status: { zh: "报名中", en: "Registration Open" }
  },
  {
    id: "nb-02",
    title: { zh: "本周末景区主步道夜间照明维护", en: "Night Lighting Maintenance on Main Scenic Walkway This Weekend" },
    category: "operations",
    categoryLabel: { zh: "景区运营", en: "Scenic Operations" },
    priority: { zh: "提醒", en: "Reminder" },
    date: "2026.04.11",
    summary: { zh: "周六 19:30 至 21:00 主步道部分照明将进行维护，届时请注意临时绕行提示。", en: "Part of the main walkway lighting will be under maintenance from 19:30 to 21:00 on Saturday. Please follow temporary diversion signs." },
    audience: { zh: "居民与游客", en: "Residents and visitors" },
    status: { zh: "本周执行", en: "This Week" }
  },
  {
    id: "nb-03",
    title: { zh: "居民议事会场地调整至枫桥社区中心二层", en: "Resident Meeting Moved to Level 2 of Maple Bridge Community Center" },
    category: "service",
    categoryLabel: { zh: "便民提醒", en: "Service Notices" },
    priority: { zh: "重要", en: "Important" },
    date: "2026.04.10",
    summary: { zh: "原定在游客服务点举行的居民议事会，调整至社区中心二层多功能室，请互相转告。", en: "The resident meeting originally planned at the visitor service point has been moved to the multi-purpose room on Level 2 of the community center." },
    audience: { zh: "社区居民", en: "Community residents" },
    status: { zh: "地点已更新", en: "Venue Updated" }
  },
  {
    id: "nb-04",
    title: { zh: "非遗手作夜市志愿者招募启动", en: "Volunteer Recruitment Opens for Intangible Heritage Night Market" },
    category: "community",
    categoryLabel: { zh: "社区活动", en: "Community Events" },
    priority: { zh: "招募", en: "Recruitment" },
    date: "2026.04.09",
    summary: { zh: "面向社区青年与居民开放夜市志愿者报名，主要协助秩序引导、讲解接待与材料分发。", en: "Volunteers are being recruited from local youth and residents to support visitor guidance, reception, and material distribution." },
    audience: { zh: "青年居民", en: "Young residents" },
    status: { zh: "招募中", en: "Recruiting" }
  },
  {
    id: "nb-05",
    title: { zh: "清明后景区开放时间恢复常规安排", en: "Regular Opening Hours Resume After Qingming Holiday" },
    category: "operations",
    categoryLabel: { zh: "景区运营", en: "Scenic Operations" },
    priority: { zh: "通知", en: "Notice" },
    date: "2026.04.08",
    summary: { zh: "节后景区开放时间恢复至常规时段，请居民及周边商户按更新后的运营时间安排出行。", en: "The scenic area's opening hours return to the regular schedule after the holiday. Residents and nearby businesses are advised to plan accordingly." },
    audience: { zh: "居民与商户", en: "Residents and local businesses" },
    status: { zh: "已生效", en: "In Effect" }
  },
  {
    id: "nb-06",
    title: { zh: "本月垃圾分类入户提醒时间表发布", en: "This Month's Door-to-Door Waste Sorting Reminder Schedule Released" },
    category: "service",
    categoryLabel: { zh: "便民提醒", en: "Service Notices" },
    priority: { zh: "便民", en: "Service" },
    date: "2026.04.07",
    summary: { zh: "社区志愿者将于本月中旬进行垃圾分类入户提醒，请留意各楼栋张贴的具体安排。", en: "Community volunteers will make waste-sorting reminder visits in mid-month. Please check the notices posted in each building." },
    audience: { zh: "社区居民", en: "Community residents" },
    status: { zh: "本月安排", en: "Scheduled This Month" }
  }
];

const focusNoticeIds = ["nb-02", "nb-03", "nb-01"];
let activeCategory = "all";
let activeNoticeId = null;

const categoryConfig = [
  { key: "community", label: { zh: "社区活动", en: "Community Events" } },
  { key: "operations", label: { zh: "景区运营", en: "Scenic Operations" } },
  { key: "service", label: { zh: "便民提醒", en: "Service Notices" } }
];

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
    <p class="notice-detail-summary">${t(notice.summary)}</p>
    <div class="notice-detail-section">
      <h4>${noticeLang === "en" ? "Audience" : "适用对象"}</h4>
      <p>${t(notice.audience)}</p>
    </div>
    <div class="notice-detail-section">
      <h4>${noticeLang === "en" ? "Status" : "当前状态"}</h4>
      <p>${t(notice.status)}</p>
    </div>
  </article>
`;

const renderHeroAlerts = () => {
  if (!noticeHeroAlertList) return;

  const focusItems = focusNoticeIds
    .map((id) => noticeData.find((item) => item.id === id))
    .filter(Boolean);

  noticeHeroAlertList.innerHTML = focusItems.map((item) => createHeroAlertItem(item)).join("");
};

const renderNoticeColumns = () => {
  if (!noticeColumns) return;

  const scopedCategories = categoryConfig.filter((category) => {
    return activeCategory === "all" || activeCategory === category.key;
  });

  noticeColumns.innerHTML = scopedCategories
    .map((category) => {
      const items = noticeData.filter((notice) => notice.category === category.key);
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

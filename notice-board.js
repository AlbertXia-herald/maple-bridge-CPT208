const noticeFocusGrid = document.querySelector("#notice-focus-grid");
const noticeColumns = document.querySelector("#notice-columns");
const noticeTotalCount = document.querySelector("#notice-total-count");
const noticeFilterButtons = document.querySelectorAll("[data-category-filter]");

const noticeData = [
  {
    id: "nb-01",
    title: "四月社区曲艺体验课开放报名",
    category: "community",
    categoryLabel: "社区活动",
    priority: "重要",
    date: "2026.04.12",
    summary: "本月社区文化活动将开设两场曲艺体验课，面向周边居民开放预约报名，名额有限。",
    audience: "周边居民",
    status: "报名中"
  },
  {
    id: "nb-02",
    title: "本周末景区主步道夜间照明维护",
    category: "operations",
    categoryLabel: "景区运营",
    priority: "提醒",
    date: "2026.04.11",
    summary: "周六 19:30 至 21:00 主步道部分照明将进行维护，届时请注意临时绕行提示。",
    audience: "居民与游客",
    status: "本周执行"
  },
  {
    id: "nb-03",
    title: "居民议事会场地调整至枫桥社区中心二层",
    category: "service",
    categoryLabel: "便民提醒",
    priority: "重要",
    date: "2026.04.10",
    summary: "原定在游客服务点举行的居民议事会，调整至社区中心二层多功能室，请互相转告。",
    audience: "社区居民",
    status: "地点已更新"
  },
  {
    id: "nb-04",
    title: "非遗手作夜市志愿者招募启动",
    category: "community",
    categoryLabel: "社区活动",
    priority: "招募",
    date: "2026.04.09",
    summary: "面向社区青年与居民开放夜市志愿者报名，主要协助秩序引导、讲解接待与材料分发。",
    audience: "青年居民",
    status: "招募中"
  },
  {
    id: "nb-05",
    title: "清明后景区开放时间恢复常规安排",
    category: "operations",
    categoryLabel: "景区运营",
    priority: "通知",
    date: "2026.04.08",
    summary: "节后景区开放时间恢复至常规时段，请居民及周边商户按更新后的运营时间安排出行。",
    audience: "居民与商户",
    status: "已生效"
  },
  {
    id: "nb-06",
    title: "本月垃圾分类入户提醒时间表发布",
    category: "service",
    categoryLabel: "便民提醒",
    priority: "便民",
    date: "2026.04.07",
    summary: "社区志愿者将于本月中旬进行垃圾分类入户提醒，请留意各楼栋张贴的具体安排。",
    audience: "社区居民",
    status: "本月安排"
  }
];

const focusNoticeIds = ["nb-02", "nb-03", "nb-01"];
let activeCategory = "all";

const categoryConfig = [
  { key: "community", label: "社区活动" },
  { key: "operations", label: "景区运营" },
  { key: "service", label: "便民提醒" }
];

const getNoticeTagClass = (category) => {
  if (category === "community") return "notice-tag-community";
  if (category === "operations") return "notice-tag-operations";
  return "notice-tag-service";
};

const createNoticeCard = (notice, compact = false) => `
  <article class="notice-card ${compact ? "notice-card-compact" : ""}">
    <div class="notice-card-meta">
      <span class="notice-tag ${getNoticeTagClass(notice.category)}">${notice.categoryLabel}</span>
      <span class="notice-date">${notice.date}</span>
    </div>
    <h3>${notice.title}</h3>
    <p>${notice.summary}</p>
    <div class="notice-card-footer">
      <span>对象：${notice.audience}</span>
      <span class="notice-status">${notice.status}</span>
    </div>
  </article>
`;

const renderFocusNotices = () => {
  if (!noticeFocusGrid) return;

  const focusItems = focusNoticeIds
    .map((id) => noticeData.find((item) => item.id === id))
    .filter(Boolean);

  noticeFocusGrid.innerHTML = focusItems.map((item) => createNoticeCard(item, true)).join("");
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
            <h3>${category.label}</h3>
            <span>${items.length} 条</span>
          </header>
          <div class="notice-list">
            ${items.map((notice) => createNoticeCard(notice)).join("")}
          </div>
        </section>
      `;
    })
    .join("");
};

renderFocusNotices();
renderNoticeColumns();

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
  });
});

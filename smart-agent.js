const smartKnowledge = window.smartMapleBridgeKnowledge || null;

const resolveAssistantResponse = (query) => {
  if (!smartKnowledge) {
    return null;
  }

  const normalized = query.trim();
  return (
    smartKnowledge.responses[normalized] ||
    smartKnowledge.responses["今天怎么玩"] && /今天|推荐|路线/.test(normalized) && smartKnowledge.responses["今天怎么玩"] ||
    /居民|公告|社区/.test(normalized) && smartKnowledge.responses["适合居民的信息"] ||
    /照片|拍照|氛围/.test(normalized) && smartKnowledge.responses["我想拍照和看氛围"] ||
    /了解|介绍|看懂|枫桥/.test(normalized) && smartKnowledge.responses["我想快速看懂枫桥"] ||
    smartKnowledge.fallback
  );
};

const createAssistantMarkup = (mode = "page") => {
  if (!smartKnowledge) {
    return "";
  }

  const actions = smartKnowledge.quickActions
    .map(
      (item) => `
        <button class="assistant-quick-action" type="button" data-assistant-action="${item}">
          ${item}
        </button>
      `
    )
    .join("");

  return `
    <section class="assistant-shell assistant-shell-${mode}">
      <header class="assistant-intro">
        <p class="eyebrow">Smart Maple Bridge</p>
        <h2>${smartKnowledge.greeting.title}</h2>
        <p>${smartKnowledge.greeting.helper}</p>
      </header>

      <div class="assistant-layout">
        <section class="assistant-actions-panel" aria-label="快捷问题">
          <h3>快捷问题</h3>
          <div class="assistant-quick-grid">
            ${actions}
          </div>
          <form class="assistant-input-form" data-assistant-form="true">
            <label class="assistant-input-label" for="assistant-input-${mode}">试着问一句</label>
            <div class="assistant-input-row">
              <input id="assistant-input-${mode}" class="assistant-input" type="text" name="assistantQuery" placeholder="例如：今天怎么玩 或 适合居民的信息">
              <button class="button button-primary assistant-submit" type="submit">发送</button>
            </div>
          </form>
        </section>

        <section class="assistant-response-panel" aria-live="polite">
          <div class="assistant-response-card" data-assistant-response="true">
            <p class="assistant-response-kicker">建议从这里开始</p>
            <h3>${smartKnowledge.responses["今日推荐路线"].title}</h3>
            <p>${smartKnowledge.responses["今日推荐路线"].text}</p>
            <div class="assistant-response-links">
              ${smartKnowledge.responses["今日推荐路线"].links
                .map((link) => `<a class="assistant-link-chip" href="${link.href}">${link.label}</a>`)
                .join("")}
            </div>
          </div>
        </section>
      </div>
    </section>
  `;
};

const updateAssistantResponse = (root, query) => {
  if (!root || !smartKnowledge) {
    return;
  }

  const target = root.querySelector("[data-assistant-response='true']");
  const response = resolveAssistantResponse(query);

  if (!target || !response) {
    return;
  }

  target.innerHTML = `
    <p class="assistant-response-kicker">智能枫桥建议</p>
    <h3>${response.title}</h3>
    <p>${response.text}</p>
    <div class="assistant-response-links">
      ${response.links.map((link) => `<a class="assistant-link-chip" href="${link.href}">${link.label}</a>`).join("")}
    </div>
  `;
};

const bindAssistantInteractions = (root) => {
  if (!root) {
    return;
  }

  root.querySelectorAll("[data-assistant-action]").forEach((button) => {
    button.addEventListener("click", () => {
      updateAssistantResponse(root, button.dataset.assistantAction || "");
    });
  });

  const form = root.querySelector("[data-assistant-form='true']");
  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const formData = new FormData(form);
      const query = String(formData.get("assistantQuery") || "").trim();
      updateAssistantResponse(root, query || smartKnowledge.fallback.title);
    });
  }
};

const pageAssistantRoot = document.querySelector("#smart-agent-page-root");
if (pageAssistantRoot) {
  pageAssistantRoot.innerHTML = createAssistantMarkup("page");
  bindAssistantInteractions(pageAssistantRoot);
}

const assistantModal = document.querySelector("#assistant-modal");
const assistantModalRoot = document.querySelector("#assistant-modal-root");

const openAssistant = () => {
  if (!assistantModal || !assistantModalRoot) {
    return;
  }

  if (!assistantModalRoot.innerHTML.trim()) {
    assistantModalRoot.innerHTML = createAssistantMarkup("modal");
    bindAssistantInteractions(assistantModalRoot);
  }

  assistantModal.classList.add("is-open");
  assistantModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("assistant-open");
};

const closeAssistant = () => {
  if (!assistantModal) {
    return;
  }

  assistantModal.classList.remove("is-open");
  assistantModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("assistant-open");
};

document.querySelectorAll("[data-open-assistant]").forEach((button) => {
  button.addEventListener("click", openAssistant);
});

document.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }

  if (target.dataset.closeAssistant === "true") {
    closeAssistant();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && assistantModal?.classList.contains("is-open")) {
    closeAssistant();
  }
});

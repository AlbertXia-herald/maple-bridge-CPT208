const assistantLanguage = window.MAPLE_BRIDGE_I18N?.getLanguage?.() || "zh";
const smartKnowledgeBundle = window.smartMapleBridgeKnowledge || null;
const smartKnowledge = smartKnowledgeBundle?.[assistantLanguage] || null;

const assistantCopy = {
  zh: {
    eyebrow: "Fengying Fengqiao Guide",
    quickQuestions: "快捷问题",
    askLabel: "试着问一句",
    placeholder: "例如：今天怎么玩 或 路线推荐",
    send: "发送",
    starter: "建议从这里开始",
    suggestion: "智能枫桥建议"
  },
  en: {
    eyebrow: "Fengying Fengqiao Guide",
    quickQuestions: "Quick Questions",
    askLabel: "Ask something",
    placeholder: "For example: What should I do today?",
    send: "Send",
    starter: "Start here",
    suggestion: "Smart suggestion"
  }
};

const copy = assistantCopy[assistantLanguage];
const featuredResponse = smartKnowledge?.responses["今日推荐路线"] || smartKnowledge?.responses["Today's suggested route"] || smartKnowledge?.fallback;

const resolveAssistantResponse = (query) => {
  if (!smartKnowledge) {
    return null;
  }

  const normalized = query.trim();
  const lower = normalized.toLowerCase();

  return (
    smartKnowledge.responses[normalized] ||
    (assistantLanguage === "zh" && smartKnowledge.responses["今天怎么玩"] && /今天|推荐|路线/.test(normalized) && smartKnowledge.responses["今天怎么玩"]) ||
    (assistantLanguage === "zh" && /居民|公告|社区/.test(normalized) && smartKnowledge.responses["适合居民的信息"]) ||
    (assistantLanguage === "zh" && /照片|拍照|氛围/.test(normalized) && smartKnowledge.responses["我想拍照和看氛围"]) ||
    (assistantLanguage === "zh" && /了解|介绍|看懂|枫桥/.test(normalized) && smartKnowledge.responses["我想快速看懂枫桥"]) ||
    (assistantLanguage === "en" && /today|route|plan/.test(lower) && smartKnowledge.responses["What should I do today?"]) ||
    (assistantLanguage === "en" && /resident|notice|community/.test(lower) && smartKnowledge.responses["Info for residents"]) ||
    (assistantLanguage === "en" && /photo|atmosphere|mood/.test(lower) && smartKnowledge.responses["I want photos and atmosphere"]) ||
    (assistantLanguage === "en" && /learn|overview|bridge/.test(lower) && smartKnowledge.responses["Learn about Maple Bridge"]) ||
    smartKnowledge.fallback
  );
};

const createAssistantMarkup = (mode = "page") => {
  if (!smartKnowledge || !featuredResponse) {
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
        <p class="eyebrow">${copy.eyebrow}</p>
        <h2>${smartKnowledge.greeting.title}</h2>
        <p>${smartKnowledge.greeting.helper}</p>
      </header>

      <div class="assistant-layout">
        <section class="assistant-actions-panel" aria-label="${copy.quickQuestions}">
          <h3>${copy.quickQuestions}</h3>
          <div class="assistant-quick-grid">
            ${actions}
          </div>
          <form class="assistant-input-form" data-assistant-form="true">
            <label class="assistant-input-label" for="assistant-input-${mode}">${copy.askLabel}</label>
            <div class="assistant-input-row">
              <input id="assistant-input-${mode}" class="assistant-input" type="text" name="assistantQuery" placeholder="${copy.placeholder}">
              <button class="button button-primary assistant-submit" type="submit">${copy.send}</button>
            </div>
          </form>
        </section>

        <section class="assistant-response-panel" aria-live="polite">
          <div class="assistant-response-card" data-assistant-response="true">
            <p class="assistant-response-kicker">${copy.starter}</p>
            <h3>${featuredResponse.title}</h3>
            <p>${featuredResponse.text}</p>
            <div class="assistant-response-links">
              ${featuredResponse.links.map((link) => `<a class="assistant-link-chip" href="${link.href}">${link.label}</a>`).join("")}
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
    <p class="assistant-response-kicker">${copy.suggestion}</p>
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

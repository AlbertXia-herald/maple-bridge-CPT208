(function () {
  const knowledgeBundle = window.smartMapleBridgeFaq || null;

  const assistantUiCopy = {
    zh: {
      categoryTitle: "问题分类",
      hotTitle: "热门问题",
      browseTitle: "快速发问",
      askLabel: "输入你的问题",
      placeholder: "例如：怎么去枫桥景区？",
      send: "发送",
      agentName: "智能枫桥",
      you: "你",
      categoryTag: "所属分类",
      relatedTitle: "你也可以继续问",
      linksTitle: "相关入口",
      welcomeTitle: "先从常见问题开始",
      welcomeText: "你可以直接点击问题，也可以自己输入一句。我会优先在本地 FAQ 里匹配最接近的答案。",
      noKnowledge: "FAQ 数据暂时未加载。",
      allCategory: "全部问题"
    },
    en: {
      categoryTitle: "Categories",
      hotTitle: "Popular Questions",
      browseTitle: "Quick Ask",
      askLabel: "Type your question",
      placeholder: "For example: How to get there?",
      send: "Send",
      agentName: "Smart Maple Bridge",
      you: "You",
      categoryTag: "Category",
      relatedTitle: "You can also ask",
      linksTitle: "Helpful links",
      welcomeTitle: "Start with a common question",
      welcomeText: "You can click a question directly or type your own. I will match it against the local FAQ knowledge base first.",
      noKnowledge: "The FAQ knowledge base is not available right now.",
      allCategory: "All Topics"
    }
  };

  const getLanguage = () => window.MAPLE_BRIDGE_I18N?.getLanguage?.() || "zh";

  const getBundle = () => {
    const language = getLanguage();
    return {
      language,
      knowledge: knowledgeBundle?.[language] || null,
      copy: assistantUiCopy[language] || assistantUiCopy.zh
    };
  };

  const escapeHtml = (value) =>
    String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");

  const normalizeText = (value, language) => {
    const raw = String(value || "").trim().toLowerCase();
    if (!raw) {
      return "";
    }

    const compact = raw
      .replace(/[？?！!。.,，、；;:“”"'‘’（）()\-_/\\]/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    if (language === "zh") {
      return compact
        .replace(/^请问\s*/g, "")
        .replace(/\s*可以吗$/g, "")
        .replace(/\s*吗$/g, "")
        .replace(/\s*呢$/g, "")
        .replace(/\s*呀$/g, "")
        .replace(/\s*一下$/g, "")
        .trim();
    }

    return compact
      .replace(/^please\s+/g, "")
      .replace(/^can you\s+/g, "")
      .replace(/^could you\s+/g, "")
      .trim();
  };

  const buildWelcomeMessage = (bundle) => ({
    type: "bot",
    title: bundle.copy.welcomeTitle,
    answer: bundle.copy.welcomeText,
    categoryLabel: bundle.copy.allCategory,
    links: [],
    suggestedQuestions: bundle.knowledge?.fixedSuggestions || []
  });

  const scoreFaq = (query, faq, language) => {
    const normalizedQuery = normalizeText(query, language);
    const normalizedQuestion = normalizeText(faq.question, language);
    const normalizedCategory = normalizeText(faq.categoryLabel, language);

    if (!normalizedQuery || !normalizedQuestion) {
      return 0;
    }

    if (normalizedQuery === normalizedQuestion) {
      return 1000 + (faq.hot ? 1 : 0);
    }

    let score = 0;

    if (normalizedQuestion.includes(normalizedQuery) || normalizedQuery.includes(normalizedQuestion)) {
      score += 18;
    }

    if (normalizedCategory && normalizedQuery.includes(normalizedCategory)) {
      score += 4;
    }

    faq.keywords.forEach((keyword) => {
      const normalizedKeyword = normalizeText(keyword, language);
      if (!normalizedKeyword) {
        return;
      }

      if (normalizedQuery === normalizedKeyword) {
        score += 12;
        return;
      }

      if (normalizedQuery.includes(normalizedKeyword) || normalizedKeyword.includes(normalizedQuery)) {
        score += 7;
      }
    });

    if (faq.hot) {
      score += 1;
    }

    return score;
  };

  const resolveFaq = (query, bundle, activeCategory = "all") => {
    const { knowledge, language } = bundle;
    const normalizedQuery = normalizeText(query, language);

    if (!knowledge || !normalizedQuery) {
      return {
        matched: false,
        payload: {
          title: knowledge?.fallback.title || bundle.copy.noKnowledge,
          answer: knowledge?.fallback.answer || bundle.copy.noKnowledge,
          categoryLabel: bundle.copy.allCategory,
          links: [],
          suggestedQuestions: knowledge?.fallback.suggestedQuestions || knowledge?.fixedSuggestions || []
        }
      };
    }

    const faqs = activeCategory === "all"
      ? knowledge.faqs
      : knowledge.faqs.filter((faq) => faq.category === activeCategory);

    const scoredFaqs = faqs
      .map((faq) => ({ faq, score: scoreFaq(normalizedQuery, faq, language) }))
      .sort((left, right) => right.score - left.score);

    const best = scoredFaqs[0];

    if (!best || best.score < 7) {
      return {
        matched: false,
        payload: {
          title: knowledge.fallback.title,
          answer: knowledge.fallback.answer,
          categoryLabel: bundle.copy.allCategory,
          links: [],
          suggestedQuestions: knowledge.fallback.suggestedQuestions
        }
      };
    }

    return {
      matched: true,
      payload: {
        title: best.faq.question,
        answer: best.faq.answer,
        categoryLabel: best.faq.categoryLabel,
        links: best.faq.links || [],
        suggestedQuestions: best.faq.suggestedQuestions || []
      }
    };
  };

  const getFilteredFaqs = (knowledge, category) => {
    if (!knowledge) {
      return [];
    }

    return category === "all"
      ? knowledge.faqs
      : knowledge.faqs.filter((faq) => faq.category === category);
  };

  const renderQuestionChips = (questions, attribute) =>
    questions
      .map(
        (question) => `
          <button class="assistant-suggested-chip" type="button" ${attribute}="${escapeHtml(question)}">
            ${escapeHtml(question)}
          </button>
        `
      )
      .join("");

  const createAssistantMarkup = (bundle, mode = "page") => {
    if (!bundle.knowledge) {
      return `<section class="assistant-shell assistant-shell-${mode}"><p>${escapeHtml(bundle.copy.noKnowledge)}</p></section>`;
    }

    return `
      <section class="assistant-shell assistant-shell-${mode}">
        <header class="assistant-intro">
          <p class="eyebrow">${escapeHtml(bundle.knowledge.intro.eyebrow)}</p>
          <h2>${escapeHtml(bundle.knowledge.intro.title)}</h2>
          <p>${escapeHtml(bundle.knowledge.intro.helper)}</p>
        </header>

        <div class="assistant-layout">
          <section class="assistant-actions-panel" aria-label="${escapeHtml(bundle.copy.categoryTitle)}">
            <div class="assistant-category-block">
              <div class="assistant-block-head">
                <h3>${escapeHtml(bundle.copy.categoryTitle)}</h3>
              </div>
              <div class="assistant-category-bar" data-assistant-categories="true"></div>
            </div>

            <div class="assistant-hot-section">
              <div class="assistant-block-head">
                <h3>${escapeHtml(bundle.copy.hotTitle)}</h3>
              </div>
              <div class="assistant-hot-list" data-assistant-hot="true"></div>
            </div>

            <form class="assistant-input-form" data-assistant-form="true">
              <label class="assistant-input-label" for="assistant-input-${mode}">${escapeHtml(bundle.copy.askLabel)}</label>
              <div class="assistant-input-row">
                <input
                  id="assistant-input-${mode}"
                  class="assistant-input"
                  type="text"
                  name="assistantQuery"
                  placeholder="${escapeHtml(bundle.copy.placeholder)}"
                  autocomplete="off"
                >
                <button class="button button-primary assistant-submit" type="submit">${escapeHtml(bundle.copy.send)}</button>
              </div>
            </form>

            <div class="assistant-suggestion-section">
              <div class="assistant-block-head">
                <h3>${escapeHtml(bundle.copy.browseTitle)}</h3>
              </div>
              <div class="assistant-suggested-list" data-assistant-suggestions="true"></div>
            </div>
          </section>

          <section class="assistant-chat-panel" aria-live="polite" aria-label="${escapeHtml(bundle.copy.agentName)}">
            <div class="assistant-chat-thread" data-assistant-thread="true"></div>
          </section>
        </div>
      </section>
    `;
  };

  const renderCategories = (state) => {
    const categoriesRoot = state.root.querySelector("[data-assistant-categories='true']");
    if (!categoriesRoot || !state.bundle.knowledge) {
      return;
    }

    categoriesRoot.innerHTML = state.bundle.knowledge.categories
      .map(
        (category) => `
          <button
            class="assistant-category-chip${state.activeCategory === category.key ? " is-active" : ""}"
            type="button"
            data-assistant-category="${escapeHtml(category.key)}"
          >
            ${escapeHtml(category.label)}
          </button>
        `
      )
      .join("");
  };

  const renderHotQuestions = (state) => {
    const hotRoot = state.root.querySelector("[data-assistant-hot='true']");
    if (!hotRoot || !state.bundle.knowledge) {
      return;
    }

    const filteredFaqs = getFilteredFaqs(state.bundle.knowledge, state.activeCategory);
    const hotFaqs = filteredFaqs.filter((faq) => faq.hot).slice(0, 4);
    const fallbackFaqs = filteredFaqs.slice(0, 4);
    const visibleFaqs = (hotFaqs.length ? hotFaqs : fallbackFaqs).slice(0, 4);

    hotRoot.innerHTML = visibleFaqs
      .map(
        (faq) => `
          <button class="assistant-hot-card" type="button" data-assistant-question="${escapeHtml(faq.question)}">
            <span class="assistant-hot-card-tag">${escapeHtml(faq.categoryLabel)}</span>
            <strong>${escapeHtml(faq.question)}</strong>
          </button>
        `
      )
      .join("");
  };

  const renderSuggestionBank = (state) => {
    const suggestionRoot = state.root.querySelector("[data-assistant-suggestions='true']");
    if (!suggestionRoot || !state.bundle.knowledge) {
      return;
    }

    const questions = state.activeCategory === "all"
      ? state.bundle.knowledge.fixedSuggestions
      : getFilteredFaqs(state.bundle.knowledge, state.activeCategory).slice(0, 6).map((faq) => faq.question);

    suggestionRoot.innerHTML = renderQuestionChips(questions, "data-assistant-question");
  };

  const renderThread = (state) => {
    const threadRoot = state.root.querySelector("[data-assistant-thread='true']");
    if (!threadRoot) {
      return;
    }

    const bundle = state.bundle;

    threadRoot.innerHTML = state.thread
      .map((message) => {
        if (message.type === "user") {
          return `
            <article class="assistant-message assistant-message-user">
              <p class="assistant-message-role">${escapeHtml(bundle.copy.you)}</p>
              <p class="assistant-message-text">${escapeHtml(message.text)}</p>
            </article>
          `;
        }

        const linksMarkup = message.links?.length
          ? `
              <div class="assistant-message-links">
                <p class="assistant-message-subtitle">${escapeHtml(bundle.copy.linksTitle)}</p>
                <div class="assistant-response-links">
                  ${message.links
                    .map(
                      (link) => `
                        <a class="assistant-link-chip" href="${escapeHtml(link.href)}">${escapeHtml(link.label)}</a>
                      `
                    )
                    .join("")}
                </div>
              </div>
            `
          : "";

        const suggestedMarkup = message.suggestedQuestions?.length
          ? `
              <div class="assistant-message-suggestions">
                <p class="assistant-message-subtitle">${escapeHtml(bundle.copy.relatedTitle)}</p>
                <div class="assistant-suggested-list">
                  ${renderQuestionChips(message.suggestedQuestions, "data-assistant-question")}
                </div>
              </div>
            `
          : "";

        return `
          <article class="assistant-message assistant-message-bot">
            <p class="assistant-message-role">${escapeHtml(bundle.copy.agentName)}</p>
            <h3>${escapeHtml(message.title)}</h3>
            <p class="assistant-message-text">${escapeHtml(message.answer)}</p>
            <div class="assistant-message-meta">
              <span class="assistant-answer-tag">${escapeHtml(bundle.copy.categoryTag)}: ${escapeHtml(message.categoryLabel)}</span>
            </div>
            ${linksMarkup}
            ${suggestedMarkup}
          </article>
        `;
      })
      .join("");

    threadRoot.scrollTop = threadRoot.scrollHeight;
  };

  const renderAssistant = (state) => {
    renderCategories(state);
    renderHotQuestions(state);
    renderSuggestionBank(state);
    renderThread(state);
  };

  const sendQuestion = (state, question) => {
    const trimmedQuestion = String(question || "").trim();
    if (!trimmedQuestion) {
      return;
    }

    const result = resolveFaq(trimmedQuestion, state.bundle, "all");

    state.thread.push({
      type: "user",
      text: trimmedQuestion
    });

    state.thread.push({
      type: "bot",
      title: result.payload.title,
      answer: result.payload.answer,
      categoryLabel: result.payload.categoryLabel,
      links: result.payload.links,
      suggestedQuestions: result.payload.suggestedQuestions
    });

    renderThread(state);

    const input = state.root.querySelector(".assistant-input");
    if (input instanceof HTMLInputElement) {
      input.value = "";
      input.focus();
    }
  };

  const bindAssistantInteractions = (state) => {
    const form = state.root.querySelector("[data-assistant-form='true']");
    if (form) {
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        const formData = new FormData(form);
        sendQuestion(state, formData.get("assistantQuery"));
      });
    }

    state.root.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) {
        return;
      }

      const categoryButton = target.closest("[data-assistant-category]");
      if (categoryButton instanceof HTMLElement) {
        state.activeCategory = categoryButton.dataset.assistantCategory || "all";
        renderAssistant(state);
        return;
      }

      const questionButton = target.closest("[data-assistant-question]");
      if (questionButton instanceof HTMLElement) {
        sendQuestion(state, questionButton.dataset.assistantQuestion || "");
      }
    });
  };

  const setupAssistant = (root, mode) => {
    const bundle = getBundle();
    if (!root || !bundle.knowledge) {
      return null;
    }

    root.innerHTML = createAssistantMarkup(bundle, mode);

    const state = {
      root,
      mode,
      bundle,
      activeCategory: "all",
      thread: [buildWelcomeMessage(bundle)]
    };

    bindAssistantInteractions(state);
    renderAssistant(state);
    return state;
  };

  const pageAssistantRoot = document.querySelector("#smart-agent-page-root");
  if (pageAssistantRoot) {
    setupAssistant(pageAssistantRoot, "page");
  }

  const assistantModal = document.querySelector("#assistant-modal");
  const assistantModalRoot = document.querySelector("#assistant-modal-root");
  let modalAssistantState = null;

  const openAssistant = () => {
    if (!assistantModal || !assistantModalRoot) {
      return;
    }

    if (!modalAssistantState) {
      modalAssistantState = setupAssistant(assistantModalRoot, "modal");
    }

    assistantModal.classList.add("is-open");
    assistantModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("assistant-open");

    const input = assistantModalRoot.querySelector(".assistant-input");
    if (input instanceof HTMLInputElement) {
      window.setTimeout(() => input.focus(), 40);
    }
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
})();

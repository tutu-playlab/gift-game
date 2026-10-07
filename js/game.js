(() => {
  const data = window.GIFT_GAME_DATA;
  const INITIAL_SCORE = 30;
  const DAY_COUNT_DURATION = 800;
  const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;
  const state = {
    currentIndex: 0,
    generalEventIndex: 0,
    nextRingAt: 0,
    score: INITIAL_SCORE,
    mineCount: 0,
    godGiftCount: 0,
    options: [],
    recentOptionIds: [],
    history: [],
    isTransitioning: false,
    pendingEnding: null,
    reactionTimer: null,
    nextEventTimer: null,
    dayCountAnimationFrame: null
  };

  const elements = {
    intro: document.querySelector("#introScreen"),
    game: document.querySelector("#gameScreen"),
    ending: document.querySelector("#endingScreen"),
    start: document.querySelector("#startButton"),
    playAgain: document.querySelector("#playAgainButton"),
    icon: document.querySelector("#eventIcon"),
    days: document.querySelector("#relationshipDays"),
    lead: document.querySelector("#eventLead"),
    title: document.querySelector("#eventTitle"),
    prompt: document.querySelector("#eventPrompt"),
    eventCard: document.querySelector(".event-card"),
    grid: document.querySelector("#giftGrid"),
    score: document.querySelector("#relationshipScore"),
    meter: document.querySelector("#relationshipMeter"),
    meterFill: document.querySelector("#relationshipMeterFill"),
    meterGlint: document.querySelector("#meterGlint"),
    reaction: document.querySelector("#girlfriendReaction"),
    boyfriendPanel: document.querySelector(".boyfriend-thought"),
    boyfriendThought: document.querySelector("#boyfriendThought"),
    endingScore: document.querySelector("#endingScore"),
    endingTitle: document.querySelector("#endingTitle"),
    endingDescription: document.querySelector("#endingDescription"),
    mineCount: document.querySelector("#mineCount"),
    godGiftCount: document.querySelector("#godGiftCount"),
    mineCountBar: document.querySelector("#mineCountBar"),
    godGiftCountBar: document.querySelector("#godGiftCountBar")
  };

  function clearTransitionTimers() {
    window.clearTimeout(state.reactionTimer);
    window.clearTimeout(state.nextEventTimer);
    window.cancelAnimationFrame(state.dayCountAnimationFrame);
    state.reactionTimer = null;
    state.nextEventTimer = null;
    state.dayCountAnimationFrame = null;
  }

  function shuffle(items) {
    const result = [...items];
    for (let index = result.length - 1; index > 0; index -= 1) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      [result[index], result[randomIndex]] = [result[randomIndex], result[index]];
    }
    return result;
  }

  function randomRingInterval() {
    return 2 + Math.floor(Math.random() * 2);
  }

  function currentEvent() {
    return data.events[state.currentIndex];
  }

  function relationshipDay(eventDate) {
    const startTime = Date.parse(`${data.relationshipStartDate}T00:00:00Z`);
    const eventTime = Date.parse(`${eventDate}T00:00:00Z`);
    return Math.floor((eventTime - startTime) / MILLISECONDS_PER_DAY) + 1;
  }

  function animateRelationshipDays(startDay, targetDay) {
    window.cancelAnimationFrame(state.dayCountAnimationFrame);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      elements.days.textContent = targetDay;
      state.dayCountAnimationFrame = null;
      return;
    }

    const startedAt = window.performance.now();
    elements.days.textContent = startDay;

    function updateDayCount(now) {
      const progress = Math.min((now - startedAt) / DAY_COUNT_DURATION, 1);
      elements.days.textContent = Math.floor(startDay + (targetDay - startDay) * progress);

      if (progress < 1) {
        state.dayCountAnimationFrame = window.requestAnimationFrame(updateDayCount);
        return;
      }

      elements.days.textContent = targetDay;
      state.dayCountAnimationFrame = null;
    }

    state.dayCountAnimationFrame = window.requestAnimationFrame(updateDayCount);
  }

  function rememberOptions(options) {
    state.recentOptionIds.push(options.filter((gift) => !gift.isRing).map((gift) => gift.id));
    state.recentOptionIds = state.recentOptionIds.slice(-2);
  }

  function createGeneralOptions() {
    const blockedIds = new Set(state.recentOptionIds.flat());
    const available = data.generalGifts.filter((gift) => !blockedIds.has(gift.id));
    const positive = shuffle(available.filter((gift) => gift.score > 0))[0];
    const negative = shuffle(available.filter((gift) => gift.score < 0))[0];
    const chosen = [positive, negative];
    const generalEventNumber = state.generalEventIndex + 1;

    if (generalEventNumber === state.nextRingAt) {
      chosen.push(data.ringGift);
      state.nextRingAt += randomRingInterval();
    }

    const chosenIds = new Set(chosen.map((gift) => gift.id));
    const remaining = shuffle(available.filter((gift) => !chosenIds.has(gift.id)));
    chosen.push(...remaining.slice(0, 4 - chosen.length));
    return shuffle(chosen);
  }

  function createOptions(event) {
    const options = event.isTokyo ? shuffle(data.tokyoGifts) : createGeneralOptions();
    rememberOptions(options);
    return options;
  }

  function renderOptions() {
    elements.grid.replaceChildren();
    state.options.forEach((gift) => {
      const button = document.createElement("button");
      button.className = "gift-option";
      button.type = "button";
      button.dataset.giftId = gift.id;
      button.setAttribute("aria-pressed", "false");
      button.textContent = gift.label;
      button.addEventListener("click", () => selectGift(button, gift));
      elements.grid.append(button);
    });
  }

  function meterVisualWidth(score) {
    return score === 0 ? "0%" : `calc(${score}% + 6px)`;
  }

  function setMeterVisualScore(score) {
    elements.meterFill.style.setProperty("--meter-value", meterVisualWidth(score));
  }

  function renderScore({ updateVisual = true } = {}) {
    elements.score.textContent = state.score;
    elements.meter.value = state.score;
    elements.meter.textContent = `${state.score} / 100`;
    elements.meter.setAttribute("aria-valuetext", `${state.score} / 100`);
    if (updateVisual) setMeterVisualScore(state.score);
    elements.meterGlint.classList.toggle("hidden", state.score === 0);
  }

  function playReactionAnimations(previousScore) {
    elements.reaction.classList.remove("reaction-entering");
    elements.meterFill.classList.remove("meter-changing");
    elements.meterFill.style.setProperty("--meter-from", meterVisualWidth(previousScore));
    elements.meterFill.style.setProperty("--meter-to", meterVisualWidth(state.score));
    elements.meterFill.style.setProperty("--meter-value", meterVisualWidth(state.score));
    elements.reaction.classList.remove("hidden");

    void elements.reaction.offsetWidth;

    elements.reaction.classList.add("reaction-entering");
    if (previousScore !== state.score) elements.meterFill.classList.add("meter-changing");
  }

  function playQuestionEntryAnimations() {
    elements.eventCard.classList.remove("question-entering");
    elements.grid.classList.remove("options-entering");
    elements.boyfriendPanel.classList.remove("options-entering");

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    void elements.eventCard.offsetWidth;

    elements.eventCard.classList.add("question-entering");
    elements.grid.classList.add("options-entering");
    elements.boyfriendPanel.classList.add("options-entering");
  }

  function renderEvent() {
    clearTransitionTimers();
    state.isTransitioning = false;
    state.pendingEnding = null;
    const event = currentEvent();
    const previousDay = state.currentIndex === 0
      ? 0
      : relationshipDay(data.events[state.currentIndex - 1].date);
    elements.icon.setAttribute("aria-label", `${event.title}的女友角色`);
    animateRelationshipDays(previousDay, relationshipDay(event.date));
    elements.lead.textContent = event.isTokyo ? "這次是" : "下禮拜是";
    elements.title.textContent = event.title;
    elements.prompt.textContent = event.isTokyo ? "出差回來，要帶什麼給她?" : "你準備送什麼禮物呢?";
    elements.reaction.classList.add("hidden");
    elements.reaction.classList.remove("reaction-entering");
    elements.meterFill.classList.remove("meter-changing");
    elements.reaction.textContent = "";
    elements.boyfriendThought.textContent = data.boyfriendThinkingText;
    renderScore();
    state.options = createOptions(event);
    renderOptions();
    playQuestionEntryAnimations();
    window.scrollTo(0, 0);
  }

  function scoreResult(gift) {
    if (gift.isRing) {
      if (state.score > 90) return { change: 0, ending: "proposal", reactionType: "positive" };
      if (state.score < 60) return { change: 0, ending: "breakup", reactionType: "negative" };
      return { change: -10, reactionType: "negative" };
    }

    const reactionType = gift.score > 0 ? "positive" : gift.score < 0 ? "negative" : "neutral";
    return { change: gift.score, reactionType };
  }

  function formatChange(change, gift) {
    if (gift.isRing && state.pendingEnding === "proposal") return "求婚成功！";
    if (gift.isRing && state.pendingEnding === "breakup") return "關係直接破裂";
    return `關係值 ${change > 0 ? "+" : ""}${change}`;
  }

  function selectGift(button, gift) {
    if (state.isTransitioning) return;
    state.isTransitioning = true;

    elements.grid.querySelectorAll(".gift-option").forEach((option) => {
      option.classList.toggle("selected", option === button);
      option.setAttribute("aria-pressed", option === button ? "true" : "false");
      option.disabled = true;
    });

    const previousScore = state.score;
    const result = scoreResult(gift);
    const reaction = data.reactions[result.reactionType];
    state.pendingEnding = result.ending || null;
    state.score = Math.max(0, Math.min(100, state.score + result.change));
    if (result.change < 0) state.mineCount += 1;
    if (gift.score === 10) state.godGiftCount += 1;
    if (!state.pendingEnding && state.score === 0) state.pendingEnding = "breakup";

    renderScore({ updateVisual: false });

    const event = currentEvent();
    state.history.push({
      year: event.year,
      event: event.title,
      gift: gift.label,
      result: formatChange(result.change, gift)
    });
    if (!event.isTokyo) state.generalEventIndex += 1;

    state.reactionTimer = window.setTimeout(() => {
      elements.reaction.textContent = reaction.girlfriend;
      playReactionAnimations(previousScore);
      elements.boyfriendThought.textContent = reaction.boyfriend;
      state.nextEventTimer = window.setTimeout(advanceAfterReaction, 2000);
    }, 1000);
  }

  function startGame() {
    clearTransitionTimers();
    document.body.classList.remove("intro-active");
    document.body.classList.remove("ending-active");
    document.body.classList.add("game-active");
    state.currentIndex = 0;
    state.generalEventIndex = 0;
    state.nextRingAt = randomRingInterval();
    state.score = INITIAL_SCORE;
    state.mineCount = 0;
    state.godGiftCount = 0;
    elements.mineCount.textContent = "0";
    elements.godGiftCount.textContent = "0";
    elements.mineCountBar.style.width = "0%";
    elements.godGiftCountBar.style.width = "0%";
    state.recentOptionIds = [];
    state.history = [];
    state.pendingEnding = null;
    elements.intro.classList.add("hidden");
    elements.ending.classList.add("hidden");
    elements.game.classList.remove("hidden");
    renderEvent();
  }

  function advanceAfterReaction() {
    if (state.pendingEnding) {
      showEnding();
      return;
    }
    if (state.currentIndex === data.events.length - 1) {
      showEnding();
      return;
    }
    state.currentIndex += 1;
    renderEvent();
  }

  function endingContent(score) {
    return data.endingResults.find((ending) => score >= ending.minScore && score <= ending.maxScore);
  }

  function showEnding() {
    const content = endingContent(state.score);
    document.body.classList.remove("game-active");
    document.body.classList.add("ending-active");
    elements.game.classList.add("hidden");
    elements.ending.classList.remove("hidden");
    elements.endingScore.textContent = state.score;
    elements.endingTitle.textContent = content.type;
    elements.endingDescription.textContent = content.description;
    elements.mineCount.textContent = state.mineCount;
    elements.godGiftCount.textContent = state.godGiftCount;
    elements.mineCountBar.style.width = `${Math.min((state.mineCount / data.events.length) * 100, 100)}%`;
    elements.godGiftCountBar.style.width = `${Math.min((state.godGiftCount / data.events.length) * 100, 100)}%`;
    window.scrollTo(0, 0);
  }

  elements.start.addEventListener("click", startGame);
  elements.playAgain.addEventListener("click", startGame);
  elements.reaction.addEventListener("animationend", () => {
    elements.reaction.classList.remove("reaction-entering");
  });
  elements.meterFill.addEventListener("animationend", () => {
    elements.meterFill.classList.remove("meter-changing");
  });
  elements.eventCard.addEventListener("animationend", () => {
    elements.eventCard.classList.remove("question-entering");
  });
  elements.grid.addEventListener("animationend", () => {
    elements.grid.classList.remove("options-entering");
  });
  elements.boyfriendPanel.addEventListener("animationend", () => {
    elements.boyfriendPanel.classList.remove("options-entering");
  });
})();

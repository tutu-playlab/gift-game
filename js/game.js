(() => {
  const data = window.GIFT_GAME_DATA;
  const INITIAL_SCORE = 30;
  const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;
  const state = {
    currentIndex: 0,
    generalEventIndex: 0,
    nextRingAt: 0,
    score: INITIAL_SCORE,
    options: [],
    recentOptionIds: [],
    history: [],
    isTransitioning: false,
    pendingEnding: null,
    reactionTimer: null,
    nextEventTimer: null
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
    special: document.querySelector("#specialNote"),
    grid: document.querySelector("#giftGrid"),
    score: document.querySelector("#relationshipScore"),
    meter: document.querySelector("#relationshipMeter"),
    reaction: document.querySelector("#girlfriendReaction"),
    boyfriendThought: document.querySelector("#boyfriendThought"),
    endingScore: document.querySelector("#endingScore"),
    endingTitle: document.querySelector("#endingTitle"),
    endingDescription: document.querySelector("#endingDescription")
  };

  function clearTransitionTimers() {
    window.clearTimeout(state.reactionTimer);
    window.clearTimeout(state.nextEventTimer);
    state.reactionTimer = null;
    state.nextEventTimer = null;
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

  function renderScore() {
    elements.score.textContent = state.score;
    elements.meter.value = state.score;
    elements.meter.textContent = `${state.score} / 100`;
    elements.meter.setAttribute("aria-valuetext", `${state.score} / 100`);
  }

  function renderEvent() {
    clearTransitionTimers();
    state.isTransitioning = false;
    state.pendingEnding = null;
    const event = currentEvent();
    elements.icon.setAttribute("aria-label", `${event.title}的女友角色`);
    elements.days.textContent = relationshipDay(event.date);
    elements.lead.textContent = event.isTokyo ? "這次是" : "下禮拜是";
    elements.title.textContent = event.title;
    elements.prompt.textContent = event.isTokyo ? "出差回來，要帶什麼給她？" : "你準備送什麼禮物呢？";
    elements.special.classList.toggle("hidden", !event.isTokyo);
    elements.reaction.classList.add("hidden");
    elements.reaction.textContent = "";
    elements.boyfriendThought.textContent = data.boyfriendThinkingText;
    renderScore();
    state.options = createOptions(event);
    renderOptions();
    window.scrollTo({ top: 0, behavior: "smooth" });
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

    const result = scoreResult(gift);
    const reaction = data.reactions[result.reactionType];
    state.pendingEnding = result.ending || null;
    state.score = Math.max(0, Math.min(100, state.score + result.change));
    if (!state.pendingEnding && state.score === 0) state.pendingEnding = "breakup";

    renderScore();

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
      elements.reaction.classList.remove("hidden");
      elements.boyfriendThought.textContent = reaction.boyfriend;
      elements.reaction.scrollIntoView({ behavior: "smooth", block: "center" });
      state.nextEventTimer = window.setTimeout(advanceAfterReaction, 5000);
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
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  elements.start.addEventListener("click", startGame);
  elements.playAgain.addEventListener("click", startGame);
})();

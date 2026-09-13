(() => {
  const data = window.GIFT_GAME_DATA;
  const state = {
    currentIndex: 0,
    generalEventIndex: 0,
    ringParity: 0,
    options: [],
    history: [],
    isTransitioning: false,
    reactionTimer: null,
    nextEventTimer: null
  };

  const elements = {
    intro: document.querySelector("#introScreen"),
    game: document.querySelector("#gameScreen"),
    ending: document.querySelector("#endingScreen"),
    start: document.querySelector("#startButton"),
    restart: document.querySelector("#restartButton"),
    playAgain: document.querySelector("#playAgainButton"),
    icon: document.querySelector("#eventIcon"),
    type: document.querySelector("#eventType"),
    title: document.querySelector("#eventTitle"),
    prompt: document.querySelector("#eventPrompt"),
    special: document.querySelector("#specialNote"),
    grid: document.querySelector("#giftGrid"),
    selection: document.querySelector("#selectionPanel"),
    selectedGift: document.querySelector("#selectedGift"),
    reaction: document.querySelector("#girlfriendReaction"),
    history: document.querySelector("#historyList")
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

  function currentEvent() {
    return data.events[state.currentIndex];
  }

  function shouldShowRing() {
    return state.generalEventIndex % 2 === state.ringParity;
  }

  function createOptions(event) {
    if (event.isTokyo) return shuffle(data.tokyoGifts);

    const includeRing = shouldShowRing();
    const randomGifts = shuffle(data.generalGifts).slice(0, includeRing ? 3 : 4);
    return shuffle(includeRing ? [...randomGifts, data.ringGift] : randomGifts);
  }

  function renderOptions() {
    elements.grid.replaceChildren();
    state.options.forEach((gift, index) => {
      const button = document.createElement("button");
      button.className = "gift-option";
      button.type = "button";
      button.dataset.gift = gift;
      button.setAttribute("aria-pressed", "false");
      button.innerHTML = `<span class="gift-number">OPTION ${index + 1}</span>${gift}`;
      button.addEventListener("click", () => selectGift(button, gift));
      elements.grid.append(button);
    });
  }

  function renderEvent() {
    clearTransitionTimers();
    state.isTransitioning = false;
    const event = currentEvent();
    elements.icon.textContent = event.icon;
    elements.type.textContent = event.isTokyo ? "額外任務" : "節日任務";
    elements.title.textContent = event.title;
    elements.prompt.textContent = event.isTokyo ? "出差回來，要帶什麼給她？" : "這次要送她什麼？";
    elements.special.classList.toggle("hidden", !event.isTokyo);
    elements.selection.classList.add("hidden");
    state.options = createOptions(event);
    renderOptions();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function selectGift(button, gift) {
    if (state.isTransitioning) return;
    state.isTransitioning = true;

    elements.grid.querySelectorAll(".gift-option").forEach((option) => {
      option.classList.toggle("selected", option === button);
      option.setAttribute("aria-pressed", option === button ? "true" : "false");
      option.disabled = true;
    });
    elements.selectedGift.textContent = gift;
    elements.reaction.textContent = data.reactions[Math.floor(Math.random() * data.reactions.length)];

    const event = currentEvent();
    state.history.push({ year: event.year, event: event.title, gift });
    if (!event.isTokyo) state.generalEventIndex += 1;

    state.reactionTimer = window.setTimeout(() => {
      elements.selection.classList.remove("hidden");
      elements.selection.scrollIntoView({ behavior: "smooth", block: "nearest" });

      state.nextEventTimer = window.setTimeout(advanceAfterReaction, 5000);
    }, 1000);
  }

  function startGame() {
    clearTransitionTimers();
    state.currentIndex = 0;
    state.generalEventIndex = 0;
    state.ringParity = Math.floor(Math.random() * 2);
    state.history = [];
    elements.intro.classList.add("hidden");
    elements.ending.classList.add("hidden");
    elements.game.classList.remove("hidden");
    renderEvent();
  }

  function advanceAfterReaction() {
    if (state.currentIndex === data.events.length - 1) {
      showEnding();
      return;
    }

    state.currentIndex += 1;
    renderEvent();
  }

  function showEnding() {
    elements.game.classList.add("hidden");
    elements.ending.classList.remove("hidden");
    elements.history.replaceChildren();
    state.history.forEach((item) => {
      const row = document.createElement("li");
      const eventLabel = document.createElement("span");
      const giftLabel = document.createElement("strong");
      eventLabel.textContent = `${item.year}・${item.event}`;
      giftLabel.textContent = item.gift;
      row.append(eventLabel, giftLabel);
      elements.history.append(row);
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  elements.start.addEventListener("click", startGame);
  elements.playAgain.addEventListener("click", startGame);
  elements.restart.addEventListener("click", startGame);
})();

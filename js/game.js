(() => {
  const data = window.GIFT_GAME_DATA;
  const INITIAL_SCORE = 30;
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
    score: document.querySelector("#relationshipScore"),
    scoreChange: document.querySelector("#scoreChange"),
    reaction: document.querySelector("#girlfriendReaction"),
    endingIcon: document.querySelector("#endingIcon"),
    endingEyebrow: document.querySelector("#endingEyebrow"),
    endingTitle: document.querySelector("#endingTitle"),
    endingDescription: document.querySelector("#endingDescription"),
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

  function randomRingInterval() {
    return 2 + Math.floor(Math.random() * 2);
  }

  function currentEvent() {
    return data.events[state.currentIndex];
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
    state.options.forEach((gift, index) => {
      const button = document.createElement("button");
      button.className = "gift-option";
      button.type = "button";
      button.dataset.giftId = gift.id;
      button.setAttribute("aria-pressed", "false");
      button.innerHTML = `<span class="gift-number">OPTION ${index + 1}</span>${gift.label}`;
      button.addEventListener("click", () => selectGift(button, gift));
      elements.grid.append(button);
    });
  }

  function renderEvent() {
    clearTransitionTimers();
    state.isTransitioning = false;
    state.pendingEnding = null;
    const event = currentEvent();
    elements.icon.textContent = event.icon;
    elements.type.textContent = event.isTokyo ? "額外任務" : "節日任務";
    elements.title.textContent = event.title;
    elements.prompt.textContent = event.isTokyo ? "出差回來，要帶什麼給她？" : "這次要送她什麼？";
    elements.special.classList.toggle("hidden", !event.isTokyo);
    elements.selection.classList.add("hidden");
    elements.score.textContent = state.score;
    state.options = createOptions(event);
    renderOptions();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function scoreResult(gift) {
    if (gift.isRing) {
      if (state.score > 90) return { change: 0, ending: "proposal", reaction: "她紅著眼眶點點頭：『我願意！』" };
      if (state.score < 60) return { change: 0, ending: "breakup", reaction: "她愣住了：『我們的關係還沒走到這裡吧……』" };
      return { change: -10, reaction: "她收起戒指：『現在還不是時候。』" };
    }

    const reaction = gift.score > 0
      ? "她開心地收下禮物，看得出來你有把她放在心上。"
      : gift.score < 0
        ? "她沉默了一下，看起來對這份禮物不太滿意。"
        : "她收下禮物，表情看起來有些微妙。";
    return { change: gift.score, reaction };
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
    state.pendingEnding = result.ending || null;
    state.score = Math.max(0, Math.min(100, state.score + result.change));
    if (!state.pendingEnding && state.score === 0) state.pendingEnding = "breakup";

    elements.selectedGift.textContent = gift.label;
    elements.scoreChange.textContent = formatChange(result.change, gift);
    elements.reaction.textContent = result.reaction;
    elements.score.textContent = state.score;

    const event = currentEvent();
    state.history.push({
      year: event.year,
      event: event.title,
      gift: gift.label,
      result: formatChange(result.change, gift)
    });
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
      showEnding(state.pendingEnding);
      return;
    }
    if (state.currentIndex === data.events.length - 1) {
      showEnding(state.score < 40 ? "low-score" : state.score < 80 ? "success" : "perfect");
      return;
    }
    state.currentIndex += 1;
    renderEvent();
  }

  function endingContent(endingId) {
    const endings = {
      breakup: { icon: "💔", eyebrow: "GAME OVER", title: "她決定和你分手了", description: `關係值停在 ${state.score} 分。重新挑選禮物，試著挽回這段感情吧。` },
      "low-score": { icon: "🥀", eyebrow: "BAD ENDING", title: "五年後，你們還是分開了", description: `最後關係值是 ${state.score} 分。雖然走完所有事件，感情仍不足以繼續。` },
      success: { icon: "💞", eyebrow: "GOOD ENDING", title: "你們繼續交往下去了！", description: `最後關係值是 ${state.score} 分。你成功通過五年的送禮考驗。` },
      perfect: { icon: "🎁", eyebrow: "PERFECT ENDING", title: "你真的很懂她！", description: `最後關係值是 ${state.score} 分。你們的感情比以前更加甜蜜。` },
      proposal: { icon: "💍", eyebrow: "SPECIAL ENDING", title: "求婚成功！", description: `你在 ${state.score} 分時鼓起勇氣求婚，她答應了！` }
    };
    return endings[endingId];
  }

  function showEnding(endingId) {
    const content = endingContent(endingId);
    elements.game.classList.add("hidden");
    elements.ending.classList.remove("hidden");
    elements.endingIcon.textContent = content.icon;
    elements.endingEyebrow.textContent = content.eyebrow;
    elements.endingTitle.textContent = content.title;
    elements.endingDescription.textContent = content.description;
    elements.history.replaceChildren();
    state.history.forEach((item) => {
      const row = document.createElement("li");
      const eventLabel = document.createElement("span");
      const giftLabel = document.createElement("strong");
      eventLabel.textContent = `${item.year}・${item.event}`;
      giftLabel.textContent = `${item.gift}（${item.result.replace("關係值 ", "")}）`;
      row.append(eventLabel, giftLabel);
      elements.history.append(row);
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  elements.start.addEventListener("click", startGame);
  elements.playAgain.addEventListener("click", startGame);
  elements.restart.addEventListener("click", startGame);
})();

const trailPage = document.querySelector("[data-trail-page]");

if (trailPage) {
  const STORAGE_KEY = "honey-badger-project-trail";
  const TOTAL_STOPS = 6;
  const emptyState = () => ({ done: [], project: null, topics: [], checks: [] });

  const load = () => {
    try {
      return { ...emptyState(), ...JSON.parse(localStorage.getItem(STORAGE_KEY)) };
    } catch {
      return emptyState();
    }
  };

  let state = load();

  const save = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      return true;
    } catch {
      return false;
    }
  };

  const setDone = (stopNumber, isDone) => {
    state.done = state.done.filter((number) => number !== stopNumber);
    if (isDone) state.done.push(stopNumber);
  };

  const topicMessage = (count) => {
    if (count < 3) return `You picked ${count}. Pick at least 3 topics.`;
    if (count > 5) return `You picked ${count}. That is a lot! Try 3 to 5.`;
    return `You picked ${count}. Great choice!`;
  };

  const render = () => {
    trailPage.querySelectorAll("[data-stop]").forEach((stop) => {
      const isDone = state.done.includes(Number(stop.dataset.stop));
      stop.classList.toggle("is-done", isDone);
      stop.querySelector("[data-done-button]").setAttribute("aria-pressed", String(isDone));
    });

    const doneCount = state.done.length;
    trailPage.querySelector("[data-progress]").value = doneCount;
    trailPage.querySelector("[data-progress-text]").textContent = `${doneCount} of ${TOTAL_STOPS} stops done`;
    trailPage.querySelector("[data-badge]").hidden = doneCount < TOTAL_STOPS;

    trailPage.querySelectorAll("[data-project]").forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.project === state.project));
    });
    trailPage.querySelectorAll("[data-project-tip]").forEach((tip) => {
      tip.hidden = tip.dataset.projectTip !== (state.project || "none");
    });

    trailPage.querySelectorAll("[data-topic]").forEach((button) => {
      button.setAttribute("aria-pressed", String(state.topics.includes(button.dataset.topic)));
    });
    trailPage.querySelector("[data-topic-count]").textContent = topicMessage(state.topics.length);

    trailPage.querySelectorAll("[data-check]").forEach((box) => {
      box.checked = state.checks.includes(box.dataset.check);
    });
  };

  const update = () => {
    save();
    render();
  };

  trailPage.querySelectorAll("[data-done-button]").forEach((button) => {
    button.addEventListener("click", () => {
      const stopNumber = Number(button.closest("[data-stop]").dataset.stop);
      setDone(stopNumber, !state.done.includes(stopNumber));
      update();
      if (state.done.length === TOTAL_STOPS) {
        trailPage.querySelector("[data-badge]").scrollIntoView({ behavior: "smooth", block: "center" });
      }
    });
  });

  trailPage.querySelectorAll("[data-project]").forEach((button) => {
    button.addEventListener("click", () => {
      state.project = button.dataset.project;
      setDone(1, true);
      update();
    });
  });

  trailPage.querySelectorAll("[data-topic]").forEach((button) => {
    button.addEventListener("click", () => {
      const topic = button.dataset.topic;
      state.topics = state.topics.includes(topic)
        ? state.topics.filter((picked) => picked !== topic)
        : [...state.topics, topic];
      setDone(2, state.topics.length >= 3 && state.topics.length <= 5);
      update();
    });
  });

  const checkBoxes = trailPage.querySelectorAll("[data-check]");
  checkBoxes.forEach((box) => {
    box.addEventListener("change", () => {
      state.checks = [...checkBoxes].filter((other) => other.checked).map((other) => other.dataset.check);
      setDone(3, state.checks.length === checkBoxes.length);
      update();
    });
  });

  const flipFront = trailPage.querySelector("[data-flip-front]");
  const flipBack = trailPage.querySelector("[data-flip-back]");
  const facts = [...trailPage.querySelectorAll("[data-fact]")];
  let factIndex = 0;

  const showFront = () => {
    flipFront.hidden = false;
    flipBack.hidden = true;
  };

  trailPage.querySelector("[data-hide-fact]").addEventListener("click", () => {
    flipFront.hidden = true;
    flipBack.hidden = false;
    flipBack.querySelector("textarea").focus();
  });

  trailPage.querySelector("[data-show-fact]").addEventListener("click", showFront);

  trailPage.querySelector("[data-next-fact]").addEventListener("click", () => {
    facts[factIndex].hidden = true;
    factIndex = (factIndex + 1) % facts.length;
    facts[factIndex].hidden = false;
    flipBack.querySelector("textarea").value = "";
    showFront();
  });

  const citeOutput = trailPage.querySelector("[data-cite-output]");
  trailPage.querySelector("[data-cite-select]").addEventListener("change", (event) => {
    citeOutput.textContent = `Honey Badger HQ. "${event.target.value}" 2026.`;
  });

  trailPage.querySelectorAll("[data-copy-target]").forEach((button) => {
    const label = button.querySelector("[data-copy-label]");
    const originalLabel = label.textContent;
    button.addEventListener("click", async () => {
      const text = document.getElementById(button.dataset.copyTarget).textContent;
      try {
        await navigator.clipboard.writeText(text);
        label.textContent = "Copied! 🎉";
      } catch {
        label.textContent = "Select the text and copy it";
      }
      setTimeout(() => {
        label.textContent = originalLabel;
      }, 2000);
    });
  });

  trailPage.querySelector("[data-restart]").addEventListener("click", () => {
    state = emptyState();
    update();
    trailPage.scrollIntoView({ behavior: "smooth" });
  });

  render();
}

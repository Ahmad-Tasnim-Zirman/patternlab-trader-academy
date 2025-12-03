// Simple daily quiz prototype.
// One question, multiple options, fake check on submit.
// Emits task:result so progression and streak logic can react.
// Now gated: XP is only awarded once per calendar day.

(function () {
  window.PatternLab = window.PatternLab || {};

  const QUESTION = {
    id: "DQ1",
    text: "You see a series of higher highs and higher lows on the chart. What is this most likely?",
    options: [
      { id: "A", label: "A clear uptrend" },
      { id: "B", label: "A clear downtrend" },
      { id: "C", label: "A sideways range" },
      { id: "D", label: "Random noise" }
    ],
    correctId: "A"
  };

  function todayISO() {
    return new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
  }

  function renderOptions() {
    return QUESTION.options
      .map(function (opt) {
        return `
          <label style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.45rem;font-size:0.86rem;">
            <input type="radio" name="quiz-option" value="${opt.id}">
            <span>${opt.label}</span>
          </label>
        `;
      })
      .join("");
  }

  window.PatternLab.quiz = {
    render() {
      return `
        <div class="content-inner">
          <div class="card">
            <div class="card-glow-edge"></div>
            <div class="card-header">
              <div>
                <div class="card-title">Daily quiz · Candles vs context</div>
                <div class="card-subtitle">
                  Answer at least one question. Any completion counts for today's streak check;
                  XP depends on correctness. XP is awarded once per day.
                </div>
              </div>
            </div>

            <div style="margin-bottom:0.75rem;">
              <div class="stat-label">Question</div>
              <div class="stat-value" style="font-size:0.95rem;">
                ${QUESTION.text}
              </div>
            </div>

            <form id="quiz-form">
              <div style="margin-bottom:0.85rem;">
                ${renderOptions()}
              </div>

              <div style="display:flex;gap:0.5rem;flex-wrap:wrap;">
                <button class="btn btn-primary" type="submit">
                  Submit answer
                </button>
                <a href="#dashboard" class="btn btn-ghost" type="button" data-view="dashboard">
                  Back to dashboard
                </a>
                <div id="quiz-feedback" style="font-size:0.8rem;color:var(--text-muted);margin-left:auto;"></div>
              </div>
            </form>
          </div>
        </div>
      `;
    },

    bindEvents() {
      const form = document.getElementById("quiz-form");
      const feedback = document.getElementById("quiz-feedback");

      if (!form) return;

      form.addEventListener("submit", function (e) {
        e.preventDefault();

        const stateApi = PatternLab.state;
        const currentState = stateApi && stateApi.get ? stateApi.get() : {};
        const today = todayISO();

        const lastDate = currentState.lastDailyQuizDate;
        const count = currentState.dailyQuizCompletedCount || 0;
        const alreadyCompletedToday =
          lastDate === today && count >= 1;

        if (alreadyCompletedToday) {
          if (feedback) {
            feedback.textContent =
              "Daily quiz already completed for today. No additional XP is awarded on repeats.";
          }
          // No XP, no streak tick, no redirect
          return;
        }

        const selected = form.querySelector('input[name="quiz-option"]:checked');
        if (!selected) {
          if (feedback) {
            feedback.textContent = "Select an option before submitting.";
          }
          return;
        }

        const isCorrect = selected.value === QUESTION.correctId;

        // Emit task result for progression engine (XP + streak)
        if (PatternLab.events && PatternLab.progression) {
          PatternLab.events.emit("task:result", {
            type: "dailyQuiz",
            success: isCorrect,
            xpFull: 40,
            xpPartial: 15
          });
        }

        // Mark this daily quiz as completed for today in state
        if (stateApi && typeof stateApi.update === "function") {
          // If date changed since last attempt, reset count to 1; otherwise ensure at least 1
          const newCount = (lastDate === today)
            ? Math.max(count, 1)
            : 1;

          stateApi.update({
            lastDailyQuizDate: today,
            dailyQuizCompletedCount: newCount
          });
        }

        if (feedback) {
          feedback.textContent = isCorrect
            ? "Correct. XP applied, streak day counted. Redirecting to dashboard..."
            : "Not perfect. Partial XP still applied. Redirecting to dashboard...";
        }

        setTimeout(function () {
          window.location.hash = "#dashboard";
        }, 700);
      });
    }
  };
})();

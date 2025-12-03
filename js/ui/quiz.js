// Simple daily quiz prototype.
// One question, multiple options, fake check on submit.
// Emits task:result so progression and streak logic can react.

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
                  XP depends on correctness.
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
                <a href="#dashboard" class="btn btn-ghost" type="button">
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

        const selected = form.querySelector('input[name="quiz-option"]:checked');
        if (!selected) {
          if (feedback) {
            feedback.textContent = "Select an option before submitting.";
          }
          return;
        }

        const isCorrect = selected.value === QUESTION.correctId;

        if (PatternLab.events && PatternLab.progression) {
          PatternLab.events.emit("task:result", {
            type: "dailyQuiz",
            success: isCorrect,
            xpFull: 40,
            xpPartial: 15
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
